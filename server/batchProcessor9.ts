import { storage } from './storage';

// Major Chinese companies
const chineseCompanies = [
  { symbol: '0700.HK', name: 'Tencent Holdings Limited' },
  { symbol: '9988.HK', name: 'Alibaba Group Holding Limited' },
  { symbol: '0939.HK', name: 'China Construction Bank Corporation' },
  { symbol: '1398.HK', name: 'Industrial and Commercial Bank of China Limited' },
  { symbol: '3988.HK', name: 'Bank of China Limited' },
  { symbol: '2318.HK', name: 'Ping An Insurance (Group) Company of China, Ltd.' },
  { symbol: '0005.HK', name: 'HSBC Holdings plc' },
  { symbol: '0941.HK', name: 'China Mobile Limited' },
  { symbol: '0883.HK', name: 'CNOOC Limited' },
  { symbol: '0386.HK', name: 'China Petroleum & Chemical Corporation' },
  { symbol: '1299.HK', name: 'AIA Group Limited' },
  { symbol: '1109.HK', name: 'China Resources Land Limited' },
  { symbol: '2388.HK', name: 'BOC Hong Kong (Holdings) Limited' },
  { symbol: '0857.HK', name: 'PetroChina Company Limited' },
  { symbol: '0823.HK', name: 'The Link Real Estate Investment Trust' },
  { symbol: '0001.HK', name: 'CK Hutchison Holdings Limited' },
  { symbol: '0017.HK', name: 'New World Development Company Limited' },
  { symbol: '0016.HK', name: 'Sun Hung Kai Properties Limited' },
  { symbol: '1113.HK', name: 'CK Asset Holdings Limited' },
  { symbol: '2020.HK', name: 'ANTA Sports Products Limited' },
  { symbol: '0002.HK', name: 'CLP Holdings Limited' },
  { symbol: '0003.HK', name: 'The Hong Kong and China Gas Company Limited' },
  { symbol: '0011.HK', name: 'Hang Seng Bank Limited' },
  { symbol: '0012.HK', name: 'Henderson Land Development Company Limited' },
  { symbol: '0066.HK', name: 'MTR Corporation Limited' },
  { symbol: '0101.HK', name: 'Hang Lung Properties Limited' },
  { symbol: '0151.HK', name: 'Want Want China Holdings Limited' },
  { symbol: '0267.HK', name: 'CITIC Limited' },
  { symbol: '0288.HK', name: 'WH Group Limited' },
  { symbol: '0762.HK', name: 'China Unicom (Hong Kong) Limited' },
  { symbol: '0968.HK', name: 'Xinyi Glass Holdings Limited' },
  { symbol: '1044.HK', name: 'Hengan International Group Company Limited' },
  { symbol: '1093.HK', name: 'CSPC Pharmaceutical Group Limited' },
  { symbol: '1177.HK', name: 'Sino Biopharmaceutical Limited' },
  { symbol: '1211.HK', name: 'BYD Company Limited' },
  { symbol: '1336.HK', name: 'New China Life Insurance Company Ltd.' },
  { symbol: '1339.HK', name: 'China People\'s Insurance Company (Group) of China Limited' },
  { symbol: '1359.HK', name: 'China Cinda Asset Management Co., Ltd.' },
  { symbol: '1378.HK', name: 'China Hongqiao Group Limited' },
  { symbol: '1816.HK', name: 'CGN Power Co., Ltd.' },
  { symbol: '1919.HK', name: 'COSCO SHIPPING Holdings Co., Ltd.' },
  { symbol: '1928.HK', name: 'Sands China Ltd.' },
  { symbol: '1997.HK', name: 'Wharf Real Estate Investment Company Limited' },
  { symbol: '2007.HK', name: 'Country Garden Holdings Company Limited' },
  { symbol: '2018.HK', name: 'AAC Technologies Holdings Inc.' },
  { symbol: '2269.HK', name: 'Wuxi Biologics (Cayman) Inc.' },
  { symbol: '2313.HK', name: 'Shenzhou International Group Holdings Limited' },
  { symbol: '2319.HK', name: 'China Mengniu Dairy Company Limited' },
  { symbol: '2328.HK', name: 'PICC Property and Casualty Company Limited' },
  { symbol: '2382.HK', name: 'Sunny Optical Technology (Group) Company Limited' },
  { symbol: '2628.HK', name: 'China Life Insurance Company Limited' },
  { symbol: '3690.HK', name: 'Meituan' },
  { symbol: '3968.HK', name: 'China Merchants Bank Co., Ltd.' },
  { symbol: '6098.HK', name: 'Country Garden Services Holdings Company Limited' }
];

