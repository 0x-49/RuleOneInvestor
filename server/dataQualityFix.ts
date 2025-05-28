// Temporary fix for data quality issues
export function calculateReliableBigFourGrowth(metrics: any[]) {
  if (metrics.length < 2) return undefined;

  const sortedMetrics = metrics.sort((a: any, b: any) => parseInt(a.year) - parseInt(b.year));
  
  // Log data quality warning for insufficient years
  if (metrics.length < 10) {
    console.warn(`Data Quality Warning: Only ${metrics.length} years of data available. Rule One methodology requires 10 years for reliable analysis.`);
  }
  
  const calculateReliableCAGR = (endValue: number, startValue: number, years: number) => {
    if (startValue <= 0) return 0;
    
    const cagr = (Math.pow(endValue / startValue, 1 / years) - 1) * 100;
    
    // Cap unrealistic growth rates - anything over 200% indicates bad data
    if (Math.abs(cagr) > 200) {
      console.warn(`Data Quality Warning: Extreme growth rate of ${cagr.toFixed(1)}% detected. This indicates potential data quality issues. Capping at 200%.`);
      return cagr > 0 ? 200 : -200;
    }
    
    return cagr;
  };

  const years = sortedMetrics.length - 1;
  const first = sortedMetrics[0];
  const last = sortedMetrics[sortedMetrics.length - 1];

  return {
    salesGrowth: calculateReliableCAGR(last.revenue || 0, first.revenue || 1, years),
    epsGrowth: calculateReliableCAGR(last.eps || 0, first.eps || 1, years),
    equityGrowth: calculateReliableCAGR(last.bookValue || 0, first.bookValue || 1, years),
    fcfGrowth: calculateReliableCAGR(last.freeCashFlow || 0, first.freeCashFlow || 1, years),
  };
}