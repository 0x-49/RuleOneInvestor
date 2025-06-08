import { storage } from './storage';

// Major Russell 1000 companies (large-cap US stocks)
const russell1000Companies = [
  { symbol: 'COST', name: 'Costco Wholesale Corporation' },
  { symbol: 'WMT', name: 'Walmart Inc.' },
  { symbol: 'PG', name: 'The Procter & Gamble Company' },
  { symbol: 'JNJ', name: 'Johnson & Johnson' },
  { symbol: 'KO', name: 'The Coca-Cola Company' },
  { symbol: 'PEP', name: 'PepsiCo, Inc.' },
  { symbol: 'UNH', name: 'UnitedHealth Group Incorporated' },
  { symbol: 'JPM', name: 'JPMorgan Chase & Co.' },
  { symbol: 'BAC', name: 'Bank of America Corporation' },
  { symbol: 'WFC', name: 'Wells Fargo & Company' },
  { symbol: 'C', name: 'Citigroup Inc.' },
  { symbol: 'USB', name: 'U.S. Bancorp' },
  { symbol: 'PNC', name: 'The PNC Financial Services Group, Inc.' },
  { symbol: 'TFC', name: 'Truist Financial Corporation' },
  { symbol: 'COF', name: 'Capital One Financial Corporation' },
  { symbol: 'AXP', name: 'American Express Company' },
  { symbol: 'GS', name: 'The Goldman Sachs Group, Inc.' },
  { symbol: 'MS', name: 'Morgan Stanley' },
  { symbol: 'BLK', name: 'BlackRock, Inc.' },
  { symbol: 'SPGI', name: 'S&P Global Inc.' },
  { symbol: 'ICE', name: 'Intercontinental Exchange, Inc.' },
  { symbol: 'CME', name: 'CME Group Inc.' },
  { symbol: 'MCO', name: 'Moody\'s Corporation' },
  { symbol: 'MSCI', name: 'MSCI Inc.' },
  { symbol: 'TRV', name: 'The Travelers Companies, Inc.' },
  { symbol: 'AIG', name: 'American International Group, Inc.' },
  { symbol: 'PRU', name: 'Prudential Financial, Inc.' },
  { symbol: 'MET', name: 'MetLife, Inc.' },
  { symbol: 'AFL', name: 'Aflac Incorporated' },
  { symbol: 'ALL', name: 'The Allstate Corporation' },
  { symbol: 'PGR', name: 'The Progressive Corporation' },
  { symbol: 'CB', name: 'Chubb Limited' },
  { symbol: 'AJG', name: 'Arthur J. Gallagher & Co.' },
  { symbol: 'MMC', name: 'Marsh & McLennan Companies, Inc.' },
  { symbol: 'AON', name: 'Aon plc' },
  { symbol: 'WTW', name: 'Willis Towers Watson Public Limited Company' },
  { symbol: 'BRO', name: 'Brown & Brown, Inc.' },
  { symbol: 'EQIX', name: 'Equinix, Inc.' },
  { symbol: 'DLR', name: 'Digital Realty Trust, Inc.' },
  { symbol: 'CCI', name: 'Crown Castle Inc.' },
  { symbol: 'AMT', name: 'American Tower Corporation' },
  { symbol: 'SBAC', name: 'SBA Communications Corporation' },
  { symbol: 'LADR', name: 'Ladder Capital Corp' },
  { symbol: 'PSA', name: 'Public Storage' },
  { symbol: 'EXR', name: 'Extended Stay America, Inc.' },
  { symbol: 'AVB', name: 'AvalonBay Communities, Inc.' },
  { symbol: 'EQR', name: 'Equity Residential' },
  { symbol: 'UDR', name: 'UDR, Inc.' },
  { symbol: 'ESS', name: 'Essex Property Trust, Inc.' },
  { symbol: 'MAA', name: 'Mid-America Apartment Communities, Inc.' }
];

