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

      return uniqueDocuments.map(doc => ({
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
   * Extract financial data from a specific SEC filing using AI
   */
  private async extractDataFromFiling(symbol: string, filing: SECFilingSearchResult): Promise<CompanyFilingData | null> {
    console.log(`📊 Extracting data from ${filing.filingType} for ${symbol} (${filing.year})`);
    
    // Simulate fetching filing content - in production this would download the actual document
    const filingContent = await this.fetchFilingContent(filing.url);
    
    if (!filingContent) {
      return null;
    }
    
    // Use OpenAI to extract specific financial metrics
    const extractionPrompt = `
You are an expert financial analyst. Extract the following key financial metrics from this ${filing.filingType} filing for ${symbol} (year ${filing.year}):

REQUIRED METRICS (extract exact numbers, no calculations):
1. Total Revenue/Net Sales
2. Net Income/Earnings  
3. Book Value/Shareholders' Equity
4. Operating Cash Flow
5. Capital Expenditures
6. Total Debt
7. Shares Outstanding (basic)
8. Earnings Per Share (basic)

DOCUMENT CONTENT:
${filingContent}

Respond in JSON format with exact numbers (no commas, just numbers):
{
  "revenue": 123456789,
  "earnings": 12345678,
  "bookValue": 87654321,
  "operatingCashFlow": 23456789,
  "capitalExpenditures": 3456789,
  "debt": 45678901,
  "sharesOutstanding": 5678901234,
  "eps": 2.45,
  "dataQuality": "high|medium|low",
  "notes": "Any important notes about the data extraction"
}

If a metric is not found or unclear, use null. Focus on accuracy over completeness.
`;

    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are a financial data extraction expert. Extract exact numbers from SEC filings with perfect accuracy. Never estimate or calculate - only extract reported figures."
          },
          {
            role: "user",
            content: extractionPrompt
          }
        ],
        response_format: { type: "json_object" },
        temperature: 0,
        max_tokens: 1000
      });

      const extractedData = JSON.parse(response.choices[0].message.content);
      
      // Calculate free cash flow if we have the components
      const freeCashFlow = extractedData.operatingCashFlow && extractedData.capitalExpenditures 
        ? extractedData.operatingCashFlow - Math.abs(extractedData.capitalExpenditures)
        : null;
      
      return {
        symbol,
        year: filing.year,
        revenue: extractedData.revenue,
        earnings: extractedData.earnings,
        freeCashFlow,
        bookValue: extractedData.bookValue,
        eps: extractedData.eps,
        operatingCashFlow: extractedData.operatingCashFlow,
        capitalExpenditures: extractedData.capitalExpenditures,
        debt: extractedData.debt,
        sharesOutstanding: extractedData.sharesOutstanding
      };
      
    } catch (error) {
      console.error(`Failed to extract data from ${filing.filingType}:`, error);
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
   * Simulate fetching filing content - in production this would download from SEC EDGAR
   */
  private async fetchFilingContent(url: string): Promise<string | null> {
    // This is a simulation - in production, this would:
    // 1. Download the actual SEC filing from EDGAR
    // 2. Parse HTML/XML/PDF content
    // 3. Extract readable text for AI processing
    // 4. Handle different filing formats (HTML, XBRL, PDF)
    
    console.log(`📥 Simulating download of filing from ${url}`);
    
    // Return sample 10-K content structure for demonstration
    return `
UNITED STATES SECURITIES AND EXCHANGE COMMISSION
Form 10-K Annual Report

CONSOLIDATED STATEMENTS OF OPERATIONS
(In millions, except per share data)

                                    Year Ended December 31,
                                2023        2022        2021
Net revenues                  $394,328    $469,822    $365,817
Cost of revenues              $185,281    $220,693    $178,299
Gross profit                  $209,047    $249,129    $187,518

Operating expenses:
Research and development       $73,753     $67,399     $56,635
Sales and marketing           $26,567     $26,567     $22,912
General and administrative    $15,724     $15,017     $13,072
Total operating expenses      $116,044    $108,983     $92,619

Operating income              $93,003     $140,146     $94,899
Interest income               $2,577      $2,336      $2,123
Interest expense              ($2,906)    ($2,865)    ($2,645)
Other income, net             $1,348      $1,452      $1,323

Income before taxes           $94,022     $141,069     $95,700
Provision for income taxes    ($16,950)   ($11,356)   ($14,701)
Net income                    $77,072     $129,713     $81,999

Earnings per share:
Basic                         $4.95       $8.31       $5.24
Diluted                       $4.90       $8.29       $5.22

Shares outstanding (basic)    15,570      15,606      15,647

CONSOLIDATED BALANCE SHEETS
Total shareholders' equity    $138,245    $124,618    $109,896
Total debt                    $29,963     $14,705     $13,932

CONSOLIDATED STATEMENTS OF CASH FLOWS
Operating cash flow           $101,768    $108,843     $91,652
Capital expenditures          ($31,485)   ($24,209)   ($19,103)
Free cash flow               $70,283     $84,634     $72,549
`;
  }
  
  /**
   * Generate mock filing list for demonstration
   */
  private generateMockFilingList(symbol: string): SECFilingSearchResult[] {
    const currentYear = new Date().getFullYear();
    const filings: SECFilingSearchResult[] = [];
    
    // Generate 10 years of mock filings
    for (let i = 0; i < 10; i++) {
      const year = currentYear - 1 - i; // Start from last complete year
      filings.push({
        url: `https://www.sec.gov/edgar/data/mock/${symbol}-${year}-10K.html`,
        filingType: "10-K",
        filingDate: `${year}-03-15`,
        year: year.toString()
      });
    }
    
    return filings;
  }
}

export const deepSearchAgent = new DeepSearchAgent();