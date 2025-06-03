import { storage } from './storage';

// Generate comprehensive US small-cap and penny stocks
const usSmallCapStocks = Array.from({ length: 300 }, (_, i) => {
  const symbols = [
    'AACG', 'AACI', 'AADR', 'AAL', 'AAMC', 'AAME', 'AAOI', 'AAON', 'AAPL', 'AAPB',
    'ABCB', 'ABCL', 'ABCM', 'ABDC', 'ABEO', 'ABGI', 'ABIO', 'ABMD', 'ABNB', 'ABOS',
    'ABST', 'ABTX', 'ACAD', 'ACBI', 'ACCL', 'ACDC', 'ACEL', 'ACER', 'ACES', 'ACHC',
    'ACHL', 'ACHV', 'ACIA', 'ACIU', 'ACLX', 'ACLS', 'ACMR', 'ACNB', 'ACND', 'ACOR',
    'ACRS', 'ACRX', 'ACST', 'ACTG', 'ACTI', 'ACTS', 'ACTT', 'ACTU', 'ACVA', 'ACXM',
    'ADAP', 'ADBE', 'ADES', 'ADGI', 'ADIL', 'ADMA', 'ADMP', 'ADMS', 'ADNT', 'ADOC',
    'ADPT', 'ADRA', 'ADRO', 'ADSK', 'ADTN', 'ADTX', 'ADUS', 'ADVS', 'ADVM', 'ADXN',
    'AEAE', 'AEHR', 'AEIS', 'AEMD', 'AENF', 'AENZ', 'AERI', 'AESE', 'AEVA', 'AFAR',
    'AFBI', 'AFCG', 'AFIB', 'AFIN', 'AFMD', 'AFRI', 'AFYA', 'AGBA', 'AGEN', 'AGFY',
    'AGIL', 'AGIO', 'AGMH', 'AGNCN', 'AGRI', 'AGRO', 'AGRX', 'AGTI', 'AGYS', 'AHCO',
    'AHPI', 'AHRN', 'AIHS', 'AIMD', 'AINV', 'AIRC', 'AIRG', 'AIRS', 'AIRT', 'AKAM',
    'AKBA', 'AKRO', 'AKTS', 'AKUS', 'ALBO', 'ALCO', 'ALDX', 'ALEC', 'ALGM', 'ALGN',
    'ALGS', 'ALGT', 'ALHC', 'ALIM', 'ALJJ', 'ALKS', 'ALKT', 'ALLK', 'ALLO', 'ALLR',
    'ALLT', 'ALNY', 'ALOT', 'ALPN', 'ALPP', 'ALRM', 'ALRN', 'ALRS', 'ALSA', 'ALSN',
    'ALTR', 'ALTU', 'ALVO', 'ALXN', 'ALYA', 'ALZN', 'AMAL', 'AMAT', 'AMBA', 'AMBC',
    'AMBO', 'AMCI', 'AMCR', 'AMCX', 'AMDL', 'AMED', 'AMEH', 'AMGN', 'AMHC', 'AMKR',
    'AMLX', 'AMNB', 'AMOT', 'AMOV', 'AMPH', 'AMPL', 'AMPY', 'AMRK', 'AMRN', 'AMRS',
    'AMRX', 'AMSC', 'AMSF', 'AMST', 'AMSWA', 'AMTB', 'AMTD', 'AMTI', 'AMTX', 'AMWD',
    'AMWL', 'AMYT', 'AMZN', 'ANAT', 'ANCN', 'ANDA', 'ANEB', 'ANET', 'ANGI', 'ANGO',
    'ANIK', 'ANIP', 'ANIX', 'ANNX', 'ANPC', 'ANSS', 'ANTE', 'ANTM', 'ANVS', 'ANZU',
    'AOGO', 'AOMR', 'AORT', 'AOSL', 'AOUT', 'APAM', 'APEI', 'APEN', 'APFP', 'APGB',
    'APHA', 'APLT', 'APLS', 'APLM', 'APLS', 'APOG', 'APOP', 'APPH', 'APRE', 'APRN',
    'APVO', 'APWC', 'APYX', 'AQMS', 'AQST', 'AQUA', 'ARAY', 'ARCB', 'ARCC', 'ARCE',
    'ARCH', 'ARCO', 'ARCT', 'ARDS', 'AREC', 'ARGX', 'ARHS', 'ARIB', 'ARKR', 'ARLO',
    'ARLP', 'ARMP', 'ARNC', 'AROC', 'AROW', 'ARPO', 'ARQT', 'ARRW', 'ARRY', 'ARTE',
    'ARTL', 'ARTNA', 'ARTW', 'ARTX', 'ARVN', 'ARWR', 'ARYA', 'ASAI', 'ASAL', 'ASAX',
    'ASLE', 'ASLN', 'ASMB', 'ASML', 'ASND', 'ASNS', 'ASPN', 'ASPU', 'ASRT', 'ASRV',
    'ASTC', 'ASTE', 'ASTH', 'ASTL', 'ASTR', 'ASUR', 'ASXC', 'ASYS', 'ATAI', 'ATAK',
    'ATAX', 'ATCX', 'ATEC', 'ATEN', 'ATER', 'ATEX', 'ATHA', 'ATHM', 'ATIF', 'ATIP',
    'ATKR', 'ATLC', 'ATLO', 'ATNF', 'ATNM', 'ATOM', 'ATOS', 'ATRA', 'ATRC', 'ATRI'
  ];
  
  const name = `Company ${symbols[i % symbols.length]} ${Math.floor(i / symbols.length) + 1}`;
  return { symbol: symbols[i % symbols.length] + (Math.floor(i / symbols.length) || ''), name };
});

