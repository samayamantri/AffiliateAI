'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  TrendingUp,
  Users,
  Target,
  Sparkles,
  MessageSquare,
  Settings,
  HelpCircle,
  Zap,
  Award,
  Package,
  ChevronRight,
  X,
  User,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAccount } from '@/context/AccountContext';

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const navigationItems = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard, color: 'text-blue-600' },
  { name: 'Performance', href: '/performance', icon: TrendingUp, color: 'text-green-600' },
  { name: 'My Team', href: '/downlines', icon: Users, color: 'text-purple-600' },
  { name: 'Qualifications', href: '/qualifications', icon: Target, color: 'text-orange-600' },
  { name: 'Subscriptions', href: '/subscriptions', icon: Package, color: 'text-pink-600' },
  { name: 'Next Best Actions', href: '/nba', icon: Zap, color: 'text-amber-600' },
];

const secondaryItems = [
  { name: 'Stela AI Chat', href: '/chat', icon: MessageSquare, highlight: true },
  { name: 'SPP Guide', href: '/spp', icon: Award },
  { name: 'Help & Support', href: '/help', icon: HelpCircle },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export function MobileDrawer({ isOpen, onClose }: MobileDrawerProps) {
  const pathname = usePathname();
  const { accountData, accountId } = useAccount();

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
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm md:hidden"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 w-[85%] max-w-sm z-50 bg-white shadow-2xl md:hidden overflow-y-auto"
          >
            {/* Header */}
            <div className="sticky top-0 bg-white z-10 px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-nuskin-primary to-nuskin-accent flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="font-display font-bold text-lg gradient-text">Menu</h2>
                  <p className="text-xs text-gray-500">Navigate Stela AI</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"
              >
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>

            {/* Profile Card */}
            <div className="mx-4 mt-4 p-4 rounded-2xl bg-gradient-to-br from-nuskin-primary to-nuskin-secondary text-white">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold truncate">
                    {accountData?.name || 'Loading...'}
                  </p>
                  <p className="text-sm text-white/80">
                    {accountData?.rank || accountData?.title || 'Member'}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-white/20">
                <div className="text-center">
                  <p className="text-lg font-bold">{accountData?.stats?.gsv?.toLocaleString() || '0'}</p>
                  <p className="text-[10px] text-white/70">GSV</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold">{accountData?.stats?.csv?.toLocaleString() || '0'}</p>
                  <p className="text-[10px] text-white/70">CSV</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold">{accountData?.stats?.activeDownlines || accountData?.stats?.totalDownlines || '0'}</p>
                  <p className="text-[10px] text-white/70">Team</p>
                </div>
              </div>
            </div>

            {/* Main Navigation */}
            <div className="px-4 py-4">
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2 px-2">
                Main Menu
              </p>
              <ul className="space-y-1">
                {navigationItems.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        onClick={onClose}
                        className={cn(
                          'flex items-center gap-3 px-3 py-3 rounded-xl transition-all',
                          isActive
                            ? 'bg-nuskin-primary/10 text-nuskin-primary'
                            : 'text-gray-700 hover:bg-gray-50'
                        )}
                      >
                        <div className={cn(
                          'w-9 h-9 rounded-xl flex items-center justify-center',
                          isActive ? 'bg-nuskin-primary text-white' : 'bg-gray-100'
                        )}>
                          <item.icon className={cn('w-4 h-4', !isActive && item.color)} />
                        </div>
                        <span className="font-medium flex-1">{item.name}</span>
                        <ChevronRight className={cn(
                          'w-4 h-4',
                          isActive ? 'text-nuskin-primary' : 'text-gray-300'
                        )} />
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Divider */}
            <div className="mx-4 border-t border-gray-100" />

            {/* Secondary Navigation */}
            <div className="px-4 py-4">
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2 px-2">
                More Options
              </p>
              <ul className="space-y-1">
                {secondaryItems.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        onClick={onClose}
                        className={cn(
                          'flex items-center gap-3 px-3 py-3 rounded-xl transition-all',
                          item.highlight
                            ? 'bg-gradient-to-r from-nuskin-primary/10 to-nuskin-accent/10 border border-nuskin-accent/20'
                            : isActive
                            ? 'bg-gray-100 text-gray-900'
                            : 'text-gray-600 hover:bg-gray-50'
                        )}
                      >
                        <div className={cn(
                          'w-9 h-9 rounded-xl flex items-center justify-center',
                          item.highlight
                            ? 'bg-gradient-to-br from-nuskin-primary to-nuskin-accent text-white'
                            : 'bg-gray-100'
                        )}>
                          <item.icon className="w-4 h-4" />
                        </div>
                        <span className={cn('font-medium flex-1', item.highlight && 'text-nuskin-primary')}>
                          {item.name}
                        </span>
                        {item.highlight && (
                          <span className="px-2 py-0.5 bg-nuskin-accent text-white text-[10px] font-bold rounded-full">
                            AI
                          </span>
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Account ID */}
            <div className="mx-4 mt-2 mb-6 p-3 rounded-xl bg-gray-50 text-center">
              <p className="text-xs text-gray-500">Account ID</p>
              <p className="font-mono font-bold text-gray-700">{accountId}</p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

