import type { APIRoute } from 'astro';
import { processUSSmallCapBatch } from '@server/batchProcessor13'; // Use path alias
import { processEuropeanSmallCapBatch } from '@server/batchProcessor13'; // Use path alias
import { processAsianSmallCapBatch } from '@server/batchProcessor13'; // Use path alias
import { processEmergingMarketStocksBatch } from '@server/batchProcessor13'; // Use path alias
import { processCryptoStocksBatch } from '@server/batchProcessor13'; // Use path alias

export const POST: APIRoute = async ({ request }) => {
  try {
    const processors = await Promise.all([
      processUSSmallCapBatch(),
      processEuropeanSmallCapBatch(),
      processAsianSmallCapBatch(),
      processEmergingMarketStocksBatch(),
      processCryptoStocksBatch()
    ]);

    const totalAdded = processors.reduce((sum, result) => sum + result.added, 0);
    const totalFailed = processors.reduce((sum, result) => sum + result.failed, 0);

    return new Response(JSON.stringify({
      companiesAdded: totalAdded,
      companiesFailed: totalFailed,
      message: `Ultimate expansion batch processing complete: ${totalAdded} companies added, ${totalFailed} failed`
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error("API error in /api/admin/batch-process-ultimate-expansion (POST):", error);
    return new Response(JSON.stringify({
      error: "Failed to process ultimate expansion batch",
      message: error instanceof Error ? error.message : "An unknown error occurred"
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
};
