export interface CachedCompanyResult {
  symbol: string;
  lastUpdated: Date;
  success: boolean;
  yearsOfData: number;
  ruleOneMetrics?: {
    salesGrowth: number | null;
    epsGrowth: number | null;
    equityGrowth: number | null;
    fcfGrowth: number | null;
    roic: number | null;
    debtPayoffYears: number | null;
  };
}

export class CacheService {
  private cache: Map<string, CachedCompanyResult> = new Map();
  private readonly CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

  /**
   * Check if a company has valid cached results
   */
  isValidCached(symbol: string): boolean {
    const cached = this.cache.get(symbol);
    if (!cached) return false;
    
    const now = new Date();
    const timeDiff = now.getTime() - cached.lastUpdated.getTime();
    return timeDiff < this.CACHE_DURATION;
  }

  /**
   * Get cached results for a company
   */
  getCached(symbol: string): CachedCompanyResult | null {
    if (this.isValidCached(symbol)) {
      return this.cache.get(symbol) || null;
    }
    return null;
  }

  /**
   * Cache results for a company
   */
  setCached(symbol: string, result: Omit<CachedCompanyResult, 'lastUpdated'>): void {
    this.cache.set(symbol, {
      ...result,
      lastUpdated: new Date()
    });
  }

  /**
   * Clear cache for a specific company
   */
  clearCached(symbol: string): void {
    this.cache.delete(symbol);
  }

  /**
   * Get all cached results
   */
  getAllCached(): CachedCompanyResult[] {
    return Array.from(this.cache.values()).filter(result => 
      this.isValidCached(result.symbol)
    );
  }
}

export const cacheService = new CacheService();