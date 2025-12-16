'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell,
  Search,
  User,
  ChevronDown,
  LogOut,
  Settings,
  UserCircle,
  Check,
} from 'lucide-react';
import { useAccount } from '@/context/AccountContext';
import { cn, getInitials, getRankColor } from '@/lib/utils';
import { AccountSearchModal } from './AccountSearchModal';

export function Header() {
  const { accountId, setAccountId, accountData, loading } = useAccount();
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const [showAccountInput, setShowAccountInput] = useState(false);
  const [newAccountId, setNewAccountId] = useState(accountId);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const notifications = [
    { id: 1, title: 'New team member joined', message: 'Emily Chen has joined your downline', time: '2h ago', unread: true },
    { id: 2, title: 'Qualification milestone', message: "You're 85% to your next rank!", time: '5h ago', unread: true },
    { id: 3, title: 'Weekly report ready', message: 'Your performance report is available', time: '1d ago', unread: false },
  ];

  const handleAccountChange = () => {
    if (newAccountId && newAccountId !== accountId) {
      setAccountId(newAccountId);
    }
    setShowAccountInput(false);
  };

  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-lg border-b border-gray-100">
      <div className="flex items-center justify-between h-16 px-6">
        {/* Search */}
        <div className="flex-1 max-w-xl">
          <button
            onClick={() => setIsSearchOpen(true)}
            className="w-full relative"
          >
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <div className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-50 border border-gray-100 hover:bg-white hover:border-gray-200 transition-all text-sm text-left text-gray-400">
                Search accounts by ID...
              </div>
              <kbd className="absolute right-3 top-1/2 -translate-y-1/2 px-2 py-1 text-xs bg-white rounded border border-gray-200 text-gray-400 hidden md:block">
                ⌘K
              </kbd>
            </div>
          </button>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4 ml-6">
          {/* Account ID Changer */}
          <div className="relative">
            <AnimatePresence>
              {showAccountInput ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="flex items-center gap-2"
                >
                  <input
                    type="text"
                    value={newAccountId}
                    onChange={(e) => setNewAccountId(e.target.value)}
                    className="w-24 px-3 py-1.5 text-sm rounded-lg border border-nuskin-accent focus:ring-2 focus:ring-nuskin-accent/20 outline-none"
                    placeholder="Account ID"
                    autoFocus
                  />
                  <button
                    onClick={handleAccountChange}
                    className="p-1.5 rounded-lg bg-nuskin-accent text-white hover:bg-nuskin-secondary transition-colors"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                </motion.div>
              ) : (
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  onClick={() => setShowAccountInput(true)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-nuskin-light text-nuskin-primary text-sm font-medium hover:bg-nuskin-accent/20 transition-colors"
                >
                  <span className="text-gray-500">ID:</span>
                  <span>{accountId}</span>
                </motion.button>
              )}
            </AnimatePresence>
          </div>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-xl hover:bg-gray-100 transition-colors"
            >
              <Bell className="w-5 h-5 text-gray-600" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-nuskin-accent rounded-full" />
            </button>

            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
                >
                  <div className="p-4 border-b border-gray-100">
                    <h3 className="font-semibold text-gray-900">Notifications</h3>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.map((notif) => (
                      <div
                        key={notif.id}
                        className={cn(
                          'p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors cursor-pointer',
                          notif.unread && 'bg-nuskin-light/50'
                        )}
                      >
                        <div className="flex items-start gap-3">
                          {notif.unread && (
                            <span className="mt-2 w-2 h-2 rounded-full bg-nuskin-accent flex-shrink-0" />
                          )}
                          <div className={cn(!notif.unread && 'ml-5')}>
                            <p className="font-medium text-sm text-gray-900">
                              {notif.title}
                            </p>
                            <p className="text-sm text-gray-500 mt-0.5">
                              {notif.message}
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                              {notif.time}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="p-3 border-t border-gray-100">
                    <button className="w-full text-center text-sm text-nuskin-primary font-medium hover:text-nuskin-secondary transition-colors">
                      View all notifications
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setShowAccountMenu(!showAccountMenu)}
              className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-100 transition-colors"
            >
              {loading ? (
                <div className="w-9 h-9 rounded-full bg-gray-200 animate-pulse" />
              ) : (
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-nuskin-primary to-nuskin-secondary flex items-center justify-center text-white font-medium text-sm">
                  {accountData ? getInitials(accountData.name) : 'U'}
                </div>
              )}
              <div className="hidden md:block text-left">
                {loading ? (
                  <div className="space-y-1">
                    <div className="w-24 h-4 bg-gray-200 rounded animate-pulse" />
                    <div className="w-16 h-3 bg-gray-100 rounded animate-pulse" />
                  </div>
                ) : (
                  <>
                    <p className="text-sm font-medium text-gray-900">
                      {accountData?.name || 'User'}
                    </p>
                    <p className={cn('text-xs px-2 py-0.5 rounded-full inline-block', getRankColor(accountData?.rank || ''))}>
                      {accountData?.rank || 'Member'}
                    </p>
                  </>
                )}
              </div>
              <ChevronDown className="w-4 h-4 text-gray-400 hidden md:block" />
            </button>

            <AnimatePresence>
              {showAccountMenu && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
                >
                  <div className="p-4 border-b border-gray-100">
                    <p className="font-medium text-gray-900">{accountData?.name}</p>
                    <p className="text-sm text-gray-500">{accountData?.email}</p>
                  </div>
                  <div className="p-2">
                    <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors text-left">
                      <UserCircle className="w-5 h-5 text-gray-400" />
                      <span className="text-sm text-gray-700">My Profile</span>
                    </button>
                    <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors text-left">
                      <Settings className="w-5 h-5 text-gray-400" />
                      <span className="text-sm text-gray-700">Settings</span>
                    </button>
                  </div>
                  <div className="p-2 border-t border-gray-100">
                    <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-red-50 transition-colors text-left group">
                      <LogOut className="w-5 h-5 text-gray-400 group-hover:text-red-500" />
                      <span className="text-sm text-gray-700 group-hover:text-red-600">
                        Sign Out
                      </span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Account Search Modal */}
      <AccountSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </header>
  );
}

