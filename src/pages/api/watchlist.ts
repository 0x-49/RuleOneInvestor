import type { APIRoute } from 'astro';
import { storage } from '@server/storage'; // Use path alias
import { insertWatchlistItemSchema } from '@shared/schema'; // Use path alias
import { z } from 'zod';

export const GET: APIRoute = async ({ request }) => {
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

    return new Response(JSON.stringify(enrichedItems), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error("API error in /api/watchlist (GET):", error);
    return new Response(JSON.stringify({
      error: "Failed to fetch watchlist",
      message: error instanceof Error ? error.message : "An unknown error occurred"
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const watchlistItem = insertWatchlistItemSchema.parse(body) as any; // Cast to any as a workaround

    // Check if stock exists
    const stockSymbol = watchlistItem.stockSymbol as string; // Now safe to cast to string
    const stock = await storage.getStock(stockSymbol);
    if (!stock) {
      return new Response(JSON.stringify({ error: "Stock not found" }), {
        status: 404,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }

    const newItem = await storage.addToWatchlist(watchlistItem);
    return new Response(JSON.stringify(newItem), {
      status: 201,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error("API error in /api/watchlist (POST):", error);
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify({ error: "Invalid input data", details: error.errors }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }
    return new Response(JSON.stringify({
      error: "Failed to add to watchlist",
      message: error instanceof Error ? error.message : "An unknown error occurred"
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
};
