import { 
  stocks, 
  financialMetrics, 
  watchlistItems, 
  valuationInputs,
  users,
  type Stock, 
  type InsertStock,
  type FinancialMetrics,
  type InsertFinancialMetrics,
  type WatchlistItem,
  type InsertWatchlistItem,
  type ValuationInputs,
  type InsertValuationInputs,
  type StockWithMetrics,
  type NewsItem,
  type User,
  type UpsertUser
} from "@shared/schema";
import { db } from "./db";
import { eq, ilike, or } from "drizzle-orm";

export interface IStorage {
  // Stock operations
  getStock(symbol: string): Promise<Stock | undefined>;
  getStockBySymbol(symbol: string): Promise<Stock | undefined>;
  createStock(stock: InsertStock): Promise<Stock>;
  updateStock(symbol: string, updates: Partial<InsertStock>): Promise<Stock | undefined>;
  searchStocks(query: string): Promise<Stock[]>;
  
  // Financial metrics operations
  getFinancialMetrics(stockId: number): Promise<FinancialMetrics[]>;
  createFinancialMetrics(metrics: InsertFinancialMetrics): Promise<FinancialMetrics>;
  
  // Watchlist operations
  getWatchlist(): Promise<WatchlistItem[]>;
  addToWatchlist(item: InsertWatchlistItem): Promise<WatchlistItem>;
  removeFromWatchlist(stockSymbol: string): Promise<boolean>;
  
  // Valuation operations
  getValuationInputs(stockSymbol: string): Promise<ValuationInputs | undefined>;
  saveValuationInputs(inputs: InsertValuationInputs): Promise<ValuationInputs>;
  
  // Enhanced operations
  getStockWithMetrics(symbol: string): Promise<StockWithMetrics | undefined>;
  getNews(): Promise<NewsItem[]>;
  
  // User operations (required for authentication)
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  createUser(user: UpsertUser): Promise<User>;
}

export class MemStorage implements IStorage {
  private stocks: Map<string, Stock> = new Map();
  private metrics: Map<number, FinancialMetrics[]> = new Map();
  private watchlist: Map<string, WatchlistItem> = new Map();
  private valuations: Map<string, ValuationInputs> = new Map();
  private currentStockId = 1;
  private currentMetricsId = 1;
  private currentWatchlistId = 1;
  private currentValuationId = 1;

  constructor() {
    // Initialize with some sample data for demonstration
    this.initializeSampleData();
  }

