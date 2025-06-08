import type { APIRoute } from 'astro';
import { comprehensiveAnalysisService } from '@server/comprehensiveAnalysisService'; // Use path alias

export const POST: APIRoute = async ({ request }) => {
  try {
    const result = await comprehensiveAnalysisService.startComprehensiveAnalysis();

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error("API error in /api/admin/comprehensive-analysis/start (POST):", error);
    return new Response(JSON.stringify({
      error: "Failed to start comprehensive analysis",
      message: error instanceof Error ? error.message : "An unknown error occurred"
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
};
