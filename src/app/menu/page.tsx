'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  TrendingUp,
  Package,
  Zap,
  Award,
  HelpCircle,
  Settings,
  MessageSquare,
  User,
  LogOut,
  Bell,
  CreditCard,
  Share2,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { useAccount } from '@/context/AccountContext';
import { cn } from '@/lib/utils';

const menuSections = [
  {
    title: 'Business',
    items: [
      { name: 'Performance', href: '/performance', icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-100' },
      { name: 'Subscriptions', href: '/subscriptions', icon: Package, color: 'text-pink-600', bg: 'bg-pink-100' },
      { name: 'Next Best Actions', href: '/nba', icon: Zap, color: 'text-amber-600', bg: 'bg-amber-100' },
    ],
  },
  {
    title: 'Resources',
    items: [
      { name: 'SPP Guide', href: '/spp', icon: Award, color: 'text-nuskin-primary', bg: 'bg-blue-100' },
      { name: 'Help & Support', href: '/help', icon: HelpCircle, color: 'text-purple-600', bg: 'bg-purple-100' },
    ],
  },
  {
    title: 'Account',
    items: [
      { name: 'My Profile', href: '/profile', icon: User, color: 'text-gray-600', bg: 'bg-gray-100' },
      { name: 'Notifications', href: '/notifications', icon: Bell, color: 'text-red-600', bg: 'bg-red-100' },
      { name: 'Payments', href: '/payments', icon: CreditCard, color: 'text-emerald-600', bg: 'bg-emerald-100' },
      { name: 'Settings', href: '/settings', icon: Settings, color: 'text-gray-600', bg: 'bg-gray-100' },
    ],
  },
];

export default function MenuPage() {
  const { accountData, accountId } = useAccount();

  return (
    <MainLayout>
      <div className="max-w-lg mx-auto space-y-6">
        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card overflow-hidden"
        >
          <div className="bg-gradient-to-br from-nuskin-primary to-nuskin-secondary p-6 text-white">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center">
                <User className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-xl font-bold truncate">
                  {accountData?.account?.name || 'Loading...'}
                </h2>
                <p className="text-white/80 text-sm">
                  {accountData?.account?.current_title || 'Member'}
                </p>
                <p className="text-white/60 text-xs mt-1">
                  ID: {accountId}
                </p>
              </div>
              <ChevronRight className="w-5 h-5 text-white/50" />
            </div>
          </div>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-3 divide-x divide-gray-100">
            <div className="p-4 text-center">
              <p className="text-2xl font-bold text-gray-900">
                {accountData?.summary?.gsv?.toLocaleString() || '0'}
              </p>
              <p className="text-xs text-gray-500">GSV</p>
            </div>
            <div className="p-4 text-center">
              <p className="text-2xl font-bold text-gray-900">
                {accountData?.summary?.csv?.toLocaleString() || '0'}
              </p>
              <p className="text-xs text-gray-500">CSV</p>
            </div>
            <div className="p-4 text-center">
              <p className="text-2xl font-bold text-gray-900">
                {accountData?.summary?.active_downlines || '0'}
              </p>
              <p className="text-xs text-gray-500">Active Team</p>
            </div>
          </div>
        </motion.div>

        {/* AI Assistant Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Link href="/chat" className="block">
            <div className="card p-4 bg-gradient-to-r from-nuskin-primary/5 to-nuskin-accent/5 border border-nuskin-accent/20 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-nuskin-primary to-nuskin-accent flex items-center justify-center shadow-lg">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900">Ask Stela AI</h3>
                  <p className="text-sm text-gray-500">Get personalized insights & recommendations</p>
                </div>
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-nuskin-primary" />
                  <ChevronRight className="w-5 h-5 text-gray-300" />
                </div>
              </div>
            </div>
          </Link>
        </motion.div>

        {/* Menu Sections */}
        {menuSections.map((section, sectionIndex) => (
          <motion.div
            key={section.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + sectionIndex * 0.1 }}
          >
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-1">
              {section.title}
            </h3>
            <div className="card overflow-hidden divide-y divide-gray-50">
              {section.items.map((item, itemIndex) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center', item.bg)}>
                    <item.icon className={cn('w-5 h-5', item.color)} />
                  </div>
                  <span className="flex-1 font-medium text-gray-700">{item.name}</span>
                  <ChevronRight className="w-5 h-5 text-gray-300" />
                </Link>
              ))}
            </div>
          </motion.div>
        ))}

        {/* Share & Logout */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-3"
        >
          <button className="w-full card p-4 flex items-center gap-4 hover:bg-gray-50 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
              <Share2 className="w-5 h-5 text-blue-600" />
            </div>
            <span className="flex-1 font-medium text-gray-700 text-left">Share Stela AI</span>
            <ChevronRight className="w-5 h-5 text-gray-300" />
          </button>

          <button className="w-full card p-4 flex items-center gap-4 hover:bg-red-50 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
              <LogOut className="w-5 h-5 text-red-600" />
            </div>
            <span className="flex-1 font-medium text-red-600 text-left">Log Out</span>
          </button>
        </motion.div>

        {/* Version */}
        <p className="text-center text-xs text-gray-400 py-4">
          Stela AI v1.0.0 • Made with ❤️ for NuSkin Affiliates
        </p>
      </div>
    </MainLayout>
  );
}

