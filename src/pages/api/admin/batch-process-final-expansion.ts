import type { APIRoute } from 'astro';
import { processRussell3000Batch } from '@server/batchProcessor12'; // Use path alias
import { processEmergingMarketsBatch } from '@server/batchProcessor12'; // Use path alias

export const POST: APIRoute = async ({ request }) => {
  try {
    const processors = await Promise.all([
      processRussell3000Batch(),
      processEmergingMarketsBatch()
    ]);

    const totalAdded = processors.reduce((sum, result) => sum + result.added, 0);
    const totalFailed = processors.reduce((sum, result) => sum + result.failed, 0);

    return new Response(JSON.stringify({
      companiesAdded: totalAdded,
      companiesFailed: totalFailed,
      message: `Final expansion batch processing complete: ${totalAdded} companies added, ${totalFailed} failed`
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error("API error in /api/admin/batch-process-final-expansion (POST):", error);
    return new Response(JSON.stringify({
      error: "Failed to process final expansion batch",
      message: error instanceof Error ? error.message : "An unknown error occurred"
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
};
