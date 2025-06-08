import type { APIRoute } from 'astro';
import { processBatch } from '@server/batchProcessor'; // Use path alias

export const POST: APIRoute = async ({ request }) => {
  try {
    const result = await processBatch();

    return new Response(JSON.stringify({
      companiesAdded: result.added,
      companiesFailed: result.failed,
      message: `Batch processing complete: ${result.added} companies added, ${result.failed} failed`
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error("API error in /api/admin/batch-process (POST):", error);
    return new Response(JSON.stringify({
      error: "Failed to perform batch processing",
      message: error instanceof Error ? error.message : "An unknown error occurred"
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
};
