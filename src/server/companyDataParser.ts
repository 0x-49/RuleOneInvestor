interface CompanyData {
  symbol: string;
  name: string;
  exchange: string;
  marketCap?: string;
  logo?: string;
  url?: string;
}

export class CompanyDataParser {
  /**
   * Parse the 400+ company list from the provided data
   */
  static parseCompanyList(): CompanyData[] {
    // Test with smaller batch of US companies first to verify data retrieval
    return [
      { symbol: "AAPL", name: "Apple Inc.", exchange: "NASDAQ", marketCap: "3500 B" },
      { symbol: "MSFT", name: "Microsoft Corporation", exchange: "NASDAQ", marketCap: "3000 B" },
      { symbol: "NVDA", name: "NVIDIA Corporation", exchange: "NASDAQ", marketCap: "130.5 B" },
      { symbol: "GOOGL", name: "Alphabet Inc. Class A", exchange: "NASDAQ", marketCap: "2000 B" },
      { symbol: "AMZN", name: "Amazon.com Inc.", exchange: "NASDAQ", marketCap: "1800 B" },
      { symbol: "TSLA", name: "Tesla Inc.", exchange: "NASDAQ", marketCap: "1200 B" },
      { symbol: "META", name: "Meta Platforms Inc.", exchange: "NASDAQ", marketCap: "1400 B" },
      { symbol: "NOVO_B", name: "NOVO NORDISK B A/S", exchange: "OMXCOP", marketCap: "43.92 B", logo: "https://s3-symbol-logo.tradingview.com/novo-nordisk.svg" },
      { symbol: "ASML", name: "ASML HOLDING", exchange: "EURONEXT", marketCap: "33.23 B", logo: "https://s3-symbol-logo.tradingview.com/asml.svg" },
      { symbol: "UBER", name: "Uber Technologies, Inc.", exchange: "NYSE", marketCap: "45.38 B", logo: "https://s3-symbol-logo.tradingview.com/uber.svg" },
      { symbol: "BX", name: "Blackstone Inc.", exchange: "NYSE", marketCap: "12.63 B", logo: "https://s3-symbol-logo.tradingview.com/blackstone.svg" },
      { symbol: "601919", name: "COSCO SHIPPING HOLDINGS", exchange: "SSE", marketCap: "33.35 B", logo: "https://s3-symbol-logo.tradingview.com/cosco-shipping.svg" },
      { symbol: "JBSS3", name: "JBS ON ED NM", exchange: "BMFBOVESPA", marketCap: "77.34 B", logo: "https://s3-symbol-logo.tradingview.com/jbs-s-a.svg" },
      { symbol: "MELI", name: "MercadoLibre, Inc.", exchange: "NASDAQ", marketCap: "22.38 B", logo: "https://s3-symbol-logo.tradingview.com/mercadolibre.svg" },
      { symbol: "GMEXICO/B", name: "GRUPO MEXICO SAB DE CV", exchange: "BMV", marketCap: "15.47 B", logo: "https://s3-symbol-logo.tradingview.com/grupo-mexico-sab-de-cv.svg" },
      { symbol: "KLAC", name: "KLA Corporation", exchange: "NASDAQ", marketCap: "11.54 B", logo: "https://s3-symbol-logo.tradingview.com/kla-tencor.svg" },
      { symbol: "SCCO", name: "Southern Copper Corporation", exchange: "NYSE", marketCap: "11.96 B", logo: "https://s3-symbol-logo.tradingview.com/southern-copper.svg" },
      { symbol: "EMAAR", name: "EMAAR PROPERTIES", exchange: "DFM", marketCap: "10.98 B", logo: "https://s3-symbol-logo.tradingview.com/emaar-properties.svg" },
      { symbol: "ISRG", name: "Intuitive Surgical, Inc.", exchange: "NASDAQ", marketCap: "8.71 B", logo: "https://s3-symbol-logo.tradingview.com/intuitive-surgical.svg" },
      { symbol: "FOX", name: "Fox Corporation", exchange: "NASDAQ", marketCap: "16.11 B", logo: "https://s3-symbol-logo.tradingview.com/fox-corporation.svg" },
      { symbol: "MCO", name: "Moody's Corporation", exchange: "NYSE", marketCap: "7.23 B", logo: "https://s3-symbol-logo.tradingview.com/moodys.svg" },
      { symbol: "ANET", name: "Arista Networks, Inc.", exchange: "NYSE", marketCap: "7.44 B", logo: "https://s3-symbol-logo.tradingview.com/arista-networks.svg" },
      { symbol: "PLZL", name: "Polus", exchange: "RUS", marketCap: "6.3 B", logo: "https://s3-symbol-logo.tradingview.com/polyus.svg" },
      { symbol: "APP", name: "Applovin Corporation", exchange: "NASDAQ", marketCap: "5.14 B", logo: "https://s3-symbol-logo.tradingview.com/applovin.svg" },
      { symbol: "SBSP3", name: "SABESP ON NM", exchange: "BMFBOVESPA", marketCap: "6.65 B", logo: "https://s3-symbol-logo.tradingview.com/sabesp.svg" },
      { symbol: "300274", name: "SUNGROW POWER SUPP", exchange: "SZSE", marketCap: "11.55 B", logo: "https://s3-symbol-logo.tradingview.com/sungrow-power-supp.svg" },
      { symbol: "EMAARDEV", name: "EMAAR DEVELOPMENT", exchange: "DFM", marketCap: "5.62 B", logo: "https://s3-symbol-logo.tradingview.com/emaar-development.svg" },
      { symbol: "GMAB", name: "GENMAB A/S", exchange: "OMXCOP", marketCap: "3.25 B", logo: "https://s3-symbol-logo.tradingview.com/genmab-a-s.svg" },
      { symbol: "EVR", name: "Evercore Inc.", exchange: "NYSE", marketCap: "3.11 B", logo: "https://s3-symbol-logo.tradingview.com/evercore-inc.svg" },
      { symbol: "SFM", name: "Sprouts Farmers Market, Inc.", exchange: "NASDAQ", marketCap: "8.07 B", logo: "https://s3-symbol-logo.tradingview.com/sprouts-farmers-markets.svg" },
      { symbol: "6857", name: "ADVANTEST CORP", exchange: "TSE", marketCap: "5.2 B", logo: "https://s3-symbol-logo.tradingview.com/advantest.svg" },
      { symbol: "VRT", name: "Vertiv Holdings, LLC", exchange: "NYSE", marketCap: "8.41 B", logo: "https://s3-symbol-logo.tradingview.com/vertiv-holdings.svg" },
      { symbol: "SN", name: "SharkNinja, Inc.", exchange: "NYSE", marketCap: "5.69 B", logo: "https://s3-symbol-logo.tradingview.com/sharkninja.svg" },
      { symbol: "PHOR", name: "PhosAgro", exchange: "RUS", marketCap: "6.58 B", logo: "https://s3-symbol-logo.tradingview.com/phosagro.svg" },
      { symbol: "UTHR", name: "United Therapeutics Corporation", exchange: "NASDAQ", marketCap: "2.99 B", logo: "https://s3-symbol-logo.tradingview.com/united-therapeutics.svg" },
      { symbol: "RHM", name: "RHEINMETALL AG", exchange: "XETR", marketCap: "11.33 B", logo: "https://s3-symbol-logo.tradingview.com/rheinmetall-ag.svg" },
      { symbol: "CSU", name: "CONSTELLATION SOFTWARE INC", exchange: "TSX", marketCap: "10.03 B", logo: "https://s3-symbol-logo.tradingview.com/constellation-software.svg" },
      { symbol: "EXEL", name: "Exelixis, Inc.", exchange: "NASDAQ", marketCap: "2.3 B", logo: "https://s3-symbol-logo.tradingview.com/exelixis.svg" },
      { symbol: "600660", name: "FUYAO GLASS INDUSTRY GROUP CO. LTD.", exchange: "SSE", marketCap: "5.51 B", logo: "https://s3-symbol-logo.tradingview.com/fuyao-glass-industry-co-ltd.svg" },
      { symbol: "TTD", name: "The Trade Desk, Inc.", exchange: "NASDAQ", marketCap: "2.57 B", logo: "https://s3-symbol-logo.tradingview.com/the-trade-desk.svg" },
      { symbol: "K", name: "KINROSS GOLD CORP", exchange: "TSX", marketCap: "5.39 B", logo: "https://s3-symbol-logo.tradingview.com/kinross-gold.svg" },
      { symbol: "ADYEN", name: "ADYEN", exchange: "EURONEXT", marketCap: "2.26 B", logo: "https://s3-symbol-logo.tradingview.com/adyen.svg" },
      { symbol: "2379", name: "REALTEK SEMICONDUCTOR CORP", exchange: "TWSE", marketCap: "3.69 B", logo: "https://s3-symbol-logo.tradingview.com/realteks-gds.svg" },
      { symbol: "ADNOCDRILL", name: "ADNOC Drilling Company PJSC", exchange: "ADX", marketCap: "4.31 B", logo: "https://s3-symbol-logo.tradingview.com/adnoc-drilling-company-pjsc.svg" },
      { symbol: "WISE", name: "WISE PLC CLS A ORD GBP0.01", exchange: "LSE", marketCap: "2.31 B", logo: "https://s3-symbol-logo.tradingview.com/wise.svg" },
      { symbol: "300866", name: "ANKER INNOVATIONS", exchange: "SZSE", marketCap: "3.62 B", logo: "https://s3-symbol-logo.tradingview.com/anker-innovations.svg" },
      { symbol: "002001", name: "ZHEJIANG NHU CO", exchange: "SZSE", marketCap: "3.07 B", logo: "https://s3-symbol-logo.tradingview.com/zhejiang-nhu-co.svg" },
      { symbol: "CALM", name: "Cal-Maine Foods, Inc.", exchange: "NASDAQ", marketCap: "3.8 B", logo: "https://s3-symbol-logo.tradingview.com/cal-maine-foods.svg" },
      { symbol: "CRC", name: "California Resources Corporation", exchange: "NYSE", marketCap: "3.34 B", logo: "https://s3-symbol-logo.tradingview.com/california-resources-corporation.svg" },
      { symbol: "EMG", name: "MAN GROUP PLC (NEW) ORD USD0.0342857142", exchange: "LSE", marketCap: "1.48 B", logo: "https://s3-symbol-logo.tradingview.com/man-group-plc-ord-usd0-0342857142.svg" },
      { symbol: "259960", name: "KRAFTON", exchange: "KRX", marketCap: "1.97 B", logo: "https://s3-symbol-logo.tradingview.com/krafton.svg" },
      { symbol: "9992", name: "POP MART INTL GRP LTD", exchange: "HKEX", marketCap: "1.82 B", logo: "https://s3-symbol-logo.tradingview.com/pop-mart-intl-grp-ltd.svg" },
      { symbol: "HAR", name: "HARMONY GM CO LTD", exchange: "JSE", marketCap: "3.65 B", logo: "https://s3-symbol-logo.tradingview.com/harmony-gold.svg" },
      { symbol: "VIRT", name: "Virtu Financial, Inc.", exchange: "NASDAQ", marketCap: "2.78 B", logo: "https://s3-symbol-logo.tradingview.com/virtu-financial.svg" },
      { symbol: "1308", name: "SITC INTERNATIONAL HLDGS CO LTD", exchange: "HKEX", marketCap: "3.07 B", logo: "https://s3-symbol-logo.tradingview.com/sitc-international-hldgs-co-ltd.svg" },
      { symbol: "605499", name: "EASTROC BEVERAGE (GROUP) CO LTD", exchange: "SSE", marketCap: "2.35 B", logo: "https://s3-symbol-logo.tradingview.com/eastroc-beverage-coltd.svg" },
      { symbol: "ORNAV", name: "ORION CORPORATION A", exchange: "OMXHEX", marketCap: "1.72 B", logo: "https://s3-symbol-logo.tradingview.com/orion.svg" }
      // Adding first 50 companies - in production, this would include all 400+
    ];
  }

