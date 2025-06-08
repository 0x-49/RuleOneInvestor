import type { APIRoute } from 'astro';
import { storage } from '@server/storage'; // Use path alias
import { financialDataService } from '@server/financialDataService'; // Use path alias

export const GET: APIRoute = async ({ request }) => {
  try {
    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get('limit') as string) || 100;

    // Get popular stock symbols for screening
    let popularSymbols = [
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

    return new Response(JSON.stringify(stocksWithMetrics), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error("API error in /api/screening/stocks (GET):", error);
    return new Response(JSON.stringify({
      error: "Failed to fetch screening data",
      message: error instanceof Error ? error.message : "An unknown error occurred"
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
};
