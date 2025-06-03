import { storage } from './storage';
import { alphaVantageService } from './alphaVantageService';

interface ComprehensiveAnalysisResult {
  symbol: string;
  success: boolean;
  dataSource: 'fmp' | 'alpha_vantage' | 'failed';
  yearsCovered: number;
  ruleOneMetrics?: {
    salesGrowth: number | null;
    epsGrowth: number | null;
    equityGrowth: number | null;
    fcfGrowth: number | null;
    roic: number | null;
    debtPayoffYears: number | null;
    peRatio: number | null;
    marginOfSafety: number | null;
    stickerPrice: number | null;
  };
  financialHealth?: {
    debtToEquity: number | null;
    currentRatio: number | null;
    quickRatio: number | null;
    interestCoverage: number | null;
    returnOnAssets: number | null;
  };
  technicalAnalysis?: {
    rsi: number | null;
    macd: number | null;
    sma20: number | null;
    sma50: number | null;
    volatility: number | null;
  };
  dividendAnalysis?: {
    dividendYield: number | null;
    payoutRatio: number | null;
    dividendGrowthRate: number | null;
    yearsOfGrowth: number | null;
  };
  error?: string;
}

interface BatchAnalysisProgress {
  totalCompanies: number;
  processed: number;
  successful: number;
  failed: number;
  currentSymbol?: string;
  startTime: Date;
  estimatedCompletion?: Date;
  batchId: string;
}

export class ComprehensiveAnalysisService {
  private currentBatch: BatchAnalysisProgress | null = null;
  private batchResults: ComprehensiveAnalysisResult[] = [];

  /**
   * Start comprehensive analysis for all companies in the database
   */
  async startComprehensiveAnalysis(): Promise<{
    batchId: string;
    totalCompanies: number;
    message: string;
  }> {
    if (this.currentBatch) {
      throw new Error('A batch analysis is already running');
    }

    const allStocks = await storage.getAllStocks();
    const batchId = this.generateBatchId();
    
    this.currentBatch = {
      totalCompanies: allStocks.length,
      processed: 0,
      successful: 0,
      failed: 0,
      startTime: new Date(),
      batchId
    };

    this.batchResults = [];

    // Start processing asynchronously
    this.processAllCompaniesAsync(allStocks, batchId);

    return {
      batchId,
      totalCompanies: allStocks.length,
      message: `Started comprehensive analysis for ${allStocks.length} companies`
    };
  }

  /**
   * Get current batch progress
   */
  getBatchProgress(): BatchAnalysisProgress | null {
    return this.currentBatch;
  }

  /**
   * Get batch results
   */
  getBatchResults(): ComprehensiveAnalysisResult[] {
    return this.batchResults;
  }

  /**
   * Process all companies asynchronously with rate limiting
   */
  private async processAllCompaniesAsync(stocks: any[], batchId: string) {
    const concurrentLimit = 5; // Process 5 companies at a time
    const rateLimitDelay = 200; // 200ms delay between batches

    for (let i = 0; i < stocks.length; i += concurrentLimit) {
      if (!this.currentBatch || this.currentBatch.batchId !== batchId) {
        break; // Batch was cancelled
      }

      const batch = stocks.slice(i, i + concurrentLimit);
      const promises = batch.map(stock => this.analyzeCompany(stock));
      
      const results = await Promise.all(promises);
      
      for (const result of results) {
        this.batchResults.push(result);
        
        if (this.currentBatch) {
          this.currentBatch.processed++;
          if (result.success) {
            this.currentBatch.successful++;
          } else {
            this.currentBatch.failed++;
          }
          
          // Update estimated completion
          const elapsed = Date.now() - this.currentBatch.startTime.getTime();
          const rate = this.currentBatch.processed / elapsed;
          const remaining = this.currentBatch.totalCompanies - this.currentBatch.processed;
          this.currentBatch.estimatedCompletion = new Date(Date.now() + (remaining / rate));
        }
      }

      // Rate limiting delay
      if (i + concurrentLimit < stocks.length) {
        await new Promise(resolve => setTimeout(resolve, rateLimitDelay));
      }
    }

    // Mark batch as complete
    if (this.currentBatch && this.currentBatch.batchId === batchId) {
      console.log(`Comprehensive analysis complete: ${this.currentBatch.successful} successful, ${this.currentBatch.failed} failed`);
      this.currentBatch = null;
    }
  }

