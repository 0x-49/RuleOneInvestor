import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { financialDataService } from "./financialDataService";
import { batchAnalysisService } from "./batchAnalysisService";
import { companyDataParser } from "./companyDataParser";
import { insertStockSchema, insertWatchlistItemSchema, insertValuationInputsSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication middleware
  await setupAuth(app);
  
  // Add explicit API route handling middleware
  app.use('/api', (req, res, next) => {
    res.setHeader('Content-Type', 'application/json');
    next();
  });

  // Authentication routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      // For Google OAuth, user is directly available from req.user
      const user = req.user;
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });
  
  // Stock search endpoint
  app.get("/api/stocks/search", async (req, res) => {
    try {
      const { q } = req.query;
      if (!q || typeof q !== 'string') {
        return res.status(400).json({ error: "Query parameter 'q' is required" });
      }
      
      // Search using live financial data APIs
      const stocks = await financialDataService.searchStocks(q);
      res.json(stocks);
    } catch (error) {
      console.error("Error searching stocks:", error);
      res.status(500).json({ error: "Failed to search stocks" });
    }
  });

  // Get stock with metrics
  app.get("/api/stocks/:symbol", async (req, res) => {
    try {
      const { symbol } = req.params;
      const upperSymbol = symbol.toUpperCase();
      
      // Try to get from database first
      let stock = await storage.getStock(upperSymbol);
      
      if (!stock) {
        // Fetch from live APIs if not in database
        const stockData = await financialDataService.fetchStockData(upperSymbol);
        if (stockData) {
          stock = await storage.createStock(stockData);
        }
      }
      
      if (!stock) {
        return res.status(404).json({ error: "Stock not found" });
      }
      
      // Get financial metrics
      let metrics = await storage.getFinancialMetrics(stock.id);
      
      if (!metrics || metrics.length === 0) {
        // Fetch from live APIs if not in database
        console.log(`Fetching financial metrics for ${upperSymbol} with stock ID ${stock.id}`);
        const liveMetrics = await financialDataService.fetchFinancialMetrics(upperSymbol, stock.id);
        console.log(`Retrieved ${liveMetrics.length} metrics for ${upperSymbol}`);
        if (liveMetrics.length > 0) {
          // Store metrics in database
          for (const metric of liveMetrics) {
            await storage.createFinancialMetrics(metric);
          }
          metrics = await storage.getFinancialMetrics(stock.id);
          console.log(`Stored and retrieved ${metrics.length} metrics for ${upperSymbol}`);
        } else {
          console.log(`No financial metrics retrieved for ${upperSymbol}`);
        }
      }
      
      // Return stock with metrics and calculated data
      const stockWithMetrics = await storage.getStockWithMetrics(upperSymbol);
      res.json(stockWithMetrics);
    } catch (error) {
      console.error("Error fetching stock:", error);
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

  // Deep search API route - extract financial data from SEC filings using AI
  app.post("/api/stocks/:symbol/deep-search", async (req, res) => {
    try {
      const { symbol } = req.params;
      
      // Get or create the stock first
      let stock = await storage.getStock(symbol.toUpperCase());
      if (!stock) {
        const stockData = await financialDataService.fetchStockData(symbol);
        if (!stockData) {
          return res.status(404).json({ error: "Stock not found" });
        }
        stock = await storage.createStock(stockData);
      }
      
      // Perform deep search with AI extraction from SEC filings
      const metrics = await financialDataService.fetchFinancialMetrics(symbol, stock.id, true);
      
      if (metrics.length === 0) {
        return res.status(404).json({ 
          error: "No financial data could be extracted from SEC filings",
          message: "The AI agent was unable to locate sufficient financial data in company filings"
        });
      }
      
      // Store the extracted metrics
      for (const metric of metrics) {
        await storage.createFinancialMetrics(metric);
      }
      
      const stockWithMetrics = await storage.getStockWithMetrics(symbol.toUpperCase());
      
      res.json({
        success: true,
        yearsFound: metrics.length,
        stockData: stockWithMetrics,
        message: `Successfully extracted ${metrics.length} years of financial data from SEC filings`
      });
      
    } catch (error) {
      console.error("Deep search error:", error);
      res.status(500).json({ 
        error: "Deep search failed",
        message: "AI extraction from SEC filings encountered an error"
      });
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

  // Screening endpoints
  app.get("/api/screening/stocks", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 100;
      
      // Get popular stock symbols for screening
      const popularSymbols = [
        'AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA', 'META', 'NVDA', 'BRK.B', 'UNH', 'JNJ',
        'V', 'WMT', 'JPM', 'MA', 'PG', 'CVX', 'HD', 'PFE', 'BAC', 'ABBV',
        'KO', 'AVGO', 'PEP', 'COST', 'TMO', 'MRK', 'ACN', 'CSCO', 'ABT', 'DHR',
        'VZ', 'NKE', 'ADBE', 'TXN', 'NEE', 'CRM', 'BMY', 'PM', 'T', 'HON',
        'QCOM', 'LOW', 'LIN', 'UPS', 'MDT', 'IBM', 'CAT', 'SBUX', 'GS', 'CVS',
        'AMGN', 'DE', 'RTX', 'BLK', 'ELV', 'AXP', 'GILD', 'AMT', 'SYK', 'TJX',
        'BKNG', 'VRTX', 'ADP', 'MDLZ', 'ZTS', 'ADI', 'LRCX', 'MU', 'C', 'PLD',
        'MMC', 'FIS', 'NOW', 'SHW', 'CME', 'TGT', 'MO', 'USB', 'EOG', 'NSC',
        'DUK', 'KLAC', 'AON', 'ICE', 'WM', 'CL', 'APD', 'GD', 'ITW', 'EMR',
        'PYPL', 'COF', 'SO', 'NFLX', 'INTU', 'CCI', 'FCX', 'PNC', 'F', 'GM'
      ];

      // Extend with international stocks for larger limits
      if (limit > 100) {
        popularSymbols.push(
          'SNOW', 'ROKU', 'PLTR', 'RIVN', 'UBER', 'LYFT', 'DOCU', 'ZM', 'PTON', 'SHOP',
          'SQ', 'HOOD', 'COIN', 'RBLX', 'U', 'DKNG', 'CRWD', 'OKTA', 'TWLO', 'NET'
        );
      }

      const symbolsToFetch = popularSymbols.slice(0, limit);
      const stocksWithMetrics = [];

      // Fetch stock data with live APIs
      for (const symbol of symbolsToFetch.slice(0, Math.min(50, symbolsToFetch.length))) {
        try {
          let stock = await storage.getStock(symbol);
          
          if (!stock) {
            const stockData = await financialDataService.fetchStockData(symbol);
            if (stockData) {
              stock = await storage.createStock(stockData);
            }
          }
          
          if (stock) {
            let metrics = await storage.getFinancialMetrics(stock.id);
            
            if (!metrics || metrics.length === 0) {
              const liveMetrics = await financialDataService.fetchFinancialMetrics(symbol, stock.id);
              if (liveMetrics.length > 0) {
                for (const metric of liveMetrics) {
                  await storage.createFinancialMetrics(metric);
                }
                metrics = await storage.getFinancialMetrics(stock.id);
              }
            }
            
            const stockWithMetrics = await storage.getStockWithMetrics(symbol);
            if (stockWithMetrics) {
              stocksWithMetrics.push(stockWithMetrics);
            }
          }
        } catch (error) {
          console.error(`Error fetching data for ${symbol}:`, error);
        }
      }

      res.json(stocksWithMetrics);
    } catch (error) {
      console.error("Error in screening endpoint:", error);
      res.status(500).json({ error: "Failed to fetch screening data" });
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

  // Batch analysis routes for processing 400+ companies
  app.post('/api/batch/start', isAuthenticated, async (req, res) => {
    try {
      const companies = companyDataParser.parseCompanyList();
      const result = await batchAnalysisService.processBatchAnalysis(companies);
      res.json(result);
    } catch (error) {
      console.error('Error starting batch analysis:', error);
      res.status(500).json({ error: 'Failed to start batch analysis' });
    }
  });

  app.get('/api/batch/progress', isAuthenticated, async (req, res) => {
    try {
      const progress = batchAnalysisService.getBatchProgress();
      res.json(progress);
    } catch (error) {
      console.error('Error fetching batch progress:', error);
      res.status(500).json({ error: 'Failed to fetch batch progress' });
    }
  });

  app.get('/api/batch/results', isAuthenticated, async (req, res) => {
    try {
      const results = batchAnalysisService.getBatchResults();
      res.json(results);
    } catch (error) {
      console.error('Error fetching batch results:', error);
      res.status(500).json({ error: 'Failed to fetch batch results' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
