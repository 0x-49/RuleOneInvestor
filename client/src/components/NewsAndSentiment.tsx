import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { Newspaper, TrendingUp, TrendingDown, ExternalLink, Calendar, Globe } from "lucide-react";
import { motion } from "framer-motion";

interface NewsItem {
  title: string;
  url: string;
  time_published: string;
  authors: string[];
  summary: string;
  source: string;
  category_within_source: string;
  source_domain: string;
  topics: Array<{
    topic: string;
    relevance_score: string;
  }>;
  overall_sentiment_score: number;
  overall_sentiment_label: string;
  ticker_sentiment: Array<{
    ticker: string;
    relevance_score: string;
    ticker_sentiment_score: string;
    ticker_sentiment_label: string;
  }>;
}

interface Props {
  symbol: string;
}

export default function NewsAndSentiment({ symbol }: Props) {
  const { data: newsData, isLoading, error } = useQuery<NewsItem[]>({
    queryKey: ['/api/news', symbol],
    enabled: !!symbol,
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Newspaper className="h-5 w-5" />
            <span>News & Sentiment Analysis</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
                <Skeleton className="h-16 w-full" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Newspaper className="h-5 w-5" />
            <span>News & Sentiment Analysis</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Newspaper className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Unable to load news data</p>
            <p className="text-sm text-gray-500 mt-2">Please check your API configuration</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!newsData || newsData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Newspaper className="h-5 w-5" />
            <span>News & Sentiment Analysis</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Newspaper className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No recent news found for {symbol}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Calculate overall sentiment metrics
  const sentimentScores = newsData.map(item => item.overall_sentiment_score);
  const avgSentiment = sentimentScores.reduce((sum, score) => sum + score, 0) / sentimentScores.length;
  
  const positiveNews = newsData.filter(item => item.overall_sentiment_score > 0.1).length;
  const negativeNews = newsData.filter(item => item.overall_sentiment_score < -0.1).length;
  const neutralNews = newsData.length - positiveNews - negativeNews;

  const getSentimentColor = (score: number) => {
    if (score > 0.1) return "text-green-600";
    if (score < -0.1) return "text-red-600";
    return "text-gray-600";
  };

  const getSentimentBadge = (label: string) => {
    switch (label.toLowerCase()) {
      case 'bullish':
      case 'positive':
        return "default";
      case 'bearish':
      case 'negative':
        return "destructive";
      default:
        return "secondary";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 48) return "1 day ago";
    return `${Math.floor(diffInHours / 24)} days ago`;
  };

  return (
    <div className="space-y-6">
      {/* Sentiment Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Newspaper className="h-5 w-5" />
              <span>News & Sentiment Analysis</span>
            </div>
            <Badge variant={avgSentiment > 0.1 ? "default" : avgSentiment < -0.1 ? "destructive" : "secondary"}>
              {avgSentiment > 0.1 ? <TrendingUp className="h-3 w-3 mr-1" /> : avgSentiment < -0.1 ? <TrendingDown className="h-3 w-3 mr-1" /> : null}
              Overall: {avgSentiment > 0.1 ? "Positive" : avgSentiment < -0.1 ? "Negative" : "Neutral"}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <motion.div 
              className="text-center p-4 bg-blue-50 rounded-lg"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <div className="text-2xl font-bold text-blue-600">{newsData.length}</div>
              <div className="text-sm text-gray-600">Total Articles</div>
            </motion.div>
            
            <motion.div 
              className="text-center p-4 bg-green-50 rounded-lg"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <div className="text-2xl font-bold text-green-600">{positiveNews}</div>
              <div className="text-sm text-gray-600">Positive</div>
            </motion.div>
            
            <motion.div 
              className="text-center p-4 bg-gray-50 rounded-lg"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <div className="text-2xl font-bold text-gray-600">{neutralNews}</div>
              <div className="text-sm text-gray-600">Neutral</div>
            </motion.div>
            
            <motion.div 
              className="text-center p-4 bg-red-50 rounded-lg"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <div className="text-2xl font-bold text-red-600">{negativeNews}</div>
              <div className="text-sm text-gray-600">Negative</div>
            </motion.div>
          </div>

          {/* Sentiment Summary */}
          <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg mb-6">
            <h4 className="font-semibold text-blue-900 mb-2">Market Sentiment Summary</h4>
            <div className="text-sm text-blue-800">
              <p>• Average sentiment score: <span className={`font-medium ${getSentimentColor(avgSentiment)}`}>{avgSentiment.toFixed(3)}</span></p>
              <p>• Sentiment distribution: {((positiveNews / newsData.length) * 100).toFixed(0)}% positive, {((neutralNews / newsData.length) * 100).toFixed(0)}% neutral, {((negativeNews / newsData.length) * 100).toFixed(0)}% negative</p>
              <p>• Recent coverage indicates {avgSentiment > 0.1 ? "optimistic" : avgSentiment < -0.1 ? "cautious" : "mixed"} market sentiment for {symbol}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent News Articles */}
      <Card>
        <CardHeader>
          <CardTitle>Recent News Articles</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {newsData.slice(0, 10).map((article, index) => {
              const tickerSentiment = article.ticker_sentiment.find(ts => ts.ticker === symbol);
              
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold text-gray-900 leading-snug pr-4">
                      {article.title}
                    </h4>
                    <div className="flex items-center space-x-2 flex-shrink-0">
                      <Badge variant={getSentimentBadge(article.overall_sentiment_label)}>
                        {article.overall_sentiment_label}
                      </Badge>
                      {tickerSentiment && (
                        <Badge variant={getSentimentBadge(tickerSentiment.ticker_sentiment_label)} className="text-xs">
                          {symbol}: {tickerSentiment.ticker_sentiment_label}
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                    <div className="flex items-center space-x-1">
                      <Globe className="h-3 w-3" />
                      <span>{article.source}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-3 w-3" />
                      <span>{formatDate(article.time_published)}</span>
                    </div>
                    {article.authors.length > 0 && (
                      <span>by {article.authors.slice(0, 2).join(", ")}</span>
                    )}
                  </div>
                  
                  <p className="text-gray-700 text-sm leading-relaxed mb-3">
                    {article.summary}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-gray-500">Sentiment Score:</span>
                      <span className={`text-xs font-medium ${getSentimentColor(article.overall_sentiment_score)}`}>
                        {article.overall_sentiment_score.toFixed(3)}
                      </span>
                      {tickerSentiment && (
                        <>
                          <span className="text-xs text-gray-500">| {symbol}:</span>
                          <span className={`text-xs font-medium ${getSentimentColor(parseFloat(tickerSentiment.ticker_sentiment_score))}`}>
                            {parseFloat(tickerSentiment.ticker_sentiment_score).toFixed(3)}
                          </span>
                        </>
                      )}
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => window.open(article.url, '_blank')}
                      className="flex items-center space-x-1"
                    >
                      <span>Read More</span>
                      <ExternalLink className="h-3 w-3" />
                    </Button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}