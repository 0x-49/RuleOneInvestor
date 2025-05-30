import { Stock, FinancialMetrics, InsertStock, InsertFinancialMetrics } from "@shared/schema";
import { deepSearchAgent } from "./deepSearchAgent";

interface YahooFinanceResponse {
  chart: {
    result: Array<{
      meta: {
        symbol: string;
        regularMarketPrice: number;
        chartPreviousClose: number;
        currency: string;
        exchangeName: string;
      };
    }>;
  };
}

interface YahooFinancialData {
  quoteSummary: {
    result: Array<{
      price: {
        regularMarketPrice: { raw: number };
        regularMarketChange: { raw: number };
        regularMarketChangePercent: { raw: number };
      };
      summaryProfile: {
        longBusinessSummary: string;
      };
      financialData: {
        totalRevenue: { raw: number };
        totalCash: { raw: number };
        totalDebt: { raw: number };
        freeCashflow: { raw: number };
        operatingCashflow: { raw: number };
        returnOnEquity: { raw: number };
      };
      defaultKeyStatistics: {
        trailingEps: { raw: number };
        bookValue: { raw: number };
        enterpriseValue: { raw: number };
      };
      incomeStatementHistory: {
        incomeStatementHistory: Array<{
          endDate: { raw: number };
          totalRevenue: { raw: number };
          netIncome: { raw: number };
        }>;
      };
      cashflowStatementHistory: {
        cashflowStatements: Array<{
          endDate: { raw: number };
          freeCashflow: { raw: number };
        }>;
      };
      balanceSheetHistory: {
        balanceSheetStatements: Array<{
          endDate: { raw: number };
          totalStockholderEquity: { raw: number };
          totalDebt: { raw: number };
        }>;
      };
    }>;
  };
}

interface FMPResponse {
  symbol: string;
  price: number;
  changesPercentage: number;
  change: number;
  dayLow: number;
  dayHigh: number;
  yearHigh: number;
  yearLow: number;
  marketCap: number;
  priceAvg50: number;
  priceAvg200: number;
  volume: number;
  avgVolume: number;
  exchange: string;
  open: number;
  previousClose: number;
  eps: number;
  pe: number;
  earningsAnnouncement: string;
  sharesOutstanding: number;
  timestamp: number;
}

interface FMPFinancialData {
  date: string;
  symbol: string;
  reportedCurrency: string;
  cik: string;
  fillingDate: string;
  acceptedDate: string;
  calendarYear: string;
  period: string;
  revenue: number;
  costOfRevenue: number;
  grossProfit: number;
  grossProfitRatio: number;
  researchAndDevelopmentExpenses: number;
  generalAndAdministrativeExpenses: number;
  sellingAndMarketingExpenses: number;
  sellingGeneralAndAdministrativeExpenses: number;
  otherExpenses: number;
  operatingExpenses: number;
  costAndExpenses: number;
  interestIncome: number;
  interestExpense: number;
  depreciationAndAmortization: number;
  ebitda: number;
  ebitdaratio: number;
  operatingIncome: number;
  operatingIncomeRatio: number;
  totalOtherIncomeExpensesNet: number;
  incomeBeforeTax: number;
  incomeBeforeTaxRatio: number;
  incomeTaxExpense: number;
  netIncome: number;
  netIncomeRatio: number;
  eps: number;
  epsdiluted: number;
  weightedAverageShsOut: number;
  weightedAverageShsOutDil: number;
  link: string;
  finalLink: string;
}

interface FMPCashFlowData {
  date: string;
  symbol: string;
  reportedCurrency: string;
  cik: string;
  fillingDate: string;
  acceptedDate: string;
  calendarYear: string;
  period: string;
  netIncome: number;
  depreciationAndAmortization: number;
  deferredIncomeTax: number;
  stockBasedCompensation: number;
  changeInWorkingCapital: number;
  accountsReceivables: number;
  inventory: number;
  accountsPayables: number;
  otherWorkingCapital: number;
  otherNonCashItems: number;
  netCashProvidedByOperatingActivities: number;
  investmentsInPropertyPlantAndEquipment: number;
  acquisitionsNet: number;
  purchasesOfInvestments: number;
  salesMaturitiesOfInvestments: number;
  otherInvestingActivites: number;
  netCashUsedForInvestingActivites: number;
  debtRepayment: number;
  commonStockIssued: number;
  commonStockRepurchased: number;
  dividendsPaid: number;
  otherFinancingActivites: number;
  netCashUsedProvidedByFinancingActivities: number;
  effectOfForexChangesOnCash: number;
  netChangeInCash: number;
  cashAtEndOfPeriod: number;
  cashAtBeginningOfPeriod: number;
  operatingCashFlow: number;
  capitalExpenditure: number;
  freeCashFlow: number;
  link: string;
  finalLink: string;
}

