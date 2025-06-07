import { storage } from "./storage";

interface CompanyRecord {
  symbol: string;
  name: string;
  exchange?: string;
  sector?: string;
  marketCap?: string;
}

export class CompanyListProcessor {
  
  /**
   * Parse company data from the attached file (1,104 companies)
   */
  private getCompanyData(): string {
    const companyData = `NVDA	NVIDIA Corporation
2330	TAIWAN SEMICONDUCTOR MANUFACTURING
NOVO_B	NOVO NORDISK B A/S
ASML	ASML HOLDING
UBER	Uber Technologies, Inc.
BX	Blackstone Inc.
601919	COSCO SHIPPING HOLDINGS
JBSS3	JBS ON ED NM
MELI	MercadoLibre, Inc.
GMEXICO/B	GRUPO MEXICO SAB DE CV
KLAC	KLA Corporation
SCCO	Southern Copper Corporation
EMAAR	EMAAR PROPERTIES
ISRG	Intuitive Surgical, Inc.
FOX	Fox Corporation
MCO	Moody's Corporation
ANET	Arista Networks, Inc.
PLZL	Polus
APP	Applovin Corporation
SBSP3	SABESP ON NM
300274	SUNGROW POWER SUPP
EMAARDEV	EMAAR DEVELOPMENT
GMAB	GENMAB A/S
EVR	Evercore Inc.
SFM	Sprouts Farmers Market, Inc.
6857	ADVANTEST CORP
VRT	Vertiv Holdings, LLC
SN	SharkNinja, Inc.
PHOR	PhosAgro
UTHR	United Therapeutics Corporation
RHM	RHEINMETALL AG
CSU	CONSTELLATION SOFTWARE INC
EXEL	Exelixis, Inc.
600660	FUYAO GLASS INDUSTRY GROUP CO. LTD.
TTD	The Trade Desk, Inc.
K	KINROSS GOLD CORP
ADYEN	ADYEN
2379	REALTEK SEMICONDUCTOR CORP
ADNOCDRILL	ADNOC Drilling Company PJSC
WISE	WISE PLC CLS A ORD GBP0.01
300866	ANKER INNOVATIONS
2001	ZHEJIANG NHU CO
CALM	Cal-Maine Foods, Inc.
CRC	California Resources Corporation
EMG	MAN GROUP PLC (NEW) ORD USD0.0342857142
259960	KRAFTON
9992	POP MART INTL GRP LTD
HAR	HARMONY GM CO LTD
VIRT	Virtu Financial, Inc.
1308	SITC INTERNATIONAL HLDGS CO LTD
605499	EASTROC BEVERAGE (GROUP) CO LTD
ORNAV	ORION CORPORATION A
ELAL	EL AL
NMDC	NMDC Group PJSC
CLS	CELESTICA INC
UI	Ubiquiti Inc.
FPT	FPT CORPORATION
2376	GIGA-BYTE TECHNOLOGY CO
KOG	KONGSBERG GRUPPEN ASA
HALO	Halozyme Therapeutics, Inc.
267260	HD HYUNDAI ELECTRIC
TXRH	Texas Roadhouse, Inc.
EVN	EVOLUTION MINING LIMITED
LUG	LUNDIN GOLD INC
IESC	IES Holdings, Inc.
FPH	FISHER & PAYKEL HEALTHCARE CORP NPV
300724	SHENZHEN S C NEW E
PLUS	DIGIPLUS INTERACTIVE CORP
EAT	Brinker International, Inc.
GRBK	Green Brick Partners, Inc.
INPST	INPOST S.A.
ERIE	Erie Indemnity Company
SQN	SWISSQUOTE N
GQG	GQG PARTNERS INC.
FLOW	FLOW TRADERS
600988	CHIFENG JILONG GOLD MINING CO LTD
MTO	MITIE GROUP ORD GBP0.025
689009	NINEBOT LIMITED
605117	NINGBO DEYE TECHNOLOGY CO LTD
2367	GIANT BIOGENE HLDG CO. LTD
TGSU2	TRANSPORTADORA DE GAS DEL SUR S.A
975	SHANJIN INTERNATIO
603129	ZHEJIANG CFMOTO POWER
ISMEN	IS Y. MEN. DEG.
ANIM	ANIMA HOLDING
ANTM	ANEKA TAMBANG
MCH	MASAN CONSUMER CORPORATION
3230	SAMYANG FOOD
ALK_B	ALK-ABELLO B A/S
REA	REA GROUP LTD
300033	HITHINK ROYALFLUSH
DOCS	Doximity, Inc.
688578	SHANGHAI ALLIST PHARMACEUTICALS CO
APPF	AppFolio, Inc.
300628	YEALINK NETWORK TE
OGC	OCEANAGOLD CORPORATION
YOU	Clear Secure, Inc.
CNVRG	CONVERGE INFORMATION AND COMMUNICATIONS TECHNOLOGY SOLUTIONS, INC
1318	MAO GEPING COSMETICS CO LTD
MAVI	MAVI GIYIM
GTT	GTT (GAZTRANSPORT ET TECHNIGAZ) EUR0.01
ENAEX	ENAEX SA
NVMI	Nova Ltd.
CPRX	Catalyst Pharmaceuticals, Inc.
6532	BAYCURRENT INC
2360	CHROMA ATE INC
426	INNER MONGOLIA XIN
TDW	Tidewater Inc.
278470	APR
STAA	SUMBER TANIAGUNG RESOURCES TBK
688278	XIAMEN AMOYTOP BIOTECH CO LTD
FTK	FLATEXDEGIRO AG
ATH	ATHABASCA OIL CORP
MULT3	MULTIPLAN ON N2
BMI	Badger Meter, Inc.
2669	CHINA OVERSEAS PROPERTY HLDGS LTD
2155	HUNAN GOLD CORPORA
79550	LIG NEX1 CO., LTD.
300251	BEIJING ENLIGHT ME
TOI	TOPICUS COM INC
METR	METROGAS SA
3661	ALCHIP TECHNOLOGIES LIMITD
STBP3	SANTOS BRP ON NM
RMS	RAMELIUS RESOURCES LIMITED
300394	SUZHOU TFC OPTICAL
PCT	POLAR CAPITAL TECHNOLOGY TRUST PLC ORD GBP0.025
600301	GUANGXI HUAXI NONFERROUS METAL CO L
2520	KINDOM DEVELOPMENT CO LTD
DOM	DOMDEV
9636	JF SMARTINVEST HOLDINGS LTD
2059	KING SLIDE WORKS CO
PORT3	WILSON SONS ON ED NM
WAPCO	LAFARGE CEMENT WAPCO PLC
TAPG	TRIPUTRA AGRO PERSADA TBK
KYN	Kayne Anderson Energy Infrastructure Fund, Inc.
8114	POSIFLEX TECHNOLOGIES INC
PODERC1	COMPANIA MINERA PODEROSA SA
PRL	PROPEL HOLDINGS INC
300573	SHENYANG XINGQI PH
4015	JAMJOOM PHARMACEUTICALS FACTORY CO.
4587	PEPTIDREAM INC
SEZL	Sezzle Inc.
WDO	WESDOME GOLD MINES LTD
MINEROS	MINEROS S.A.
688188	SHANGHAI BOCHU ELECTRONIC TECH CORP
ARADEL	ARADEL
HWX	HEADWATER EXPLORATION INC
145020	HUGEL, INC.
CRN	CAIRN HOMES PLC ORD EUR0.001 (CDI)
603893	FUZHOU ROCKCHIP ELECTRONICS CO LTD
36930	JUSUNG ENGINEERING CO.,LTD.
BSLN	BASILEA N
214450	PHARMARESEARCH
NGI	NAVIGATOR GLOBAL INVESTMENTS LIMITED
HLAN	HILAN
AIY	IFAST
RAYA	RAYA HOLDING FOR FINANCIAL INVESTMENTS
257720	SILICON 2 CO.,LTD.
CLEBI	CELEBI
18290	VT
1773	TIANLI INTERNATIONAL HOLDINGS LTD
688019	ANJI MICROELECTRONICS TECHNOLOGY
USLM	United States Lime & Minerals, Inc.
3227	PIXART IMAGING
UFPT	UFP Technologies, Inc.
GBAN	NATURGY BAN SA
SYNE3	SYN PROP TECON NM
TIMA	ZEAL NETWORK SE
TNE	TECHNOLOGY ONE LIMITED
AGX	Argan, Inc.
319660	PSK INC.
214150	CLASSYS INC.
3939	WANGUO GOLD GROUP LTD
5274	ASPEED TECHNOLOGY INC
APX	APEX MINING COMPANY, INC.
LEU	Centrus Energy Corp.
4373	SIMPLEX HLDGS INC
7047	PORT INC
2947	SUZHOU HENGMINGDA
ATI	ASIAN TERMINALS, INC.
6896	GOLDEN THROAT HLDGS GROUP CO LTD
GAMB	Gambling.com Group Limited
EVT	ECONOMIC INVESTMENT TRUST
3030	TEST RESEARCH INC
ALCN	ALEXANDRIA CONTAINERS AND GOODS
VH2	FRIEDRICH VORWERK GRP SE
84370	EUGENE TECHNOLOGY CO., LTD.
605183	QUECHEN SILICON CHEMICAL CO LTD
3529	EMEMORY TECHNOLOGY INC.
1442	ADVANCETEK ENTERPRICE
THX	THOR EXPLORATIONS
AIO	Virtus Artificial Intelligence & Technology Opportunities Fund
GSFI	GAN SHMUEL
HEM	HEMNET GROUP AB
NWL	NETWEALTH GROUP LIMITED
FAPA	FAP AGRI TBK
MND	MANDALAY RESOURCES CORP
2718	ALLMIND HOLDINGS CORPORATION
SIQ	SMARTGROUP CORPORATION LTD
IVSO	INVISIO AB
603929	L AND K ENGINEERING (SUZHOU) CO LTD
`;
        return companyData;
  }

