import { useState } from "react";
import Navigation from "@/components/Navigation";
import StockSearch from "@/components/StockSearch";
import StockSelector from "@/components/StockSelector";
import BigFourMetrics from "@/components/BigFourMetrics";
import FinancialTrends from "@/components/FinancialTrends";
import ValuationTools from "@/components/ValuationTools";
import Watchlist from "@/components/Watchlist";
import ComparisonPanel from "@/components/ComparisonPanel";
import NewsAndAlerts from "@/components/NewsAndAlerts";
import { useFinancialData } from "@/hooks/useFinancialData";
import { Button } from "@/components/ui/button";
import { Moon, Sun, TrendingUp } from "lucide-react";
import { useTheme } from "next-themes";

export default function Dashboard() {
  const [selectedSymbol, setSelectedSymbol] = useState<string>("AAPL");
  const { data: stockData, isLoading, error } = useFinancialData(selectedSymbol);
  const { theme, setTheme } = useTheme();

  const handleStockSelect = (symbol: string) => {
    setSelectedSymbol(symbol);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Header */}
      <header className="bg-white dark:bg-slate-800 shadow-sm border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <TrendingUp className="text-primary text-2xl" />
                <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                  Rule One Investing
                </h1>
              </div>
            </div>
            
            <div className="flex-1 max-w-md mx-8">
              <StockSearch onStockSelect={handleStockSelect} />
            </div>
            
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="text-slate-600 dark:text-slate-400 hover:text-primary"
              >
                {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>
              <Button className="bg-primary text-white hover:bg-blue-700">
                Settings
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
            <p className="text-red-700 dark:text-red-400">
              Error loading stock data: {error.message}
            </p>
          </div>
        )}

        {/* Stock Selector */}
        <StockSelector 
          stockData={stockData} 
          isLoading={isLoading}
          onStockSelect={handleStockSelect}
        />

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Analysis Section */}
          <div className="lg:col-span-2 space-y-6">
            <BigFourMetrics stockData={stockData} isLoading={isLoading} />
            <FinancialTrends stockData={stockData} isLoading={isLoading} />
            <ValuationTools 
              stockData={stockData} 
              isLoading={isLoading}
              symbol={selectedSymbol}
            />
          </div>
          
          {/* Sidebar */}
          <div className="space-y-6">
            <Watchlist onStockSelect={handleStockSelect} />
            <ComparisonPanel 
              currentStock={stockData}
              onStockSelect={handleStockSelect}
            />
            <NewsAndAlerts />
          </div>
        </div>
      </div>
    </div>
  );
}
