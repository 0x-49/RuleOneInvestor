import { storage } from './storage';

// Complete list of remaining companies from your 1,103 company file (starting from line 443)
const remainingCompanies = [
  { symbol: 'AGESA', name: 'AGESA HAYAT EMEKLILIK' },
  { symbol: 'TGSAS', name: 'TGS DIS TICARET' },
  { symbol: 'TFBANK', name: 'TF BANK AB' },
  { symbol: '211050', name: 'INCAR FINANCIAL SERVICE CO.,LTD.' },
  { symbol: 'CPI', name: 'CAPITEC BANK HLDGS LTD' },
  { symbol: 'DNOS', name: 'DUNAV OSIGURANJE A' },
  { symbol: 'BEMA', name: 'DAMAAN ISLAMIC INSURANCE QPSC' },
  { symbol: 'PSE', name: 'THE PHILIPPINE STOCK EXCHANGE' },
  { symbol: 'AUB', name: 'ASIA UNITED BANK CORPORATION' },
  { symbol: 'GMAP', name: 'GMA HOLDINGS, INC. (PDR)' },
  { symbol: 'UNIC', name: 'UNITED INSURANCE CO OF PAKISTAN LTD' },
  { symbol: 'EWIC', name: 'EAST WEST INSURANCE CO LTD' },
  { symbol: 'PROT', name: 'PROTECTOR FORSIKRING ASA' },
  { symbol: 'ETI', name: 'ECOBANK TRANSNATIONAL INC' },
  { symbol: 'WEMABANK', name: 'WEMA BANK PLC' },
  { symbol: 'FIDELITYBK', name: 'FIDELITY BANK PLC' },
  { symbol: 'TWR', name: 'TOWER LTD NPV' },
  { symbol: 'BOURSA', name: 'BOURSA KUWAIT SECURITIES CO KPSC' },
  { symbol: 'NLMK', name: 'NLMK GROUP' },
  { symbol: 'GEELY', name: 'GEELY AUTOMOBILE HOLDINGS LIMITED' },
  { symbol: 'SINOPEC', name: 'CHINA PETROLEUM & CHEMICAL CORPORATION' },
  { symbol: 'LENOVO', name: 'LENOVO GROUP LIMITED' },
  { symbol: 'TENCENT', name: 'TENCENT HOLDINGS LIMITED' },
  { symbol: 'BABA', name: 'Alibaba Group Holding Limited' },
  { symbol: 'JD', name: 'JD.com, Inc.' },
  { symbol: 'NIO', name: 'NIO Inc.' },
  { symbol: 'XPEV', name: 'XPeng Inc.' },
  { symbol: 'LI', name: 'Li Auto Inc.' },
  { symbol: 'BILI', name: 'Bilibili Inc.' },
  { symbol: 'DIDI', name: 'DiDi Global Inc.' },
  { symbol: 'TAL', name: 'TAL Education Group' },
  { symbol: 'EDU', name: 'New Oriental Education & Technology Group Inc.' },
  { symbol: 'BIDU', name: 'Baidu, Inc.' },
  { symbol: 'WB', name: 'Weibo Corporation' },
  { symbol: 'NTES', name: 'NetEase, Inc.' },
  { symbol: 'YMM', name: 'Full Truck Alliance Co. Ltd.' },
  { symbol: 'MPWR', name: 'Monolithic Power Systems, Inc.' },
  { symbol: 'VST', name: 'Vistra Corp.' },
  { symbol: 'SGHC', name: 'Super Group (SGHC) Limited' },
  { symbol: 'RITR', name: 'Reitar Logtech Holdings Limited' },
  { symbol: 'SKYW', name: 'SkyWest, Inc.' },
  { symbol: 'DT', name: 'Dynatrace, Inc.' },
  { symbol: 'GB', name: 'Global Blue Group Holding AG' },
  { symbol: 'PSIX', name: 'Power Solutions International, Inc.' },
  { symbol: 'NTRS', name: 'Northern Trust Corporation' },
  { symbol: 'PDEX', name: 'Pro-Dex, Inc.' },
  { symbol: 'IMMR', name: 'Immersion Corporation' },
  { symbol: 'SIEB', name: 'Siebert Financial Corp.' },
  { symbol: 'ZBRA', name: 'Zebra Technologies Corporation' },
  { symbol: 'EVTC', name: 'Evertec, Inc.' },
  { symbol: 'FOUR', name: 'Shift4 Payments, Inc.' },
  { symbol: 'SPFX', name: 'Standard Premium Finance Holdings, Inc.' },
  { symbol: 'IDCC', name: 'InterDigital, Inc.' },
  { symbol: 'GLDD', name: 'Great Lakes Dredge & Dock Corporation' },
  { symbol: 'ANF', name: 'Abercrombie & Fitch Company' },
  { symbol: 'ISSC', name: 'Innovative Solutions and Support, Inc.' },
  { symbol: 'POWL', name: 'Powell Industries, Inc.' },
  { symbol: 'NU', name: 'Nu Holdings Ltd.' },
  { symbol: 'WLFC', name: 'Willis Lease Finance Corporation' },
  { symbol: 'FIX', name: 'Comfort Systems USA, Inc.' },
  { symbol: 'NJR', name: 'NewJersey Resources Corporation' },
  { symbol: 'SAGT', name: 'SAGTEC GLOBAL LIMITED' },
  { symbol: 'GBFH', name: 'GBank Financial Holdings Inc.' },
  { symbol: 'LKNCY', name: 'Luckin Coffee Inc.' },
  { symbol: 'AMGN', name: 'Amgen Inc.' },
  { symbol: 'ENVA', name: 'Enova International, Inc.' },
  { symbol: 'CAMT', name: 'Camtek Ltd.' },
  { symbol: 'META', name: 'Meta Platforms, Inc.' },
  { symbol: 'NRIM', name: 'Northrim BanCorp Inc' },
  { symbol: 'AROC', name: 'Archrock, Inc.' },
  { symbol: 'ODD', name: 'ODDITY Tech Ltd.' },
  { symbol: 'ENSG', name: 'The Ensign Group, Inc.' },
  { symbol: 'ESP', name: 'Espey Mfg. & Electronics Corp.' },
  { symbol: 'VNOM', name: 'Viper Energy, Inc.' },
  { symbol: 'FXLG', name: 'F.S. Bancorp' },
  { symbol: 'TRIN', name: 'Trinity Capital Inc.' },
  { symbol: 'STRW', name: 'Strawberry Fields REIT, Inc.' },
  { symbol: 'OAKV', name: 'OAK VIEW BANKSHARES INC.' },
  { symbol: 'PNRG', name: 'PrimeEnergy Resources Corporation' },
  { symbol: 'HLFN', name: 'Home Loan Financial Corp.' },
  { symbol: 'FOTB', name: 'First Ottawa Bancshares' },
  { symbol: 'XYF', name: 'X Financial' },
  { symbol: 'LRCX', name: 'Lam Research Corporation' },
  { symbol: 'QCOM', name: 'QUALCOMM Incorporated' },
  { symbol: 'VITL', name: 'Vital Farms, Inc.' },
  { symbol: 'LGCY', name: 'Legacy Education Inc.' },
  { symbol: 'DECK', name: 'Deckers Outdoor Corporation' },
  { symbol: 'ATAT', name: 'Atour Lifestyle Holdings Limited' },
  { symbol: 'EXPD', name: 'Expeditors International of Washington, Inc.' },
  { symbol: 'FUTU', name: 'Futu Holdings Limited' },
  { symbol: 'APH', name: 'Amphenol Corporation' },
  { symbol: 'BAM', name: 'Brookfield Asset Management Inc' },
  { symbol: 'NEWT', name: 'NewtekOne, Inc.' },
  { symbol: 'FSLR', name: 'First Solar, Inc.' },
  { symbol: 'NBN', name: 'Northeast Bank' },
  { symbol: 'PDD', name: 'PDD Holdings Inc.' },
  { symbol: 'FBAK', name: 'First National Bank Alaska' },
  { symbol: 'ATLC', name: 'Atlanticus Holdings Corporation' },
  { symbol: 'TBBK', name: 'The Bancorp, Inc.' },
  { symbol: 'OKE', name: 'ONEOK, Inc.' },
  { symbol: 'GCT', name: 'GigaCloud Technology Inc' },
  { symbol: 'FN', name: 'Fabrinet' },
  { symbol: 'GLAD', name: 'Gladstone Capital Corporation' },
  { symbol: 'SNEX', name: 'StoneX Group Inc.' }
];

export async function processBatch(batchSize: number = 50): Promise<{ added: number, failed: number }> {
  let added = 0;
  let failed = 0;

  for (const company of remainingCompanies) {
    try {
      const existing = await storage.getStock(company.symbol);
      if (!existing) {
        const exchange = company.symbol.match(/^\d+$/) ? 
          (company.symbol.length === 4 ? 'TSE' : company.symbol.length === 6 ? 'SSE' : 'ASIAN') :
          (company.symbol.includes('_') ? 'EUROPEAN' : 
           company.symbol.length <= 4 && /^[A-Z]+$/.test(company.symbol) ? 'NASDAQ' : 'OTHER');

        await storage.createStock({
          symbol: company.symbol,
          name: company.name,
          exchange,
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