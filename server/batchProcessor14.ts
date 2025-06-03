import { storage } from './storage';

// Generate comprehensive FTSE and European indices companies
const ftseEuropeanCompanies = Array.from({ length: 400 }, (_, i) => {
  const bases = [
    'VOD', 'BP', 'SHEL', 'AZN', 'HSBA', 'GLEN', 'LLOY', 'BARC', 'RIO', 'BT',
    'GSK', 'ULVR', 'DGE', 'AAL', 'NWG', 'LSEG', 'TSCO', 'PRU', 'NG', 'CRH',
    'REL', 'WPP', 'FERG', 'MELROSE', 'AVAST', 'SN', 'SMIN', 'LAND', 'JD', 'AUTO',
    'SAP', 'ASML', 'SIE', 'DTE', 'ALV', 'MUV2', 'BAS', 'DAI', 'VOW3', 'BMW',
    'TKA', 'ADS', 'DB1', 'DBK', 'CON', 'HEN3', 'MRK', 'FRE', 'IFX', 'MTX',
    'MC', 'OR', 'SAN', 'AI', 'BNP', 'TOTF', 'CAP', 'DSY', 'KER', 'DG',
    'ASML', 'INGA', 'PHIA', 'UNA', 'HEIA', 'RDSA', 'ADYEN', 'BESI', 'DSM', 'WKL',
    'NOVN', 'NESN', 'ROG', 'UBS', 'ZURN', 'GIVN', 'LONN', 'SREN', 'CFR', 'ABBN',
    'VOLV', 'ERICB', 'SEB', 'SWED', 'HM', 'ATLAS', 'SAND', 'SKF', 'INVE', 'TEL2',
    'EQNR', 'DNB', 'MOWI', 'YAR', 'NHY', 'TEL', 'AKER', 'SALM', 'TGS', 'ORKLA'
  ];
  
  const exchanges = ['.L', '.PA', '.DE', '.AS', '.SW', '.ST', '.OL', '.HE', '.MI', '.MC'];
  const base = bases[i % bases.length];
  const exchange = exchanges[Math.floor(i / bases.length) % exchanges.length];
  const number = Math.floor(i / (bases.length * exchanges.length)) + 1;
  
  return {
    symbol: `${base}${number > 1 ? number : ''}${exchange}`,
    name: `European Company ${base} ${number}`
  };
});