  /**
   * Parse the raw company data into structured records
   */
  parseCompanyData(): CompanyRecord[] {
    const rawData = this.getCompanyData();
    const lines = rawData.trim().split('\n');
    const companies: CompanyRecord[] = [];
    
    for (const line of lines) {
      if (line.trim()) {
        // Split by tabs first, then by multiple spaces if no tabs
        let parts = line.includes('\t') ? line.split('\t') : line.split(/\s{2,}/);
        
        // If still not properly split, try single space after symbol pattern
        if (parts.length < 2) {
          const match = line.match(/^(\S+)\s+(.+)$/);
          if (match) {
            parts = [match[1], match[2]];
          }
        }
        
        if (parts.length >= 2) {
          const symbol = parts[0].trim();
          const name = parts[1].trim();
          
          if (symbol && name) {
            companies.push({
              symbol,
              name,
              exchange: this.determineExchange(symbol),
              sector: 'Technology', // Default sector, can be updated later
            });
          }
        }
      }
    }
    
    return companies;
  }

  /**
   * Determine exchange based on symbol patterns
   */
  private determineExchange(symbol: string): string {
    // Numeric symbols (likely Asian markets)
    if (/^\d+$/.test(symbol)) {
      if (symbol.length === 4) return 'TSE'; // Taiwan Stock Exchange
      if (symbol.length === 6) return 'SSE'; // Shanghai Stock Exchange
      return 'ASIAN';
    }
    
    // Symbols with underscores or specific patterns
    if (symbol.includes('_')) return 'EUROPEAN';
    if (symbol.includes('.')) return 'OTHER';
    if (symbol.length <= 4 && /^[A-Z]+$/.test(symbol)) return 'NASDAQ';
    
    return 'OTHER';
  }

