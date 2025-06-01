import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from "recharts";
import { TrendingUp, TrendingDown, Activity, BarChart3 } from "lucide-react";
import { motion } from "framer-motion";

interface TechnicalData {
  date: string;
  price: number;
  rsi: number;
  sma20: number;
  sma50: number;
  volume: number;
  macd: number;
}

interface Props {
  symbol: string;
  currentPrice: number;
  priceChange: number;
  priceChangePercent: number;
}

export default function TechnicalAnalysis({ symbol, currentPrice, priceChange, priceChangePercent }: Props) {
  // Mock technical data - you'll replace this with Alpha Vantage API calls
  const technicalData: TechnicalData[] = [
    { date: "2024-05-01", price: 180.00, rsi: 65, sma20: 175.50, sma50: 170.00, volume: 45000000, macd: 2.5 },
    { date: "2024-05-02", price: 182.50, rsi: 68, sma20: 176.20, sma50: 170.80, volume: 52000000, macd: 2.8 },
    { date: "2024-05-03", price: 178.30, rsi: 58, sma20: 176.80, sma50: 171.50, volume: 38000000, macd: 1.9 },
    { date: "2024-05-04", price: 185.20, rsi: 72, sma20: 177.90, sma50: 172.30, volume: 61000000, macd: 3.2 },
    { date: "2024-05-05", price: 183.40, rsi: 69, sma20: 178.50, sma50: 173.00, volume: 47000000, macd: 2.9 },
  ];

  // Calculate technical indicators
  const latestData = technicalData[technicalData.length - 1];
  const rsiStatus = latestData.rsi > 70 ? "Overbought" : latestData.rsi < 30 ? "Oversold" : "Neutral";
  const trendStatus = currentPrice > latestData.sma20 && latestData.sma20 > latestData.sma50 ? "Bullish" : "Bearish";
  
  const support = Math.min(...technicalData.map(d => d.price));
  const resistance = Math.max(...technicalData.map(d => d.price));

  return (
    <div className="space-y-6">
      {/* Price Performance Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Activity className="h-5 w-5" />
              <span>Technical Analysis</span>
            </div>
            <Badge variant={priceChange >= 0 ? "default" : "destructive"}>
              {priceChange >= 0 ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
              {priceChangePercent >= 0 ? '+' : ''}{priceChangePercent.toFixed(2)}%
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <motion.div 
              className="text-center p-4 bg-blue-50 rounded-lg"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <div className="text-2xl font-bold text-blue-600">${currentPrice.toFixed(2)}</div>
              <div className="text-sm text-gray-600">Current Price</div>
            </motion.div>
            
            <motion.div 
              className="text-center p-4 bg-green-50 rounded-lg"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <div className="text-xl font-bold text-green-600">${support.toFixed(2)}</div>
              <div className="text-sm text-gray-600">Support Level</div>
            </motion.div>
            
            <motion.div 
              className="text-center p-4 bg-red-50 rounded-lg"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <div className="text-xl font-bold text-red-600">${resistance.toFixed(2)}</div>
              <div className="text-sm text-gray-600">Resistance Level</div>
            </motion.div>
            
            <motion.div 
              className="text-center p-4 bg-purple-50 rounded-lg"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <div className="text-xl font-bold text-purple-600">{latestData.rsi.toFixed(0)}</div>
              <div className="text-sm text-gray-600">RSI</div>
            </motion.div>
          </div>

          {/* Technical Indicators Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between">
                <span className="font-medium">RSI (14)</span>
                <Badge variant={rsiStatus === "Neutral" ? "secondary" : "outline"}>
                  {rsiStatus}
                </Badge>
              </div>
              <div className="mt-2 text-2xl font-bold">{latestData.rsi.toFixed(1)}</div>
            </div>
            
            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between">
                <span className="font-medium">Trend</span>
                <Badge variant={trendStatus === "Bullish" ? "default" : "destructive"}>
                  {trendStatus}
                </Badge>
              </div>
              <div className="mt-2 text-sm text-gray-600">
                Price vs SMA20: {currentPrice > latestData.sma20 ? "Above" : "Below"}
              </div>
            </div>
            
            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between">
                <span className="font-medium">MACD</span>
                <Badge variant={latestData.macd > 0 ? "default" : "destructive"}>
                  {latestData.macd > 0 ? "Bullish" : "Bearish"}
                </Badge>
              </div>
              <div className="mt-2 text-2xl font-bold">{latestData.macd.toFixed(2)}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Price Chart with Moving Averages */}
      <Card>
        <CardHeader>
          <CardTitle>Price Action & Moving Averages</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={technicalData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis domain={['dataMin - 5', 'dataMax + 5']} />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="price" 
                  stroke="#2563eb" 
                  strokeWidth={3}
                  name="Price"
                  dot={{ fill: "#2563eb", strokeWidth: 2, r: 4 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="sma20" 
                  stroke="#f59e0b" 
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  name="SMA 20"
                  dot={false}
                />
                <Line 
                  type="monotone" 
                  dataKey="sma50" 
                  stroke="#ef4444" 
                  strokeWidth={2}
                  strokeDasharray="10 5"
                  name="SMA 50"
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Volume Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 className="h-5 w-5" />
            <span>Volume Analysis</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={technicalData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip formatter={(value) => [Number(value).toLocaleString(), 'Volume']} />
                <Area 
                  type="monotone" 
                  dataKey="volume" 
                  stroke="#8b5cf6" 
                  fill="#8b5cf6" 
                  fillOpacity={0.6}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-lg font-bold text-blue-600">
                  {(latestData.volume / 1000000).toFixed(1)}M
                </div>
                <div className="text-sm text-gray-600">Latest Volume</div>
              </div>
              <div>
                <div className="text-lg font-bold text-green-600">
                  {(technicalData.reduce((sum, d) => sum + d.volume, 0) / technicalData.length / 1000000).toFixed(1)}M
                </div>
                <div className="text-sm text-gray-600">Avg Volume</div>
              </div>
              <div>
                <div className="text-lg font-bold text-purple-600">
                  {((latestData.volume / (technicalData.reduce((sum, d) => sum + d.volume, 0) / technicalData.length)) * 100).toFixed(0)}%
                </div>
                <div className="text-sm text-gray-600">vs Average</div>
              </div>
              <div>
                <div className="text-lg font-bold text-orange-600">
                  {latestData.volume > (technicalData.reduce((sum, d) => sum + d.volume, 0) / technicalData.length) ? "High" : "Normal"}
                </div>
                <div className="text-sm text-gray-600">Volume Status</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Technical Analysis Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Technical Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 border-l-4 border-blue-500 bg-blue-50">
              <h4 className="font-semibold text-blue-900">Key Levels</h4>
              <p className="text-blue-700 text-sm mt-1">
                Support at ${support.toFixed(2)} • Resistance at ${resistance.toFixed(2)}
              </p>
            </div>
            
            <div className="p-4 border-l-4 border-green-500 bg-green-50">
              <h4 className="font-semibold text-green-900">Momentum</h4>
              <p className="text-green-700 text-sm mt-1">
                RSI: {latestData.rsi.toFixed(1)} ({rsiStatus}) • MACD: {latestData.macd.toFixed(2)} ({latestData.macd > 0 ? "Bullish" : "Bearish"})
              </p>
            </div>
            
            <div className="p-4 border-l-4 border-purple-500 bg-purple-50">
              <h4 className="font-semibold text-purple-900">Trend Analysis</h4>
              <p className="text-purple-700 text-sm mt-1">
                {trendStatus} trend confirmed • Price {currentPrice > latestData.sma20 ? "above" : "below"} key moving averages
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}