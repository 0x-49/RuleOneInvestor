import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ params, request }) => {
  try {
    const { processorName } = params;
    if (!processorName || typeof processorName !== 'string') {
      return new Response(JSON.stringify({ error: "Batch processor name parameter is required and must be a string." }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }

    // Dynamically import the correct batch processor module
    let batchProcessorModule;
    try {
      // Import with explicit file extension for dynamic imports
      batchProcessorModule = await import(`../../../../../../src/server/${processorName}.js`); // Use relative path with .js extension
    } catch (importError) {
      console.error(`Failed to import batch processor module ${processorName}:`, importError);
      return new Response(JSON.stringify({ error: `Batch processor module "${processorName}" not found.` }), {
        status: 404,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }

    // Assuming the function to call has the same name as the processorName (e.g., processBatch in batchProcessor.ts)
    // This might need adjustment if function names differ from file names.
    const processFunction = batchProcessorModule[processorName];

    if (typeof processFunction !== 'function') {
      return new Response(JSON.stringify({ error: `Function "${processorName}" not found or is not a function in the module.` }), {
        status: 404,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }

    const result = await processFunction();

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error(`API error in /api/admin/batch-process/:processorName (POST) for ${params.processorName}:`, error);
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
