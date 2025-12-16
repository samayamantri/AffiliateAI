'use client';

import React from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Bell, Search, Menu, X } from 'lucide-react';
import { useAccount } from '@/context/AccountContext';
import { cn } from '@/lib/utils';

interface MobileHeaderProps {
  onMenuOpen: () => void;
  isMenuOpen: boolean;
}

export function MobileHeader({ onMenuOpen, isMenuOpen }: MobileHeaderProps) {
  const { accountId, accountData } = useAccount();
  const userName = accountData?.account?.name?.split(' ')[0] || 'Affiliate';

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-xl border-b border-gray-100 safe-area-pt md:hidden">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="relative">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-nuskin-primary to-nuskin-accent flex items-center justify-center shadow-lg">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-nuskin-gold rounded-full border-2 border-white" />
          </div>
          <div className="flex flex-col">
            <span className="font-display font-bold text-base gradient-text leading-tight">
              Stela AI
            </span>
            <span className="text-[10px] text-gray-500 -mt-0.5">Hi, {userName}</span>
          </div>
        </Link>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <motion.button
            whileTap={{ scale: 0.9 }}
            className="w-9 h-9 rounded-xl bg-gray-50 flex items-center justify-center"
          >
            <Search className="w-4 h-4 text-gray-500" />
          </motion.button>
          
          <motion.button
            whileTap={{ scale: 0.9 }}
            className="relative w-9 h-9 rounded-xl bg-gray-50 flex items-center justify-center"
          >
            <Bell className="w-4 h-4 text-gray-500" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={onMenuOpen}
            className={cn(
              'w-9 h-9 rounded-xl flex items-center justify-center transition-colors',
              isMenuOpen ? 'bg-nuskin-primary text-white' : 'bg-gray-50 text-gray-500'
            )}
          >
            <AnimatePresence mode="wait">
              {isMenuOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                >
                  <X className="w-4 h-4" />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                >
                  <Menu className="w-4 h-4" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </div>
    </header>
  );
}

