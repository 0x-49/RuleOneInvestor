import type { APIRoute } from 'astro';
import { storage } from '@server/storage'; // Use path alias
import { insertValuationInputsSchema } from '@shared/schema'; // Use path alias
import { z } from 'zod';

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const inputs = insertValuationInputsSchema.parse(body) as any; // Cast to any as a workaround
    const savedInputs = await storage.saveValuationInputs(inputs);

    // Calculate valuation metrics
    const stock = await storage.getStock(inputs.stockSymbol as string); // Now safe to cast to string
    if (!stock) {
      return new Response(JSON.stringify({ error: "Stock not found" }), {
        status: 404,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }

    const metrics = await storage.getFinancialMetrics(stock.id);
    const latestMetrics = metrics[metrics.length - 1];

    if (!latestMetrics) {
      return new Response(JSON.stringify({ error: "No financial data available for valuation" }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }

    // Calculate sticker price and margin of safety
    const currentEPS = latestMetrics.eps || 0;
    
    // Ensure inputs are numbers before calculation
    const growthRate = inputs.growthRate ?? 0;
    const peRatio = inputs.peRatio ?? 0;
    const minimumReturn = inputs.minimumReturn ?? 0;

    const futureEPS = currentEPS * Math.pow(1 + growthRate / 100, 10);
    const futurePrice = futureEPS * peRatio;
    const stickerPrice = futurePrice / Math.pow(1 + minimumReturn / 100, 10);
    const mosPrice = stickerPrice * 0.5; // 50% margin of safety

    const recommendation = stock.price <= mosPrice ? "Buy" :
                           stock.price <= stickerPrice ? "Watch" : "Wait";

    const valuation = {
      ...savedInputs,
      stickerPrice,
      mosPrice,
      recommendation,
      currentPrice: stock.price,
    };

    return new Response(JSON.stringify(valuation), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error("API error in /api/valuation (POST):", error);
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify({ error: "Invalid input data", details: error.errors }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }
    return new Response(JSON.stringify({
      error: "Failed to save valuation inputs",
      message: error instanceof Error ? error.message : "An unknown error occurred"
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
};
