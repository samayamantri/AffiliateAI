'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ProgressBarProps {
  value: number;
  max: number;
  label?: string;
  showValues?: boolean;
  size?: 'sm' | 'md' | 'lg';
  color?: 'default' | 'success' | 'warning' | 'danger';
}

export function ProgressBar({
  value,
  max,
  label,
  showValues = true,
  size = 'md',
  color = 'default',
}: ProgressBarProps) {
  const progress = Math.min((value / max) * 100, 100);
  const isComplete = value >= max;

  const sizeClasses = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  };

  const colorClasses = {
    default: 'from-nuskin-primary to-nuskin-accent',
    success: 'from-green-500 to-emerald-400',
    warning: 'from-amber-500 to-orange-400',
    danger: 'from-red-500 to-rose-400',
  };

  return (
    <div className="w-full">
      {(label || showValues) && (
        <div className="flex items-center justify-between mb-2">
          {label && <span className="text-sm font-medium text-gray-700">{label}</span>}
          {showValues && (
            <span className={cn(
              'text-sm font-medium',
              isComplete ? 'text-green-600' : 'text-gray-500'
            )}>
              {value.toLocaleString()} / {max.toLocaleString()}
            </span>
          )}
        </div>
      )}
      <div className={cn('progress-bar', sizeClasses[size])}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className={cn(
            'h-full rounded-full bg-gradient-to-r',
            colorClasses[isComplete ? 'success' : color]
          )}
        />
      </div>
    </div>
  );
}

