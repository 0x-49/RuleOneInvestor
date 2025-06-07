// server/populateStockData.ts
import 'dotenv/config';
import { db } from './db'; // Adjusted path: assuming db.ts is in the same server/ directory
import * as schema from '../shared/schema'; // Adjusted path: schema.ts is in shared/, one level up from server/
import { eq, and } from 'drizzle-orm';
import axios from 'axios';

// Helper function to process and store data for a single stock
// This function encapsulates the logic for fetching and saving data for ONE stock symbol.
export const processAndStoreStockData = async (symbol: string): Promise<boolean> => {
  console.log(`\nProcessing symbol (within helper): ${symbol}...`);

  const existingStockArr = await db.select().from(schema.stocks).where(eq(schema.stocks.symbol, symbol)).limit(1);
  const existingStock = existingStockArr.length > 0 ? existingStockArr[0] : null;

  let overviewData: any = null;
  let shouldFetchOverview = true;
  const overviewFreshnessThreshold = 24 * 60 * 60 * 1000; // 24 hours

  if (existingStock && existingStock.lastUpdated) {
    if ((new Date().getTime() - new Date(existingStock.lastUpdated).getTime()) < overviewFreshnessThreshold) {
      shouldFetchOverview = false;
      console.log(`  Overview data for ${symbol} is recent. Using existing data and skipping OVERVIEW API call.`);
      overviewData = {
        Symbol: existingStock.symbol,
        Name: existingStock.name,
        Exchange: existingStock.exchange,
        Sector: existingStock.sector,
        MarketCapitalization: existingStock.marketCap?.toString(), // API provides string
      };
    }
  }

  if (shouldFetchOverview) {
    console.log(`  Fetching OVERVIEW for ${symbol}`);
    overviewData = await callAlphaVantageApi({ function: 'OVERVIEW', symbol });
    if (!overviewData || !overviewData.Symbol) {
      console.error(`  Failed to fetch overview for ${symbol}.`);
      if (!existingStock) { // If it's a new stock and overview fails, we can't proceed reliably.
        console.error(`  Cannot proceed for new stock ${symbol} without overview data.`);
        return false; // Critical failure for a new stock
      }
      // If it's an existing stock and overview fetch fails, we can still use existing overview data
      console.warn(`  Using stale overview data for ${symbol} due to fetch failure.`);
      overviewData = {
        Symbol: existingStock.symbol,
        Name: existingStock.name,
        Exchange: existingStock.exchange,
        Sector: existingStock.sector,
        MarketCapitalization: existingStock.marketCap?.toString(),
      };
    }
  }

  if (!overviewData || !overviewData.Symbol) { // Final check if we have any overview data
      console.error(`  Critical error: No overview data available for ${symbol}. Skipping.`);
      return false;
  }

  const quoteData = await callAlphaVantageApi({ function: 'GLOBAL_QUOTE', symbol });
  const globalQuote = quoteData ? quoteData['Global Quote'] : null;
  if (!globalQuote || !globalQuote['01. symbol']) {
      console.warn(`Failed to fetch global quote for ${symbol}. Some stock fields might be null.`);
  }

  let stockId: number; // Needs to be defined here to be accessible for financialMetricsPayload
  try {
    const stockPayload: typeof schema.stocks.$inferInsert = {
      symbol: overviewData.Symbol,
      name: overviewData.Name,
      exchange: overviewData.Exchange,
      sector: overviewData.Sector,
      marketCap: parseFloat(overviewData.MarketCapitalization) || null,
      price: (globalQuote ? parseFloat(globalQuote['05. price']) : 0) || 0,
      change: (globalQuote ? parseFloat(globalQuote['09. change']) : 0) || 0,
      changePercent: (globalQuote ? parseFloat(globalQuote['10. change percent']?.replace('%', '')) : 0) || 0,
      volume: globalQuote ? parseInt(globalQuote['06. volume'], 10) : null,
      lastUpdated: new Date(),
    };

    if (existingStock) {
      console.log(`Updating existing stock ${symbol}`);
      const updateResult: { id: number }[] = await db.update(schema.stocks)
        .set(stockPayload)
        .where(eq(schema.stocks.id, existingStock.id))
        .returning({ id: schema.stocks.id });
      if (updateResult.length > 0) {
        stockId = updateResult[0].id;
      } else {
        console.error(`Failed to update stock ${symbol} or retrieve its ID after update.`);
        return false;
      }
    } else {
      console.log(`Inserting new stock ${symbol}`);
      const insertResult: { id: number }[] = await db.insert(schema.stocks)
        .values(stockPayload)
        .returning({ id: schema.stocks.id });
      if (insertResult.length > 0) {
        stockId = insertResult[0].id;
      } else {
        console.error(`Failed to insert stock ${symbol} or retrieve its ID after insert.`);
        return false;
      }
    }
  } catch (error) {
    console.error(`Error processing stock table for ${symbol}:`, error);
    return false;
  }

  // Ensure stockId is assigned before proceeding to financial metrics
  if (typeof stockId === 'undefined') {
       console.error(`Stock ID was not assigned for ${symbol}. Cannot process financial metrics.`);
       return false; // Critical if stockId is needed for financials
  }

  const incomeStatementData = await callAlphaVantageApi({ function: 'INCOME_STATEMENT', symbol });
  const balanceSheetData = await callAlphaVantageApi({ function: 'BALANCE_SHEET', symbol });
  const cashFlowData = await callAlphaVantageApi({ function: 'CASH_FLOW', symbol });
  const earningsData = await callAlphaVantageApi({ function: 'EARNINGS', symbol });

  if (!incomeStatementData?.annualReports || !balanceSheetData?.annualReports || 
      !cashFlowData?.annualReports || !earningsData?.annualEarnings) {
    console.warn(`Missing some annual financial data for ${symbol}. Skipping financial metrics update. Stock entry was created/updated.`);
    return true; // Stock itself was processed, but financials are missing. Consider this a partial success.
  }

  const yearsAvailable = new Set<string>();
  incomeStatementData.annualReports.forEach((r: any) => yearsAvailable.add(r.fiscalDateEnding.substring(0,4)));
  
  const processableYears: string[] = [];
  for (const year of Array.from(yearsAvailable).sort().reverse()) { 
      const incomeReport = incomeStatementData.annualReports.find((r:any) => r.fiscalDateEnding.startsWith(year));
      const balanceReport = balanceSheetData.annualReports.find((r:any) => r.fiscalDateEnding.startsWith(year));
      const cashFlowReport = cashFlowData.annualReports.find((r:any) => r.fiscalDateEnding.startsWith(year));
      const earningsReport = earningsData.annualEarnings.find((r:any) => r.fiscalDateEnding.startsWith(year));
      if (incomeReport && balanceReport && cashFlowReport && earningsReport) {
          processableYears.push(year);
      }
  }

  console.log(`Found ${processableYears.length} years of aligned annual financial data for ${symbol}.`);

  for (const year of processableYears) {
    const incomeReport = incomeStatementData.annualReports.find((r:any) => r.fiscalDateEnding.startsWith(year));
    const balanceReport = balanceSheetData.annualReports.find((r:any) => r.fiscalDateEnding.startsWith(year));
    const cashFlowReport = cashFlowData.annualReports.find((r:any) => r.fiscalDateEnding.startsWith(year));
    const earningsReport = earningsData.annualEarnings.find((r:any) => r.fiscalDateEnding.startsWith(year));

    if (!incomeReport || !balanceReport || !cashFlowReport || !earningsReport) {
        console.warn(`  Skipping year ${year} for ${symbol} due to missing report data for that specific year.`);
        continue; // Skip this year, but continue processing other years for the stock
    }

    console.log(`Processing metrics for ${symbol}, year: ${year}`);

    const revenue = parseFloat(incomeReport.totalRevenue) || null;
    const netEarnings = parseFloat(incomeReport.netIncome) || null;
    const reportedEPS = parseFloat(earningsReport.reportedEPS) || null;
    const bookValue = parseFloat(balanceReport.totalShareholderEquity) || null;
    
    const operatingCashFlow = parseFloat(cashFlowReport.operatingCashflow) || 0;
    const capitalExpendituresStr = cashFlowReport.capitalExpenditures;
    const capitalExpenditures = (capitalExpendituresStr && capitalExpendituresStr !== 'None') ? parseFloat(capitalExpendituresStr) : 0;
    const freeCashFlow = (operatingCashFlow !== null && capitalExpenditures !== null) ? operatingCashFlow - capitalExpenditures : null;

    const longTermDebtStr = balanceReport.longTermDebt;
    const longTermDebt = (longTermDebtStr && longTermDebtStr !== 'None') ? parseFloat(longTermDebtStr) : null;
    
    const totalLiabilitiesStr = balanceReport.totalLiabilities;
    const totalLiabilities = (totalLiabilitiesStr && totalLiabilitiesStr !== 'None') ? parseFloat(totalLiabilitiesStr) : null;
    
    const shortTermDebtStr = balanceReport.shortTermDebt;
    const shortTermDebt = (shortTermDebtStr && shortTermDebtStr !== 'None') ? parseFloat(shortTermDebtStr) : 0;
    
    const calculatedTotalDebt = (shortTermDebt !== null && longTermDebt !== null) ? shortTermDebt + longTermDebt :
                                (longTermDebt !== null ? longTermDebt : (shortTermDebt !== null ? shortTermDebt : null));

    console.log(`  Debt figures for ${year}:`);
    console.log(`    Long Term Debt (stored): ${longTermDebt}`);
    console.log(`    Total Liabilities (logged): ${totalLiabilities}`);
    console.log(`    Short Term + Long Term Debt (logged): ${calculatedTotalDebt}`);

    const financialMetricsPayload: typeof schema.financialMetrics.$inferInsert = {
      stockId: stockId!,
      year: year,
      revenue: revenue,
      earnings: netEarnings,
      eps: reportedEPS,
      bookValue: bookValue,
      freeCashFlow: freeCashFlow,
      debt: longTermDebt, 
      roic: null, 
    };

    try {
      const existingMetric = await db.select().from(schema.financialMetrics)
        .where(and(eq(schema.financialMetrics.stockId, stockId!), eq(schema.financialMetrics.year, year)))
        .limit(1);

      if (existingMetric.length > 0) {
        const firstMetric: typeof schema.financialMetrics.$inferSelect = existingMetric[0];
        console.log(`  Updating financial metrics for ${symbol}, year ${year}`);
        await db.update(schema.financialMetrics)
          .set(financialMetricsPayload)
          .where(eq(schema.financialMetrics.id, firstMetric.id));
      } else {
        console.log(`  Inserting financial metrics for ${symbol}, year ${year}`);
        await db.insert(schema.financialMetrics).values(financialMetricsPayload);
      }
    } catch (dbError) {
      console.error(`  Error saving financial metrics for ${symbol}, year ${year}:`, dbError);
      // Not returning false here, to allow other years to be processed.
    }
  }
  return true; // Successfully processed this stock
};

