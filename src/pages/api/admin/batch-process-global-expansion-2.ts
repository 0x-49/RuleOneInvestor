import type { APIRoute } from 'astro';
import { processFTSEEuropeanBatch } from '@server/batchProcessor14'; // Use path alias
import { processSP500RemainingBatch } from '@server/batchProcessor14'; // Use path alias
import { processTSXCanadianBatch } from '@server/batchProcessor14'; // Use path alias
import { processASXAustralianBatch } from '@server/batchProcessor14'; // Use path alias
import { processJSESouthAfricanBatch } from '@server/batchProcessor14'; // Use path alias

export const POST: APIRoute = async ({ request }) => {
  try {
    const processors = await Promise.all([
      processFTSEEuropeanBatch(),
      processSP500RemainingBatch(),
      processTSXCanadianBatch(),
      processASXAustralianBatch(),
      processJSESouthAfricanBatch()
    ]);

    const totalAdded = processors.reduce((sum, result) => sum + result.added, 0);
    const totalFailed = processors.reduce((sum, result) => sum + result.failed, 0);

    return new Response(JSON.stringify({
      companiesAdded: totalAdded,
      companiesFailed: totalFailed,
      message: `Global expansion batch processing complete (instance 2): ${totalAdded} companies added, ${totalFailed} failed`
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error("API error in /api/admin/batch-process-global-expansion-2 (POST):", error);
    return new Response(JSON.stringify({
      error: "Failed to process global expansion batch (instance 2)",
      message: error instanceof Error ? error.message : "An unknown error occurred"
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
};
