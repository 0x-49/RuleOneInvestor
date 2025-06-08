import type { APIRoute } from 'astro';
import { storage } from '@server/storage';
import { financialDataService } from '@server/financialDataService';

export const GET: APIRoute = async ({ params, request }) => {
  try {
    const { symbol } = params;
    if (!symbol) {
      return new Response(JSON.stringify({ error: "Stock symbol parameter is required" }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }

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
      return new Response(JSON.stringify({ error: "Stock not found" }), {
        status: 404,
        headers: {
          'Content-Type': 'application/json'
        }
      });
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

    return new Response(JSON.stringify(stockWithMetrics), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error(`API error in /api/stocks/:symbol (GET) for ${params.symbol}:`, error);
    return new Response(JSON.stringify({
      error: "Failed to fetch stock data",
      message: error instanceof Error ? error.message : "An unknown error occurred"
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
};
