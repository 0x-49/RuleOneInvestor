import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Shield, BarChart3, Target } from "lucide-react";

export default function Landing() {
  const handleSignIn = () => {
    window.location.href = "/api/login";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-2 mb-6">
            <TrendingUp className="h-8 w-8 text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              Rule One Investing Assistant
            </h1>
          </div>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Analyze stocks using Phil Town's proven Rule One methodology. Make informed investment decisions with automated Big Four growth calculations and margin of safety analysis.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <Card>
            <CardHeader>
              <BarChart3 className="h-12 w-12 text-blue-600 mb-4" />
              <CardTitle>Big Four Growth Analysis</CardTitle>
              <CardDescription>
                Automatically calculate sales growth, EPS growth, equity growth, and free cash flow growth over 10-year periods.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Target className="h-12 w-12 text-green-600 mb-4" />
              <CardTitle>Margin of Safety Calculator</CardTitle>
              <CardDescription>
                Calculate sticker price and margin of safety price using Phil Town's proven valuation methodology.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Shield className="h-12 w-12 text-purple-600 mb-4" />
              <CardTitle>Rule One Quality Scoring</CardTitle>
              <CardDescription>
                Evaluate companies based on debt payoff years, ROIC analysis, and overall Rule One quality metrics.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle>Start Your Investment Analysis</CardTitle>
              <CardDescription>
                Sign in with your Google account to access personalized stock analysis, watchlists, and portfolio tracking.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={handleSignIn}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                size="lg"
              >
                Sign in with Google
              </Button>
              <p className="text-sm text-gray-500 mt-4">
                Free to use • Secure authentication • Your data stays private
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="text-center mt-16 text-gray-500 dark:text-gray-400">
          <p>Built for investors who want to apply Phil Town's Rule One methodology with modern tools</p>
        </div>
      </div>
    </div>
  );
}