const ALPHA_VANTAGE_API_KEY = process.env.ALPHA_VANTAGE_PREMIUM_API_KEY;
const ALPHA_VANTAGE_BASE_URL = 'https://www.alphavantage.co/query';

const DEFAULT_STOCKS_TO_FETCH = [
  'NVDA', 'MSFT', 'AAPL', 'AMZN', 'GOOG', 'GOOGL', 'META', 'AVGO', 'BRK.A', 'BRK.B', 
  'TSLA', 'WMT', 'JPM', 'LLY', 'V', 'MA', 'NFLX', 'ORCL', 'COST', 'XOM', 
  'PG', 'HD', 'JNJ', 'BAC', 'ABBV', 'KO', 'PLTR', 'PM', 'TMUS', 'UNH', 
  'GE', 'CRM', 'CSCO', 'IBM', 'WFC', 'CVX', 'ABT', 'MRK', 'PFE', 'CMCSA', 
  'PEP', 'MCD', 'DIS', 'ADBE', 'AMD', 'GS', 'T', 'INTU', 'QCOM', 'TXN', 
  'C', 'NEE', 'LOW', 'SBUX', 'SPG', 'UNP', 'COP', 'DE', 'ADP', 'FI', 
  'PANW', 'BA', 'CVS', 'NOW', 'BKNG', 'MDLZ', 'TJX', 'AMGN', 'ISRG', 'ZTS', 
  'PYPL', 'PNC', 'ADSK', 'PXD', 'EOG', 'APD', 'HLT', 'CPRT', 'NEM', 'CSX', 
  'HOOD', 'CHTR', 'RBLX', 'AFL', 'NET', 'TEAM', 'AEP', 'FCX', 'NSC', 'ALL', 
  'SQ', 'MRVL', 'VST', 'FDX', 'MET', 'PSA', 'GWW', 'TFC', 'TRP', 'MPLX', 
  'DFS', 'OKE', 'LNG', 'WCN', 'ROST', 'SRE', 'O', 'NXPI', 'PCAR', 'BDX', 
  'PWR', 'MPC', 'AMP', 'EXC', 'DLR', 'MO', 'SO', 'ITW', 'BAH', 'RTX', 
  'CAT', 'LRCX', 'PLD', 'MSI', 'WMB',
  // London Stock Exchange (LON)
  'AZN.LON', 'HSBA.LON', 'SHEL.LON', 'ULVR.LON', 'BP.LON', 'RIO.LON', 'REL.LON', 'GSK.LON', 'LSEG.LON', 'BA.LON', 'NG.LON', 'BARC.LON', 'LLOY.LON', 'DGE.LON', 'CPG.LON', 'NWG.LON', 'III.LON', 'HLN.LON', 'RKT.LON', 'EXPN.LON', 'GLEN.LON', 'STAN.LON', 'TSCO.LON', 'ANTO.LON',
  // Toronto Stock Exchange (TRT)
  'RY.TRT', 'TD.TRT', 'ENB.TRT', 'CNR.TRT', 'BNS.TRT', 'CP.TRT', 'BCE.TRT', 'ABX.TRT', 'NTR.TRT', 'SHOP.TRT', 'SU.TRT', 'TRP.TRT', 'FTS.TRT', 'MG.TRT', 'CM.TRT', 'MFC.TRT', 'BAM.TRT', 'WCN.TRT', 'RCI.B.TRT', 'GWO.TRT', 'CVE.TRT', 'IMO.TRT', 'CSU.TRT', 'AEM.TRT', 'EQB.TRT',
  // Germany - XETRA: DEX
  'SAP.DEX', 'SIE.DEX', 'DTE.DEX', 'ALV.DEX', 'MBG.DEX', 'MUV2.DEX', 'IFX.DEX', 'BAS.DEX', 'VOW.DEX', 'BAYN.DEX', 'DHL.DEX', 'DBK.DEX', 'EOAN.DEX', 'MRK.DEX', 'BMW.DEX', 'HEI.DEX', 'RWE.DEX', 'ADS.DEX', 'CBK.DEX', 'HNR1.DEX', 'DB1.DEX', 'SRT.DEX', 'PAH3.DEX', 'QIA.DEX', 'SY1.DEX',
  // Euronext - Paris: PAR
  'MC.PAR', 'OR.PAR', 'RMS.PAR', 'TTE.PAR', 'SAN.PAR', 'SU.PAR', 'AI.PAR', 'BNP.PAR', 'AIR.PAR', 'STLA.PAR', 'CS.PAR', 'CAP.PAR', 'KER.PAR', 'CDI.PAR', 'GLE.PAR', 'ACA.PAR', 'DG.PAR', 'ENGI.PAR', 'RI.PAR', 'ML.PAR', 'CA.PAR', 'ORA.PAR', 'VIE.PAR', 'DSY.PAR', 'HO.PAR',
  // Euronext - Amsterdam: AMS
  'ASML.AMS', 'SHEL.AMS', 'PRX.AMS', 'UNA.AMS', 'INGA.AMS', 'HEIA.AMS', 'ADYEN.AMS', 'WKL.AMS', 'AD.AMS', 'MT.AMS', 'ASM.AMS', 'PHIA.AMS', 'ABN.AMS', 'NN.AMS', 'KPN.AMS', 'ASRNL.AMS', 'AGN.AMS', 'AKZA.AMS', 'URW.AMS', 'IMCD.AMS', 'RAND.AMS', 'VPK.AMS', 'TKWY.AMS', 'AALB.AMS', 'GLPG.AMS',
  // Euronext - Lisbon: LIS
  'EDP.LIS', 'GALP.LIS', 'JMT.LIS', 'BCP.LIS', 'EDPR.LIS', 'NOS.LIS', 'SON.LIS', 'CTT.LIS', 'RENE.LIS', 'SEM.LIS', 'ALTR.LIS', 'NVG.LIS', 'MOTA.LIS', 'GVOLT.LIS', 'PHR.LIS', 'NBA.LIS', 'SNC.LIS', 'TDSA.LIS', 'RAM.LIS', 'IBS.LIS', 'COR.LIS', 'CIM.LIS', 'IPRA.LIS', 'RAMA.LIS', 'VAA.LIS',
  // Euronext - Brussels: BRU
  'ABI.BRU', 'KBC.BRU', 'UCB.BRU', 'AGS.BRU', 'COLR.BRU', 'SOLB.BRU', 'GBLB.BRU', 'UMI.BRU', 'SOF.BRU', 'ACKB.BRU', 'PROX.BRU', 'ELI.BRU', 'DIE.BRU', 'MELE.BRU', 'COFB.BRU', 'WDP.BRU', 'AED.BRU', 'GLPG.BRU', 'CYAD.BRU', 'IBAB.BRU', 'TESB.BRU', 'BEKB.BRU', 'VGP.BRU', 'LOTB.BRU', 'BARC.BRU',
  // China - Shanghai: SHH
  '600519.SHH', '601398.SHH', '601288.SHH', '601628.SHH', '601318.SHH', '600036.SHH', '601857.SHH', '601988.SHH', '603288.SHH', '600276.SHH', '601939.SHH', '600059.SHH', '600104.SHH', '601138.SHH', '601088.SHH', '600858.SHH', '601601.SHH', '600030.SHH', '601818.SHH', '601658.SHH', '600028.SHH', '600016.SHH', '600887.SHH', '601166.SHH', '600938.SHH',
  // China - Shenzhen: SHZ
  '300750.SHZ', '000858.SHZ', '002594.SHZ', '300760.SHZ', '000568.SHZ', '000333.SHZ', '002415.SHZ', '300059.SHZ', '002714.SHZ', '000001.SHZ', '00700.SHZ', '000651.SHZ', '000002.SHZ', '000725.SHZ', '002024.SHZ', '000538.SHZ', '603799.SHZ', '300498.SHZ', '000027.SHZ', '002241.SHZ', '001979.SHZ', '1833.SHZ', '601727.SHZ', '600887.SHZ', '600585.SHZ',
  // India - BSE: BSE
  'RELIANCE.BSE', 'HDFCBANK.BSE', 'TCS.BSE', 'ICICIBANK.BSE', 'BHARTIARTL.BSE', 'SBIN.BSE', 'INFY.BSE', 'LICI.BSE', 'BAJFINANCE.BSE', 'HINDUNILVR.BSE', 'ITC.BSE', 'LT.BSE', 'HCLTECH.BSE', 'KOTAKBANK.BSE', 'SUNPHARMA.BSE', 'MARUTI.BSE', 'M&M.BSE', 'AXISBANK.BSE', 'HAL.BSE', 'ULTRACEMCO.BSE', 'NTPC.BSE', 'ADANIPORTS.BSE', 'BAJAJFINSV.BSE', 'TITAN.BSE', 'ONGC.BSE',
  // Additional Symbols
  'UBER', 'BX', 'MELI', 'KLAC', 'SCCO', 'FOX', 'MCO', 'ANET', 'APP', 'EVR', 'SFM', 'VRT', 'SN', 'UTHR', 'EXEL', 'TTD', 'K', 'CALM', 'CRC', 'VIRT', 'HALO', 'IESC', 'EAT', 'GRBK', 'ERIE', 'DOCS', 'APPF', 'NVMI', 'CPRX', 'TDW', 'BMI', 'KYN', 'USLM', 'UFPT', 'AGX', 'AIO', 'MSB', 'CLMB', 'INOD', 'BTO', 'MPTI', 'UTGN', 'PGR', 'PLMR', 'HLI', 'PJT', 'HLNE', 'OPHC', 'CTUY', 'MCY', 'LDSN', 'TSSI', 'GAMB', 'HNW', 'ACFN', 'IDR', 'OPXS',
  'WISE.LON', 'EMG.LON', 'MTO.LON', 'SYS1.LON', 'SRB.LON', 'EVT.LON', 'SUP.LON', 'PCT.LON', 'XPS.LON', 'ADM.LON',
  'LUG.TRT', 'OGC.TRT', 'WDO.TRT', 'HWX.TRT', 'MND.TRT', 'TOI.TRT', 'CTZ.TRT', 'HME.TRV', 'ZTE.TRV',
  'RHM.DEX', 'FTK.DEX', 'TIMA.DEX', 'VH2.DEX',
  'GTT.PAR',
  'INPST.AMS', 'FLOW.AMS',
  'INDIAMART.BSE', 'INA.BSE', 'CELLECOR.BSE', 'VINSYS.BSE', 'CFF.BSE', 'SEALMATIC.BSE', 'BRIGHT.BSE', 'ARYACAPM.BSE', 'SYSTANGO.BSE', 'KEL.BSE', 'URBAN.BSE', 'TECHKGREEN.BSE', 'SHINEFASH.BSE', 'SIGNORIA.BSE',
  '601919.SHH', '600660.SHH', '2001.SHH', '605499.SHH', '600988.SHH', '689009.SHH', '605117.SHH', '603129.SHH', '688578.SHH', '426.SHH', '600301.SHH', '688188.SHH', '2155.SHH', '605183.SHH', '603929.SHH', '688019.SHH', '688093.SHH', '688300.SHH',
  '300274.SHZ', '300866.SHZ', '300033.SHZ', '300628.SHZ', '300724.SHZ', '300251.SHZ', '300394.SHZ', '300573.SHZ', '300570.SHZ', '300515.SHZ'
];

