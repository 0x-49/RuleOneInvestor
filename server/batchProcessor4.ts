import { storage } from './storage';

// Mixed international companies (250-350 range) from your 1,103 company list
const mixedInternationalCompanies = [
  { symbol: '3526', name: 'ALLTOP TECHNOLOGY CO LTD' },
  { symbol: 'OKOMUOIL', name: 'OKOMU OIL PALM CO PLC' },
  { symbol: 'CASS', name: 'CAHAYA AERO SERVICES TBK' },
  { symbol: 'NAPESCO', name: 'NATIONAL PETROLEUM SERVICES' },
  { symbol: 'SECT_B', name: 'SECTRA AB SER B' },
  { symbol: 'PM', name: 'PREMIER MARKETING PUBLIC CO LTD' },
  { symbol: 'HALEON', name: 'HALEON PAKISTAN LTD' },
  { symbol: 'LBW', name: 'LUBAWA' },
  { symbol: 'EXAE', name: 'HELLENIC EXCHANGES (CR)' },
  { symbol: 'EFIH', name: 'E-FINANCE FOR DIGITAL AND FINANCIAL INVESTMENTS' },
  { symbol: 'SNL', name: 'SUPPLY NETWORK LIMITED' },
  { symbol: '2161', name: 'JBM (HEALTHCARE) LTD' },
  { symbol: 'HINOON', name: 'HIGHNOON LABORATORIES LTD' },
  { symbol: '9528', name: 'GAS ARABIAN SERVICES CO.' },
  { symbol: '6143', name: 'NETRONIX INC' },
  { symbol: 'MEGM', name: 'MIDDLE EAST GLASS MANUFACTURING' },
  { symbol: '6788', name: 'BRILLIAN NETWORK & AUTOMATION INTEG' },
  { symbol: 'GNP', name: 'GENUSPLUS GROUP LTD' },
  { symbol: '300515', name: 'HUNAN SUNDAY SCIEN' },
  { symbol: 'AAI', name: 'ASIAN ALLIANCE INTERNATIONAL PCL' },
  { symbol: 'NTGAZ', name: 'NATURELGAZ' },
  { symbol: '6728', name: 'UP YOUNG CORNERSTONE CORP' },
  { symbol: 'SPR', name: 'SPYROSOFT' },
  { symbol: 'NORBT', name: 'NORBIT ASA' },
  { symbol: 'MKO', name: 'MAKO MINING CORP' },
  { symbol: 'SYS1', name: 'SYSTEM1 GROUP PLC ORD GBP0.01' },
  { symbol: 'MIPS', name: 'MIPS AB' },
  { symbol: 'NEA', name: 'NICOLAS CORREA' },
  { symbol: 'SRB', name: 'SERABI GOLD PLC ORD GBP0.10' },
  { symbol: 'SISB', name: 'SISB PCL' },
  { symbol: 'SXE', name: 'SOUTHERN CROSS ELECTRICAL ENGINEERING LTD' },
  { symbol: 'WAX', name: 'WAM RESEARCH LIMITED' },
  { symbol: 'NSL', name: 'NSL FOODS PCL' },
  { symbol: 'GNG', name: 'GR ENGINEERING SERVICES LIMITED' },
  { symbol: 'ALL', name: 'AILLERON' },
  { symbol: 'IPG', name: 'IPD GROUP LTD' },
  { symbol: 'NASCON', name: 'NASCON ALLIED INDUSTRIES PLC' },
  { symbol: 'MAGNI', name: 'MAGNI-TECH INDUSTRIES BHD' },
  { symbol: 'HME', name: 'HEMISPHERE ENERGY CORPORATION' },
  { symbol: '6741', name: '91APP INC' },
  { symbol: '123860', name: 'ANAPASS, INC.' },
  { symbol: 'BBW', name: 'AZEUS' },
  { symbol: '6231', name: 'INSYDE SOFTWARE CORP' },
  { symbol: '335890', name: 'VIOL CO., LTD.' },
  { symbol: 'EZZ', name: 'EZZ LIFE SCIENCE HOLDINGS LIMITED' },
  { symbol: 'PLC', name: 'PLC' },
  { symbol: '5262', name: 'GIGASTONE CORPORATION' },
  { symbol: 'SCS', name: 'SAIGON CARGO SERVICE CORP' },
  { symbol: 'SGN', name: 'SYGNITY' },
  { symbol: 'TRANSCOHOT', name: 'TRANSCORP HOTELS PLC' },
  { symbol: 'MHOT', name: 'MISR HOTELS' }
];

