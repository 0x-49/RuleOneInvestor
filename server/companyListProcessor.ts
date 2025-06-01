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
   * Raw company data from the uploaded list (423 companies)
   */
  private rawCompanyData = `
NVDA    NVIDIA Corporation
2330    TAIWAN SEMICONDUCTOR MANUFACTURING
NOVO_B  NOVO NORDISK B A/S
ASML    ASML HOLDING
UBER    Uber Technologies, Inc.
BX      Blackstone Inc.
601919  COSCO SHIPPING HOLDINGS
JBSS3   JBS ON ED NM
MELI    MercadoLibre, Inc.
GMEXICO/B       GRUPO MEXICO SAB DE CV
KLAC    KLA Corporation
SCCO    Southern Copper Corporation
EMAAR   EMAAR PROPERTIES
ISRG    Intuitive Surgical, Inc.
FOX     Fox Corporation
MCO     Moody's Corporation
ANET    Arista Networks, Inc.
PLZL    Polus
APP     Applovin Corporation
SBSP3   SABESP ON NM
300274  SUNGROW POWER SUPP
EMAARDEV        EMAAR DEVELOPMENT
GMAB    GENMAB A/S
EVR     Evercore Inc.
SFM     Sprouts Farmers Market, Inc.
6857    ADVANTEST CORP
VRT     Vertiv Holdings, LLC
SN      SharkNinja, Inc.
PHOR    PhosAgro
UTHR    United Therapeutics Corporation
RHM     RHEINMETALL AG
CSU     CONSTELLATION SOFTWARE INC
EXEL    Exelixis, Inc.
600660  FUYAO GLASS INDUSTRY GROUP CO. LTD.
TTD     The Trade Desk, Inc.
K       KINROSS GOLD CORP
ADYEN   ADYEN
2379    REALTEK SEMICONDUCTOR CORP
ADNOCDRILL      ADNOC Drilling Company PJSC
WISE    WISE PLC CLS A ORD GBP0.01
300866  ANKER INNOVATIONS
2001    ZHEJIANG NHU CO
CALM    Cal-Maine Foods, Inc.
CRC     California Resources Corporation
EMG     MAN GROUP PLC (NEW) ORD USD0.0342857142
259960  KRAFTON
9992    POP MART INTL GRP LTD
HAR     HARMONY GM CO LTD
VIRT    Virtu Financial, Inc.
1308    SITC INTERNATIONAL HLDGS CO LTD
605499  EASTROC BEVERAGE (GROUP) CO LTD
ORNAV   ORION CORPORATION A
ELAL    EL AL
NMDC    NMDC Group PJSC
CLS     CELESTICA INC
UI      Ubiquiti Inc.
FPT     FPT CORPORATION
2376    GIGA-BYTE TECHNOLOGY CO
KOG     KONGSBERG GRUPPEN ASA
HALO    Halozyme Therapeutics, Inc.
267260  HD HYUNDAI ELECTRIC
TXRH    Texas Roadhouse, Inc.
EVN     EVOLUTION MINING LIMITED
LUG     LUNDIN GOLD INC
IESC    IES Holdings, Inc.
FPH     FISHER & PAYKEL HEALTHCARE CORP NPV
300724  SHENZHEN S C NEW E
PLUS    DIGIPLUS INTERACTIVE CORP
EAT     Brinker International, Inc.
GRBK    Green Brick Partners, Inc.
INPST   INPOST S.A.
ERIE    Erie Indemnity Company
SQN     SWISSQUOTE N
GQG     GQG PARTNERS INC.
FLOW    FLOW TRADERS
600988  CHIFENG JILONG GOLD MINING CO LTD
MTO     MITIE GROUP ORD GBP0.025
689009  NINEBOT LIMITED
605117  NINGBO DEYE TECHNOLOGY CO LTD
2367    GIANT BIOGENE HLDG CO. LTD
TGSU2   TRANSPORTADORA DE GAS DEL SUR S.A
975     SHANJIN INTERNATIO
603129  ZHEJIANG CFMOTO POWER
ISMEN   IS Y. MEN. DEG.
ANIM    ANIMA HOLDING
ANTM    ANEKA TAMBANG
MCH     MASAN CONSUMER CORPORATION
3230    SAMYANG FOOD
ALK_B   ALK-ABELLO B A/S
REA     REA GROUP LTD
300033  HITHINK ROYALFLUSH
DOCS    Doximity, Inc.
688578  SHANGHAI ALLIST PHARMACEUTICALS CO
APPF    AppFolio, Inc.
300628  YEALINK NETWORK TE
OGC     OCEANAGOLD CORPORATION
YOU     Clear Secure, Inc.
CNVRG   CONVERGE INFORMATION AND COMMUNICATIONS TECHNOLOGY SOLUTIONS, INC
1318    MAO GEPING COSMETICS CO LTD
MAVI    MAVI GIYIM
GTT     GTT (GAZTRANSPORT ET TECHNIGAZ) EUR0.01
ENAEX   ENAEX SA
NVMI    Nova Ltd.
CPRX    Catalyst Pharmaceuticals, Inc.
6532    BAYCURRENT INC
2360    CHROMA ATE INC
426     INNER MONGOLIA XIN
TDW     Tidewater Inc.
278470  APR
STAA    SUMBER TANIAGUNG RESOURCES TBK
688278  XIAMEN AMOYTOP BIOTECH CO LTD
FTK     FLATEXDEGIRO AG
ATH     ATHABASCA OIL CORP
MULT3   MULTIPLAN ON N2
BMI     Badger Meter, Inc.
2669    CHINA OVERSEAS PROPERTY HLDGS LTD
2155    HUNAN GOLD CORPORA
79550   LIG NEX1 CO., LTD.
300251  BEIJING ENLIGHT ME
TOI     TOPICUS COM INC
METR    METROGAS SA
3661    ALCHIP TECHNOLOGIES LIMITD
STBP3   SANTOS BRP ON NM
RMS     RAMELIUS RESOURCES LIMITED
300394  SUZHOU TFC OPTICAL
PCT     POLAR CAPITAL TECHNOLOGY TRUST PLC ORD GBP0.025
600301  GUANGXI HUAXI NONFERROUS METAL CO L
2520    KINDOM DEVELOPMENT CO LTD
DOM     DOMDEV
9636    JF SMARTINVEST HOLDINGS LTD
2059    KING SLIDE WORKS CO
PORT3   WILSON SONS ON ED NM
WAPCO   LAFARGE CEMENT WAPCO PLC
TAPG    TRIPUTRA AGRO PERSADA TBK
KYN     Kayne Anderson Energy Infrastructure Fund, Inc.
8114    POSIFLEX TECHNOLOGIES INC
PODERC1 COMPANIA MINERA PODEROSA SA
PRL     PROPEL HOLDINGS INC
300573  SHENYANG XINGQI PH
4015    JAMJOOM PHARMACEUTICALS FACTORY CO.
4587    PEPTIDREAM INC
SEZL    Sezzle Inc.
WDO     WESDOME GOLD MINES LTD
MINEROS MINEROS S.A.
688188  SHANGHAI BOCHU ELECTRONIC TECH CORP
ARADEL  ARADEL
HWX     HEADWATER EXPLORATION INC
145020  HUGEL, INC.
CRN     CAIRN HOMES PLC ORD EUR0.001 (CDI)
603893  FUZHOU ROCKCHIP ELECTRONICS CO LTD
36930   JUSUNG ENGINEERING CO.,LTD.
BSLN    BASILEA N
214450  PHARMARESEARCH
NGI     NAVIGATOR GLOBAL INVESTMENTS LIMITED
HLAN    HILAN
AIY     IFAST
RAYA    RAYA HOLDING FOR FINANCIAL INVESTMENTS
257720  SILICON 2 CO.,LTD.
CLEBI   CELEBI
18290   VT
1773    TIANLI INTERNATIONAL HOLDINGS LTD
688019  ANJI MICROELECTRONICS TECHNOLOGY
USLM    United States Lime & Minerals, Inc.
3227    PIXART IMAGING
UFPT    UFP Technologies, Inc.
GBAN    NATURGY BAN SA
SYNE3   SYN PROP TECON NM
TIMA    ZEAL NETWORK SE
TNE     TECHNOLOGY ONE LIMITED
AGX     Argan, Inc.
319660  PSK INC.
214150  CLASSYS INC.
3939    WANGUO GOLD GROUP LTD
5274    ASPEED TECHNOLOGY INC
APX     APEX MINING COMPANY, INC.
LEU     Centrus Energy Corp.
4373    SIMPLEX HLDGS INC
7047    PORT INC
2947    SUZHOU HENGMINGDA
ATI     ASIAN TERMINALS, INC.
6896    GOLDEN THROAT HLDGS GROUP CO LTD
GAMB    Gambling.com Group Limited
EVT     ECONOMIC INVESTMENT TRUST
3030    TEST RESEARCH INC
ALCN    ALEXANDRIA CONTAINERS AND GOODS
VH2     FRIEDRICH VORWERK GRP SE
84370   EUGENE TECHNOLOGY CO., LTD.
605183  QUECHEN SILICON CHEMICAL CO LTD
3529    EMEMORY TECHNOLOGY INC.
1442    ADVANCETEK ENTERPRICE
THX     THOR EXPLORATIONS
AIO     Virtus Artificial Intelligence & Technology Opportunities Fund
GSFI    GAN SHMUEL
HEM     HEMNET GROUP AB
NWL     NETWEALTH GROUP LIMITED
FAPA    FAP AGRI TBK
MND     MANDALAY RESOURCES CORP
2718    ALLMIND HOLDINGS CORPORATION
SIQ     SMARTGROUP CORPORATION LTD
IVSO    INVISIO AB
603929  L AND K ENGINEERING (SUZHOU) CO LTD
NATF    NATIONAL FOODS LTD
MSB     Mesabi Trust
CLMB    Climb Global Solutions, Inc.
6187    ALL RING TECH CO
CICN    CICOR TECH N
PME     PRO MEDICUS LIMITED
NXSN    NEXT VISION STABIL
5710    DAEWONSANUP
31980   PSK HOLDINGS INC.
83450   GLOBAL STANDARD TECHNOLOGY CO., LTD.
PHN     PHARMANUTRA
FNOX    FORTNOX AB
OCDI    SIX OF OCTOBER DEVELOPMENT & INVESTMENT (SODIC)
1180    PARADISE ENTERTAINMENT LIMITED
SUP     SUPREME PLC ORD GBP0.10
3836    AVANT GROUP CORPORATION
ATLH    ATLAS HONDA LTD
3450    ELITE ADVANCED LASER CORP
INOD    Innodata Inc.
TGMA3   TEGMA ON NM
300570  T AND S COMMUNICAT
95610   TES CO., LTD.
TEA     TASMEA LIMITED
4162    PHARMAENGINE INC
64760   TOKAI CARBON KOREA CO., LTD
69510   ESTEC CORPORATION
688093  SUZHOU SHIHUA NEW MATERIAL TECHNOLO
BVC     BOLSA DE VALORES DE COLOMBIA S.A.
NTP     TIEN PHONG PLASTIC JSC
3978    CHINA BESTSTUDY EDUCATION GROUP
FWRY    FAWRY FOR BANKING TECHNOLOGY AND ELECTRONIC PAYMENT
INDIAMART       INDIAMART INTERMESH LTD
BTO     John Hancock Financial Opportunities Fund
BTM     PENGUIN INTL
1523    PLOVER BAY TECHNOLOGIES LTD
340570  T&L CO., LTD.
688300  NOVORAY CORPORATION
TRIM    TRIMEGAH SEKURITAS INDONESIA TBK
MLX     METALS X LIMITED
1731    PROSPEROUS INDUSTRIAL (HLDGS) LTD
3131    GRAND PROCESS TECHNOLOGY CO
3217    ARGOSY RESEARCH
DKFT    CENTRAL OMEGA RESOURCES TBK
82920   VITZROCELL CO., LTD.
1412    Q P GROUP HLDGS LTD
AEF     AUSTRALIAN ETHICAL INVESTMENT LIMITED
HAVAD   HAVANNA HOLDING SA
UNITED  UNITED BANKERS OYJ
3526    ALLTOP TECHNOLOGY CO LTD
OKOMUOIL        OKOMU OIL PALM CO PLC
CASS    CAHAYA AERO SERVICES TBK
NAPESCO NATIONAL PETROLEUM SERVICES
SECT_B  SECTRA AB SER B
PM      PREMIER MARKETING PUBLIC CO LTD
HALEON  HALEON PAKISTAN LTD
LBW     LUBAWA
EXAE    HELLENIC EXCHANGES (CR)
EFIH    E-FINANCE FOR DIGITAL AND FINANCIAL INVESTMENTS
SNL     SUPPLY NETWORK LIMITED
2161    JBM (HEALTHCARE) LTD
HINOON  HIGHNOON LABORATORIES LTD
9528    GAS ARABIAN SERVICES CO.
6143    NETRONIX INC
MEGM    MIDDLE EAST GLASS MANUFACTURING
6788    BRILLIAN NETWORK & AUTOMATION INTEG
GNP     GENUSPLUS GROUP LTD
300515  HUNAN SUNDAY SCIEN
AAI     ASIAN ALLIANCE INTERNATIONAL PCL
NTGAZ   NATURELGAZ
6728    UP YOUNG CORNERSTONE CORP
SPR     SPYROSOFT
NORBT   NORBIT ASA
MKO     MAKO MINING CORP
SYS1    SYSTEM1 GROUP PLC ORD GBP0.01
MIPS    MIPS AB
NEA     NICOLAS CORREA
SRB     SERABI GOLD PLC ORD GBP0.10
SISB    SISB PCL
SXE     SOUTHERN CROSS ELECTRICAL ENGINEERING LTD
WAX     WAM RESEARCH LIMITED
NSL     NSL FOODS PCL
GNG     GR ENGINEERING SERVICES LIMITED
ALL     AILLERON
IPG     IPD GROUP LTD
NASCON  NASCON ALLIED INDUSTRIES PLC
MAGNI   MAGNI-TECH INDUSTRIES BHD
HME     HEMISPHERE ENERGY CORPORATION
6741    91APP INC
123860  ANAPASS, INC.
BBW     AZEUS
6231    INSYDE SOFTWARE CORP
335890  VIOL CO., LTD.
EZZ     EZZ LIFE SCIENCE HOLDINGS LIMITED
PLC     PLC
5262    GIGASTONE CORPORATION
SCS     SAIGON CARGO SERVICE CORP
SGN     SYGNITY
TRANSCOHOT      TRANSCORP HOTELS PLC
MHOT    MISR HOTELS
AST     TASECO AIR SERVICES JOINT STOCK COMPANY
PABC    PAKISTAN ALUMINIUM BEVERAGE CANS LIMITED
2302    CNNC INTERNATIONAL LTD.
14940   ORIENTAL PRECISION & ENGINEERING CO.,LTD
6807    FY GROUP LTD
4571    KHGEARS INTERNATIONAL LTD
BEZ     BENG KUANG
TSSI    TSS, Inc.
3350    HANKOOK COSMETICS MANUFACTURING
2031    AUSUPREME INTERNATIONAL HLDGS LTD
MEGAP   MEGA POLIETILEN
5TP     CNMC GOLDMINE
INNO    INNOPRISE PLANTATIONS BERHAD
IGP     INTERCEDE GROUP ORD GBP0.01
6683    KEYSTONE MICROTECH CO
PT      PREMIER TECHNOLOGY PUBLIC CO LTD
MARK    MARK DYNAMICS INDONESIA
FIDSON  FIDSON HEALTHCARE PLC
MUREB   MURREE BREWERY LTD
MPTI    M-tron Industries, Inc.
KEJU    MULIA BOGA RAYA TBK
INA     INSOLATION ENERGY LIMITED
AKR     EKARAT ENGINEERING
HONYFLOUR       HONEYWELL FLOUR MILLS PLC
GHNI    GHANDHARA INDUSTRIES CO LTD
4979    LUXNET CORPORATION
ELITE   ELITE NATUREL ORGANIK GIDA
BEEF    ESTIKA TATA TIARA TBK
263860  GENIANS, INC.
179290  MITECH CO., LTD.
41190   WOORI TECHNOLOGY INVESTMENT CO., LTD
IPCC    INDONESIA KENDARAAN TERMINAL TBK
GMM     Global Mofy AI Limited
260970  S&D CO., LTD
3570    OTSUKA INFORMATION TECHNOLOGY CORP.
ARYT    ARYT
6028    GOLDEN INSURANCE BROKERS CO LTD
KISS    ROJUKISS INTERNATIONAL PCL
4987    GODEX INTERNATIONA
2751    KINGZA INTERNATIONAL CO LTD
408920  MESSE ESANG
9550    SURE GLOBAL TECH CO
98120   MICRO CONTACT SOLUTION CO.,LTD.
9627    TWAREAT MEDICAL CARE CO.
CGS     COGSTATE LTD
6498    POWERTIP IMAGE CORP
1451    MS GROUP HLDGS LTD
332370  IDP CORP., LTD.
KPG     KELLY PARTNERS GROUP HOLDINGS LIMITED
4772    TAIWAN SPECIALITY CHEMICALS CORPORA
MCBIM   MCB INVESTMENT MANAGEMENT LIMITED
SHFA    SHIFA INTERNATIONAL HOSPITALS LTD
NCI     NTG CLARITY NETWORKS INC
CELLECOR        CELLECOR GADGETS LTD
HGM     HA GIANG MINERAL MECHANICS JSC
356890  CYBERONE CO., LTD.
8342    I JANG INDUSTRIA CO LTD
CHCI    Comstock Holding Companies, Inc.
ADB     AUTOCOUNT DOTCOM BERHAD
1712    DRAGON MINING LIMITED
APP     APPLICAD PCL
PLEJD   PLEJD AB
GAL     GHANDHARA AUTOMOBILES LTD
9557    EDARAT COMMUNICATION AND INFORMATION TECHNOLOGY CO.
SED     PHUONG NAM EDUCATION INV & DEV JSC
ZAL     ZALARIS ASA
ETST    Earth Science Tech, Inc.
VLL.N0000       VIDULLANKA PLC
SKS     SKS TECHNOLOGIES GROUP LIMITED
OPXS    Optex Systems Holdings, Inc.
TFC     TRANG CORPORATION
ATR     ATREM
IDR     Idaho Strategic Resources, Inc.
6855    ECLATORQ TECHNOLOGY CO LTD
AHC     AUSTCO HEALTHCARE LIMITED
MTRKS   MATRIKS FINANSAL TEKNOLOJILER
MAM     MICROEQUITIES ASSET MANAGEMENT GROUP LIMITED
TBTC    Table Trac, Inc.
NFC     NINH BINH PHOSPHATE FERTILIZER JSC
7714    UNIFORCE TECHNOLOGY CORPORATION
ACFN    Acorn Energy, Inc.
8162    LOCO HONG KONG HOLDINGS LIMITED
6898    CHAINSEA INFORMATION INTEGRATION CO
CLOUDPT CLOUDPOINT TECHNOLOGY BERHAD
HNW     Pioneer Diversified High Income Fund, Inc.
ZKX     EVER GLORY
6820    ACON OPTICS COMMUNICATIONS INC
UNIQ    ULIMA NITRA TBK
NEX     RECLAIMS GLOBAL
SGC     SA GIANG IMPORT-EXPORT CORPORATION
STP     SAHATHAI PRINTING & PACKAGING PCL
6986    HEXUN BIOSCIENCES CO LTD
JSGCL   JS GLOBAL CAPITAL LTD
INDXA   INDEXA CAPITAL GROUP, S.A.
ADCI    ARAB PHARMACEUTICALS
MFGROUP MANFORCE GROUP BERHAD
LFECORP LFE CORPORATION BHD
VINSYS  VINSYS IT SERVICES IND LTD
ITECH   I-TECH AB
6955    BONRAYBIO CO LTD
MAYBAKER        MAY AND BAKER PLC - NIGERIA
VERTI   VERTIKAL GROUP ZRT
ETRS    EGYPTIAN TRANSPORT (EGYTRANS)
IKEJAHOTEL      IKEJA HOTEL PLC
CFF     CFF FLUID CONTROL LIMITED
SEALMATIC       SEALMATIC INDIA LIMITED
BRIGHT  BRIGHT OUTDOOR MEDIA LIMITED
INTEK   INNOSA TEKNOLOJI
PVE     PO VALLEY ENERGY LIMITED
MOBILIA MOBILIA HOLDINGS BERHAD
AFRIPRUD        AFRICA PRUDENTIAL REGISTRARS PLC
ARYACAPM        ARYAMAN CAPITAL MARKETS LIMITE
ENEST   ENEST GROUP BERHAD
SYSTANGO        SYSTANGO TECHNOLOGIES LTD
LFLO    IMAGO MULIA PERSADA TBK
KEL     KUNDAN EDIFICE LTD
TAH     THIRD AGE HEALTH SERVICES LTD NPV
CTZ     NAMSYS INC
6979    VICTORY FOR TECHNOLOGY CO LTD
BIG     B.I.G. INDUSTRIES BHD
ESENT   ESENSE HUMAN RES
BERGER  BERGER PAINTS PLC - NIGERIA
ZTE     ZTEST ELECTRONICS INC.
NINH    NOZHA INTERNATIONAL HOSPITAL
MPSOL   MATRIX PARKING SOLUTION HOLDINGS BERHAD
CSOC.A  CANSO SELECT OPPORTUNITIES CORP
URBAN   URBAN ENVIRO WASTE MGMT L
TIP     THE INITIATES PLC
AAGC    All American Gold Corp.
TECHKGREEN      TECHKNOWGREEN SOLUTIONS LIMITE
SHINEFASH       SHINE FASHIONS (INDIA) LIMITED
HCC     HOA CAM CONCRETE JSC
IDBTECH IDB TECHNOLOGIES BERHAD
MEYER   MEYER PLC.
SIGNORIA        SIGNORIA CREATION LTD
MND     MINERAL MIDRANGE
SKN     SAKANA
XPS     XPS PENSIONS GROUP PLC ORD GBP0.0005
ADM     ADMIRAL GROUP ORD GBP0.001
TURSG   TURKIYE SIGORTA
AKGRT   AKSIGORTA
VAKFN   VAKIF FIN. KIR.
`;

  /**
   * Parse the raw company data into structured records
   */
  parseCompanyData(): CompanyRecord[] {
    const lines = this.rawCompanyData.trim().split('\n');
    const companies: CompanyRecord[] = [];
    
    for (const line of lines) {
      if (line.trim()) {
        const parts = line.split('\t');
        if (parts.length >= 2) {
          const symbol = parts[0].trim();
          const name = parts[1].trim();
          
          companies.push({
            symbol,
            name,
            exchange: this.determineExchange(symbol),
            sector: 'Technology', // Default sector, can be updated later
          });
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
          marketCap: null,
          peRatio: null,
          dividend: null,
          dividendYield: null
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