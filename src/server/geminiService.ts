import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export class GeminiService {
  private model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });
  private proModel = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

  /**
   * Use Gemini Flash for quick analysis and document location
   */
  async analyzeCompanyForFilings(symbol: string, companyName?: string): Promise<{
    companyInfo: any;
    searchQueries: string[];
    expectedFilings: string[];
  }> {
    const prompt = `
You are a financial research expert. I need to find SEC filings and annual reports for a company.

Company Symbol: ${symbol}
Company Name: ${companyName || "Unknown"}

Please provide:
1. Full legal company name and ticker symbol
2. CIK number if known
3. Best search queries to find their SEC filings and annual reports
4. Expected filing types (10-K, 10-Q, etc.)
5. Investor relations page patterns

Respond in JSON format:
{
  "companyInfo": {
    "legalName": "Full Legal Company Name",
    "symbol": "${symbol}",
    "cik": "1234567890",
    "industry": "Technology/Healthcare/etc",
    "exchange": "NASDAQ/NYSE/etc"
  },
  "searchQueries": [
    "${symbol} SEC 10-K annual report filetype:pdf",
    "${symbol} investor relations annual report",
    "company name 10-K SEC filing"
  ],
  "expectedFilings": [
    "10-K Annual Report",
    "10-Q Quarterly Report",
    "8-K Current Report"
  ]
}
`;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      return JSON.parse(text);
    } catch (error) {
      console.error("Gemini analysis error:", error);
      return {
        companyInfo: { legalName: companyName || symbol, symbol },
        searchQueries: [`${symbol} SEC 10-K annual report`, `${symbol} investor relations`],
        expectedFilings: ["10-K Annual Report"]
      };
    }
  }

  /**
   * Use Gemini Pro for deep financial document analysis
   */
  async extractFinancialMetrics(documentContent: string, symbol: string, year: string): Promise<{
    revenue?: number;
    earnings?: number;
    bookValue?: number;
    operatingCashFlow?: number;
    capitalExpenditures?: number;
    debt?: number;
    sharesOutstanding?: number;
    eps?: number;
    confidence: number;
    dataQuality: 'high' | 'medium' | 'low';
    notes: string;
  }> {
    const prompt = `
You are a financial analyst expert. Extract precise financial metrics from this ${year} document for ${symbol}.

CRITICAL REQUIREMENTS:
- Extract EXACT numbers as reported (no calculations or estimates)
- Use null for missing data
- Ensure all numbers are in consistent units (typically millions)
- Return only the most recent full-year data

DOCUMENT CONTENT:
${documentContent.substring(0, 8000)} // Limit content for token efficiency

Extract these metrics:
1. Total Revenue/Net Sales (annual)
2. Net Income/Earnings (annual)
3. Total Shareholders' Equity/Book Value
4. Operating Cash Flow
5. Capital Expenditures
6. Total Debt
7. Shares Outstanding (basic)
8. Earnings Per Share (basic)

Respond in JSON format:
{
  "revenue": 123456.7,
  "earnings": 12345.6,
  "bookValue": 87654.3,
  "operatingCashFlow": 23456.7,
  "capitalExpenditures": 3456.7,
  "debt": 45678.9,
  "sharesOutstanding": 1234567890,
  "eps": 2.45,
  "confidence": 0.95,
  "dataQuality": "high",
  "notes": "Data extracted from consolidated statements"
}
`;

    try {
      const result = await this.proModel.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      const extracted = JSON.parse(text);
      
      return {
        revenue: extracted.revenue || null,
        earnings: extracted.earnings || null,
        bookValue: extracted.bookValue || null,
        operatingCashFlow: extracted.operatingCashFlow || null,
        capitalExpenditures: extracted.capitalExpenditures || null,
        debt: extracted.debt || null,
        sharesOutstanding: extracted.sharesOutstanding || null,
        eps: extracted.eps || null,
        confidence: extracted.confidence || 0.5,
        dataQuality: extracted.dataQuality || 'medium',
        notes: extracted.notes || 'Data extraction completed'
      };
    } catch (error) {
      console.error("Gemini extraction error:", error);
      return {
        confidence: 0,
        dataQuality: 'low',
        notes: 'Failed to extract financial metrics'
      };
    }
  }

  /**
   * Analyze document quality and determine extraction strategy
   */
  async analyzeDocumentQuality(content: string): Promise<{
    isFinancialDocument: boolean;
    documentType: string;
    quality: 'high' | 'medium' | 'low';
    extractionStrategy: string;
  }> {
    const prompt = `
Analyze this document content to determine if it contains financial data and how best to extract it.

CONTENT SAMPLE:
${content.substring(0, 2000)}

Respond in JSON format:
{
  "isFinancialDocument": true,
  "documentType": "10-K Annual Report",
  "quality": "high",
  "extractionStrategy": "Focus on consolidated statements section"
}
`;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      return JSON.parse(text);
    } catch (error) {
      return {
        isFinancialDocument: false,
        documentType: "unknown",
        quality: 'low',
        extractionStrategy: "manual review required"
      };
    }
  }
}

export const geminiService = new GeminiService();