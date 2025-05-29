import { financialDataService } from "./financialDataService";
import { deepSearchAgent } from "./deepSearchAgent";
import { storage } from "./storage";
import { InsertStock, InsertFinancialMetrics } from "@shared/schema";

interface CompanyData {
  symbol: string;
  name: string;
  exchange: string;
  marketCap?: string;
  logo?: string;
}

interface BatchProgress {
  total: number;
  processed: number;
  successful: number;
  failed: number;
  currentSymbol?: string;
  startTime: Date;
  estimatedCompletion?: Date;
}

interface CompanyAnalysisResult {
  symbol: string;
  success: boolean;
  dataSource: 'api' | 'deep_search' | 'failed';
  yearsOfData: number;
  ruleOneMetrics?: {
    salesGrowth: number | null;
    epsGrowth: number | null;
    equityGrowth: number | null;
    fcfGrowth: number | null;
    roic: number | null;
    debtPayoffYears: number | null;
  };
  error?: string;
}

export class BatchAnalysisService {
  private currentBatch: BatchProgress | null = null;
  private batchResults: CompanyAnalysisResult[] = [];

  /**
   * Process all companies in the provided list
   */
  async processBatchAnalysis(companies: CompanyData[]): Promise<{
    batchId: string;
    progress: BatchProgress;
  }> {
    const batchId = this.generateBatchId();
    
    this.currentBatch = {
      total: companies.length,
      processed: 0,
      successful: 0,
      failed: 0,
      startTime: new Date()
    };

    this.batchResults = [];

    // Process companies asynchronously
    this.processCompaniesAsync(companies, batchId);

    return {
      batchId,
      progress: this.currentBatch
    };
  }

  /**
   * Get current batch progress
   */
  getBatchProgress(): BatchProgress | null {
    return this.currentBatch;
  }

  /**
   * Get batch results
   */
  getBatchResults(): CompanyAnalysisResult[] {
    return this.batchResults;
  }

  /**
   * Process companies asynchronously with rate limiting
   */
  private async processCompaniesAsync(companies: CompanyData[], batchId: string) {
    const BATCH_SIZE = 1; // Process 1 company at a time to ensure data quality
    const DELAY_BETWEEN_BATCHES = 8000; // 8 second delay between companies

    for (let i = 0; i < companies.length; i += BATCH_SIZE) {
      const batch = companies.slice(i, i + BATCH_SIZE);
      
      // Process batch in parallel
      const batchPromises = batch.map(company => this.processCompany(company));
      const batchResults = await Promise.allSettled(batchPromises);

      // Update progress and results
      batchResults.forEach((result, index) => {
        const company = batch[index];
        this.currentBatch!.processed++;
        this.currentBatch!.currentSymbol = company.symbol;

        if (result.status === 'fulfilled' && result.value.success) {
          this.currentBatch!.successful++;
          this.batchResults.push(result.value);
        } else {
          this.currentBatch!.failed++;
          this.batchResults.push({
            symbol: company.symbol,
            success: false,
            dataSource: 'failed',
            yearsOfData: 0,
            error: result.status === 'rejected' ? result.reason?.message : 'Analysis failed'
          });
        }
      });

      // Update estimated completion time
      const avgTimePerCompany = (Date.now() - this.currentBatch!.startTime.getTime()) / this.currentBatch!.processed;
      const remainingCompanies = this.currentBatch!.total - this.currentBatch!.processed;
      this.currentBatch!.estimatedCompletion = new Date(Date.now() + (avgTimePerCompany * remainingCompanies));

      console.log(`Processed batch ${Math.floor(i / BATCH_SIZE) + 1}, ${this.currentBatch!.processed}/${this.currentBatch!.total} companies complete`);

      // Rate limiting delay
      if (i + BATCH_SIZE < companies.length) {
        await new Promise(resolve => setTimeout(resolve, DELAY_BETWEEN_BATCHES));
      }
    }

    console.log(`Batch analysis complete: ${this.currentBatch!.successful}/${this.currentBatch!.total} companies processed successfully`);
  }

