'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  Zap,
  TrendingUp,
  Users,
  Target,
  Sparkles,
  ChevronRight,
  Clock,
} from 'lucide-react';
import { cn, formatRelativeTime } from '@/lib/utils';

interface NBA {
  id: string;
  actionId?: string;
  type: 'growth' | 'retention' | 'qualification' | 'opportunity';
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  impact: string;
  counterfactual?: string;
  confidence?: number;
  dueDate?: string;
}

interface NBACardProps {
  actions: NBA[];
  showAll?: boolean;
}

const typeConfig = {
  growth: {
    icon: TrendingUp,
    color: 'text-green-600',
    bgColor: 'bg-green-100',
  },
  retention: {
    icon: Users,
    color: 'text-amber-600',
    bgColor: 'bg-amber-100',
  },
  qualification: {
    icon: Target,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
  },
  opportunity: {
    icon: Sparkles,
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
  },
};

const priorityConfig = {
  high: 'border-l-red-500',
  medium: 'border-l-amber-500',
  low: 'border-l-green-500',
};

export function NBACard({ actions, showAll = false }: NBACardProps) {
  const displayActions = showAll ? actions : actions.slice(0, 3);

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-gradient-to-br from-nuskin-primary to-nuskin-accent">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Next Best Actions</h3>
            <p className="text-sm text-gray-500">Personalized recommendations</p>
          </div>
        </div>
        {!showAll && actions.length > 3 && (
          <button className="text-sm text-nuskin-primary font-medium hover:text-nuskin-secondary transition-colors flex items-center gap-1">
            View All
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="space-y-3">
        {displayActions.map((action, index) => {
          const config = typeConfig[action.type];
          const Icon = config.icon;

          return (
            <motion.div
              key={action.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={cn(
                'p-4 rounded-xl bg-gray-50 border-l-4 hover:bg-white hover:shadow-md transition-all cursor-pointer group',
                priorityConfig[action.priority]
              )}
            >
              <div className="flex items-start gap-3">
                <div className={cn('p-2 rounded-lg', config.bgColor)}>
                  <Icon className={cn('w-4 h-4', config.color)} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-gray-900 truncate">
                      {action.title}
                    </h4>
                    <span className={cn(
                      'text-xs px-2 py-0.5 rounded-full font-medium',
                      action.priority === 'high' ? 'bg-red-100 text-red-700' :
                      action.priority === 'medium' ? 'bg-amber-100 text-amber-700' :
                      'bg-green-100 text-green-700'
                    )}>
                      {action.priority}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                    {action.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-nuskin-primary">
                      {action.impact}
                    </span>
                    {action.confidence && (
                      <div className="flex items-center gap-1 text-xs text-gray-400">
                        <span className="font-medium">{Math.round(action.confidence * 100)}%</span> confidence
                      </div>
                    )}
                    {action.dueDate && (
                      <div className="flex items-center gap-1 text-xs text-gray-400">
                        <Clock className="w-3 h-3" />
                        {formatRelativeTime(action.dueDate)}
                      </div>
                    )}
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-nuskin-primary transition-colors" />
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

