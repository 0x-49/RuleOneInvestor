import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { StockWithMetrics } from "@shared/schema";

interface ComparisonPanelProps {
  currentStock?: StockWithMetrics;
  onStockSelect: (symbol: string) => void;
}

interface ComparisonData {
  stock1: StockWithMetrics;
  stock2: StockWithMetrics;
}

const stockOptions = [
  { symbol: "MSFT", name: "Microsoft" },
  { symbol: "GOOGL", name: "Alphabet" },
  { symbol: "AMZN", name: "Amazon" },
  { symbol: "TSLA", name: "Tesla" },
  { symbol: "NVDA", name: "NVIDIA" },
];

export default function ComparisonPanel({ currentStock, onStockSelect }: ComparisonPanelProps) {
  const [compareSymbol, setCompareSymbol] = useState<string>("");

  const { data: comparisonData, isLoading } = useQuery<ComparisonData>({
    queryKey: ["/api/compare", currentStock?.symbol, compareSymbol],
    enabled: !!(currentStock && compareSymbol),
  });

  const handleCompareChange = (symbol: string) => {
    setCompareSymbol(symbol);
  };

  const handleStockClick = (symbol: string) => {
    onStockSelect(symbol);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Comparison</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">
              Compare with:
            </Label>
            <Select value={compareSymbol} onValueChange={handleCompareChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select stock..." />
              </SelectTrigger>
              <SelectContent>
                {stockOptions
                  .filter(option => option.symbol !== currentStock?.symbol)
                  .map((option) => (
                    <SelectItem key={option.symbol} value={option.symbol}>
                      {option.symbol} - {option.name}
                    </SelectItem>
                  ))
                }
              </SelectContent>
            </Select>
          </div>
          
          {/* Comparison Results */}
          {compareSymbol && (
            <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
              {isLoading ? (
                <div className="space-y-3">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="flex justify-between items-center">
                      <Skeleton className="h-4 w-16" />
                      <div className="flex items-center space-x-4">
                        <Skeleton className="h-4 w-12" />
                        <span className="text-slate-400">vs</span>
                        <Skeleton className="h-4 w-12" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : comparisonData ? (
                <div className="space-y-3">
                  <ComparisonRow
                    label="ROIC"
                    value1={comparisonData.stock1.ruleOneQuality?.roic}
                    value2={comparisonData.stock2.ruleOneQuality?.roic}
                    formatter={(val) => val ? `${val.toFixed(1)}%` : "N/A"}
                    onClick1={() => handleStockClick(comparisonData.stock1.symbol)}
                    onClick2={() => handleStockClick(comparisonData.stock2.symbol)}
                  />
                  
                  <ComparisonRow
                    label="Sales Growth"
                    value1={comparisonData.stock1.bigFourGrowth?.salesGrowth}
                    value2={comparisonData.stock2.bigFourGrowth?.salesGrowth}
                    formatter={(val) => val ? `${val.toFixed(1)}%` : "N/A"}
                    onClick1={() => handleStockClick(comparisonData.stock1.symbol)}
                    onClick2={() => handleStockClick(comparisonData.stock2.symbol)}
                  />
                  
                  <ComparisonRow
                    label="EPS Growth"
                    value1={comparisonData.stock1.bigFourGrowth?.epsGrowth}
                    value2={comparisonData.stock2.bigFourGrowth?.epsGrowth}
                    formatter={(val) => val ? `${val.toFixed(1)}%` : "N/A"}
                    onClick1={() => handleStockClick(comparisonData.stock1.symbol)}
                    onClick2={() => handleStockClick(comparisonData.stock2.symbol)}
                  />
                  
                  <ComparisonRow
                    label="Debt Payoff"
                    value1={comparisonData.stock1.ruleOneQuality?.debtPayoffYears}
                    value2={comparisonData.stock2.ruleOneQuality?.debtPayoffYears}
                    formatter={(val) => val ? `${val.toFixed(1)}yr` : "N/A"}
                    onClick1={() => handleStockClick(comparisonData.stock1.symbol)}
                    onClick2={() => handleStockClick(comparisonData.stock2.symbol)}
                  />
                </div>
              ) : (
                <div className="text-center text-slate-600 dark:text-slate-400 py-4">
                  Failed to load comparison data
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

interface ComparisonRowProps {
  label: string;
  value1?: number;
  value2?: number;
  formatter: (value?: number) => string;
  onClick1: () => void;
  onClick2: () => void;
}

function ComparisonRow({ label, value1, value2, formatter, onClick1, onClick2 }: ComparisonRowProps) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-sm text-slate-600 dark:text-slate-400">{label}</span>
      <div className="flex items-center space-x-4">
        <button
          onClick={onClick1}
          className="font-medium text-slate-900 dark:text-slate-100 hover:text-primary transition-colors"
        >
          {formatter(value1)}
        </button>
        <span className="text-slate-400">vs</span>
        <button
          onClick={onClick2}
          className="font-medium text-slate-600 dark:text-slate-400 hover:text-primary transition-colors"
        >
          {formatter(value2)}
        </button>
      </div>
    </div>
  );
}
