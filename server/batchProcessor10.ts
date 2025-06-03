import { storage } from './storage';

// Major Middle Eastern and African companies
const middleEasternAfricanCompanies = [
  // Saudi Arabia
  { symbol: '2222.SR', name: 'Saudi Aramco' },
  { symbol: '1180.SR', name: 'Al Rajhi Bank' },
  { symbol: '1120.SR', name: 'Al Rajhi Banking and Investment Corporation' },
  { symbol: '2030.SR', name: 'Saudi Basic Industries Corporation' },
  { symbol: '2010.SR', name: 'Saudi Electricity Company' },
  { symbol: '1211.SR', name: 'Alinma Bank' },
  { symbol: '4030.SR', name: 'Riyad Bank' },
  { symbol: '1140.SR', name: 'Banque Saudi Fransi' },
  { symbol: '2080.SR', name: 'Saudi Telecom Company' },
  { symbol: '4150.SR', name: 'Samba Financial Group' },
  
  // UAE
  { symbol: 'ADIB.AD', name: 'Abu Dhabi Islamic Bank' },
  { symbol: 'ADCB.AD', name: 'Abu Dhabi Commercial Bank' },
  { symbol: 'FAB.AD', name: 'First Abu Dhabi Bank' },
  { symbol: 'ALDAR.AD', name: 'Aldar Properties PJSC' },
  { symbol: 'EMAAR.DU', name: 'Emaar Properties PJSC' },
  { symbol: 'DIB.DU', name: 'Dubai Islamic Bank PJSC' },
  { symbol: 'ENBD.DU', name: 'Emirates NBD Bank PJSC' },
  { symbol: 'DFM.DU', name: 'Dubai Financial Market PJSC' },
  { symbol: 'DANA.AD', name: 'Dana Gas PJSC' },
  { symbol: 'ETISALAT.AD', name: 'Emirates Telecommunications Group Company PJSC' },
  
  // South Africa
  { symbol: 'NPN.JO', name: 'Naspers Limited' },
  { symbol: 'PRX.JO', name: 'Prosus N.V.' },
  { symbol: 'SBK.JO', name: 'Standard Bank Group Limited' },
  { symbol: 'FSR.JO', name: 'FirstRand Limited' },
  { symbol: 'NED.JO', name: 'Nedbank Group Limited' },
  { symbol: 'AGL.JO', name: 'Anglo American plc' },
  { symbol: 'BHP.JO', name: 'BHP Group Limited' },
  { symbol: 'SOL.JO', name: 'Sasol Limited' },
  { symbol: 'MTN.JO', name: 'MTN Group Limited' },
  { symbol: 'VOD.JO', name: 'Vodacom Group Limited' },
  
  // Israel
  { symbol: 'TEVA.TA', name: 'Teva Pharmaceutical Industries Limited' },
  { symbol: 'CHKP.TA', name: 'Check Point Software Technologies Ltd.' },
  { symbol: 'NICE.TA', name: 'NICE Ltd.' },
  { symbol: 'CYBR.TA', name: 'CyberArk Software Ltd.' },
  { symbol: 'WDAY.TA', name: 'Workday, Inc.' },
  { symbol: 'MNDY.TA', name: 'monday.com Ltd.' },
  { symbol: 'WIX.TA', name: 'Wix.com Ltd.' },
  { symbol: 'FVRR.TA', name: 'Fiverr International Ltd.' },
  { symbol: 'GLOB.TA', name: 'Globes Publisher Itonut (1983) Ltd.' },
  { symbol: 'ELBIT.TA', name: 'Elbit Systems Ltd.' }
];

