import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from "recharts";
import { TrendingUp, BarChart3, Target, Info } from "lucide-react";
import { Tooltip as UITooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { motion } from "framer-motion";

interface PEData {
  period: string;
  pe: number;
  price: number;
  eps: number;
}

interface Props {
  symbol: string;
  currentPE: number;
  industryAvgPE: number;
  fairPE: number;
  historicalPE: PEData[];
  analystTargetPrice?: number;
  numAnalysts?: number;
}

export default function PERatioAnalysis({ 
  symbol, 
  currentPE, 
  industryAvgPE, 
  fairPE, 
  historicalPE,
  analystTargetPrice,
  numAnalysts 
}: Props) {
  // Prepare comparison data
  const comparisonData = [
    { name: 'Current P/E', value: currentPE, color: '#3b82f6' },
    { name: 'Industry Avg', value: industryAvgPE, color: '#6b7280' },
    { name: 'Fair P/E', value: fairPE, color: '#10b981' }
  ];

  // Determine P/E status
  const getPEStatus = () => {
    if (currentPE < industryAvgPE * 0.8) {
      return { status: "Attractive", color: "text-green-600", bg: "bg-green-50" };
    } else if (currentPE > industryAvgPE * 1.2) {
      return { status: "Expensive", color: "text-red-600", bg: "bg-red-50" };
    } else {
      return { status: "Reasonable", color: "text-amber-600", bg: "bg-amber-50" };
    }
  };

  const peStatus = getPEStatus();

  // Calculate P/E trends
  const recentPE = historicalPE.slice(-5);
  const peChange = recentPE.length >= 2 ? 
    ((recentPE[recentPE.length - 1].pe - recentPE[0].pe) / recentPE[0].pe) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* P/E Comparison Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5" />
              <span>Price-to-Earnings Analysis</span>
            </div>
            <Badge className={`${peStatus.bg} ${peStatus.color} border-0`}>
              {peStatus.status} Valuation
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Key P/E Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <motion.div 
              className="text-center p-4 bg-blue-50 rounded-lg border"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <div className="text-2xl font-bold text-blue-600">{currentPE.toFixed(1)}x</div>
              <div className="text-sm text-gray-600">Current P/E</div>
              <div className="text-xs text-gray-500 mt-1">
                {peChange >= 0 ? '+' : ''}{peChange.toFixed(1)}% vs 5Y avg
              </div>
            </motion.div>
            
            <motion.div 
              className="text-center p-4 bg-gray-50 rounded-lg border"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <div className="text-2xl font-bold text-gray-600">{industryAvgPE.toFixed(1)}x</div>
              <div className="text-sm text-gray-600">Industry Average</div>
              <div className="text-xs text-gray-500 mt-1">
                {((currentPE - industryAvgPE) / industryAvgPE * 100).toFixed(0)}% premium
              </div>
            </motion.div>
            
            <motion.div 
              className="text-center p-4 bg-green-50 rounded-lg border"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <div className="text-2xl font-bold text-green-600">{fairPE.toFixed(1)}x</div>
              <div className="text-sm text-gray-600">Fair P/E</div>
              <UITooltip>
                <TooltipTrigger>
                  <div className="text-xs text-gray-500 mt-1 cursor-help">
                    Rule One Calculation <Info className="h-3 w-3 inline ml-1" />
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Based on growth rate and quality factors</p>
                </TooltipContent>
              </UITooltip>
            </motion.div>
            
            {analystTargetPrice && (
              <motion.div 
                className="text-center p-4 bg-purple-50 rounded-lg border"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <div className="text-2xl font-bold text-purple-600">${analystTargetPrice.toFixed(0)}</div>
                <div className="text-sm text-gray-600">Analyst Target</div>
                <div className="text-xs text-gray-500 mt-1">
                  {numAnalysts || 0} analysts
                </div>
              </motion.div>
            )}
          </div>

          {/* P/E Comparison Bar Chart */}
          <div className="h-64 mb-6">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={comparisonData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => [`${Number(value).toFixed(1)}x`, 'P/E Ratio']} />
                <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]}>
                  {comparisonData.map((entry, index) => (
                    <Bar key={index} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* P/E Analysis Summary */}
          <div className={`p-4 rounded-lg ${peStatus.bg} border`}>
            <h4 className={`font-semibold ${peStatus.color} mb-2`}>P/E Ratio Assessment</h4>
            <div className="space-y-2 text-sm">
              <p className={peStatus.color}>
                • {symbol}'s P/E of {currentPE.toFixed(1)}x is {currentPE > industryAvgPE ? 'above' : 'below'} industry average
              </p>
              <p className={peStatus.color}>
                • Trading at {((currentPE - fairPE) / fairPE * 100).toFixed(0)}% {currentPE > fairPE ? 'premium' : 'discount'} to calculated fair P/E
              </p>
              <p className={peStatus.color}>
                • Historical trend: P/E has {peChange >= 0 ? 'increased' : 'decreased'} by {Math.abs(peChange).toFixed(1)}% recently
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Historical P/E Trend */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5" />
            <span>Historical P/E Ratio Trend</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={historicalPE}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="period" />
                <YAxis domain={['dataMin - 2', 'dataMax + 2']} />
                <Tooltip 
                  formatter={(value, name) => [
                    name === 'pe' ? `${Number(value).toFixed(1)}x` : `$${Number(value).toFixed(2)}`,
                    name === 'pe' ? 'P/E Ratio' : name === 'price' ? 'Stock Price' : 'EPS'
                  ]}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="pe" 
                  stroke="#3b82f6" 
                  strokeWidth={3}
                  name="P/E Ratio"
                  dot={{ fill: "#3b82f6", strokeWidth: 2, r: 4 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="price" 
                  stroke="#10b981" 
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  name="Stock Price"
                  dot={false}
                  yAxisId="right"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          
          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="p-3 bg-blue-50 rounded-lg">
              <div className="text-lg font-bold text-blue-600">
                {Math.max(...historicalPE.map(d => d.pe)).toFixed(1)}x
              </div>
              <div className="text-sm text-gray-600">5Y High P/E</div>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <div className="text-lg font-bold text-green-600">
                {Math.min(...historicalPE.map(d => d.pe)).toFixed(1)}x
              </div>
              <div className="text-sm text-gray-600">5Y Low P/E</div>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg">
              <div className="text-lg font-bold text-purple-600">
                {(historicalPE.reduce((sum, d) => sum + d.pe, 0) / historicalPE.length).toFixed(1)}x
              </div>
              <div className="text-sm text-gray-600">5Y Average</div>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="text-lg font-bold text-gray-600">
                {currentPE > (historicalPE.reduce((sum, d) => sum + d.pe, 0) / historicalPE.length) ? 'Above' : 'Below'}
              </div>
              <div className="text-sm text-gray-600">vs Average</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* P/E Explanation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="h-5 w-5" />
            <span>Understanding P/E Ratios</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-800 mb-3">What P/E Tells You</h4>
              <div className="space-y-2 text-sm text-gray-600">
                <p>• <strong>Higher P/E:</strong> Investors expect higher earnings growth</p>
                <p>• <strong>Lower P/E:</strong> May indicate undervaluation or slower growth</p>
                <p>• <strong>Industry Context:</strong> Compare within same sector for relevance</p>
                <p>• <strong>Growth Rate:</strong> P/E should align with earnings growth rate</p>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 mb-3">Rule One P/E Guidelines</h4>
              <div className="space-y-2 text-sm text-gray-600">
                <p>• <strong>Fair P/E:</strong> Typically equals earnings growth rate</p>
                <p>• <strong>Quality Factor:</strong> Higher quality companies warrant premium</p>
                <p>• <strong>Safety Margin:</strong> Buy below calculated fair P/E</p>
                <p>• <strong>Historical Context:</strong> Consider company's P/E range</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}