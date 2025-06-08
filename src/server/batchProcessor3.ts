import { storage } from './storage';

// Canadian companies (1050-1072 range) from your 1,103 company list
const canadianCompanies = [
  { symbol: 'PNG', name: 'KRAKEN ROBOTICS INC' },
  { symbol: 'GDV', name: 'GLOBAL DIVIDEND GROWTH SPLIT CORP' },
  { symbol: 'ATZ', name: 'ARITZIA INC' },
  { symbol: 'LOVE', name: 'CANNARA BIOTECH INC' },
  { symbol: 'QBTC', name: '3IQ CORP' },
  { symbol: 'AFM', name: 'ALPHAMIN RES CORP' },
  { symbol: 'YEG', name: 'YORKTON EQUITY GROUP INC' },
  { symbol: 'RBN.UN', name: 'BLUE RIBBON INCOME FUND' },
  { symbol: 'PNP', name: 'PINETREE CAPITAL LTD' },
  { symbol: 'GDC', name: 'GENESIS LAND DEVELOPMENT CORP' },
  { symbol: 'CGI', name: 'CANADIAN GENERAL INVESTMENTS' },
  { symbol: 'LPC', name: 'LORNE PK CAPITAL PARTNERS INC' },
  { symbol: 'ORE', name: 'OREZONE GOLD CORP' },
  { symbol: 'FTG', name: 'FIRAN TECHNOLOGY GROUP CORPORATION' },
  { symbol: 'MHC.U', name: 'FLAGSHIP CMNTYS REAL ESTATE INVT TR' },
  { symbol: 'MEQ', name: 'MAINSTREET EQUITY CORP' },
  { symbol: 'VNP', name: '5N PLUS INC' },
  { symbol: 'BDT', name: 'BIRD CONSTRUCTION INC' },
  { symbol: 'BRM', name: 'BIOREM INC' },
  { symbol: 'WFC', name: 'WALL FINANCIAL CORP' },
  { symbol: 'TVK', name: 'TERRAVEST INDUSTRIES INC' },
  { symbol: 'TGH', name: 'TORNADO INFRASTRUCTURE EQUPMNT LTD' },
  { symbol: 'FFH', name: 'FAIRFAX FINANCIAL HLDGS LTD' }
];

// Hong Kong companies (1073-1103 range) from your 1,103 company list
const hongKongCompanies = [
  { symbol: '133', name: 'CHINA MERCHANTS CHINA DIRECT INV' },
  { symbol: '1808', name: 'ENTERPRISE DEVELOPMENT HOLDINGS LTD' },
  { symbol: '175', name: 'GEELY AUTOMOBILE HOLDINGS LIMITED' },
  { symbol: '8603', name: 'FAMEGLOW HOLDINGS LTD' },
  { symbol: '2490', name: 'LC LOGISTICS INC' },
  { symbol: '1235', name: 'TRAVEL EXPERT(ASIA) ENTERPRISES LTD' },
  { symbol: '8326', name: 'TONKING NEW ENERGY GROUP HLDGS LTD' },
  { symbol: '1415', name: 'COWELL E HOLDINGS INC' },
  { symbol: '1729', name: 'TIME INTERCONNECT TECH LTD' },
  { symbol: '2209', name: 'YESASIA HOLDINGS LTD' },
  { symbol: '2488', name: 'LAUNCH TECH CO LTD' },
  { symbol: '1357', name: 'MEITU INC' },
  { symbol: '1925', name: 'KWUNGS AROMA HOLDINGS LTD' },
  { symbol: '316', name: 'ORIENT OVERSEAS INT' },
  { symbol: '2111', name: 'BEST PACIFIC INTL HOLDINGS LIMITED' },
  { symbol: '2145', name: 'SHANGHAI CHICMAX COSMETIC CO LTD' },
  { symbol: '2245', name: 'LYGEND RESOURCES & TECHNOLOGY CO' },
  { symbol: '1769', name: 'SCHOLAR EDUCATION GROUP' },
  { symbol: '752', name: 'PICO FAR EAST HLDGS' },
  { symbol: '2149', name: 'BATELAB CO LTD' },
  { symbol: '2360', name: 'BEST MART 360 HLDGS LTD' },
  { symbol: '8188', name: 'GME GROUP HLDGS LTD' },
  { symbol: '3998', name: 'BOSIDENG INTERNATIONAL HLDGS' },
  { symbol: '1985', name: 'MICROWARE GRP LTD' },
  { symbol: '3692', name: 'HANSOH PHARMACEUTICAL GROUP CO LTD' },
  { symbol: '992', name: 'LENOVO GROUP LIMITED' },
  { symbol: '2283', name: 'TK GROUP (HOLDINGS) LIMITED' },
  { symbol: '2663', name: 'KPA-BM HOLDINGS LTD' },
  { symbol: '1184', name: 'S.A.S.DRAGON' },
  { symbol: '388', name: 'HONG KONG EXCHANGES & CLEARING' },
  { symbol: '1882', name: 'HAITIAN INTERNATIONAL HOLDINGS LTD' }
];

