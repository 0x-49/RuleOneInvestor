import type { APIRoute } from 'astro';
import { processAndStoreStockData } from '@server/populateStockData';
import { storage } from '@server/storage';

export const POST: APIRoute = async ({ params, request }) => {
  try {
    const { symbol } = params;
    if (!symbol || typeof symbol !== 'string') {
      return new Response(JSON.stringify({ error: "Stock symbol parameter is required and must be a string." }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }
    const upperSymbol = symbol.toUpperCase();

    console.log(`Processing/refreshing data for ${upperSymbol} via API call...`);

    const success = await processAndStoreStockData(upperSymbol);

    if (success) {
      // Fetch the potentially updated/new stock data to return it
      const stockWithMetrics = await storage.getStockWithMetrics(upperSymbol);
      if (stockWithMetrics) {
        return new Response(JSON.stringify({
          message: `Stock data for ${upperSymbol} processed/refreshed successfully.`,
          stock: stockWithMetrics
        }), {
          status: 200,
          headers: {
            'Content-Type': 'application/json'
          }
        });
      } else {
        // This case should ideally not happen if processAndStoreStockData succeeded
        // and the stock was indeed created/updated.
        console.warn(`Stock ${upperSymbol} processed but not found immediately after.`)
        return new Response(JSON.stringify({
          message: `Stock data for ${upperSymbol} processed/refreshed, but encountered an issue fetching updated details.`,
        }), {
          status: 200, // Still a success in terms of processing, but with a warning
          headers: {
            'Content-Type': 'application/json'
          }
        });
      }
    } else {
      return new Response(JSON.stringify({ error: `Failed to process/refresh stock data for ${upperSymbol}. Check server logs.` }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }
  } catch (error) {
    console.error(`Error in /api/stocks/:symbol/refresh (POST) for ${params.symbol}:`, error);
    return new Response(JSON.stringify({
      error: "Failed to process/refresh stock data",
      message: error instanceof Error ? error.message : "An unknown error occurred"
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
};
