import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { TrendingUp, DollarSign, BarChart3, PiggyBank, Info } from "lucide-react";
import { Tooltip as UITooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { StockWithMetrics } from "@shared/schema";

interface BigFourMetricsProps {
  stockData?: StockWithMetrics;
  isLoading: boolean;
}

export default function BigFourMetrics({ stockData, isLoading }: BigFourMetricsProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>The Big Four Growth Rates</span>
            <Skeleton className="h-4 w-24" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 mb-6">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-24" />
            ))}
          </div>
          <Skeleton className="h-64 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (!stockData?.metrics || stockData.metrics.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>The Big Four Growth Rates</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-slate-600 dark:text-slate-400 py-8">
            No financial data available for this stock
          </div>
        </CardContent>
      </Card>
    );
  }

  const { bigFourGrowth } = stockData;

  // Prepare chart data
  const chartData = stockData.metrics.map((metric) => ({
    year: metric.year,
    salesGrowth: calculateYearOverYearGrowth(stockData.metrics!, metric.year, 'revenue'),
    epsGrowth: calculateYearOverYearGrowth(stockData.metrics!, metric.year, 'eps'),
    equityGrowth: calculateYearOverYearGrowth(stockData.metrics!, metric.year, 'bookValue'),
    fcfGrowth: calculateYearOverYearGrowth(stockData.metrics!, metric.year, 'freeCashFlow'),
  })).filter(item => item.salesGrowth !== null);

  const metrics = [
    {
      title: "Sales Growth",
      value: bigFourGrowth?.salesGrowth || 0,
      icon: TrendingUp,
      color: "text-green-600",
      bgColor: "from-green-500/10 to-green-500/5 border-green-500/20",
    },
    {
      title: "EPS Growth",
      value: bigFourGrowth?.epsGrowth || 0,
      icon: DollarSign,
      color: "text-green-600",
      bgColor: "from-green-500/10 to-green-500/5 border-green-500/20",
    },
    {
      title: "Equity Growth",
      value: bigFourGrowth?.equityGrowth || 0,
      icon: BarChart3,
      color: "text-green-600",
      bgColor: "from-green-500/10 to-green-500/5 border-green-500/20",
    },
    {
      title: "FCF Growth",
      value: bigFourGrowth?.fcfGrowth || 0,
      icon: PiggyBank,
      color: "text-green-600",
      bgColor: "from-green-500/10 to-green-500/5 border-green-500/20",
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>The Big Four Growth Rates</span>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-slate-600 dark:text-slate-400">10-Year Average</span>
            <UITooltip>
              <TooltipTrigger>
                <Info className="h-4 w-4 text-slate-400" />
              </TooltipTrigger>
              <TooltipContent className="w-64">
                <p>Rule One focuses on businesses growing consistently in all four areas</p>
              </TooltipContent>
            </UITooltip>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 mb-6">
          {metrics.map((metric, index) => {
            const Icon = metric.icon;
            return (
              <div
                key={index}
                className={`bg-gradient-to-r ${metric.bgColor} rounded-lg p-4 border`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    {metric.title}
                  </span>
                  <Icon className={`h-5 w-5 ${metric.color}`} />
                </div>
                <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                  {metric.value.toFixed(1)}%
                </div>
                <div className="text-xs text-green-600 dark:text-green-400 font-medium">
                  Target: &gt;10%
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Chart */}
        <div className="mt-6">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis 
                dataKey="year" 
                stroke="#64748b"
                fontSize={12}
              />
              <YAxis 
                stroke="#64748b"
                fontSize={12}
                tickFormatter={(value) => `${value}%`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                }}
                formatter={(value: number) => [`${value.toFixed(1)}%`, '']}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="salesGrowth"
                stroke="#059669"
                strokeWidth={2}
                name="Sales Growth"
                dot={{ fill: '#059669', strokeWidth: 2, r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="epsGrowth"
                stroke="#1E40AF"
                strokeWidth={2}
                name="EPS Growth"
                dot={{ fill: '#1E40AF', strokeWidth: 2, r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="equityGrowth"
                stroke="#F59E0B"
                strokeWidth={2}
                name="Equity Growth"
                dot={{ fill: '#F59E0B', strokeWidth: 2, r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="fcfGrowth"
                stroke="#8B5CF6"
                strokeWidth={2}
                name="FCF Growth"
                dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

function calculateYearOverYearGrowth(
  metrics: any[],
  currentYear: string,
  field: string
): number | null {
  const currentIndex = metrics.findIndex(m => m.year === currentYear);
  const previousIndex = currentIndex - 1;
  
  if (previousIndex < 0) return null;
  
  const current = metrics[currentIndex]?.[field];
  const previous = metrics[previousIndex]?.[field];
  
  if (!current || !previous || previous <= 0) return null;
  
  return ((current - previous) / previous) * 100;
}
