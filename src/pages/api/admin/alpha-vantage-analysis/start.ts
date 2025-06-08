import type { APIRoute } from 'astro';
import { alphaVantageComprehensiveService } from '@server/alphaVantageComprehensiveService'; // Use path alias

export const POST: APIRoute = async ({ request }) => {
  try {
    const result = await alphaVantageComprehensiveService.startComprehensiveAnalysis();

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error("API error in /api/admin/alpha-vantage-analysis/start (POST):", error);
    return new Response(JSON.stringify({
      error: "Failed to start Alpha Vantage analysis",
      message: error instanceof Error ? error.message : "An unknown error occurred"
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
};