  /**
   * Analyze a single company comprehensively
   */
  private async analyzeCompany(stock: any): Promise<ComprehensiveAnalysisResult> {
    const result: ComprehensiveAnalysisResult = {
      symbol: stock.symbol,
      success: false,
      dataSource: 'failed',
      yearsCovered: 0
    };

    try {
      // Update current symbol being processed
      if (this.currentBatch) {
        this.currentBatch.currentSymbol = stock.symbol;
      }

      // Try FMP service first
      let financialData;
      try {
        financialData = await fmpService.getCompanyFinancials(stock.symbol);
        if (financialData && financialData.length > 0) {
          result.dataSource = 'fmp';
        }
      } catch (error) {
        console.log(`FMP failed for ${stock.symbol}, trying Alpha Vantage`);
      }

      // Fallback to Alpha Vantage if FMP fails
      if (!financialData || financialData.length === 0) {
        try {
          const alphaData = await alphaVantageService.getCompanyOverview(stock.symbol);
          if (alphaData) {
            // Convert Alpha Vantage data to compatible format
            financialData = this.convertAlphaVantageData(alphaData);
            result.dataSource = 'alpha_vantage';
          }
        } catch (error) {
          console.log(`Alpha Vantage also failed for ${stock.symbol}`);
        }
      }

      if (!financialData || financialData.length === 0) {
        result.error = 'No financial data available from any source';
        return result;
      }

      result.yearsCovered = financialData.length;

      // Calculate Rule One metrics
      result.ruleOneMetrics = this.calculateRuleOneMetrics(financialData);

      // Calculate financial health metrics
      result.financialHealth = this.calculateFinancialHealth(financialData);

      // Get technical analysis data
      result.technicalAnalysis = await this.getTechnicalAnalysis(stock.symbol);

      // Get dividend analysis
      result.dividendAnalysis = await this.getDividendAnalysis(stock.symbol);

      // Store metrics in database
      await this.storeCompanyMetrics(stock.symbol, result);

      result.success = true;
      return result;

    } catch (error) {
      result.error = error instanceof Error ? error.message : 'Unknown error';
      return result;
    }
  }

  /**
   * Calculate Rule One investment metrics
   */
  private calculateRuleOneMetrics(financialData: any[]): ComprehensiveAnalysisResult['ruleOneMetrics'] {
    if (financialData.length < 5) {
      return {
        salesGrowth: null,
        epsGrowth: null,
        equityGrowth: null,
        fcfGrowth: null,
        roic: null,
        debtPayoffYears: null,
        peRatio: null,
        marginOfSafety: null,
        stickerPrice: null
      };
    }

    const latest = financialData[0];
    const oldest = financialData[financialData.length - 1];
    const years = financialData.length - 1;

    // Calculate growth rates (CAGR)
    const salesGrowth = this.calculateCAGR(
      [oldest.revenue, latest.revenue],
      years
    );

    const epsGrowth = this.calculateCAGR(
      [oldest.eps, latest.eps],
      years
    );

    const equityGrowth = this.calculateCAGR(
      [oldest.totalStockholdersEquity, latest.totalStockholdersEquity],
      years
    );

    const fcfGrowth = this.calculateCAGR(
      [oldest.freeCashFlow, latest.freeCashFlow],
      years
    );

    // Calculate ROIC (Return on Invested Capital)
    const roic = latest.totalStockholdersEquity > 0 ? 
      (latest.netIncome / latest.totalStockholdersEquity) * 100 : null;

    // Calculate debt payoff years
    const debtPayoffYears = latest.freeCashFlow > 0 ? 
      latest.totalDebt / latest.freeCashFlow : null;

    // Calculate PE ratio
    const peRatio = latest.eps > 0 ? latest.price / latest.eps : null;

    // Calculate sticker price using Rule One formula
    const minGrowthRate = Math.min(salesGrowth || 0, epsGrowth || 0, equityGrowth || 0);
    const futureEPS = latest.eps * Math.pow(1 + (minGrowthRate / 100), 10);
    const futurePE = Math.min(peRatio || 15, minGrowthRate * 2);
    const futurePrice = futureEPS * futurePE;
    const stickerPrice = futurePrice / Math.pow(1.15, 10); // 15% discount rate

    // Calculate margin of safety (50% of sticker price)
    const marginOfSafety = stickerPrice ? stickerPrice * 0.5 : null;

    return {
      salesGrowth,
      epsGrowth,
      equityGrowth,
      fcfGrowth,
      roic,
      debtPayoffYears,
      peRatio,
      marginOfSafety,
      stickerPrice
    };
  }

  /**
   * Calculate financial health metrics
   */
  private calculateFinancialHealth(financialData: any[]): ComprehensiveAnalysisResult['financialHealth'] {
    const latest = financialData[0];

    return {
      debtToEquity: latest.totalStockholdersEquity > 0 ? 
        latest.totalDebt / latest.totalStockholdersEquity : null,
      currentRatio: latest.totalCurrentLiabilities > 0 ? 
        latest.totalCurrentAssets / latest.totalCurrentLiabilities : null,
      quickRatio: latest.totalCurrentLiabilities > 0 ? 
        (latest.totalCurrentAssets - latest.inventory) / latest.totalCurrentLiabilities : null,
      interestCoverage: latest.interestExpense > 0 ? 
        latest.operatingIncome / latest.interestExpense : null,
      returnOnAssets: latest.totalAssets > 0 ? 
        (latest.netIncome / latest.totalAssets) * 100 : null
    };
  }

