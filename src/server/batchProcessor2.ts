import { storage } from './storage';

// Indian companies (900-1000 range) from your 1,103 company list
const indianCompanies = [
  { symbol: 'INDOUS', name: 'INDO US BIOTECH LTD' },
  { symbol: 'ARROWGREEN', name: 'ARROW GREENTECH LTD' },
  { symbol: 'KRISHANA', name: 'KRISHANA PHOSCHEM LTD' },
  { symbol: 'DEEPAKFERT', name: 'DEEPAK FERTILIZERS & PETR' },
  { symbol: 'RMC', name: 'RMC SWITCHGEARS LIMITED' },
  { symbol: 'WOMANCART', name: 'WOMANCART LTD' },
  { symbol: 'KPGEL', name: 'KP GREEN ENGINEERING LIMITED' },
  { symbol: 'FORCEMOT', name: 'FORCE MOTORS LTD' },
  { symbol: 'PRIMESECU', name: 'PRIME SECURITIES LTD' },
  { symbol: 'SAHANA', name: 'SAHANA SYSTEM LTD' },
  { symbol: 'ROBU', name: 'MACFOS LIMITED' },
  { symbol: 'KPEL', name: 'K.P. ENERGY LTD' },
  { symbol: 'ARYAMAN', name: 'ARYAMAN FINANCIAL SERVICES LTD' },
  { symbol: 'HECPROJECT', name: 'HEC INFRA PROJECTS LTD' },
  { symbol: 'IRISDOREME', name: 'IRIS CLOTHINGS LTD' },
  { symbol: 'CONTROLPR', name: 'CONTROL PRINT LTD' },
  { symbol: 'SYNCOMF', name: 'SYNCOM FORMU (I) LTD' },
  { symbol: 'SONUINFRA', name: 'SONU INFRATECH LTD' },
  { symbol: 'EXHICON', name: 'EXHICON EVENTS MEDIA SOLUTIONS' },
  { symbol: 'GOKULAGRO', name: 'GOKUL AGRO RESOURCES LTD' },
  { symbol: 'POEL', name: 'POCL ENTERPRISES LTD' },
  { symbol: 'DPABHUSHAN', name: 'D. P. ABHUSHAN LTD' },
  { symbol: 'EPIGRAL', name: 'EPIGRAL LIMITED' },
  { symbol: 'ZODIAC', name: 'ZODIAC ENERGY LTD' },
  { symbol: 'EMKAYTOOLS', name: 'EMKAY TAP & CUT. TOOL LTD' },
  { symbol: 'MARCO', name: 'MARCO CABLE & CONDUCTOR L' },
  { symbol: 'SAHAJSOLAR', name: 'SAHAJ SOLAR LTD' },
  { symbol: 'KPIGREEN', name: 'KPI GREEN ENERGY LTD' },
  { symbol: 'SIDDHIKA', name: 'SIDDHIKA COATINGS LTD' },
  { symbol: 'KKCL', name: 'KEWAL KIRAN CLOTHING LTD' },
  { symbol: 'TANFACIND', name: 'TANFAC INDUSTRIES LTD.' },
  { symbol: 'KPL', name: 'KWALITY PHARMACEUTICALS LIMITE' },
  { symbol: 'RESGEN', name: 'RESGEN LIMITED' },
  { symbol: 'CNCRD', name: 'CONCORD CONTROL SYSTEMS LIMITE' },
  { symbol: 'CEINSYSTECH', name: 'CEINSYS TECH LIMITED' },
  { symbol: 'BLS', name: 'BLS INTL SERVS LTD' },
  { symbol: 'CONTPTR', name: 'CONTINENTAL PETROLEUMS LTD.' },
  { symbol: 'SHILCTECH', name: 'SHILCHAR TECHNOLOGIES LTD.' },
  { symbol: 'ALSL', name: 'ALACRITY SECURITIES LTD' },
  { symbol: 'DYCL', name: 'DYNAMIC CABLES LTD' },
  { symbol: 'MALLCOM', name: 'MALLCOM (INDIA) LTD' },
  { symbol: 'SUPRIYA', name: 'SUPRIYA LIFESCIENCE LTD' },
  { symbol: 'KIRLPNU', name: 'KIRLOSKAR PNEUMATIC COM L' },
  { symbol: 'BEMHY', name: 'BEMCO HYDRAULICS LTD.' },
  { symbol: 'ASALCBR', name: 'ASSO ALCOHOLS & BREW LTD' },
  { symbol: 'DODLA', name: 'DODLA DAIRY LTD' },
  { symbol: 'FIDEL', name: 'FIDEL SOFTECH LTD' },
  { symbol: 'ALLETEC', name: 'ALL E TECHNOLOGIES LTD' },
  { symbol: 'TARACHAND', name: 'TARA CHAND INFRA SOLN LTD' },
  { symbol: 'FROG', name: 'FROG CELLSAT LTD' }
];

// European/Other companies to continue building the list
const europeanCompanies = [
  { symbol: 'SAP', name: 'SAP SE' },
  { symbol: 'SIEGY', name: 'SIEMENS AG' },
  { symbol: 'BAYRY', name: 'BAYER AG' },
  { symbol: 'DASTY', name: 'DASSAULT SYSTEMES SE' },
  { symbol: 'IDEXY', name: 'IDEX CORPORATION' },
  { symbol: 'HESAY', name: 'HESA A SOCIETE ANONYME' },
  { symbol: 'TKOMY', name: 'TOMRA SYSTEMS ASA' },
  { symbol: 'ORKLY', name: 'ORKLA ASA' },
  { symbol: 'EQNR', name: 'EQUINOR ASA' },
  { symbol: 'DNB', name: 'DNB BANK ASA' },
  { symbol: 'MOWI', name: 'MOWI ASA' },
  { symbol: 'YAR', name: 'YARA INTERNATIONAL ASA' },
  { symbol: 'SALM', name: 'SALMAR ASA' },
  { symbol: 'KAHOT', name: 'KAHOOT! ASA' },
  { symbol: 'XXL', name: 'XXL ASA' },
  { symbol: 'AKRBP', name: 'AKER BP ASA' },
  { symbol: 'BAKKA', name: 'BAKKAVOR GROUP PLC' },
  { symbol: 'SAGA', name: 'SAGA PLC' },
  { symbol: 'WIZZ', name: 'WIZZ AIR HOLDINGS PLC' },
  { symbol: 'SBRY', name: 'J SAINSBURY PLC' },
  { symbol: 'TSCO', name: 'TESCO PLC' },
  { symbol: 'ULVR', name: 'UNILEVER PLC' },
  { symbol: 'GSK', name: 'GSK PLC' },
  { symbol: 'AZN', name: 'ASTRAZENECA PLC' },
  { symbol: 'BP', name: 'BP PLC' },
  { symbol: 'SHEL', name: 'SHELL PLC' },
  { symbol: 'RIO', name: 'RIO TINTO PLC' },
  { symbol: 'BHP', name: 'BHP GROUP LIMITED' },
  { symbol: 'VOD', name: 'VODAFONE GROUP PLC' },
  { symbol: 'BT', name: 'BT GROUP PLC' }
];

export async function processIndianBatch(): Promise<{ added: number, failed: number }> {
  let added = 0;
  let failed = 0;

  for (const company of indianCompanies) {
    try {
      const existing = await storage.getStock(company.symbol);
      if (!existing) {
        await storage.createStock({
          symbol: company.symbol,
          name: company.name,
          exchange: 'BSE',
          sector: 'Industrials',
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
          exchange: 'LSE',
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