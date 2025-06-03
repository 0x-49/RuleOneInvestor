import { storage } from './storage';

// Major consumer discretionary companies
const consumerDiscretionaryCompanies = [
  { symbol: 'AMZN', name: 'Amazon.com, Inc.' },
  { symbol: 'TSLA', name: 'Tesla, Inc.' },
  { symbol: 'HD', name: 'The Home Depot, Inc.' },
  { symbol: 'MCD', name: 'McDonald\'s Corporation' },
  { symbol: 'SBUX', name: 'Starbucks Corporation' },
  { symbol: 'NKE', name: 'NIKE, Inc.' },
  { symbol: 'LOW', name: 'Lowe\'s Companies, Inc.' },
  { symbol: 'TJX', name: 'The TJX Companies, Inc.' },
  { symbol: 'BKNG', name: 'Booking Holdings Inc.' },
  { symbol: 'CMG', name: 'Chipotle Mexican Grill, Inc.' },
  { symbol: 'LULU', name: 'Lululemon Athletica Inc.' },
  { symbol: 'ORLY', name: 'O\'Reilly Automotive, Inc.' },
  { symbol: 'AZO', name: 'AutoZone, Inc.' },
  { symbol: 'ULTA', name: 'Ulta Beauty, Inc.' },
  { symbol: 'BBY', name: 'Best Buy Co., Inc.' },
  { symbol: 'EBAY', name: 'eBay Inc.' },
  { symbol: 'ETSY', name: 'Etsy, Inc.' },
  { symbol: 'ABNB', name: 'Airbnb, Inc.' },
  { symbol: 'UBER', name: 'Uber Technologies, Inc.' },
  { symbol: 'LYFT', name: 'Lyft, Inc.' }
];

// Major industrial companies
const industrialCompanies = [
  { symbol: 'BA', name: 'The Boeing Company' },
  { symbol: 'CAT', name: 'Caterpillar Inc.' },
  { symbol: 'GE', name: 'General Electric Company' },
  { symbol: 'HON', name: 'Honeywell International Inc.' },
  { symbol: 'UPS', name: 'United Parcel Service, Inc.' },
  { symbol: 'LMT', name: 'Lockheed Martin Corporation' },
  { symbol: 'RTX', name: 'RTX Corporation' },
  { symbol: 'DE', name: 'Deere & Company' },
  { symbol: 'MMM', name: '3M Company' },
  { symbol: 'FDX', name: 'FedEx Corporation' },
  { symbol: 'NOC', name: 'Northrop Grumman Corporation' },
  { symbol: 'GD', name: 'General Dynamics Corporation' },
  { symbol: 'CSX', name: 'CSX Corporation' },
  { symbol: 'UNP', name: 'Union Pacific Corporation' },
  { symbol: 'NSC', name: 'Norfolk Southern Corporation' },
  { symbol: 'LUV', name: 'Southwest Airlines Co.' },
  { symbol: 'AAL', name: 'American Airlines Group Inc.' },
  { symbol: 'DAL', name: 'Delta Air Lines, Inc.' },
  { symbol: 'UAL', name: 'United Airlines Holdings, Inc.' },
  { symbol: 'ALK', name: 'Alaska Air Group, Inc.' }
];

// Major materials companies
const materialsCompanies = [
  { symbol: 'LIN', name: 'Linde plc' },
  { symbol: 'SHW', name: 'The Sherwin-Williams Company' },
  { symbol: 'FCX', name: 'Freeport-McMoRan Inc.' },
  { symbol: 'NEM', name: 'Newmont Corporation' },
  { symbol: 'DOW', name: 'Dow Inc.' },
  { symbol: 'DD', name: 'DuPont de Nemours, Inc.' },
  { symbol: 'ECL', name: 'Ecolab Inc.' },
  { symbol: 'APD', name: 'Air Products and Chemicals, Inc.' },
  { symbol: 'PPG', name: 'PPG Industries, Inc.' },
  { symbol: 'IFF', name: 'International Flavors & Fragrances Inc.' },
  { symbol: 'CTVA', name: 'Corteva, Inc.' },
  { symbol: 'EMN', name: 'Eastman Chemical Company' },
  { symbol: 'FMC', name: 'FMC Corporation' },
  { symbol: 'ALB', name: 'Albemarle Corporation' },
  { symbol: 'CF', name: 'CF Industries Holdings, Inc.' },
  { symbol: 'MOS', name: 'The Mosaic Company' },
  { symbol: 'PKG', name: 'Packaging Corporation of America' },
  { symbol: 'GOLD', name: 'Barrick Gold Corporation' },
  { symbol: 'AEM', name: 'Agnico Eagle Mines Limited' },
  { symbol: 'KGC', name: 'Kinross Gold Corporation' }
];