  /**
   * Get technical analysis data
   */
  private async getTechnicalAnalysis(symbol: string): Promise<ComprehensiveAnalysisResult['technicalAnalysis']> {
    try {
      const [rsiData, macdData, smaData] = await Promise.all([
        alphaVantageService.getRSI(symbol).catch(() => null),
        alphaVantageService.getMACD(symbol).catch(() => null),
        alphaVantageService.getSMA(symbol, 'daily', 20).catch(() => null)
      ]);

      return {
        rsi: rsiData && rsiData.length > 0 ? rsiData[0].value : null,
        macd: macdData && macdData.length > 0 ? macdData[0].value : null,
        sma20: smaData && smaData.length > 0 ? smaData[0].value : null,
        sma50: null, // Could add SMA50 call
        volatility: null // Could calculate from price data
      };
    } catch (error) {
      return {
        rsi: null,
        macd: null,
        sma20: null,
        sma50: null,
        volatility: null
      };
    }
  }

  /**
   * Get dividend analysis
   */
  private async getDividendAnalysis(symbol: string): Promise<ComprehensiveAnalysisResult['dividendAnalysis']> {
    try {
      const dividendData = await alphaVantageService.getDividends(symbol);
      
      if (!dividendData || dividendData.length === 0) {
        return {
          dividendYield: null,
          payoutRatio: null,
          dividendGrowthRate: null,
          yearsOfGrowth: null
        };
      }

      // Calculate dividend metrics
      const currentPrice = await this.getCurrentPrice(symbol);
      const annualDividend = dividendData.reduce((sum, div) => sum + div.amount, 0);
      const dividendYield = currentPrice > 0 ? (annualDividend / currentPrice) * 100 : null;

      return {
        dividendYield,
        payoutRatio: null, // Would need EPS data
        dividendGrowthRate: null, // Would need historical comparison
        yearsOfGrowth: dividendData.length
      };
    } catch (error) {
      return {
        dividendYield: null,
        payoutRatio: null,
        dividendGrowthRate: null,
        yearsOfGrowth: null
      };
    }
  }

  /**
   * Store company metrics in database
   */
  private async storeCompanyMetrics(symbol: string, analysis: ComprehensiveAnalysisResult) {
    try {
      // Store in financial_metrics table
      if (analysis.ruleOneMetrics) {
        await storage.createFinancialMetrics({
          symbol,
          year: new Date().getFullYear().toString(),
          revenue: null, // Would need actual revenue data
          netIncome: null,
          totalAssets: null,
          totalDebt: null,
          freeCashFlow: null,
          eps: null,
          totalStockholdersEquity: null,
          // Add Rule One specific metrics
          salesGrowthRate: analysis.ruleOneMetrics.salesGrowth,
          epsGrowthRate: analysis.ruleOneMetrics.epsGrowth,
          equityGrowthRate: analysis.ruleOneMetrics.equityGrowth,
          fcfGrowthRate: analysis.ruleOneMetrics.fcfGrowth,
          roic: analysis.ruleOneMetrics.roic
        });
      }
    } catch (error) {
      console.error(`Failed to store metrics for ${symbol}:`, error);
    }
  }

  /**
   * Convert Alpha Vantage data to compatible format
   */
  private convertAlphaVantageData(alphaData: any): any[] {
    // Convert Alpha Vantage company overview to financial data format
    return [{
      year: new Date().getFullYear(),
      revenue: parseFloat(alphaData.RevenueTTM) || 0,
      netIncome: parseFloat(alphaData.ProfitMargin) * parseFloat(alphaData.RevenueTTM) || 0,
      eps: parseFloat(alphaData.EPS) || 0,
      totalAssets: parseFloat(alphaData.TotalAssets) || 0,
      totalDebt: parseFloat(alphaData.TotalDebt) || 0,
      totalStockholdersEquity: parseFloat(alphaData.BookValue) * parseFloat(alphaData.SharesOutstanding) || 0,
      freeCashFlow: parseFloat(alphaData.OperatingCashflowTTM) || 0,
      price: parseFloat(alphaData.Price) || 0
    }];
  }

  /**
   * Get current stock price
   */
  private async getCurrentPrice(symbol: string): Promise<number> {
    try {
      const stock = await storage.getStock(symbol);
      return stock?.price || 0;
    } catch (error) {
      return 0;
    }
  }

  /**
   * Calculate Compound Annual Growth Rate
   */
  private calculateCAGR(values: (number | null)[], years: number): number | null {
    if (values.length < 2 || years <= 0) return null;
    
    const startValue = values[0];
    const endValue = values[values.length - 1];
    
    if (!startValue || !endValue || startValue <= 0) return null;
    
    return (Math.pow(endValue / startValue, 1 / years) - 1) * 100;
  }

  /**
   * Generate unique batch ID
   */
  private generateBatchId(): string {
    return `batch_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

export const comprehensiveAnalysisService = new ComprehensiveAnalysisService();