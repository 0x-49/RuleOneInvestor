import { storage } from './storage';

interface CompanyFinancialData {
  symbol: string;
  overview: any;
  incomeStatement: any[];
  balanceSheet: any[];
  cashFlow: any[];
  earnings: any[];
  technicalData: {
    rsi: number | null;
    sma20: number | null;
    sma50: number | null;
  };
}

interface RuleOneMetrics {
  salesGrowth: number | null;
  epsGrowth: number | null;
  equityGrowth: number | null;
  fcfGrowth: number | null;
  roic: number | null;
  debtPayoffYears: number | null;
  peRatio: number | null;
  marginOfSafety: number | null;
  stickerPrice: number | null;
}

export class AlphaVantageComprehensiveService {
  private readonly apiKey = process.env.ALPHA_VANTAGE_PREMIUM_API_KEY || "3IP18P3AX39PJ02";
  private readonly baseUrl = "https://www.alphavantage.co/query";
  private processingStats = {
    total: 0,
    processed: 0,
    successful: 0,
    failed: 0,
    startTime: new Date(),
    currentSymbol: ''
  };

  /**
   * Start comprehensive analysis for all companies
   */
  async startComprehensiveAnalysis(): Promise<{ message: string; total: number }> {
    const allStocks = await storage.getAllStocks();
    this.processingStats = {
      total: allStocks.length,
      processed: 0,
      successful: 0,
      failed: 0,
      startTime: new Date(),
      currentSymbol: ''
    };

    // Process companies in batches to respect API limits
    this.processCompaniesInBatches(allStocks);

    return {
      message: `Started comprehensive analysis for ${allStocks.length} companies using Alpha Vantage`,
      total: allStocks.length
    };
  }

  /**
   * Get current processing progress
   */
  getProgress() {
    return this.processingStats;
  }

