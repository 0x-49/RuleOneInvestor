import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, AlertTriangle, DollarSign, Newspaper } from "lucide-react";
import { NewsItem } from "@shared/schema";
import { formatDistanceToNow } from "date-fns";

export default function NewsAndAlerts() {
  const { data: newsItems = [], isLoading } = useQuery<NewsItem[]>({
    queryKey: ["/api/news"],
  });

  const getNewsIcon = (type: string) => {
    switch (type) {
      case "earnings":
        return <TrendingUp className="h-4 w-4" />;
      case "alert":
        return <AlertTriangle className="h-4 w-4" />;
      case "price":
        return <DollarSign className="h-4 w-4" />;
      default:
        return <Newspaper className="h-4 w-4" />;
    }
  };

  const getNewsColor = (type: string) => {
    switch (type) {
      case "earnings":
        return "border-primary text-primary";
      case "alert":
        return "border-yellow-500 text-yellow-500";
      case "price":
        return "border-green-500 text-green-500";
      default:
        return "border-slate-500 text-slate-500";
    }
  };

  const getNewsTypeLabel = (type: string) => {
    switch (type) {
      case "earnings":
        return "Earnings";
      case "alert":
        return "Alert";
      case "price":
        return "Price Alert";
      default:
        return "News";
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Updates</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-16" />
                </div>
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-3 w-3/4" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Updates</CardTitle>
      </CardHeader>
      <CardContent>
        {newsItems.length === 0 ? (
          <div className="text-center text-slate-600 dark:text-slate-400 py-8">
            <p>No recent updates</p>
            <p className="text-sm mt-2">News and alerts will appear here</p>
          </div>
        ) : (
          <div className="space-y-4">
            {newsItems.map((item) => (
              <div
                key={item.id}
                className={`border-l-4 pl-4 ${getNewsColor(item.type)}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    {getNewsIcon(item.type)}
                    <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
                      {item.title}
                    </span>
                  </div>
                  {item.symbol && (
                    <Badge variant="outline" className="text-xs">
                      {item.symbol}
                    </Badge>
                  )}
                </div>
                
                <div className="text-xs text-slate-600 dark:text-slate-400 mb-2">
                  {formatDistanceToNow(new Date(item.timestamp), { addSuffix: true })}
                  {" • "}
                  {getNewsTypeLabel(item.type)}
                </div>
                
                <div className="text-sm text-slate-700 dark:text-slate-300">
                  {item.summary}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
