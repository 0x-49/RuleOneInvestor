// server/checkStockStatus.ts
import 'dotenv/config'; // Load environment variables
import { storage } from './storage'; // Assuming storage.ts is in the same directory and exports 'storage'
import {Stock} from '@shared/schema';

// PASTE THE NORMALIZED ARRAY OF SYMBOLS HERE
const symbolsToCheck: string[] = [
  // Example: 'AAPL', 'MSFT', 'AZN.LON', '600519.SHH', ...
  // This will be a very long list based on your input.
];

async function checkStockPresence() {
  if (!storage || typeof storage.getStockBySymbol !== 'function') {
    console.error("Storage module or getStockBySymbol method is not available. Ensure storage.ts is correctly set up.");
    return;
  }

  if (symbolsToCheck.length === 0) {
    console.log("No symbols provided in the symbolsToCheck array. Please populate it.");
    return;
  }

  console.log(`Starting check for ${symbolsToCheck.length} symbols...`);

  let foundCount = 0;
  let notFoundCount = 0;
  const notFoundSymbols: string[] = [];
  const foundSymbols: string[] = [];

  for (const symbol of symbolsToCheck) {
    try {
      const stock: Stock | undefined = await storage.getStockBySymbol(symbol);
      if (stock) {
        console.log(`FOUND: ${symbol}`);
        foundSymbols.push(symbol);
        foundCount++;
      } else {
        console.log(`NOT FOUND: ${symbol}`);
        notFoundSymbols.push(symbol);
        notFoundCount++;
      }
    } catch (error) {
      console.error(`Error checking symbol ${symbol}:`, error);
      notFoundSymbols.push(`${symbol} (error)`);
      notFoundCount++;
    }
  }

  console.log("\n--- Check Complete ---");
  console.log(`Total symbols checked: ${symbolsToCheck.length}`);
  console.log(`Found in database: ${foundCount}`);
  console.log(`Not found in database: ${notFoundCount}`);

  if (notFoundSymbols.length > 0) {
    console.log("\nSymbols NOT FOUND:");
    notFoundSymbols.forEach(s => console.log(`- ${s}`));
  }
  
  // Optional: Log found symbols if needed, for brevity usually not required if list is long
  // if (foundSymbols.length > 0) {
  //   console.log("\nSymbols FOUND:");
  //   foundSymbols.forEach(s => console.log(`- ${s}`));
  // }
}

checkStockPresence().catch(error => {
  console.error("An unexpected error occurred during the script execution:", error);
});
