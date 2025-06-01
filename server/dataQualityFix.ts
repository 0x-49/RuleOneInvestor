// Fixed calculation functions for proper Rule One metrics

export function calculateReliableBigFourGrowth(metrics: any[]) {
  if (metrics.length < 2) return null;

  const sortedMetrics = metrics.sort((a, b) => parseInt(a.year) - parseInt(b.year));
  
  // Proper CAGR calculation with error handling
  const calculateCAGR = (endValue: number | null, startValue: number | null, years: number): number | null => {
    if (!endValue || !startValue || endValue <= 0 || startValue <= 0 || years <= 0) {
      return null;
    }
    
    const ratio = endValue / startValue;
    if (ratio <= 0) return null;
    
    const cagr = (Math.pow(ratio, 1 / years) - 1) * 100;
    
    // Cap at reasonable limits to prevent display issues
    if (cagr > 500 || cagr < -90) return null;
    
    return Math.round(cagr * 100) / 100; // Round to 2 decimal places
  };

  const years = sortedMetrics.length - 1;
  const first = sortedMetrics[0];
  const last = sortedMetrics[sortedMetrics.length - 1];

  return {
    salesGrowth: calculateCAGR(last.revenue, first.revenue, years),
    epsGrowth: calculateCAGR(last.eps, first.eps, years),
    equityGrowth: calculateCAGR(last.bookValue, first.bookValue, years),
    fcfGrowth: calculateCAGR(last.freeCashFlow, first.freeCashFlow, years),
  };
}