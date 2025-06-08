import { storage } from './storage';

// Major European companies across different countries
const europeanCompanies = [
  // Germany
  { symbol: 'SAP', name: 'SAP SE' },
  { symbol: 'SIEGY', name: 'Siemens AG' },
  { symbol: 'BAYRY', name: 'Bayer AG' },
  { symbol: 'BMWYY', name: 'Bayerische Motoren Werke AG' },
  { symbol: 'VLKAY', name: 'Volkswagen AG' },
  { symbol: 'DAIMY', name: 'Daimler AG' },
  { symbol: 'ALIZF', name: 'Allianz SE' },
  { symbol: 'DBSDY', name: 'Deutsche Bank AG' },
  { symbol: 'BACHY', name: 'BASF SE' },
  { symbol: 'ADDYY', name: 'adidas AG' },
  
  // France
  { symbol: 'LVMUY', name: 'LVMH Moët Hennessy Louis Vuitton SE' },
  { symbol: 'TOTF', name: 'TotalEnergies SE' },
  { symbol: 'SNPAY', name: 'Schneider Electric SE' },
  { symbol: 'LRLCY', name: "L'Oréal S.A." },
  { symbol: 'AIQUY', name: 'Air Liquide S.A.' },
  { symbol: 'DANOY', name: 'Danone S.A.' },
  { symbol: 'SGOPY', name: 'Safran S.A.' },
  { symbol: 'CAPGY', name: 'Capgemini SE' },
  { symbol: 'VIVHY', name: 'Vivendi SE' },
  { symbol: 'ACCYY', name: 'Accor S.A.' },
  
  // United Kingdom
  { symbol: 'ASML', name: 'ASML Holding N.V.' },
  { symbol: 'RDSA', name: 'Royal Dutch Shell plc' },
  { symbol: 'AZN', name: 'AstraZeneca PLC' },
  { symbol: 'GSK', name: 'GSK plc' },
  { symbol: 'BP', name: 'BP p.l.c.' },
  { symbol: 'ULVR', name: 'Unilever PLC' },
  { symbol: 'VODOY', name: 'Vodafone Group Plc' },
  { symbol: 'BTGOY', name: 'BT Group plc' },
  { symbol: 'LBTYA', name: 'Liberty Global plc' },
  { symbol: 'BATS', name: 'British American Tobacco p.l.c.' },
  
  // Switzerland
  { symbol: 'NSEUY', name: 'Nestlé S.A.' },
  { symbol: 'NOVN', name: 'Novartis AG' },
  { symbol: 'ROG', name: 'Roche Holding AG' },
  { symbol: 'UBS', name: 'UBS Group AG' },
  { symbol: 'CSGN', name: 'Credit Suisse Group AG' },
  { symbol: 'SCMWY', name: 'Swiss Re Ltd.' },
  { symbol: 'ZURN', name: 'Zurich Insurance Group AG' },
  { symbol: 'ABB', name: 'ABB Ltd' },
  { symbol: 'GIVN', name: 'Givaudan SA' },
  { symbol: 'LONN', name: 'Lonza Group AG' },
  
  // Netherlands
  { symbol: 'HEIA', name: 'Heineken N.V.' },
  { symbol: 'ING', name: 'ING Groep N.V.' },
  { symbol: 'PHIA', name: 'Koninklijke Philips N.V.' },
  { symbol: 'UNA', name: 'Unilever N.V.' },
  { symbol: 'AKZA', name: 'Akzo Nobel N.V.' },
  { symbol: 'DSM', name: 'Koninklijke DSM N.V.' },
  { symbol: 'WKL', name: 'Wolters Kluwer N.V.' },
  { symbol: 'AALB', name: 'Aalberts N.V.' },
  { symbol: 'ASR', name: 'ASR Nederland N.V.' },
  { symbol: 'BESI', name: 'BE Semiconductor Industries N.V.' }
];