// Major Russell 2000 companies (small-cap US stocks)
const russell2000Companies = [
  { symbol: 'SIRI', name: 'Sirius XM Holdings Inc.' },
  { symbol: 'PLUG', name: 'Plug Power Inc.' },
  { symbol: 'SPCE', name: 'Virgin Galactic Holdings, Inc.' },
  { symbol: 'AMC', name: 'AMC Entertainment Holdings, Inc.' },
  { symbol: 'GME', name: 'GameStop Corp.' },
  { symbol: 'BB', name: 'BlackBerry Limited' },
  { symbol: 'NOK', name: 'Nokia Corporation' },
  { symbol: 'WISH', name: 'ContextLogic Inc.' },
  { symbol: 'CLOV', name: 'Clover Health Investments, Corp.' },
  { symbol: 'CLNE', name: 'Clean Energy Fuels Corp.' },
  { symbol: 'WKHS', name: 'Workhorse Group Inc.' },
  { symbol: 'RIDE', name: 'Lordstown Motors Corp.' },
  { symbol: 'NKLA', name: 'Nikola Corporation' },
  { symbol: 'HYLN', name: 'Hyliion Holdings Corp.' },
  { symbol: 'QS', name: 'QuantumScape Corporation' },
  { symbol: 'LCID', name: 'Lucid Group, Inc.' },
  { symbol: 'RIVN', name: 'Rivian Automotive, Inc.' },
  { symbol: 'F', name: 'Ford Motor Company' },
  { symbol: 'GM', name: 'General Motors Company' },
  { symbol: 'STLA', name: 'Stellantis N.V.' },
  { symbol: 'TM', name: 'Toyota Motor Corporation' },
  { symbol: 'HMC', name: 'Honda Motor Co., Ltd.' },
  { symbol: 'RACE', name: 'Ferrari N.V.' },
  { symbol: 'VWAGY', name: 'Volkswagen AG' },
  { symbol: 'BMWYY', name: 'Bayerische Motoren Werke Aktiengesellschaft' },
  { symbol: 'DDAIF', name: 'Daimler AG' },
  { symbol: 'POAHY', name: 'Porsche Automobil Holding SE' },
  { symbol: 'VLKAY', name: 'Volkswagen AG' },
  { symbol: 'FUJHY', name: 'Fuji Heavy Industries Ltd.' },
  { symbol: 'NSANY', name: 'Nissan Motor Co., Ltd.' },
  { symbol: 'HYMTF', name: 'Hyundai Motor Company' },
  { symbol: 'KIMTF', name: 'Kia Motors Corporation' },
  { symbol: 'MGDDY', name: 'Magna International Inc.' },
  { symbol: 'APTV', name: 'Aptiv PLC' },
  { symbol: 'BWA', name: 'BorgWarner Inc.' },
  { symbol: 'LEA', name: 'Lear Corporation' },
  { symbol: 'ADNT', name: 'Adient plc' },
  { symbol: 'GT', name: 'The Goodyear Tire & Rubber Company' },
  { symbol: 'BFAM', name: 'Bright Horizons Family Solutions Inc.' },
  { symbol: 'CHGG', name: 'Chegg, Inc.' },
  { symbol: 'STRA', name: 'Strategic Education, Inc.' },
  { symbol: 'LAUR', name: 'Laureate Education, Inc.' },
  { symbol: 'APEI', name: 'American Public Education, Inc.' },
  { symbol: 'CECO', name: 'Career Education Corporation' },
  { symbol: 'LINC', name: 'Lincoln Educational Services Corporation' },
  { symbol: 'EDUC', name: 'Educational Development Corporation' },
  { symbol: 'PRDO', name: 'Perdoceo Education Corporation' },
  { symbol: 'UTI', name: 'Universal Technical Institute, Inc.' },
  { symbol: 'ATGE', name: 'Adtalem Global Education Inc.' },
  { symbol: 'COUR', name: 'Coursera, Inc.' },
  { symbol: 'DUOL', name: 'Duolingo, Inc.' }
];

