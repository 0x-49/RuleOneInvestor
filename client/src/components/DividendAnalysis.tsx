import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from "recharts";
import { DollarSign, TrendingUp, Calendar, Percent } from "lucide-react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";

interface DividendData {
  exDividendDate: string;
  paymentDate: string;
  recordDate: string;
  declaredDate: string;
  amount: number;
}

interface Props {
  symbol: string;
}

export default function DividendAnalysis({ symbol }: Props) {
  // Fetch dividend data from Alpha Vantage
  const { data: dividendData, isLoading } = useQuery({
    queryKey: ['/api/dividends', symbol],
    enabled: !!symbol,
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <DollarSign className="h-5 w-5" />
            <span>Dividend Analysis</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="h-6 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-64 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!dividendData || dividendData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <DollarSign className="h-5 w-5" />
            <span>Dividend Analysis</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <DollarSign className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No dividend data available for {symbol}</p>
            <p className="text-sm text-gray-500 mt-2">This company may not pay dividends</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Process dividend data
  const sortedDividends = dividendData
    .sort((a, b) => new Date(a.exDividendDate).getTime() - new Date(b.exDividendDate).getTime())
    .slice(-20); // Last 20 dividends

  // Calculate metrics
  const latestDividend = sortedDividends[sortedDividends.length - 1];
  const annualDividends = sortedDividends.filter(d => 
    new Date(d.exDividendDate).getFullYear() === new Date().getFullYear()
  );
  
  const currentYearTotal = annualDividends.reduce((sum, d) => sum + d.amount, 0);
  const previousYearDividends = sortedDividends.filter(d => 
    new Date(d.exDividendDate).getFullYear() === new Date().getFullYear() - 1
  );
  const previousYearTotal = previousYearDividends.reduce((sum, d) => sum + d.amount, 0);
  
  const dividendGrowth = previousYearTotal > 0 
    ? ((currentYearTotal - previousYearTotal) / previousYearTotal) * 100 
    : 0;

  // Calculate dividend yield (mock current price for now)
  const currentPrice = 180; // You'll get this from props or API
  const dividendYield = currentYearTotal > 0 ? (currentYearTotal / currentPrice) * 100 : 0;

  // Calculate payout frequency
  const payoutFrequency = annualDividends.length;
  const frequencyText = payoutFrequency === 4 ? "Quarterly" : 
                       payoutFrequency === 2 ? "Semi-Annual" : 
                       payoutFrequency === 1 ? "Annual" : "Irregular";

  // Prepare chart data
  const chartData = sortedDividends.map(d => ({
    date: new Date(d.exDividendDate).toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
    amount: d.amount,
    year: new Date(d.exDividendDate).getFullYear()
  }));

  return (
    <div className="space-y-6">
      {/* Dividend Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5" />
              <span>Dividend Analysis</span>
            </div>
            <Badge variant={dividendGrowth >= 0 ? "default" : "destructive"}>
              {dividendGrowth >= 0 ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingUp className="h-3 w-3 mr-1 rotate-180" />}
              {dividendGrowth >= 0 ? '+' : ''}{dividendGrowth.toFixed(1)}% Growth
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <motion.div 
              className="text-center p-4 bg-green-50 rounded-lg"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <div className="text-2xl font-bold text-green-600">${latestDividend?.amount?.toFixed(4) || '0.00'}</div>
              <div className="text-sm text-gray-600">Latest Dividend</div>
            </motion.div>
            
            <motion.div 
              className="text-center p-4 bg-blue-50 rounded-lg"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <div className="text-2xl font-bold text-blue-600">{dividendYield.toFixed(2)}%</div>
              <div className="text-sm text-gray-600">Dividend Yield</div>
            </motion.div>
            
            <motion.div 
              className="text-center p-4 bg-purple-50 rounded-lg"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <div className="text-2xl font-bold text-purple-600">${currentYearTotal.toFixed(2)}</div>
              <div className="text-sm text-gray-600">Annual Dividend</div>
            </motion.div>
            
            <motion.div 
              className="text-center p-4 bg-orange-50 rounded-lg"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <div className="text-2xl font-bold text-orange-600">{frequencyText}</div>
              <div className="text-sm text-gray-600">Payment Frequency</div>
            </motion.div>
          </div>

          {/* Dividend History Chart */}
          <div className="h-80 mb-6">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip 
                  formatter={(value) => [`$${Number(value).toFixed(4)}`, 'Dividend']}
                  labelFormatter={(label) => `Date: ${label}`}
                />
                <Bar dataKey="amount" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Dividend Details */}
          <div className="space-y-4">
            <h4 className="font-semibold text-lg">Recent Dividend Payments</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="text-left p-3 font-semibold">Ex-Dividend Date</th>
                    <th className="text-right p-3 font-semibold">Amount</th>
                    <th className="text-right p-3 font-semibold">Payment Date</th>
                    <th className="text-center p-3 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedDividends.slice(-5).reverse().map((dividend, index) => {
                    const isUpcoming = new Date(dividend.paymentDate) > new Date();
                    return (
                      <tr key={index} className="border-b hover:bg-gray-50">
                        <td className="p-3 font-medium">
                          {new Date(dividend.exDividendDate).toLocaleDateString()}
                        </td>
                        <td className="text-right p-3 font-mono text-green-600">
                          ${dividend.amount.toFixed(4)}
                        </td>
                        <td className="text-right p-3">
                          {new Date(dividend.paymentDate).toLocaleDateString()}
                        </td>
                        <td className="text-center p-3">
                          <Badge variant={isUpcoming ? "secondary" : "default"}>
                            {isUpcoming ? "Upcoming" : "Paid"}
                          </Badge>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Dividend Quality Assessment */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Percent className="h-5 w-5" />
            <span>Dividend Quality Assessment</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">Growth Consistency</span>
                <Badge variant={dividendGrowth >= 5 ? "default" : dividendGrowth >= 0 ? "secondary" : "destructive"}>
                  {dividendGrowth >= 5 ? "Excellent" : dividendGrowth >= 0 ? "Good" : "Declining"}
                </Badge>
              </div>
              <div className="text-2xl font-bold text-blue-600">{dividendGrowth.toFixed(1)}%</div>
              <div className="text-sm text-gray-600 mt-1">Year-over-year growth</div>
            </div>
            
            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">Yield Attractiveness</span>
                <Badge variant={dividendYield >= 3 ? "default" : dividendYield >= 1 ? "secondary" : "outline"}>
                  {dividendYield >= 3 ? "High" : dividendYield >= 1 ? "Moderate" : "Low"}
                </Badge>
              </div>
              <div className="text-2xl font-bold text-green-600">{dividendYield.toFixed(2)}%</div>
              <div className="text-sm text-gray-600 mt-1">Current yield</div>
            </div>
            
            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">Payment Reliability</span>
                <Badge variant={payoutFrequency >= 4 ? "default" : "secondary"}>
                  {payoutFrequency >= 4 ? "Regular" : "Irregular"}
                </Badge>
              </div>
              <div className="text-2xl font-bold text-purple-600">{payoutFrequency}</div>
              <div className="text-sm text-gray-600 mt-1">Payments this year</div>
            </div>
          </div>

          {/* Investment Insights */}
          <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
            <h4 className="font-semibold text-blue-900 mb-2">Dividend Investment Insights</h4>
            <div className="space-y-2 text-sm">
              <p className="text-blue-800">
                • {symbol} has paid {sortedDividends.length} dividends in the tracked period
              </p>
              <p className="text-blue-800">
                • Average dividend amount: ${(sortedDividends.reduce((sum, d) => sum + d.amount, 0) / sortedDividends.length).toFixed(4)}
              </p>
              <p className="text-blue-800">
                • Payment frequency: {frequencyText} ({payoutFrequency} times per year)
              </p>
              {dividendGrowth > 0 && (
                <p className="text-green-800 font-medium">
                  • Dividend growth of {dividendGrowth.toFixed(1)}% indicates strong capital allocation
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}