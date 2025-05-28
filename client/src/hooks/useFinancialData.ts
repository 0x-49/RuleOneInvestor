import { useQuery } from "@tanstack/react-query";
import { StockWithMetrics } from "@shared/schema";

export function useFinancialData(symbol: string) {
  return useQuery<StockWithMetrics>({
    queryKey: ["/api/stocks", symbol],
    enabled: !!symbol && symbol.length > 0,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchInterval: 1000 * 60 * 15, // 15 minutes
  });
}

export function useStockSearch(query: string) {
  return useQuery({
    queryKey: ["/api/stocks/search", { q: query }],
    enabled: query.length >= 2,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
}
