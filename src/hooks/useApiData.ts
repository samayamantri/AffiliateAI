'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAccount } from '@/context/AccountContext';
import {
  dataService,
  PerformanceData,
  QualificationData,
  DownlineData,
  NBAData,
  SubscriptionData,
  InsightData,
} from '@/lib/api';

interface UseApiDataResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

// Generic hook for fetching API data
function useApiData<T>(
  fetcher: (accountId: string) => Promise<T>
): UseApiDataResult<T> {
  const { accountId } = useAccount();
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetcher(accountId);
      setData(result);
    } catch (err) {
      console.error('API fetch error:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [accountId, fetcher]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}

// Specific hooks for each data type
export function usePerformanceData(): UseApiDataResult<PerformanceData> {
  return useApiData(dataService.getPerformance);
}

export function useQualificationData(): UseApiDataResult<QualificationData> {
  return useApiData(dataService.getQualifications);
}

export function useDownlineData(): UseApiDataResult<DownlineData[]> {
  return useApiData(dataService.getDownlines);
}

export function useNBAData(): UseApiDataResult<NBAData[]> {
  return useApiData(dataService.getNBA);
}

export function useSubscriptionData(): UseApiDataResult<SubscriptionData> {
  return useApiData(dataService.getSubscriptions);
}

export function useInsightData(): UseApiDataResult<InsightData[]> {
  return useApiData(dataService.getInsights);
}

// Combined dashboard data hook
export interface DashboardData {
  performance: PerformanceData | null;
  qualifications: QualificationData | null;
  downlines: DownlineData[] | null;
  nba: NBAData[] | null;
  subscriptions: SubscriptionData | null;
  insights: InsightData[] | null;
}

export function useDashboardData(): {
  data: DashboardData;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
} {
  const { accountId } = useAccount();
  const [data, setData] = useState<DashboardData>({
    performance: null,
    qualifications: null,
    downlines: null,
    nba: null,
    subscriptions: null,
    insights: null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Fetch all data in parallel from real APIs
      const results = await Promise.allSettled([
        dataService.getPerformance(accountId),
        dataService.getQualifications(accountId),
        dataService.getDownlines(accountId),
        dataService.getNBA(accountId),
        dataService.getSubscriptions(accountId),
        dataService.getInsights(accountId),
      ]);

      const [performance, qualifications, downlines, nba, subscriptions, insights] = results;

      setData({
        performance: performance.status === 'fulfilled' ? performance.value : null,
        qualifications: qualifications.status === 'fulfilled' ? qualifications.value : null,
        downlines: downlines.status === 'fulfilled' ? downlines.value : null,
        nba: nba.status === 'fulfilled' ? nba.value : null,
        subscriptions: subscriptions.status === 'fulfilled' ? subscriptions.value : null,
        insights: insights.status === 'fulfilled' ? insights.value : null,
      });

      // Log which endpoints succeeded/failed for debugging
      console.log('API Results:', {
        performance: performance.status,
        qualifications: qualifications.status,
        downlines: downlines.status,
        nba: nba.status,
        subscriptions: subscriptions.status,
        insights: insights.status,
      });

      // Check if all failed
      const allFailed = results.every(r => r.status === 'rejected');
      if (allFailed) {
        setError('Failed to connect to API at localhost:8000. Please ensure the server is running.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  }, [accountId]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  return { data, loading, error, refetch: fetchAll };
}
