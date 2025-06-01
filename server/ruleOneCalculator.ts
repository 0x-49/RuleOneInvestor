import { FinancialMetrics } from "@shared/schema";

export interface RuleOneAnalysis {
  // Big Four Growth Rates (10-year CAGR)
  salesGrowth: number | null;
  epsGrowth: number | null;
  equityGrowth: number | null;
  fcfGrowth: number | null;
  
  // Rule One Quality Metrics
  roic: number | null;
  debtPayoffYears: number | null;
  
  // Valuation Metrics
  currentEPS: number | null;
  ruleOneGrowthRate: number | null;
  ruleOnePE: number | null;
  futureEPS: number | null;
  futureMarketPrice: number | null;
  stickerPrice: number | null;
  marginOfSafetyPrice: number | null;
  
  // Quality Assessment
  isExcellent: boolean;
  qualityScore: number;
  investmentStory: string;
}

export class RuleOneCalculator {
  private readonly MINIMUM_ACCEPTABLE_RETURN = 0.15; // 15%
  private readonly YEARS_TO_PROJECT = 10;
  private readonly MARGIN_OF_SAFETY = 0.5; // 50%
  
  /**
   * Calculate comprehensive Rule One analysis for a company
   */
  calculateRuleOneAnalysis(metrics: FinancialMetrics[], currentPrice: number): RuleOneAnalysis {
    if (metrics.length < 5) {
      return this.createEmptyAnalysis("Insufficient historical data (need at least 5 years)");
    }

    // Sort metrics by year to ensure chronological order
    const sortedMetrics = metrics.sort((a, b) => parseInt(a.year) - parseInt(b.year));
    const latestMetrics = sortedMetrics[sortedMetrics.length - 1];
    
    // Calculate Big Four Growth Rates (10-year CAGR)
    const salesGrowth = this.calculateCAGR(sortedMetrics, 'revenue');
    const epsGrowth = this.calculateCAGR(sortedMetrics, 'eps');
    const equityGrowth = this.calculateCAGR(sortedMetrics, 'bookValue');
    const fcfGrowth = this.calculateCAGR(sortedMetrics, 'freeCashFlow');
    
    // Rule One Quality Metrics
    const roic = latestMetrics.roic;
    const debtPayoffYears = this.calculateDebtPayoffYears(latestMetrics);
    
    // Determine Rule One Growth Rate (most conservative of Big Four)
    const bigFourRates = [salesGrowth, epsGrowth, equityGrowth, fcfGrowth].filter(rate => rate !== null);
    const ruleOneGrowthRate = bigFourRates.length > 0 ? Math.min(...bigFourRates) : null;
    
    // Calculate valuation metrics
    const currentEPS = latestMetrics.eps;
    let futureEPS: number | null = null;
    let futureMarketPrice: number | null = null;
    let stickerPrice: number | null = null;
    let marginOfSafetyPrice: number | null = null;
    let ruleOnePE: number | null = null;
    
    if (currentEPS && ruleOneGrowthRate && ruleOneGrowthRate > 0) {
      // Calculate Rule One PE (conservative approach)
      const defaultPE = Math.min(ruleOneGrowthRate * 2, 40); // Cap at 40 for safety
      const historicalPE = this.estimateHistoricalPE(currentPrice, currentEPS);
      ruleOnePE = Math.min(defaultPE, historicalPE || defaultPE);
      
      // Calculate future EPS (10 years out)
      futureEPS = currentEPS * Math.pow(1 + ruleOneGrowthRate / 100, this.YEARS_TO_PROJECT);
      
      // Calculate future market price
      futureMarketPrice = futureEPS * ruleOnePE;
      
      // Calculate sticker price (present value with 15% required return)
      stickerPrice = futureMarketPrice / Math.pow(1 + this.MINIMUM_ACCEPTABLE_RETURN, this.YEARS_TO_PROJECT);
      
      // Calculate margin of safety price (50% off sticker price)
      marginOfSafetyPrice = stickerPrice * this.MARGIN_OF_SAFETY;
    }
    
    // Assess quality and create investment story
    const isExcellent = this.assessQuality(salesGrowth, epsGrowth, equityGrowth, fcfGrowth, roic, debtPayoffYears);
    const qualityScore = this.calculateQualityScore(salesGrowth, epsGrowth, equityGrowth, fcfGrowth, roic, debtPayoffYears);
    const investmentStory = this.generateInvestmentStory({
      salesGrowth, epsGrowth, equityGrowth, fcfGrowth, roic, debtPayoffYears,
      isExcellent, stickerPrice, marginOfSafetyPrice, currentPrice
    });
    
    return {
      salesGrowth,
      epsGrowth,
      equityGrowth,
      fcfGrowth,
      roic,
      debtPayoffYears,
      currentEPS,
      ruleOneGrowthRate,
      ruleOnePE,
      futureEPS,
      futureMarketPrice,
      stickerPrice,
      marginOfSafetyPrice,
      isExcellent,
      qualityScore,
      investmentStory
    };
  }
  