  private initializeSampleData() {
    // Sample stocks
    const sampleStocks: Stock[] = [
      { id: 1, symbol: "AAPL", name: "Apple Inc.", price: 175.43, change: 4.12, changePercent: 2.34, lastUpdated: new Date() },
      { id: 2, symbol: "MSFT", name: "Microsoft Corporation", price: 338.11, change: 4.05, changePercent: 1.2, lastUpdated: new Date() },
      { id: 3, symbol: "GOOGL", name: "Alphabet Inc.", price: 133.32, change: -1.07, changePercent: -0.8, lastUpdated: new Date() },
      { id: 4, symbol: "AMZN", name: "Amazon.com Inc.", price: 145.69, change: 3.06, changePercent: 2.1, lastUpdated: new Date() },
      { id: 5, symbol: "TSLA", name: "Tesla Inc.", price: 248.50, change: 8.46, changePercent: 3.4, lastUpdated: new Date() }
    ];

    sampleStocks.forEach(stock => {
      this.stocks.set(stock.symbol, stock);
      this.currentStockId = Math.max(this.currentStockId, stock.id + 1);
    });

    // Sample financial metrics for AAPL
    const aaplMetrics: FinancialMetrics[] = [
      { id: 1, stockId: 1, year: "2014", revenue: 182.8, earnings: 39.5, freeCashFlow: 59.7, bookValue: 111.5, eps: 6.45, roic: 28.4, debt: 28.9 },
      { id: 2, stockId: 1, year: "2015", revenue: 233.7, earnings: 53.4, freeCashFlow: 81.3, bookValue: 119.4, eps: 9.22, roic: 31.2, debt: 53.2 },
      { id: 3, stockId: 1, year: "2016", revenue: 215.6, earnings: 45.7, freeCashFlow: 65.8, bookValue: 128.2, eps: 8.31, roic: 25.8, debt: 75.4 },
      { id: 4, stockId: 1, year: "2017", revenue: 229.2, earnings: 48.4, freeCashFlow: 51.8, bookValue: 134.0, eps: 9.21, roic: 26.9, debt: 97.2 },
      { id: 5, stockId: 1, year: "2018", revenue: 265.6, earnings: 59.5, freeCashFlow: 64.1, bookValue: 107.1, eps: 11.91, roic: 28.4, debt: 102.5 },
      { id: 6, stockId: 1, year: "2019", revenue: 260.2, earnings: 55.3, freeCashFlow: 58.9, bookValue: 90.5, eps: 11.97, roic: 29.9, debt: 108.0 },
      { id: 7, stockId: 1, year: "2020", revenue: 274.5, earnings: 57.4, freeCashFlow: 73.4, bookValue: 65.3, eps: 12.73, roic: 27.9, debt: 112.4 },
      { id: 8, stockId: 1, year: "2021", revenue: 365.8, earnings: 94.7, freeCashFlow: 92.9, bookValue: 63.1, eps: 16.69, roic: 36.2, debt: 119.7 },
      { id: 9, stockId: 1, year: "2022", revenue: 394.3, earnings: 99.8, freeCashFlow: 111.4, bookValue: 50.7, eps: 17.91, roic: 31.4, debt: 120.1 },
      { id: 10, stockId: 1, year: "2023", revenue: 383.3, earnings: 97.0, freeCashFlow: 99.6, bookValue: 62.1, eps: 18.34, roic: 28.4, debt: 111.1 }
    ];

    this.metrics.set(1, aaplMetrics);
    this.currentMetricsId = 11;
  }

  async getStock(symbol: string): Promise<Stock | undefined> {
    return this.stocks.get(symbol.toUpperCase());
  }

  async getStockBySymbol(symbol: string): Promise<Stock | undefined> {
    return this.getStock(symbol);
  }

  async createStock(stock: InsertStock): Promise<Stock> {
    const newStock: Stock = {
      ...stock,
      id: this.currentStockId++,
      symbol: stock.symbol.toUpperCase(),
      lastUpdated: new Date(),
    };
    this.stocks.set(newStock.symbol, newStock);
    return newStock;
  }

  async updateStock(symbol: string, updates: Partial<InsertStock>): Promise<Stock | undefined> {
    const existing = this.stocks.get(symbol.toUpperCase());
    if (!existing) return undefined;

    const updated: Stock = {
      ...existing,
      ...updates,
      symbol: updates.symbol?.toUpperCase() || existing.symbol,
      lastUpdated: new Date(),
    };
    this.stocks.set(updated.symbol, updated);
    return updated;
  }

  async searchStocks(query: string): Promise<Stock[]> {
    const searchTerm = query.toLowerCase();
    return Array.from(this.stocks.values()).filter(stock =>
      stock.symbol.toLowerCase().includes(searchTerm) ||
      stock.name.toLowerCase().includes(searchTerm)
    );
  }

  async getFinancialMetrics(stockId: number): Promise<FinancialMetrics[]> {
    return this.metrics.get(stockId) || [];
  }

  async createFinancialMetrics(metrics: InsertFinancialMetrics): Promise<FinancialMetrics> {
    const newMetrics: FinancialMetrics = {
      ...metrics,
      id: this.currentMetricsId++,
      stockId: metrics.stockId!,
    };

    const existing = this.metrics.get(metrics.stockId!) || [];
    existing.push(newMetrics);
    this.metrics.set(metrics.stockId!, existing);
    
    return newMetrics;
  }

  async getWatchlist(): Promise<WatchlistItem[]> {
    return Array.from(this.watchlist.values());
  }

  async addToWatchlist(item: InsertWatchlistItem): Promise<WatchlistItem> {
    const newItem: WatchlistItem = {
      ...item,
      id: this.currentWatchlistId++,
      stockSymbol: item.stockSymbol.toUpperCase(),
      addedAt: new Date(),
    };
    this.watchlist.set(newItem.stockSymbol, newItem);
    return newItem;
  }

