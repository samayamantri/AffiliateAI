'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  X,
  User,
  Clock,
  ChevronRight,
  Loader2,
  Users,
  Star,
} from 'lucide-react';
import { useAccount } from '@/context/AccountContext';
import { cn } from '@/lib/utils';

interface AccountSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SearchResult {
  id: string;
  personId: string;
  name: string;
  title: string;
  market?: string;
  gsv?: number;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Store recent accounts in localStorage
const RECENT_ACCOUNTS_KEY = 'stela_recent_accounts';
const MAX_RECENT_ACCOUNTS = 5;

function getRecentAccounts(): SearchResult[] {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(RECENT_ACCOUNTS_KEY);
  return stored ? JSON.parse(stored) : [];
}

function addRecentAccount(account: SearchResult) {
  const recent = getRecentAccounts().filter(a => a.personId !== account.personId);
  recent.unshift(account);
  localStorage.setItem(
    RECENT_ACCOUNTS_KEY,
    JSON.stringify(recent.slice(0, MAX_RECENT_ACCOUNTS))
  );
}

export function AccountSearchModal({ isOpen, onClose }: AccountSearchModalProps) {
  const { accountId, setAccountId, accountData } = useAccount();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [recentAccounts, setRecentAccounts] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load recent accounts on mount
  useEffect(() => {
    if (isOpen) {
      setRecentAccounts(getRecentAccounts());
      setSearchQuery('');
      setSearchResults([]);
      setError(null);
    }
  }, [isOpen]);

  // Search for accounts
  const searchAccounts = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // If query is a number, search by ID directly
      if (/^\d+$/.test(query)) {
        const response = await fetch(`${API_URL}/api/accounts/${query}/overview`);
        if (response.ok) {
          const data = await response.json();
          setSearchResults([{
            id: data.account?.id || query,
            personId: data.account?.external_id || query,
            name: data.account?.name || `Account ${query}`,
            title: data.account?.current_title || data.title || 'Member',
            market: data.account?.market,
            gsv: data.summary?.gsv,
          }]);
        } else if (response.status === 404) {
          setSearchResults([]);
          setError('Account not found');
        } else {
          throw new Error('Failed to fetch account');
        }
      } else {
        // For name search, we'd need a search endpoint
        // For now, show a message that only ID search is supported
        setError('Enter an account ID to search');
        setSearchResults([]);
      }
    } catch (err) {
      console.error('Search error:', err);
      setError('Unable to connect to server');
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery) {
        searchAccounts(searchQuery);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, searchAccounts]);

  const handleSelectAccount = (account: SearchResult) => {
    addRecentAccount(account);
    setAccountId(account.personId);
    onClose();
  };

  const handleQuickSwitch = (personId: string) => {
    setAccountId(personId);
    onClose();
  };

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="fixed left-4 right-4 top-20 md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-lg z-50"
          >
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
              {/* Search Header */}
              <div className="p-4 border-b border-gray-100">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by Account ID..."
                    className="w-full pl-10 pr-10 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:border-nuskin-accent focus:ring-2 focus:ring-nuskin-accent/20 transition-all outline-none text-base"
                    autoFocus
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-gray-200 transition-colors"
                    >
                      <X className="w-4 h-4 text-gray-400" />
                    </button>
                  )}
                </div>
              </div>

              {/* Current Account */}
              <div className="px-4 py-3 bg-nuskin-light/50 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-nuskin-primary to-nuskin-secondary flex items-center justify-center text-white font-semibold text-sm">
                      {accountData?.name?.split(' ').map(n => n[0]).join('').slice(0, 2) || 'U'}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 text-sm">
                        {accountData?.name || 'Current Account'}
                      </p>
                      <p className="text-xs text-gray-500">
                        ID: {accountId} • {accountData?.rank || 'Member'}
                      </p>
                    </div>
                  </div>
                  <span className="px-2 py-1 rounded-full bg-nuskin-accent/20 text-nuskin-primary text-xs font-medium">
                    Current
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="max-h-80 overflow-y-auto">
                {/* Loading State */}
                {loading && (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-6 h-6 text-nuskin-accent animate-spin" />
                    <span className="ml-2 text-gray-500">Searching...</span>
                  </div>
                )}

                {/* Error State */}
                {error && !loading && (
                  <div className="p-4 text-center text-gray-500">
                    <p>{error}</p>
                  </div>
                )}

                {/* Search Results */}
                {!loading && searchResults.length > 0 && (
                  <div className="p-2">
                    <p className="px-3 py-2 text-xs font-medium text-gray-400 uppercase">
                      Search Results
                    </p>
                    {searchResults.map((result) => (
                      <button
                        key={result.personId}
                        onClick={() => handleSelectAccount(result)}
                        className={cn(
                          'w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors text-left',
                          result.personId === accountId && 'bg-nuskin-light/50'
                        )}
                      >
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold text-sm">
                          {result.name?.split(' ').map(n => n[0]).join('').slice(0, 2) || 'U'}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 truncate">
                            {result.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            ID: {result.personId} • {result.title}
                            {result.gsv ? ` • ${result.gsv.toLocaleString()} GSV` : ''}
                          </p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                      </button>
                    ))}
                  </div>
                )}

                {/* Recent Accounts */}
                {!loading && !searchQuery && recentAccounts.length > 0 && (
                  <div className="p-2">
                    <p className="px-3 py-2 text-xs font-medium text-gray-400 uppercase flex items-center gap-2">
                      <Clock className="w-3 h-3" />
                      Recent Accounts
                    </p>
                    {recentAccounts.map((account) => (
                      <button
                        key={account.personId}
                        onClick={() => handleSelectAccount(account)}
                        className={cn(
                          'w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors text-left',
                          account.personId === accountId && 'bg-nuskin-light/50'
                        )}
                      >
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-400 to-gray-500 flex items-center justify-center text-white font-semibold text-sm">
                          {account.name?.split(' ').map(n => n[0]).join('').slice(0, 2) || 'U'}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 truncate">
                            {account.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            ID: {account.personId} • {account.title}
                          </p>
                        </div>
                        {account.personId === accountId ? (
                          <span className="text-xs text-nuskin-accent">Current</span>
                        ) : (
                          <ChevronRight className="w-4 h-4 text-gray-400" />
                        )}
                      </button>
                    ))}
                  </div>
                )}

                {/* Quick Switch Suggestions */}
                {!loading && !searchQuery && recentAccounts.length === 0 && (
                  <div className="p-4">
                    <p className="px-3 py-2 text-xs font-medium text-gray-400 uppercase flex items-center gap-2">
                      <Star className="w-3 h-3" />
                      Quick Switch
                    </p>
                    <div className="space-y-2 mt-2">
                      {['247', '100', '500'].map((id) => (
                        <button
                          key={id}
                          onClick={() => handleQuickSwitch(id)}
                          disabled={id === accountId}
                          className={cn(
                            'w-full flex items-center justify-between p-3 rounded-xl transition-colors text-left',
                            id === accountId
                              ? 'bg-nuskin-light/50 cursor-default'
                              : 'hover:bg-gray-50'
                          )}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                              <User className="w-4 h-4 text-gray-400" />
                            </div>
                            <span className="font-medium text-gray-700">
                              Account {id}
                            </span>
                          </div>
                          {id === accountId && (
                            <span className="text-xs text-nuskin-accent">Current</span>
                          )}
                        </button>
                      ))}
                    </div>
                    <p className="text-center text-xs text-gray-400 mt-4">
                      Enter an account ID above to search
                    </p>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="p-3 border-t border-gray-100 bg-gray-50">
                <button
                  onClick={onClose}
                  className="w-full py-2 text-center text-sm text-gray-500 hover:text-gray-700 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

