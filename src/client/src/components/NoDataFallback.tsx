import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw, Play } from "lucide-react";
import { motion } from "framer-motion";

interface NoDataFallbackProps {
  symbol: string;
  onRefresh: () => void;
  onQuickAnalysis: () => void;
  isRefreshing?: boolean;
}

export default function NoDataFallback({ 
  symbol, 
  onRefresh, 
  onQuickAnalysis,
  isRefreshing = false 
}: NoDataFallbackProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="text-center py-12">
        <CardContent>
          <div className="flex flex-col items-center space-y-6">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
              <AlertCircle className="h-8 w-8 text-gray-400" />
            </div>
            
            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                No Financial Data Available
              </h3>
              <p className="text-gray-600 dark:text-gray-400 max-w-md">
                This stock isn't covered by our financial data providers.
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-500">
                This commonly happens with smaller international stocks, recent IPOs,
                or companies from emerging markets.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button 
                onClick={onQuickAnalysis}
                className="flex items-center space-x-2"
              >
                <Play className="h-4 w-4" />
                <span>Quick Analysis</span>
              </Button>
              
              <Button 
                variant="outline" 
                onClick={onRefresh}
                disabled={isRefreshing}
                className="flex items-center space-x-2"
              >
                <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                <span>{isRefreshing ? 'Refreshing...' : 'Refresh Data'}</span>
              </Button>
            </div>

            <div className="text-xs text-gray-400 mt-4">
              <p>Try refreshing to fetch the latest data from our providers</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}