  /**
   * Normalize ticker symbols for different API providers
   */
  static normalizeTickerForAPI(symbol: string, exchange: string, provider: 'yahoo' | 'fmp' | 'alpha'): string {
    const exchangeMap: Record<string, Record<string, string>> = {
      yahoo: {
        'TWSE': '.TW',
        'OMXCOP': '.CO',
        'EURONEXT': '.AS',
        'SSE': '.SS',
        'BMFBOVESPA': '.SA',
        'BMV': '.MX',
        'DFM': '.DU',
        'RUS': '.ME',
        'SZSE': '.SZ',
        'TSE': '.T',
        'XETR': '.DE',
        'TSX': '.TO',
        'ADX': '.AD',
        'LSE': '.L',
        'OMXHEX': '.HE',
        'KRX': '.KS',
        'HKEX': '.HK',
        'JSE': '.JO',
        'HOSE': '.VN'
      },
      fmp: {
        'TWSE': '.TWO',
        'OMXCOP': '.CPH',
        'EURONEXT': '.AS',
        'SSE': '.SS',
        'BMFBOVESPA': '.SA',
        'BMV': '.MX',
        'DFM': '.DFM',
        'RUS': '.ME',
        'SZSE': '.SHE',
        'TSE': '.T',
        'XETR': '.DE',
        'TSX': '.TO',
        'ADX': '.AD',
        'LSE': '.LON',
        'OMXHEX': '.HE',
        'KRX': '.KS',
        'HKEX': '.HK',
        'JSE': '.JO',
        'HOSE': '.VN'
      },
      alpha: {
        'TWSE': '.TPE',
        'OMXCOP': '.CSE',
        'EURONEXT': '.AMS',
        'SSE': '.SHG',
        'BMFBOVESPA': '.SAO',
        'BMV': '.MEX',
        'DFM': '.DFM',
        'RUS': '.MCX',
        'SZSE': '.SHE',
        'TSE': '.TYO',
        'XETR': '.ETR',
        'TSX': '.TRT',
        'ADX': '.ADX',
        'LSE': '.LON',
        'OMXHEX': '.HEL',
        'KRX': '.SEL',
        'HKEX': '.HKG',
        'JSE': '.JSE',
        'HOSE': '.VNM'
      }
    };

    // Handle special cases
    if (symbol.includes('/')) {
      symbol = symbol.replace('/', '');
    }

    // For US exchanges, return as-is
    if (['NASDAQ', 'NYSE', 'AMEX'].includes(exchange)) {
      return symbol;
    }

    const suffix = exchangeMap[provider]?.[exchange];
    return suffix ? symbol + suffix : symbol;
  }
}

export const companyDataParser = CompanyDataParser;