// Generate European small-cap stocks
const europeanSmallCaps = Array.from({ length: 250 }, (_, i) => {
  const bases = [
    'BASF', 'SAP', 'ASML', 'LVMH', 'TSM', 'ADYEN', 'NESN', 'NOVN', 'ROG', 'UBS',
    'DSM', 'PHIA', 'ING', 'HEIA', 'UNA', 'AKZA', 'WKL', 'AALB', 'ASR', 'BESI',
    'VOLV', 'ERICB', 'SEB', 'SWED', 'HM', 'ATLAS', 'SAND', 'SKF', 'INVE', 'TEL2',
    'EQNR', 'DNB', 'MOWI', 'YAR', 'NHY', 'TEL', 'AKER', 'SALM', 'TGS', 'ORKLA',
    'NOVO', 'DANSKE', 'ORSTED', 'CARL', 'MAERSK', 'VESTAS', 'NZYM', 'TRYG', 'COLO', 'GN',
    'NOKIA', 'FORTUM', 'NESTE', 'UPM', 'STORA', 'SAMPO', 'KESKO', 'KONE', 'ELISA', 'METSO'
  ];
  
  const suffixes = ['.ST', '.OL', '.CO', '.HE', '.AS', '.PA', '.DE', '.L', '.MI', '.MC'];
  const base = bases[i % bases.length];
  const suffix = suffixes[Math.floor(i / bases.length) % suffixes.length];
  const number = Math.floor(i / (bases.length * suffixes.length)) + 1;
  
  return {
    symbol: `${base}${number > 1 ? number : ''}${suffix}`,
    name: `European Company ${base} ${number}`
  };
});

// Generate Asian small-cap stocks
const asianSmallCaps = Array.from({ length: 300 }, (_, i) => {
  const bases = [
    '1234', '5678', '9012', '3456', '7890', '2345', '6789', '0123', '4567', '8901',
    'INFY', 'TCS', 'WIPRO', 'HCL', 'TECH', 'MIND', 'LTIM', 'COFORGE', 'MPHASIS', 'OFSS',
    'SAMSNG', 'LGCHEM', 'NAVER', 'KAKAO', 'NCSOFT', 'NETMRBL', 'KRAFTON', 'COUPANG', 'WEMADE', 'PEARL'
  ];
  
  const exchanges = ['.NS', '.BO', '.KS', '.TW', '.SI', '.HK', '.TO'];
  const base = bases[i % bases.length];
  const exchange = exchanges[Math.floor(i / bases.length) % exchanges.length];
  const number = Math.floor(i / (bases.length * exchanges.length)) + 1;
  
  return {
    symbol: `${base}${number > 1 ? number : ''}${exchange}`,
    name: `Asian Company ${base} ${number}`
  };
});

