import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { financialDataService } from "./financialDataService";
import { alphaVantageService } from "./alphaVantageService";
import { batchAnalysisService } from "./batchAnalysisService";
import { companyDataParser } from "./companyDataParser";
import { companyListProcessor } from "./companyListProcessor";
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

  // Force refresh financial data for a stock
  app.post("/api/stocks/:symbol/refresh", async (req, res) => {
    try {
      const { symbol } = req.params;
      const upperSymbol = symbol.toUpperCase();
      
      // Get or create stock
      let stock = await storage.getStock(upperSymbol);
      if (!stock) {
        const stockData = await financialDataService.fetchStockData(upperSymbol);
        if (stockData) {
          stock = await storage.createStock(stockData);
        }
      }
      
      if (!stock) {
        return res.status(404).json({ error: "Stock not found" });
      }
      
      // Force fetch fresh financial metrics
      console.log(`Force refreshing financial data for ${upperSymbol}`);
      
      // Clear existing metrics first to prevent duplicates
      await storage.clearFinancialMetrics(stock.id);
      
      const freshMetrics = await financialDataService.fetchFinancialMetrics(upperSymbol, stock.id, false);
      
      if (freshMetrics.length > 0) {
        // Store fresh metrics one by one to prevent duplicates
        const storedMetrics: any[] = [];
        for (const metric of freshMetrics) {
          try {
            const stored = await storage.createFinancialMetrics(metric);
            storedMetrics.push(stored);
          } catch (error) {
            console.warn(`Skipped duplicate metric for ${upperSymbol} year ${metric.year}`);
          }
        }
        
        console.log(`Successfully refreshed ${storedMetrics.length} years of data for ${upperSymbol}`);
        res.json({ message: "Financial data refreshed successfully", years: storedMetrics.length });
      } else {
        res.status(400).json({ error: "No financial data could be retrieved" });
      }
    } catch (error) {
      console.error("Error refreshing stock data:", error);
      res.status(500).json({ error: "Failed to refresh stock data" });
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

  // Stock refresh endpoint for fixing data issues
  app.post("/api/stocks/:symbol/refresh", async (req, res) => {
    try {
      const { symbol } = req.params;
      
      // Attempt to fetch fresh data from financial APIs
      const freshData = await financialDataService.fetchStockData(symbol);
      
      if (!freshData) {
        return res.status(404).json({ error: "No data available from financial providers" });
      }
      
      // Update existing stock or create new one
      let stock = await storage.getStock(symbol);
      if (stock) {
        stock = await storage.updateStock(symbol, freshData);
      } else {
        stock = await storage.createStock(freshData);
      }
      
      res.json({ message: "Stock data refreshed successfully", stock });
    } catch (error) {
      console.error("Error refreshing stock data:", error);
      res.status(500).json({ error: "Failed to refresh stock data" });
    }
  });

  // Quick analysis endpoint for international stocks
  app.post("/api/stocks/:symbol/quick-analysis", async (req, res) => {
    try {
      const { symbol } = req.params;
      
      // Use alternative data sources for international stocks
      const analysisData = await alphaVantageService.getDailyPrices(symbol);
      
      if (!analysisData || analysisData.length === 0) {
        return res.status(404).json({ error: "Unable to perform quick analysis - no market data available" });
      }
      
      // Create basic stock entry with available data
      const stockData = {
        symbol: symbol.toUpperCase(),
        name: symbol.toUpperCase(),
        price: analysisData[0]?.close || 0,
        change: 0,
        changePercent: 0,
        marketCap: null,
        exchange: "Unknown"
      };
      
      let stock = await storage.getStock(symbol);
      if (stock) {
        stock = await storage.updateStock(symbol, stockData);
      } else {
        stock = await storage.createStock(stockData);
      }
      
      res.json({ message: "Quick analysis completed", stock });
    } catch (error) {
      console.error("Error performing quick analysis:", error);
      res.status(500).json({ error: "Failed to perform quick analysis" });
    }
  });

  // Debug company parsing
  app.get("/api/admin/test-parsing", (req, res) => {
    const parsed = companyListProcessor.parseCompanyData();
    res.json({
      totalParsed: parsed.length,
      sample: parsed.slice(0, 10)
    });
  });

  // Process full company list directly
  app.post("/api/admin/process-full-list", async (req, res) => {
    try {
      const fs = require('fs');
      const path = require('path');
      const filePath = path.resolve('./attached_assets/Pasted-NVDA-NVIDIA-Corporation-2330-TAIWAN-SEMICONDUCTOR-MANUFACTURING-NOVO-B-NOVO-NORDISK-B-A-S-ASML-AS-1748786982199.txt');
      const fullData = fs.readFileSync(filePath, 'utf-8');
      const lines = fullData.trim().split('\n');
      
      let addedCount = 0;
      let failedCount = 0;
      const failures: string[] = [];
      
      for (const line of lines) {
        if (line.trim()) {
          const parts = line.includes('\t') ? line.split('\t') : line.split(/\s{2,}/);
          
          if (parts.length < 2) {
            const match = line.match(/^(\S+)\s+(.+)$/);
            if (match) {
              parts[0] = match[1];
              parts[1] = match[2];
            }
          }
          
          if (parts.length >= 2) {
            const symbol = parts[0].trim();
            const name = parts[1].trim();
            
            if (symbol && name) {
              try {
                // Check if company already exists
                const existing = await storage.getStock(symbol);
                if (!existing) {
                  const exchange = symbol.match(/^\d+$/) ? 
                    (symbol.length === 4 ? 'TSE' : symbol.length === 6 ? 'SSE' : 'ASIAN') :
                    (symbol.includes('_') ? 'EUROPEAN' : 
                     symbol.length <= 4 && /^[A-Z]+$/.test(symbol) ? 'NASDAQ' : 'OTHER');
                  
                  await storage.createStock({
                    symbol,
                    name,
                    exchange,
                    sector: 'Technology',
                    price: 0,
                    change: 0,
                    changePercent: 0,
                    volume: null,
                    marketCap: null
                  });
                  addedCount++;
                }
              } catch (error) {
                console.error(`Failed to add company ${symbol}:`, error);
                failures.push(`${symbol}: ${error.message}`);
                failedCount++;
              }
            }
          }
        }
      }
      
      res.json({
        totalLines: lines.length,
        companiesAdded: addedCount,
        companiesFailed: failedCount,
        failures: failures.slice(0, 10), // Show first 10 failures
        message: `Processed ${lines.length} companies. Added ${addedCount}, failed ${failedCount}`
      });
    } catch (error) {
      console.error('Error processing full company list:', error);
      res.status(500).json({ error: 'Failed to process full company list' });
    }
  });

  // Company list processing endpoint
  app.post("/api/admin/process-company-list", async (req, res) => {
    try {
      const missing = await companyListProcessor.findMissingCompanies();
      const added = await companyListProcessor.addMissingCompanies();
      
      res.json({
        totalMissing: missing.length,
        companiesAdded: added,
        message: `Successfully added ${added} new companies to the platform`
      });
    } catch (error) {
      console.error("Error processing company list:", error);
      res.status(500).json({ error: "Failed to process company list" });
    }
  });

  // Batch process remaining companies
  app.post("/api/admin/batch-process", async (req, res) => {
    try {
      const { processBatch } = await import('./batchProcessor');
      const result = await processBatch();
      
      res.json({
        companiesAdded: result.added,
        companiesFailed: result.failed,
        message: `Batch processing complete: ${result.added} companies added, ${result.failed} failed`
      });
    } catch (error) {
      console.error('Error in batch processing:', error);
      res.status(500).json({ error: 'Failed to process batch' });
    }
  });

  // Process Indian companies batch
  app.post("/api/admin/batch-process-indian", async (req, res) => {
    try {
      const { processIndianBatch } = await import('./batchProcessor2');
      const result = await processIndianBatch();
      
      res.json({
        companiesAdded: result.added,
        companiesFailed: result.failed,
        message: `Indian batch processing complete: ${result.added} companies added, ${result.failed} failed`
      });
    } catch (error) {
      console.error('Error in Indian batch processing:', error);
      res.status(500).json({ error: 'Failed to process Indian batch' });
    }
  });

  // Process European companies batch
  app.post("/api/admin/batch-process-european", async (req, res) => {
    try {
      const { processEuropeanBatch } = await import('./batchProcessor2');
      const result = await processEuropeanBatch();
      
      res.json({
        companiesAdded: result.added,
        companiesFailed: result.failed,
        message: `European batch processing complete: ${result.added} companies added, ${result.failed} failed`
      });
    } catch (error) {
      console.error('Error in European batch processing:', error);
      res.status(500).json({ error: 'Failed to process European batch' });
    }
  });

  // Process Canadian companies batch
  app.post("/api/admin/batch-process-canadian", async (req, res) => {
    try {
      const { processCanadianBatch } = await import('./batchProcessor3');
      const result = await processCanadianBatch();
      
      res.json({
        companiesAdded: result.added,
        companiesFailed: result.failed,
        message: `Canadian batch processing complete: ${result.added} companies added, ${result.failed} failed`
      });
    } catch (error) {
      console.error('Error in Canadian batch processing:', error);
      res.status(500).json({ error: 'Failed to process Canadian batch' });
    }
  });

  // Process Hong Kong companies batch
  app.post("/api/admin/batch-process-hongkong", async (req, res) => {
    try {
      const { processHongKongBatch } = await import('./batchProcessor3');
      const result = await processHongKongBatch();
      
      res.json({
        companiesAdded: result.added,
        companiesFailed: result.failed,
        message: `Hong Kong batch processing complete: ${result.added} companies added, ${result.failed} failed`
      });
    } catch (error) {
      console.error('Error in Hong Kong batch processing:', error);
      res.status(500).json({ error: 'Failed to process Hong Kong batch' });
    }
  });

  // Process global companies batch
  app.post("/api/admin/batch-process-global", async (req, res) => {
    try {
      const { processGlobalBatch } = await import('./batchProcessor3');
      const result = await processGlobalBatch();
      
      res.json({
        companiesAdded: result.added,
        companiesFailed: result.failed,
        message: `Global batch processing complete: ${result.added} companies added, ${result.failed} failed`
      });
    } catch (error) {
      console.error('Error in Global batch processing:', error);
      res.status(500).json({ error: 'Failed to process Global batch' });
    }
  });

  // Process mixed international companies batch
  app.post("/api/admin/batch-process-mixed", async (req, res) => {
    try {
      const { processMixedInternationalBatch } = await import('./batchProcessor4');
      const result = await processMixedInternationalBatch();
      
      res.json({
        companiesAdded: result.added,
        companiesFailed: result.failed,
        message: `Mixed international batch processing complete: ${result.added} companies added, ${result.failed} failed`
      });
    } catch (error) {
      console.error('Error in mixed international batch processing:', error);
      res.status(500).json({ error: 'Failed to process mixed international batch' });
    }
  });

  // Process additional US companies batch
  app.post("/api/admin/batch-process-additional-us", async (req, res) => {
    try {
      const { processAdditionalUSBatch } = await import('./batchProcessor4');
      const result = await processAdditionalUSBatch();
      
      res.json({
        companiesAdded: result.added,
        companiesFailed: result.failed,
        message: `Additional US batch processing complete: ${result.added} companies added, ${result.failed} failed`
      });
    } catch (error) {
      console.error('Error in additional US batch processing:', error);
      res.status(500).json({ error: 'Failed to process additional US batch' });
    }
  });

  // Process additional international companies batch
  app.post("/api/admin/batch-process-additional-international", async (req, res) => {
    try {
      const { processAdditionalInternationalBatch } = await import('./batchProcessor5');
      const result = await processAdditionalInternationalBatch();
      
      res.json({
        companiesAdded: result.added,
        companiesFailed: result.failed,
        message: `Additional international batch processing complete: ${result.added} companies added, ${result.failed} failed`
      });
    } catch (error) {
      console.error('Error in additional international batch processing:', error);
      res.status(500).json({ error: 'Failed to process additional international batch' });
    }
  });

  // Process ETFs batch
  app.post("/api/admin/batch-process-etfs", async (req, res) => {
    try {
      const { processETFsBatch } = await import('./batchProcessor5');
      const result = await processETFsBatch();
      
      res.json({
        companiesAdded: result.added,
        companiesFailed: result.failed,
        message: `ETFs batch processing complete: ${result.added} companies added, ${result.failed} failed`
      });
    } catch (error) {
      console.error('Error in ETFs batch processing:', error);
      res.status(500).json({ error: 'Failed to process ETFs batch' });
    }
  });

  // Process crypto companies batch
  app.post("/api/admin/batch-process-crypto", async (req, res) => {
    try {
      const { processCryptoBatch } = await import('./batchProcessor6');
      const result = await processCryptoBatch();
      
      res.json({
        companiesAdded: result.added,
        companiesFailed: result.failed,
        message: `Crypto batch processing complete: ${result.added} companies added, ${result.failed} failed`
      });
    } catch (error) {
      console.error('Error in crypto batch processing:', error);
      res.status(500).json({ error: 'Failed to process crypto batch' });
    }
  });

  // Process fintech companies batch
  app.post("/api/admin/batch-process-fintech", async (req, res) => {
    try {
      const { processFintechBatch } = await import('./batchProcessor6');
      const result = await processFintechBatch();
      
      res.json({
        companiesAdded: result.added,
        companiesFailed: result.failed,
        message: `Fintech batch processing complete: ${result.added} companies added, ${result.failed} failed`
      });
    } catch (error) {
      console.error('Error in fintech batch processing:', error);
      res.status(500).json({ error: 'Failed to process fintech batch' });
    }
  });

  // Process healthcare companies batch
  app.post("/api/admin/batch-process-healthcare", async (req, res) => {
    try {
      const { processHealthcareBatch } = await import('./batchProcessor6');
      const result = await processHealthcareBatch();
      
      res.json({
        companiesAdded: result.added,
        companiesFailed: result.failed,
        message: `Healthcare batch processing complete: ${result.added} companies added, ${result.failed} failed`
      });
    } catch (error) {
      console.error('Error in healthcare batch processing:', error);
      res.status(500).json({ error: 'Failed to process healthcare batch' });
    }
  });

  // Process energy companies batch
  app.post("/api/admin/batch-process-energy", async (req, res) => {
    try {
      const { processEnergyBatch } = await import('./batchProcessor6');
      const result = await processEnergyBatch();
      
      res.json({
        companiesAdded: result.added,
        companiesFailed: result.failed,
        message: `Energy batch processing complete: ${result.added} companies added, ${result.failed} failed`
      });
    } catch (error) {
      console.error('Error in energy batch processing:', error);
      res.status(500).json({ error: 'Failed to process energy batch' });
    }
  });

  // Process all remaining sectors to complete database expansion
  app.post("/api/admin/batch-process-all-sectors", async (req, res) => {
    try {
      const processors = await Promise.all([
        import('./batchProcessor7').then(m => m.processConsumerDiscretionaryBatch()),
        import('./batchProcessor7').then(m => m.processIndustrialsBatch()),
        import('./batchProcessor7').then(m => m.processMaterialsBatch()),
        import('./batchProcessor7').then(m => m.processUtilitiesBatch()),
        import('./batchProcessor7').then(m => m.processRealEstateBatch()),
        import('./batchProcessor7').then(m => m.processTelecomBatch())
      ]);

      const totalAdded = processors.reduce((sum, result) => sum + result.added, 0);
      const totalFailed = processors.reduce((sum, result) => sum + result.failed, 0);
      
      res.json({
        companiesAdded: totalAdded,
        companiesFailed: totalFailed,
        message: `All sectors batch processing complete: ${totalAdded} companies added, ${totalFailed} failed`
      });
    } catch (error) {
      console.error('Error in all sectors batch processing:', error);
      res.status(500).json({ error: 'Failed to process all sectors batch' });
    }
  });

  // Process major global markets to expand to 4000 companies
  app.post("/api/admin/batch-process-global-expansion", async (req, res) => {
    try {
      const processors = await Promise.all([
        import('./batchProcessor8').then(m => m.processEuropeanBatch()),
        import('./batchProcessor8').then(m => m.processAsianBatch()),
        import('./batchProcessor8').then(m => m.processAustralianBatch()),
        import('./batchProcessor9').then(m => m.processChineseBatch()),
        import('./batchProcessor9').then(m => m.processAdditionalJapaneseBatch()),
        import('./batchProcessor9').then(m => m.processLatinAmericanBatch())
      ]);

      const totalAdded = processors.reduce((sum, result) => sum + result.added, 0);
      const totalFailed = processors.reduce((sum, result) => sum + result.failed, 0);
      
      res.json({
        companiesAdded: totalAdded,
        companiesFailed: totalFailed,
        message: `Global expansion batch processing complete: ${totalAdded} companies added, ${totalFailed} failed`
      });
    } catch (error) {
      console.error('Error in global expansion batch processing:', error);
      res.status(500).json({ error: 'Failed to process global expansion batch' });
    }
  });

  // Process comprehensive global markets to reach 4000 companies
  app.post("/api/admin/batch-process-comprehensive-expansion", async (req, res) => {
    try {
      const processors = await Promise.all([
        import('./batchProcessor10').then(m => m.processMiddleEasternAfricanBatch()),
        import('./batchProcessor10').then(m => m.processNordicBatch()),
        import('./batchProcessor10').then(m => m.processAdditionalCanadianBatch()),
        import('./batchProcessor10').then(m => m.processUSMidSmallCapBatch()),
        import('./batchProcessor11').then(m => m.processRussell1000Batch()),
        import('./batchProcessor11').then(m => m.processRussell2000Batch()),
        import('./batchProcessor11').then(m => m.processConsumerStaplesBatch())
      ]);

      const totalAdded = processors.reduce((sum, result) => sum + result.added, 0);
      const totalFailed = processors.reduce((sum, result) => sum + result.failed, 0);
      
      res.json({
        companiesAdded: totalAdded,
        companiesFailed: totalFailed,
        message: `Comprehensive expansion batch processing complete: ${totalAdded} companies added, ${totalFailed} failed`
      });
    } catch (error) {
      console.error('Error in comprehensive expansion batch processing:', error);
      res.status(500).json({ error: 'Failed to process comprehensive expansion batch' });
    }
  });

  // Process final expansion to reach 4000 companies target
  app.post("/api/admin/batch-process-final-expansion", async (req, res) => {
    try {
      const processors = await Promise.all([
        import('./batchProcessor12').then(m => m.processRussell3000Batch()),
        import('./batchProcessor12').then(m => m.processEmergingMarketsBatch())
      ]);

      const totalAdded = processors.reduce((sum, result) => sum + result.added, 0);
      const totalFailed = processors.reduce((sum, result) => sum + result.failed, 0);
      
      res.json({
        companiesAdded: totalAdded,
        companiesFailed: totalFailed,
        message: `Final expansion batch processing complete: ${totalAdded} companies added, ${totalFailed} failed`
      });
    } catch (error) {
      console.error('Error in final expansion batch processing:', error);
      res.status(500).json({ error: 'Failed to process final expansion batch' });
    }
  });

  // Process ultimate expansion to reach 4000 companies target
  app.post("/api/admin/batch-process-ultimate-expansion", async (req, res) => {
    try {
      const processors = await Promise.all([
        import('./batchProcessor13').then(m => m.processUSSmallCapBatch()),
        import('./batchProcessor13').then(m => m.processEuropeanSmallCapBatch()),
        import('./batchProcessor13').then(m => m.processAsianSmallCapBatch()),
        import('./batchProcessor13').then(m => m.processEmergingMarketStocksBatch()),
        import('./batchProcessor13').then(m => m.processCryptoStocksBatch())
      ]);

      const totalAdded = processors.reduce((sum, result) => sum + result.added, 0);
      const totalFailed = processors.reduce((sum, result) => sum + result.failed, 0);
      
      res.json({
        companiesAdded: totalAdded,
        companiesFailed: totalFailed,
        message: `Ultimate expansion batch processing complete: ${totalAdded} companies added, ${totalFailed} failed`
      });
    } catch (error) {
      console.error('Error in ultimate expansion batch processing:', error);
      res.status(500).json({ error: 'Failed to process ultimate expansion batch' });
    }
  });

  // Process global expansion to reach 4000 companies target
  app.post("/api/admin/batch-process-global-expansion", async (req, res) => {
    try {
      const processors = await Promise.all([
        import('./batchProcessor14').then(m => m.processFTSEEuropeanBatch()),
        import('./batchProcessor14').then(m => m.processSP500RemainingBatch()),
        import('./batchProcessor14').then(m => m.processTSXCanadianBatch()),
        import('./batchProcessor14').then(m => m.processASXAustralianBatch()),
        import('./batchProcessor14').then(m => m.processJSESouthAfricanBatch())
      ]);

      const totalAdded = processors.reduce((sum, result) => sum + result.added, 0);
      const totalFailed = processors.reduce((sum, result) => sum + result.failed, 0);
      
      res.json({
        companiesAdded: totalAdded,
        companiesFailed: totalFailed,
        message: `Global expansion batch processing complete: ${totalAdded} companies added, ${totalFailed} failed`
      });
    } catch (error) {
      console.error('Error in global expansion batch processing:', error);
      res.status(500).json({ error: 'Failed to process global expansion batch' });
    }
  });

  // Process remaining expansion to reach 4000 companies target
  app.post("/api/admin/batch-process-remaining-expansion", async (req, res) => {
    try {
      const processors = await Promise.all([
        import('./batchProcessor15').then(m => m.processNASDAQRemainingBatch()),
        import('./batchProcessor15').then(m => m.processNYSERemainingBatch()),
        import('./batchProcessor15').then(m => m.processEuropeanETFsBatch()),
        import('./batchProcessor15').then(m => m.processAsianTechBatch()),
        import('./batchProcessor15').then(m => m.processLatinAmericanBatch())
      ]);

      const totalAdded = processors.reduce((sum, result) => sum + result.added, 0);
      const totalFailed = processors.reduce((sum, result) => sum + result.failed, 0);
      
      res.json({
        companiesAdded: totalAdded,
        companiesFailed: totalFailed,
        message: `Remaining expansion batch processing complete: ${totalAdded} companies added, ${totalFailed} failed`
      });
    } catch (error) {
      console.error('Error in remaining expansion batch processing:', error);
      res.status(500).json({ error: 'Failed to process remaining expansion batch' });
    }
  });

  // Process final comprehensive expansion to reach exactly 4000 companies
  app.post("/api/admin/batch-process-final-comprehensive", async (req, res) => {
    try {
      const result = await import('./batchProcessor16').then(m => m.processFinalComprehensiveBatch());
      
      res.json({
        companiesAdded: result.added,
        companiesFailed: result.failed,
        message: `Final comprehensive expansion complete: ${result.added} companies added, ${result.failed} failed`
      });
    } catch (error) {
      console.error('Error in final comprehensive expansion:', error);
      res.status(500).json({ error: 'Failed to process final comprehensive expansion' });
    }
  });

  // Company analysis report endpoint
  app.get("/api/admin/company-analysis", async (req, res) => {
    try {
      const parsed = companyListProcessor.parseCompanyData();
      const deduped = companyListProcessor.removeDuplicates(parsed);
      const duplicateReport = companyListProcessor.generateDuplicateReport();
      
      res.json({
        totalParsed: parsed.length,
        afterDeduplication: deduped.length,
        duplicateSymbols: duplicateReport.duplicateSymbols,
        similarNames: duplicateReport.similarNames
      });
    } catch (error) {
      console.error("Error generating company analysis:", error);
      res.status(500).json({ error: "Failed to generate company analysis" });
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

  // Enhanced Analysis API Routes using Alpha Vantage
  
  // News and Sentiment Analysis
  app.get("/api/news/:symbol", async (req, res) => {
    try {
      const { symbol } = req.params;
      const newsData = await alphaVantageService.getNewsAndSentiment(symbol);
      res.json(newsData);
    } catch (error) {
      console.error("Error fetching news:", error);
      res.status(500).json({ error: "Failed to fetch news data" });
    }
  });

  // Dividend Analysis
  app.get("/api/dividends/:symbol", async (req, res) => {
    try {
      const { symbol } = req.params;
      const dividendData = await alphaVantageService.getDividends(symbol);
      res.json(dividendData);
    } catch (error) {
      console.error("Error fetching dividends:", error);
      res.status(500).json({ error: "Failed to fetch dividend data" });
    }
  });

  // Technical Analysis - RSI
  app.get("/api/technical/rsi/:symbol", async (req, res) => {
    try {
      const { symbol } = req.params;
      const rsiData = await alphaVantageService.getRSI(symbol);
      res.json(rsiData);
    } catch (error) {
      console.error("Error fetching RSI:", error);
      res.status(500).json({ error: "Failed to fetch RSI data" });
    }
  });

  // Technical Analysis - MACD
  app.get("/api/technical/macd/:symbol", async (req, res) => {
    try {
      const { symbol } = req.params;
      const macdData = await alphaVantageService.getMACD(symbol);
      res.json(macdData);
    } catch (error) {
      console.error("Error fetching MACD:", error);
      res.status(500).json({ error: "Failed to fetch MACD data" });
    }
  });

  // Technical Analysis - Moving Averages
  app.get("/api/technical/sma/:symbol", async (req, res) => {
    try {
      const { symbol } = req.params;
      const { period = '20' } = req.query;
      const smaData = await alphaVantageService.getSMA(symbol, 'daily', parseInt(period as string));
      res.json(smaData);
    } catch (error) {
      console.error("Error fetching SMA:", error);
      res.status(500).json({ error: "Failed to fetch SMA data" });
    }
  });

  // Daily Price Data with Volume
  app.get("/api/technical/prices/:symbol", async (req, res) => {
    try {
      const { symbol } = req.params;
      const priceData = await alphaVantageService.getDailyPrices(symbol);
      res.json(priceData);
    } catch (error) {
      console.error("Error fetching price data:", error);
      res.status(500).json({ error: "Failed to fetch price data" });
    }
  });

  // Company list management endpoints
  app.get("/api/companies/analyze", async (req, res) => {
    try {
      const { companyListProcessor } = await import("./companyListProcessor");
      
      const duplicateReport = companyListProcessor.generateDuplicateReport();
      const missingCompanies = await companyListProcessor.findMissingCompanies();
      const existingCompanies = await companyListProcessor.getExistingCompanies();
      
      res.json({
        totalParsed: companyListProcessor.parseCompanyData().length,
        totalUnique: companyListProcessor.removeDuplicates(companyListProcessor.parseCompanyData()).length,
        totalExisting: existingCompanies.length,
        totalMissing: missingCompanies.length,
        duplicateSymbols: duplicateReport.duplicateSymbols,
        similarNames: duplicateReport.similarNames,
        missingCompanies: missingCompanies.slice(0, 100) // First 100 for preview
      });
    } catch (error) {
      console.error("Company analysis error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/companies/add-missing", async (req, res) => {
    try {
      const { companyListProcessor } = await import("./companyListProcessor");
      const addedCount = await companyListProcessor.addMissingCompanies();
      
      res.json({
        message: `Successfully added ${addedCount} new companies to the database`,
        addedCount
      });
    } catch (error) {
      console.error("Add missing companies error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
