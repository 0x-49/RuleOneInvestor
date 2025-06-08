import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Target, 
  Database,
  BarChart3,
  Zap,
  Globe,
  ChevronRight,
  Play,
  Pause,
  RefreshCw
} from "lucide-react";
import BigFourMetrics from "./BigFourMetrics";
import { BatchAnalysisPanel } from "./BatchAnalysisPanel";
import Watchlist from "./Watchlist";
import ValuationTools from "./ValuationTools";
import StockSearch from "./StockSearch";

interface DashboardStats {
  companiesTracked: number;
  analyzedToday: number;
  avgRuleOneQuality: number; // Matches backend, value is 0-1 for percentage
  avgGrowthRate: number;   // Matches backend, value is 0-1 for percentage
}

export function EnhancedDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedSymbol, setSelectedSymbol] = useState("AAPL");
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loadingStats, setLoadingStats] = useState(true);
  const [statsError, setStatsError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      setLoadingStats(true);
      setStatsError(null);
      try {
        const response = await fetch('/api/dashboard-stats/summary');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: DashboardStats = await response.json();
        setStats(data);
      } catch (error) {
        console.error("Failed to fetch dashboard stats:", error);
        setStatsError(error instanceof Error ? error.message : String(error));
        // Set to default/placeholder stats on error to avoid breaking UI
        setStats({
          companiesTracked: 0,
          analyzedToday: 0,
          avgRuleOneQuality: 0,
          avgGrowthRate: 0
        });
      } finally {
        setLoadingStats(false);
      }
    };

    fetchDashboardStats();
  }, []);

  const handleStockSelect = (symbol: string) => {
    setSelectedSymbol(symbol);
  };

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  };

  const staggerChildren = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      <div className="container mx-auto px-4 py-6 space-y-6">
        
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-6"
        >
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
            Rule One Investing Assistant
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            AI-powered analysis of {stats ? stats.companiesTracked.toLocaleString() : '...'} global companies using Phil Town's Rule One methodology
          </p>
          
          {/* Prominent Stock Search Bar */}
          <div className="max-w-md mx-auto">
            <Card className="border-2 border-primary/20 shadow-lg">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  <span className="font-semibold text-primary">Search Stocks</span>
                </div>
                <StockSearch onStockSelect={handleStockSelect} />
                <p className="text-xs text-muted-foreground mt-2 text-center">
                  Search by symbol (AAPL, MSFT) or company name
                </p>
              </CardContent>
            </Card>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          variants={staggerChildren}
          initial="initial"
          animate="animate"
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {loadingStats && (
            <p className="text-center col-span-full py-8 text-muted-foreground">Loading dashboard statistics...</p>
          )}
          {statsError && (
            <p className="text-center col-span-full py-8 text-red-500">Error loading stats: {statsError}</p>
          )}
          {stats && !loadingStats && !statsError &&
            [
              {
                label: "Companies Tracked",
                value: stats.companiesTracked.toLocaleString(),
                icon: Globe,
                color: "text-blue-600",
                bgColor: "bg-blue-50"
              },
              {
                label: "Analyzed Today",
                value: stats.analyzedToday.toLocaleString(),
                icon: Zap,
                color: "text-green-600",
                bgColor: "bg-green-50"
              },
              {
                label: "Rule One Quality",
                value: `${(stats.avgRuleOneQuality * 100).toFixed(0)}%`,
                icon: Target,
                color: "text-purple-600",
                bgColor: "bg-purple-50"
              },
              {
                label: "Avg Growth",
                value: `${(stats.avgGrowthRate * 100).toFixed(1)}%`,
                icon: TrendingUp,
                color: "text-orange-600",
                bgColor: "bg-orange-50"
              }
            ].map((statItem, index) => (
              <motion.div key={index} variants={fadeInUp}>
                <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">{statItem.label}</p>
                        <p className="text-2xl font-bold">{statItem.value}</p>
                      </div>
                      <div className={`p-3 rounded-full ${statItem.bgColor}`}>
                        <statItem.icon className={`h-6 w-6 ${statItem.color}`} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
        </motion.div>

        {/* Main Content Tabs */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 h-auto p-1">
              <TabsTrigger 
                value="overview" 
                className="flex items-center gap-2 py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <BarChart3 className="h-4 w-4" />
                <span className="hidden sm:inline">Overview</span>
              </TabsTrigger>
              <TabsTrigger 
                value="batch" 
                className="flex items-center gap-2 py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <Database className="h-4 w-4" />
                <span className="hidden sm:inline">Batch Analysis</span>
              </TabsTrigger>
              <TabsTrigger 
                value="analysis" 
                className="flex items-center gap-2 py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <TrendingUp className="h-4 w-4" />
                <span className="hidden sm:inline">Analysis</span>
              </TabsTrigger>
              <TabsTrigger 
                value="watchlist" 
                className="flex items-center gap-2 py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <Target className="h-4 w-4" />
                <span className="hidden sm:inline">Watchlist</span>
              </TabsTrigger>
              <TabsTrigger 
                value="valuation" 
                className="flex items-center gap-2 py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <DollarSign className="h-4 w-4" />
                <span className="hidden sm:inline">Valuation</span>
              </TabsTrigger>
            </TabsList>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <TabsContent value="overview" className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card className="col-span-full">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Globe className="h-5 w-5" />
                          Global Portfolio Overview
                        </CardTitle>
                        <CardDescription>
                          Your Rule One investment universe across major global markets
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          {[
                            { region: "North America", companies: 156, growth: "+12.3%" },
                            { region: "Europe", companies: 89, growth: "+8.7%" },
                            { region: "Asia Pacific", companies: 142, growth: "+15.2%" },
                            { region: "Emerging Markets", companies: 36, growth: "+6.8%" }
                          ].map((market, index) => (
                            <motion.div
                              key={market.region}
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: index * 0.1 }}
                              className="text-center p-4 rounded-lg bg-muted/50 hover:bg-muted/70 transition-colors"
                            >
                              <div className="font-semibold text-lg">{market.companies}</div>
                              <div className="text-sm text-muted-foreground">{market.region}</div>
                              <div className="text-sm font-medium text-green-600">{market.growth}</div>
                            </motion.div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                    
                    <BigFourMetrics symbol={selectedSymbol} isLoading={false} />
                    <Watchlist onStockSelect={handleStockSelect} />
                  </div>
                </TabsContent>

                <TabsContent value="batch">
                  <BatchAnalysisPanel />
                </TabsContent>

                <TabsContent value="analysis">
                  <BigFourMetrics symbol={selectedSymbol} isLoading={false} />
                </TabsContent>

                <TabsContent value="watchlist">
                  <Watchlist onStockSelect={handleStockSelect} />
                </TabsContent>

                <TabsContent value="valuation">
                  <ValuationTools symbol={selectedSymbol} isLoading={false} />
                </TabsContent>
              </motion.div>
            </AnimatePresence>
          </Tabs>
        </motion.div>

        {/* Quick Actions Floating Panel */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="fixed bottom-6 right-6 z-50"
        >
          <Card className="p-2 shadow-lg border-2">
            <div className="flex flex-col gap-2">
              <Button size="sm" className="w-full justify-start">
                <Play className="h-4 w-4 mr-2" />
                Quick Analysis
              </Button>
              <Button size="sm" variant="outline" className="w-full justify-start">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh Data
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}