import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { TrendingUp, DollarSign, BarChart3, PiggyBank, Info } from "lucide-react";
import { Tooltip as UITooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { StockWithMetrics } from "@shared/schema";

interface BigFourMetricsProps {
  stockData?: StockWithMetrics;
  isLoading: boolean;
}

export default function BigFourMetrics({ stockData, isLoading }: BigFourMetricsProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<'10year' | '5year' | '1year'>('10year');
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
              <Skeleton key={i} className="h-32" />
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

  // Calculate different time period averages
  const calculatePeriodAverages = (metrics: any[], field: string, years: number) => {
    const recentMetrics = metrics.slice(-years);
    const growthRates = recentMetrics.map((metric, index) => {
      if (index === 0) return null;
      const currentValue = metric[field];
      const previousValue = recentMetrics[index - 1][field];
      if (!currentValue || !previousValue || previousValue <= 0) return null;
      return ((currentValue - previousValue) / previousValue) * 100;
    }).filter(rate => rate !== null);
    
    return growthRates.length > 0 
      ? growthRates.reduce((sum, rate) => sum + rate, 0) / growthRates.length 
      : 0;
  };

  const tenYearAverages = {
    salesGrowth: calculatePeriodAverages(stockData.metrics, 'revenue', 10),
    epsGrowth: calculatePeriodAverages(stockData.metrics, 'eps', 10),
    equityGrowth: calculatePeriodAverages(stockData.metrics, 'bookValue', 10),
    fcfGrowth: calculatePeriodAverages(stockData.metrics, 'freeCashFlow', 10),
  };

  const fiveYearAverages = {
    salesGrowth: calculatePeriodAverages(stockData.metrics, 'revenue', 5),
    epsGrowth: calculatePeriodAverages(stockData.metrics, 'eps', 5),
    equityGrowth: calculatePeriodAverages(stockData.metrics, 'bookValue', 5),
    fcfGrowth: calculatePeriodAverages(stockData.metrics, 'freeCashFlow', 5),
  };

  const oneYearAverages = {
    salesGrowth: calculatePeriodAverages(stockData.metrics, 'revenue', 2),
    epsGrowth: calculatePeriodAverages(stockData.metrics, 'eps', 2),
    equityGrowth: calculatePeriodAverages(stockData.metrics, 'bookValue', 2),
    fcfGrowth: calculatePeriodAverages(stockData.metrics, 'freeCashFlow', 2),
  };

  // Prepare chart data for ALL years (not filtered)
  const chartData = stockData.metrics?.map((metric, index) => {
    if (index === 0) return null;
    
    const previousMetric = stockData.metrics![index - 1];
    
    const salesGrowth = metric.revenue && previousMetric.revenue && previousMetric.revenue > 0
      ? ((metric.revenue - previousMetric.revenue) / previousMetric.revenue) * 100
      : 0;
      
    const epsGrowth = metric.eps && previousMetric.eps && previousMetric.eps > 0
      ? ((metric.eps - previousMetric.eps) / previousMetric.eps) * 100
      : 0;
      
    const equityGrowth = metric.bookValue && previousMetric.bookValue && previousMetric.bookValue > 0
      ? ((metric.bookValue - previousMetric.bookValue) / previousMetric.bookValue) * 100
      : 0;
      
    const fcfGrowth = metric.freeCashFlow && previousMetric.freeCashFlow && previousMetric.freeCashFlow > 0
      ? ((metric.freeCashFlow - previousMetric.freeCashFlow) / previousMetric.freeCashFlow) * 100
      : 0;

    return {
      year: metric.year,
      salesGrowth,
      epsGrowth,
      equityGrowth,
      fcfGrowth,
    };
  }).filter(item => item !== null) || [];

  // Select which averages to display based on selected period
  const currentAverages = selectedPeriod === '10year' ? tenYearAverages :
                         selectedPeriod === '5year' ? fiveYearAverages : 
                         oneYearAverages;

  const metrics = [
    {
      title: "Sales Growth",
      value: currentAverages.salesGrowth,
      tenYear: tenYearAverages.salesGrowth,
      fiveYear: fiveYearAverages.salesGrowth,
      oneYear: oneYearAverages.salesGrowth,
      icon: TrendingUp,
      color: "text-green-600",
      bgColor: "from-green-500/10 to-green-500/5 border-green-500/20",
    },
    {
      title: "EPS Growth",
      value: currentAverages.epsGrowth,
      tenYear: tenYearAverages.epsGrowth,
      fiveYear: fiveYearAverages.epsGrowth,
      oneYear: oneYearAverages.epsGrowth,
      icon: DollarSign,
      color: "text-green-600",
      bgColor: "from-green-500/10 to-green-500/5 border-green-500/20",
    },
    {
      title: "Equity Growth",
      value: currentAverages.equityGrowth,
      tenYear: tenYearAverages.equityGrowth,
      fiveYear: fiveYearAverages.equityGrowth,
      oneYear: oneYearAverages.equityGrowth,
      icon: BarChart3,
      color: "text-green-600",
      bgColor: "from-green-500/10 to-green-500/5 border-green-500/20",
    },
    {
      title: "FCF Growth",
      value: currentAverages.fcfGrowth,
      tenYear: tenYearAverages.fcfGrowth,
      fiveYear: fiveYearAverages.fcfGrowth,
      oneYear: oneYearAverages.fcfGrowth,
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
            <Select value={selectedPeriod} onValueChange={(value: '10year' | '5year' | '1year') => setSelectedPeriod(value)}>
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10year">10-Year Avg</SelectItem>
                <SelectItem value="5year">5-Year Avg</SelectItem>
                <SelectItem value="1year">1-Year Avg</SelectItem>
              </SelectContent>
            </Select>
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
                <div className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
                  <div className="flex justify-between">
                    <span>10Y:</span>
                    <span className="font-medium">{metric.tenYear.toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>5Y:</span>
                    <span className="font-medium">{metric.fiveYear.toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>1Y:</span>
                    <span className="font-medium">{metric.oneYear.toFixed(1)}%</span>
                  </div>
                  <div className="text-green-600 dark:text-green-400 font-medium pt-1">
                    Target: &gt;10%
                  </div>
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
