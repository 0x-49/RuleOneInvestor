import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Info, Clock, Eye, ShoppingCart } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { apiRequest } from "@/lib/queryClient";
import { StockWithMetrics } from "@shared/schema";
import { motion } from "framer-motion";

interface ValuationToolsProps {
  stockData?: StockWithMetrics;
  isLoading: boolean;
  symbol: string;
}

interface ValuationInputs {
  growthRate: number;
  peRatio: number;
  minimumReturn: number;
}

interface ValuationResult extends ValuationInputs {
  stickerPrice: number;
  mosPrice: number;
  recommendation: string;
  currentPrice: number;
}

export default function ValuationTools({ stockData, isLoading, symbol }: ValuationToolsProps) {
  const [inputs, setInputs] = useState<ValuationInputs>({
    growthRate: 15,
    peRatio: 20,
    minimumReturn: 15,
  });

  const queryClient = useQueryClient();

  // Fetch saved valuation inputs
  const { data: savedInputs } = useQuery<ValuationInputs>({
    queryKey: ["/api/valuation", symbol],
    enabled: !!symbol,
  });

  // Save valuation inputs and get results
  const saveValuationMutation = useMutation({
    mutationFn: async (data: ValuationInputs & { stockSymbol: string }) => {
      const response = await apiRequest("POST", "/api/valuation", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/valuation", symbol] });
    },
  });

  // Update inputs when saved data is loaded
  useEffect(() => {
    if (savedInputs) {
      setInputs({
        growthRate: savedInputs.growthRate,
        peRatio: savedInputs.peRatio,
        minimumReturn: savedInputs.minimumReturn,
      });
    }
  }, [savedInputs]);

  // Auto-save when inputs change
  useEffect(() => {
    if (symbol && stockData) {
      const timeoutId = setTimeout(() => {
        saveValuationMutation.mutate({
          ...inputs,
          stockSymbol: symbol,
        });
      }, 1000);

      return () => clearTimeout(timeoutId);
    }
  }, [inputs, symbol, stockData]);

  const handleInputChange = (field: keyof ValuationInputs, value: number) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Valuation & Margin of Safety</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i}>
                  <Skeleton className="h-4 w-32 mb-2" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ))}
            </div>
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-20" />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!stockData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Valuation & Margin of Safety</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-slate-600 dark:text-slate-400 py-8">
            Select a stock to analyze valuation
          </div>
        </CardContent>
      </Card>
    );
  }

  // Calculate valuation metrics
  const latestMetrics = stockData.metrics?.[stockData.metrics.length - 1];
  const currentEPS = latestMetrics?.eps || 0;
  
  if (currentEPS <= 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Valuation & Margin of Safety</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-slate-600 dark:text-slate-400 py-8">
            Insufficient earnings data for valuation analysis
          </div>
        </CardContent>
      </Card>
    );
  }

  const futureEPS = currentEPS * Math.pow(1 + inputs.growthRate / 100, 10);
  const futurePrice = futureEPS * inputs.peRatio;
  const stickerPrice = futurePrice / Math.pow(1 + inputs.minimumReturn / 100, 10);
  const mosPrice = stickerPrice * 0.5; // 50% margin of safety
  
  const recommendation = stockData.price <= mosPrice ? "Buy" : 
                        stockData.price <= stickerPrice ? "Watch" : "Wait";

  const getRecommendationIcon = () => {
    switch (recommendation) {
      case "Buy":
        return <ShoppingCart className="h-5 w-5 text-green-500" />;
      case "Watch":
        return <Eye className="h-5 w-5 text-yellow-500" />;
      default:
        return <Clock className="h-5 w-5 text-red-500" />;
    }
  };

  const getRecommendationColor = () => {
    switch (recommendation) {
      case "Buy":
        return "text-green-600 dark:text-green-400";
      case "Watch":
        return "text-yellow-600 dark:text-yellow-400";
      default:
        return "text-red-600 dark:text-red-400";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Valuation & Margin of Safety</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Expected Growth Rate
                </Label>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="h-4 w-4 text-slate-400" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Conservative estimate of future EPS growth</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <div className="flex items-center space-x-2">
                <Input
                  type="number"
                  value={inputs.growthRate}
                  onChange={(e) => handleInputChange('growthRate', Number(e.target.value))}
                  min="0"
                  max="50"
                  className="w-20"
                />
                <span className="text-slate-600 dark:text-slate-400">%</span>
              </div>
            </div>
            
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  PE Ratio (Future)
                </Label>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="h-4 w-4 text-slate-400" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Expected PE when you sell (typically 2x growth rate)</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <Input
                type="number"
                value={inputs.peRatio}
                onChange={(e) => handleInputChange('peRatio', Number(e.target.value))}
                min="5"
                max="50"
                className="w-20"
              />
            </div>
            
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Minimum Return
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Input
                  type="number"
                  value={inputs.minimumReturn}
                  onChange={(e) => handleInputChange('minimumReturn', Number(e.target.value))}
                  min="5"
                  max="30"
                  className="w-20"
                />
                <span className="text-slate-600 dark:text-slate-400">%</span>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4">
              <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">Sticker Price</div>
              <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                ${stickerPrice.toFixed(2)}
              </div>
            </div>
            
            <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4">
              <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">Margin of Safety Price</div>
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                ${mosPrice.toFixed(2)}
              </div>
              <div className="text-xs text-slate-600 dark:text-slate-400">50% of sticker price</div>
            </div>
            
            <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4">
              <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">Current Recommendation</div>
              <div className="flex items-center space-x-2">
                {getRecommendationIcon()}
                <span className={`font-semibold ${getRecommendationColor()}`}>
                  {recommendation}
                </span>
              </div>
              <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                {recommendation === "Buy" && "Price below MOS threshold"}
                {recommendation === "Watch" && "Price between MOS and sticker"}
                {recommendation === "Wait" && "Price above sticker price"}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
