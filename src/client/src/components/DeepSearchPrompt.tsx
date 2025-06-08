import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Search, FileText, Brain, Clock, CheckCircle } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

interface DeepSearchPromptProps {
  symbol: string;
  onSuccess?: (data: any) => void;
  dataYearsFound?: number;
}

interface DeepSearchResult {
  success: boolean;
  yearsFound: number;
  stockData: any;
  message: string;
}

export default function DeepSearchPrompt({ symbol, onSuccess, dataYearsFound = 0 }: DeepSearchPromptProps) {
  const [showDetails, setShowDetails] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const deepSearchMutation = useMutation({
    mutationFn: async (): Promise<DeepSearchResult> => {
      const response = await apiRequest("POST", `/api/stocks/${symbol}/deep-search`);
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Deep Search Successful",
        description: data.message,
      });
      
      // Invalidate and refetch stock data
      queryClient.invalidateQueries({ queryKey: [`/api/stocks/${symbol}`] });
      
      if (onSuccess) {
        onSuccess(data);
      }
    },
    onError: (error: any) => {
      toast({
        title: "Deep Search Failed",
        description: error.message || "Unable to extract data from SEC filings",
        variant: "destructive",
      });
    },
  });

  if (dataYearsFound >= 7) {
    return null; // Don't show if we already have sufficient data
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="border-blue-200 bg-blue-50/50 dark:bg-blue-900/10 dark:border-blue-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-900 dark:text-blue-100">
            <Brain className="h-5 w-5" />
            Insufficient Data Detected
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Alert>
              <FileText className="h-4 w-4" />
              <AlertDescription>
                {dataYearsFound > 0 
                  ? `Only ${dataYearsFound} years of financial data found for ${symbol}. Rule One analysis requires 10 years of historical data for reliable investment decisions.`
                  : `No financial data found for ${symbol} in our standard sources.`
                }
              </AlertDescription>
            </Alert>

            {!showDetails ? (
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                    Try Deep Search from SEC Filings?
                  </p>
                  <p className="text-xs text-blue-700 dark:text-blue-300">
                    AI-powered extraction from company annual reports
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowDetails(true)}
                    className="text-blue-700 border-blue-300 hover:bg-blue-100"
                  >
                    Learn More
                  </Button>
                  <Button
                    onClick={() => deepSearchMutation.mutate()}
                    disabled={deepSearchMutation.isPending}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                    size="sm"
                  >
                    {deepSearchMutation.isPending ? (
                      <>
                        <Clock className="h-4 w-4 mr-2 animate-spin" />
                        Searching...
                      </>
                    ) : (
                      <>
                        <Search className="h-4 w-4 mr-2" />
                        Start Deep Search
                      </>
                    )}
                  </Button>
                </div>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border">
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">
                    How Deep Search Works:
                  </h4>
                  <div className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Locates company's SEC filings (10-K annual reports)</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Downloads and analyzes up to 10 years of financial documents</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Uses AI to extract precise financial metrics from source documents</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Provides authentic data directly from company filings</span>
                    </div>
                  </div>
                </div>

                <Alert>
                  <Brain className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Deep Search is ideal for:</strong> International stocks, smaller companies, 
                    recent IPOs, or any stock where standard APIs don't provide complete historical data.
                    This process may take 30-60 seconds to complete.
                  </AlertDescription>
                </Alert>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowDetails(false)}
                  >
                    Back
                  </Button>
                  <Button
                    onClick={() => deepSearchMutation.mutate()}
                    disabled={deepSearchMutation.isPending}
                    className="bg-blue-600 hover:bg-blue-700 text-white flex-1"
                  >
                    {deepSearchMutation.isPending ? (
                      <>
                        <Clock className="h-4 w-4 mr-2 animate-spin" />
                        Analyzing SEC Filings...
                      </>
                    ) : (
                      <>
                        <Search className="h-4 w-4 mr-2" />
                        Begin Deep Search
                      </>
                    )}
                  </Button>
                </div>
              </motion.div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}