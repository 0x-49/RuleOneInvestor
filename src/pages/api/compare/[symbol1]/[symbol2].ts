import type { APIRoute } from 'astro';
import { storage } from '@server/storage'; // Use path alias

export const GET: APIRoute = async ({ params, request }) => {
  try {
    const { symbol1, symbol2 } = params;
    if (!symbol1 || typeof symbol1 !== 'string' || !symbol2 || typeof symbol2 !== 'string') {
      return new Response(JSON.stringify({ error: "Both stock symbol parameters are required and must be strings." }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }

    const [stock1, stock2] = await Promise.all([
      storage.getStockWithMetrics(symbol1.toUpperCase()),
      storage.getStockWithMetrics(symbol2.toUpperCase()),
    ]);

    if (!stock1 || !stock2) {
      return new Response(JSON.stringify({ error: "One or both stocks not found" }), {
        status: 404,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }

    return new Response(JSON.stringify({ stock1, stock2 }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error(`API error in /api/compare/:symbol1/:symbol2 (GET) for ${params.symbol1}, ${params.symbol2}:`, error);
    return new Response(JSON.stringify({
      error: "Failed to compare stocks",
      message: error instanceof Error ? error.message : "An unknown error occurred"
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
};