  async removeFromWatchlist(stockSymbol: string): Promise<boolean> {
    return this.watchlist.delete(stockSymbol.toUpperCase());
  }

  async getValuationInputs(stockSymbol: string): Promise<ValuationInputs | undefined> {
    return this.valuations.get(stockSymbol.toUpperCase());
  }

  async saveValuationInputs(inputs: InsertValuationInputs): Promise<ValuationInputs> {
    const newInputs: ValuationInputs = {
      ...inputs,
      id: this.currentValuationId++,
      stockSymbol: inputs.stockSymbol.toUpperCase(),
    };
    this.valuations.set(newInputs.stockSymbol, newInputs);
    return newInputs;
  }

  async getStockWithMetrics(symbol: string): Promise<StockWithMetrics | undefined> {
    const stock = await this.getStock(symbol);
    if (!stock) return undefined;

    const metrics = await this.getFinancialMetrics(stock.id);
    
    // Calculate big four growth rates
    const bigFourGrowth = this.calculateBigFourGrowth(metrics);
    
    // Calculate Rule One quality indicators
    const ruleOneQuality = this.calculateRuleOneQuality(metrics, stock);

    return {
      ...stock,
      metrics,
      bigFourGrowth,
      ruleOneQuality,
    };
  }

  private calculateBigFourGrowth(metrics: FinancialMetrics[]) {
    if (metrics.length < 2) return undefined;

    const sortedMetrics = metrics.sort((a, b) => parseInt(a.year) - parseInt(b.year));
    const calculateCAGR = (endValue: number, startValue: number, years: number) => {
      if (startValue <= 0) return 0;
      return (Math.pow(endValue / startValue, 1 / years) - 1) * 100;
    };

    const years = sortedMetrics.length - 1;
    const first = sortedMetrics[0];
    const last = sortedMetrics[sortedMetrics.length - 1];

    return {
      salesGrowth: calculateCAGR(last.revenue || 0, first.revenue || 1, years),
      epsGrowth: calculateCAGR(last.eps || 0, first.eps || 1, years),
      equityGrowth: calculateCAGR(last.bookValue || 0, first.bookValue || 1, years),
      fcfGrowth: calculateCAGR(last.freeCashFlow || 0, first.freeCashFlow || 1, years),
    };
  }

  private calculateRuleOneQuality(metrics: FinancialMetrics[], stock: Stock) {
    if (metrics.length === 0) return undefined;

    const latestMetrics = metrics[metrics.length - 1];
    const roic = latestMetrics.roic || 0;
    const debt = latestMetrics.debt || 0;
    const fcf = latestMetrics.freeCashFlow || 0;
    const debtPayoffYears = fcf > 0 ? debt / fcf : 99;

    // Simple margin of safety calculation (this would be more complex in real implementation)
    const pe = stock.price / (latestMetrics.eps || 1);
    const marginOfSafety = pe < 15 ? ((15 - pe) / 15) * 100 : 0;

    return {
      isExcellent: roic > 10 && debtPayoffYears < 5,
      debtPayoffYears,
      roic,
      marginOfSafety,
    };
  }

  async getNews(): Promise<NewsItem[]> {
    // Mock news data
    return [
      {
        id: "1",
        title: "Q4 Earnings Released",
        summary: "Apple reported EPS of $2.18, beating estimates by $0.07.",
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        type: "earnings",
        symbol: "AAPL"
      },
      {
        id: "2",
        title: "Debt Level Alert",
        summary: "TSLA debt-to-FCF ratio increased to 4.2 years.",
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
        type: "alert",
        symbol: "TSLA"
      },
      {
        id: "3",
        title: "Price Alert",
        summary: "MSFT approaching your MOS price target of $295.",
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
        type: "price",
        symbol: "MSFT"
      }
    ];
  }

  // User operations (required for authentication)
  async getUser(id: string): Promise<User | undefined> {
    return undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return undefined;
  }

  async upsertUser(user: UpsertUser): Promise<User> {
    throw new Error("User operations not supported in memory storage");
  }

  async createUser(user: UpsertUser): Promise<User> {
    throw new Error("User operations not supported in memory storage");
  }
}

