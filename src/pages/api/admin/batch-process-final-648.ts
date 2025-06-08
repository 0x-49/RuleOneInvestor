import type { APIRoute } from 'astro';
import { processFinal648CompaniesBatch } from '@server/batchProcessor17'; // Use path alias

export const POST: APIRoute = async ({ request }) => {
  try {
    const result = await processFinal648CompaniesBatch();

    return new Response(JSON.stringify({
      companiesAdded: result.added,
      companiesFailed: result.failed,
      message: `Final 648 companies batch complete: ${result.added} companies added, ${result.failed} failed`
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error("API error in /api/admin/batch-process-final-648 (POST):", error);
    return new Response(JSON.stringify({
      error: "Failed to process final 648 companies batch",
      message: error instanceof Error ? error.message : "An unknown error occurred"
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
};