// Additional US tech companies to expand the database
const additionalUSCompanies = [
  { symbol: 'GOOGL', name: 'Alphabet Inc.' },
  { symbol: 'GOOG', name: 'Alphabet Inc.' },
  { symbol: 'AMZN', name: 'Amazon.com, Inc.' },
  { symbol: 'TSLA', name: 'Tesla, Inc.' },
  { symbol: 'NFLX', name: 'Netflix, Inc.' },
  { symbol: 'CRM', name: 'Salesforce, Inc.' },
  { symbol: 'ADBE', name: 'Adobe Inc.' },
  { symbol: 'NOW', name: 'ServiceNow, Inc.' },
  { symbol: 'INTU', name: 'Intuit Inc.' },
  { symbol: 'AMD', name: 'Advanced Micro Devices, Inc.' },
  { symbol: 'INTC', name: 'Intel Corporation' },
  { symbol: 'MU', name: 'Micron Technology, Inc.' },
  { symbol: 'AVGO', name: 'Broadcom Inc.' },
  { symbol: 'TXN', name: 'Texas Instruments Incorporated' },
  { symbol: 'AMAT', name: 'Applied Materials, Inc.' },
  { symbol: 'ADI', name: 'Analog Devices, Inc.' },
  { symbol: 'MRVL', name: 'Marvell Technology, Inc.' },
  { symbol: 'KLAC', name: 'KLA Corporation' },
  { symbol: 'CDNS', name: 'Cadence Design Systems, Inc.' },
  { symbol: 'SNPS', name: 'Synopsys, Inc.' },
  { symbol: 'ASML', name: 'ASML Holding N.V.' },
  { symbol: 'ARM', name: 'Arm Holdings plc' },
  { symbol: 'ON', name: 'ON Semiconductor Corporation' },
  { symbol: 'MCHP', name: 'Microchip Technology Incorporated' },
  { symbol: 'MPWR', name: 'Monolithic Power Systems, Inc.' },
  { symbol: 'SWKS', name: 'Skyworks Solutions, Inc.' },
  { symbol: 'QRVO', name: 'Qorvo, Inc.' },
  { symbol: 'ENPH', name: 'Enphase Energy, Inc.' },
  { symbol: 'SEDG', name: 'SolarEdge Technologies, Inc.' },
  { symbol: 'FTNT', name: 'Fortinet, Inc.' },
  { symbol: 'PANW', name: 'Palo Alto Networks, Inc.' },
  { symbol: 'CRWD', name: 'CrowdStrike Holdings, Inc.' },
  { symbol: 'ZS', name: 'Zscaler, Inc.' },
  { symbol: 'OKTA', name: 'Okta, Inc.' },
  { symbol: 'NET', name: 'Cloudflare, Inc.' },
  { symbol: 'DDOG', name: 'Datadog, Inc.' },
  { symbol: 'MDB', name: 'MongoDB, Inc.' },
  { symbol: 'SNOW', name: 'Snowflake Inc.' },
  { symbol: 'PLTR', name: 'Palantir Technologies Inc.' },
  { symbol: 'RBLX', name: 'Roblox Corporation' },
  { symbol: 'U', name: 'Unity Software Inc.' },
  { symbol: 'DOCU', name: 'DocuSign, Inc.' },
  { symbol: 'ZM', name: 'Zoom Video Communications, Inc.' },
  { symbol: 'TEAM', name: 'Atlassian Corporation' },
  { symbol: 'WDAY', name: 'Workday, Inc.' },
  { symbol: 'SPLK', name: 'Splunk Inc.' },
  { symbol: 'VEEV', name: 'Veeva Systems Inc.' },
  { symbol: 'ZEN', name: 'Zendesk, Inc.' },
  { symbol: 'TWLO', name: 'Twilio Inc.' },
  { symbol: 'SQ', name: 'Block, Inc.' },
  { symbol: 'SHOP', name: 'Shopify Inc.' }
];

export async function processMixedInternationalBatch(): Promise<{ added: number, failed: number }> {
  let added = 0;
  let failed = 0;

  for (const company of mixedInternationalCompanies) {
    try {
      const existing = await storage.getStock(company.symbol);
      if (!existing) {
        // Determine exchange based on symbol patterns
        let exchange = 'OTHER';
        if (company.symbol.match(/^\d+$/)) {
          exchange = company.symbol.length === 4 ? 'TSE' : 'Taiwan';
        } else if (company.symbol.includes('_') || company.symbol.endsWith('B')) {
          exchange = 'European';
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

export async function processAdditionalUSBatch(): Promise<{ added: number, failed: number }> {
  let added = 0;
  let failed = 0;

  for (const company of additionalUSCompanies) {
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