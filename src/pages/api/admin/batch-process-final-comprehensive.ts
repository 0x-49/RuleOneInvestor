import type { APIRoute } from 'astro';
import { processFinalComprehensiveBatch } from '@server/batchProcessor16'; // Use path alias

export const POST: APIRoute = async ({ request }) => {
  try {
    const result = await processFinalComprehensiveBatch();

    return new Response(JSON.stringify({
      companiesAdded: result.added,
      companiesFailed: result.failed,
      message: `Final comprehensive expansion complete: ${result.added} companies added, ${result.failed} failed`
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error("API error in /api/admin/batch-process-final-comprehensive (POST):", error);
    return new Response(JSON.stringify({
      error: "Failed to process final comprehensive expansion",
      message: error instanceof Error ? error.message : "An unknown error occurred"
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
};
