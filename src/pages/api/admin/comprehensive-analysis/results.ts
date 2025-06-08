import type { APIRoute } from 'astro';
import { comprehensiveAnalysisService } from '@server/comprehensiveAnalysisService'; // Use path alias

export const GET: APIRoute = async ({ request }) => {
  try {
    const results = comprehensiveAnalysisService.getBatchResults();

    return new Response(JSON.stringify(results), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error("API error in /api/admin/comprehensive-analysis/results (GET):", error);
    return new Response(JSON.stringify({
      error: "Failed to get analysis results",
      message: error instanceof Error ? error.message : "An unknown error occurred"
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
};
