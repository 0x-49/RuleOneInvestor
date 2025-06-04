import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface FinancialMetrics {
  year: string;
  revenue: number | null;
  earnings: number | null;
  freeCashFlow: number | null;
  bookValue: number | null;
  eps: number | null;
  roic: number | null;
  debt: number | null;
}

interface Props {
  metrics: FinancialMetrics[];
  metricType: 'revenue' | 'earnings' | 'freeCashFlow' | 'bookValue' | 'eps';
  title: string;
  unit: string;
  growthRate: number | null;
}

export default function DetailedFinancialTable({ metrics, metricType, title, unit, growthRate }: Props) {
  // Filter and sort metrics by year
  const sortedMetrics = metrics
    .filter(m => m[metricType] !== null && m[metricType] !== undefined)
    .sort((a, b) => parseInt(a.year) - parseInt(b.year));

  // Calculate year-over-year growth rates
  const dataWithGrowth = sortedMetrics.map((metric, index) => {
    const currentValue = metric[metricType] as number;
    const previousValue = index > 0 ? (sortedMetrics[index - 1][metricType] as number) : null;
    const yoyGrowth = previousValue && previousValue > 0 
      ? ((currentValue - previousValue) / previousValue) * 100 
      : null;

    return {
      ...metric,
      value: currentValue,
      yoyGrowth
    };
  });

  // Calculate averages
  const values = dataWithGrowth.map(d => d.value);
  const growthRates = dataWithGrowth.map(d => d.yoyGrowth).filter(g => g !== null) as number[];
  
  const average = values.length > 0 ? values.reduce((sum, val) => sum + val, 0) / values.length : 0;
  const avgGrowthRate = growthRates.length > 0 ? growthRates.reduce((sum, val) => sum + val, 0) / growthRates.length : 0;
  const maxValue = Math.max(...values);
  const minValue = Math.min(...values);

  const formatValue = (value: number) => {
    if (metricType === 'eps') {
      return `$${value.toFixed(2)}`;
    } else if (value >= 1e9) {
      return `$${(value / 1e9).toFixed(1)}B`;
    } else if (value >= 1e6) {
      return `$${(value / 1e6).toFixed(1)}M`;
    } else {
      return `$${value.toFixed(1)}`;
    }
  };

  const formatGrowth = (growth: number | null) => {
    if (growth === null) return 'N/A';
    return `${growth > 0 ? '+' : ''}${growth.toFixed(1)}%`;
  };

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle className="text-lg">{title} - Historical Data & Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Summary Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="text-center">
            <div className="text-lg font-bold text-blue-600">{formatValue(average)}</div>
            <div className="text-xs text-gray-600">Average {unit}</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-green-600">{formatValue(maxValue)}</div>
            <div className="text-xs text-gray-600">Maximum</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-orange-600">{formatValue(minValue)}</div>
            <div className="text-xs text-gray-600">Minimum</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-purple-600">{formatGrowth(avgGrowthRate)}</div>
            <div className="text-xs text-gray-600">Avg YoY Growth</div>
          </div>
          <div className="text-center">
            <div className={`text-lg font-bold ${(growthRate || 0) >= 10 ? 'text-green-600' : 'text-red-600'}`}>
              {formatGrowth(growthRate)}
            </div>
            <div className="text-xs text-gray-600">10Y CAGR</div>
          </div>
        </div>

        {/* Detailed Year-by-Year Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="text-left p-3 font-semibold">Year</th>
                <th className="text-right p-3 font-semibold">{title}</th>
                <th className="text-right p-3 font-semibold">YoY Growth</th>
                <th className="text-right p-3 font-semibold">vs Average</th>
                <th className="text-center p-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {dataWithGrowth.map((data, index) => {
                const vsAverage = ((data.value - average) / average) * 100;
                const isAboveAverage = data.value > average;
                const isGrowthPositive = (data.yoyGrowth || 0) > 0;
                
                return (
                  <tr key={`${data.year}-${index}`} className={`border-b hover:bg-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-25'}`}>
                    <td className="p-3 font-medium">{data.year}</td>
                    <td className="text-right p-3 font-mono">{formatValue(data.value)}</td>
                    <td className={`text-right p-3 font-mono ${isGrowthPositive ? 'text-green-600' : 'text-red-600'}`}>
                      {formatGrowth(data.yoyGrowth)}
                    </td>
                    <td className={`text-right p-3 font-mono ${isAboveAverage ? 'text-green-600' : 'text-red-600'}`}>
                      {vsAverage > 0 ? '+' : ''}{vsAverage.toFixed(1)}%
                    </td>
                    <td className="text-center p-3">
                      {data.yoyGrowth !== null && (
                        <Badge variant={data.yoyGrowth >= 10 ? "default" : data.yoyGrowth >= 0 ? "secondary" : "destructive"}>
                          {data.yoyGrowth >= 10 ? "Excellent" : data.yoyGrowth >= 0 ? "Positive" : "Declining"}
                        </Badge>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Rule One Assessment */}
        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-semibold text-blue-900">Rule One Assessment</div>
              <div className="text-sm text-blue-700">
                Phil Town recommends ≥10% annual growth for {title.toLowerCase()}
              </div>
            </div>
            <div className="text-right">
              <Badge variant={(growthRate || 0) >= 10 ? "default" : "destructive"} className="text-lg px-4 py-2">
                {(growthRate || 0) >= 10 ? "PASSES" : "FAILS"}
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}