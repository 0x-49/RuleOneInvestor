import { storage } from './storage';

// Additional international companies (350-450 range) from your 1,103 company list
const additionalInternationalCompanies = [
  { symbol: '4772', name: 'TAIWAN SPECIALITY CHEMICALS CORPORA' },
  { symbol: 'MCBIM', name: 'MCB INVESTMENT MANAGEMENT LIMITED' },
  { symbol: 'SHFA', name: 'SHIFA INTERNATIONAL HOSPITALS LTD' },
  { symbol: 'NCI', name: 'NTG CLARITY NETWORKS INC' },
  { symbol: 'CELLECOR', name: 'CELLECOR GADGETS LTD' },
  { symbol: 'HGM', name: 'HA GIANG MINERAL MECHANICS JSC' },
  { symbol: '356890', name: 'CYBERONE CO., LTD.' },
  { symbol: '8342', name: 'I JANG INDUSTRIA CO LTD' },
  { symbol: 'CHCI', name: 'Comstock Holding Companies, Inc.' },
  { symbol: 'ADB', name: 'AUTOCOUNT DOTCOM BERHAD' },
  { symbol: '1712', name: 'DRAGON MINING LIMITED' },
  { symbol: 'APP', name: 'APPLICAD PCL' },
  { symbol: 'PLEJD', name: 'PLEJD AB' },
  { symbol: 'GAL', name: 'GHANDHARA AUTOMOBILES LTD' },
  { symbol: '9557', name: 'EDARAT COMMUNICATION AND INFORMATION TECHNOLOGY CO.' },
  { symbol: 'SED', name: 'PHUONG NAM EDUCATION INV & DEV JSC' },
  { symbol: 'ZAL', name: 'ZALARIS ASA' },
  { symbol: 'ETST', name: 'Earth Science Tech, Inc.' },
  { symbol: 'VLL.N0000', name: 'VIDULLANKA PLC' },
  { symbol: 'SKS', name: 'SKS TECHNOLOGIES GROUP LIMITED' },
  { symbol: 'OPXS', name: 'Optex Systems Holdings, Inc.' },
  { symbol: 'TFC', name: 'TRANG CORPORATION' },
  { symbol: 'ATR', name: 'ATREM' },
  { symbol: 'IDR', name: 'Idaho Strategic Resources, Inc.' },
  { symbol: '6855', name: 'ECLATORQ TECHNOLOGY CO LTD' },
  { symbol: 'AHC', name: 'AUSTCO HEALTHCARE LIMITED' },
  { symbol: 'MTRKS', name: 'MATRIKS FINANSAL TEKNOLOJILER' },
  { symbol: 'MAM', name: 'MICROEQUITIES ASSET MANAGEMENT GROUP LIMITED' },
  { symbol: 'TBTC', name: 'Table Trac, Inc.' },
  { symbol: 'NFC', name: 'NINH BINH PHOSPHATE FERTILIZER JSC' },
  { symbol: '7714', name: 'UNIFORCE TECHNOLOGY CORPORATION' },
  { symbol: 'ACFN', name: 'Acorn Energy, Inc.' },
  { symbol: '8162', name: 'LOCO HONG KONG HOLDINGS LIMITED' },
  { symbol: '6898', name: 'CHAINSEA INFORMATION INTEGRATION CO' },
  { symbol: 'CLOUDPT', name: 'CLOUDPOINT TECHNOLOGY BERHAD' },
  { symbol: 'HNW', name: 'Pioneer Diversified High Income Fund, Inc.' },
  { symbol: 'ZKX', name: 'EVER GLORY' },
  { symbol: '6820', name: 'ACON OPTICS COMMUNICATIONS INC' },
  { symbol: 'UNIQ', name: 'ULIMA NITRA TBK' },
  { symbol: 'NEX', name: 'RECLAIMS GLOBAL' },
  { symbol: 'SGC', name: 'SA GIANG IMPORT-EXPORT CORPORATION' },
  { symbol: 'STP', name: 'SAHATHAI PRINTING & PACKAGING PCL' },
  { symbol: '6986', name: 'HEXUN BIOSCIENCES CO LTD' },
  { symbol: 'JSGCL', name: 'JS GLOBAL CAPITAL LTD' },
  { symbol: 'INDXA', name: 'INDEXA CAPITAL GROUP, S.A.' },
  { symbol: 'ADCI', name: 'ARAB PHARMACEUTICALS' },
  { symbol: 'MFGROUP', name: 'MANFORCE GROUP BERHAD' },
  { symbol: 'LFECORP', name: 'LFE CORPORATION BHD' },
  { symbol: 'VINSYS', name: 'VINSYS IT SERVICES IND LTD' },
  { symbol: 'ITECH', name: 'I-TECH AB' }
];

