interface FinancialStatement {
  symbol: string;
  date: string;
  revenue: number;
  netIncome: number;
  totalAssets: number;
  totalDebt: number;
  totalStockholdersEquity: number;
  freeCashFlow: number;
  eps: number;
  operatingIncome: number;
  totalCurrentAssets: number;
  totalCurrentLiabilities: number;
  inventory: number;
  interestExpense: number;
}

export class FMPService {
  private readonly apiKey = process.env.FMP_API_KEY!;
  private readonly baseUrl = "https://financialmodelingprep.com/api/v3";

  /**
   * Get comprehensive financial statements for a company
   */
  async getCompanyFinancials(symbol: string): Promise<FinancialStatement[]> {
    try {
      const [incomeStatement, balanceSheet, cashFlow] = await Promise.all([
        this.getIncomeStatement(symbol),
        this.getBalanceSheet(symbol),
        this.getCashFlowStatement(symbol)
      ]);

      // Combine data from all three statements
      const combinedData: FinancialStatement[] = [];
      
      for (let i = 0; i < Math.min(incomeStatement.length, balanceSheet.length, cashFlow.length); i++) {
        const income = incomeStatement[i];
        const balance = balanceSheet[i];
        const cash = cashFlow[i];

        if (income.date === balance.date && balance.date === cash.date) {
          combinedData.push({
            symbol: income.symbol,
            date: income.date,
            revenue: income.revenue || 0,
            netIncome: income.netIncome || 0,
            totalAssets: balance.totalAssets || 0,
            totalDebt: balance.totalDebt || 0,
            totalStockholdersEquity: balance.totalStockholdersEquity || 0,
            freeCashFlow: cash.freeCashFlow || 0,
            eps: income.eps || 0,
            operatingIncome: income.operatingIncome || 0,
            totalCurrentAssets: balance.totalCurrentAssets || 0,
            totalCurrentLiabilities: balance.totalCurrentLiabilities || 0,
            inventory: balance.inventory || 0,
            interestExpense: income.interestExpense || 0
          });
        }
      }

      return combinedData;
    } catch (error) {
      console.error(`FMP API error for ${symbol}:`, error);
      return [];
    }
  }

  /**
   * Get income statement data
   */
  private async getIncomeStatement(symbol: string): Promise<any[]> {
    const url = `${this.baseUrl}/income-statement/${symbol}?limit=10&apikey=${this.apiKey}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  }

  /**
   * Get balance sheet data
   */
  private async getBalanceSheet(symbol: string): Promise<any[]> {
    const url = `${this.baseUrl}/balance-sheet-statement/${symbol}?limit=10&apikey=${this.apiKey}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  }

  /**
   * Get cash flow statement data
   */
  private async getCashFlowStatement(symbol: string): Promise<any[]> {
    const url = `${this.baseUrl}/cash-flow-statement/${symbol}?limit=10&apikey=${this.apiKey}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  }

  /**
   * Get company profile and key metrics
   */
  async getCompanyProfile(symbol: string): Promise<any> {
    try {
      const url = `${this.baseUrl}/profile/${symbol}?apikey=${this.apiKey}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data[0]; // FMP returns array, take first element
    } catch (error) {
      console.error(`FMP profile error for ${symbol}:`, error);
      return null;
    }
  }

  /**
   * Get key financial ratios
   */
  async getFinancialRatios(symbol: string): Promise<any[]> {
    try {
      const url = `${this.baseUrl}/ratios/${symbol}?limit=5&apikey=${this.apiKey}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`FMP ratios error for ${symbol}:`, error);
      return [];
    }
  }
}

export const fmpService = new FMPService();