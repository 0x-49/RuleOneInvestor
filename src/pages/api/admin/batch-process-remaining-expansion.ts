import type { APIRoute } from 'astro';
import { processNASDAQRemainingBatch } from '@server/batchProcessor15'; // Use path alias
import { processNYSERemainingBatch } from '@server/batchProcessor15'; // Use path alias
import { processEuropeanETFsBatch } from '@server/batchProcessor15'; // Use path alias
import { processAsianTechBatch } from '@server/batchProcessor15'; // Use path alias
import { processLatinAmericanBatch as processLatinAmericanBatch15 } from '@server/batchProcessor15'; // Use path alias

export const POST: APIRoute = async ({ request }) => {
  try {
    const processors = await Promise.all([
      processNASDAQRemainingBatch(),
      processNYSERemainingBatch(),
      processEuropeanETFsBatch(),
      processAsianTechBatch(),
      processLatinAmericanBatch15()
    ]);

    const totalAdded = processors.reduce((sum, result) => sum + result.added, 0);
    const totalFailed = processors.reduce((sum, result) => sum + result.failed, 0);

    return new Response(JSON.stringify({
      companiesAdded: totalAdded,
      companiesFailed: totalFailed,
      message: `Remaining expansion batch processing complete: ${totalAdded} companies added, ${totalFailed} failed`
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error("API error in /api/admin/batch-process-remaining-expansion (POST):", error);
    return new Response(JSON.stringify({
      error: "Failed to process remaining expansion batch",
      message: error instanceof Error ? error.message : "An unknown error occurred"
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
};
