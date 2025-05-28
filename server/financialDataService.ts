import { Stock, FinancialMetrics, InsertStock, InsertFinancialMetrics } from "@shared/schema";

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
  private readonly FMP_API_KEY = "LKODerELb8EZDzg1tl275H8MQoupFnY1";
  private readonly FMP_BASE_URL = "https://financialmodelingprep.com/api/v3";

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

  async fetchFinancialMetrics(symbol: string, stockId: number): Promise<InsertFinancialMetrics[]> {
    try {
      // Try Yahoo Finance first
      const yahooMetrics = await this.fetchYahooFinancialMetrics(symbol, stockId);
      if (yahooMetrics && yahooMetrics.length > 0) return yahooMetrics;

      // Fallback to Financial Modeling Prep
      const fmpMetrics = await this.fetchFMPFinancialMetrics(symbol, stockId);
      return fmpMetrics;
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
      const response = await fetch(
        `https://query1.finance.yahoo.com/v10/finance/quoteSummary/${symbol}?modules=incomeStatementHistory,cashflowStatementHistory,balanceSheetHistory,defaultKeyStatistics,financialData`
      );
      
      if (!response.ok) return [];
      
      const data: YahooFinancialData = await response.json();
      const result = data.quoteSummary.result[0];
      
      if (!result) return [];

      const metrics: InsertFinancialMetrics[] = [];
      
      // Process historical data
      const incomeStatements = result.incomeStatementHistory?.incomeStatementHistory || [];
      const cashflowStatements = result.cashflowStatementHistory?.cashflowStatements || [];
      const balanceSheets = result.balanceSheetHistory?.balanceSheetStatements || [];

      // Get last 10 years of data
      for (let i = 0; i < Math.min(10, incomeStatements.length); i++) {
        const income = incomeStatements[i];
        const cashflow = cashflowStatements[i];
        const balance = balanceSheets[i];
        
        if (income && cashflow && balance) {
          const year = new Date(income.endDate.raw * 1000).getFullYear().toString();
          
          // Calculate ROIC (simplified)
          const equity = balance.totalStockholderEquity?.raw || 0;
          const debt = balance.totalDebt?.raw || 0;
          const investedCapital = equity + debt;
          const netIncome = income.netIncome?.raw || 0;
          const roic = investedCapital > 0 ? (netIncome / investedCapital) * 100 : 0;

          metrics.push({
            stockId,
            year,
            revenue: income.totalRevenue?.raw || null,
            earnings: income.netIncome?.raw || null,
            freeCashFlow: cashflow.freeCashflow?.raw || null,
            bookValue: equity || null,
            eps: null, // Will be calculated from other data
            roic: roic || null,
            debt: balance.totalDebt?.raw || null
          });
        }
      }

      return metrics.reverse(); // Return in chronological order
    } catch (error) {
      console.error(`Yahoo Finance metrics error for ${symbol}:`, error);
      return [];
    }
  }

  private async fetchFMPFinancialMetrics(symbol: string, stockId: number): Promise<InsertFinancialMetrics[]> {
    try {
      // Fetch income statements, cash flow, and balance sheet data
      const [incomeResponse, cashflowResponse, balanceResponse] = await Promise.all([
        fetch(`${this.FMP_BASE_URL}/income-statement/${symbol}?limit=10&apikey=${this.FMP_API_KEY}`),
        fetch(`${this.FMP_BASE_URL}/cash-flow-statement/${symbol}?limit=10&apikey=${this.FMP_API_KEY}`),
        fetch(`${this.FMP_BASE_URL}/balance-sheet-statement/${symbol}?limit=10&apikey=${this.FMP_API_KEY}`)
      ]);

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

        if (income && cashflow && balance && income.calendarYear === cashflow.calendarYear && income.calendarYear === balance.calendarYear) {
          // Calculate ROIC
          const equity = balance.totalStockholdersEquity || 0;
          const debt = balance.totalDebt || 0;
          const investedCapital = equity + debt;
          const roic = investedCapital > 0 ? (income.netIncome / investedCapital) * 100 : 0;

          metrics.push({
            stockId,
            year: income.calendarYear,
            revenue: income.revenue || null,
            earnings: income.netIncome || null,
            freeCashFlow: cashflow.freeCashFlow || null,
            bookValue: balance.totalStockholdersEquity || null,
            eps: income.eps || null,
            roic: roic || null,
            debt: balance.totalDebt || null
          });
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
}

export const financialDataService = new FinancialDataService();