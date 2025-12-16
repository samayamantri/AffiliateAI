'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn, formatCurrency, formatNumber, formatPercentage, formatVolume } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: number;
  change?: number;
  format?: 'currency' | 'number' | 'percentage' | 'volume';
  icon: LucideIcon;
  iconColor?: string;
  description?: string;
  delay?: number;
}

export function StatCard({
  title,
  value,
  change,
  format = 'number',
  icon: Icon,
  iconColor = 'text-nuskin-accent',
  description,
  delay = 0,
}: StatCardProps) {
  const formatValue = () => {
    switch (format) {
      case 'currency':
        return formatCurrency(value);
      case 'volume':
        return formatVolume(value);
      case 'percentage':
        return `${value}%`;
      default:
        return formatNumber(value);
    }
  };

  const getTrendIcon = () => {
    if (!change) return <Minus className="w-3 h-3 md:w-4 md:h-4" />;
    return change > 0 ? (
      <TrendingUp className="w-3 h-3 md:w-4 md:h-4" />
    ) : (
      <TrendingDown className="w-3 h-3 md:w-4 md:h-4" />
    );
  };

  const getTrendColor = () => {
    if (!change) return 'text-gray-500 bg-gray-100';
    return change > 0
      ? 'text-green-600 bg-green-100'
      : 'text-red-600 bg-red-100';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: delay * 0.1, duration: 0.5 }}
      className="stat-card card-hover h-full"
    >
      <div className="flex items-start justify-between mb-2 md:mb-4">
        <div className={cn('p-2 md:p-3 rounded-lg md:rounded-xl bg-gradient-to-br from-nuskin-light to-white')}>
          <Icon className={cn('w-5 h-5 md:w-6 md:h-6', iconColor)} />
        </div>
        {typeof change !== 'undefined' && (
          <div className={cn('flex items-center gap-0.5 md:gap-1 px-1.5 md:px-2 py-0.5 md:py-1 rounded-full text-xs md:text-sm font-medium', getTrendColor())}>
            {getTrendIcon()}
            <span>{formatPercentage(change)}</span>
          </div>
        )}
      </div>

      <div className="relative z-10">
        <h3 className="text-xs md:text-sm font-medium text-gray-500 mb-0.5 md:mb-1 truncate">{title}</h3>
        <p className="text-lg md:text-2xl font-bold text-gray-900">{formatValue()}</p>
        {description && (
          <p className="text-xs md:text-sm text-gray-400 mt-0.5 md:mt-1">{description}</p>
        )}
      </div>
    </motion.div>
  );
}
