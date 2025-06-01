import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Treemap, ResponsiveContainer, Cell, PieChart, Pie, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { Shield, TrendingUp, TrendingDown, AlertTriangle, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

interface BalanceSheetData {
  year: string;
  totalAssets: number;
  currentAssets: number;
  totalLiabilities: number;
  currentLiabilities: number;
  longTermDebt: number;
  totalEquity: number;
  cashAndEquivalents: number;
}

interface Props {
  symbol: string;
  currentData: BalanceSheetData;
  historicalData: BalanceSheetData[];
}

export default function BalanceSheetHealth({ symbol, currentData, historicalData }: Props) {
  // Calculate key financial health ratios
  const currentRatio = currentData.currentAssets / currentData.currentLiabilities;
  const debtToEquity = currentData.longTermDebt / currentData.totalEquity;
  const assetCoverage = currentData.currentAssets / currentData.totalLiabilities;
  const cashRatio = currentData.cashAndEquivalents / currentData.currentLiabilities;

  // Determine health status
  const getHealthStatus = (ratio: number, thresholds: { good: number; warning: number }) => {
    if (ratio >= thresholds.good) {
      return { status: "Excellent", color: "text-green-600", bg: "bg-green-50", icon: CheckCircle };
    } else if (ratio >= thresholds.warning) {
      return { status: "Good", color: "text-amber-600", bg: "bg-amber-50", icon: Shield };
    } else {
      return { status: "Concern", color: "text-red-600", bg: "bg-red-50", icon: AlertTriangle };
    }
  };

  const currentRatioStatus = getHealthStatus(currentRatio, { good: 2.0, warning: 1.2 });
  const debtStatus = getHealthStatus(1/debtToEquity, { good: 2.0, warning: 1.0 }); // Inverted for debt
  const cashStatus = getHealthStatus(cashRatio, { good: 0.5, warning: 0.2 });

  // Prepare treemap data for balance sheet visualization
  const treemapData = [
    {
      name: "Assets",
      children: [
        { name: "Current Assets", size: currentData.currentAssets, color: "#10b981" },
        { name: "Fixed Assets", size: currentData.totalAssets - currentData.currentAssets, color: "#06b6d4" },
      ]
    },
    {
      name: "Liabilities & Equity",
      children: [
        { name: "Current Liabilities", size: currentData.currentLiabilities, color: "#ef4444" },
        { name: "Long-term Debt", size: currentData.longTermDebt, color: "#f97316" },
        { name: "Shareholders' Equity", size: currentData.totalEquity, color: "#8b5cf6" },
      ]
    }
  ];

  // Prepare debt trend data
  const debtTrendData = historicalData.map(data => ({
    year: data.year,
    debtToEquity: (data.longTermDebt / data.totalEquity) * 100,
    currentRatio: data.currentAssets / data.currentLiabilities,
    cashRatio: (data.cashAndEquivalents / data.currentLiabilities) * 100
  }));

  return (
    <div className="space-y-6">
      {/* Financial Health Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5" />
            <span>Balance Sheet Health Analysis</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Key Health Indicators */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <motion.div 
              className={`p-4 rounded-lg border ${currentRatioStatus.bg}`}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-gray-800">Current Ratio</span>
                <currentRatioStatus.icon className={`h-5 w-5 ${currentRatioStatus.color}`} />
              </div>
              <div className="text-2xl font-bold text-gray-900">{currentRatio.toFixed(2)}</div>
              <div className={`text-sm ${currentRatioStatus.color}`}>{currentRatioStatus.status}</div>
              <Progress value={Math.min(currentRatio * 50, 100)} className="mt-2" />
            </motion.div>

            <motion.div 
              className={`p-4 rounded-lg border ${debtStatus.bg}`}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-gray-800">Debt/Equity</span>
                <debtStatus.icon className={`h-5 w-5 ${debtStatus.color}`} />
              </div>
              <div className="text-2xl font-bold text-gray-900">{debtToEquity.toFixed(2)}</div>
              <div className={`text-sm ${debtStatus.color}`}>{debtStatus.status}</div>
              <Progress value={Math.max(100 - (debtToEquity * 100), 0)} className="mt-2" />
            </motion.div>

            <motion.div 
              className={`p-4 rounded-lg border ${cashStatus.bg}`}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-gray-800">Cash Ratio</span>
                <cashStatus.icon className={`h-5 w-5 ${cashStatus.color}`} />
              </div>
              <div className="text-2xl font-bold text-gray-900">{cashRatio.toFixed(2)}</div>
              <div className={`text-sm ${cashStatus.color}`}>{cashStatus.status}</div>
              <Progress value={Math.min(cashRatio * 200, 100)} className="mt-2" />
            </motion.div>
          </div>

          {/* Financial Health Summary */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="font-semibold text-gray-800 mb-3">Financial Health Assessment</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="font-medium text-gray-700">Liquidity Analysis:</p>
                <p className="text-gray-600">
                  • Current assets can cover current liabilities {currentRatio.toFixed(1)}x
                </p>
                <p className="text-gray-600">
                  • Cash covers {(cashRatio * 100).toFixed(0)}% of short-term obligations
                </p>
              </div>
              <div>
                <p className="font-medium text-gray-700">Debt Management:</p>
                <p className="text-gray-600">
                  • Debt-to-equity ratio of {(debtToEquity * 100).toFixed(0)}% indicates {debtToEquity < 0.3 ? 'conservative' : debtToEquity < 0.6 ? 'moderate' : 'aggressive'} leverage
                </p>
                <p className="text-gray-600">
                  • Total assets cover liabilities {assetCoverage.toFixed(1)}x
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Balance Sheet Composition */}
      <Card>
        <CardHeader>
          <CardTitle>Balance Sheet Composition</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Assets Breakdown */}
            <div>
              <h4 className="font-semibold text-gray-800 mb-3">Assets Structure</h4>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[
                        { name: "Current Assets", value: currentData.currentAssets, fill: "#10b981" },
                        { name: "Fixed Assets", value: currentData.totalAssets - currentData.currentAssets, fill: "#06b6d4" }
                      ]}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    />
                    <Tooltip formatter={(value) => [`$${(Number(value) / 1e9).toFixed(1)}B`, '']} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Liabilities & Equity Breakdown */}
            <div>
              <h4 className="font-semibold text-gray-800 mb-3">Liabilities & Equity</h4>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[
                        { name: "Current Liabilities", value: currentData.currentLiabilities, fill: "#ef4444" },
                        { name: "Long-term Debt", value: currentData.longTermDebt, fill: "#f97316" },
                        { name: "Shareholders' Equity", value: currentData.totalEquity, fill: "#8b5cf6" }
                      ]}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    />
                    <Tooltip formatter={(value) => [`$${(Number(value) / 1e9).toFixed(1)}B`, '']} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Historical Trends */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5" />
            <span>Financial Health Trends</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={debtTrendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip 
                  formatter={(value, name) => [
                    name === 'debtToEquity' ? `${Number(value).toFixed(1)}%` :
                    name === 'cashRatio' ? `${Number(value).toFixed(1)}%` :
                    Number(value).toFixed(2),
                    name === 'debtToEquity' ? 'Debt/Equity %' :
                    name === 'cashRatio' ? 'Cash Ratio %' :
                    'Current Ratio'
                  ]}
                />
                <Legend />
                <Line 
                  yAxisId="left"
                  type="monotone" 
                  dataKey="currentRatio" 
                  stroke="#10b981" 
                  strokeWidth={3}
                  name="Current Ratio"
                  dot={{ fill: "#10b981", strokeWidth: 2, r: 4 }}
                />
                <Line 
                  yAxisId="right"
                  type="monotone" 
                  dataKey="debtToEquity" 
                  stroke="#ef4444" 
                  strokeWidth={2}
                  name="Debt/Equity %"
                  dot={{ fill: "#ef4444", strokeWidth: 2, r: 3 }}
                />
                <Line 
                  yAxisId="right"
                  type="monotone" 
                  dataKey="cashRatio" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  name="Cash Ratio %"
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Key Metrics Summary */}
          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="p-3 bg-green-50 rounded-lg">
              <div className="text-lg font-bold text-green-600">
                {((currentData.currentAssets / currentData.currentLiabilities) * 100).toFixed(0)}%
              </div>
              <div className="text-sm text-gray-600">Liquidity Coverage</div>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <div className="text-lg font-bold text-blue-600">
                ${(currentData.cashAndEquivalents / 1e9).toFixed(1)}B
              </div>
              <div className="text-sm text-gray-600">Cash Reserves</div>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg">
              <div className="text-lg font-bold text-purple-600">
                {((currentData.totalEquity / currentData.totalAssets) * 100).toFixed(0)}%
              </div>
              <div className="text-sm text-gray-600">Equity Ratio</div>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="text-lg font-bold text-gray-600">
                {debtTrendData.length > 1 && debtTrendData[debtTrendData.length - 1].debtToEquity < debtTrendData[0].debtToEquity ? 
                  'Improving' : 'Stable'}
              </div>
              <div className="text-sm text-gray-600">Debt Trend</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}