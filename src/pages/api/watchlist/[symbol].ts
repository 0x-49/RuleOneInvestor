import type { APIRoute } from 'astro';
import { storage } from '@server/storage'; // Use path alias

export const DELETE: APIRoute = async ({ params, request }) => {
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

    const removed = await storage.removeFromWatchlist(symbol);

    if (!removed) {
      return new Response(JSON.stringify({ error: "Item not found in watchlist" }), {
        status: 404,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }

    return new Response(null, { status: 204 }); // 204 No Content on successful deletion
  } catch (error) {
    console.error(`API error in /api/watchlist/:symbol (DELETE) for ${params.symbol}:`, error);
    return new Response(JSON.stringify({
      error: "Failed to remove from watchlist",
      message: error instanceof Error ? error.message : "An unknown error occurred"
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
};
