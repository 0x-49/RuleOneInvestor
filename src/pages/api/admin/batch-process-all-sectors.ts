import type { APIRoute } from 'astro';
import { processConsumerDiscretionaryBatch } from '@server/batchProcessor7'; // Use path alias
import { processIndustrialsBatch } from '@server/batchProcessor7'; // Use path alias
import { processMaterialsBatch } from '@server/batchProcessor7'; // Use path alias
import { processUtilitiesBatch } from '@server/batchProcessor7'; // Use path alias
import { processRealEstateBatch } from '@server/batchProcessor7'; // Use path alias
import { processTelecomBatch } from '@server/batchProcessor7'; // Use path alias

export const POST: APIRoute = async ({ request }) => {
  try {
    const processors = await Promise.all([
      processConsumerDiscretionaryBatch(),
      processIndustrialsBatch(),
      processMaterialsBatch(),
      processUtilitiesBatch(),
      processRealEstateBatch(),
      processTelecomBatch()
    ]);

    const totalAdded = processors.reduce((sum, result) => sum + result.added, 0);
    const totalFailed = processors.reduce((sum, result) => sum + result.failed, 0);

    return new Response(JSON.stringify({
      companiesAdded: totalAdded,
      companiesFailed: totalFailed,
      message: `All sectors batch processing complete: ${totalAdded} companies added, ${totalFailed} failed`
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error("API error in /api/admin/batch-process-all-sectors (POST):", error);
    return new Response(JSON.stringify({
      error: "Failed to process all sectors batch",
      message: error instanceof Error ? error.message : "An unknown error occurred"
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
};
