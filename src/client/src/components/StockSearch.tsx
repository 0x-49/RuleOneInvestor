import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Stock } from "@shared/schema";
import { cn } from "@/lib/utils";

interface StockSearchProps {
  onStockSelect: (symbol: string) => void;
}

export default function StockSearch({ onStockSelect }: StockSearchProps) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [debouncedQuery, setDebouncedQuery] = useState("");

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const { data: searchResults = [], isLoading } = useQuery<Stock[]>({
    queryKey: ["/api/stocks/search", { q: debouncedQuery }],
    enabled: debouncedQuery.length >= 2,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setIsOpen(value.length >= 2);
  };

  const [, setLocation] = useLocation();

  const handleStockSelect = (symbol: string) => {
    setQuery(symbol);
    setIsOpen(false);
    onStockSelect(symbol);
    // Navigate to stock detail page
    setLocation(`/stock/${symbol}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && searchResults.length > 0) {
      handleStockSelect(searchResults[0].symbol);
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  return (
    <div className="relative">
      <div className="relative">
        <Input
          type="text"
          placeholder="Search stocks (e.g., AAPL, MSFT, GOOGL)"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => query.length >= 2 && setIsOpen(true)}
          className="w-full pl-10 pr-4 border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-primary focus:border-primary"
        />
        <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg">
          {isLoading ? (
            <div className="p-3 text-sm text-slate-600 dark:text-slate-400">
              Searching...
            </div>
          ) : searchResults.length > 0 ? (
            <div className="max-h-60 overflow-y-auto">
              {searchResults.map((stock) => (
                <button
                  key={stock.symbol}
                  onClick={() => handleStockSelect(stock.symbol)}
                  className="w-full text-left p-3 hover:bg-slate-50 dark:hover:bg-slate-700 border-b border-slate-100 dark:border-slate-600 last:border-b-0"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-semibold text-slate-900 dark:text-slate-100">
                        {stock.symbol}
                      </div>
                      <div className="text-sm text-slate-600 dark:text-slate-400">
                        {stock.name}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-slate-900 dark:text-slate-100">
                        ${stock.price.toFixed(2)}
                      </div>
                      <div className={cn(
                        "text-sm",
                        stock.changePercent >= 0 
                          ? "text-green-600 dark:text-green-400" 
                          : "text-red-600 dark:text-red-400"
                      )}>
                        {stock.changePercent >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="p-3 text-sm text-slate-600 dark:text-slate-400">
              No stocks found
            </div>
          )}
        </div>
      )}
    </div>
  );
}
