import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Settings, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface WatchlistProps {
  onStockSelect: (symbol: string) => void;
}

interface WatchlistItemWithStock {
  id: number;
  stockSymbol: string;
  addedAt: Date;
  stock?: {
    symbol: string;
    name: string;
    price: number;
    changePercent: number;
  };
}

export default function Watchlist({ onStockSelect }: WatchlistProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: watchlistItems = [], isLoading } = useQuery<WatchlistItemWithStock[]>({
    queryKey: ["/api/watchlist"],
  });

  const removeFromWatchlistMutation = useMutation({
    mutationFn: async (symbol: string) => {
      return apiRequest("DELETE", `/api/watchlist/${symbol}`, undefined);
    },
    onSuccess: (_, symbol) => {
      toast({
        title: "Removed from Watchlist",
        description: `${symbol} has been removed from your watchlist.`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/watchlist"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to remove stock from watchlist.",
        variant: "destructive",
      });
    },
  });

  const handleStockClick = (symbol: string) => {
    onStockSelect(symbol);
  };

  const handleRemoveStock = (e: React.MouseEvent, symbol: string) => {
    e.stopPropagation();
    removeFromWatchlistMutation.mutate(symbol);
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Watchlist</span>
            <Skeleton className="h-6 w-16" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Watchlist</span>
          <Button
            variant="ghost"
            size="sm"
            className="text-primary hover:text-blue-700 text-sm font-medium"
          >
            <Settings className="h-4 w-4 mr-1" />
            Manage
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {watchlistItems.length === 0 ? (
          <div className="text-center text-slate-600 dark:text-slate-400 py-8">
            <p>No stocks in your watchlist</p>
            <p className="text-sm mt-2">Add stocks to track their performance</p>
          </div>
        ) : (
          <div className="space-y-3">
            {watchlistItems.map((item) => (
              <div
                key={item.id}
                onClick={() => handleStockClick(item.stockSymbol)}
                className="group flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
              >
                <div className="flex-1">
                  <div className="font-semibold text-slate-900 dark:text-slate-100">
                    {item.stock?.symbol || item.stockSymbol}
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">
                    {item.stock?.name || "Loading..."}
                  </div>
                </div>
                
                {item.stock && (
                  <div className="text-right mr-8">
                    <div className="font-semibold text-slate-900 dark:text-slate-100">
                      ${item.stock.price.toFixed(2)}
                    </div>
                    <div className={cn(
                      "text-sm",
                      item.stock.changePercent >= 0 
                        ? "text-green-600 dark:text-green-400" 
                        : "text-red-600 dark:text-red-400"
                    )}>
                      {item.stock.changePercent >= 0 ? '+' : ''}{item.stock.changePercent.toFixed(1)}%
                    </div>
                  </div>
                )}
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => handleRemoveStock(e, item.stockSymbol)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 hover:text-red-500"
                  disabled={removeFromWatchlistMutation.isPending}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
