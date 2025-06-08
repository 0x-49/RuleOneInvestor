import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, ComposedChart, Area, AreaChart } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, BarChart3, PieChart as PieChartIcon } from "lucide-react";

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
  symbol: string;
  marketCap: number | null;
  sector: string | null;
  exchange: string | null;
}

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'];

export default function AdvancedFinancialCharts({ metrics, symbol, marketCap, sector, exchange }: Props) {
  // Prepare data for charts
  const chartData = metrics
    .filter(m => m.revenue && m.earnings && m.freeCashFlow && m.bookValue)
    .map(m => ({
      year: m.year,
      revenue: (m.revenue || 0) / 1000000000, // Convert to billions
      earnings: (m.earnings || 0) / 1000000000,
      freeCashFlow: (m.freeCashFlow || 0) / 1000000000,
      bookValue: (m.bookValue || 0) / 1000000000,
      eps: m.eps || 0,
      roic: m.roic || 0,
      debt: (m.debt || 0) / 1000000000,
      debtToEquity: m.debt && m.bookValue ? ((m.debt / m.bookValue) * 100) : 0
    }))
    .sort((a, b) => parseInt(a.year) - parseInt(b.year));

  // Calculate growth rates for latest period
  const calculateGrowthRate = (data: any[], field: string) => {
    if (data.length < 2) return 0;
    const latest = data[data.length - 1][field];
    const previous = data[data.length - 2][field];
    if (!previous || previous === 0) return 0;
    return ((latest - previous) / previous) * 100;
  };

  const revenueGrowth = calculateGrowthRate(chartData, 'revenue');
  const earningsGrowth = calculateGrowthRate(chartData, 'earnings');
  const fcfGrowth = calculateGrowthRate(chartData, 'freeCashFlow');

  // Prepare pie chart data for financial composition
  const latestData = chartData[chartData.length - 1];
  const financialComposition = latestData ? [
    { name: 'Revenue', value: latestData.revenue, color: COLORS[0] },
    { name: 'Operating Expenses', value: Math.max(0, latestData.revenue - latestData.earnings), color: COLORS[1] },
    { name: 'Net Earnings', value: latestData.earnings, color: COLORS[2] },
  ] : [];

  const formatBillions = (value: number) => `$${value.toFixed(1)}B`;
  const formatPercentage = (value: number) => `${value.toFixed(1)}%`;

  return (
    <div className="space-y-6">
      {/* Key Financial Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {formatBillions(latestData?.revenue || 0)}
                </div>
                <div className="text-sm text-gray-600">Latest Revenue</div>
                <Badge variant={revenueGrowth > 0 ? "default" : "destructive"} className="mt-1">
                  {revenueGrowth > 0 ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                  {formatPercentage(Math.abs(revenueGrowth))} YoY
                </Badge>
              </div>
              <BarChart3 className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-blue-600">
                  {formatBillions(latestData?.earnings || 0)}
                </div>
                <div className="text-sm text-gray-600">Net Earnings</div>
                <Badge variant={earningsGrowth > 0 ? "default" : "destructive"} className="mt-1">
                  {earningsGrowth > 0 ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                  {formatPercentage(Math.abs(earningsGrowth))} YoY
                </Badge>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-purple-600">
                  {formatBillions(latestData?.freeCashFlow || 0)}
                </div>
                <div className="text-sm text-gray-600">Free Cash Flow</div>
                <Badge variant={fcfGrowth > 0 ? "default" : "destructive"} className="mt-1">
                  {fcfGrowth > 0 ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                  {formatPercentage(Math.abs(fcfGrowth))} YoY
                </Badge>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Revenue, Earnings & FCF Trend */}
      <Card>
        <CardHeader>
          <CardTitle>Financial Performance Trends (10-Year)</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <ComposedChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis label={{ value: 'Billions ($)', angle: -90, position: 'insideLeft' }} />
              <Tooltip formatter={(value: number) => formatBillions(value)} />
              <Legend />
              <Area type="monotone" dataKey="revenue" stackId="1" stroke={COLORS[0]} fill={COLORS[0]} fillOpacity={0.3} name="Revenue" />
              <Bar dataKey="earnings" fill={COLORS[1]} name="Net Earnings" />
              <Line type="monotone" dataKey="freeCashFlow" stroke={COLORS[2]} strokeWidth={3} name="Free Cash Flow" />
            </ComposedChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* EPS & ROIC Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Earnings Per Share Growth</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis />
                <Tooltip formatter={(value: number) => `$${value.toFixed(2)}`} />
                <Area type="monotone" dataKey="eps" stroke={COLORS[3]} fill={COLORS[3]} fillOpacity={0.6} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Return on Invested Capital (ROIC)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis label={{ value: 'ROIC (%)', angle: -90, position: 'insideLeft' }} />
                <Tooltip formatter={(value: number) => formatPercentage(value)} />
                <Line type="monotone" dataKey="roic" stroke={COLORS[4]} strokeWidth={3} dot={{ r: 6 }} />
                <Line type="monotone" dataKey={10} stroke="#ef4444" strokeDasharray="5 5" name="Rule One Target (10%)" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Financial Health Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Debt vs Equity Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis label={{ value: 'Billions ($)', angle: -90, position: 'insideLeft' }} />
                <Tooltip formatter={(value: number) => formatBillions(value)} />
                <Legend />
                <Bar dataKey="bookValue" fill={COLORS[0]} name="Book Value (Equity)" />
                <Bar dataKey="debt" fill={COLORS[3]} name="Total Debt" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Financial Composition (Latest Year)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={financialComposition}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {financialComposition.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => formatBillions(value)} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Company Profile Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Company Profile & Market Position</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {marketCap ? `$${(marketCap / 1000000000000).toFixed(2)}T` : 'N/A'}
              </div>
              <div className="text-sm text-gray-600">Market Capitalization</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{sector || 'N/A'}</div>
              <div className="text-sm text-gray-600">Business Sector</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{exchange || 'N/A'}</div>
              <div className="text-sm text-gray-600">Stock Exchange</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">{chartData.length}</div>
              <div className="text-sm text-gray-600">Years of Data</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}