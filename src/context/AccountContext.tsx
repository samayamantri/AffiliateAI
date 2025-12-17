'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AccountOverview, AccountOverviewResponse } from '@/lib/api';

// Role types and their capabilities
export type AccountRole = 'CUSTOMER' | 'BRAND_REP' | 'AFFILIATE' | 'LEADER' | 'DIRECTOR' | 'EXECUTIVE';

export interface AccountCapabilities {
  hasDownlines: boolean;
  hasQualifications: boolean;
  hasNBA: boolean;
  hasSubscriptions: boolean;
  canBuildTeam: boolean;
  roleDisplayName: string;
}

// Determine capabilities based on role and title
export function getAccountCapabilities(role?: string, title?: string): AccountCapabilities {
  const normalizedRole = role?.toUpperCase() || '';
  const normalizedTitle = title?.toLowerCase() || '';
  
  // Check if this is a leader/director/executive level
  const isLeader = normalizedTitle.includes('director') || 
                   normalizedTitle.includes('executive') ||
                   normalizedTitle.includes('diamond') ||
                   normalizedTitle.includes('emerald') ||
                   normalizedTitle.includes('ruby') ||
                   normalizedTitle.includes('lapis');
  
  // Check if this is an affiliate who can build teams
  const isAffiliate = normalizedRole.includes('AFFILIATE') || 
                      normalizedRole.includes('BRAND_AFFILIATE') ||
                      isLeader;
  
  // Brand Reps are customers who can earn but don't build teams
  const isBrandRep = normalizedRole === 'BRAND_REP' && !isLeader;
  
  // Pure customers
  const isCustomer = normalizedRole === 'CUSTOMER';
  
  return {
    hasDownlines: isAffiliate || isLeader,
    hasQualifications: isAffiliate || isLeader || isBrandRep,
    hasNBA: true, // Everyone gets recommendations
    hasSubscriptions: true, // Everyone can have subscriptions
    canBuildTeam: isAffiliate || isLeader,
    roleDisplayName: isLeader ? title || 'Leader' :
                     isAffiliate ? 'Affiliate' :
                     isBrandRep ? 'Brand Representative' :
                     isCustomer ? 'Customer' : 'Member',
  };
}

interface AccountContextType {
  accountId: string;
  setAccountId: (id: string) => void;
  accountData: AccountOverview | null;
  rawData: AccountOverviewResponse | null;
  loading: boolean;
  error: string | null;
  refreshAccount: () => Promise<void>;
  capabilities: AccountCapabilities;
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

// Get initial account ID from localStorage or env
function getInitialAccountId(): string {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('stela_account_id');
    if (stored) return stored;
  }
  return process.env.NEXT_PUBLIC_DEFAULT_ACCOUNT_ID || '247';
}

export function AccountProvider({ children }: { children: ReactNode }) {
  const [accountId, setAccountIdState] = useState<string>(getInitialAccountId);
  const [accountData, setAccountData] = useState<AccountOverview | null>(null);
  const [rawData, setRawData] = useState<AccountOverviewResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Persist account ID to localStorage
  const setAccountId = (id: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('stela_account_id', id);
    }
    setAccountIdState(id);
  };

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
      
      // Also fetch team-network for accurate downline count (overview endpoint has empty downline_tree)
      let totalDownlines = 0;
      let activeDownlines = 0;
      try {
        const now = new Date();
        const period = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
        const teamResponse = await fetch(`${API_URL}/api/accounts/${accountId}/team-network?period=${period}`);
        if (teamResponse.ok) {
          const teamData = await teamResponse.json();
          // Filter out the root node (the user themselves)
          const teamMembers = (teamData.nodes || []).filter(
            (n: { level?: number; id: string }) => n.level !== 0 && n.id !== String(accountId)
          );
          totalDownlines = teamMembers.length;
          activeDownlines = teamMembers.filter(
            (n: { status?: string }) => n.status === 'active'
          ).length || Math.floor(totalDownlines * 0.7); // Estimate if not available
        }
      } catch (teamErr) {
        console.warn('Could not fetch team data:', teamErr);
      }
      
      // Transform with updated downline counts
      const transformed = transformAccountData(data);
      transformed.stats.totalDownlines = totalDownlines;
      transformed.stats.activeDownlines = activeDownlines;
      
      setAccountData(transformed);
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

  // Calculate capabilities based on current account data
  const capabilities = getAccountCapabilities(accountData?.role, accountData?.rank || accountData?.title);

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
        capabilities,
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
