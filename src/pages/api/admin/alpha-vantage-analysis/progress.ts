import type { APIRoute } from 'astro';
import { alphaVantageComprehensiveService } from '@server/alphaVantageComprehensiveService'; // Use path alias

export const GET: APIRoute = async ({ request }) => {
  try {
    const progress = alphaVantageComprehensiveService.getProgress();

    return new Response(JSON.stringify(progress), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error("API error in /api/admin/alpha-vantage-analysis/progress (GET):", error);
    return new Response(JSON.stringify({
      error: "Failed to get Alpha Vantage analysis progress",
      message: error instanceof Error ? error.message : "An unknown error occurred"
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
};