  /**
   * Process a single company and calculate Rule One metrics
   */
  private async processCompany(company: CompanyData): Promise<CompanyAnalysisResult> {
    try {
      console.log(`Processing ${company.symbol} - ${company.name}`);

      // Step 1: Get or create stock record
      let stock = await storage.getStockBySymbol(company.symbol);
      if (!stock) {
        const stockData = await financialDataService.fetchStockData(company.symbol);
        if (stockData) {
          stock = await storage.createStock(stockData);
        } else {
          // Create basic stock record even if API fails
          stock = await storage.createStock({
            symbol: company.symbol,
            name: company.name,
            price: 0,
            change: 0,
            changePercent: 0
          });
        }
      }

      // Step 2: Get financial metrics - first check existing, then fetch from API if needed
      let metrics = await storage.getFinancialMetrics(stock.id);
      let dataSource: 'api' | 'deep_search' = 'api';

      // If no stored metrics, fetch from API first
      if (metrics.length === 0) {
        console.log(`No stored metrics for ${company.symbol}, fetching from API...`);
        const apiMetrics = await financialDataService.fetchFinancialMetrics(company.symbol, stock.id);
        
        if (apiMetrics.length > 0) {
          // Store API results
          for (const metric of apiMetrics) {
            await storage.createFinancialMetrics(metric);
          }
          // Get the stored metrics with IDs
          metrics = await storage.getFinancialMetrics(stock.id);
          console.log(`Stored ${apiMetrics.length} years of API data for ${company.symbol}`);
        }
      }

      // If we still don't have sufficient data (less than 7 years), try deep search
      if (metrics.length < 7) {
        console.log(`Insufficient API data for ${company.symbol}, attempting deep search...`);
        
        const deepSearchMetrics = await deepSearchAgent.extractFinancialDataForStock(company.symbol, stock.id);
        
        if (deepSearchMetrics.length > 0) {
          // Store deep search results
          for (const metric of deepSearchMetrics) {
            await storage.createFinancialMetrics(metric);
          }
          // Get updated metrics with IDs
          metrics = await storage.getFinancialMetrics(stock.id);
          dataSource = 'deep_search';
        }
      }

      // Step 3: Calculate Rule One metrics
      const ruleOneMetrics = this.calculateRuleOneMetrics(metrics);

      return {
        symbol: company.symbol,
        success: true,
        dataSource,
        yearsOfData: metrics.length,
        ruleOneMetrics
      };

    } catch (error) {
      console.error(`Failed to process ${company.symbol}:`, error);
      return {
        symbol: company.symbol,
        success: false,
        dataSource: 'failed',
        yearsOfData: 0,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Calculate Rule One investment metrics from financial data
   */
  private calculateRuleOneMetrics(metrics: InsertFinancialMetrics[]) {
    if (metrics.length < 3) {
      return {
        salesGrowth: null,
        epsGrowth: null,
        equityGrowth: null,
        fcfGrowth: null,
        roic: null,
        debtPayoffYears: null
      };
    }

    // Sort by year
    const sortedMetrics = metrics.sort((a, b) => parseInt(a.year) - parseInt(b.year));
    
    // Calculate compound annual growth rates (CAGR)
    const salesGrowth = this.calculateCAGR(
      sortedMetrics.map(m => m.revenue).filter(v => v !== null && v !== undefined) as number[],
      sortedMetrics.length
    );

    const epsGrowth = this.calculateCAGR(
      sortedMetrics.map(m => m.eps).filter(v => v !== null && v !== undefined) as number[],
      sortedMetrics.length
    );

    const equityGrowth = this.calculateCAGR(
      sortedMetrics.map(m => m.bookValue).filter(v => v !== null && v !== undefined) as number[],
      sortedMetrics.length
    );

    const fcfGrowth = this.calculateCAGR(
      sortedMetrics.map(m => m.freeCashFlow).filter(v => v !== null && v !== undefined) as number[],
      sortedMetrics.length
    );

    // Calculate average ROIC
    const roicValues = sortedMetrics.map(m => m.roic).filter(Boolean);
    const roic = roicValues.length > 0 
      ? roicValues.reduce((sum, val) => (sum || 0) + (val || 0), 0)! / roicValues.length 
      : null;

    // Calculate debt payoff years (most recent data)
    const latestMetrics = sortedMetrics[sortedMetrics.length - 1];
    const debtPayoffYears = latestMetrics?.debt && latestMetrics?.freeCashFlow && latestMetrics.freeCashFlow > 0
      ? latestMetrics.debt / latestMetrics.freeCashFlow
      : null;

    return {
      salesGrowth,
      epsGrowth,
      equityGrowth,
      fcfGrowth,
      roic,
      debtPayoffYears
    };
  }

  /**
   * Calculate Compound Annual Growth Rate
   */
  private calculateCAGR(values: (number | null)[], years: number): number | null {
    const validValues = values.filter(v => v !== null && v > 0) as number[];
    
    if (validValues.length < 2) return null;

    const firstValue = validValues[0];
    const lastValue = validValues[validValues.length - 1];
    const periods = validValues.length - 1;

    if (firstValue <= 0 || lastValue <= 0 || periods <= 0) return null;

    return (Math.pow(lastValue / firstValue, 1 / periods) - 1) * 100;
  }

  /**
   * Parse market cap string to number
   */
  private parseMarketCap(marketCapStr?: string): number | null {
    if (!marketCapStr) return null;
    
    const numStr = marketCapStr.replace(/[^\d.]/g, '');
    const num = parseFloat(numStr);
    
    if (isNaN(num)) return null;
    
    if (marketCapStr.includes('B')) return num * 1000000000;
    if (marketCapStr.includes('M')) return num * 1000000;
    if (marketCapStr.includes('K')) return num * 1000;
    
    return num;
  }

  /**
   * Generate unique batch ID
   */
  private generateBatchId(): string {
    return `batch_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

export const batchAnalysisService = new BatchAnalysisService();