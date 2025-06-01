import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "next-themes";
import { useAuth } from "@/hooks/useAuth";
import Dashboard from "@/pages/Dashboard";
import Screening from "@/pages/Screening";
import StockDetail from "@/pages/StockDetail";
import Landing from "@/pages/Landing";
import NotFound from "@/pages/not-found";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header - shown on all authenticated pages */}
      {isAuthenticated && <Header />}
      
      {/* Main Content */}
      <main className="flex-1">
        <Switch>
          {isLoading || !isAuthenticated ? (
            <Route path="/" component={Landing} />
          ) : (
            <>
              <Route path="/" component={Dashboard} />
              <Route path="/search" component={Screening} />
              <Route path="/screening" component={Screening} />
              <Route path="/stock/:symbol" component={StockDetail} />
              <Route path="/watchlist" component={Dashboard} />
              <Route path="/batch-analysis" component={Dashboard} />
              <Route path="/valuation" component={Dashboard} />
              <Route path="/market" component={Dashboard} />
            </>
          )}
          <Route component={NotFound} />
        </Switch>
      </main>
      
      {/* Footer - shown on all authenticated pages */}
      {isAuthenticated && <Footer />}
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
