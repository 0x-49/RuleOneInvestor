import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, TrendingDown, Shield, Target, DollarSign, BarChart3 } from "lucide-react";

interface RuleOneData {
  salesGrowth: number | null;
  epsGrowth: number | null;
  equityGrowth: number | null;
  fcfGrowth: number | null;
  roic: number | null;
  debtPayoffYears: number | null;
  stickerPrice: number | null;
  marginOfSafetyPrice: number | null;
  isExcellent: boolean;
  qualityScore: number;
  investmentStory: string;
}

interface Props {
  ruleOneData: RuleOneData;
  currentPrice: number;
  symbol: string;
}

export default function RuleOneAnalysis({ ruleOneData, currentPrice, symbol }: Props) {
  const {
    salesGrowth,
    epsGrowth,
    equityGrowth,
    fcfGrowth,
    roic,
    debtPayoffYears,
    stickerPrice,
    marginOfSafetyPrice,
    isExcellent,
    qualityScore,
    investmentStory
  } = ruleOneData;

  const formatPercentage = (value: number | null) => {
    if (value === null) return "N/A";
    return `${value.toFixed(1)}%`;
  };

  const formatPrice = (value: number | null) => {
    if (value === null) return "N/A";
    return `$${value.toFixed(2)}`;
  };

  const getGrowthStatus = (value: number | null, target: number = 10) => {
    if (value === null) return "neutral";
    return value >= target ? "excellent" : value >= 5 ? "fair" : "poor";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "excellent": return "text-green-600 bg-green-50";
      case "fair": return "text-yellow-600 bg-yellow-50";
      case "poor": return "text-red-600 bg-red-50";
      default: return "text-gray-600 bg-gray-50";
    }
  };

  const bigFourMetrics = [
    { name: "Sales Growth", value: salesGrowth, icon: TrendingUp, target: 10 },
    { name: "EPS Growth", value: epsGrowth, icon: DollarSign, target: 10 },
    { name: "Equity Growth", value: equityGrowth, icon: BarChart3, target: 10 },
    { name: "FCF Growth", value: fcfGrowth, icon: TrendingUp, target: 10 }
  ];

  const getValuationSignal = () => {
    if (!stickerPrice || !marginOfSafetyPrice) return null;
    
    if (currentPrice <= marginOfSafetyPrice) {
      return { signal: "BUY", color: "text-green-600 bg-green-50", icon: Shield };
    } else if (currentPrice <= stickerPrice) {
      return { signal: "HOLD", color: "text-yellow-600 bg-yellow-50", icon: Target };
    } else {
      return { signal: "AVOID", color: "text-red-600 bg-red-50", icon: TrendingDown };
    }
  };

  const valuationSignal = getValuationSignal();

  return (
    <div className="space-y-6">
      {/* Rule One Quality Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Rule One Quality Assessment
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="text-center">
              <div className={`text-2xl font-bold ${isExcellent ? 'text-green-600' : 'text-red-600'}`}>
                {isExcellent ? "EXCELLENT" : "CAUTION"}
              </div>
              <div className="text-sm text-gray-600">Overall Quality</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{qualityScore}/100</div>
              <div className="text-sm text-gray-600">Quality Score</div>
              <Progress value={qualityScore} className="mt-2" />
            </div>
            <div className="text-center">
              {valuationSignal && (
                <>
                  <Badge className={valuationSignal.color}>
                    <valuationSignal.icon className="h-4 w-4 mr-1" />
                    {valuationSignal.signal}
                  </Badge>
                  <div className="text-sm text-gray-600 mt-1">Investment Signal</div>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Big Four Growth Metrics */}
      <Card>
        <CardHeader>
          <CardTitle>Phil Town's "Big Four" Growth Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {bigFourMetrics.map((metric) => {
              const status = getGrowthStatus(metric.value, metric.target);
              const Icon = metric.icon;
              
              return (
                <div key={metric.name} className={`p-4 rounded-lg border ${getStatusColor(status)}`}>
                  <div className="flex items-center justify-between mb-2">
                    <Icon className="h-5 w-5" />
                    <span className="text-xs font-medium">10Y CAGR</span>
                  </div>
                  <div className="text-2xl font-bold mb-1">
                    {formatPercentage(metric.value)}
                  </div>
                  <div className="text-sm font-medium">{metric.name}</div>
                  <div className="text-xs mt-1">
                    Target: ≥{metric.target}%
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Financial Quality Metrics */}
      <Card>
        <CardHeader>
          <CardTitle>Financial Quality Indicators</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Return on Invested Capital (ROIC)</span>
                  <span className={`text-lg font-bold ${(roic ?? 0) >= 10 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatPercentage(roic)}
                  </span>
                </div>
                <div className="text-xs text-gray-600">Rule One Target: ≥10%</div>
                {roic && <Progress value={Math.min(roic, 50)} className="mt-2" />}
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Debt Payoff Time</span>
                  <span className={`text-lg font-bold ${(debtPayoffYears ?? 0) <= 3 ? 'text-green-600' : 'text-red-600'}`}>
                    {debtPayoffYears ? `${debtPayoffYears.toFixed(1)} years` : "No debt"}
                  </span>
                </div>
                <div className="text-xs text-gray-600">Rule One Target: ≤3 years</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Valuation Analysis */}
      {stickerPrice && marginOfSafetyPrice && (
        <Card>
          <CardHeader>
            <CardTitle>Rule One Valuation Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{formatPrice(currentPrice)}</div>
                <div className="text-sm text-gray-600">Current Price</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{formatPrice(stickerPrice)}</div>
                <div className="text-sm text-gray-600">Sticker Price (Fair Value)</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">{formatPrice(marginOfSafetyPrice)}</div>
                <div className="text-sm text-gray-600">Margin of Safety (50% off)</div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Margin of Safety Price</span>
                <span className="font-mono">{formatPrice(marginOfSafetyPrice)}</span>
              </div>
              <div className="flex justify-between">
                <span>Fair Value (Sticker Price)</span>
                <span className="font-mono">{formatPrice(stickerPrice)}</span>
              </div>
              <div className="flex justify-between font-bold">
                <span>Current Market Price</span>
                <span className="font-mono">{formatPrice(currentPrice)}</span>
              </div>
              
              {currentPrice && stickerPrice && (
                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <div className="text-sm">
                    <strong>Price vs Fair Value: </strong>
                    {currentPrice > stickerPrice 
                      ? `${(((currentPrice - stickerPrice) / stickerPrice) * 100).toFixed(1)}% overvalued`
                      : `${(((stickerPrice - currentPrice) / stickerPrice) * 100).toFixed(1)}% undervalued`
                    }
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Investment Story */}
      <Card>
        <CardHeader>
          <CardTitle>Investment Analysis & Story</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose prose-sm max-w-none">
            <div className="whitespace-pre-line">{investmentStory}</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}