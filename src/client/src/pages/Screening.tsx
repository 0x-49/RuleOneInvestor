import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TrendingUp, DollarSign, BarChart3, PiggyBank, Filter, Download, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { StockWithMetrics } from "@shared/schema";
import { formatCurrency, formatPercentage } from "@/lib/utils";

interface ScreeningFilters {
  salesGrowthMin: number;
  salesGrowthMax: number;
  epsGrowthMin: number;
  epsGrowthMax: number;
  equityGrowthMin: number;
  equityGrowthMax: number;
  fcfGrowthMin: number;
  fcfGrowthMax: number;
  roicMin: number;
  roicMax: number;
  debtToEquityMax: number;
  marketCapMin: number;
  marketCapMax: number;
  priceMin: number;
  priceMax: number;
  timeFrame: '1year' | '5year' | '10year';
  exchange: 'all' | 'nasdaq' | 'nyse' | 'tsx' | 'lse' | 'asx';
}

const defaultFilters: ScreeningFilters = {
  salesGrowthMin: 10,
  salesGrowthMax: 1000,
  epsGrowthMin: 10,
  epsGrowthMax: 1000,
  equityGrowthMin: 10,
  equityGrowthMax: 1000,
  fcfGrowthMin: 10,
  fcfGrowthMax: 1000,
  roicMin: 15,
  roicMax: 100,
  debtToEquityMax: 50,
  marketCapMin: 1000,
  marketCapMax: 1000000,
  priceMin: 1,
  priceMax: 10000,
  timeFrame: '10year',
  exchange: 'all'
};

