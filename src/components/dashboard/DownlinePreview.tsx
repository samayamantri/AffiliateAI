'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Users, ChevronRight, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn, getInitials, getRankColor, formatVolume, formatPercentage } from '@/lib/utils';

interface Downline {
  id: string;
  personId?: string;
  name: string;
  rank: string;
  title?: string;
  volume: number;
  gsv?: number;
  csv?: number;
  growth: number;
  active: boolean;
  depth?: number;
}

interface DownlinePreviewProps {
  downlines: Downline[];
  totalActive: number;
  totalDownlines: number;
}

export function DownlinePreview({ downlines, totalActive, totalDownlines }: DownlinePreviewProps) {
  const topPerformers = [...downlines]
    .sort((a, b) => (b.gsv || b.volume || 0) - (a.gsv || a.volume || 0))
    .slice(0, 5);

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-gradient-to-br from-nuskin-secondary to-nuskin-accent">
            <Users className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Your Team</h3>
            <p className="text-sm text-gray-500">
              <span className="text-nuskin-primary font-medium">{totalActive}</span> of {totalDownlines} active
            </p>
          </div>
        </div>
        <button className="text-sm text-nuskin-primary font-medium hover:text-nuskin-secondary transition-colors flex items-center gap-1">
          Manage Team
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-3">
        {topPerformers.map((member, index) => (
          <motion.div
            key={member.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer group"
          >
            <div className="relative">
              <div className={cn(
                'w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium',
                member.active 
                  ? 'bg-gradient-to-br from-nuskin-primary to-nuskin-secondary text-white' 
                  : 'bg-gray-200 text-gray-500'
              )}>
                {getInitials(member.name)}
              </div>
              {member.active && (
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-medium text-gray-900 truncate">
                  {member.name}
                </span>
                <span className={cn('text-xs px-2 py-0.5 rounded-full', getRankColor(member.title || member.rank))}>
                  {member.title || member.rank}
                </span>
              </div>
              <p className="text-sm text-gray-500">
                {formatVolume(member.gsv || member.volume || 0)} GSV
              </p>
            </div>

            <div className={cn(
              'flex items-center gap-1 text-sm font-medium',
              member.growth > 0 ? 'text-green-600' : member.growth < 0 ? 'text-red-600' : 'text-gray-400'
            )}>
              {member.growth > 0 ? (
                <TrendingUp className="w-4 h-4" />
              ) : member.growth < 0 ? (
                <TrendingDown className="w-4 h-4" />
              ) : (
                <Minus className="w-4 h-4" />
              )}
              {formatPercentage(member.growth)}
            </div>

            <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-nuskin-primary transition-colors" />
          </motion.div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-100">
        <button className="w-full py-2 text-sm font-medium text-nuskin-primary hover:text-nuskin-secondary transition-colors">
          View All Team Members
        </button>
      </div>
    </div>
  );
}

