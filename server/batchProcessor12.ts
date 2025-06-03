import { storage } from './storage';

// Generate comprehensive Russell 3000 companies (remaining from Russell indices)
const russell3000Companies = [
  // Technology sector expansion
  { symbol: 'ORCL', name: 'Oracle Corporation' },
  { symbol: 'CRM', name: 'Salesforce, Inc.' },
  { symbol: 'ADBE', name: 'Adobe Inc.' },
  { symbol: 'NOW', name: 'ServiceNow, Inc.' },
  { symbol: 'INTU', name: 'Intuit Inc.' },
  { symbol: 'WDAY', name: 'Workday, Inc.' },
  { symbol: 'SPLK', name: 'Splunk Inc.' },
  { symbol: 'VEEV', name: 'Veeva Systems Inc.' },
  { symbol: 'OKTA', name: 'Okta, Inc.' },
  { symbol: 'ZEN', name: 'Zendesk, Inc.' },
  { symbol: 'TWLO', name: 'Twilio Inc.' },
  { symbol: 'DOCU', name: 'DocuSign, Inc.' },
  { symbol: 'DDOG', name: 'Datadog, Inc.' },
  { symbol: 'MDB', name: 'MongoDB, Inc.' },
  { symbol: 'SNOW', name: 'Snowflake Inc.' },
  { symbol: 'PLTR', name: 'Palantir Technologies Inc.' },
  { symbol: 'RBLX', name: 'Roblox Corporation' },
  { symbol: 'U', name: 'Unity Software Inc.' },
  { symbol: 'NET', name: 'Cloudflare, Inc.' },
  { symbol: 'ZS', name: 'Zscaler, Inc.' },
  
  // Biotech and Healthcare expansion
  { symbol: 'AMGN', name: 'Amgen Inc.' },
  { symbol: 'GILD', name: 'Gilead Sciences, Inc.' },
  { symbol: 'REGN', name: 'Regeneron Pharmaceuticals, Inc.' },
  { symbol: 'VRTX', name: 'Vertex Pharmaceuticals Incorporated' },
  { symbol: 'BIIB', name: 'Biogen Inc.' },
  { symbol: 'MRNA', name: 'Moderna, Inc.' },
  { symbol: 'BNTX', name: 'BioNTech SE' },
  { symbol: 'NVAX', name: 'Novavax, Inc.' },
  { symbol: 'ILMN', name: 'Illumina, Inc.' },
  { symbol: 'ISRG', name: 'Intuitive Surgical, Inc.' },
  { symbol: 'DXCM', name: 'DexCom, Inc.' },
  { symbol: 'EW', name: 'Edwards Lifesciences Corporation' },
  { symbol: 'ZBH', name: 'Zimmer Biomet Holdings, Inc.' },
  { symbol: 'SYK', name: 'Stryker Corporation' },
  { symbol: 'BSX', name: 'Boston Scientific Corporation' },
  { symbol: 'MDT', name: 'Medtronic plc' },
  { symbol: 'HOLX', name: 'Hologic, Inc.' },
  { symbol: 'IDXX', name: 'IDEXX Laboratories, Inc.' },
  { symbol: 'IQV', name: 'IQVIA Holdings Inc.' },
  { symbol: 'CRL', name: 'Charles River Laboratories International, Inc.' },
  
  // Semiconductor expansion
  { symbol: 'NVDA', name: 'NVIDIA Corporation' },
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
  { symbol: 'ARM', name: 'Arm Holdings plc' },
  { symbol: 'ON', name: 'ON Semiconductor Corporation' },
  { symbol: 'MCHP', name: 'Microchip Technology Incorporated' },
  { symbol: 'SWKS', name: 'Skyworks Solutions, Inc.' },
  { symbol: 'QRVO', name: 'Qorvo, Inc.' },
  { symbol: 'ENPH', name: 'Enphase Energy, Inc.' },
  { symbol: 'SEDG', name: 'SolarEdge Technologies, Inc.' },
  { symbol: 'FSLR', name: 'First Solar, Inc.' },
  
  // Financial services expansion
  { symbol: 'BRK.A', name: 'Berkshire Hathaway Inc.' },
  { symbol: 'BRK.B', name: 'Berkshire Hathaway Inc.' },
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
  { symbol: 'NDAQ', name: 'Nasdaq, Inc.' },
  
  // Consumer and retail expansion
  { symbol: 'AMZN', name: 'Amazon.com, Inc.' },
  { symbol: 'HD', name: 'The Home Depot, Inc.' },
  { symbol: 'LOW', name: 'Lowe\'s Companies, Inc.' },
  { symbol: 'TJX', name: 'The TJX Companies, Inc.' },
  { symbol: 'BKNG', name: 'Booking Holdings Inc.' },
  { symbol: 'SBUX', name: 'Starbucks Corporation' },
  { symbol: 'NKE', name: 'NIKE, Inc.' },
  { symbol: 'LULU', name: 'Lululemon Athletica Inc.' },
  { symbol: 'ORLY', name: 'O\'Reilly Automotive, Inc.' },
  { symbol: 'AZO', name: 'AutoZone, Inc.' },
  { symbol: 'ULTA', name: 'Ulta Beauty, Inc.' },
  { symbol: 'BBY', name: 'Best Buy Co., Inc.' },
  { symbol: 'ETSY', name: 'Etsy, Inc.' },
  { symbol: 'EBAY', name: 'eBay Inc.' },
  { symbol: 'ABNB', name: 'Airbnb, Inc.' },
  { symbol: 'UBER', name: 'Uber Technologies, Inc.' },
  { symbol: 'LYFT', name: 'Lyft, Inc.' },
  { symbol: 'DASH', name: 'DoorDash, Inc.' },
  { symbol: 'ZG', name: 'Zillow Group, Inc.' },
  { symbol: 'REDFN', name: 'Redfin Corporation' },
  
  // Industrial expansion
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

// Generate additional international companies from emerging markets
const emergingMarketsCompanies = [
  // India expanded
  { symbol: 'INFY', name: 'Infosys Limited' },
  { symbol: 'WIT', name: 'Wipro Limited' },
  { symbol: 'HDB', name: 'HDFC Bank Limited' },
  { symbol: 'IBN', name: 'ICICI Bank Limited' },
  { symbol: 'VEDL', name: 'Vedanta Limited' },
  { symbol: 'TTM', name: 'Tata Motors Limited' },
  { symbol: 'SIFY', name: 'Sify Technologies Limited' },
  { symbol: 'RDY', name: 'Dr. Reddy\'s Laboratories Ltd.' },
  { symbol: 'REPL', name: 'Repligen Corporation' },
  { symbol: 'CTSH', name: 'Cognizant Technology Solutions Corporation' },
  
  // Brazil expanded
  { symbol: 'VALE', name: 'Vale S.A.' },
  { symbol: 'PBR', name: 'Petróleo Brasileiro S.A. - Petrobras' },
  { symbol: 'ITUB', name: 'Itaú Unibanco Holding S.A.' },
  { symbol: 'BBD', name: 'Banco Bradesco S.A.' },
  { symbol: 'ABEV', name: 'Ambev S.A.' },
  { symbol: 'UGP', name: 'Ultrapar Participações S.A.' },
  { symbol: 'CBD', name: 'Companhia Brasileira de Distribuição' },
  { symbol: 'SBS', name: 'Companhia de Saneamento Básico do Estado de São Paulo' },
  { symbol: 'ERJ', name: 'Embraer S.A.' },
  { symbol: 'CIG', name: 'Cia Energética de Minas Gerais' },
  
  // Mexico expanded
  { symbol: 'AMX', name: 'América Móvil, S.A.B. de C.V.' },
  { symbol: 'FMX', name: 'Fomento Económico Mexicano, S.A.B. de C.V.' },
  { symbol: 'TV', name: 'Grupo Televisa, S.A.B.' },
  { symbol: 'CX', name: 'CEMEX, S.A.B. de C.V.' },
  { symbol: 'KOF', name: 'Coca-Cola FEMSA, S.A.B. de C.V.' },
  { symbol: 'GGAL', name: 'Grupo Financiero Galicia S.A.' },
  { symbol: 'PAM', name: 'Pampa Energía S.A.' },
  { symbol: 'TGS', name: 'Transportadora de Gas del Sur S.A.' },
  { symbol: 'YPF', name: 'YPF Sociedad Anónima' },
  { symbol: 'BMA', name: 'Banco Macro S.A.' },
  
  // Russia/CIS
  { symbol: 'SBER', name: 'Sberbank of Russia' },
  { symbol: 'GAZP', name: 'Gazprom' },
  { symbol: 'LKOH', name: 'Lukoil' },
  { symbol: 'ROSN', name: 'Rosneft' },
  { symbol: 'NVTK', name: 'NOVATEK' },
  { symbol: 'TATN', name: 'Tatneft' },
  { symbol: 'GMKN', name: 'Nornickel' },
  { symbol: 'MAGN', name: 'Magnitogorsk Iron and Steel Works' },
  { symbol: 'CHMF', name: 'Severstal' },
  { symbol: 'ALRS', name: 'Alrosa' },
  
  // Turkey
  { symbol: 'AKBNK', name: 'Akbank T.A.S.' },
  { symbol: 'GARAN', name: 'Turkiye Garanti Bankasi A.S.' },
  { symbol: 'ISCTR', name: 'Turkiye Is Bankasi A.S.' },
  { symbol: 'VAKBN', name: 'VakifBank T.A.O.' },
  { symbol: 'SAHOL', name: 'Haci Omer Sabanci Holding A.S.' },
  { symbol: 'KCHOL', name: 'Koc Holding A.S.' },
  { symbol: 'TUPRS', name: 'Tupras Turkiye Petrol Rafinerileri A.S.' },
  { symbol: 'THYAO', name: 'Turk Hava Yollari AO' },
  { symbol: 'BIMAS', name: 'BIM Birlesik Magazalar A.S.' },
  { symbol: 'ARCLK', name: 'Arcelik A.S.' },
  
  // Thailand
  { symbol: 'PTT', name: 'PTT Public Company Limited' },
  { symbol: 'CPALL', name: 'CP ALL Public Company Limited' },
  { symbol: 'KBANK', name: 'Kasikornbank Public Company Limited' },
  { symbol: 'SCB', name: 'The Siam Commercial Bank Public Company Limited' },
  { symbol: 'BBL', name: 'Bangkok Bank Public Company Limited' },
  { symbol: 'ADVANC', name: 'Advanced Info Service Public Company Limited' },
  { symbol: 'DTAC', name: 'Total Access Communication Public Company Limited' },
  { symbol: 'TRUE', name: 'True Corporation Public Company Limited' },
  { symbol: 'AOT', name: 'Airports of Thailand Public Company Limited' },
  { symbol: 'CPFTH', name: 'Charoen Pokphand Foods Public Company Limited' }
];

export async function processRussell3000Batch(): Promise<{ added: number, failed: number }> {
  let added = 0;
  let failed = 0;

  for (const company of russell3000Companies) {
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

export async function processEmergingMarketsBatch(): Promise<{ added: number, failed: number }> {
  let added = 0;
  let failed = 0;

  for (const company of emergingMarketsCompanies) {
    try {
      const existing = await storage.getStock(company.symbol);
      if (!existing) {
        let exchange = 'Emerging Markets';
        let sector = 'Multi-National';
        
        // Determine exchange based on symbol pattern
        if (['INFY', 'WIT', 'HDB', 'IBN', 'VEDL', 'TTM', 'SIFY', 'RDY', 'REPL', 'CTSH'].includes(company.symbol)) {
          exchange = 'India';
          sector = 'Technology';
        } else if (['VALE', 'PBR', 'ITUB', 'BBD', 'ABEV', 'UGP', 'CBD', 'SBS', 'ERJ', 'CIG'].includes(company.symbol)) {
          exchange = 'Brazil';
          sector = 'Financial Services';
        } else if (['AMX', 'FMX', 'TV', 'CX', 'KOF', 'GGAL', 'PAM', 'TGS', 'YPF', 'BMA'].includes(company.symbol)) {
          exchange = 'Latin America';
          sector = 'Telecommunications';
        } else if (['SBER', 'GAZP', 'LKOH', 'ROSN', 'NVTK', 'TATN', 'GMKN', 'MAGN', 'CHMF', 'ALRS'].includes(company.symbol)) {
          exchange = 'Russia';
          sector = 'Energy';
        } else if (['AKBNK', 'GARAN', 'ISCTR', 'VAKBN', 'SAHOL', 'KCHOL', 'TUPRS', 'THYAO', 'BIMAS', 'ARCLK'].includes(company.symbol)) {
          exchange = 'Turkey';
          sector = 'Financial Services';
        } else if (['PTT', 'CPALL', 'KBANK', 'SCB', 'BBL', 'ADVANC', 'DTAC', 'TRUE', 'AOT', 'CPFTH'].includes(company.symbol)) {
          exchange = 'Thailand';
          sector = 'Energy';
        }

        await storage.createStock({
          symbol: company.symbol,
          name: company.name,
          exchange,
          sector,
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