// Major Japanese companies (additional to existing)
const additionalJapaneseCompanies = [
  { symbol: '7203.T', name: 'Toyota Motor Corporation' },
  { symbol: '6758.T', name: 'Sony Group Corporation' },
  { symbol: '6861.T', name: 'Keyence Corporation' },
  { symbol: '4063.T', name: 'Shin-Etsu Chemical Co., Ltd.' },
  { symbol: '6954.T', name: 'Fanuc Corporation' },
  { symbol: '7974.T', name: 'Nintendo Co., Ltd.' },
  { symbol: '4519.T', name: 'Chugai Pharmaceutical Co., Ltd.' },
  { symbol: '8035.T', name: 'Tokyo Electron Limited' },
  { symbol: '6367.T', name: 'Daikin Industries, Ltd.' },
  { symbol: '4452.T', name: 'Kao Corporation' },
  { symbol: '4578.T', name: 'Otsuka Holdings Co., Ltd.' },
  { symbol: '6326.T', name: 'Kubota Corporation' },
  { symbol: '7733.T', name: 'Olympus Corporation' },
  { symbol: '6273.T', name: 'SMC Corporation' },
  { symbol: '6594.T', name: 'Nidec Corporation' },
  { symbol: '4568.T', name: 'Daiichi Sankyo Company, Limited' },
  { symbol: '7741.T', name: 'HOYA Corporation' },
  { symbol: '6752.T', name: 'Panasonic Holdings Corporation' },
  { symbol: '6981.T', name: 'Murata Manufacturing Co., Ltd.' },
  { symbol: '9432.T', name: 'Nippon Telegraph and Telephone Corporation' },
  { symbol: '8306.T', name: 'Mitsubishi UFJ Financial Group, Inc.' },
  { symbol: '8316.T', name: 'Sumitomo Mitsui Financial Group, Inc.' },
  { symbol: '8411.T', name: 'Mizuho Financial Group, Inc.' },
  { symbol: '7751.T', name: 'Canon Inc.' },
  { symbol: '4902.T', name: 'Konica Minolta, Inc.' },
  { symbol: '6098.T', name: 'Recruit Holdings Co., Ltd.' },
  { symbol: '9984.T', name: 'SoftBank Group Corp.' },
  { symbol: '6503.T', name: 'Mitsubishi Electric Corporation' },
  { symbol: '7267.T', name: 'Honda Motor Co., Ltd.' },
  { symbol: '7201.T', name: 'Nissan Motor Co., Ltd.' },
  { symbol: '5401.T', name: 'Nippon Steel Corporation' },
  { symbol: '8002.T', name: 'Marubeni Corporation' },
  { symbol: '8031.T', name: 'Mitsui & Co., Ltd.' },
  { symbol: '8058.T', name: 'Mitsubishi Corporation' },
  { symbol: '9437.T', name: 'NTT DOCOMO, INC.' },
  { symbol: '9434.T', name: 'SoftBank Corp.' },
  { symbol: '2914.T', name: 'Japan Tobacco Inc.' },
  { symbol: '4661.T', name: 'Oriental Land Co., Ltd.' },
  { symbol: '3659.T', name: 'Nexon Co., Ltd.' },
  { symbol: '6724.T', name: 'Seiko Epson Corporation' },
  { symbol: '6501.T', name: 'Hitachi, Ltd.' },
  { symbol: '6504.T', name: 'Fuji Electric Co., Ltd.' },
  { symbol: '6762.T', name: 'TDK Corporation' },
  { symbol: '6479.T', name: 'Minebea Mitsumi Inc.' },
  { symbol: '8766.T', name: 'Tokio Marine Holdings, Inc.' },
  { symbol: '8750.T', name: 'Dai-ichi Life Holdings, Inc.' },
  { symbol: '2801.T', name: 'Kikkoman Corporation' },
  { symbol: '2802.T', name: 'Ajinomoto Co., Inc.' },
  { symbol: '4005.T', name: 'Sumitomo Chemical Company, Limited' },
  { symbol: '4183.T', name: 'Mitsui Chemicals, Inc.' },
  { symbol: '5020.T', name: 'JX Holdings, Inc.' }
];