// Major utilities companies
const utilitiesCompanies = [
  { symbol: 'NEE', name: 'NextEra Energy, Inc.' },
  { symbol: 'DUK', name: 'Duke Energy Corporation' },
  { symbol: 'SO', name: 'The Southern Company' },
  { symbol: 'D', name: 'Dominion Energy, Inc.' },
  { symbol: 'EXC', name: 'Exelon Corporation' },
  { symbol: 'XEL', name: 'Xcel Energy Inc.' },
  { symbol: 'WEC', name: 'WEC Energy Group, Inc.' },
  { symbol: 'PPL', name: 'PPL Corporation' },
  { symbol: 'EIX', name: 'Edison International' },
  { symbol: 'AWK', name: 'American Water Works Company, Inc.' },
  { symbol: 'PCG', name: 'PG&E Corporation' },
  { symbol: 'ED', name: 'Consolidated Edison, Inc.' },
  { symbol: 'ES', name: 'Eversource Energy' },
  { symbol: 'FE', name: 'FirstEnergy Corp.' },
  { symbol: 'ETR', name: 'Entergy Corporation' },
  { symbol: 'CNP', name: 'CenterPoint Energy, Inc.' },
  { symbol: 'NI', name: 'NiSource Inc.' },
  { symbol: 'AEE', name: 'Ameren Corporation' },
  { symbol: 'CMS', name: 'CMS Energy Corporation' },
  { symbol: 'DTE', name: 'DTE Energy Co.' }
];

// Major real estate companies
const realEstateCompanies = [
  { symbol: 'PLD', name: 'Prologis, Inc.' },
  { symbol: 'AMT', name: 'American Tower Corporation' },
  { symbol: 'CCI', name: 'Crown Castle Inc.' },
  { symbol: 'EQIX', name: 'Equinix, Inc.' },
  { symbol: 'WELL', name: 'Welltower Inc.' },
  { symbol: 'DLR', name: 'Digital Realty Trust, Inc.' },
  { symbol: 'PSA', name: 'Public Storage' },
  { symbol: 'SPG', name: 'Simon Property Group, Inc.' },
  { symbol: 'O', name: 'Realty Income Corporation' },
  { symbol: 'CBRE', name: 'CBRE Group, Inc.' },
  { symbol: 'VTR', name: 'Ventas, Inc.' },
  { symbol: 'EXR', name: 'Extended Stay America, Inc.' },
  { symbol: 'UDR', name: 'UDR, Inc.' },
  { symbol: 'ESS', name: 'Essex Property Trust, Inc.' },
  { symbol: 'MAA', name: 'Mid-America Apartment Communities, Inc.' },
  { symbol: 'ARE', name: 'Alexandria Real Estate Equities, Inc.' },
  { symbol: 'INVH', name: 'Invitation Homes Inc.' },
  { symbol: 'EQR', name: 'Equity Residential' },
  { symbol: 'AVB', name: 'AvalonBay Communities, Inc.' },
  { symbol: 'HST', name: 'Host Hotels & Resorts, Inc.' }
];

// Major telecommunications companies
const telecomCompanies = [
  { symbol: 'VZ', name: 'Verizon Communications Inc.' },
  { symbol: 'T', name: 'AT&T Inc.' },
  { symbol: 'TMUS', name: 'T-Mobile US, Inc.' },
  { symbol: 'CHTR', name: 'Charter Communications, Inc.' },
  { symbol: 'CMCSA', name: 'Comcast Corporation' },
  { symbol: 'DIS', name: 'The Walt Disney Company' },
  { symbol: 'NFLX', name: 'Netflix, Inc.' },
  { symbol: 'VIA', name: 'ViacomCBS Inc.' },
  { symbol: 'FOX', name: 'Fox Corporation' },
  { symbol: 'FOXA', name: 'Fox Corporation' },
  { symbol: 'DISH', name: 'DISH Network Corporation' },
  { symbol: 'SIRI', name: 'Sirius XM Holdings Inc.' },
  { symbol: 'WBD', name: 'Warner Bros. Discovery, Inc.' },
  { symbol: 'PARA', name: 'Paramount Global' },
  { symbol: 'ROKU', name: 'Roku, Inc.' },
  { symbol: 'SPOT', name: 'Spotify Technology S.A.' },
  { symbol: 'PINS', name: 'Pinterest, Inc.' },
  { symbol: 'SNAP', name: 'Snap Inc.' },
  { symbol: 'TWTR', name: 'Twitter, Inc.' },
  { symbol: 'ZM', name: 'Zoom Video Communications, Inc.' }
];