  /**
   * Calculate Compound Annual Growth Rate for a specific metric
   */
  private calculateCAGR(metrics: FinancialMetrics[], field: keyof FinancialMetrics): number | null {
    const validMetrics = metrics.filter(m => m[field] !== null && m[field] !== undefined && (m[field] as number) > 0);
    
    if (validMetrics.length < 2) return null;
    
    const firstValue = validMetrics[0][field] as number;
    const lastValue = validMetrics[validMetrics.length - 1][field] as number;
    const years = validMetrics.length - 1;
    
    if (firstValue <= 0 || lastValue <= 0 || years <= 0) return null;
    
    const cagr = (Math.pow(lastValue / firstValue, 1 / years) - 1) * 100;
    return Math.round(cagr * 100) / 100; // Round to 2 decimal places
  }
  
  /**
   * Calculate debt payoff years using free cash flow
   */
  private calculateDebtPayoffYears(latestMetrics: FinancialMetrics): number | null {
    const debt = latestMetrics.debt;
    const fcf = latestMetrics.freeCashFlow;
    
    if (!debt || !fcf || debt <= 0 || fcf <= 0) return 0; // No debt or no FCF data
    
    return Math.round((debt / fcf) * 100) / 100;
  }
  
  /**
   * Estimate historical PE ratio
   */
  private estimateHistoricalPE(currentPrice: number, currentEPS: number): number | null {
    if (!currentEPS || currentEPS <= 0) return null;
    return Math.round((currentPrice / currentEPS) * 100) / 100;
  }
  
  /**
   * Assess if company meets Rule One quality criteria
   */
  private assessQuality(
    salesGrowth: number | null,
    epsGrowth: number | null,
    equityGrowth: number | null,
    fcfGrowth: number | null,
    roic: number | null,
    debtPayoffYears: number | null
  ): boolean {
    // Rule One criteria: Big Four should all be >= 10%, ROIC >= 10%, Debt payoff <= 3 years
    const bigFourGood = [salesGrowth, epsGrowth, equityGrowth, fcfGrowth]
      .filter(rate => rate !== null)
      .every(rate => rate >= 10);
    
    const roicGood = roic === null || roic >= 10;
    const debtGood = debtPayoffYears === null || debtPayoffYears <= 3;
    
    return bigFourGood && roicGood && debtGood;
  }
  
  /**
   * Calculate overall quality score (0-100)
   */
  private calculateQualityScore(
    salesGrowth: number | null,
    epsGrowth: number | null,
    equityGrowth: number | null,
    fcfGrowth: number | null,
    roic: number | null,
    debtPayoffYears: number | null
  ): number {
    let score = 0;
    let maxScore = 0;
    
    // Big Four scoring (60 points total - 15 each)
    const bigFour = [salesGrowth, epsGrowth, equityGrowth, fcfGrowth];
    bigFour.forEach(rate => {
      maxScore += 15;
      if (rate !== null) {
        if (rate >= 20) score += 15;      // Excellent
        else if (rate >= 15) score += 12; // Very Good
        else if (rate >= 10) score += 9;  // Good
        else if (rate >= 5) score += 6;   // Fair
        else if (rate >= 0) score += 3;   // Poor
      }
    });
    
    // ROIC scoring (25 points)
    maxScore += 25;
    if (roic !== null) {
      if (roic >= 25) score += 25;       // Excellent
      else if (roic >= 20) score += 20;  // Very Good
      else if (roic >= 15) score += 15;  // Good
      else if (roic >= 10) score += 10;  // Fair
      else if (roic >= 5) score += 5;    // Poor
    }
    
    // Debt scoring (15 points)
    maxScore += 15;
    if (debtPayoffYears !== null) {
      if (debtPayoffYears <= 1) score += 15;      // Excellent
      else if (debtPayoffYears <= 2) score += 12; // Very Good
      else if (debtPayoffYears <= 3) score += 9;  // Good
      else if (debtPayoffYears <= 5) score += 6;  // Fair
      else score += 3;                            // Poor
    } else {
      score += 15; // No debt is excellent
    }
    
    return Math.round((score / maxScore) * 100);
  }
  