export class DatabaseStorage implements IStorage {
  // Cap extreme growth rates to prevent display of obviously wrong data
  private capGrowthRate(rate: number): number {
    if (Math.abs(rate) > 200) {
      console.warn(`Data Quality Warning: Growth rate of ${rate.toFixed(1)}% detected. Capping at 200% due to likely data quality issues.`);
      return rate > 0 ? 200 : -200;
    }
    return rate;
  }

  // Fixed calculation method that caps unrealistic growth rates
  private calculateBigFourGrowthFixed(metrics: any[]) {
    if (metrics.length < 2) return undefined;

    const sortedMetrics = metrics.sort((a: any, b: any) => parseInt(a.year) - parseInt(b.year));
    
    if (metrics.length < 10) {
      console.warn(`Data Quality Warning: Only ${metrics.length} years of data available. Rule One methodology requires 10 years.`);
    }
    
    const calculateCAGR = (endValue: number, startValue: number, years: number) => {
      if (startValue <= 0) return 0;
      return (Math.pow(endValue / startValue, 1 / years) - 1) * 100;
    };

    const years = sortedMetrics.length - 1;
    const first = sortedMetrics[0];
    const last = sortedMetrics[sortedMetrics.length - 1];

    return {
      salesGrowth: this.capGrowthRate(calculateCAGR(last.revenue || 0, first.revenue || 1, years)),
      epsGrowth: this.capGrowthRate(calculateCAGR(last.eps || 0, first.eps || 1, years)),
      equityGrowth: this.capGrowthRate(calculateCAGR(last.bookValue || 0, first.bookValue || 1, years)),
      fcfGrowth: this.capGrowthRate(calculateCAGR(last.freeCashFlow || 0, first.freeCashFlow || 1, years)),
    };
  }

  async getStock(symbol: string): Promise<Stock | undefined> {
    const [stock] = await db.select().from(stocks).where(eq(stocks.symbol, symbol.toUpperCase()));
    return stock || undefined;
  }

  async createStock(stock: InsertStock): Promise<Stock> {
    const [newStock] = await db
      .insert(stocks)
      .values({
        ...stock,
        symbol: stock.symbol.toUpperCase(),
      })
      .returning();
    return newStock;
  }

  async updateStock(symbol: string, updates: Partial<InsertStock>): Promise<Stock | undefined> {
    const [updatedStock] = await db
      .update(stocks)
      .set({
        ...updates,
        symbol: updates.symbol?.toUpperCase() || undefined,
        lastUpdated: new Date(),
      })
      .where(eq(stocks.symbol, symbol.toUpperCase()))
      .returning();
    return updatedStock || undefined;
  }

  async searchStocks(query: string): Promise<Stock[]> {
    const searchTerm = `%${query.toLowerCase()}%`;
    return await db
      .select()
      .from(stocks)
      .where(
        or(
          ilike(stocks.symbol, searchTerm),
          ilike(stocks.name, searchTerm)
        )
      );
  }

  async getFinancialMetrics(stockId: number): Promise<FinancialMetrics[]> {
    return await db
      .select()
      .from(financialMetrics)
      .where(eq(financialMetrics.stockId, stockId))
      .orderBy(financialMetrics.year);
  }

  async createFinancialMetrics(metrics: InsertFinancialMetrics): Promise<FinancialMetrics> {
    const [newMetrics] = await db
      .insert(financialMetrics)
      .values(metrics)
      .returning();
    return newMetrics;
  }

  async getWatchlist(): Promise<WatchlistItem[]> {
    return await db.select().from(watchlistItems);
  }

  async addToWatchlist(item: InsertWatchlistItem): Promise<WatchlistItem> {
    const [newItem] = await db
      .insert(watchlistItems)
      .values({
        ...item,
        stockSymbol: item.stockSymbol.toUpperCase(),
      })
      .returning();
    return newItem;
  }

  async removeFromWatchlist(stockSymbol: string): Promise<boolean> {
    const result = await db
      .delete(watchlistItems)
      .where(eq(watchlistItems.stockSymbol, stockSymbol.toUpperCase()));
    return (result.rowCount || 0) > 0;
  }

