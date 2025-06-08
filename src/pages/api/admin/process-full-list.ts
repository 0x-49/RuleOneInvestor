import type { APIRoute } from 'astro';
import { storage } from '@server/storage'; // Use path alias
import { db } from '@server/db'; // Use path alias
import { stocks } from '@shared/schema'; // Use path alias
import { createReadStream } from 'fs';
import { join } from 'path';
import { createInterface } from 'readline';

export const POST: APIRoute = async ({ request }) => {
  try {
    // The file path needs to be relative to the project root or handled differently in Astro
    // For now, assuming the file is accessible at this path within the project structure
    const filePath = join(process.cwd(), 'attached_assets/Pasted-NVDA-NVIDIA-Corporation-2330-TAIWAN-SEMICONDUCTOR-MANUFACTURING-NOVO-B-NOVO-NORDISK-B-A-S-ASML-AS-1748786982199.txt');

    const fileStream = createReadStream(filePath);
    const rl = createInterface({
      input: fileStream,
      crlfDelay: Infinity
    });

    let addedCount = 0;
    let failedCount = 0;
    const failures: string[] = [];

    for await (const line of rl) {
      if (line.trim()) {
        const parts = line.includes('\t') ? line.split('\t') : line.split(/\s{2,}/);

        if (parts.length < 2) {
          const match = line.match(/^(\S+)\s+(.+)$/);
          if (match) {
            parts[0] = match[1];
            parts[1] = match[2];
          }
        }

        if (parts.length >= 2) {
          const symbol = parts[0].trim();
          const name = parts[1].trim();

          if (symbol && name) {
            try {
              // Check if company already exists
              const existing = await storage.getStock(symbol);
              if (!existing) {
                const exchange = symbol.match(/^\d+$/) ?
                  (symbol.length === 4 ? 'TSE' : symbol.length === 6 ? 'SSE' : 'ASIAN') :
                  (symbol.includes('_') ? 'EUROPEAN' :
                   symbol.length <= 4 && /^[A-Z]+$/.test(symbol) ? 'NASDAQ' : 'OTHER');

                  await storage.createStock({
                    symbol,
                    name,
                    exchange,
                    sector: 'Technology',
                    price: 0,
                    change: 0,
                    changePercent: 0,
                    volume: null,
                    marketCap: null
                  } as any); // Cast to any as a workaround for type error
                addedCount++;
              }
            } catch (error) {
              let errorMessage = 'Unknown error';
              if (error instanceof Error) {
                console.error(`Failed to add company ${symbol}: ${error.message}`, error.stack);
                errorMessage = error.message;
              } else {
                console.error(`Failed to add company ${symbol} (unknown error type):`, error);
              }
              failures.push(`${symbol}: ${errorMessage}`);
              failedCount++;
            }
          }
        }
      }
    }

    return new Response(JSON.stringify({
      totalLines: (await require('fs').promises.readFile(filePath, 'utf-8')).trim().split('\n').length, // Re-read to get total lines
      companiesAdded: addedCount,
      companiesFailed: failedCount,
      failures: failures.slice(0, 10), // Show first 10 failures
      message: `Processed companies. Added ${addedCount}, failed ${failedCount}`
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('API error in /api/admin/process-full-list (POST):', error);
    return new Response(JSON.stringify({
      error: 'Failed to process full company list',
      message: error instanceof Error ? error.message : "An unknown error occurred"
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
};
