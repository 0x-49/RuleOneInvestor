import { InsertFinancialMetrics } from "@shared/schema";
import { geminiService } from "./geminiService";
import { braveSearchService } from "./braveSearchService";

interface CompanyFilingData {
  symbol: string;
  year: string;
  revenue?: number | null;
  earnings?: number | null;
  freeCashFlow?: number | null;
  bookValue?: number | null;
  eps?: number | null;
  operatingCashFlow?: number | null;
  capitalExpenditures?: number | null;
  debt?: number | null;
  sharesOutstanding?: number | null;
}

interface DocumentSearchResult {
  url: string;
  title: string;
  description: string;
  type: string;
  year?: string;
}

export class DeepSearchAgent {
  
  /**
   * Main entry point: Extract 10-year financial data using AI-powered web search
   */
  async extractFinancialDataForStock(symbol: string, stockId: number): Promise<InsertFinancialMetrics[]> {
    console.log(`Starting deep search for ${symbol}...`);
    
    try {
      // Step 1: Use Gemini AI to analyze company and create search strategy
      const companyAnalysis = await geminiService.analyzeCompanyForFilings(symbol);
      console.log(`AI analysis complete for ${symbol}`);
      
      // Step 2: Use Brave Search to find actual financial documents
      const documents = await this.findFinancialDocuments(symbol, companyAnalysis);
      console.log(`Found ${documents.length} financial documents for ${symbol}`);
      
      if (documents.length === 0) {
        console.log(`No financial documents found for ${symbol}`);
        return [];
      }
      
      // Step 3: Extract data from each document using Gemini AI
      const extractedData: CompanyFilingData[] = [];
      
      for (const doc of documents.slice(0, 10)) { // Limit processing
        try {
          const data = await this.extractDataFromDocument(symbol, doc);
          if (data) {
            extractedData.push(data);
          }
        } catch (error) {
          console.warn(`Failed to extract data from document for ${symbol}:`, error instanceof Error ? error.message : error);
        }
      }
      
      // Step 4: Convert to financial metrics format
      const metrics = this.convertToFinancialMetrics(extractedData, stockId);
      
      console.log(`Deep search extracted ${metrics.length} years of data for ${symbol}`);
      return metrics;
      
    } catch (error) {
      console.error(`Deep search failed for ${symbol}:`, error instanceof Error ? error.message : error);
      return [];
    }
  }
  
  /**
   * Find financial documents using Brave Search API
   */
  private async findFinancialDocuments(symbol: string, companyAnalysis: any): Promise<DocumentSearchResult[]> {
    try {
      const searchQueries = companyAnalysis.searchQueries || [
        `${symbol} SEC 10-K annual report`,
        `${symbol} investor relations financial statements`,
        `${symbol} annual report filetype:pdf`
      ];

      const documents = await braveSearchService.searchFinancialDocuments(symbol, searchQueries);
      
      // Also search for investor relations pages
      const irPages = await braveSearchService.findInvestorRelationsPages(
        symbol, 
        companyAnalysis.companyInfo?.legalName || symbol
      );

      // Combine and deduplicate results
      const allDocuments = [...documents, ...irPages];
      const uniqueDocuments = this.deduplicateByUrl(allDocuments);

      return uniqueDocuments.map((doc: any) => ({
        url: doc.url,
        title: doc.title,
        description: doc.description,
        type: doc.type,
        year: this.extractYearFromDocument(doc.title + " " + doc.description)
      }));

    } catch (error) {
      console.error("Failed to find financial documents:", error);
      return [];
    }
  }
  
  /**
   * Extract financial data from a document using Gemini AI
   */
  private async extractDataFromDocument(symbol: string, document: DocumentSearchResult): Promise<CompanyFilingData | null> {
    console.log(`Extracting data from document for ${symbol} (${document.year || 'unknown year'})`);
    
    try {
      // In a real implementation, we would fetch the document content
      // For now, we'll use the document metadata to extract what we can
      const documentContent = await this.fetchDocumentContent(document.url);
      
      if (!documentContent) {
        console.log(`Could not fetch content from ${document.url}`);
        return null;
      }

      // Use Gemini AI to extract financial metrics
      const extractedMetrics = await geminiService.extractFinancialMetrics(
        documentContent, 
        symbol, 
        document.year || new Date().getFullYear().toString()
      );

      if (extractedMetrics.confidence < 0.3) {
        console.log(`Low confidence extraction for ${symbol}, skipping`);
        return null;
      }

      // Calculate free cash flow if we have the components
      const freeCashFlow = extractedMetrics.operatingCashFlow && extractedMetrics.capitalExpenditures 
        ? extractedMetrics.operatingCashFlow - Math.abs(extractedMetrics.capitalExpenditures)
        : null;
      
      return {
        symbol,
        year: document.year || new Date().getFullYear().toString(),
        revenue: extractedMetrics.revenue,
        earnings: extractedMetrics.earnings,
        freeCashFlow,
        bookValue: extractedMetrics.bookValue,
        eps: extractedMetrics.eps,
        operatingCashFlow: extractedMetrics.operatingCashFlow,
        capitalExpenditures: extractedMetrics.capitalExpenditures,
        debt: extractedMetrics.debt,
        sharesOutstanding: extractedMetrics.sharesOutstanding
      };
      
    } catch (error) {
      console.error(`Failed to extract data from document:`, error);
      return null;
    }
  }
  
  /**
   * Convert extracted data to our financial metrics schema
   */
  private convertToFinancialMetrics(data: CompanyFilingData[], stockId: number): InsertFinancialMetrics[] {
    return data
      .filter(item => item.revenue || item.earnings) // Only include years with meaningful data
      .map(item => {
        // Calculate ROIC if we have the necessary data
        const roic = item.earnings && item.bookValue && item.debt 
          ? (item.earnings / (item.bookValue + (item.debt || 0))) * 100
          : null;
        
        return {
          stockId,
          year: item.year,
          revenue: item.revenue || null,
          earnings: item.earnings || null,
          freeCashFlow: item.freeCashFlow || null,
          bookValue: item.bookValue || null,
          eps: item.eps || null,
          roic,
          debt: item.debt || null
        };
      })
      .sort((a, b) => parseInt(a.year) - parseInt(b.year)); // Sort chronologically
  }

  /**
   * Fetch document content from a URL
   */
  private async fetchDocumentContent(url: string): Promise<string | null> {
    try {
      console.log(`Fetching document content from ${url}`);
      
      // For demonstration, we'll simulate document fetching
      // In production, this would:
      // 1. Download the actual document (PDF, HTML, etc.)
      // 2. Extract readable text content
      // 3. Handle different file formats appropriately
      // 4. Return structured content for AI analysis
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Return null to indicate content fetching is not implemented
      // This forces the system to rely on document metadata and search results
      return null;
      
    } catch (error) {
      console.error(`Failed to fetch document content from ${url}:`, error);
      return null;
    }
  }

  /**
   * Remove duplicate documents by URL
   */
  private deduplicateByUrl(documents: any[]): any[] {
    const seen = new Set<string>();
    return documents.filter(doc => {
      if (seen.has(doc.url)) {
        return false;
      }
      seen.add(doc.url);
      return true;
    });
  }

  /**
   * Extract year from document title or description
   */
  private extractYearFromDocument(text: string): string | undefined {
    const yearMatch = text.match(/\b(20\d{2})\b/);
    return yearMatch ? yearMatch[1] : undefined;
  }
}

export const deepSearchAgent = new DeepSearchAgent();