// Major Nordic companies (Sweden, Norway, Denmark, Finland)
const nordicCompanies = [
  // Sweden
  { symbol: 'VOLV-B.ST', name: 'AB Volvo' },
  { symbol: 'ERICB.ST', name: 'Telefonaktiebolaget LM Ericsson' },
  { symbol: 'SEB-A.ST', name: 'Skandinaviska Enskilda Banken AB' },
  { symbol: 'SWED-A.ST', name: 'Swedbank AB' },
  { symbol: 'HM-B.ST', name: 'H & M Hennes & Mauritz AB' },
  { symbol: 'ATLAS-B.ST', name: 'Atlas Copco AB' },
  { symbol: 'SAND.ST', name: 'Sandvik AB' },
  { symbol: 'SKF-B.ST', name: 'SKF AB' },
  { symbol: 'INVE-B.ST', name: 'Investor AB' },
  { symbol: 'TEL2-B.ST', name: 'Tele2 AB' },
  
  // Norway
  { symbol: 'EQNR.OL', name: 'Equinor ASA' },
  { symbol: 'DNB.OL', name: 'DNB Bank ASA' },
  { symbol: 'MOWI.OL', name: 'Mowi ASA' },
  { symbol: 'YAR.OL', name: 'Yara International ASA' },
  { symbol: 'NHY.OL', name: 'Norsk Hydro ASA' },
  { symbol: 'TEL.OL', name: 'Telenor ASA' },
  { symbol: 'AKER.OL', name: 'Aker ASA' },
  { symbol: 'SALM.OL', name: 'SalMar ASA' },
  { symbol: 'TGS.OL', name: 'TGS ASA' },
  { symbol: 'ORKLA.OL', name: 'Orkla ASA' },
  
  // Denmark
  { symbol: 'NOVO-B.CO', name: 'Novo Nordisk A/S' },
  { symbol: 'DANSKE.CO', name: 'Danske Bank A/S' },
  { symbol: 'ORSTED.CO', name: 'Ørsted A/S' },
  { symbol: 'CARL-B.CO', name: 'Carlsberg A/S' },
  { symbol: 'MAERSK-B.CO', name: 'A.P. Møller - Mærsk A/S' },
  { symbol: 'VESTAS.CO', name: 'Vestas Wind Systems A/S' },
  { symbol: 'NZYM-B.CO', name: 'Novozymes A/S' },
  { symbol: 'TRYG.CO', name: 'Tryg A/S' },
  { symbol: 'COLO-B.CO', name: 'Coloplast A/S' },
  { symbol: 'GN.CO', name: 'GN Store Nord A/S' },
  
  // Finland
  { symbol: 'NOKIA.HE', name: 'Nokia Corporation' },
  { symbol: 'FORTUM.HE', name: 'Fortum Oyj' },
  { symbol: 'NESTE.HE', name: 'Neste Oyj' },
  { symbol: 'UPM.HE', name: 'UPM-Kymmene Oyj' },
  { symbol: 'STORA.HE', name: 'Stora Enso Oyj' },
  { symbol: 'SAMPO.HE', name: 'Sampo Oyj' },
  { symbol: 'KESKO.HE', name: 'Kesko Oyj' },
  { symbol: 'KONE.HE', name: 'KONE Oyj' },
  { symbol: 'ELISA.HE', name: 'Elisa Oyj' },
  { symbol: 'METSO.HE', name: 'Metso Outotec Oyj' }
];

// Major Canadian companies (additional)
const additionalCanadianCompanies = [
  { symbol: 'RY.TO', name: 'Royal Bank of Canada' },
  { symbol: 'TD.TO', name: 'The Toronto-Dominion Bank' },
  { symbol: 'BNS.TO', name: 'The Bank of Nova Scotia' },
  { symbol: 'BMO.TO', name: 'Bank of Montreal' },
  { symbol: 'CM.TO', name: 'Canadian Imperial Bank of Commerce' },
  { symbol: 'NA.TO', name: 'National Bank of Canada' },
  { symbol: 'MFC.TO', name: 'Manulife Financial Corporation' },
  { symbol: 'SLF.TO', name: 'Sun Life Financial Inc.' },
  { symbol: 'IAG.TO', name: 'iA Financial Corporation Inc.' },
  { symbol: 'GWO.TO', name: 'Great-West Lifeco Inc.' },
  { symbol: 'CNR.TO', name: 'Canadian National Railway Company' },
  { symbol: 'CP.TO', name: 'Canadian Pacific Railway Limited' },
  { symbol: 'CNQ.TO', name: 'Canadian Natural Resources Limited' },
  { symbol: 'SU.TO', name: 'Suncor Energy Inc.' },
  { symbol: 'IMO.TO', name: 'Imperial Oil Limited' },
  { symbol: 'CVE.TO', name: 'Cenovus Energy Inc.' },
  { symbol: 'HSE.TO', name: 'Husky Energy Inc.' },
  { symbol: 'TRP.TO', name: 'TC Energy Corporation' },
  { symbol: 'ENB.TO', name: 'Enbridge Inc.' },
  { symbol: 'KL.TO', name: 'Kirkland Lake Gold Ltd.' },
  { symbol: 'ABX.TO', name: 'Barrick Gold Corporation' },
  { symbol: 'K.TO', name: 'Kinross Gold Corporation' },
  { symbol: 'AEM.TO', name: 'Agnico Eagle Mines Limited' },
  { symbol: 'TKO.TO', name: 'Taseko Mines Limited' },
  { symbol: 'NTR.TO', name: 'Nutrien Ltd.' },
  { symbol: 'CCO.TO', name: 'Cameco Corporation' },
  { symbol: 'FCX.TO', name: 'First Quantum Minerals Ltd.' },
  { symbol: 'TKO.TO', name: 'Taseko Mines Limited' },
  { symbol: 'OTEX.TO', name: 'Open Text Corporation' },
  { symbol: 'DOL.TO', name: 'Dollarama Inc.' }
];

