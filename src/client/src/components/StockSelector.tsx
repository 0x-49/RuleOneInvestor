import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Plus, Scale, CheckCircle, AlertTriangle, Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { StockWithMetrics } from "@shared/schema";
import { cn } from "@/lib/utils";

interface StockSelectorProps {
  stockData?: StockWithMetrics;
  isLoading: boolean;
  onStockSelect: (symbol: string) => void;
}

export default function StockSelector({ stockData, isLoading, onStockSelect }: StockSelectorProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const addToWatchlistMutation = useMutation({
    mutationFn: async (stockSymbol: string) => {
      return apiRequest("POST", "/api/watchlist", { stockSymbol });
    },
    onSuccess: () => {
      toast({
        title: "Added to Watchlist",
        description: `${stockData?.symbol} has been added to your watchlist.`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/watchlist"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add stock to watchlist.",
        variant: "destructive",
      });
    },
  });

  const handleAddToWatchlist = () => {
    if (stockData) {
      addToWatchlistMutation.mutate(stockData.symbol);
    }
  };

  if (isLoading) {
    return (
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <div>
                <Skeleton className="h-8 w-16 mb-2" />
                <Skeleton className="h-4 w-32" />
              </div>
              <div className="flex items-center space-x-2">
                <Skeleton className="h-8 w-20" />
                <Skeleton className="h-6 w-16" />
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Skeleton className="h-10 w-32" />
              <Skeleton className="h-10 w-24" />
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-20" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!stockData) {
    return (
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="text-center text-slate-600 dark:text-slate-400">
            Select a stock to view its analysis
          </div>
        </CardContent>
      </Card>
    );
  }

  const { ruleOneQuality } = stockData;

  return (
    <Card className="mb-6">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                {stockData.symbol}
              </h2>
              <p className="text-slate-600 dark:text-slate-400">{stockData.name}</p>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-3xl font-bold text-slate-900 dark:text-slate-100">
                ${stockData.price.toFixed(2)}
              </span>
              <Badge
                variant={stockData.changePercent >= 0 ? "default" : "destructive"}
                className={cn(
                  "px-2 py-1 text-sm font-medium",
                  stockData.changePercent >= 0
                    ? "bg-green-500 text-white hover:bg-green-600"
                    : "bg-red-500 text-white hover:bg-red-600"
                )}
              >
                {stockData.changePercent >= 0 ? '+' : ''}{stockData.changePercent.toFixed(2)}%
              </Badge>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button
              onClick={handleAddToWatchlist}
              disabled={addToWatchlistMutation.isPending}
              className="bg-green-600 text-white hover:bg-green-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              {addToWatchlistMutation.isPending ? "Adding..." : "Add to Watchlist"}
            </Button>
            
            <Button variant="outline" className="flex items-center space-x-2">
              <Scale className="w-4 h-4" />
              <span>Compare</span>
            </Button>
          </div>
        </div>
        
        {/* Rule One Quality Indicators */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                Rule One Quality
              </span>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="h-4 w-4 text-slate-400" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Big Four metrics all growing &gt; 10% annually</p>
                </TooltipContent>
              </Tooltip>
            </div>
            <div className="flex items-center space-x-2">
              {ruleOneQuality?.isExcellent ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <AlertTriangle className="h-5 w-5 text-yellow-500" />
              )}
              <span className="font-semibold text-slate-900 dark:text-slate-100">
                {ruleOneQuality?.isExcellent ? "Excellent" : "Fair"}
              </span>
            </div>
          </div>
          
          <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                Debt Payoff
              </span>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="h-4 w-4 text-slate-400" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Years to pay off debt with current FCF</p>
                </TooltipContent>
              </Tooltip>
            </div>
            <div className="flex items-center space-x-2">
              {(ruleOneQuality?.debtPayoffYears || 0) < 5 ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <AlertTriangle className="h-5 w-5 text-yellow-500" />
              )}
              <span className="font-semibold text-slate-900 dark:text-slate-100">
                {ruleOneQuality?.debtPayoffYears?.toFixed(1) || "N/A"} years
              </span>
            </div>
          </div>
          
          <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                Management ROIC
              </span>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="h-4 w-4 text-slate-400" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Return on Invested Capital &gt; 10%</p>
                </TooltipContent>
              </Tooltip>
            </div>
            <div className="flex items-center space-x-2">
              {(ruleOneQuality?.roic || 0) > 10 ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <AlertTriangle className="h-5 w-5 text-yellow-500" />
              )}
              <span className="font-semibold text-slate-900 dark:text-slate-100">
                {ruleOneQuality?.roic?.toFixed(1) || "N/A"}%
              </span>
            </div>
          </div>
          
          <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                Margin of Safety
              </span>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="h-4 w-4 text-slate-400" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Current price vs sticker price</p>
                </TooltipContent>
              </Tooltip>
            </div>
            <div className="flex items-center space-x-2">
              {(ruleOneQuality?.marginOfSafety || 0) > 20 ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <AlertTriangle className="h-5 w-5 text-yellow-500" />
              )}
              <span className="font-semibold text-slate-900 dark:text-slate-100">
                {ruleOneQuality?.marginOfSafety?.toFixed(0) || "N/A"}%
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
