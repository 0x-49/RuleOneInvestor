import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Target, TrendingUp, TrendingDown, Info, Calculator, DollarSign } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { motion } from "framer-motion";

interface Props {
  currentPrice: number;
  stickerPrice: number;
  marginOfSafetyPrice: number;
  symbol: string;
  lastUpdated?: string;
}

export default function FairValueGauge({ 
  currentPrice, 
  stickerPrice, 
  marginOfSafetyPrice, 
  symbol,
  lastUpdated 
}: Props) {
  // Calculate valuation status
  const getValuationStatus = () => {
    if (currentPrice <= marginOfSafetyPrice) {
      return {
        status: "Significantly Undervalued",
        color: "text-green-700",
        bgColor: "bg-green-50",
        borderColor: "border-green-200",
        percentage: ((stickerPrice - currentPrice) / stickerPrice * 100),
        recommendation: "Strong Buy - Excellent Margin of Safety"
      };
    } else if (currentPrice <= stickerPrice) {
      return {
        status: "Undervalued",
        color: "text-amber-700",
        bgColor: "bg-amber-50",
        borderColor: "border-amber-200",
        percentage: ((stickerPrice - currentPrice) / stickerPrice * 100),
        recommendation: "Buy - Good Value"
      };
    } else {
      return {
        status: "Overvalued",
        color: "text-red-700",
        bgColor: "bg-red-50",
        borderColor: "border-red-200",
        percentage: ((currentPrice - stickerPrice) / stickerPrice * 100),
        recommendation: "Hold/Avoid - Above Fair Value"
      };
    }
  };

  const valuation = getValuationStatus();

  // Calculate gauge position (0-100%)
  const maxPrice = Math.max(currentPrice, stickerPrice, marginOfSafetyPrice) * 1.2;
  const currentPosition = (currentPrice / maxPrice) * 100;
  const stickerPosition = (stickerPrice / maxPrice) * 100;
  const mosPosition = (marginOfSafetyPrice / maxPrice) * 100;

  return (
    <Card className={`${valuation.borderColor} border-2`}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Target className="h-5 w-5" />
            <span>Fair Value Analysis</span>
          </div>
          <Badge className={`${valuation.bgColor} ${valuation.color} border-0`}>
            {valuation.percentage > 0 ? 
              `${valuation.percentage.toFixed(1)}% ${currentPrice <= stickerPrice ? 'Undervalued' : 'Overvalued'}` :
              'At Fair Value'
            }
          </Badge>
        </CardTitle>
        {lastUpdated && (
          <p className="text-sm text-gray-500">Updated {lastUpdated}</p>
        )}
      </CardHeader>
      <CardContent>
        {/* Main Gauge Visualization */}
        <div className="relative mb-8">
          {/* Gauge Background */}
          <div className="relative h-32 bg-gray-100 rounded-full overflow-hidden">
            {/* Value Zones */}
            <div 
              className="absolute left-0 top-0 h-full bg-green-300 opacity-60"
              style={{ width: `${mosPosition}%` }}
            />
            <div 
              className="absolute top-0 h-full bg-amber-300 opacity-60"
              style={{ 
                left: `${mosPosition}%`, 
                width: `${stickerPosition - mosPosition}%` 
              }}
            />
            <div 
              className="absolute top-0 h-full bg-red-300 opacity-60"
              style={{ 
                left: `${stickerPosition}%`, 
                width: `${100 - stickerPosition}%` 
              }}
            />

            {/* Current Price Indicator */}
            <motion.div
              initial={{ left: 0 }}
              animate={{ left: `${currentPosition}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="absolute top-0 w-1 h-full bg-blue-600 shadow-lg"
              style={{ transform: 'translateX(-50%)' }}
            />
            
            {/* Price Labels */}
            <div className="absolute inset-0 flex items-center justify-between px-4 text-xs font-medium">
              <span className="text-green-700">Excellent Buy</span>
              <span className="text-amber-700">Good Value</span>
              <span className="text-red-700">Overvalued</span>
            </div>
          </div>

          {/* Current Price Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="absolute -bottom-6 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg"
            style={{ left: `${currentPosition}%`, transform: 'translateX(-50%)' }}
          >
            ${currentPrice.toFixed(2)}
          </motion.div>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <motion.div 
            className="text-center p-4 bg-blue-50 rounded-lg border"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-center justify-center mb-2">
              <DollarSign className="h-4 w-4 text-blue-600 mr-1" />
              <span className="text-sm font-medium text-blue-800">Current Price</span>
            </div>
            <div className="text-2xl font-bold text-blue-600">${currentPrice.toFixed(2)}</div>
          </motion.div>

          <motion.div 
            className="text-center p-4 bg-green-50 rounded-lg border"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-center justify-center mb-2">
              <Target className="h-4 w-4 text-green-600 mr-1" />
              <span className="text-sm font-medium text-green-800">Sticker Price</span>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="h-3 w-3 text-gray-400 ml-1" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Phil Town's calculated fair value based on growth projections</p>
                </TooltipContent>
              </Tooltip>
            </div>
            <div className="text-2xl font-bold text-green-600">${stickerPrice.toFixed(2)}</div>
          </motion.div>

          <motion.div 
            className="text-center p-4 bg-orange-50 rounded-lg border"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-center justify-center mb-2">
              <Calculator className="h-4 w-4 text-orange-600 mr-1" />
              <span className="text-sm font-medium text-orange-800">MOS Price</span>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="h-3 w-3 text-gray-400 ml-1" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Margin of Safety: 50% discount from Sticker Price</p>
                </TooltipContent>
              </Tooltip>
            </div>
            <div className="text-2xl font-bold text-orange-600">${marginOfSafetyPrice.toFixed(2)}</div>
          </motion.div>
        </div>

        {/* Valuation Summary */}
        <div className={`p-4 rounded-lg ${valuation.bgColor} border ${valuation.borderColor}`}>
          <div className="flex items-center justify-between mb-2">
            <h4 className={`font-semibold ${valuation.color}`}>Valuation Assessment</h4>
            {valuation.percentage > 0 && (
              <div className="flex items-center space-x-1">
                {currentPrice <= stickerPrice ? 
                  <TrendingDown className="h-4 w-4 text-green-600" /> :
                  <TrendingUp className="h-4 w-4 text-red-600" />
                }
                <span className={`text-sm font-medium ${valuation.color}`}>
                  {Math.abs(valuation.percentage).toFixed(1)}%
                </span>
              </div>
            )}
          </div>
          <p className={`${valuation.color} font-medium`}>{valuation.status}</p>
          <p className={`text-sm ${valuation.color} mt-1`}>{valuation.recommendation}</p>
        </div>

        {/* Rule One Explanation */}
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <h5 className="font-medium text-gray-800 mb-2">Phil Town's Rule One Valuation</h5>
          <div className="text-sm text-gray-600 space-y-1">
            <p>• <strong>Sticker Price:</strong> Fair value based on growth assumptions and minimum 15% return</p>
            <p>• <strong>Margin of Safety:</strong> 50% discount from Sticker Price for risk protection</p>
            <p>• <strong>Buy Signal:</strong> Stock trading below Margin of Safety Price</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}