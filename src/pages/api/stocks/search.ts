import type { APIRoute } from 'astro';
import { financialDataService } from '@server/financialDataService';

export const GET: APIRoute = async ({ request }) => {
  try {
    const url = new URL(request.url);
    const q = url.searchParams.get('q');

    if (!q) {
      return new Response(JSON.stringify({ error: "Query parameter 'q' is required" }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }

    // Search using live financial data APIs
    const stocks = await financialDataService.searchStocks(q);

    return new Response(JSON.stringify(stocks), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error("API error in /api/stocks/search:", error);
    return new Response(JSON.stringify({
      error: "Failed to search stocks",
      message: error instanceof Error ? error.message : "An unknown error occurred"
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
};
