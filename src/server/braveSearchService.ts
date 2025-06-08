interface BraveSearchResult {
  title: string;
  url: string;
  description: string;
  type: string;
}

interface BraveSearchResponse {
  web?: {
    results: Array<{
      title: string;
      url: string;
      description: string;
      type: string;
    }>;
  };
}

export class BraveSearchService {
  private readonly apiKey = process.env.BRAVE_SEARCH_API_KEY!;
  private readonly baseUrl = "https://api.search.brave.com/res/v1/web/search";

  /**
   * Search for SEC filings and financial documents for a company
   */
  async searchFinancialDocuments(symbol: string, queries: string[]): Promise<BraveSearchResult[]> {
    const results: BraveSearchResult[] = [];

    for (const query of queries) {
      try {
        const searchResults = await this.performSearch(query);
        results.push(...searchResults.filter(result => 
          this.isRelevantFinancialDocument(result, symbol)
        ));
      } catch (error) {
        console.warn(`Brave Search failed for query "${query}":`, error);
      }
    }

    return this.deduplicateResults(results);
  }

  /**
   * Search for company investor relations pages
   */
  async findInvestorRelationsPages(symbol: string, companyName: string): Promise<BraveSearchResult[]> {
    const queries = [
      `${symbol} investor relations`,
      `${companyName} investor relations annual reports`,
      `${symbol} SEC filings investor relations`,
      `${companyName} annual report 10-K`
    ];

    const results: BraveSearchResult[] = [];

    for (const query of queries) {
      try {
        const searchResults = await this.performSearch(query);
        results.push(...searchResults.filter(result => 
          this.isInvestorRelationsPage(result, symbol)
        ));
      } catch (error) {
        console.warn(`Brave Search failed for IR query "${query}":`, error);
      }
    }

    return this.deduplicateResults(results);
  }

  /**
   * Search for specific year financial reports
   */
  async searchYearlyReports(symbol: string, year: string): Promise<BraveSearchResult[]> {
    const queries = [
      `${symbol} ${year} annual report 10-K filetype:pdf`,
      `${symbol} ${year} SEC filing annual report`,
      `${symbol} ${year} financial statements annual report`
    ];

    const results: BraveSearchResult[] = [];

    for (const query of queries) {
      try {
        const searchResults = await this.performSearch(query);
        results.push(...searchResults.filter(result => 
          this.isYearlyReport(result, symbol, year)
        ));
      } catch (error) {
        console.warn(`Brave Search failed for yearly report "${query}":`, error);
      }
    }

    return this.deduplicateResults(results);
  }

  /**
   * Perform the actual search using Brave Search API
   */
  private async performSearch(query: string): Promise<BraveSearchResult[]> {
    const params = new URLSearchParams({
      q: query,
      count: '10',
      offset: '0',
      search_lang: 'en',
      country: 'us',
      safesearch: 'off',
      freshness: 'py', // Past year for recent documents
      text_decorations: 'false'
    });

    const response = await fetch(`${this.baseUrl}?${params}`, {
      headers: {
        'Accept': 'application/json',
        'Accept-Encoding': 'gzip',
        'X-Subscription-Token': this.apiKey
      }
    });

    if (!response.ok) {
      throw new Error(`Brave Search API error: ${response.status}`);
    }

    const data: BraveSearchResponse = await response.json();
    
    return data.web?.results || [];
  }

  /**
   * Check if a search result is a relevant financial document
   */
  private isRelevantFinancialDocument(result: BraveSearchResult, symbol: string): boolean {
    const title = result.title.toLowerCase();
    const url = result.url.toLowerCase();
    const description = result.description.toLowerCase();
    
    const symbolLower = symbol.toLowerCase();
    
    // Check for SEC filing indicators
    const secIndicators = ['10-k', '10-q', '8-k', 'sec.gov', 'edgar'];
    const hasSecIndicator = secIndicators.some(indicator => 
      title.includes(indicator) || url.includes(indicator) || description.includes(indicator)
    );
    
    // Check for financial report indicators
    const reportIndicators = ['annual report', 'financial statements', 'earnings report', 'quarterly report'];
    const hasReportIndicator = reportIndicators.some(indicator => 
      title.includes(indicator) || description.includes(indicator)
    );
    
    // Check for company symbol/name presence
    const hasSymbol = title.includes(symbolLower) || url.includes(symbolLower) || description.includes(symbolLower);
    
    // Filter out irrelevant domains
    const excludedDomains = ['wikipedia.org', 'investopedia.com', 'reddit.com', 'twitter.com', 'facebook.com'];
    const isExcludedDomain = excludedDomains.some(domain => url.includes(domain));
    
    return hasSymbol && (hasSecIndicator || hasReportIndicator) && !isExcludedDomain;
  }

  /**
   * Check if a search result is an investor relations page
   */
  private isInvestorRelationsPage(result: BraveSearchResult, symbol: string): boolean {
    const title = result.title.toLowerCase();
    const url = result.url.toLowerCase();
    const description = result.description.toLowerCase();
    
    const symbolLower = symbol.toLowerCase();
    
    // Check for investor relations indicators
    const irIndicators = ['investor relations', 'investors', '/ir/', 'financial-reports', 'sec-filings'];
    const hasIrIndicator = irIndicators.some(indicator => 
      title.includes(indicator) || url.includes(indicator) || description.includes(indicator)
    );
    
    // Check for company symbol/name presence
    const hasSymbol = title.includes(symbolLower) || url.includes(symbolLower) || description.includes(symbolLower);
    
    return hasSymbol && hasIrIndicator;
  }

  /**
   * Check if a search result is a yearly report
   */
  private isYearlyReport(result: BraveSearchResult, symbol: string, year: string): boolean {
    const title = result.title.toLowerCase();
    const url = result.url.toLowerCase();
    const description = result.description.toLowerCase();
    
    const symbolLower = symbol.toLowerCase();
    
    // Check for year presence
    const hasYear = title.includes(year) || url.includes(year) || description.includes(year);
    
    // Check for company symbol presence
    const hasSymbol = title.includes(symbolLower) || url.includes(symbolLower) || description.includes(symbolLower);
    
    // Check for report indicators
    const reportIndicators = ['annual report', '10-k', 'financial statements'];
    const hasReportIndicator = reportIndicators.some(indicator => 
      title.includes(indicator) || description.includes(indicator)
    );
    
    return hasSymbol && hasYear && hasReportIndicator;
  }

  /**
   * Remove duplicate results based on URL
   */
  private deduplicateResults(results: BraveSearchResult[]): BraveSearchResult[] {
    const seen = new Set<string>();
    return results.filter(result => {
      if (seen.has(result.url)) {
        return false;
      }
      seen.add(result.url);
      return true;
    });
  }
}

export const braveSearchService = new BraveSearchService();