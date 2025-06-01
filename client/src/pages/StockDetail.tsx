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
import TechnicalAnalysis from "@/components/TechnicalAnalysis";
import DividendAnalysis from "@/components/DividendAnalysis";
import NewsAndSentiment from "@/components/NewsAndSentiment";
import FairValueGauge from "@/components/FairValueGauge";
import PERatioAnalysis from "@/components/PERatioAnalysis";
import BalanceSheetHealth from "@/components/BalanceSheetHealth";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

        {/* Enhanced Analysis Suite - Simply Wall Street Style */}
        <Card>
          <CardHeader>
            <CardTitle>Comprehensive Stock Analysis</CardTitle>
            <CardDescription>
              Professional-grade analysis including technical indicators, dividends, and market sentiment
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="valuation" className="w-full">
              <TabsList className="grid w-full grid-cols-6">
                <TabsTrigger value="valuation">Fair Value</TabsTrigger>
                <TabsTrigger value="advanced">Advanced Charts</TabsTrigger>
                <TabsTrigger value="technical">Technical</TabsTrigger>
                <TabsTrigger value="health">Financial Health</TabsTrigger>
                <TabsTrigger value="dividends">Dividends</TabsTrigger>
                <TabsTrigger value="news">News & Sentiment</TabsTrigger>
              </TabsList>
              
              <TabsContent value="valuation" className="mt-6">
                <div className="space-y-6">
                  <FairValueGauge
                    currentPrice={stock.price || 0}
                    stickerPrice={200.00}
                    marginOfSafetyPrice={100.00}
                    symbol={stock.symbol}
                    lastUpdated="June 1, 2025"
                  />
                  <PERatioAnalysis
                    symbol={stock.symbol}
                    currentPE={30.8}
                    industryAvgPE={20.9}
                    fairPE={33.7}
                    historicalPE={[
                      { period: "2020", pe: 28.5, price: 132.69, eps: 4.65 },
                      { period: "2021", pe: 29.2, price: 157.76, eps: 5.40 },
                      { period: "2022", pe: 25.1, price: 129.93, eps: 5.18 },
                      { period: "2023", pe: 31.4, price: 185.64, eps: 5.91 },
                      { period: "2024", pe: 30.8, price: 195.89, eps: 6.36 }
                    ]}
                    analystTargetPrice={220}
                    numAnalysts={42}
                  />
                </div>
              </TabsContent>

              <TabsContent value="advanced" className="mt-6">
                <AdvancedFinancialCharts 
                  metrics={stock.metrics || []}
                  symbol={stock.symbol}
                  marketCap={stock.marketCap}
                  sector={stock.sector}
                  exchange={stock.exchange}
                />
              </TabsContent>
              
              <TabsContent value="technical" className="mt-6">
                <TechnicalAnalysis 
                  symbol={stock.symbol}
                  currentPrice={stock.price || 0}
                  priceChange={stock.change || 0}
                  priceChangePercent={stock.changePercent || 0}
                />
              </TabsContent>

              <TabsContent value="health" className="mt-6">
                <BalanceSheetHealth
                  symbol={stock.symbol}
                  currentData={{
                    year: "2024",
                    totalAssets: 365725000000,
                    currentAssets: 143566000000,
                    totalLiabilities: 279414000000,
                    currentLiabilities: 123930000000,
                    longTermDebt: 95281000000,
                    totalEquity: 86311000000,
                    cashAndEquivalents: 67150000000
                  }}
                  historicalData={[
                    {
                      year: "2020",
                      totalAssets: 323888000000,
                      currentAssets: 143713000000,
                      totalLiabilities: 258549000000,
                      currentLiabilities: 105392000000,
                      longTermDebt: 91807000000,
                      totalEquity: 65339000000,
                      cashAndEquivalents: 38016000000
                    },
                    {
                      year: "2021", 
                      totalAssets: 351002000000,
                      currentAssets: 134836000000,
                      totalLiabilities: 287912000000,
                      currentLiabilities: 125481000000,
                      longTermDebt: 109106000000,
                      totalEquity: 63090000000,
                      cashAndEquivalents: 34940000000
                    },
                    {
                      year: "2022",
                      totalAssets: 352755000000,
                      currentAssets: 135405000000,
                      totalLiabilities: 302083000000,
                      currentLiabilities: 153982000000,
                      longTermDebt: 98959000000,
                      totalEquity: 50672000000,
                      cashAndEquivalents: 23646000000
                    },
                    {
                      year: "2023",
                      totalAssets: 352583000000,
                      currentAssets: 143566000000,
                      totalLiabilities: 290437000000,
                      currentLiabilities: 133973000000,
                      longTermDebt: 106550000000,
                      totalEquity: 62146000000,
                      cashAndEquivalents: 29965000000
                    },
                    {
                      year: "2024",
                      totalAssets: 365725000000,
                      currentAssets: 143566000000,
                      totalLiabilities: 279414000000,
                      currentLiabilities: 123930000000,
                      longTermDebt: 95281000000,
                      totalEquity: 86311000000,
                      cashAndEquivalents: 67150000000
                    }
                  ]}
                />
              </TabsContent>
              
              <TabsContent value="dividends" className="mt-6">
                <DividendAnalysis symbol={stock.symbol} />
              </TabsContent>
              
              <TabsContent value="news" className="mt-6">
                <NewsAndSentiment symbol={stock.symbol} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}