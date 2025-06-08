import { storage } from './storage';

// Major cryptocurrency companies and blockchain stocks
const cryptoAndBlockchainCompanies = [
  { symbol: 'COIN', name: 'Coinbase Global, Inc.' },
  { symbol: 'MSTR', name: 'MicroStrategy Incorporated' },
  { symbol: 'RIOT', name: 'Riot Platforms, Inc.' },
  { symbol: 'MARA', name: 'Marathon Digital Holdings, Inc.' },
  { symbol: 'CLSK', name: 'CleanSpark, Inc.' },
  { symbol: 'BITF', name: 'Bitfarms Ltd.' },
  { symbol: 'HUT', name: 'Hut 8 Mining Corp.' },
  { symbol: 'CORZ', name: 'Core Scientific, Inc.' },
  { symbol: 'CIFR', name: 'Cipher Mining Inc.' },
  { symbol: 'BTBT', name: 'Bit Digital, Inc.' },
  { symbol: 'SOS', name: 'SOS Limited' },
  { symbol: 'ANY', name: 'Sphere 3D Corp.' },
  { symbol: 'GREE', name: 'Greenidge Generation Holdings Inc.' },
  { symbol: 'HIVE', name: 'HIVE Blockchain Technologies Ltd.' },
  { symbol: 'DMG', name: 'DMG Blockchain Solutions Inc.' },
  { symbol: 'NXTD', name: 'NXT-ID, Inc.' },
  { symbol: 'EBANG', name: 'Ebang International Holdings Inc.' },
  { symbol: 'CAN', name: 'Canaan Inc.' },
  { symbol: 'GROW', name: 'U.S. Global Investors, Inc.' },
  { symbol: 'EBON', name: 'Ebang International Holdings Inc.' }
];

// Major fintech and payment companies
const fintechCompanies = [
  { symbol: 'V', name: 'Visa Inc.' },
  { symbol: 'MA', name: 'Mastercard Incorporated' },
  { symbol: 'PYPL', name: 'PayPal Holdings, Inc.' },
  { symbol: 'ADYEY', name: 'Adyen N.V.' },
  { symbol: 'FIS', name: 'Fidelity National Information Services, Inc.' },
  { symbol: 'FISV', name: 'Fiserv, Inc.' },
  { symbol: 'GPN', name: 'Global Payments Inc.' },
  { symbol: 'AXP', name: 'American Express Company' },
  { symbol: 'COF', name: 'Capital One Financial Corporation' },
  { symbol: 'DFS', name: 'Discover Financial Services' },
  { symbol: 'SYF', name: 'Synchrony Financial' },
  { symbol: 'ALLY', name: 'Ally Financial Inc.' },
  { symbol: 'LC', name: 'LendingClub Corporation' },
  { symbol: 'UPST', name: 'Upstart Holdings, Inc.' },
  { symbol: 'AFRM', name: 'Affirm Holdings, Inc.' },
  { symbol: 'SOFI', name: 'SoFi Technologies, Inc.' },
  { symbol: 'HOOD', name: 'Robinhood Markets, Inc.' },
  { symbol: 'BILL', name: 'Bill.com Holdings, Inc.' },
  { symbol: 'FLYW', name: 'Flywire Corporation' },
  { symbol: 'PAGS', name: 'PagSeguro Digital Ltd.' }
];