// Major US small and mid-cap companies
const usMidSmallCapCompanies = [
  { symbol: 'ROKU', name: 'Roku, Inc.' },
  { symbol: 'PTON', name: 'Peloton Interactive, Inc.' },
  { symbol: 'BYND', name: 'Beyond Meat, Inc.' },
  { symbol: 'TDOC', name: 'Teladoc Health, Inc.' },
  { symbol: 'YELP', name: 'Yelp Inc.' },
  { symbol: 'GRUB', name: 'Grubhub Inc.' },
  { symbol: 'DASH', name: 'DoorDash, Inc.' },
  { symbol: 'UBER', name: 'Uber Technologies, Inc.' },
  { symbol: 'LYFT', name: 'Lyft, Inc.' },
  { symbol: 'ABNB', name: 'Airbnb, Inc.' },
  { symbol: 'ZG', name: 'Zillow Group, Inc.' },
  { symbol: 'REDFN', name: 'Redfin Corporation' },
  { symbol: 'OPEN', name: 'Opendoor Technologies Inc.' },
  { symbol: 'RDFN', name: 'Redfin Corporation' },
  { symbol: 'CVNA', name: 'Carvana Co.' },
  { symbol: 'VROOM', name: 'Vroom, Inc.' },
  { symbol: 'KMX', name: 'CarMax, Inc.' },
  { symbol: 'AN', name: 'AutoNation, Inc.' },
  { symbol: 'LAD', name: 'Lithia Motors, Inc.' },
  { symbol: 'PAG', name: 'Penske Automotive Group, Inc.' },
  { symbol: 'GPI', name: 'Group 1 Automotive, Inc.' },
  { symbol: 'SAH', name: 'Sonic Automotive, Inc.' },
  { symbol: 'ABG', name: 'Asbury Automotive Group, Inc.' },
  { symbol: 'RUSHA', name: 'Rush Enterprises, Inc.' },
  { symbol: 'CVCO', name: 'Cavco Industries, Inc.' },
  { symbol: 'CWST', name: 'Casella Waste Systems, Inc.' },
  { symbol: 'WM', name: 'Waste Management, Inc.' },
  { symbol: 'RSG', name: 'Republic Services, Inc.' },
  { symbol: 'WCN', name: 'Waste Connections, Inc.' },
  { symbol: 'CWST', name: 'Casella Waste Systems, Inc.' }
];

export async function processMiddleEasternAfricanBatch(): Promise<{ added: number, failed: number }> {
  let added = 0;
  let failed = 0;

  for (const company of middleEasternAfricanCompanies) {
    try {
      const existing = await storage.getStock(company.symbol);
      if (!existing) {
        let exchange = 'Middle East/Africa';
        if (company.symbol.includes('.SR')) exchange = 'Saudi Arabia';
        else if (company.symbol.includes('.AD') || company.symbol.includes('.DU')) exchange = 'UAE';
        else if (company.symbol.includes('.JO')) exchange = 'South Africa';
        else if (company.symbol.includes('.TA')) exchange = 'Israel';

        await storage.createStock({
          symbol: company.symbol,
          name: company.name,
          exchange,
          sector: 'Energy',
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

export async function processNordicBatch(): Promise<{ added: number, failed: number }> {
  let added = 0;
  let failed = 0;

  for (const company of nordicCompanies) {
    try {
      const existing = await storage.getStock(company.symbol);
      if (!existing) {
        let exchange = 'Nordic';
        if (company.symbol.includes('.ST')) exchange = 'Sweden';
        else if (company.symbol.includes('.OL')) exchange = 'Norway';
        else if (company.symbol.includes('.CO')) exchange = 'Denmark';
        else if (company.symbol.includes('.HE')) exchange = 'Finland';

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

export async function processAdditionalCanadianBatch(): Promise<{ added: number, failed: number }> {
  let added = 0;
  let failed = 0;

  for (const company of additionalCanadianCompanies) {
    try {
      const existing = await storage.getStock(company.symbol);
      if (!existing) {
        await storage.createStock({
          symbol: company.symbol,
          name: company.name,
          exchange: 'TSX',
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

export async function processUSMidSmallCapBatch(): Promise<{ added: number, failed: number }> {
  let added = 0;
  let failed = 0;

  for (const company of usMidSmallCapCompanies) {
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