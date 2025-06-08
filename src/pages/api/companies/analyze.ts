import type { APIRoute } from 'astro';
import { companyListProcessor } from '@server/companyListProcessor'; // Use path alias
import { storage } from '@server/storage'; // Use path alias

export const GET: APIRoute = async ({ request }) => {
  try {
    const parsed = companyListProcessor.parseCompanyData();
    const deduped = companyListProcessor.removeDuplicates(parsed);
    const duplicateReport = companyListProcessor.generateDuplicateReport();
    const missingCompanies = await companyListProcessor.findMissingCompanies();
    const existingCompanies = await companyListProcessor.getExistingCompanies();

    return new Response(JSON.stringify({
      totalParsed: parsed.length,
      totalUnique: deduped.length,
      totalExisting: existingCompanies.length,
      totalMissing: missingCompanies.length,
      duplicateSymbols: duplicateReport.duplicateSymbols,
      similarNames: duplicateReport.similarNames,
      missingCompanies: missingCompanies.slice(0, 100) // First 100 for preview
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error("API error in /api/companies/analyze (GET):", error);
    return new Response(JSON.stringify({
      error: "Failed to generate company analysis",
      message: error instanceof Error ? error.message : "An unknown error occurred"
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
};
