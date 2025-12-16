'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  TrendingUp,
  Users,
  Target,
  Sparkles,
  MessageSquare,
  Settings,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  Zap,
  Award,
  Package,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

const navigationItems = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Performance', href: '/performance', icon: TrendingUp },
  { name: 'Downlines', href: '/downlines', icon: Users },
  { name: 'Qualifications', href: '/qualifications', icon: Target },
  { name: 'Subscriptions', href: '/subscriptions', icon: Package },
  { name: 'Next Best Actions', href: '/nba', icon: Zap },
  { name: 'Stela AI Chat', href: '/chat', icon: MessageSquare },
];

const bottomNavItems = [
  { name: 'SPP Guide', href: '/spp', icon: Award },
  { name: 'Help & Support', href: '/help', icon: HelpCircle },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 80 : 280 }}
      className="fixed left-0 top-0 h-screen bg-white border-r border-gray-100 z-40 flex flex-col shadow-soft"
    >
      {/* Logo */}
      <div className="p-6 border-b border-gray-100">
        <Link href="/" className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-nuskin-primary to-nuskin-accent flex items-center justify-center shadow-lg">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-nuskin-gold rounded-full border-2 border-white" />
          </div>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col"
            >
              <span className="font-display font-bold text-xl gradient-text">
                Stela AI
              </span>
              <span className="text-xs text-gray-500">Affiliate Growth</span>
            </motion.div>
          )}
        </Link>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <ul className="space-y-2">
          {navigationItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200',
                    isActive
                      ? 'bg-gradient-to-r from-nuskin-primary to-nuskin-secondary text-white shadow-lg shadow-nuskin-primary/25'
                      : 'text-gray-600 hover:bg-nuskin-light hover:text-nuskin-primary'
                  )}
                >
                  <item.icon className={cn('w-5 h-5 flex-shrink-0', isActive && 'text-white')} />
                  {!collapsed && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="font-medium"
                    >
                      {item.name}
                    </motion.span>
                  )}
                  {isActive && !collapsed && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="ml-auto w-2 h-2 rounded-full bg-white"
                    />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Divider */}
        <div className="my-6 border-t border-gray-100" />

        {/* Bottom Navigation */}
        <ul className="space-y-2">
          {bottomNavItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200',
                    isActive
                      ? 'bg-nuskin-light text-nuskin-primary'
                      : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                  )}
                >
                  <item.icon className="w-5 h-5 flex-shrink-0" />
                  {!collapsed && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="font-medium text-sm"
                    >
                      {item.name}
                    </motion.span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* AI Assistant Promo */}
      {!collapsed && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-4 mb-4 p-4 rounded-2xl bg-gradient-to-br from-nuskin-primary/10 to-nuskin-accent/10 border border-nuskin-accent/20"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-nuskin-primary to-nuskin-accent flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-nuskin-primary text-sm">
              Ask Stela AI
            </span>
          </div>
          <p className="text-xs text-gray-600 mb-3">
            Get personalized insights and recommendations for your business growth.
          </p>
          <Link
            href="/chat"
            className="flex items-center justify-center gap-2 w-full py-2 px-3 bg-white rounded-lg text-sm font-medium text-nuskin-primary hover:bg-nuskin-light transition-colors"
          >
            <MessageSquare className="w-4 h-4" />
            Start Chat
          </Link>
        </motion.div>
      )}

      {/* Collapse Toggle */}
      <button
        onClick={onToggle}
        className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center hover:bg-gray-50 transition-colors"
      >
        {collapsed ? (
          <ChevronRight className="w-4 h-4 text-gray-500" />
        ) : (
          <ChevronLeft className="w-4 h-4 text-gray-500" />
        )}
      </button>
    </motion.aside>
  );
}

