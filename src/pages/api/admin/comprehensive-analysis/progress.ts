import type { APIRoute } from 'astro';
import { comprehensiveAnalysisService } from '@server/comprehensiveAnalysisService'; // Use path alias

export const GET: APIRoute = async ({ request }) => {
  try {
    const progress = comprehensiveAnalysisService.getBatchProgress();

    return new Response(JSON.stringify(progress), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error("API error in /api/admin/comprehensive-analysis/progress (GET):", error);
    return new Response(JSON.stringify({
      error: "Failed to get analysis progress",
      message: error instanceof Error ? error.message : "An unknown error occurred"
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
};