  async getValuationInputs(stockSymbol: string): Promise<ValuationInputs | undefined> {
    const [inputs] = await db
      .select()
      .from(valuationInputs)
      .where(eq(valuationInputs.stockSymbol, stockSymbol.toUpperCase()));
    return inputs || undefined;
  }

  async saveValuationInputs(inputs: InsertValuationInputs): Promise<ValuationInputs> {
    const existing = await this.getValuationInputs(inputs.stockSymbol);
    
    if (existing) {
      const [updated] = await db
        .update(valuationInputs)
        .set(inputs)
        .where(eq(valuationInputs.stockSymbol, inputs.stockSymbol.toUpperCase()))
        .returning();
      return updated;
    } else {
      const [newInputs] = await db
        .insert(valuationInputs)
        .values({
          ...inputs,
          stockSymbol: inputs.stockSymbol.toUpperCase(),
        })
        .returning();
      return newInputs;
    }
  }

  async getStockWithMetrics(symbol: string): Promise<StockWithMetrics | undefined> {
    const stock = await this.getStock(symbol);
    if (!stock) return undefined;

    const metrics = await this.getFinancialMetrics(stock.id);
    
    // Calculate big four growth rates
    const bigFourGrowth = this.calculateBigFourGrowth(metrics);
    
    // Calculate Rule One quality indicators
    const ruleOneQuality = this.calculateRuleOneQuality(metrics, stock);

    return {
      ...stock,
      metrics,
      bigFourGrowth,
      ruleOneQuality,
    };
  }

  private calculateBigFourGrowth(metrics: FinancialMetrics[]) {
    if (metrics.length < 2) return undefined;

    const sortedMetrics = metrics.sort((a, b) => parseInt(a.year) - parseInt(b.year));
    const calculateCAGR = (endValue: number, startValue: number, years: number) => {
      if (startValue <= 0) return 0;
      return (Math.pow(endValue / startValue, 1 / years) - 1) * 100;
    };

    const years = sortedMetrics.length - 1;
    const first = sortedMetrics[0];
    const last = sortedMetrics[sortedMetrics.length - 1];

    return {
      salesGrowth: calculateCAGR(last.revenue || 0, first.revenue || 1, years),
      epsGrowth: calculateCAGR(last.eps || 0, first.eps || 1, years),
      equityGrowth: calculateCAGR(last.bookValue || 0, first.bookValue || 1, years),
      fcfGrowth: calculateCAGR(last.freeCashFlow || 0, first.freeCashFlow || 1, years),
    };
  }

  private calculateRuleOneQuality(metrics: FinancialMetrics[], stock: Stock) {
    if (metrics.length === 0) return undefined;

    const latestMetrics = metrics[metrics.length - 1];
    const roic = latestMetrics.roic || 0;
    const debt = latestMetrics.debt || 0;
    const fcf = latestMetrics.freeCashFlow || 0;
    const debtPayoffYears = fcf > 0 ? debt / fcf : 99;

    // Simple margin of safety calculation
    const pe = stock.price / (latestMetrics.eps || 1);
    const marginOfSafety = pe < 15 ? ((15 - pe) / 15) * 100 : 0;

    return {
      isExcellent: roic > 10 && debtPayoffYears < 5,
      debtPayoffYears,
      roic,
      marginOfSafety,
    };
  }

  async getNews(): Promise<NewsItem[]> {
    // Mock news data - in a real app this would come from a news API
    return [
      {
        id: "1",
        title: "Q4 Earnings Released",
        summary: "Apple reported EPS of $2.18, beating estimates by $0.07.",
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        type: "earnings",
        symbol: "AAPL"
      },
      {
        id: "2",
        title: "Debt Level Alert",
        summary: "TSLA debt-to-FCF ratio increased to 4.2 years.",
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
        type: "alert",
        symbol: "TSLA"
      },
      {
        id: "3",
        title: "Price Alert",
        summary: "MSFT approaching your MOS price target of $295.",
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        type: "price",
        symbol: "MSFT"
      }
    ];
  }

  // User operations (required for authentication)
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async createUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .returning();
    return user;
  }
}