interface FMPBalanceSheetData {
  date: string;
  symbol: string;
  reportedCurrency: string;
  cik: string;
  fillingDate: string;
  acceptedDate: string;
  calendarYear: string;
  period: string;
  cashAndCashEquivalents: number;
  shortTermInvestments: number;
  cashAndShortTermInvestments: number;
  netReceivables: number;
  inventory: number;
  otherCurrentAssets: number;
  totalCurrentAssets: number;
  propertyPlantEquipmentNet: number;
  goodwill: number;
  intangibleAssets: number;
  goodwillAndIntangibleAssets: number;
  longTermInvestments: number;
  taxAssets: number;
  otherNonCurrentAssets: number;
  totalNonCurrentAssets: number;
  otherAssets: number;
  totalAssets: number;
  accountPayables: number;
  shortTermDebt: number;
  taxPayables: number;
  deferredRevenue: number;
  otherCurrentLiabilities: number;
  totalCurrentLiabilities: number;
  longTermDebt: number;
  deferredRevenueNonCurrent: number;
  deferredTaxLiabilitiesNonCurrent: number;
  otherNonCurrentLiabilities: number;
  totalNonCurrentLiabilities: number;
  otherLiabilities: number;
  capitalLeaseObligations: number;
  totalLiabilities: number;
  preferredStock: number;
  commonStock: number;
  retainedEarnings: number;
  accumulatedOtherComprehensiveIncomeLoss: number;
  othertotalStockholdersEquity: number;
  totalStockholdersEquity: number;
  totalEquity: number;
  totalLiabilitiesAndStockholdersEquity: number;
  minorityInterest: number;
  totalLiabilitiesAndTotalEquity: number;
  totalInvestments: number;
  totalDebt: number;
  netDebt: number;
  link: string;
  finalLink: string;
}

export class FinancialDataService {
  private readonly FMP_API_KEY = process.env.FMP_API_KEY || "LKODerELb8EZDzg1tl275H8MQoupFnY1";
  private readonly FMP_BASE_URL = "https://financialmodelingprep.com/api/v3";
  private readonly ALPHA_VANTAGE_API_KEY = process.env.ALPHA_VANTAGE_API_KEY || "WXNYFQPLJCO2ECMN";
  private readonly ALPHA_VANTAGE_BASE_URL = "https://www.alphavantage.co/query";

  async fetchStockData(symbol: string): Promise<InsertStock | null> {
    try {
      // Try Yahoo Finance first
      const yahooData = await this.fetchYahooStockData(symbol);
      if (yahooData) return yahooData;

      // Fallback to Financial Modeling Prep
      const fmpData = await this.fetchFMPStockData(symbol);
      return fmpData;
    } catch (error) {
      console.error(`Error fetching stock data for ${symbol}:`, error);
      return null;
    }
  }

  private isHighPriorityStock(symbol: string): boolean {
    // Focus Alpha Vantage usage on major US stocks most likely to have data
    const highPrioritySymbols = [
      'AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA', 'META', 'NVDA', 'BRK.B', 
      'JNJ', 'V', 'WMT', 'PG', 'MA', 'HD', 'UNH', 'DIS', 'BAC', 'ADBE'
    ];
    return highPrioritySymbols.includes(symbol);
  }