// Major Asian companies (excluding Japan and China)
const asianCompanies = [
  // South Korea
  { symbol: '005930.KS', name: 'Samsung Electronics Co., Ltd.' },
  { symbol: '000660.KS', name: 'SK Hynix Inc.' },
  { symbol: '035420.KS', name: 'NAVER Corporation' },
  { symbol: '207940.KS', name: 'Samsung Biologics Co., Ltd.' },
  { symbol: '006400.KS', name: 'Samsung SDI Co., Ltd.' },
  { symbol: '051910.KS', name: 'LG Chem, Ltd.' },
  { symbol: '373220.KS', name: 'LG Energy Solution, Ltd.' },
  { symbol: '028260.KS', name: 'Samsung C&T Corporation' },
  { symbol: '036570.KS', name: 'NCsoft Corporation' },
  { symbol: '068270.KS', name: 'Celltrion, Inc.' },
  
  // India
  { symbol: 'RELIANCE.NS', name: 'Reliance Industries Limited' },
  { symbol: 'TCS.NS', name: 'Tata Consultancy Services Limited' },
  { symbol: 'HDFCBANK.NS', name: 'HDFC Bank Limited' },
  { symbol: 'INFY.NS', name: 'Infosys Limited' },
  { symbol: 'HINDUNILVR.NS', name: 'Hindustan Unilever Limited' },
  { symbol: 'ICICIBANK.NS', name: 'ICICI Bank Limited' },
  { symbol: 'SBIN.NS', name: 'State Bank of India' },
  { symbol: 'BHARTIARTL.NS', name: 'Bharti Airtel Limited' },
  { symbol: 'ITC.NS', name: 'ITC Limited' },
  { symbol: 'LT.NS', name: 'Larsen & Toubro Limited' },
  
  // Taiwan
  { symbol: '2330.TW', name: 'Taiwan Semiconductor Manufacturing Company Limited' },
  { symbol: '2454.TW', name: 'MediaTek Inc.' },
  { symbol: '2317.TW', name: 'Hon Hai Precision Industry Co., Ltd.' },
  { symbol: '1303.TW', name: 'Nan Ya Plastics Corporation' },
  { symbol: '2412.TW', name: 'Chunghwa Telecom Co., Ltd.' },
  { symbol: '1301.TW', name: 'Formosa Plastics Corporation' },
  { symbol: '2881.TW', name: 'Fubon Financial Holding Co., Ltd.' },
  { symbol: '2357.TW', name: 'ASUSTEK Computer Inc.' },
  { symbol: '2886.TW', name: 'Mega Financial Holding Co., Ltd.' },
  { symbol: '3711.TW', name: 'ASE Technology Holding Co., Ltd.' },
  
  // Singapore
  { symbol: 'D05.SI', name: 'DBS Group Holdings Ltd' },
  { symbol: 'O39.SI', name: 'Oversea-Chinese Banking Corporation Limited' },
  { symbol: 'U11.SI', name: 'United Overseas Bank Limited' },
  { symbol: 'Z74.SI', name: 'Singapore Telecommunications Limited' },
  { symbol: 'C6L.SI', name: 'Singapore Airlines Limited' },
  { symbol: 'V03.SI', name: 'Venture Corporation Limited' },
  { symbol: 'G13.SI', name: 'Genting Singapore Limited' },
  { symbol: 'C09.SI', name: 'City Developments Limited' },
  { symbol: 'U96.SI', name: 'Sembcorp Industries Ltd' },
  { symbol: 'F34.SI', name: 'Wilmar International Limited' }
];

// Major Australian companies
const australianCompanies = [
  { symbol: 'CBA.AX', name: 'Commonwealth Bank of Australia' },
  { symbol: 'BHP.AX', name: 'BHP Group Limited' },
  { symbol: 'CSL.AX', name: 'CSL Limited' },
  { symbol: 'ANZ.AX', name: 'Australia and New Zealand Banking Group Limited' },
  { symbol: 'WBC.AX', name: 'Westpac Banking Corporation' },
  { symbol: 'NAB.AX', name: 'National Australia Bank Limited' },
  { symbol: 'WOW.AX', name: 'Woolworths Group Limited' },
  { symbol: 'TLS.AX', name: 'Telstra Corporation Limited' },
  { symbol: 'RIO.AX', name: 'Rio Tinto Limited' },
  { symbol: 'MQG.AX', name: 'Macquarie Group Limited' },
  { symbol: 'WES.AX', name: 'Wesfarmers Limited' },
  { symbol: 'TCL.AX', name: 'Transurban Group' },
  { symbol: 'FMG.AX', name: 'Fortescue Metals Group Ltd' },
  { symbol: 'STO.AX', name: 'Santos Limited' },
  { symbol: 'COL.AX', name: 'Coles Group Limited' },
  { symbol: 'WDS.AX', name: 'Woodside Energy Group Ltd' },
  { symbol: 'QBE.AX', name: 'QBE Insurance Group Limited' },
  { symbol: 'ALL.AX', name: 'Aristocrat Leisure Limited' },
  { symbol: 'REA.AX', name: 'REA Group Ltd' },
  { symbol: 'GMG.AX', name: 'Goodman Group' }
];

export async function processEuropeanBatch(): Promise<{ added: number, failed: number }> {
  let added = 0;
  let failed = 0;

  for (const company of europeanCompanies) {
    try {
      const existing = await storage.getStock(company.symbol);
      if (!existing) {
        await storage.createStock({
          symbol: company.symbol,
          name: company.name,
          exchange: 'European',
          sector: 'Multi-National',
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

export async function processAsianBatch(): Promise<{ added: number, failed: number }> {
  let added = 0;
  let failed = 0;

  for (const company of asianCompanies) {
    try {
      const existing = await storage.getStock(company.symbol);
      if (!existing) {
        let exchange = 'Asian';
        if (company.symbol.includes('.KS')) exchange = 'Korea';
        else if (company.symbol.includes('.NS')) exchange = 'India';
        else if (company.symbol.includes('.TW')) exchange = 'Taiwan';
        else if (company.symbol.includes('.SI')) exchange = 'Singapore';

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

export async function processAustralianBatch(): Promise<{ added: number, failed: number }> {
  let added = 0;
  let failed = 0;

  for (const company of australianCompanies) {
    try {
      const existing = await storage.getStock(company.symbol);
      if (!existing) {
        await storage.createStock({
          symbol: company.symbol,
          name: company.name,
          exchange: 'ASX',
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