import type { APIRoute } from 'astro';
import { companyListProcessor } from '@server/companyListProcessor'; // Use path alias

export const GET: APIRoute = async ({ request }) => {
  try {
    const parsed = companyListProcessor.parseCompanyData();

    return new Response(JSON.stringify({
      totalParsed: parsed.length,
      sample: parsed.slice(0, 10)
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error("API error in /api/admin/test-parsing (GET):", error);
    return new Response(JSON.stringify({
      error: "Failed to test parsing",
      message: error instanceof Error ? error.message : "An unknown error occurred"
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
};