// Major Latin American companies
const latinAmericanCompanies = [
  // Brazil
  { symbol: 'VALE3.SA', name: 'Vale S.A.' },
  { symbol: 'PETR4.SA', name: 'Petróleo Brasileiro S.A. - Petrobras' },
  { symbol: 'ITUB4.SA', name: 'Itaú Unibanco Holding S.A.' },
  { symbol: 'BBDC4.SA', name: 'Banco Bradesco S.A.' },
  { symbol: 'ABEV3.SA', name: 'Ambev S.A.' },
  { symbol: 'B3SA3.SA', name: 'B3 S.A. - Brasil, Bolsa, Balcão' },
  { symbol: 'WEGE3.SA', name: 'WEG S.A.' },
  { symbol: 'RENT3.SA', name: 'Localiza Rent a Car S.A.' },
  { symbol: 'LREN3.SA', name: 'Lojas Renner S.A.' },
  { symbol: 'MGLU3.SA', name: 'Magazine Luiza S.A.' },
  
  // Mexico
  { symbol: 'AMXL.MX', name: 'América Móvil, S.A.B. de C.V.' },
  { symbol: 'WALMEX.MX', name: 'Wal-Mart de México, S.A.B. de C.V.' },
  { symbol: 'FEMSA.MX', name: 'Fomento Económico Mexicano, S.A.B. de C.V.' },
  { symbol: 'GMEXICO.MX', name: 'Grupo México, S.A.B. de C.V.' },
  { symbol: 'CEMEX.MX', name: 'CEMEX, S.A.B. de C.V.' },
  { symbol: 'TLEVISA.MX', name: 'Grupo Televisa, S.A.B.' },
  { symbol: 'BIMBO.MX', name: 'Grupo Bimbo, S.A.B. de C.V.' },
  { symbol: 'ELEKTRA.MX', name: 'Grupo Elektra, S.A.B. de C.V.' },
  { symbol: 'PINFRA.MX', name: 'Promotora y Operadora de Infraestructura, S.A.B. de C.V.' },
  { symbol: 'ALFA.MX', name: 'Alfa, S.A.B. de C.V.' },
  
  // Chile
  { symbol: 'FALABELLA.SN', name: 'S.A.C.I. Falabella' },
  { symbol: 'COPEC.SN', name: 'Empresas Copec S.A.' },
  { symbol: 'CHILE.SN', name: 'Banco de Chile' },
  { symbol: 'BCI.SN', name: 'Banco de Crédito e Inversiones' },
  { symbol: 'CMPC.SN', name: 'Empresas CMPC S.A.' },
  { symbol: 'COLBUN.SN', name: 'Colbún S.A.' },
  { symbol: 'CENCOSUD.SN', name: 'Cencosud S.A.' },
  { symbol: 'ENELAM.SN', name: 'Enel Américas S.A.' },
  { symbol: 'PARAUCO.SN', name: 'Parque Arauco S.A.' },
  { symbol: 'VAPORES.SN', name: 'Compañía Sud Americana de Vapores S.A.' }
];

export async function processChineseBatch(): Promise<{ added: number, failed: number }> {
  let added = 0;
  let failed = 0;

  for (const company of chineseCompanies) {
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

export async function processAdditionalJapaneseBatch(): Promise<{ added: number, failed: number }> {
  let added = 0;
  let failed = 0;

  for (const company of additionalJapaneseCompanies) {
    try {
      const existing = await storage.getStock(company.symbol);
      if (!existing) {
        await storage.createStock({
          symbol: company.symbol,
          name: company.name,
          exchange: 'TSE',
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

export async function processLatinAmericanBatch(): Promise<{ added: number, failed: number }> {
  let added = 0;
  let failed = 0;

  for (const company of latinAmericanCompanies) {
    try {
      const existing = await storage.getStock(company.symbol);
      if (!existing) {
        let exchange = 'Latin America';
        if (company.symbol.includes('.SA')) exchange = 'Brazil';
        else if (company.symbol.includes('.MX')) exchange = 'Mexico';
        else if (company.symbol.includes('.SN')) exchange = 'Chile';

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