  async fetchFinancialMetrics(symbol: string, stockId: number, useDeepSearch: boolean = false): Promise<InsertFinancialMetrics[]> {
    try {
      // Skip FMP if we know it's over limit to save API calls
      // Try Yahoo Finance first (most generous free tier)
      console.log(`Fetching financial metrics for ${symbol} from Yahoo Finance...`);
      const yahooMetrics = await this.fetchYahooFinancialMetrics(symbol, stockId);
      if (yahooMetrics && yahooMetrics.length >= 5) { // Reduced threshold for Yahoo
        console.log(`✅ Got ${yahooMetrics.length} years of data from Yahoo for ${symbol}`);
        return yahooMetrics;
      }

      // Skip Alpha Vantage to preserve daily limit
      console.log(`⚠️ Skipping Alpha Vantage for ${symbol} to preserve daily API limit`);

      // Skip FMP to avoid hitting paid limits
      console.log(`⚠️ Skipping FMP for ${symbol} to avoid API costs`);
      const fmpMetrics: InsertFinancialMetrics[] = [];
      if (fmpMetrics && fmpMetrics.length >= 5) {
        console.log(`✅ Got ${fmpMetrics.length} years of data from FMP for ${symbol}`);
        return fmpMetrics;
      }

      // If deep search is requested and API data is insufficient, try AI extraction from SEC filings
      if (useDeepSearch) {
        console.log(`🔍 API data insufficient for ${symbol}. Attempting deep search from SEC filings...`);
        try {
          const deepSearchMetrics = await deepSearchAgent.extractFinancialDataForStock(symbol, stockId);
          if (deepSearchMetrics.length > 0) {
            console.log(`✅ Deep search found ${deepSearchMetrics.length} years of authentic data from SEC filings for ${symbol}`);
            return deepSearchMetrics;
          }
        } catch (error) {
          console.warn(`Deep search failed for ${symbol}:`, error instanceof Error ? error.message : error);
        }
      }

      console.warn(`❌ No reliable financial data found for ${symbol}`);
      return [];
    } catch (error) {
      console.error(`Error fetching financial metrics for ${symbol}:`, error);
      return [];
    }
  }

  private async fetchYahooStockData(symbol: string): Promise<InsertStock | null> {
    try {
      const response = await fetch(
        `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?region=US&lang=en-US&includePrePost=false&interval=1d&useYfid=true&range=1d`
      );
      
      if (!response.ok) return null;
      
      const data: YahooFinanceResponse = await response.json();
      const result = data.chart.result[0];
      
      if (!result) return null;

      const currentPrice = result.meta.regularMarketPrice;
      const previousClose = result.meta.chartPreviousClose;
      const change = currentPrice - previousClose;
      const changePercent = (change / previousClose) * 100;

      // Get company name from profile
      const profileResponse = await fetch(
        `https://query1.finance.yahoo.com/v10/finance/quoteSummary/${symbol}?modules=summaryProfile,price`
      );
      
      let companyName = symbol;
      if (profileResponse.ok) {
        const profileData = await profileResponse.json();
        const profile = profileData.quoteSummary?.result?.[0]?.summaryProfile;
        if (profile && profile.longBusinessSummary) {
          // Extract company name from the beginning of business summary
          companyName = profile.longBusinessSummary.split(' is ')[0] || symbol;
        }
      }

      return {
        symbol,
        name: companyName,
        price: currentPrice,
        change,
        changePercent
      };
    } catch (error) {
      console.error(`Yahoo Finance error for ${symbol}:`, error);
      return null;
    }
  }

  private async fetchFMPStockData(symbol: string): Promise<InsertStock | null> {
    try {
      const response = await fetch(
        `${this.FMP_BASE_URL}/quote/${symbol}?apikey=${this.FMP_API_KEY}`
      );
      
      if (!response.ok) return null;
      
      const data: FMPResponse[] = await response.json();
      if (!data || data.length === 0) return null;
      
      const stock = data[0];
      
      return {
        symbol: stock.symbol,
        name: stock.symbol, // FMP doesn't always provide company name in quote endpoint
        price: stock.price,
        change: stock.change,
        changePercent: stock.changesPercentage
      };
    } catch (error) {
      console.error(`FMP error for ${symbol}:`, error);
      return null;
    }
  }

