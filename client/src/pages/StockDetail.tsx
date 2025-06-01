import { useParams, Link } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { ArrowLeft, TrendingUp, TrendingDown, DollarSign, Target, RefreshCw } from "lucide-react";
import BigFourMetrics from "@/components/BigFourMetrics";
import ValuationTools from "@/components/ValuationTools";
import FinancialTrends from "@/components/FinancialTrends";
import RuleOneAnalysis from "@/components/RuleOneAnalysis";
import AdvancedFinancialCharts from "@/components/AdvancedFinancialCharts";
import DetailedFinancialTable from "@/components/DetailedFinancialTable";
import { StockWithMetrics } from "@shared/schema";

export default function StockDetail() {
  const { symbol } = useParams<{ symbol: string }>();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const { data: stock, isLoading, error } = useQuery<StockWithMetrics>({
    queryKey: [`/api/stocks/${symbol}`],
    enabled: !!symbol,
  });

  const refreshDataMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("POST", `/api/stocks/${symbol}/refresh`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/stocks/${symbol}`] });
      toast({
        title: "Data Refreshed",
        description: "Financial data has been updated with the latest information.",
      });
    },
    onError: () => {
      toast({
        title: "Refresh Failed",
        description: "Could not refresh financial data. Please try again.",
        variant: "destructive",
      });
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
        <div className="container mx-auto px-4 py-6">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-muted rounded w-1/4"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-32 bg-muted rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !stock) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
        <div className="container mx-auto px-4 py-6">
          <Link href="/">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <Card>
            <CardContent className="p-8 text-center">
              <h2 className="text-xl font-semibold mb-2">Stock Not Found</h2>
              <p className="text-muted-foreground">
                Could not load data for {symbol?.toUpperCase()}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const changePercent = stock.changePercent || 0;
  const isPositive = changePercent >= 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      <div className="container mx-auto px-4 py-6 space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <Link href="/">
            <Button variant="ghost">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          
          {stock && (
            <Button 
              onClick={() => refreshDataMutation.mutate()}
              disabled={refreshDataMutation.isPending}
              variant="outline"
              className="flex items-center space-x-2"
            >
              <RefreshCw className={`h-4 w-4 ${refreshDataMutation.isPending ? 'animate-spin' : ''}`} />
              <span>
                {refreshDataMutation.isPending ? 'Fetching Data...' : 'Refresh Financial Data'}
              </span>
            </Button>
          )}
        </div>

        {/* Loading Progress for Data Refresh */}
        {refreshDataMutation.isPending && (
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">Fetching Financial Data from Alpha Vantage</h3>
                  <span className="text-sm text-muted-foreground">Premium API</span>
                </div>
                <Progress value={66} className="w-full" />
                <p className="text-sm text-muted-foreground">
                  Retrieving 10+ years of income statements, balance sheets, and cash flow data...
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Stock Overview */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-3xl font-bold">{stock.symbol}</CardTitle>
                <CardDescription className="text-lg">{stock.name}</CardDescription>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold">${stock.price.toFixed(2)}</div>
                <div className={`flex items-center ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                  {isPositive ? <TrendingUp className="h-4 w-4 mr-1" /> : <TrendingDown className="h-4 w-4 mr-1" />}
                  {isPositive ? '+' : ''}{changePercent.toFixed(2)}%
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-sm text-muted-foreground">Market Cap</div>
                <div className="font-semibold">
                  {stock.marketCap ? `$${(stock.marketCap / 1e12).toFixed(2)}T` : '$0.0B'}
                </div>
              </div>
              <div className="text-center">
                <div className="text-sm text-muted-foreground">Volume</div>
                <div className="font-semibold">{(stock.volume || 0).toLocaleString()}</div>
              </div>
              <div className="text-center">
                <div className="text-sm text-muted-foreground">Exchange</div>
                <div className="font-semibold">{stock.exchange || 'N/A'}</div>
              </div>
              <div className="text-center">
                <div className="text-sm text-muted-foreground">Sector</div>
                <div className="font-semibold">{stock.sector || 'N/A'}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Analysis Tabs */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Big Four Metrics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="h-5 w-5 mr-2" />
                Rule One Analysis
              </CardTitle>
              <CardDescription>
                Phil Town's Big Four growth metrics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <BigFourMetrics stockData={stock} isLoading={false} />
              
              {/* Detailed Financial Data Tables for Each Big Four Metric */}
              {stock.metrics && stock.metrics.length > 0 && (
                <div className="space-y-4 mt-6">
                  <DetailedFinancialTable 
                    metrics={stock.metrics}
                    metricType="revenue"
                    title="Sales Revenue"
                    unit="Revenue"
                    growthRate={stock.bigFourGrowth?.salesGrowth || null}
                  />
                  
                  <DetailedFinancialTable 
                    metrics={stock.metrics}
                    metricType="eps"
                    title="Earnings Per Share"
                    unit="EPS"
                    growthRate={stock.bigFourGrowth?.epsGrowth || null}
                  />
                  
                  <DetailedFinancialTable 
                    metrics={stock.metrics}
                    metricType="bookValue"
                    title="Book Value (Equity)"
                    unit="Equity"
                    growthRate={stock.bigFourGrowth?.equityGrowth || null}
                  />
                  
                  <DetailedFinancialTable 
                    metrics={stock.metrics}
                    metricType="freeCashFlow"
                    title="Free Cash Flow"
                    unit="FCF"
                    growthRate={stock.bigFourGrowth?.fcfGrowth || null}
                  />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Valuation Tools */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <DollarSign className="h-5 w-5 mr-2" />
                Valuation Analysis
              </CardTitle>
              <CardDescription>
                Margin of safety and fair value calculations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ValuationTools stockData={stock} isLoading={false} symbol={stock.symbol} />
            </CardContent>
          </Card>
        </div>

        {/* Financial Trends */}
        <Card>
          <CardHeader>
            <CardTitle>Historical Financial Trends</CardTitle>
            <CardDescription>
              10-year revenue, earnings, and cash flow analysis
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FinancialTrends stockData={stock} isLoading={false} />
          </CardContent>
        </Card>

        {/* Comprehensive Rule One Analysis */}
        <RuleOneAnalysis 
          ruleOneData={{
            salesGrowth: stock.bigFourGrowth?.salesGrowth || null,
            epsGrowth: stock.bigFourGrowth?.epsGrowth || null,
            equityGrowth: stock.bigFourGrowth?.equityGrowth || null,
            fcfGrowth: stock.bigFourGrowth?.fcfGrowth || null,
            roic: stock.ruleOneQuality?.roic || null,
            debtPayoffYears: stock.ruleOneQuality?.debtPayoffYears || null,
            stickerPrice: stock.ruleOneQuality?.stickerPrice || null,
            marginOfSafetyPrice: stock.ruleOneQuality?.marginOfSafety || null,
            isExcellent: stock.ruleOneQuality?.isExcellent || false,
            qualityScore: stock.ruleOneQuality?.qualityScore || 0,
            investmentStory: stock.ruleOneQuality?.investmentStory || "Analysis pending..."
          }}
          currentPrice={stock.price}
          symbol={stock.symbol}
        />

        {/* Advanced Financial Charts & Data Visualization */}
        <AdvancedFinancialCharts 
          metrics={stock.metrics}
          symbol={stock.symbol}
          marketCap={stock.marketCap}
          sector={stock.sector}
          exchange={stock.exchange}
        />

      </div>
    </div>
  );
}