let apiCallCount = 0;
let lastApiCallTime = Date.now();

const callAlphaVantageApi = async (params: Record<string, string>) => {
  const now = Date.now();
  const delayNeeded = 800; 

  if (apiCallCount > 0 && (now - lastApiCallTime < delayNeeded)) {
    const waitTime = delayNeeded - (now - lastApiCallTime);
    if (waitTime > 0) {
      console.log(`Rate limiting: waiting ${waitTime}ms...`);
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
  }

  try {
    console.log(`Fetching data with params: ${JSON.stringify(params)}`);
    const response = await axios.get(ALPHA_VANTAGE_BASE_URL, {
      params: {
        ...params,
        apikey: ALPHA_VANTAGE_API_KEY,
      },
    });
    lastApiCallTime = Date.now();
    apiCallCount++;

    if (response.data['Error Message']) {
      console.error(`API Error for ${params.symbol || params.keywords || ''}: ${response.data['Error Message']}`);
      return null;
    }
    if (response.data['Note']) {
      console.warn(`API Note for ${params.symbol || params.keywords || ''}: ${response.data['Note']}`);
      await new Promise(resolve => setTimeout(resolve, 5000)); 
    }
    return response.data;
  } catch (error) {
    console.error(`HTTP Error fetching data for ${params.symbol || params.keywords || ''}:`, error);
    return null;
  }
};

const populateStockData = async () => {
  if (!ALPHA_VANTAGE_API_KEY) {
    console.error('ALPHA_VANTAGE_PREMIUM_API_KEY is not set in .env file.');
    return;
  }
  console.log('Starting stock data population script...');

  const commandLineSymbols = process.argv.slice(2);
  const stocksToProcess = commandLineSymbols.length > 0 ? commandLineSymbols : DEFAULT_STOCKS_TO_FETCH;

  if (stocksToProcess.length === 0) {
    console.log('No stock symbols to process.');
    return;
  }
  console.log(`Processing symbols: ${stocksToProcess.join(', ')}`);

  for (const s of stocksToProcess) {
      // The main logging for the symbol is now inside processAndStoreStockData
    const success = await processAndStoreStockData(s);
    if (success) {
      console.log(`---> Successfully completed processing for symbol: ${s} (called from main script).`);
    } else {
      console.warn(`---> Failed to fully process symbol: ${s} (called from main script). Review logs above for details.`);
    }
  } // Closing brace for the 'for (const s of stocksToProcess)' loop
  console.log('\nStock data population script finished.');
};

populateStockData().catch(error => {
  console.error('Unhandled error in populateStockData script:', error);
  process.exit(1);
});

// To run this script: npx tsx server/populateStockData.ts
// Ensure your .env file has ALPHA_VANTAGE_PREMIUM_API_KEY
// Ensure your Drizzle DB client is correctly set up in server/db.ts
