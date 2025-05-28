import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertStockSchema, insertWatchlistItemSchema, insertValuationInputsSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Stock search endpoint
  app.get("/api/stocks/search", async (req, res) => {
    try {
      const { q } = req.query;
      if (!q || typeof q !== 'string') {
        return res.status(400).json({ error: "Query parameter 'q' is required" });
      }
      
      const stocks = await storage.searchStocks(q);
      res.json(stocks);
    } catch (error) {
      res.status(500).json({ error: "Failed to search stocks" });
    }
  });

  // Get stock with metrics
  app.get("/api/stocks/:symbol", async (req, res) => {
    try {
      const { symbol } = req.params;
      const stock = await storage.getStockWithMetrics(symbol);
      
      if (!stock) {
        return res.status(404).json({ error: "Stock not found" });
      }
      
      res.json(stock);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch stock data" });
    }
  });

  // Update stock price (for real-time updates)
  app.patch("/api/stocks/:symbol", async (req, res) => {
    try {
      const { symbol } = req.params;
      const updateData = insertStockSchema.partial().parse(req.body);
      
      const updatedStock = await storage.updateStock(symbol, updateData);
      
      if (!updatedStock) {
        return res.status(404).json({ error: "Stock not found" });
      }
      
      res.json(updatedStock);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid input data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to update stock" });
    }
  });

  // Fetch real-time stock data from external API
  app.post("/api/stocks/fetch/:symbol", async (req, res) => {
    try {
      const { symbol } = req.params;
      const apiKey = process.env.ALPHA_VANTAGE_API_KEY || process.env.FINANCIAL_API_KEY || "demo";
      
      // Fetch from Alpha Vantage API
      const response = await fetch(
        `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${apiKey}`
      );
      
      if (!response.ok) {
        throw new Error("Failed to fetch from external API");
      }
      
      const data = await response.json();
      const quote = data["Global Quote"];
      
      if (!quote || Object.keys(quote).length === 0) {
        return res.status(404).json({ error: "Stock symbol not found" });
      }
      
      // Parse the API response
      const stockData = {
        symbol: quote["01. symbol"],
        name: `${quote["01. symbol"]} Corp.`, // Simplified name
        price: parseFloat(quote["05. price"]),
        change: parseFloat(quote["09. change"]),
        changePercent: parseFloat(quote["10. change percent"].replace('%', '')),
      };
      
      // Check if stock exists, update or create
      let stock = await storage.getStock(symbol);
      if (stock) {
        stock = await storage.updateStock(symbol, stockData);
      } else {
        stock = await storage.createStock(stockData);
      }
      
      res.json(stock);
    } catch (error) {
      console.error("Error fetching stock data:", error);
      res.status(500).json({ error: "Failed to fetch real-time stock data" });
    }
  });

  // Watchlist endpoints
  app.get("/api/watchlist", async (req, res) => {
    try {
      const watchlistItems = await storage.getWatchlist();
      
      // Enrich with stock data
      const enrichedItems = await Promise.all(
        watchlistItems.map(async (item) => {
          const stock = await storage.getStock(item.stockSymbol);
          return {
            ...item,
            stock,
          };
        })
      );
      
      res.json(enrichedItems);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch watchlist" });
    }
  });

  app.post("/api/watchlist", async (req, res) => {
    try {
      const watchlistItem = insertWatchlistItemSchema.parse(req.body);
      
      // Check if stock exists
      const stock = await storage.getStock(watchlistItem.stockSymbol);
      if (!stock) {
        return res.status(404).json({ error: "Stock not found" });
      }
      
      const newItem = await storage.addToWatchlist(watchlistItem);
      res.status(201).json(newItem);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid input data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to add to watchlist" });
    }
  });

  app.delete("/api/watchlist/:symbol", async (req, res) => {
    try {
      const { symbol } = req.params;
      const removed = await storage.removeFromWatchlist(symbol);
      
      if (!removed) {
        return res.status(404).json({ error: "Item not found in watchlist" });
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to remove from watchlist" });
    }
  });

  // Valuation endpoints
  app.get("/api/valuation/:symbol", async (req, res) => {
    try {
      const { symbol } = req.params;
      const inputs = await storage.getValuationInputs(symbol);
      
      if (!inputs) {
        // Return default values
        return res.json({
          stockSymbol: symbol,
          growthRate: 15,
          peRatio: 20,
          minimumReturn: 15,
        });
      }
      
      res.json(inputs);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch valuation inputs" });
    }
  });

  app.post("/api/valuation", async (req, res) => {
    try {
      const inputs = insertValuationInputsSchema.parse(req.body);
      const savedInputs = await storage.saveValuationInputs(inputs);
      
      // Calculate valuation metrics
      const stock = await storage.getStock(inputs.stockSymbol);
      if (!stock) {
        return res.status(404).json({ error: "Stock not found" });
      }
      
      const metrics = await storage.getFinancialMetrics(stock.id);
      const latestMetrics = metrics[metrics.length - 1];
      
      if (!latestMetrics) {
        return res.status(400).json({ error: "No financial data available for valuation" });
      }
      
      // Calculate sticker price and margin of safety
      const currentEPS = latestMetrics.eps || 0;
      const futureEPS = currentEPS * Math.pow(1 + inputs.growthRate / 100, 10);
      const futurePrice = futureEPS * inputs.peRatio;
      const stickerPrice = futurePrice / Math.pow(1 + inputs.minimumReturn / 100, 10);
      const mosPrice = stickerPrice * 0.5; // 50% margin of safety
      
      const recommendation = stock.price <= mosPrice ? "Buy" : 
                           stock.price <= stickerPrice ? "Watch" : "Wait";
      
      const valuation = {
        ...savedInputs,
        stickerPrice,
        mosPrice,
        recommendation,
        currentPrice: stock.price,
      };
      
      res.json(valuation);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid input data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to save valuation inputs" });
    }
  });

  // Comparison endpoint
  app.get("/api/compare/:symbol1/:symbol2", async (req, res) => {
    try {
      const { symbol1, symbol2 } = req.params;
      
      const [stock1, stock2] = await Promise.all([
        storage.getStockWithMetrics(symbol1),
        storage.getStockWithMetrics(symbol2),
      ]);
      
      if (!stock1 || !stock2) {
        return res.status(404).json({ error: "One or both stocks not found" });
      }
      
      res.json({ stock1, stock2 });
    } catch (error) {
      res.status(500).json({ error: "Failed to compare stocks" });
    }
  });

  // News endpoint
  app.get("/api/news", async (req, res) => {
    try {
      const news = await storage.getNews();
      res.json(news);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch news" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