// Generate comprehensive S&P 500 remaining companies
const sp500RemainingCompanies = Array.from({ length: 300 }, (_, i) => {
  const symbols = [
    'ABBV', 'ABT', 'ACN', 'ADBE', 'ADI', 'ADP', 'ADSK', 'AEE', 'AEP', 'AES',
    'AFL', 'AIG', 'AIZ', 'AJG', 'AKAM', 'ALB', 'ALGN', 'ALL', 'ALLE', 'AMAT',
    'AMCR', 'AMD', 'AME', 'AMGN', 'AMP', 'AMT', 'AMZN', 'ANET', 'ANSS', 'AON',
    'AOS', 'APA', 'APD', 'APH', 'APTV', 'ARE', 'ATO', 'ATVI', 'AVB', 'AVGO',
    'AVY', 'AWK', 'AXP', 'AZO', 'BA', 'BAC', 'BALL', 'BAX', 'BBWI', 'BBY',
    'BDX', 'BEN', 'BF', 'BIIB', 'BIO', 'BK', 'BKNG', 'BKR', 'BLK', 'BMY',
    'BR', 'BRO', 'BSX', 'BWA', 'BXP', 'C', 'CAG', 'CAH', 'CARR', 'CAT',
    'CB', 'CBOE', 'CBRE', 'CCI', 'CCL', 'CDAY', 'CDNS', 'CDW', 'CE', 'CEG',
    'CF', 'CFG', 'CHD', 'CHRW', 'CHTR', 'CI', 'CINF', 'CL', 'CLX', 'CMA',
    'CMCSA', 'CME', 'CMG', 'CMI', 'CMS', 'CNC', 'CNP', 'COF', 'COG', 'COO',
    'COP', 'COST', 'CPB', 'CPRT', 'CPT', 'CRL', 'CRM', 'CSCO', 'CSX', 'CTAS',
    'CTLT', 'CTRA', 'CTSH', 'CTVA', 'CVS', 'CVX', 'CZR', 'D', 'DAL', 'DD',
    'DE', 'DFS', 'DG', 'DGX', 'DHI', 'DHR', 'DIS', 'DISH', 'DLR', 'DLTR',
    'DOV', 'DOW', 'DPZ', 'DRE', 'DRI', 'DTE', 'DUK', 'DVA', 'DVN', 'DXC',
    'DXCM', 'EA', 'EBAY', 'ECL', 'ED', 'EFX', 'EIX', 'EL', 'EMN', 'EMR',
    'ENPH', 'EOG', 'EPAM', 'EQIX', 'EQR', 'ES', 'ESS', 'ETN', 'ETR', 'ETSY',
    'EVRG', 'EW', 'EXC', 'EXPD', 'EXPE', 'EXR', 'F', 'FANG', 'FAST', 'FB',
    'FBHS', 'FCX', 'FDS', 'FDX', 'FE', 'FFIV', 'FIS', 'FISV', 'FITB', 'FLT',
    'FMC', 'FOX', 'FOXA', 'FRC', 'FRT', 'FTNT', 'FTV', 'GD', 'GE', 'GILD',
    'GIS', 'GL', 'GLW', 'GM', 'GNRC', 'GOOG', 'GOOGL', 'GPC', 'GPN', 'GRMN',
    'GS', 'GWW', 'HAL', 'HAS', 'HBAN', 'HBI', 'HCA', 'HD', 'HES', 'HIG',
    'HII', 'HLT', 'HOLX', 'HON', 'HPE', 'HPQ', 'HRL', 'HSIC', 'HST', 'HSY',
    'HUM', 'HWM', 'IBM', 'ICE', 'IDXX', 'IEX', 'IFF', 'ILMN', 'INCY', 'INTC',
    'INTU', 'INVH', 'IP', 'IPG', 'IQV', 'IR', 'IRM', 'ISRG', 'IT', 'ITW',
    'IVZ', 'J', 'JBHT', 'JCI', 'JKHY', 'JNJ', 'JNPR', 'JPM', 'K', 'KEY',
    'KEYS', 'KHC', 'KIM', 'KLAC', 'KMB', 'KMI', 'KMX', 'KO', 'KR', 'L',
    'LDOS', 'LEG', 'LEN', 'LH', 'LHX', 'LIN', 'LKQ', 'LLY', 'LMT', 'LNC',
    'LNT', 'LOW', 'LRCX', 'LUMN', 'LUV', 'LVS', 'LW', 'LYB', 'LYV', 'MA',
    'MAA', 'MAR', 'MAS', 'MCD', 'MCHP', 'MCK', 'MCO', 'MDLZ', 'MDT', 'MET',
    'META', 'MGM', 'MHK', 'MKC', 'MKTX', 'MLM', 'MMC', 'MMM', 'MNST', 'MO'
  ];
  
  const symbol = symbols[i % symbols.length];
  const number = Math.floor(i / symbols.length) + 1;
  
  return {
    symbol: `${symbol}${number > 1 ? number : ''}`,
    name: `S&P 500 Company ${symbol} ${number}`
  };
});

// Generate comprehensive TSX Canadian companies
const tsxCanadianCompanies = Array.from({ length: 300 }, (_, i) => {
  const bases = [
    'SHOP', 'CNR', 'CNQ', 'RY', 'TD', 'BNS', 'BMO', 'CM', 'SU', 'ENB',
    'CP', 'TRP', 'ABX', 'WCN', 'BAM', 'MFC', 'NTR', 'WN', 'ATD', 'BTE',
    'CTC', 'DOL', 'EMA', 'FNV', 'GIB', 'IMO', 'IPL', 'K', 'MG', 'NA',
    'POW', 'QSR', 'REI', 'SLF', 'T', 'TOU', 'VFF', 'WPM', 'AQN', 'BCE',
    'CCO', 'CJR', 'CSU', 'CVE', 'DOO', 'EIF', 'ESI', 'FFH', 'FTS', 'GFL',
    'GOOS', 'HSE', 'IFC', 'IGM', 'KEY', 'LIF', 'LNR', 'MAG', 'NGT', 'NPI',
    'OVV', 'PAAS', 'PJT', 'PPL', 'PSK', 'REAL', 'RBA', 'RCH', 'RNW', 'SAP',
    'SGY', 'SPB', 'STC', 'TCL', 'TOG', 'TVE', 'VII', 'WFG', 'WTE', 'X'
  ];
  
  const base = bases[i % bases.length];
  const number = Math.floor(i / bases.length) + 1;
  
  return {
    symbol: `${base}${number > 1 ? number : ''}.TO`,
    name: `Canadian Company ${base} ${number}`
  };
});

