'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Users,
  Target,
  MessageSquare,
  MoreHorizontal,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { name: 'Home', href: '/', icon: LayoutDashboard },
  { name: 'Team', href: '/downlines', icon: Users },
  { name: 'Qualify', href: '/qualifications', icon: Target },
  { name: 'Chat', href: '/chat', icon: MessageSquare },
  { name: 'More', href: '/menu', icon: MoreHorizontal },
];

export function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-t border-gray-100 safe-area-pb md:hidden">
      <div className="flex items-center justify-around px-2 py-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href || 
            (item.href !== '/' && pathname.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              className="flex-1 relative"
            >
              <motion.div
                whileTap={{ scale: 0.9 }}
                className={cn(
                  'flex flex-col items-center justify-center py-2 px-1 rounded-2xl transition-all',
                  isActive && 'bg-nuskin-primary/10'
                )}
              >
                <div className="relative">
                  <Icon
                    className={cn(
                      'w-6 h-6 transition-colors',
                      isActive ? 'text-nuskin-primary' : 'text-gray-400'
                    )}
                  />
                  {isActive && (
                    <motion.div
                      layoutId="bottomNavIndicator"
                      className="absolute -top-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-nuskin-primary"
                    />
                  )}
                </div>
                <span
                  className={cn(
                    'text-[10px] mt-1 font-medium transition-colors',
                    isActive ? 'text-nuskin-primary' : 'text-gray-400'
                  )}
                >
                  {item.name}
                </span>
              </motion.div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

