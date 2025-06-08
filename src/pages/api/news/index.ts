import type { APIRoute } from 'astro';
import { storage } from '@server/storage'; // Use path alias

export const GET: APIRoute = async ({ request }) => {
  try {
    const news = await storage.getNews();
    return new Response(JSON.stringify(news), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error("API error in /api/news (GET):", error);
    return new Response(JSON.stringify({
      error: "Failed to fetch news",
      message: error instanceof Error ? error.message : "An unknown error occurred"
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
};
