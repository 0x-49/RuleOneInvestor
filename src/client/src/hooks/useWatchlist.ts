import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { WatchlistItem } from "@shared/schema";

interface WatchlistItemWithStock extends WatchlistItem {
  stock?: {
    symbol: string;
    name: string;
    price: number;
    changePercent: number;
  };
}

export function useWatchlist() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const watchlistQuery = useQuery<WatchlistItemWithStock[]>({
    queryKey: ["/api/watchlist"],
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const addToWatchlistMutation = useMutation({
    mutationFn: async (stockSymbol: string) => {
      return apiRequest("POST", "/api/watchlist", { stockSymbol });
    },
    onSuccess: (_, stockSymbol) => {
      toast({
        title: "Added to Watchlist",
        description: `${stockSymbol} has been added to your watchlist.`,
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

  const removeFromWatchlistMutation = useMutation({
    mutationFn: async (stockSymbol: string) => {
      return apiRequest("DELETE", `/api/watchlist/${stockSymbol}`, undefined);
    },
    onSuccess: (_, stockSymbol) => {
      toast({
        title: "Removed from Watchlist",
        description: `${stockSymbol} has been removed from your watchlist.`,
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

  return {
    watchlist: watchlistQuery.data || [],
    isLoading: watchlistQuery.isLoading,
    addToWatchlist: addToWatchlistMutation.mutate,
    removeFromWatchlist: removeFromWatchlistMutation.mutate,
    isAdding: addToWatchlistMutation.isPending,
    isRemoving: removeFromWatchlistMutation.isPending,
  };
}