// Major consumer staples companies
const consumerStaplesCompanies = [
  { symbol: 'WMT', name: 'Walmart Inc.' },
  { symbol: 'COST', name: 'Costco Wholesale Corporation' },
  { symbol: 'PG', name: 'The Procter & Gamble Company' },
  { symbol: 'KO', name: 'The Coca-Cola Company' },
  { symbol: 'PEP', name: 'PepsiCo, Inc.' },
  { symbol: 'PM', name: 'Philip Morris International Inc.' },
  { symbol: 'MO', name: 'Altria Group, Inc.' },
  { symbol: 'BTI', name: 'British American Tobacco p.l.c.' },
  { symbol: 'UL', name: 'Unilever PLC' },
  { symbol: 'CL', name: 'Colgate-Palmolive Company' },
  { symbol: 'KMB', name: 'Kimberly-Clark Corporation' },
  { symbol: 'GIS', name: 'General Mills, Inc.' },
  { symbol: 'K', name: 'Kellogg Company' },
  { symbol: 'CPB', name: 'Campbell Soup Company' },
  { symbol: 'HRL', name: 'Hormel Foods Corporation' },
  { symbol: 'TSN', name: 'Tyson Foods, Inc.' },
  { symbol: 'KHC', name: 'The Kraft Heinz Company' },
  { symbol: 'MDLZ', name: 'Mondelez International, Inc.' },
  { symbol: 'HSY', name: 'The Hershey Company' },
  { symbol: 'MKC', name: 'McCormick & Company, Incorporated' },
  { symbol: 'SJM', name: 'The J. M. Smucker Company' },
  { symbol: 'CAG', name: 'Conagra Brands, Inc.' },
  { symbol: 'CPB', name: 'Campbell Soup Company' },
  { symbol: 'KR', name: 'The Kroger Co.' },
  { symbol: 'SYY', name: 'Sysco Corporation' },
  { symbol: 'ADM', name: 'Archer-Daniels-Midland Company' },
  { symbol: 'BG', name: 'Bunge Limited' },
  { symbol: 'INGR', name: 'Ingredion Incorporated' },
  { symbol: 'TAP', name: 'Molson Coors Beverage Company' },
  { symbol: 'SAM', name: 'The Boston Beer Company, Inc.' },
  { symbol: 'BF.B', name: 'Brown-Forman Corporation' },
  { symbol: 'STZ', name: 'Constellation Brands, Inc.' },
  { symbol: 'DEO', name: 'Diageo plc' },
  { symbol: 'FIZZ', name: 'National Beverage Corp.' },
  { symbol: 'COKE', name: 'Coca-Cola Consolidated, Inc.' },
  { symbol: 'KDP', name: 'Keurig Dr Pepper Inc.' },
  { symbol: 'MNST', name: 'Monster Beverage Corporation' },
  { symbol: 'CELH', name: 'Celsius Holdings, Inc.' },
  { symbol: 'REED', name: 'Reed\'s, Inc.' },
  { symbol: 'ZVIA', name: 'Zevia PBC' },
  { symbol: 'PRMW', name: 'Primo Water Corporation' },
  { symbol: 'DOLE', name: 'Dole plc' },
  { symbol: 'FDP', name: 'Fresh Del Monte Produce Inc.' },
  { symbol: 'AVO', name: 'Mission Produce, Inc.' },
  { symbol: 'CALM', name: 'Cal-Maine Foods, Inc.' },
  { symbol: 'SAFM', name: 'Sanderson Farms, Inc.' },
  { symbol: 'PPC', name: 'Pilgrim\'s Pride Corporation' },
  { symbol: 'JJSF', name: 'J & J Snack Foods Corp.' },
  { symbol: 'LWAY', name: 'Lifeway Foods, Inc.' },
  { symbol: 'SENEA', name: 'Seneca Foods Corporation' }
];

export async function processRussell1000Batch(): Promise<{ added: number, failed: number }> {
  let added = 0;
  let failed = 0;

  for (const company of russell1000Companies) {
    try {
      const existing = await storage.getStock(company.symbol);
      if (!existing) {
        await storage.createStock({
          symbol: company.symbol,
          name: company.name,
          exchange: 'NYSE',
          sector: 'Large-Cap',
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

export async function processRussell2000Batch(): Promise<{ added: number, failed: number }> {
  let added = 0;
  let failed = 0;

  for (const company of russell2000Companies) {
    try {
      const existing = await storage.getStock(company.symbol);
      if (!existing) {
        await storage.createStock({
          symbol: company.symbol,
          name: company.name,
          exchange: 'NASDAQ',
          sector: 'Small-Cap',
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

export async function processConsumerStaplesBatch(): Promise<{ added: number, failed: number }> {
  let added = 0;
  let failed = 0;

  for (const company of consumerStaplesCompanies) {
    try {
      const existing = await storage.getStock(company.symbol);
      if (!existing) {
        await storage.createStock({
          symbol: company.symbol,
          name: company.name,
          exchange: 'NYSE',
          sector: 'Consumer Staples',
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