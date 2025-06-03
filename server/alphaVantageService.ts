interface NewsItem {
  title: string;
  url: string;
  time_published: string;
  authors: string[];
  summary: string;
  source: string;
  category_within_source: string;
  source_domain: string;
  topics: Array<{
    topic: string;
    relevance_score: string;
  }>;
  overall_sentiment_score: number;
  overall_sentiment_label: string;
  ticker_sentiment: Array<{
    ticker: string;
    relevance_score: string;
    ticker_sentiment_score: string;
    ticker_sentiment_label: string;
  }>;
}

interface DividendRecord {
  exDividendDate: string;
  paymentDate: string;
  recordDate: string;
  declaredDate: string;
  amount: number;
}

interface TechnicalIndicator {
  date: string;
  value: number;
}

export class AlphaVantageService {
  private readonly apiKey = process.env.ALPHA_VANTAGE_API_KEY || "3IP18P3AX39PJ02";
  private readonly baseUrl = "https://www.alphavantage.co/query";

  /**
   * Fetch news and sentiment data for a stock
   */
  async getNewsAndSentiment(symbol: string, limit = 50): Promise<NewsItem[]> {
    try {
      const params = new URLSearchParams({
        function: 'NEWS_SENTIMENT',
        tickers: symbol,
        apikey: this.apiKey,
        limit: limit.toString(),
      });

      const response = await fetch(`${this.baseUrl}?${params}`);
      
      if (!response.ok) {
        throw new Error(`Alpha Vantage API error: ${response.status}`);
      }

      const data = await response.json();
      
      if (data['Error Message']) {
        throw new Error(`Alpha Vantage API error: ${data['Error Message']}`);
      }

      return data.feed || [];
    } catch (error) {
      console.error('Error fetching news and sentiment:', error);
      throw error;
    }
  }

  /**
   * Fetch dividend data for a stock
   */
  async getDividends(symbol: string): Promise<DividendRecord[]> {
    try {
      const params = new URLSearchParams({
        function: 'DIVIDENDS',
        symbol: symbol,
        apikey: this.apiKey,
      });

      const response = await fetch(`${this.baseUrl}?${params}`);
      
      if (!response.ok) {
        throw new Error(`Alpha Vantage API error: ${response.status}`);
      }

      const data = await response.json();
      
      if (data['Error Message']) {
        throw new Error(`Alpha Vantage API error: ${data['Error Message']}`);
      }

      if (!data.data) {
        return [];
      }

      return data.data.map((item: any) => ({
        exDividendDate: item.ex_dividend_date,
        paymentDate: item.payment_date,
        recordDate: item.record_date,
        declaredDate: item.declared_date,
        amount: parseFloat(item.amount),
      }));
    } catch (error) {
      console.error('Error fetching dividends:', error);
      throw error;
    }
  }

  /**
   * Fetch RSI technical indicator
   */
  async getRSI(symbol: string, interval = 'daily', timePeriod = 14): Promise<TechnicalIndicator[]> {
    try {
      const params = new URLSearchParams({
        function: 'RSI',
        symbol: symbol,
        interval: interval,
        time_period: timePeriod.toString(),
        series_type: 'close',
        apikey: this.apiKey,
      });

      const response = await fetch(`${this.baseUrl}?${params}`);
      
      if (!response.ok) {
        throw new Error(`Alpha Vantage API error: ${response.status}`);
      }

      const data = await response.json();
      
      if (data['Error Message']) {
        throw new Error(`Alpha Vantage API error: ${data['Error Message']}`);
      }

      const technicalAnalysis = data[`Technical Analysis: RSI`];
      if (!technicalAnalysis) {
        return [];
      }

      return Object.entries(technicalAnalysis)
        .map(([date, values]: [string, any]) => ({
          date,
          value: parseFloat(values.RSI),
        }))
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .slice(-30); // Last 30 data points
    } catch (error) {
      console.error('Error fetching RSI:', error);
      throw error;
    }
  }

  /**
   * Fetch MACD technical indicator
   */
  async getMACD(symbol: string, interval = 'daily'): Promise<any[]> {
    try {
      const params = new URLSearchParams({
        function: 'MACD',
        symbol: symbol,
        interval: interval,
        series_type: 'close',
        apikey: this.apiKey,
      });

      const response = await fetch(`${this.baseUrl}?${params}`);
      
      if (!response.ok) {
        throw new Error(`Alpha Vantage API error: ${response.status}`);
      }

      const data = await response.json();
      
      if (data['Error Message']) {
        throw new Error(`Alpha Vantage API error: ${data['Error Message']}`);
      }

      const technicalAnalysis = data[`Technical Analysis: MACD`];
      if (!technicalAnalysis) {
        return [];
      }

      return Object.entries(technicalAnalysis)
        .map(([date, values]: [string, any]) => ({
          date,
          macd: parseFloat(values.MACD),
          signal: parseFloat(values.MACD_Signal),
          histogram: parseFloat(values.MACD_Hist),
        }))
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .slice(-30); // Last 30 data points
    } catch (error) {
      console.error('Error fetching MACD:', error);
      throw error;
    }
  }

