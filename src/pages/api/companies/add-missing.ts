import type { APIRoute } from 'astro';
import { companyListProcessor } from '@server/companyListProcessor'; // Use path alias

export const POST: APIRoute = async ({ request }) => {
  try {
    const addedCount = await companyListProcessor.addMissingCompanies();

    return new Response(JSON.stringify({
      message: `Successfully added ${addedCount} new companies to the database`,
      addedCount
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error("API error in /api/companies/add-missing (POST):", error);
    return new Response(JSON.stringify({
      error: "Failed to add missing companies",
      message: error instanceof Error ? error.message : "An unknown error occurred"
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
};