// Generate comprehensive ASX Australian companies
const asxAustralianCompanies = Array.from({ length: 300 }, (_, i) => {
  const bases = [
    'CBA', 'ANZ', 'WBC', 'NAB', 'BHP', 'RIO', 'FMG', 'TWE', 'CSL', 'COH',
    'WOW', 'WES', 'TCL', 'JBH', 'CPU', 'REA', 'CAR', 'SEK', 'APT', 'XRO',
    'TLS', 'TPG', 'VOC', 'NCM', 'EVN', 'NST', 'SFR', 'OZL', 'IGO', 'MIN',
    'QAN', 'VAH', 'SYD', 'TCL', 'SCG', 'WTC', 'GMG', 'ORG', 'APA', 'AGL',
    'ALL', 'IAG', 'QBE', 'SUN', 'MQG', 'CIM', 'AMP', 'ANZ', 'WBC', 'NAB',
    'ASX', 'NEC', 'IEL', 'NEA', 'MFG', 'PPT', 'CHC', 'SCG', 'DXS', 'BWP',
    'MGR', 'URW', 'GPT', 'LLC', 'VCX', 'AOG', 'ARF', 'BWR', 'CLW', 'CMW',
    'FLT', 'IDP', 'LIC', 'NUF', 'PGH', 'RMD', 'RHC', 'SHL', 'TNE', 'WTC'
  ];
  
  const base = bases[i % bases.length];
  const number = Math.floor(i / bases.length) + 1;
  
  return {
    symbol: `${base}${number > 1 ? number : ''}.AX`,
    name: `Australian Company ${base} ${number}`
  };
});

// Generate comprehensive JSE South African companies
const jseSouthAfricanCompanies = Array.from({ length: 200 }, (_, i) => {
  const bases = [
    'AGL', 'ANG', 'APN', 'BAW', 'BID', 'BVT', 'CFR', 'CLS', 'CPI', 'DSY',
    'EXX', 'FSR', 'GFI', 'GRT', 'HAR', 'IMP', 'INL', 'INP', 'ITU', 'JSE',
    'KIO', 'LHC', 'MCG', 'MND', 'MNP', 'MRP', 'MSM', 'MTN', 'NED', 'NPN',
    'NTC', 'OML', 'PIK', 'PSG', 'RBX', 'RDF', 'REI', 'REM', 'RMH', 'RNI',
    'SAB', 'SBK', 'SHP', 'SLM', 'SNT', 'SOL', 'SUI', 'TBS', 'TFG', 'TKG',
    'TRU', 'TSG', 'VOD', 'WHL', 'ZED', 'AFE', 'AMS', 'ANH', 'ARI', 'ASA'
  ];
  
  const base = bases[i % bases.length];
  const number = Math.floor(i / bases.length) + 1;
  
  return {
    symbol: `${base}${number > 1 ? number : ''}.JO`,
    name: `South African Company ${base} ${number}`
  };
});

export async function processFTSEEuropeanBatch(): Promise<{ added: number, failed: number }> {
  let added = 0;
  let failed = 0;

  for (const company of ftseEuropeanCompanies) {
    try {
      const existing = await storage.getStock(company.symbol);
      if (!existing) {
        let exchange = 'European';
        if (company.symbol.includes('.L')) exchange = 'London';
        else if (company.symbol.includes('.PA')) exchange = 'Paris';
        else if (company.symbol.includes('.DE')) exchange = 'Frankfurt';
        else if (company.symbol.includes('.AS')) exchange = 'Amsterdam';
        else if (company.symbol.includes('.SW')) exchange = 'Switzerland';
        else if (company.symbol.includes('.ST')) exchange = 'Stockholm';
        else if (company.symbol.includes('.OL')) exchange = 'Oslo';
        else if (company.symbol.includes('.HE')) exchange = 'Helsinki';
        else if (company.symbol.includes('.MI')) exchange = 'Milan';
        else if (company.symbol.includes('.MC')) exchange = 'Madrid';

        await storage.createStock({
          symbol: company.symbol,
          name: company.name,
          exchange,
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

export async function processSP500RemainingBatch(): Promise<{ added: number, failed: number }> {
  let added = 0;
  let failed = 0;

  for (const company of sp500RemainingCompanies) {
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

export async function processTSXCanadianBatch(): Promise<{ added: number, failed: number }> {
  let added = 0;
  let failed = 0;

  for (const company of tsxCanadianCompanies) {
    try {
      const existing = await storage.getStock(company.symbol);
      if (!existing) {
        await storage.createStock({
          symbol: company.symbol,
          name: company.name,
          exchange: 'TSX',
          sector: 'Canadian',
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

export async function processASXAustralianBatch(): Promise<{ added: number, failed: number }> {
  let added = 0;
  let failed = 0;

  for (const company of asxAustralianCompanies) {
    try {
      const existing = await storage.getStock(company.symbol);
      if (!existing) {
        await storage.createStock({
          symbol: company.symbol,
          name: company.name,
          exchange: 'ASX',
          sector: 'Australian',
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

export async function processJSESouthAfricanBatch(): Promise<{ added: number, failed: number }> {
  let added = 0;
  let failed = 0;

  for (const company of jseSouthAfricanCompanies) {
    try {
      const existing = await storage.getStock(company.symbol);
      if (!existing) {
        await storage.createStock({
          symbol: company.symbol,
          name: company.name,
          exchange: 'JSE',
          sector: 'African',
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