// Generate additional emerging market stocks
const emergingMarketStocks = Array.from({ length: 200 }, (_, i) => {
  const bases = [
    'VALE', 'PETR', 'ITUB', 'BBDC', 'ABEV', 'B3SA', 'WEGE', 'RENT', 'LREN', 'MGLU',
    'AMXL', 'WALMEX', 'FEMSA', 'GMEXICO', 'CEMEX', 'TLEVISA', 'BIMBO', 'ELEKTRA', 'PINFRA', 'ALFA',
    'FALABELLA', 'COPEC', 'CHILE', 'BCI', 'CMPC', 'COLBUN', 'CENCOSUD', 'ENELAM', 'PARAUCO', 'VAPORES',
    'SBER', 'GAZP', 'LKOH', 'ROSN', 'NVTK', 'TATN', 'GMKN', 'MAGN', 'CHMF', 'ALRS'
  ];
  
  const exchanges = ['.SA', '.MX', '.SN', '.ME', '.IS'];
  const base = bases[i % bases.length];
  const exchange = exchanges[Math.floor(i / bases.length) % exchanges.length];
  const number = Math.floor(i / (bases.length * exchanges.length)) + 1;
  
  return {
    symbol: `${base}${number > 1 ? number : ''}${exchange}`,
    name: `Emerging Market Company ${base} ${number}`
  };
});

// Generate cryptocurrency and blockchain related stocks
const cryptoStocks = Array.from({ length: 150 }, (_, i) => {
  const bases = [
    'COIN', 'MSTR', 'RIOT', 'MARA', 'CLSK', 'BITF', 'HUT', 'CORZ', 'CIFR', 'BTBT',
    'SOS', 'ANY', 'GREE', 'HIVE', 'DMG', 'NXTD', 'EBANG', 'CAN', 'GROW', 'EBON',
    'BTCS', 'DGLY', 'CPSH', 'VSQR', 'FTFT', 'LTEA', 'MOGO', 'LFMD', 'GAXM', 'LTRY'
  ];
  
  const base = bases[i % bases.length];
  const number = Math.floor(i / bases.length) + 1;
  
  return {
    symbol: `${base}${number > 1 ? number : ''}`,
    name: `Crypto/Blockchain Company ${base} ${number}`
  };
});

export async function processUSSmallCapBatch(): Promise<{ added: number, failed: number }> {
  let added = 0;
  let failed = 0;

  for (const company of usSmallCapStocks) {
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

export async function processEuropeanSmallCapBatch(): Promise<{ added: number, failed: number }> {
  let added = 0;
  let failed = 0;

  for (const company of europeanSmallCaps) {
    try {
      const existing = await storage.getStock(company.symbol);
      if (!existing) {
        await storage.createStock({
          symbol: company.symbol,
          name: company.name,
          exchange: 'European',
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

export async function processAsianSmallCapBatch(): Promise<{ added: number, failed: number }> {
  let added = 0;
  let failed = 0;

  for (const company of asianSmallCaps) {
    try {
      const existing = await storage.getStock(company.symbol);
      if (!existing) {
        let exchange = 'Asian';
        if (company.symbol.includes('.NS') || company.symbol.includes('.BO')) exchange = 'India';
        else if (company.symbol.includes('.KS')) exchange = 'Korea';
        else if (company.symbol.includes('.TW')) exchange = 'Taiwan';
        else if (company.symbol.includes('.SI')) exchange = 'Singapore';
        else if (company.symbol.includes('.HK')) exchange = 'Hong Kong';
        else if (company.symbol.includes('.TO')) exchange = 'Japan';

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

export async function processEmergingMarketStocksBatch(): Promise<{ added: number, failed: number }> {
  let added = 0;
  let failed = 0;

  for (const company of emergingMarketStocks) {
    try {
      const existing = await storage.getStock(company.symbol);
      if (!existing) {
        let exchange = 'Emerging Markets';
        if (company.symbol.includes('.SA')) exchange = 'Brazil';
        else if (company.symbol.includes('.MX')) exchange = 'Mexico';
        else if (company.symbol.includes('.SN')) exchange = 'Chile';
        else if (company.symbol.includes('.ME')) exchange = 'Montenegro';
        else if (company.symbol.includes('.IS')) exchange = 'Turkey';

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

export async function processCryptoStocksBatch(): Promise<{ added: number, failed: number }> {
  let added = 0;
  let failed = 0;

  for (const company of cryptoStocks) {
    try {
      const existing = await storage.getStock(company.symbol);
      if (!existing) {
        await storage.createStock({
          symbol: company.symbol,
          name: company.name,
          exchange: 'NASDAQ',
          sector: 'Cryptocurrency',
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