// Major healthcare and biotech companies
const healthcareCompanies = [
  { symbol: 'JNJ', name: 'Johnson & Johnson' },
  { symbol: 'PFE', name: 'Pfizer Inc.' },
  { symbol: 'ABBV', name: 'AbbVie Inc.' },
  { symbol: 'MRK', name: 'Merck & Co., Inc.' },
  { symbol: 'TMO', name: 'Thermo Fisher Scientific Inc.' },
  { symbol: 'DHR', name: 'Danaher Corporation' },
  { symbol: 'ABT', name: 'Abbott Laboratories' },
  { symbol: 'BMY', name: 'Bristol-Myers Squibb Company' },
  { symbol: 'LLY', name: 'Eli Lilly and Company' },
  { symbol: 'UNH', name: 'UnitedHealth Group Incorporated' },
  { symbol: 'ANTM', name: 'Anthem, Inc.' },
  { symbol: 'CVS', name: 'CVS Health Corporation' },
  { symbol: 'CI', name: 'The Cigna Group' },
  { symbol: 'HUM', name: 'Humana Inc.' },
  { symbol: 'CNC', name: 'Centene Corporation' },
  { symbol: 'MOH', name: 'Molina Healthcare, Inc.' },
  { symbol: 'GILD', name: 'Gilead Sciences, Inc.' },
  { symbol: 'REGN', name: 'Regeneron Pharmaceuticals, Inc.' },
  { symbol: 'VRTX', name: 'Vertex Pharmaceuticals Incorporated' },
  { symbol: 'BIIB', name: 'Biogen Inc.' },
  { symbol: 'MRNA', name: 'Moderna, Inc.' },
  { symbol: 'BNTX', name: 'BioNTech SE' },
  { symbol: 'NVAX', name: 'Novavax, Inc.' },
  { symbol: 'ILMN', name: 'Illumina, Inc.' },
  { symbol: 'ISRG', name: 'Intuitive Surgical, Inc.' }
];

// Major energy companies
const energyCompanies = [
  { symbol: 'XOM', name: 'Exxon Mobil Corporation' },
  { symbol: 'CVX', name: 'Chevron Corporation' },
  { symbol: 'COP', name: 'ConocoPhillips' },
  { symbol: 'EOG', name: 'EOG Resources, Inc.' },
  { symbol: 'SLB', name: 'SLB' },
  { symbol: 'PSX', name: 'Phillips 66' },
  { symbol: 'VLO', name: 'Valero Energy Corporation' },
  { symbol: 'MPC', name: 'Marathon Petroleum Corporation' },
  { symbol: 'OXY', name: 'Occidental Petroleum Corporation' },
  { symbol: 'HAL', name: 'Halliburton Company' },
  { symbol: 'BKR', name: 'Baker Hughes Company' },
  { symbol: 'FANG', name: 'Diamondback Energy, Inc.' },
  { symbol: 'DVN', name: 'Devon Energy Corporation' },
  { symbol: 'HES', name: 'Hess Corporation' },
  { symbol: 'MRO', name: 'Marathon Oil Corporation' },
  { symbol: 'APA', name: 'APA Corporation' },
  { symbol: 'CTRA', name: 'Coterra Energy Inc.' },
  { symbol: 'PXD', name: 'Pioneer Natural Resources Company' },
  { symbol: 'CQP', name: 'Cheniere Energy Partners, L.P.' },
  { symbol: 'KMI', name: 'Kinder Morgan, Inc.' }
];

export async function processCryptoBatch(): Promise<{ added: number, failed: number }> {
  let added = 0;
  let failed = 0;

  for (const company of cryptoAndBlockchainCompanies) {
    try {
      const existing = await storage.getStock(company.symbol);
      if (!existing) {
        await storage.createStock({
          symbol: company.symbol,
          name: company.name,
          exchange: 'NASDAQ',
          sector: 'Technology',
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

export async function processFintechBatch(): Promise<{ added: number, failed: number }> {
  let added = 0;
  let failed = 0;

  for (const company of fintechCompanies) {
    try {
      const existing = await storage.getStock(company.symbol);
      if (!existing) {
        await storage.createStock({
          symbol: company.symbol,
          name: company.name,
          exchange: 'NYSE',
          sector: 'Financial Services',
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

export async function processHealthcareBatch(): Promise<{ added: number, failed: number }> {
  let added = 0;
  let failed = 0;

  for (const company of healthcareCompanies) {
    try {
      const existing = await storage.getStock(company.symbol);
      if (!existing) {
        await storage.createStock({
          symbol: company.symbol,
          name: company.name,
          exchange: 'NYSE',
          sector: 'Healthcare',
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

export async function processEnergyBatch(): Promise<{ added: number, failed: number }> {
  let added = 0;
  let failed = 0;

  for (const company of energyCompanies) {
    try {
      const existing = await storage.getStock(company.symbol);
      if (!existing) {
        await storage.createStock({
          symbol: company.symbol,
          name: company.name,
          exchange: 'NYSE',
          sector: 'Energy',
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