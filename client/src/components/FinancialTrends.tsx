import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts";
import { StockWithMetrics } from "@shared/schema";
import { motion } from "framer-motion";

interface FinancialTrendsProps {
  stockData?: StockWithMetrics;
  isLoading: boolean;
}

type MetricType = 'revenue' | 'earnings' | 'freeCashFlow' | 'bookValue';

// Helper function to format large numbers properly
const formatFinancialValue = (value: number) => {
  if (value === 0) return "$0";
  
  const absValue = Math.abs(value);
  
  if (absValue >= 1e12) {
    return `$${(value / 1e12).toFixed(1)}T`;
  } else if (absValue >= 1e9) {
    return `$${(value / 1e9).toFixed(1)}B`;
  } else if (absValue >= 1e6) {
    return `$${(value / 1e6).toFixed(1)}M`;
  } else if (absValue >= 1e3) {
    return `$${(value / 1e3).toFixed(1)}K`;
  } else {
    return `$${value.toFixed(0)}`;
  }
};

const metricConfigs = {
  revenue: {
    label: "Revenue",
    color: "#1E40AF",
    formatter: formatFinancialValue,
  },
  earnings: {
    label: "Earnings",
    color: "#059669",
    formatter: formatFinancialValue,
  },
  freeCashFlow: {
    label: "Free Cash Flow",
    color: "#F59E0B",
    formatter: formatFinancialValue,
  },
  bookValue: {
    label: "Book Value",
    color: "#8B5CF6",
    formatter: formatFinancialValue,
  },
};

export default function FinancialTrends({ stockData, isLoading }: FinancialTrendsProps) {
  const [selectedMetric, setSelectedMetric] = useState<MetricType>('revenue');

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>10-Year Financial Trends</span>
            <Skeleton className="h-9 w-32" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-80 w-full mb-4" />
          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-200">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="text-center">
                <Skeleton className="h-4 w-16 mx-auto mb-2" />
                <Skeleton className="h-6 w-12 mx-auto" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!stockData?.metrics || stockData.metrics.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>10-Year Financial Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-slate-600 dark:text-slate-400 py-8">
            No financial data available for trend analysis
          </div>
        </CardContent>
      </Card>
    );
  }

  const sortedMetrics = stockData.metrics.sort((a, b) => parseInt(a.year) - parseInt(b.year));
  
  const chartData = sortedMetrics.map(metric => ({
    year: metric.year,
    value: metric[selectedMetric] || 0,
  }));

  const config = metricConfigs[selectedMetric];
  
  // Calculate statistics
  const values = chartData.map(d => d.value).filter(v => v > 0);
  const cagr = values.length > 1 
    ? (Math.pow(values[values.length - 1] / values[0], 1 / (values.length - 1)) - 1) * 100
    : 0;
  
  const consistency = calculateConsistency(values);
  const latest = values[values.length - 1] || 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>10-Year Financial Trends</span>
          <Select value={selectedMetric} onValueChange={(value: MetricType) => setSelectedMetric(value)}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(metricConfigs).map(([key, config]) => (
                <SelectItem key={key} value={key}>
                  {config.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <motion.div 
          className="mb-4"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <ResponsiveContainer width="100%" height={320}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={config.color} stopOpacity={0.3}/>
                  <stop offset="95%" stopColor={config.color} stopOpacity={0.05}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis 
                dataKey="year" 
                stroke="#64748b"
                fontSize={12}
              />
              <YAxis 
                stroke="#64748b"
                fontSize={12}
                tickFormatter={config.formatter}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                }}
                formatter={(value: number) => [config.formatter(value), config.label]}
                animationDuration={200}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke={config.color}
                strokeWidth={3}
                fill="url(#colorGradient)"
                dot={{ 
                  fill: config.color, 
                  strokeWidth: 2, 
                  r: 5,
                  stroke: '#ffffff'
                }}
                activeDot={{ 
                  r: 8, 
                  stroke: config.color,
                  strokeWidth: 2,
                  fill: '#ffffff'
                }}
                animationDuration={1500}
              />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>
        
        {/* Key Statistics */}
        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-200 dark:border-slate-700">
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            whileHover={{ scale: 1.05 }}
          >
            <div className="text-sm text-slate-600 dark:text-slate-400">CAGR (10yr)</div>
            <motion.div 
              className="text-xl font-bold text-slate-900 dark:text-slate-100"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              {cagr.toFixed(1)}%
            </motion.div>
          </motion.div>
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            whileHover={{ scale: 1.05 }}
          >
            <div className="text-sm text-slate-600 dark:text-slate-400">Consistency</div>
            <motion.div 
              className="text-xl font-bold text-green-600 dark:text-green-400"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              {consistency}/10
            </motion.div>
          </motion.div>
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
            whileHover={{ scale: 1.05 }}
          >
            <div className="text-sm text-slate-600 dark:text-slate-400">Latest Year</div>
            <motion.div 
              className="text-xl font-bold text-slate-900 dark:text-slate-100"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              {config.formatter(latest)}
            </motion.div>
          </motion.div>
        </div>
      </CardContent>
    </Card>
  );
}

function calculateConsistency(values: number[]): number {
  if (values.length < 2) return 0;
  
  let positiveGrowthYears = 0;
  for (let i = 1; i < values.length; i++) {
    if (values[i] > values[i - 1]) {
      positiveGrowthYears++;
    }
  }
  
  return Math.round((positiveGrowthYears / (values.length - 1)) * 10);
}
