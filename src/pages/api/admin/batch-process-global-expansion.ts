import type { APIRoute } from 'astro';
import { processEuropeanBatch as processEuropeanBatch8 } from '@server/batchProcessor8'; // Use path alias
import { processAsianBatch } from '@server/batchProcessor8'; // Use path alias
import { processAustralianBatch } from '@server/batchProcessor8'; // Use path alias
import { processChineseBatch } from '@server/batchProcessor9'; // Use path alias
import { processAdditionalJapaneseBatch } from '@server/batchProcessor9'; // Use path alias
import { processLatinAmericanBatch as processLatinAmericanBatch9 } from '@server/batchProcessor9'; // Use path alias

export const POST: APIRoute = async ({ request }) => {
  try {
    const processors = await Promise.all([
      processEuropeanBatch8(),
      processAsianBatch(),
      processAustralianBatch(),
      processChineseBatch(),
      processAdditionalJapaneseBatch(),
      processLatinAmericanBatch9()
    ]);

    const totalAdded = processors.reduce((sum, result) => sum + result.added, 0);
    const totalFailed = processors.reduce((sum, result) => sum + result.failed, 0);

    return new Response(JSON.stringify({
      companiesAdded: totalAdded,
      companiesFailed: totalFailed,
      message: `Global expansion batch processing complete: ${totalAdded} companies added, ${totalFailed} failed`
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error("API error in /api/admin/batch-process-global-expansion (POST):", error);
    return new Response(JSON.stringify({
      error: "Failed to process global expansion batch",
      message: error instanceof Error ? error.message : "An unknown error occurred"
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
};