  private async fetchYahooFinancialMetrics(symbol: string, stockId: number): Promise<InsertFinancialMetrics[]> {
    try {
      // Normalize symbol for Yahoo Finance
      const normalizedSymbol = this.normalizeSymbolForYahoo(symbol);
      console.log(`Trying Yahoo Finance with symbol: ${normalizedSymbol}`);
      
      // Add delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const response = await fetch(
        `https://query1.finance.yahoo.com/v10/finance/quoteSummary/${normalizedSymbol}?modules=incomeStatementHistory,cashflowStatementHistory,balanceSheetHistory,defaultKeyStatistics,financialData`
      );
      
      if (!response.ok) {
        console.log(`Yahoo Finance returned ${response.status} for ${normalizedSymbol}`);
        return [];
      }
      
      const data: YahooFinancialData = await response.json();
      const result = data.quoteSummary?.result?.[0];
      
      if (!result) {
        console.log(`No Yahoo Finance data for ${normalizedSymbol}`);
        return [];
      }

      const metrics: InsertFinancialMetrics[] = [];
      
      // Process historical data
      const incomeStatements = result.incomeStatementHistory?.incomeStatementHistory || [];
      const cashflowStatements = result.cashflowStatementHistory?.cashflowStatements || [];
      const balanceSheets = result.balanceSheetHistory?.balanceSheetStatements || [];

      // Get available years of data
      console.log(`Yahoo Finance data for ${normalizedSymbol}: Found ${incomeStatements.length} income statements`);
      
      for (let i = 0; i < Math.min(10, incomeStatements.length); i++) {
        const income = incomeStatements[i];
        const cashflow = cashflowStatements[i];
        const balance = balanceSheets[i];
        
        if (income?.endDate?.raw && income?.totalRevenue?.raw) {
          const year = new Date(income.endDate.raw * 1000).getFullYear().toString();
          
          // Calculate ROIC if balance sheet data is available
          const equity = balance?.totalStockholderEquity?.raw || 0;
          const debt = balance?.totalDebt?.raw || 0;
          const investedCapital = equity + debt;
          const netIncome = income.netIncome?.raw || 0;
          const roic = investedCapital > 0 ? (netIncome / investedCapital) * 100 : null;

          metrics.push({
            stockId,
            year,
            revenue: income.totalRevenue.raw,
            earnings: income.netIncome?.raw || null,
            freeCashFlow: cashflow?.freeCashflow?.raw || null,
            bookValue: equity > 0 ? equity : null,
            eps: null, // Yahoo doesn't provide consistent EPS data
            roic: roic,
            debt: debt > 0 ? debt : null
          });
        }
      }

      if (metrics.length > 0) {
        console.log(`✅ Yahoo Finance found ${metrics.length} years of data for ${normalizedSymbol}`);
      }

      return metrics.reverse(); // Return in chronological order
    } catch (error) {
      console.error(`Yahoo Finance metrics error for ${symbol}:`, error);
      return [];
    }
  }

  private normalizeSymbolForYahoo(symbol: string): string {
    // Handle international stock symbols for Yahoo Finance
    const exchangeMappings: Record<string, string> = {
      // Brazilian stocks
      'SBSP3': 'SBSP3.SA',
      // Chinese stocks (numeric symbols)
      '300274': '300274.SZ',
      '600660': '600660.SS', 
      '605499': '605499.SS',
      '300866': '300866.SZ',
      '002001': '002001.SZ',
      // Japanese stocks
      '6857': '6857.T',
      '2379': '2379.TW',
      // Korean stocks  
      '259960': '259960.KS',
      // Hong Kong stocks
      '9992': '9992.HK',
      '1308': '1308.HK',
      // Canadian stocks
      'CSU': 'CSU.TO',
      'K': 'K.TO',
      // European stocks
      'ADYEN': 'ADYEN.AS',
      'WISE': 'WISE.L',
      'GMAB': 'GMAB.CO',
      'ORNAV': 'ORNAV.HE',
      'RHM': 'RHM.DE',
      'EMG': 'EMG.L'
    };

    // Check if we have a specific mapping
    if (exchangeMappings[symbol]) {
      return exchangeMappings[symbol];
    }

    // Handle numeric Chinese stocks generically
    if (/^\d+$/.test(symbol)) {
      const num = parseInt(symbol);
      if (num >= 600000 && num <= 699999) {
        return `${symbol}.SS`; // Shanghai Stock Exchange
      } else if (num >= 1 && num <= 399999) {
        return `${symbol}.SZ`; // Shenzhen Stock Exchange
      }
    }

    // Return symbol as-is for US stocks
    return symbol;
  }

  private async fetchFMPFinancialMetrics(symbol: string, stockId: number): Promise<InsertFinancialMetrics[]> {
    try {
      // Add delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Fetch income statements, cash flow, and balance sheet data sequentially to avoid rate limits
      const incomeResponse = await fetch(`${this.FMP_BASE_URL}/income-statement/${symbol}?limit=10&apikey=${this.FMP_API_KEY}`);
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const cashflowResponse = await fetch(`${this.FMP_BASE_URL}/cash-flow-statement/${symbol}?limit=10&apikey=${this.FMP_API_KEY}`);
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const balanceResponse = await fetch(`${this.FMP_BASE_URL}/balance-sheet-statement/${symbol}?limit=10&apikey=${this.FMP_API_KEY}`);

      if (!incomeResponse.ok || !cashflowResponse.ok || !balanceResponse.ok) return [];

      const [incomeData, cashflowData, balanceData]: [FMPFinancialData[], FMPCashFlowData[], FMPBalanceSheetData[]] = await Promise.all([
        incomeResponse.json(),
        cashflowResponse.json(),
        balanceResponse.json()
      ]);

      const metrics: InsertFinancialMetrics[] = [];

      // Process data for last 10 years
      for (let i = 0; i < Math.min(10, incomeData.length); i++) {
        const income = incomeData[i];
        const cashflow = cashflowData[i];
        const balance = balanceData[i];

        if (income && income.calendarYear) {
          // Use available data even if cashflow/balance is missing
          const cashflowYear = cashflow && cashflow.calendarYear === income.calendarYear ? cashflow : null;
          const balanceYear = balance && balance.calendarYear === income.calendarYear ? balance : null;
          
          // Calculate ROIC if balance sheet data is available
          const equity = balanceYear?.totalStockholdersEquity || balanceYear?.totalEquity || 0;
          const debt = balanceYear?.totalDebt || 0;
          const investedCapital = equity + debt;
          const roic = investedCapital > 0 ? (income.netIncome / investedCapital) * 100 : null;

          // Ensure we have valid data before adding to metrics
          const revenue = income.revenue || 0;
          const netIncome = income.netIncome || 0;
          
          if (revenue > 0 || netIncome !== 0) {
            metrics.push({
              stockId,
              year: income.calendarYear,
              revenue: revenue > 0 ? revenue : null,
              earnings: netIncome,
              freeCashFlow: cashflowYear?.freeCashFlow ?? null,
              bookValue: equity > 0 ? equity : null,
              eps: income.eps ?? income.epsdiluted ?? null,
              roic: roic,
              debt: debt > 0 ? debt : null
            });
          }
        }
      }

      return metrics.reverse(); // Return in chronological order
    } catch (error) {
      console.error(`FMP metrics error for ${symbol}:`, error);
      return [];
    }
  }

  async searchStocks(query: string): Promise<InsertStock[]> {
    try {
      // Try Yahoo Finance search first
      const yahooResults = await this.searchYahooStocks(query);
      if (yahooResults.length > 0) return yahooResults;

      // Fallback to FMP search
      const fmpResults = await this.searchFMPStocks(query);
      return fmpResults;
    } catch (error) {
      console.error(`Error searching stocks for ${query}:`, error);
      return [];
    }
  }

  private async searchYahooStocks(query: string): Promise<InsertStock[]> {
    try {
      const response = await fetch(
        `https://query1.finance.yahoo.com/v1/finance/search?q=${encodeURIComponent(query)}&lang=en-US&region=US&quotesCount=10&newsCount=0`
      );
      
      if (!response.ok) return [];
      
      const data = await response.json();
      const quotes = data.quotes || [];
      
      const results: InsertStock[] = [];
      
      for (const quote of quotes.slice(0, 10)) {
        if (quote.symbol && quote.shortname) {
          // Fetch current price for each result
          const stockData = await this.fetchYahooStockData(quote.symbol);
          if (stockData) {
            results.push({
              symbol: quote.symbol,
              name: quote.shortname || quote.longname || quote.symbol,
              price: stockData.price,
              change: stockData.change,
              changePercent: stockData.changePercent
            });
          }
        }
      }
      
      return results;
    } catch (error) {
      console.error(`Yahoo search error for ${query}:`, error);
      return [];
    }
  }

  private async searchFMPStocks(query: string): Promise<InsertStock[]> {
    try {
      const response = await fetch(
        `${this.FMP_BASE_URL}/search?query=${encodeURIComponent(query)}&limit=10&apikey=${this.FMP_API_KEY}`
      );
      
      if (!response.ok) return [];
      
      const data = await response.json();
      
      const results: InsertStock[] = [];
      
      for (const item of data.slice(0, 10)) {
        if (item.symbol && item.name) {
          // Fetch current price for each result
          const stockData = await this.fetchFMPStockData(item.symbol);
          if (stockData) {
            results.push({
              symbol: item.symbol,
              name: item.name,
              price: stockData.price,
              change: stockData.change,
              changePercent: stockData.changePercent
            });
          }
        }
      }
      
      return results;
    } catch (error) {
      console.error(`FMP search error for ${query}:`, error);
      return [];
    }
  }

  private async fetchAlphaVantageFinancialMetrics(symbol: string, stockId: number): Promise<InsertFinancialMetrics[]> {
    try {
      const metrics: InsertFinancialMetrics[] = [];
      
      // Fetch fundamental data from Alpha Vantage
      const [incomeResponse, balanceResponse, cashflowResponse] = await Promise.all([
        fetch(`${this.ALPHA_VANTAGE_BASE_URL}?function=INCOME_STATEMENT&symbol=${symbol}&apikey=${this.ALPHA_VANTAGE_API_KEY}`),
        fetch(`${this.ALPHA_VANTAGE_BASE_URL}?function=BALANCE_SHEET&symbol=${symbol}&apikey=${this.ALPHA_VANTAGE_API_KEY}`),
        fetch(`${this.ALPHA_VANTAGE_BASE_URL}?function=CASH_FLOW&symbol=${symbol}&apikey=${this.ALPHA_VANTAGE_API_KEY}`)
      ]);

      if (!incomeResponse.ok) {
        console.warn(`Alpha Vantage API error for ${symbol}`);
        return [];
      }

      const [incomeData, balanceData, cashflowData] = await Promise.all([
        incomeResponse.json(),
        balanceResponse.json(),
        cashflowResponse.json()
      ]);

      // Check for API limits or errors
      if (incomeData.Note || incomeData['Error Message']) {
        console.warn(`Alpha Vantage limit/error for ${symbol}:`, incomeData.Note || incomeData['Error Message']);
        return [];
      }

      const annualReports = incomeData.annualReports || [];
      const balanceReports = balanceData.annualReports || [];
      const cashflowReports = cashflowData.annualReports || [];

      // Process up to 10 years of data
      for (let i = 0; i < Math.min(10, annualReports.length); i++) {
        const income = annualReports[i];
        const balance = balanceReports[i];
        const cashflow = cashflowReports[i];

        if (income && income.fiscalDateEnding) {
          const year = income.fiscalDateEnding.substring(0, 4);
          
          // Calculate key metrics
          const revenue = income.totalRevenue !== 'None' ? parseFloat(income.totalRevenue) || null : null;
          const earnings = income.netIncome !== 'None' ? parseFloat(income.netIncome) || null : null;
          
          let freeCashFlow = null;
          if (cashflow && cashflow.operatingCashflow !== 'None' && cashflow.capitalExpenditures !== 'None') {
            freeCashFlow = parseFloat(cashflow.operatingCashflow) - Math.abs(parseFloat(cashflow.capitalExpenditures) || 0);
          }
          
          const bookValue = balance && balance.totalShareholderEquity !== 'None' ? parseFloat(balance.totalShareholderEquity) || null : null;
          const debt = balance && balance.totalDebt !== 'None' ? parseFloat(balance.totalDebt) || null : null;
          
          // Calculate EPS if shares outstanding is available
          const sharesOutstanding = income.weightedAverageShsOut !== 'None' ? parseFloat(income.weightedAverageShsOut) || null : null;
          const eps = earnings && sharesOutstanding ? earnings / sharesOutstanding : null;
          
          // Calculate ROIC
          const equity = bookValue || 0;
          const totalDebt = debt || 0;
          const investedCapital = equity + totalDebt;
          const roic = earnings && investedCapital > 0 ? (earnings / investedCapital) * 100 : null;

          metrics.push({
            stockId,
            year,
            revenue,
            earnings,
            freeCashFlow,
            bookValue,
            eps,
            roic,
            debt
          });
        }
      }

      return metrics.reverse(); // Return in chronological order
    } catch (error) {
      console.error(`Alpha Vantage error for ${symbol}:`, error);
      return [];
    }
  }
}

export const financialDataService = new FinancialDataService();