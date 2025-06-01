import { pgTable, text, serial, integer, real, jsonb, timestamp, boolean, varchar, index } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const stocks = pgTable("stocks", {
  id: serial("id").primaryKey(),
  symbol: text("symbol").notNull().unique(),
  name: text("name").notNull(),
  price: real("price").notNull(),
  change: real("change").notNull(),
  changePercent: real("change_percent").notNull(),
  marketCap: real("market_cap"),
  volume: real("volume"),
  exchange: text("exchange"),
  sector: text("sector"),
  lastUpdated: timestamp("last_updated").defaultNow(),
});

export const financialMetrics = pgTable("financial_metrics", {
  id: serial("id").primaryKey(),
  stockId: serial("stock_id").references(() => stocks.id).notNull(),
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

// Session storage table for authentication
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table for authentication
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique(),
  password: varchar("password"), // For email/password auth
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  authProvider: varchar("auth_provider").default("email"), // 'email' or 'google'
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
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

export const insertUserSchema = createInsertSchema(users).omit({
  createdAt: true,
  updatedAt: true,
});

export type Stock = typeof stocks.$inferSelect;
export type InsertStock = z.infer<typeof insertStockSchema>;
export type FinancialMetrics = typeof financialMetrics.$inferSelect;
export type InsertFinancialMetrics = z.infer<typeof insertFinancialMetricsSchema>;
export type WatchlistItem = typeof watchlistItems.$inferSelect;
export type InsertWatchlistItem = z.infer<typeof insertWatchlistItemSchema>;
export type ValuationInputs = typeof valuationInputs.$inferSelect;
export type InsertValuationInputs = z.infer<typeof insertValuationInputsSchema>;
export type User = typeof users.$inferSelect;
export type UpsertUser = typeof users.$inferInsert;

// Additional types for frontend
export interface StockWithMetrics extends Stock {
  metrics?: FinancialMetrics[];
  bigFourGrowth?: {
    salesGrowth: number | null;
    epsGrowth: number | null;
    equityGrowth: number | null;
    fcfGrowth: number | null;
  } | null | undefined;
  ruleOneQuality?: {
    isExcellent: boolean;
    debtPayoffYears: number;
    roic: number;
    marginOfSafety: number;
    qualityScore: number;
    stickerPrice: number;
    marginOfSafetyPrice: number;
    investmentStory: string;
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

// Database relations
export const stocksRelations = relations(stocks, ({ many }) => ({
  financialMetrics: many(financialMetrics),
}));

export const financialMetricsRelations = relations(financialMetrics, ({ one }) => ({
  stock: one(stocks, {
    fields: [financialMetrics.stockId],
    references: [stocks.id],
  }),
}));
