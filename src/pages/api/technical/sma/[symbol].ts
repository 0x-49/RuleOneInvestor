import type { APIRoute } from 'astro';
import { alphaVantageService } from '@server/alphaVantageService'; // Use path alias

export const GET: APIRoute = async ({ params, request }) => {
  try {
    const { symbol } = params;
    if (!symbol || typeof symbol !== 'string') {
      return new Response(JSON.stringify({ error: "Stock symbol parameter is required and must be a string." }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }

    const url = new URL(request.url);
    const period = url.searchParams.get('period') || '20'; // Default period to 20

    const smaData = await alphaVantageService.getSMA(symbol, 'daily', parseInt(period, 10));

    return new Response(JSON.stringify(smaData), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error(`API error in /api/technical/sma/:symbol (GET) for ${params.symbol}:`, error);
    return new Response(JSON.stringify({
      error: "Failed to fetch SMA data",
      message: error instanceof Error ? error.message : "An unknown error occurred"
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
};