  /**
   * Process companies in batches with rate limiting
   */
  private async processCompaniesInBatches(stocks: any[]) {
    const batchSize = 3; // Alpha Vantage premium allows higher rates
    const delayBetweenCalls = 100; // 100ms delay between API calls

    for (let i = 0; i < stocks.length; i += batchSize) {
      const batch = stocks.slice(i, i + batchSize);
      
      for (const stock of batch) {
        try {
          this.processingStats.currentSymbol = stock.symbol;
          await this.analyzeCompanyComprehensively(stock);
          this.processingStats.successful++;
        } catch (error) {
          console.error(`Failed to analyze ${stock.symbol}:`, error);
          this.processingStats.failed++;
        }
        
        this.processingStats.processed++;
        
        // Rate limiting delay
        await new Promise(resolve => setTimeout(resolve, delayBetweenCalls));
      }

      // Longer delay between batches
      if (i + batchSize < stocks.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    console.log(`Comprehensive analysis complete: ${this.processingStats.successful} successful, ${this.processingStats.failed} failed`);
  }

  /**
   * Analyze a single company comprehensively
   */
  private async analyzeCompanyComprehensively(stock: any) {
    // Get company overview first
    const overview = await this.fetchCompanyOverview(stock.symbol);
    if (!overview || overview.Symbol !== stock.symbol) {
      throw new Error('No company overview data available');
    }

    // Get financial statements
    const [incomeStatement, balanceSheet, earnings] = await Promise.all([
      this.fetchIncomeStatement(stock.symbol),
      this.fetchBalanceSheet(stock.symbol),
      this.fetchEarnings(stock.symbol)
    ]);

    // Get technical data
    const technicalData = await this.fetchTechnicalData(stock.symbol);

    // Calculate Rule One metrics
    const ruleOneMetrics = this.calculateRuleOneMetrics(overview, incomeStatement, balanceSheet, earnings);

    // Store comprehensive data in database
    await this.storeComprehensiveData(stock.symbol, {
      overview,
      ruleOneMetrics,
      technicalData
    });

    // Update stock price and basic info
    await this.updateStockBasicInfo(stock, overview);
  }

  /**
   * Fetch company overview using Alpha Vantage
   */
  private async fetchCompanyOverview(symbol: string): Promise<any> {
    try {
      const url = `${this.baseUrl}?function=OVERVIEW&symbol=${symbol}&apikey=${this.apiKey}`;
      const response = await fetch(url);
      const data = await response.json();
      
      if (data['Error Message'] || data['Note']) {
        throw new Error(data['Error Message'] || data['Note']);
      }
      
      return data;
    } catch (error) {
      console.error(`Overview fetch failed for ${symbol}:`, error);
      throw error;
    }
  }

  /**
   * Fetch income statement
   */
  private async fetchIncomeStatement(symbol: string): Promise<any[]> {
    try {
      const url = `${this.baseUrl}?function=INCOME_STATEMENT&symbol=${symbol}&apikey=${this.apiKey}`;
      const response = await fetch(url);
      const data = await response.json();
      
      if (data['Error Message'] || data['Note']) {
        throw new Error(data['Error Message'] || data['Note']);
      }
      
      return data.annualReports || [];
    } catch (error) {
      console.error(`Income statement fetch failed for ${symbol}:`, error);
      return [];
    }
  }

  /**
   * Fetch balance sheet
   */
  private async fetchBalanceSheet(symbol: string): Promise<any[]> {
    try {
      const url = `${this.baseUrl}?function=BALANCE_SHEET&symbol=${symbol}&apikey=${this.apiKey}`;
      const response = await fetch(url);
      const data = await response.json();
      
      if (data['Error Message'] || data['Note']) {
        throw new Error(data['Error Message'] || data['Note']);
      }
      
      return data.annualReports || [];
    } catch (error) {
      console.error(`Balance sheet fetch failed for ${symbol}:`, error);
      return [];
    }
  }

  /**
   * Fetch earnings data
   */
  private async fetchEarnings(symbol: string): Promise<any[]> {
    try {
      const url = `${this.baseUrl}?function=EARNINGS&symbol=${symbol}&apikey=${this.apiKey}`;
      const response = await fetch(url);
      const data = await response.json();
      
      if (data['Error Message'] || data['Note']) {
        throw new Error(data['Error Message'] || data['Note']);
      }
      
      return data.annualEarnings || [];
    } catch (error) {
      console.error(`Earnings fetch failed for ${symbol}:`, error);
      return [];
    }
  }

  /**
   * Fetch technical analysis data
   */
  private async fetchTechnicalData(symbol: string): Promise<any> {
    try {
      // Fetch RSI and SMA data with delays
      const rsi = await this.fetchRSI(symbol);
      await new Promise(resolve => setTimeout(resolve, 200));
      
      const sma20 = await this.fetchSMA(symbol, 20);
      await new Promise(resolve => setTimeout(resolve, 200));
      
      const sma50 = await this.fetchSMA(symbol, 50);
      
      return {
        rsi: rsi?.[0]?.value || null,
        sma20: sma20?.[0]?.value || null,
        sma50: sma50?.[0]?.value || null
      };
    } catch (error) {
      return { rsi: null, sma20: null, sma50: null };
    }
  }

  /**
   * Fetch RSI data
   */
  private async fetchRSI(symbol: string): Promise<any[]> {
    try {
      const url = `${this.baseUrl}?function=RSI&symbol=${symbol}&interval=daily&time_period=14&series_type=close&apikey=${this.apiKey}`;
      const response = await fetch(url);
      const data = await response.json();
      
      const technicalAnalysis = data['Technical Analysis: RSI'];
      if (!technicalAnalysis) return [];
      
      return Object.entries(technicalAnalysis).map(([date, values]: [string, any]) => ({
        date,
        value: parseFloat(values.RSI)
      }));
    } catch (error) {
      return [];
    }
  }

  /**
   * Fetch SMA data
   */
  private async fetchSMA(symbol: string, timePeriod: number): Promise<any[]> {
    try {
      const url = `${this.baseUrl}?function=SMA&symbol=${symbol}&interval=daily&time_period=${timePeriod}&series_type=close&apikey=${this.apiKey}`;
      const response = await fetch(url);
      const data = await response.json();
      
      const technicalAnalysis = data['Technical Analysis: SMA'];
      if (!technicalAnalysis) return [];
      
      return Object.entries(technicalAnalysis).map(([date, values]: [string, any]) => ({
        date,
        value: parseFloat(values.SMA)
      }));
    } catch (error) {
      return [];
    }
  }

  /**
   * Calculate Rule One investment metrics
   */
  private calculateRuleOneMetrics(overview: any, incomeStatement: any[], balanceSheet: any[], earnings: any[]): RuleOneMetrics {
    try {
      // Use available data to calculate metrics
      const currentPrice = parseFloat(overview.Price) || 0;
      const eps = parseFloat(overview.EPS) || 0;
      const peRatio = parseFloat(overview.PERatio) || 0;
      const bookValue = parseFloat(overview.BookValue) || 0;
      const roe = parseFloat(overview.ReturnOnEquityTTM) || 0;
      
      // Calculate growth rates if we have historical data
      let salesGrowth = null;
      let epsGrowth = null;
      let equityGrowth = null;
      
      if (incomeStatement.length >= 2) {
        const latestRevenue = parseFloat(incomeStatement[0]?.totalRevenue) || 0;
        const oldestRevenue = parseFloat(incomeStatement[incomeStatement.length - 1]?.totalRevenue) || 0;
        if (latestRevenue > 0 && oldestRevenue > 0) {
          const years = incomeStatement.length - 1;
          salesGrowth = (Math.pow(latestRevenue / oldestRevenue, 1 / years) - 1) * 100;
        }
      }

      if (earnings.length >= 2) {
        const latestEPS = parseFloat(earnings[0]?.reportedEPS) || 0;
        const oldestEPS = parseFloat(earnings[earnings.length - 1]?.reportedEPS) || 0;
        if (latestEPS > 0 && oldestEPS > 0) {
          const years = earnings.length - 1;
          epsGrowth = (Math.pow(latestEPS / oldestEPS, 1 / years) - 1) * 100;
        }
      }

      // Calculate sticker price using Rule One formula
      const minGrowthRate = Math.min(salesGrowth || 0, epsGrowth || 0);
      const futureEPS = eps * Math.pow(1 + Math.max(minGrowthRate, 0) / 100, 10);
      const futurePE = Math.min(peRatio || 15, Math.max(minGrowthRate, 0) * 2);
      const futurePrice = futureEPS * futurePE;
      const stickerPrice = futurePrice > 0 ? futurePrice / Math.pow(1.15, 10) : null;
      const marginOfSafety = stickerPrice ? stickerPrice * 0.5 : null;

      return {
        salesGrowth,
        epsGrowth,
        equityGrowth,
        fcfGrowth: null, // Would need cash flow data
        roic: roe,
        debtPayoffYears: null, // Would need debt and cash flow data
        peRatio,
        marginOfSafety,
        stickerPrice
      };
    } catch (error) {
      console.error('Error calculating Rule One metrics:', error);
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
  }

  /**
   * Store comprehensive data in database
   */
  private async storeComprehensiveData(symbol: string, data: any) {
    try {
      const stock = await storage.getStock(symbol);
      if (!stock) return;

      // Store financial metrics
      if (data.ruleOneMetrics) {
        await storage.createFinancialMetrics({
          stockId: stock.id,
          year: new Date().getFullYear().toString(),
          revenue: parseFloat(data.overview.RevenueTTM) || null,
          earnings: parseFloat(data.overview.GrossProfitTTM) || null,
          freeCashFlow: parseFloat(data.overview.OperatingCashflowTTM) || null,
          bookValue: parseFloat(data.overview.BookValue) || null,
          eps: parseFloat(data.overview.EPS) || null,
          roic: data.ruleOneMetrics.roic,
          debt: parseFloat(data.overview.TotalDebt) || null,
          salesGrowthRate: data.ruleOneMetrics.salesGrowth,
          epsGrowthRate: data.ruleOneMetrics.epsGrowth,
          equityGrowthRate: data.ruleOneMetrics.equityGrowth,
          fcfGrowthRate: data.ruleOneMetrics.fcfGrowth
        });
      }
    } catch (error) {
      console.error(`Failed to store data for ${symbol}:`, error);
    }
  }

  /**
   * Update stock basic information
   */
  private async updateStockBasicInfo(stock: any, overview: any) {
    try {
      const price = parseFloat(overview.Price) || 0;
      const change = parseFloat(overview.Change) || 0;
      const changePercent = parseFloat(overview.ChangePercent?.replace('%', '')) || 0;
      const marketCap = overview.MarketCapitalization || null;

      await storage.updateStock(stock.symbol, {
        price,
        change,
        changePercent,
        marketCap
      });
    } catch (error) {
      console.error(`Failed to update stock info for ${stock.symbol}:`, error);
    }
  }
}

export const alphaVantageComprehensiveService = new AlphaVantageComprehensiveService();