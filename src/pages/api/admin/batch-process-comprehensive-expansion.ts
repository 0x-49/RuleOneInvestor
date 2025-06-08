import type { APIRoute } from 'astro';
import { processMiddleEasternAfricanBatch } from '@server/batchProcessor10'; // Use path alias
import { processNordicBatch } from '@server/batchProcessor10'; // Use path alias
import { processAdditionalCanadianBatch } from '@server/batchProcessor10'; // Use path alias
import { processUSMidSmallCapBatch } from '@server/batchProcessor10'; // Use path alias
import { processRussell1000Batch } from '@server/batchProcessor11'; // Use path alias
import { processRussell2000Batch } from '@server/batchProcessor11'; // Use path alias
import { processConsumerStaplesBatch } from '@server/batchProcessor11'; // Use path alias

export const POST: APIRoute = async ({ request }) => {
  try {
    const processors = await Promise.all([
      processMiddleEasternAfricanBatch(),
      processNordicBatch(),
      processAdditionalCanadianBatch(),
      processUSMidSmallCapBatch(),
      processRussell1000Batch(),
      processRussell2000Batch(),
      processConsumerStaplesBatch()
    ]);

    const totalAdded = processors.reduce((sum, result) => sum + result.added, 0);
    const totalFailed = processors.reduce((sum, result) => sum + result.failed, 0);

    return new Response(JSON.stringify({
      companiesAdded: totalAdded,
      companiesFailed: totalFailed,
      message: `Comprehensive expansion batch processing complete: ${totalAdded} companies added, ${totalFailed} failed`
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error("API error in /api/admin/batch-process-comprehensive-expansion (POST):", error);
    return new Response(JSON.stringify({
      error: "Failed to process comprehensive expansion batch",
      message: error instanceof Error ? error.message : "An unknown error occurred"
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
};
