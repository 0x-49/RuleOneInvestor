import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Loader2, Play, Database, TrendingUp, AlertCircle, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";

interface BatchProgress {
  total: number;
  processed: number;
  successful: number;
  failed: number;
  currentSymbol?: string;
  startTime: string;
  estimatedCompletion?: string;
}

interface CompanyResult {
  symbol: string;
  success: boolean;
  dataSource: 'api' | 'deep_search' | 'failed';
  yearsOfData: number;
  ruleOneMetrics?: {
    salesGrowth: number | null;
    epsGrowth: number | null;
    equityGrowth: number | null;
    fcfGrowth: number | null;
    roic: number | null;
    debtPayoffYears: number | null;
  };
  error?: string;
}

export function BatchAnalysisPanel() {
  const { toast } = useToast();
  const [isRunning, setIsRunning] = useState(false);

  // Start batch analysis
  const startBatchMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/batch/start");
      return await res.json();
    },
    onSuccess: () => {
      setIsRunning(true);
      toast({
        title: "Batch Analysis Started",
        description: "Processing 400+ companies for Rule One analysis...",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to Start Batch Analysis",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // Poll for progress
  const { data: progress } = useQuery<BatchProgress>({
    queryKey: ["/api/batch/progress"],
    refetchInterval: isRunning ? 2000 : false,
    enabled: isRunning,
  });

  // Get batch results
  const { data: results } = useQuery<CompanyResult[]>({
    queryKey: ["/api/batch/results"],
    refetchInterval: isRunning ? 5000 : false,
    enabled: isRunning,
  });

  // Stop monitoring when batch is complete
  if (progress && progress.processed >= progress.total && isRunning) {
    setIsRunning(false);
    toast({
      title: "Batch Analysis Complete",
      description: `Successfully analyzed ${progress.successful}/${progress.total} companies`,
    });
  }

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  const getDataSourceBadge = (source: string) => {
    switch (source) {
      case 'api':
        return <Badge variant="default" className="bg-green-100 text-green-800">API Data</Badge>;
      case 'deep_search':
        return <Badge variant="secondary" className="bg-blue-100 text-blue-800">AI Search</Badge>;
      case 'failed':
        return <Badge variant="destructive">Failed</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const successfulResults = results?.filter(r => r.success) || [];
  const failedResults = results?.filter(r => !r.success) || [];

  return (
    <div className="space-y-6">
      {/* Control Panel */}
      <Card className="border-2 border-primary/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Batch Rule One Analysis
              </CardTitle>
              <CardDescription>
                Process 400+ global companies for comprehensive Rule One investing analysis
              </CardDescription>
            </div>
            <Button
              onClick={() => startBatchMutation.mutate()}
              disabled={startBatchMutation.isPending || isRunning}
              size="lg"
              className="min-w-[140px]"
            >
              {startBatchMutation.isPending || isRunning ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-2" />
                  Start Analysis
                </>
              )}
            </Button>
          </div>
        </CardHeader>

        {progress && (
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>Progress: {progress.processed}/{progress.total} companies</span>
                <span>Started: {formatTime(progress.startTime)}</span>
              </div>
              
              <Progress 
                value={(progress.processed / progress.total) * 100} 
                className="h-3"
              />
              
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="space-y-1">
                  <div className="text-2xl font-bold text-green-600">{progress.successful}</div>
                  <div className="text-xs text-muted-foreground">Successful</div>
                </div>
                <div className="space-y-1">
                  <div className="text-2xl font-bold text-red-600">{progress.failed}</div>
                  <div className="text-xs text-muted-foreground">Failed</div>
                </div>
                <div className="space-y-1">
                  <div className="text-2xl font-bold text-blue-600">
                    {((progress.successful / progress.processed) * 100).toFixed(1)}%
                  </div>
                  <div className="text-xs text-muted-foreground">Success Rate</div>
                </div>
              </div>

              {progress.currentSymbol && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg"
                >
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-sm">Currently processing: <strong>{progress.currentSymbol}</strong></span>
                </motion.div>
              )}

              {progress.estimatedCompletion && (
                <div className="text-sm text-muted-foreground text-center">
                  Estimated completion: {formatTime(progress.estimatedCompletion)}
                </div>
              )}
            </div>
          </CardContent>
        )}
      </Card>

      {/* Results Summary */}
      {results && results.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Successful Results */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-600">
                <CheckCircle2 className="h-5 w-5" />
                Successful Analysis ({successfulResults.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                <AnimatePresence>
                  {successfulResults.slice(-10).map((result, index) => (
                    <motion.div
                      key={result.symbol}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200"
                    >
                      <div>
                        <div className="font-medium">{result.symbol}</div>
                        <div className="text-xs text-muted-foreground">
                          {result.yearsOfData} years • {getDataSourceBadge(result.dataSource)}
                        </div>
                      </div>
                      {result.ruleOneMetrics && (
                        <div className="text-right">
                          <div className="text-sm font-medium">
                            Sales: {result.ruleOneMetrics.salesGrowth?.toFixed(1) || 'N/A'}%
                          </div>
                          <div className="text-xs text-muted-foreground">
                            ROIC: {result.ruleOneMetrics.roic?.toFixed(1) || 'N/A'}%
                          </div>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </CardContent>
          </Card>

          {/* Failed Results */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-600">
                <AlertCircle className="h-5 w-5" />
                Failed Analysis ({failedResults.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {failedResults.slice(-10).map((result, index) => (
                  <motion.div
                    key={result.symbol}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200"
                  >
                    <div>
                      <div className="font-medium">{result.symbol}</div>
                      <div className="text-xs text-red-600">
                        {result.error || 'Analysis failed'}
                      </div>
                    </div>
                    {getDataSourceBadge(result.dataSource)}
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}