// Additional global companies to reach target total
const globalCompanies = [
  { symbol: 'TSM', name: 'Taiwan Semiconductor Manufacturing Company Limited' },
  { symbol: 'UMC', name: 'United Microelectronics Corporation' },
  { symbol: 'ASX', name: 'ASE Technology Holding Co., Ltd.' },
  { symbol: 'SONY', name: 'Sony Group Corporation' },
  { symbol: 'TM', name: 'Toyota Motor Corporation' },
  { symbol: 'SMFG', name: 'Sumitomo Mitsui Financial Group, Inc.' },
  { symbol: 'MUFG', name: 'Mitsubishi UFJ Financial Group, Inc.' },
  { symbol: 'NTT', name: 'Nippon Telegraph and Telephone Corporation' },
  { symbol: 'RPRUY', name: 'Repsol, S.A.' },
  { symbol: 'IBDRY', name: 'Iberdrola, S.A.' },
  { symbol: 'TEF', name: 'Telefónica, S.A.' },
  { symbol: 'SAN', name: 'Banco Santander, S.A.' },
  { symbol: 'BBVA', name: 'Banco Bilbao Vizcaya Argentaria, S.A.' },
  { symbol: 'ITX', name: 'Industria de Diseño Textil, S.A.' },
  { symbol: 'AENA', name: 'Aena S.M.E., S.A.' },
  { symbol: 'ASML', name: 'ASML Holding N.V.' },
  { symbol: 'RDSA', name: 'Royal Dutch Shell plc' },
  { symbol: 'UNA', name: 'Unilever N.V.' },
  { symbol: 'PHIA', name: 'Koninklijke Philips N.V.' },
  { symbol: 'ING', name: 'ING Groep N.V.' },
  { symbol: 'ADYEN', name: 'Adyen N.V.' },
  { symbol: 'DSM', name: 'Royal DSM N.V.' },
  { symbol: 'RAND', name: 'RAND Worldwide, Inc.' },
  { symbol: 'AKZO', name: 'Akzo Nobel N.V.' },
  { symbol: 'WKL', name: 'Wolters Kluwer N.V.' },
  { symbol: 'UG', name: 'United Guardians, Inc.' },
  { symbol: 'RELX', name: 'RELX PLC' },
  { symbol: 'NXPI', name: 'NXP Semiconductors N.V.' },
  { symbol: 'STM', name: 'STMicroelectronics N.V.' },
  { symbol: 'QGEN', name: 'QIAGEN N.V.' }
];

export async function processCanadianBatch(): Promise<{ added: number, failed: number }> {
  let added = 0;
  let failed = 0;

  for (const company of canadianCompanies) {
    try {
      const existing = await storage.getStock(company.symbol);
      if (!existing) {
        await storage.createStock({
          symbol: company.symbol,
          name: company.name,
          exchange: 'TSX',
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

export async function processHongKongBatch(): Promise<{ added: number, failed: number }> {
  let added = 0;
  let failed = 0;

  for (const company of hongKongCompanies) {
    try {
      const existing = await storage.getStock(company.symbol);
      if (!existing) {
        await storage.createStock({
          symbol: company.symbol,
          name: company.name,
          exchange: 'HKEX',
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

export async function processGlobalBatch(): Promise<{ added: number, failed: number }> {
  let added = 0;
  let failed = 0;

  for (const company of globalCompanies) {
    try {
      const existing = await storage.getStock(company.symbol);
      if (!existing) {
        const exchange = company.symbol.includes('Y') ? 'European' : 
                        ['TSM', 'UMC', 'ASX'].includes(company.symbol) ? 'Taiwan' :
                        ['SONY', 'TM', 'SMFG', 'MUFG', 'NTT'].includes(company.symbol) ? 'Japan' : 'NASDAQ';
        
        await storage.createStock({
          symbol: company.symbol,
          name: company.name,
          exchange,
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