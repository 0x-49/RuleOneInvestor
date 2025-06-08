import type { APIRoute } from 'astro';
import { db } from '@server/db';
import { stocks } from '@shared/schema';
import { count, gte, lte, and } from 'drizzle-orm';

export const GET: APIRoute = async ({ request }) => {
  try {
    // Calculate companiesTracked
    const [trackedResult] = await db.select({ value: count() }).from(stocks);
    const companiesTracked = trackedResult?.value ?? 0;

    // Calculate analyzedToday
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const [analyzedResult] = await db.select({ value: count() }).from(stocks)
      .where(and(gte(stocks.lastUpdated, todayStart), lte(stocks.lastUpdated, todayEnd)));
    const analyzedToday = analyzedResult?.value ?? 0;

    // Placeholder for Rule One Quality - requires definition and calculation logic
    const avgRuleOneQuality = 0.73; // Placeholder - 73%

    // Placeholder for Avg Growth Rate - requires definition (e.g., avg EPS growth of top N stocks)
    const avgGrowthRate = 0.124; // Placeholder - 12.4%

    return new Response(JSON.stringify({
      companiesTracked,
      analyzedToday,
      avgRuleOneQuality,
      avgGrowthRate,
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error("API error in /api/dashboard-stats/summary:", error);
    // In a real application, you might want more sophisticated error handling
    return new Response(JSON.stringify({
      message: "Internal Server Error",
      error: error instanceof Error ? error.message : "An unknown error occurred"
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
};