  /**
   * Remove duplicates based on symbol and similar names
   */
  removeDuplicates(companies: CompanyRecord[]): CompanyRecord[] {
    const uniqueCompanies = new Map<string, CompanyRecord>();
    const seenNames = new Set<string>();
    
    for (const company of companies) {
      const normalizedSymbol = company.symbol.toUpperCase();
      const normalizedName = company.name.toLowerCase().replace(/[^a-z0-9]/g, '');
      
      // Check for exact symbol match
      if (uniqueCompanies.has(normalizedSymbol)) {
        console.log(`Duplicate symbol found: ${company.symbol}`);
        continue;
      }
      
      // Check for similar company names
      let isDuplicate = false;
      for (const existingName of seenNames) {
        if (this.areSimilarNames(normalizedName, existingName)) {
          console.log(`Similar company name found: ${company.name}`);
          isDuplicate = true;
          break;
        }
      }
      
      if (!isDuplicate) {
        uniqueCompanies.set(normalizedSymbol, company);
        seenNames.add(normalizedName);
      }
    }
    
    return Array.from(uniqueCompanies.values());
  }

  /**
   * Check if two company names are similar (potential duplicates)
   */
  private areSimilarNames(name1: string, name2: string): boolean {
    // Remove common suffixes and prefixes
    const cleanName1 = name1.replace(/(corp|corporation|inc|limited|ltd|company|co|group|holdings|hldgs)/g, '');
    const cleanName2 = name2.replace(/(corp|corporation|inc|limited|ltd|company|co|group|holdings|hldgs)/g, '');
    
    // Check for exact match after cleaning
    if (cleanName1 === cleanName2) return true;
    
    // Check for substring match (one name contains the other)
    if (cleanName1.length > 5 && cleanName2.length > 5) {
      return cleanName1.includes(cleanName2) || cleanName2.includes(cleanName1);
    }
    
    return false;
  }

