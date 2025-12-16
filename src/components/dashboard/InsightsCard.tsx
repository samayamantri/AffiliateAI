'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  Sparkles,
  TrendingUp,
  AlertCircle,
  Lightbulb,
  ChevronRight,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Insight {
  id: string;
  type: 'trend' | 'alert' | 'tip';
  title: string;
  message: string;
}

interface InsightsCardProps {
  insights: Insight[];
  onDismiss?: (id: string) => void;
}

const typeConfig = {
  trend: {
    icon: TrendingUp,
    bgColor: 'bg-blue-50',
    iconColor: 'text-blue-600',
    borderColor: 'border-blue-200',
  },
  alert: {
    icon: AlertCircle,
    bgColor: 'bg-amber-50',
    iconColor: 'text-amber-600',
    borderColor: 'border-amber-200',
  },
  tip: {
    icon: Lightbulb,
    bgColor: 'bg-green-50',
    iconColor: 'text-green-600',
    borderColor: 'border-green-200',
  },
};

export function InsightsCard({ insights, onDismiss }: InsightsCardProps) {
  return (
    <div className="card p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">AI Insights</h3>
          <p className="text-sm text-gray-500">Powered by Stela AI</p>
        </div>
      </div>

      <div className="space-y-3">
        {insights.map((insight, index) => {
          const config = typeConfig[insight.type];
          const Icon = config.icon;

          return (
            <motion.div
              key={insight.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={cn(
                'p-4 rounded-xl border relative group',
                config.bgColor,
                config.borderColor
              )}
            >
              {onDismiss && (
                <button
                  onClick={() => onDismiss(insight.id)}
                  className="absolute top-2 right-2 p-1 rounded-full opacity-0 group-hover:opacity-100 hover:bg-white/50 transition-all"
                >
                  <X className="w-4 h-4 text-gray-400" />
                </button>
              )}
              <div className="flex items-start gap-3">
                <div className={cn('p-2 rounded-lg bg-white/60')}>
                  <Icon className={cn('w-4 h-4', config.iconColor)} />
                </div>
                <div className="flex-1 pr-6">
                  <h4 className="font-medium text-gray-900 mb-1">
                    {insight.title}
                  </h4>
                  <p className="text-sm text-gray-600">{insight.message}</p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <button className="mt-4 w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-nuskin-primary to-nuskin-secondary text-white font-medium hover:shadow-lg hover:shadow-nuskin-primary/25 transition-all">
        <Sparkles className="w-4 h-4" />
        Get More Insights
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}

