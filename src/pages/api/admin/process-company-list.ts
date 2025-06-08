import type { APIRoute } from 'astro';
import { companyListProcessor } from '@server/companyListProcessor'; // Use path alias

export const POST: APIRoute = async ({ request }) => {
  try {
    const missing = await companyListProcessor.findMissingCompanies();
    const added = await companyListProcessor.addMissingCompanies();

    return new Response(JSON.stringify({
      totalMissing: missing.length,
      companiesAdded: added,
      message: `Successfully added ${added} new companies to the platform`
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error("API error in /api/admin/process-company-list (POST):", error);
    return new Response(JSON.stringify({
      error: "Failed to process company list",
      message: error instanceof Error ? error.message : "An unknown error occurred"
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
};