// Major ETFs and funds to expand the database
const etfsAndFunds = [
  { symbol: 'SPY', name: 'SPDR S&P 500 ETF Trust' },
  { symbol: 'QQQ', name: 'Invesco QQQ Trust' },
  { symbol: 'VTI', name: 'Vanguard Total Stock Market ETF' },
  { symbol: 'IWM', name: 'iShares Russell 2000 ETF' },
  { symbol: 'EFA', name: 'iShares MSCI EAFE ETF' },
  { symbol: 'EEM', name: 'iShares MSCI Emerging Markets ETF' },
  { symbol: 'VEA', name: 'Vanguard FTSE Developed Markets ETF' },
  { symbol: 'VWO', name: 'Vanguard FTSE Emerging Markets ETF' },
  { symbol: 'GLD', name: 'SPDR Gold Shares' },
  { symbol: 'SLV', name: 'iShares Silver Trust' },
  { symbol: 'TLT', name: 'iShares 20+ Year Treasury Bond ETF' },
  { symbol: 'IEF', name: 'iShares 7-10 Year Treasury Bond ETF' },
  { symbol: 'SHY', name: 'iShares 1-3 Year Treasury Bond ETF' },
  { symbol: 'LQD', name: 'iShares iBoxx $ Investment Grade Corporate Bond ETF' },
  { symbol: 'HYG', name: 'iShares iBoxx $ High Yield Corporate Bond ETF' },
  { symbol: 'XLF', name: 'Financial Select Sector SPDR Fund' },
  { symbol: 'XLK', name: 'Technology Select Sector SPDR Fund' },
  { symbol: 'XLE', name: 'Energy Select Sector SPDR Fund' },
  { symbol: 'XLV', name: 'Health Care Select Sector SPDR Fund' },
  { symbol: 'XLI', name: 'Industrial Select Sector SPDR Fund' },
  { symbol: 'XLP', name: 'Consumer Staples Select Sector SPDR Fund' },
  { symbol: 'XLY', name: 'Consumer Discretionary Select Sector SPDR Fund' },
  { symbol: 'XLU', name: 'Utilities Select Sector SPDR Fund' },
  { symbol: 'XLB', name: 'Materials Select Sector SPDR Fund' },
  { symbol: 'XLRE', name: 'Real Estate Select Sector SPDR Fund' },
  { symbol: 'VIG', name: 'Vanguard Dividend Appreciation ETF' },
  { symbol: 'VYM', name: 'Vanguard High Dividend Yield ETF' },
  { symbol: 'SCHD', name: 'Schwab US Dividend Equity ETF' },
  { symbol: 'DGRO', name: 'iShares Core Dividend Growth ETF' },
  { symbol: 'HDV', name: 'iShares Core High Dividend ETF' },
  { symbol: 'NOBL', name: 'ProShares S&P 500 Dividend Aristocrats ETF' },
  { symbol: 'VGT', name: 'Vanguard Information Technology ETF' },
  { symbol: 'VHT', name: 'Vanguard Health Care ETF' },
  { symbol: 'VFH', name: 'Vanguard Financials ETF' },
  { symbol: 'VDE', name: 'Vanguard Energy ETF' },
  { symbol: 'VIS', name: 'Vanguard Industrials ETF' },
  { symbol: 'VAW', name: 'Vanguard Materials ETF' },
  { symbol: 'VCR', name: 'Vanguard Consumer Discretionary ETF' },
  { symbol: 'VDC', name: 'Vanguard Consumer Staples ETF' },
  { symbol: 'VPU', name: 'Vanguard Utilities ETF' },
  { symbol: 'VNQ', name: 'Vanguard Real Estate ETF' },
  { symbol: 'BND', name: 'Vanguard Total Bond Market ETF' },
  { symbol: 'VXUS', name: 'Vanguard Total International Stock ETF' },
  { symbol: 'VTEB', name: 'Vanguard Tax-Exempt Bond ETF' },
  { symbol: 'VB', name: 'Vanguard Small-Cap ETF' },
  { symbol: 'VO', name: 'Vanguard Mid-Cap ETF' },
  { symbol: 'VV', name: 'Vanguard Large-Cap ETF' },
  { symbol: 'VTV', name: 'Vanguard Value ETF' },
  { symbol: 'VUG', name: 'Vanguard Growth ETF' },
  { symbol: 'ARKK', name: 'ARK Innovation ETF' },
  { symbol: 'ARKQ', name: 'ARK Autonomous Technology & Robotics ETF' },
  { symbol: 'ARKW', name: 'ARK Next Generation Internet ETF' }
];

export async function processAdditionalInternationalBatch(): Promise<{ added: number, failed: number }> {
  let added = 0;
  let failed = 0;

  for (const company of additionalInternationalCompanies) {
    try {
      const existing = await storage.getStock(company.symbol);
      if (!existing) {
        // Determine exchange based on symbol patterns
        let exchange = 'OTHER';
        if (company.symbol.match(/^\d+$/)) {
          exchange = company.symbol.length === 4 ? 'TSE' : company.symbol.length === 6 ? 'Korea' : 'Taiwan';
        } else if (company.symbol.includes('.') || company.symbol.includes('_')) {
          exchange = 'International';
        } else if (company.symbol.length <= 5 && /^[A-Z]+$/.test(company.symbol)) {
          exchange = 'NASDAQ';
        }

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

export async function processETFsBatch(): Promise<{ added: number, failed: number }> {
  let added = 0;
  let failed = 0;

  for (const fund of etfsAndFunds) {
    try {
      const existing = await storage.getStock(fund.symbol);
      if (!existing) {
        await storage.createStock({
          symbol: fund.symbol,
          name: fund.name,
          exchange: 'NASDAQ',
          sector: 'ETF',
          price: 0,
          change: 0,
          changePercent: 0,
          volume: null,
          marketCap: null
        });
        added++;
      }
    } catch (error) {
      console.error(`Failed to add ${fund.symbol}:`, error);
      failed++;
    }
  }

  return { added, failed };
}