  /**
   * Generate investment story and analysis
   */
  private generateInvestmentStory(data: {
    salesGrowth: number | null;
    epsGrowth: number | null;
    equityGrowth: number | null;
    fcfGrowth: number | null;
    roic: number | null;
    debtPayoffYears: number | null;
    isExcellent: boolean;
    stickerPrice: number | null;
    marginOfSafetyPrice: number | null;
    currentPrice: number;
  }): string {
    const story = [];
    
    // Quality Assessment
    if (data.isExcellent) {
      story.push("🟢 **Excellent Company**: This company meets Phil Town's Rule One criteria for a 'wonderful business' with consistent growth across all key metrics.");
    } else {
      story.push("🟡 **Caution Required**: This company does not fully meet Rule One quality standards. Consider the risks carefully.");
    }
    
    // Big Four Analysis
    const bigFour = [
      { name: 'Sales Growth', value: data.salesGrowth, symbol: '📈' },
      { name: 'EPS Growth', value: data.epsGrowth, symbol: '💰' },
      { name: 'Equity Growth', value: data.equityGrowth, symbol: '🏛️' },
      { name: 'FCF Growth', value: data.fcfGrowth, symbol: '💵' }
    ];
    
    story.push("\n**Big Four Growth Analysis:**");
    bigFour.forEach(metric => {
      if (metric.value !== null) {
        const status = metric.value >= 10 ? '✅' : '❌';
        story.push(`${status} ${metric.symbol} ${metric.name}: ${metric.value.toFixed(1)}% annually`);
      }
    });
    
    // ROIC Analysis
    if (data.roic !== null) {
      const roicStatus = data.roic >= 10 ? '✅' : '❌';
      story.push(`\n${roicStatus} **Return on Invested Capital**: ${data.roic.toFixed(1)}% (Rule One target: ≥10%)`);
    }
    
    // Debt Analysis
    if (data.debtPayoffYears !== null && data.debtPayoffYears > 0) {
      const debtStatus = data.debtPayoffYears <= 3 ? '✅' : '❌';
      story.push(`${debtStatus} **Debt Payoff Time**: ${data.debtPayoffYears.toFixed(1)} years (Rule One target: ≤3 years)`);
    } else {
      story.push(`✅ **Debt**: Minimal or no long-term debt`);
    }
    
    // Valuation Analysis
    if (data.stickerPrice && data.marginOfSafetyPrice) {
      story.push(`\n**Rule One Valuation:**`);
      story.push(`💎 **Sticker Price** (Fair Value): $${data.stickerPrice.toFixed(2)}`);
      story.push(`🛡️ **Margin of Safety Price**: $${data.marginOfSafetyPrice.toFixed(2)}`);
      story.push(`📊 **Current Price**: $${data.currentPrice.toFixed(2)}`);
      
      if (data.currentPrice <= data.marginOfSafetyPrice) {
        story.push(`🎯 **Buy Signal**: Current price is at or below margin of safety! Excellent buying opportunity.`);
      } else if (data.currentPrice <= data.stickerPrice) {
        story.push(`⚠️ **Fair Value**: Current price is between margin of safety and sticker price. Proceed with caution.`);
      } else {
        story.push(`🔴 **Overvalued**: Current price exceeds fair value. Wait for a better entry point.`);
      }
    }
    
    return story.join('\n');
  }
  
  /**
   * Create empty analysis for companies with insufficient data
   */
  private createEmptyAnalysis(reason: string): RuleOneAnalysis {
    return {
      salesGrowth: null,
      epsGrowth: null,
      equityGrowth: null,
      fcfGrowth: null,
      roic: null,
      debtPayoffYears: null,
      currentEPS: null,
      ruleOneGrowthRate: null,
      ruleOnePE: null,
      futureEPS: null,
      futureMarketPrice: null,
      stickerPrice: null,
      marginOfSafetyPrice: null,
      isExcellent: false,
      qualityScore: 0,
      investmentStory: `❌ **Analysis Unavailable**: ${reason}`
    };
  }
}

export const ruleOneCalculator = new RuleOneCalculator();