  /**
   * Fetch company overview data
   */
  async getCompanyOverview(symbol: string): Promise<any> {
    try {
      const response = await fetch(
        `${this.baseUrl}?function=OVERVIEW&symbol=${symbol}&apikey=${this.apiKey}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data['Error Message']) {
        throw new Error(data['Error Message']);
      }

      return data;
    } catch (error) {
      console.error(`Alpha Vantage overview error for ${symbol}:`, error);
      throw error;
    }
  }

  /**
   * Fetch income statement data
   */
  async getIncomeStatement(symbol: string): Promise<any> {
    try {
      const response = await fetch(
        `${this.baseUrl}?function=INCOME_STATEMENT&symbol=${symbol}&apikey=${this.apiKey}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data['Error Message']) {
        throw new Error(data['Error Message']);
      }

      return data.annualReports || data.quarterlyReports || [];
    } catch (error) {
      console.error(`Alpha Vantage income statement error for ${symbol}:`, error);
      throw error;
    }
  }

  /**
   * Fetch balance sheet data
   */
  async getBalanceSheet(symbol: string): Promise<any> {
    try {
      const response = await fetch(
        `${this.baseUrl}?function=BALANCE_SHEET&symbol=${symbol}&apikey=${this.apiKey}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data['Error Message']) {
        throw new Error(data['Error Message']);
      }

      return data.annualReports || data.quarterlyReports || [];
    } catch (error) {
      console.error(`Alpha Vantage balance sheet error for ${symbol}:`, error);
      throw error;
    }
  }

  /**
   * Fetch cash flow data
   */
  async getCashFlow(symbol: string): Promise<any> {
    try {
      const response = await fetch(
        `${this.baseUrl}?function=CASH_FLOW&symbol=${symbol}&apikey=${this.apiKey}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data['Error Message']) {
        throw new Error(data['Error Message']);
      }

      return data.annualReports || data.quarterlyReports || [];
    } catch (error) {
      console.error(`Alpha Vantage cash flow error for ${symbol}:`, error);
      throw error;
    }
  }

  /**
   * Fetch earnings data
   */
  async getEarnings(symbol: string): Promise<any> {
    try {
      const response = await fetch(
        `${this.baseUrl}?function=EARNINGS&symbol=${symbol}&apikey=${this.apiKey}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data['Error Message']) {
        throw new Error(data['Error Message']);
      }

      return data.annualEarnings || data.quarterlyEarnings || [];
    } catch (error) {
      console.error(`Alpha Vantage earnings error for ${symbol}:`, error);
      throw error;
    }
  }

  /**
   * Fetch Simple Moving Average
   */
  async getSMA(symbol: string, interval = 'daily', timePeriod = 20): Promise<TechnicalIndicator[]> {
    try {
      const params = new URLSearchParams({
        function: 'SMA',
        symbol: symbol,
        interval: interval,
        time_period: timePeriod.toString(),
        series_type: 'close',
        apikey: this.apiKey,
      });

      const response = await fetch(`${this.baseUrl}?${params}`);
      
      if (!response.ok) {
        throw new Error(`Alpha Vantage API error: ${response.status}`);
      }

      const data = await response.json();
      
      if (data['Error Message']) {
        throw new Error(`Alpha Vantage API error: ${data['Error Message']}`);
      }

      const technicalAnalysis = data[`Technical Analysis: SMA`];
      if (!technicalAnalysis) {
        return [];
      }

      return Object.entries(technicalAnalysis)
        .map(([date, values]: [string, any]) => ({
          date,
          value: parseFloat(values.SMA),
        }))
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .slice(-30); // Last 30 data points
    } catch (error) {
      console.error('Error fetching SMA:', error);
      throw error;
    }
  }

  /**
   * Fetch daily price data with volume
   */
  async getDailyPrices(symbol: string, outputSize = 'compact'): Promise<any[]> {
    try {
      const params = new URLSearchParams({
        function: 'TIME_SERIES_DAILY',
        symbol: symbol,
        outputsize: outputSize,
        apikey: this.apiKey,
      });

      const response = await fetch(`${this.baseUrl}?${params}`);
      
      if (!response.ok) {
        throw new Error(`Alpha Vantage API error: ${response.status}`);
      }

      const data = await response.json();
      
      if (data['Error Message']) {
        throw new Error(`Alpha Vantage API error: ${data['Error Message']}`);
      }

      const timeSeries = data['Time Series (Daily)'];
      if (!timeSeries) {
        return [];
      }

      return Object.entries(timeSeries)
        .map(([date, values]: [string, any]) => ({
          date,
          open: parseFloat(values['1. open']),
          high: parseFloat(values['2. high']),
          low: parseFloat(values['3. low']),
          close: parseFloat(values['4. close']),
          volume: parseInt(values['5. volume']),
        }))
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .slice(-100); // Last 100 trading days
    } catch (error) {
      console.error('Error fetching daily prices:', error);
      throw error;
    }
  }
}

export const alphaVantageService = new AlphaVantageService();