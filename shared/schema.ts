import { pgTable, text, serial, real, jsonb, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const stocks = pgTable("stocks", {
  id: serial("id").primaryKey(),
  symbol: text("symbol").notNull().unique(),
  name: text("name").notNull(),
  price: real("price").notNull(),
  change: real("change").notNull(),
  changePercent: real("change_percent").notNull(),
  lastUpdated: timestamp("last_updated").defaultNow(),
});

export const financialMetrics = pgTable("financial_metrics", {
  id: serial("id").primaryKey(),
  stockId: serial("stock_id").references(() => stocks.id),
  year: text("year").notNull(),
  revenue: real("revenue"),
  earnings: real("earnings"),
  freeCashFlow: real("free_cash_flow"),
  bookValue: real("book_value"),
  eps: real("eps"),
  roic: real("roic"),
  debt: real("debt"),
});

export const watchlistItems = pgTable("watchlist_items", {
  id: serial("id").primaryKey(),
  stockSymbol: text("stock_symbol").notNull(),
  addedAt: timestamp("added_at").defaultNow(),
});

export const valuationInputs = pgTable("valuation_inputs", {
  id: serial("id").primaryKey(),
  stockSymbol: text("stock_symbol").notNull(),
  growthRate: real("growth_rate").notNull(),
  peRatio: real("pe_ratio").notNull(),
  minimumReturn: real("minimum_return").notNull(),
});

export const insertStockSchema = createInsertSchema(stocks).omit({
  id: true,
  lastUpdated: true,
});

export const insertFinancialMetricsSchema = createInsertSchema(financialMetrics).omit({
  id: true,
}).required({
  stockId: true,
});

export const insertWatchlistItemSchema = createInsertSchema(watchlistItems).omit({
  id: true,
  addedAt: true,
});

export const insertValuationInputsSchema = createInsertSchema(valuationInputs).omit({
  id: true,
});

export type Stock = typeof stocks.$inferSelect;
export type InsertStock = z.infer<typeof insertStockSchema>;
export type FinancialMetrics = typeof financialMetrics.$inferSelect;
export type InsertFinancialMetrics = z.infer<typeof insertFinancialMetricsSchema>;
export type WatchlistItem = typeof watchlistItems.$inferSelect;
export type InsertWatchlistItem = z.infer<typeof insertWatchlistItemSchema>;
export type ValuationInputs = typeof valuationInputs.$inferSelect;
export type InsertValuationInputs = z.infer<typeof insertValuationInputsSchema>;

// Additional types for frontend
export interface StockWithMetrics extends Stock {
  metrics?: FinancialMetrics[];
  bigFourGrowth?: {
    salesGrowth: number;
    epsGrowth: number;
    equityGrowth: number;
    fcfGrowth: number;
  };
  ruleOneQuality?: {
    isExcellent: boolean;
    debtPayoffYears: number;
    roic: number;
    marginOfSafety: number;
  };
}

export interface ComparisonData {
  stock1: StockWithMetrics;
  stock2: StockWithMetrics;
}

export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  timestamp: Date;
  type: 'earnings' | 'alert' | 'price' | 'news';
  symbol?: string;
}
