// src/services/dataService.ts
import { useState, useEffect } from 'react';
import type { StockWithMetrics } from '../shared/schema'; // Assuming a shared schema for data types

// This is a basic example of a data service.
// It should be expanded to handle different types of data, caching, and state management.

interface DataService {
  getStockData: (symbol: string) => Promise<StockWithMetrics | null>;
  // Add other data fetching methods here
}

const dataService: DataService = {
  async getStockData(symbol: string): Promise<StockWithMetrics | null> {
    try {
      // Replace with your actual API endpoint for fetching stock data
      const response = await fetch(`/api/stocks/${symbol}`);
      if (!response.ok) {
        console.error(`Error fetching data for ${symbol}: ${response.statusText}`);
        return null;
      }
      const data: StockWithMetrics = await response.json();
      return data;
    } catch (error) {
      console.error(`Error in getStockData for ${symbol}:`, error);
      return null;
    }
  },
  // Implement other data fetching methods (e.g., for news, analysis, etc.)
};

export default dataService;

// You can also add React hooks here to consume the data service in components
export function useStockData(symbol: string | null) {
  const [stockData, setStockData] = useState<StockWithMetrics | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!symbol) {
      setStockData(null);
      return;
    }

    setLoading(true);
    setError(null);

    dataService.getStockData(symbol)
      .then(data => {
        setStockData(data);
      })
      .catch(err => {
        setError(err.message);
        console.error(err);
      })
      .finally(() => {
        setLoading(false);
      });

  }, [symbol]);

  return { stockData, loading, error };
}