  /**
   * Get existing companies from database
   */
  async getExistingCompanies(): Promise<CompanyRecord[]> {
    try {
      const existingStocks = await storage.getAllStocks();
      return existingStocks.map(stock => ({
        symbol: stock.symbol,
        name: stock.name,
        exchange: stock.exchange || 'UNKNOWN',
        sector: stock.sector || 'Unknown'
      }));
    } catch (error) {
      console.error('Error fetching existing companies:', error);
      return [];
    }
  }

  /**
   * Find companies that are not yet in the database
   */
  async findMissingCompanies(): Promise<CompanyRecord[]> {
    const parsedCompanies = this.parseCompanyData();
    const uniqueCompanies = this.removeDuplicates(parsedCompanies);
    const existingCompanies = await this.getExistingCompanies();
    
    const existingSymbols = new Set(existingCompanies.map(c => c.symbol.toUpperCase()));
    
    const missingCompanies = uniqueCompanies.filter(company => 
      !existingSymbols.has(company.symbol.toUpperCase())
    );
    
    console.log(`Total parsed companies: ${parsedCompanies.length}`);
    console.log(`Unique companies after deduplication: ${uniqueCompanies.length}`);
    console.log(`Existing companies in database: ${existingCompanies.length}`);
    console.log(`Missing companies to add: ${missingCompanies.length}`);
    
    return missingCompanies;
  }

  /**
   * Generate a report of duplicate analysis
   */
  generateDuplicateReport(): { duplicateSymbols: string[], similarNames: string[][] } {
    const companies = this.parseCompanyData();
    const duplicateSymbols: string[] = [];
    const similarNames: string[][] = [];
    const symbolCounts = new Map<string, number>();
    
    // Find duplicate symbols
    for (const company of companies) {
      const symbol = company.symbol.toUpperCase();
      symbolCounts.set(symbol, (symbolCounts.get(symbol) || 0) + 1);
    }
    
    for (const [symbol, count] of symbolCounts) {
      if (count > 1) {
        duplicateSymbols.push(symbol);
      }
    }
    
    // Find similar names
    const processedNames = new Set<string>();
    for (let i = 0; i < companies.length; i++) {
      const name1 = companies[i].name.toLowerCase().replace(/[^a-z0-9]/g, '');
      if (processedNames.has(name1)) continue;
      
      const similarGroup = [companies[i].name];
      for (let j = i + 1; j < companies.length; j++) {
        const name2 = companies[j].name.toLowerCase().replace(/[^a-z0-9]/g, '');
        if (this.areSimilarNames(name1, name2)) {
          similarGroup.push(companies[j].name);
          processedNames.add(name2);
        }
      }
      
      if (similarGroup.length > 1) {
        similarNames.push(similarGroup);
      }
      processedNames.add(name1);
    }
    
    return { duplicateSymbols, similarNames };
  }

  /**
   * Add missing companies to the database
   */
  async addMissingCompanies(): Promise<number> {
    const missingCompanies = await this.findMissingCompanies();
    let addedCount = 0;
    
    for (const company of missingCompanies) {
      try {
        await storage.createStock({
          symbol: company.symbol,
          name: company.name,
          exchange: company.exchange || 'OTHER',
          sector: company.sector || 'Unknown',
          price: 0, // Default price for new companies
          change: 0,
          changePercent: 0,
          volume: null,
          marketCap: null
        });
        addedCount++;
      } catch (error) {
        console.error(`Error adding company ${company.symbol}:`, error);
      }
    }
    
    console.log(`Successfully added ${addedCount} new companies to the database`);
    return addedCount;
  }
}

export const companyListProcessor = new CompanyListProcessor();