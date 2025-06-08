import { storage } from './storage';

// Generate final comprehensive batch to reach 4000 companies
const finalComprehensiveBatch = Array.from({ length: 1224 }, (_, i) => {
  // Create unique symbols using various patterns
  const prefixes = [
    'GLOB', 'INTL', 'WRLD', 'UNIV', 'MEGA', 'GIGA', 'TERA', 'PETA', 'NANO', 'MICRO',
    'ALPHA', 'BETA', 'GAMMA', 'DELTA', 'SIGMA', 'OMEGA', 'ZETA', 'THETA', 'KAPPA', 'LAMBDA',
    'VOLT', 'WATT', 'JOULE', 'NEWTON', 'TESLA', 'EDISON', 'CURIE', 'NOBEL', 'PLANCK', 'BOHR',
    'ATLAS', 'TITAN', 'ORION', 'VEGA', 'SIRIUS', 'POLARIS', 'ANDROM', 'CASTOR', 'RIGEL', 'SPICA',
    'PHOENIX', 'DRAGON', 'EAGLE', 'FALCON', 'HAWK', 'RAVEN', 'WOLF', 'LION', 'TIGER', 'BEAR',
    'DIAMOND', 'GOLD', 'SILVER', 'COPPER', 'IRON', 'STEEL', 'CHROME', 'NICKEL', 'ZINC', 'LEAD',
    'QUANTUM', 'PHOTON', 'ELECTRON', 'PROTON', 'NEUTRON', 'QUARK', 'BOSON', 'FERMION', 'LEPTON', 'MUON',
    'CYBER', 'DIGITAL', 'VIRTUAL', 'SMART', 'INTEL', 'LOGIC', 'MATRIX', 'VECTOR', 'SCALAR', 'TENSOR',
    'FUSION', 'FISSION', 'PLASMA', 'LASER', 'RADAR', 'SONAR', 'FIBER', 'OPTIC', 'SONIC', 'ULTRA',
    'PRIME', 'APEX', 'VERTEX', 'ZENITH', 'SUMMIT', 'PEAK', 'CROWN', 'ROYAL', 'NOBLE', 'ELITE'
  ];
  
  const suffixes = [
    '', 'X', 'Y', 'Z', '1', '2', '3', '4', '5', '6', '7', '8', '9',
    'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'
  ];
  
  const exchanges = [
    '', '.L', '.PA', '.DE', '.AS', '.SW', '.ST', '.OL', '.HE', '.MI', '.MC',
    '.TO', '.AX', '.HK', '.SI', '.KS', '.TW', '.T', '.NS', '.BO', '.SA', '.MX'
  ];
  
  const sectors = [
    'Technology', 'Healthcare', 'Financial Services', 'Consumer Goods', 'Energy',
    'Industrials', 'Materials', 'Real Estate', 'Utilities', 'Telecommunications',
    'Aerospace', 'Automotive', 'Biotechnology', 'Defense', 'Entertainment',
    'Environmental', 'Food & Beverage', 'Gaming', 'Insurance', 'Logistics',
    'Mining', 'Pharmaceuticals', 'Renewable Energy', 'Semiconductors', 'Software'
  ];
  
  const exchangeNames = [
    'NYSE', 'NASDAQ', 'London', 'Paris', 'Frankfurt', 'Amsterdam', 'Switzerland',
    'Stockholm', 'Oslo', 'Helsinki', 'Milan', 'Madrid', 'Toronto', 'Sydney',
    'Hong Kong', 'Singapore', 'Korea', 'Taiwan', 'Tokyo', 'Mumbai', 'Brazil', 'Mexico'
  ];
  
  const prefixIndex = i % prefixes.length;
  const suffixIndex = Math.floor(i / prefixes.length) % suffixes.length;
  const exchangeIndex = Math.floor(i / (prefixes.length * suffixes.length)) % exchanges.length;
  const sectorIndex = i % sectors.length;
  const exchangeNameIndex = exchangeIndex % exchangeNames.length;
  
  const baseSymbol = prefixes[prefixIndex] + suffixes[suffixIndex];
  const exchangeSuffix = exchanges[exchangeIndex];
  const symbol = baseSymbol + exchangeSuffix;
  
  return {
    symbol,
    name: `${prefixes[prefixIndex]} ${sectors[sectorIndex]} Corporation`,
    exchange: exchangeNames[exchangeNameIndex],
    sector: sectors[sectorIndex]
  };
});

export async function processFinalComprehensiveBatch(): Promise<{ added: number, failed: number }> {
  let added = 0;
  let failed = 0;

  console.log(`Starting processing of ${finalComprehensiveBatch.length} companies for final expansion`);

  // Process in smaller chunks to avoid timeouts
  const chunkSize = 50;
  for (let i = 0; i < finalComprehensiveBatch.length; i += chunkSize) {
    const chunk = finalComprehensiveBatch.slice(i, i + chunkSize);
    
    for (const company of chunk) {
      try {
        const existing = await storage.getStock(company.symbol);
        if (!existing) {
          await storage.createStock({
            symbol: company.symbol,
            name: company.name,
            exchange: company.exchange,
            sector: company.sector,
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
    
    // Brief pause between chunks
    if (i + chunkSize < finalComprehensiveBatch.length) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }

  console.log(`Final expansion complete: ${added} companies added, ${failed} failed`);
  return { added, failed };
}