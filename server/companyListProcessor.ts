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
    try {
      const fs = require('fs');
      const path = require('path');
      const filePath = path.resolve('./attached_assets/Pasted-NVDA-NVIDIA-Corporation-2330-TAIWAN-SEMICONDUCTOR-MANUFACTURING-NOVO-B-NOVO-NORDISK-B-A-S-ASML-AS-1748786982199.txt');
      return fs.readFileSync(filePath, 'utf-8');
    } catch (error) {
      console.error('Error reading company list file:', error);
      // Fallback to embedded data if file reading fails
      return `NVDA      NVIDIA Corporation
2330    TAIWAN SEMICONDUCTOR MANUFACTURING
NOVO_B  NOVO NORDISK B A/S
ASML    ASML HOLDING
UBER    Uber Technologies, Inc.
BX      Blackstone Inc.
601919  COSCO SHIPPING HOLDINGS
JBSS3   JBS ON ED NM
MELI    MercadoLibre, Inc.
GMEXICO/B       GRUPO MEXICO SAB DE CV`;
    }
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