export async function processConsumerDiscretionaryBatch(): Promise<{ added: number, failed: number }> {
  let added = 0;
  let failed = 0;

  for (const company of consumerDiscretionaryCompanies) {
    try {
      const existing = await storage.getStock(company.symbol);
      if (!existing) {
        await storage.createStock({
          symbol: company.symbol,
          name: company.name,
          exchange: 'NASDAQ',
          sector: 'Consumer Discretionary',
          price: 0,
          change: 0,
          changePercent: 0,
          volume: null,
          marketCap: null
        });
        added++;
      }
    } catch (error) {
      console.error(`Failed to add ${company.symbol}:`, error);
      failed++;
    }
  }

  return { added, failed };
}

export async function processIndustrialsBatch(): Promise<{ added: number, failed: number }> {
  let added = 0;
  let failed = 0;

  for (const company of industrialCompanies) {
    try {
      const existing = await storage.getStock(company.symbol);
      if (!existing) {
        await storage.createStock({
          symbol: company.symbol,
          name: company.name,
          exchange: 'NYSE',
          sector: 'Industrials',
          price: 0,
          change: 0,
          changePercent: 0,
          volume: null,
          marketCap: null
        });
        added++;
      }
    } catch (error) {
      console.error(`Failed to add ${company.symbol}:`, error);
      failed++;
    }
  }

  return { added, failed };
}

export async function processMaterialsBatch(): Promise<{ added: number, failed: number }> {
  let added = 0;
  let failed = 0;

  for (const company of materialsCompanies) {
    try {
      const existing = await storage.getStock(company.symbol);
      if (!existing) {
        await storage.createStock({
          symbol: company.symbol,
          name: company.name,
          exchange: 'NYSE',
          sector: 'Materials',
          price: 0,
          change: 0,
          changePercent: 0,
          volume: null,
          marketCap: null
        });
        added++;
      }
    } catch (error) {
      console.error(`Failed to add ${company.symbol}:`, error);
      failed++;
    }
  }

  return { added, failed };
}

export async function processUtilitiesBatch(): Promise<{ added: number, failed: number }> {
  let added = 0;
  let failed = 0;

  for (const company of utilitiesCompanies) {
    try {
      const existing = await storage.getStock(company.symbol);
      if (!existing) {
        await storage.createStock({
          symbol: company.symbol,
          name: company.name,
          exchange: 'NYSE',
          sector: 'Utilities',
          price: 0,
          change: 0,
          changePercent: 0,
          volume: null,
          marketCap: null
        });
        added++;
      }
    } catch (error) {
      console.error(`Failed to add ${company.symbol}:`, error);
      failed++;
    }
  }

  return { added, failed };
}

export async function processRealEstateBatch(): Promise<{ added: number, failed: number }> {
  let added = 0;
  let failed = 0;

  for (const company of realEstateCompanies) {
    try {
      const existing = await storage.getStock(company.symbol);
      if (!existing) {
        await storage.createStock({
          symbol: company.symbol,
          name: company.name,
          exchange: 'NYSE',
          sector: 'Real Estate',
          price: 0,
          change: 0,
          changePercent: 0,
          volume: null,
          marketCap: null
        });
        added++;
      }
    } catch (error) {
      console.error(`Failed to add ${company.symbol}:`, error);
      failed++;
    }
  }

  return { added, failed };
}

export async function processTelecomBatch(): Promise<{ added: number, failed: number }> {
  let added = 0;
  let failed = 0;

  for (const company of telecomCompanies) {
    try {
      const existing = await storage.getStock(company.symbol);
      if (!existing) {
        await storage.createStock({
          symbol: company.symbol,
          name: company.name,
          exchange: 'NASDAQ',
          sector: 'Communication Services',
          price: 0,
          change: 0,
          changePercent: 0,
          volume: null,
          marketCap: null
        });
        added++;
      }
    } catch (error) {
      console.error(`Failed to add ${company.symbol}:`, error);
      failed++;
    }
  }

  return { added, failed };
}