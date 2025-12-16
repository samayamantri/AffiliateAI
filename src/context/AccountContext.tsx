'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AccountOverview, AccountOverviewResponse } from '@/lib/api';

interface AccountContextType {
  accountId: string;
  setAccountId: (id: string) => void;
  accountData: AccountOverview | null;
  rawData: AccountOverviewResponse | null;
  loading: boolean;
  error: string | null;
  refreshAccount: () => Promise<void>;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const AccountContext = createContext<AccountContextType | undefined>(undefined);

// Transform raw API response to expected AccountOverview format
function transformAccountData(raw: AccountOverviewResponse): AccountOverview {
  return {
    id: raw.account.id,
    personId: raw.account.external_id,
    name: raw.account.name,
    rank: raw.account.current_title,
    title: raw.title,
    role: raw.account.role,
    market: raw.account.market,
    joinDate: raw.account.join_date,
    active: raw.account.active,
    stats: {
      totalSales: raw.summary.gsv,
      monthlyVolume: raw.summary.gsv,
      gsv: raw.summary.gsv,
      csv: raw.summary.csv,
      dcSv: raw.summary.dc_sv,
      activeDownlines: raw.downline_tree?.nodes?.length || 0,
      totalDownlines: raw.downline_tree?.nodes?.length || 0,
    },
  };
}

export function AccountProvider({ children }: { children: ReactNode }) {
  const [accountId, setAccountId] = useState<string>(
    process.env.NEXT_PUBLIC_DEFAULT_ACCOUNT_ID || '247'
  );
  const [accountData, setAccountData] = useState<AccountOverview | null>(null);
  const [rawData, setRawData] = useState<AccountOverviewResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAccountData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Use the correct endpoint: /api/accounts/{person_id}/overview
      const response = await fetch(`${API_URL}/api/accounts/${accountId}/overview`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch account: ${response.status} ${response.statusText}`);
      }
      
      const data: AccountOverviewResponse = await response.json();
      setRawData(data);
      setAccountData(transformAccountData(data));
    } catch (err) {
      console.error('Error fetching account:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch account data');
      setAccountData(null);
      setRawData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccountData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accountId]);

  const refreshAccount = async () => {
    await fetchAccountData();
  };

  return (
    <AccountContext.Provider
      value={{
        accountId,
        setAccountId,
        accountData,
        rawData,
        loading,
        error,
        refreshAccount,
      }}
    >
      {children}
    </AccountContext.Provider>
  );
}

export function useAccount() {
  const context = useContext(AccountContext);
  if (context === undefined) {
    throw new Error('useAccount must be used within an AccountProvider');
  }
  return context;
}