// Initialize sample data in database
async function initializeSampleData() {
  try {
    // Check if data already exists
    const existingStocks = await db.select().from(stocks).limit(1);
    if (existingStocks.length > 0) {
      return; // Data already exists
    }

    // Sample stocks
    const sampleStocks = [
      { symbol: "AAPL", name: "Apple Inc.", price: 175.43, change: 4.12, changePercent: 2.34 },
      { symbol: "MSFT", name: "Microsoft Corporation", price: 338.11, change: 4.05, changePercent: 1.2 },
      { symbol: "GOOGL", name: "Alphabet Inc.", price: 133.32, change: -1.07, changePercent: -0.8 },
      { symbol: "AMZN", name: "Amazon.com Inc.", price: 145.69, change: 3.06, changePercent: 2.1 },
      { symbol: "TSLA", name: "Tesla Inc.", price: 248.50, change: 8.46, changePercent: 3.4 }
    ];

    const insertedStocks = await db.insert(stocks).values(sampleStocks).returning();

    // Sample financial metrics for AAPL
    const aaplStock = insertedStocks.find(s => s.symbol === "AAPL");
    if (aaplStock) {
      const aaplMetrics = [
        { stockId: aaplStock.id, year: "2014", revenue: 182.8, earnings: 39.5, freeCashFlow: 59.7, bookValue: 111.5, eps: 6.45, roic: 28.4, debt: 28.9 },
        { stockId: aaplStock.id, year: "2015", revenue: 233.7, earnings: 53.4, freeCashFlow: 81.3, bookValue: 119.4, eps: 9.22, roic: 31.2, debt: 53.2 },
        { stockId: aaplStock.id, year: "2016", revenue: 215.6, earnings: 45.7, freeCashFlow: 65.8, bookValue: 128.2, eps: 8.31, roic: 25.8, debt: 75.4 },
        { stockId: aaplStock.id, year: "2017", revenue: 229.2, earnings: 48.4, freeCashFlow: 51.8, bookValue: 134.0, eps: 9.21, roic: 26.9, debt: 97.2 },
        { stockId: aaplStock.id, year: "2018", revenue: 265.6, earnings: 59.5, freeCashFlow: 64.1, bookValue: 107.1, eps: 11.91, roic: 28.4, debt: 102.5 },
        { stockId: aaplStock.id, year: "2019", revenue: 260.2, earnings: 55.3, freeCashFlow: 58.9, bookValue: 90.5, eps: 11.97, roic: 29.9, debt: 108.0 },
        { stockId: aaplStock.id, year: "2020", revenue: 274.5, earnings: 57.4, freeCashFlow: 73.4, bookValue: 65.3, eps: 12.73, roic: 27.9, debt: 112.4 },
        { stockId: aaplStock.id, year: "2021", revenue: 365.8, earnings: 94.7, freeCashFlow: 92.9, bookValue: 63.1, eps: 16.69, roic: 36.2, debt: 119.7 },
        { stockId: aaplStock.id, year: "2022", revenue: 394.3, earnings: 99.8, freeCashFlow: 111.4, bookValue: 50.7, eps: 17.91, roic: 31.4, debt: 120.1 },
        { stockId: aaplStock.id, year: "2023", revenue: 383.3, earnings: 97.0, freeCashFlow: 99.6, bookValue: 62.1, eps: 18.34, roic: 28.4, debt: 111.1 }
      ];

      await db.insert(financialMetrics).values(aaplMetrics);
    }

    // Sample financial metrics for AMZN
    const amznStock = insertedStocks.find(s => s.symbol === "AMZN");
    if (amznStock) {
      const amznMetrics = [
        { stockId: amznStock.id, year: "2014", revenue: 89.0, earnings: -0.2, freeCashFlow: 1.9, bookValue: 19.3, eps: -0.52, roic: -0.8, debt: 8.2 },
        { stockId: amznStock.id, year: "2015", revenue: 111.0, earnings: 0.6, freeCashFlow: 7.3, bookValue: 25.3, eps: 1.25, roic: 1.4, debt: 8.2 },
        { stockId: amznStock.id, year: "2016", revenue: 136.0, earnings: 2.4, freeCashFlow: 9.7, bookValue: 32.2, eps: 4.90, roic: 4.2, debt: 7.7 },
        { stockId: amznStock.id, year: "2017", revenue: 178.0, earnings: 3.0, freeCashFlow: 18.4, bookValue: 43.5, eps: 6.15, roic: 5.1, debt: 24.7 },
        { stockId: amznStock.id, year: "2018", revenue: 233.0, earnings: 10.1, freeCashFlow: 19.4, bookValue: 62.1, eps: 20.14, roic: 12.8, debt: 23.5 },
        { stockId: amznStock.id, year: "2019", revenue: 281.0, earnings: 11.6, freeCashFlow: 25.8, bookValue: 78.4, eps: 23.01, roic: 13.2, debt: 32.7 },
        { stockId: amznStock.id, year: "2020", revenue: 386.0, earnings: 21.3, freeCashFlow: 31.0, bookValue: 93.4, eps: 41.83, roic: 18.1, debt: 67.1 },
        { stockId: amznStock.id, year: "2021", revenue: 470.0, earnings: 33.4, freeCashFlow: 46.3, bookValue: 138.2, eps: 64.81, roic: 16.2, debt: 48.4 },
        { stockId: amznStock.id, year: "2022", revenue: 514.0, earnings: -2.7, freeCashFlow: -16.9, bookValue: 146.0, eps: -5.12, roic: -1.2, debt: 67.2 },
        { stockId: amznStock.id, year: "2023", revenue: 575.0, earnings: 15.3, freeCashFlow: 35.5, bookValue: 201.9, eps: 14.87, roic: 6.1, debt: 58.3 }
      ];

      await db.insert(financialMetrics).values(amznMetrics);
    }

    // Sample financial metrics for MSFT
    const msftStock = insertedStocks.find(s => s.symbol === "MSFT");
    if (msftStock) {
      const msftMetrics = [
        { stockId: msftStock.id, year: "2014", revenue: 86.8, earnings: 22.1, freeCashFlow: 28.3, bookValue: 89.8, eps: 2.63, roic: 16.4, debt: 20.6 },
        { stockId: msftStock.id, year: "2015", revenue: 93.6, earnings: 12.2, freeCashFlow: 24.1, bookValue: 96.5, eps: 1.48, roic: 8.7, debt: 27.8 },
        { stockId: msftStock.id, year: "2016", revenue: 85.3, earnings: 16.8, freeCashFlow: 20.9, bookValue: 71.9, eps: 2.10, roic: 12.3, debt: 36.9 },
        { stockId: msftStock.id, year: "2017", revenue: 90.0, earnings: 21.2, freeCashFlow: 24.3, bookValue: 87.7, eps: 2.73, roic: 13.7, debt: 76.0 },
        { stockId: msftStock.id, year: "2018", revenue: 110.4, earnings: 16.6, freeCashFlow: 43.9, bookValue: 82.7, eps: 2.13, roic: 11.1, debt: 72.2 },
        { stockId: msftStock.id, year: "2019", revenue: 125.8, earnings: 39.2, freeCashFlow: 38.3, bookValue: 102.3, eps: 5.06, roic: 17.2, debt: 66.7 },
        { stockId: msftStock.id, year: "2020", revenue: 143.0, earnings: 44.3, freeCashFlow: 45.2, bookValue: 118.3, eps: 5.76, roic: 15.9, debt: 63.3 },
        { stockId: msftStock.id, year: "2021", revenue: 168.1, earnings: 61.3, freeCashFlow: 56.1, bookValue: 141.9, eps: 8.05, roic: 18.1, debt: 67.8 },
        { stockId: msftStock.id, year: "2022", revenue: 198.3, earnings: 72.7, freeCashFlow: 65.1, bookValue: 166.5, eps: 9.65, roic: 18.4, debt: 61.0 },
        { stockId: msftStock.id, year: "2023", revenue: 211.9, earnings: 72.4, freeCashFlow: 28.1, bookValue: 206.2, eps: 9.65, roic: 16.2, debt: 58.5 }
      ];

      await db.insert(financialMetrics).values(msftMetrics);
    }
  } catch (error) {
    console.error("Error initializing sample data:", error);
  }
}

export const storage = new DatabaseStorage();

// Initialize sample data when the module loads
initializeSampleData();