export default function Screening() {
  const [stocks, setStocks] = useState<StockWithMetrics[]>([]);
  const [filteredStocks, setFilteredStocks] = useState<StockWithMetrics[]>([]);
  const [filters, setFilters] = useState<ScreeningFilters>(defaultFilters);
  const [isLoading, setIsLoading] = useState(false);
  const [loadSize, setLoadSize] = useState<100 | 1000 | 10000>(100);
  const [showFilters, setShowFilters] = useState(true);
  const { toast } = useToast();

  const loadStocks = async (size: number) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/screening/stocks?limit=${size}`);
      if (!response.ok) throw new Error('Failed to load stocks');
      
      const data = await response.json();
      setStocks(data);
      setFilteredStocks(data);
      
      toast({
        title: "Stocks Loaded",
        description: `Successfully loaded ${data.length} stocks for screening.`,
      });
    } catch (error) {
      toast({
        title: "Loading Failed",
        description: "Failed to load stocks. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const applyFilters = () => {
    const filtered = stocks.filter(stock => {
      if (!stock.bigFourGrowth || !stock.ruleOneQuality) return false;

      const growth = stock.bigFourGrowth;
      const quality = stock.ruleOneQuality;

      // Growth filters
      if (growth.salesGrowth < filters.salesGrowthMin || growth.salesGrowth > filters.salesGrowthMax) return false;
      if (growth.epsGrowth < filters.epsGrowthMin || growth.epsGrowth > filters.epsGrowthMax) return false;
      if (growth.equityGrowth < filters.equityGrowthMin || growth.equityGrowth > filters.equityGrowthMax) return false;
      if (growth.fcfGrowth < filters.fcfGrowthMin || growth.fcfGrowth > filters.fcfGrowthMax) return false;

      // Quality filters
      if (quality.roic < filters.roicMin || quality.roic > filters.roicMax) return false;
      if (quality.debtPayoffYears > filters.debtToEquityMax) return false;

      // Price filters
      if (stock.price < filters.priceMin || stock.price > filters.priceMax) return false;

      return true;
    });

    setFilteredStocks(filtered);
    
    toast({
      title: "Filters Applied",
      description: `Found ${filtered.length} stocks matching your criteria.`,
    });
  };

  const resetFilters = () => {
    setFilters(defaultFilters);
    setFilteredStocks(stocks);
  };

  const exportResults = () => {
    const csvContent = [
      ['Symbol', 'Name', 'Price', 'Sales Growth', 'EPS Growth', 'Equity Growth', 'FCF Growth', 'ROIC', 'Debt Payoff Years', 'Margin of Safety'],
      ...filteredStocks.map(stock => [
        stock.symbol,
        stock.name,
        stock.price.toFixed(2),
        stock.bigFourGrowth?.salesGrowth.toFixed(1) + '%' || 'N/A',
        stock.bigFourGrowth?.epsGrowth.toFixed(1) + '%' || 'N/A',
        stock.bigFourGrowth?.equityGrowth.toFixed(1) + '%' || 'N/A',
        stock.bigFourGrowth?.fcfGrowth.toFixed(1) + '%' || 'N/A',
        stock.ruleOneQuality?.roic.toFixed(1) + '%' || 'N/A',
        stock.ruleOneQuality?.debtPayoffYears.toFixed(1) || 'N/A',
        stock.ruleOneQuality?.marginOfSafety.toFixed(1) + '%' || 'N/A'
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `rule-one-screening-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  useEffect(() => {
    loadStocks(100);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="container mx-auto p-6 space-y-6">
        <Navigation />
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
            Stock Screening
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2">
            Find Rule One investment opportunities with comprehensive filtering
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center space-x-2"
          >
            <Filter className="h-4 w-4" />
            <span>{showFilters ? 'Hide' : 'Show'} Filters</span>
          </Button>
          <Button
            onClick={exportResults}
            disabled={filteredStocks.length === 0}
            className="flex items-center space-x-2"
          >
            <Download className="h-4 w-4" />
            <span>Export CSV</span>
          </Button>
        </div>
      </div>

      {/* Load Size Selector */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <RefreshCw className="h-5 w-5" />
            <span>Data Loading</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <Label>Load stocks:</Label>
            <div className="flex space-x-2">
              {[100, 1000, 10000].map((size) => (
                <Button
                  key={size}
                  variant={loadSize === size ? "default" : "outline"}
                  onClick={() => {
                    setLoadSize(size as 100 | 1000 | 10000);
                    loadStocks(size);
                  }}
                  disabled={isLoading}
                  className="w-20"
                >
                  {size === 10000 ? '10K' : size}
                </Button>
              ))}
            </div>
            <Badge variant="secondary">
              {filteredStocks.length} of {stocks.length} stocks
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Filters Panel */}
      {showFilters && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Rule One Screening Filters</span>
              <div className="flex space-x-2">
                <Button variant="outline" onClick={resetFilters}>
                  Reset
                </Button>
                <Button onClick={applyFilters}>
                  Apply Filters
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Time Frame */}
            <div className="grid grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label>Time Frame</Label>
                <Select
                  value={filters.timeFrame}
                  onValueChange={(value: '1year' | '5year' | '10year') =>
                    setFilters({ ...filters, timeFrame: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1year">1 Year</SelectItem>
                    <SelectItem value="5year">5 Years</SelectItem>
                    <SelectItem value="10year">10 Years</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Exchange</Label>
                <Select
                  value={filters.exchange}
                  onValueChange={(value: typeof filters.exchange) =>
                    setFilters({ ...filters, exchange: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Exchanges</SelectItem>
                    <SelectItem value="nasdaq">NASDAQ</SelectItem>
                    <SelectItem value="nyse">NYSE</SelectItem>
                    <SelectItem value="tsx">TSX (Canada)</SelectItem>
                    <SelectItem value="lse">LSE (UK)</SelectItem>
                    <SelectItem value="asx">ASX (Australia)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Big Four Growth Filters */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center space-x-2">
                <TrendingUp className="h-5 w-5" />
                <span>Big Four Growth Rates (%)</span>
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Sales Growth: {filters.salesGrowthMin}% - {filters.salesGrowthMax}%</Label>
                  <div className="flex space-x-2">
                    <Input
                      type="number"
                      value={filters.salesGrowthMin}
                      onChange={(e) => setFilters({ ...filters, salesGrowthMin: Number(e.target.value) })}
                      className="w-20"
                    />
                    <span className="self-center">to</span>
                    <Input
                      type="number"
                      value={filters.salesGrowthMax}
                      onChange={(e) => setFilters({ ...filters, salesGrowthMax: Number(e.target.value) })}
                      className="w-20"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>EPS Growth: {filters.epsGrowthMin}% - {filters.epsGrowthMax}%</Label>
                  <div className="flex space-x-2">
                    <Input
                      type="number"
                      value={filters.epsGrowthMin}
                      onChange={(e) => setFilters({ ...filters, epsGrowthMin: Number(e.target.value) })}
                      className="w-20"
                    />
                    <span className="self-center">to</span>
                    <Input
                      type="number"
                      value={filters.epsGrowthMax}
                      onChange={(e) => setFilters({ ...filters, epsGrowthMax: Number(e.target.value) })}
                      className="w-20"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Equity Growth: {filters.equityGrowthMin}% - {filters.equityGrowthMax}%</Label>
                  <div className="flex space-x-2">
                    <Input
                      type="number"
                      value={filters.equityGrowthMin}
                      onChange={(e) => setFilters({ ...filters, equityGrowthMin: Number(e.target.value) })}
                      className="w-20"
                    />
                    <span className="self-center">to</span>
                    <Input
                      type="number"
                      value={filters.equityGrowthMax}
                      onChange={(e) => setFilters({ ...filters, equityGrowthMax: Number(e.target.value) })}
                      className="w-20"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>FCF Growth: {filters.fcfGrowthMin}% - {filters.fcfGrowthMax}%</Label>
                  <div className="flex space-x-2">
                    <Input
                      type="number"
                      value={filters.fcfGrowthMin}
                      onChange={(e) => setFilters({ ...filters, fcfGrowthMin: Number(e.target.value) })}
                      className="w-20"
                    />
                    <span className="self-center">to</span>
                    <Input
                      type="number"
                      value={filters.fcfGrowthMax}
                      onChange={(e) => setFilters({ ...filters, fcfGrowthMax: Number(e.target.value) })}
                      className="w-20"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Quality Filters */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center space-x-2">
                <BarChart3 className="h-5 w-5" />
                <span>Quality Metrics</span>
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>ROIC: {filters.roicMin}% - {filters.roicMax}%</Label>
                  <div className="flex space-x-2">
                    <Input
                      type="number"
                      value={filters.roicMin}
                      onChange={(e) => setFilters({ ...filters, roicMin: Number(e.target.value) })}
                      className="w-20"
                    />
                    <span className="self-center">to</span>
                    <Input
                      type="number"
                      value={filters.roicMax}
                      onChange={(e) => setFilters({ ...filters, roicMax: Number(e.target.value) })}
                      className="w-20"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Max Debt Payoff Years: {filters.debtToEquityMax}</Label>
                  <Input
                    type="number"
                    value={filters.debtToEquityMax}
                    onChange={(e) => setFilters({ ...filters, debtToEquityMax: Number(e.target.value) })}
                    className="w-32"
                  />
                </div>
              </div>
            </div>

            {/* Price Filters */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center space-x-2">
                <DollarSign className="h-5 w-5" />
                <span>Price Range</span>
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Stock Price: ${filters.priceMin} - ${filters.priceMax}</Label>
                  <div className="flex space-x-2">
                    <Input
                      type="number"
                      value={filters.priceMin}
                      onChange={(e) => setFilters({ ...filters, priceMin: Number(e.target.value) })}
                      className="w-24"
                    />
                    <span className="self-center">to</span>
                    <Input
                      type="number"
                      value={filters.priceMax}
                      onChange={(e) => setFilters({ ...filters, priceMax: Number(e.target.value) })}
                      className="w-24"
                    />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Results Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Screening Results</span>
            <Badge variant="outline">
              {filteredStocks.length} stocks found
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              {[...Array(10)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Symbol</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Sales Growth</TableHead>
                    <TableHead>EPS Growth</TableHead>
                    <TableHead>Equity Growth</TableHead>
                    <TableHead>FCF Growth</TableHead>
                    <TableHead>ROIC</TableHead>
                    <TableHead>Debt Payoff</TableHead>
                    <TableHead>Margin of Safety</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStocks.map((stock) => (
                    <TableRow key={stock.symbol} className="hover:bg-slate-50 dark:hover:bg-slate-800">
                      <TableCell className="font-medium">{stock.symbol}</TableCell>
                      <TableCell className="max-w-48 truncate">{stock.name}</TableCell>
                      <TableCell>{formatCurrency(stock.price)}</TableCell>
                      <TableCell className={stock.bigFourGrowth?.salesGrowth >= 10 ? "text-green-600" : "text-red-600"}>
                        {formatPercentage(stock.bigFourGrowth?.salesGrowth || 0)}
                      </TableCell>
                      <TableCell className={stock.bigFourGrowth?.epsGrowth >= 10 ? "text-green-600" : "text-red-600"}>
                        {formatPercentage(stock.bigFourGrowth?.epsGrowth || 0)}
                      </TableCell>
                      <TableCell className={stock.bigFourGrowth?.equityGrowth >= 10 ? "text-green-600" : "text-red-600"}>
                        {formatPercentage(stock.bigFourGrowth?.equityGrowth || 0)}
                      </TableCell>
                      <TableCell className={stock.bigFourGrowth?.fcfGrowth >= 10 ? "text-green-600" : "text-red-600"}>
                        {formatPercentage(stock.bigFourGrowth?.fcfGrowth || 0)}
                      </TableCell>
                      <TableCell className={stock.ruleOneQuality?.roic >= 15 ? "text-green-600" : "text-red-600"}>
                        {formatPercentage(stock.ruleOneQuality?.roic || 0)}
                      </TableCell>
                      <TableCell className={stock.ruleOneQuality?.debtPayoffYears <= 10 ? "text-green-600" : "text-red-600"}>
                        {stock.ruleOneQuality?.debtPayoffYears.toFixed(1)}y
                      </TableCell>
                      <TableCell className={stock.ruleOneQuality?.marginOfSafety >= 50 ? "text-green-600" : "text-red-600"}>
                        {formatPercentage(stock.ruleOneQuality?.marginOfSafety || 0)}
                      </TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => window.open(`/?stock=${stock.symbol}`, '_blank')}
                        >
                          Analyze
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredStocks.length === 0 && !isLoading && (
                    <TableRow>
                      <TableCell colSpan={11} className="text-center py-8 text-slate-500">
                        No stocks match your current filter criteria. Try adjusting your filters.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
      </div>
    </div>
  );
}