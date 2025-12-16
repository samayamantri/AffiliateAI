'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Zap,
  TrendingUp,
  Users,
  Target,
  Sparkles,
  ChevronRight,
  Clock,
  CheckCircle,
  Filter,
  Calendar,
  MessageSquare,
} from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { useNBAData } from '@/hooks/useApiData';
import { cn, formatRelativeTime } from '@/lib/utils';

type FilterType = 'all' | 'growth' | 'retention' | 'qualification' | 'opportunity';
type PriorityType = 'all' | 'high' | 'medium' | 'low';

const typeConfig = {
  growth: {
    icon: TrendingUp,
    color: 'text-green-600',
    bgColor: 'bg-green-100',
    label: 'Growth',
  },
  retention: {
    icon: Users,
    color: 'text-amber-600',
    bgColor: 'bg-amber-100',
    label: 'Retention',
  },
  qualification: {
    icon: Target,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
    label: 'Qualification',
  },
  opportunity: {
    icon: Sparkles,
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
    label: 'Opportunity',
  },
};

export default function NBAPage() {
  const { data: actions, loading, error } = useNBAData();
  const [typeFilter, setTypeFilter] = useState<FilterType>('all');
  const [priorityFilter, setPriorityFilter] = useState<PriorityType>('all');
  const [completedActions, setCompletedActions] = useState<string[]>([]);

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-nuskin-accent border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-500">Loading recommendations...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  // Safe handling of actions data
  const safeActions = actions || [];

  const filteredActions = safeActions.filter((action) => {
    const matchesType = typeFilter === 'all' || action?.type === typeFilter;
    const matchesPriority = priorityFilter === 'all' || action?.priority === priorityFilter;
    const notCompleted = !completedActions.includes(action?.id || '');
    return matchesType && matchesPriority && notCompleted;
  });

  const handleComplete = (id: string) => {
    setCompletedActions([...completedActions, id]);
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-2xl font-display font-bold text-gray-900">
              Next Best Actions
            </h1>
            <p className="text-gray-600 mt-1">
              AI-powered recommendations to grow your business
            </p>
          </motion.div>

          <motion.button
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="btn-primary flex items-center gap-2"
          >
            <Sparkles className="w-5 h-5" />
            Generate New Insights
          </motion.button>
        </div>

        {/* Stats Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          <div className="card p-4 text-center">
            <p className="text-3xl font-bold text-nuskin-primary">{safeActions.length}</p>
            <p className="text-sm text-gray-500">Total Actions</p>
          </div>
          <div className="card p-4 text-center">
            <p className="text-3xl font-bold text-red-500">
              {safeActions.filter((a) => a?.priority === 'high').length}
            </p>
            <p className="text-sm text-gray-500">High Priority</p>
          </div>
          <div className="card p-4 text-center">
            <p className="text-3xl font-bold text-green-500">{completedActions.length}</p>
            <p className="text-sm text-gray-500">Completed</p>
          </div>
          <div className="card p-4 text-center">
            <p className="text-3xl font-bold text-nuskin-gold">+$2.5K</p>
            <p className="text-sm text-gray-500">Potential Impact</p>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card p-4"
        >
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex items-center gap-2 flex-1">
              <Filter className="w-5 h-5 text-gray-400" />
              <span className="text-sm font-medium text-gray-600">Type:</span>
              <div className="flex items-center gap-2 flex-wrap">
                {(['all', 'growth', 'retention', 'qualification', 'opportunity'] as FilterType[]).map(
                  (filter) => (
                    <button
                      key={filter}
                      onClick={() => setTypeFilter(filter)}
                      className={cn(
                        'px-3 py-1.5 rounded-lg text-sm font-medium transition-all',
                        typeFilter === filter
                          ? 'bg-nuskin-primary text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      )}
                    >
                      {filter === 'all' ? 'All Types' : typeConfig[filter]?.label || filter}
                    </button>
                  )
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-600">Priority:</span>
              <div className="flex items-center gap-2">
                {(['all', 'high', 'medium', 'low'] as PriorityType[]).map((priority) => (
                  <button
                    key={priority}
                    onClick={() => setPriorityFilter(priority)}
                    className={cn(
                      'px-3 py-1.5 rounded-lg text-sm font-medium transition-all',
                      priorityFilter === priority
                        ? priority === 'high'
                          ? 'bg-red-500 text-white'
                          : priority === 'medium'
                          ? 'bg-amber-500 text-white'
                          : priority === 'low'
                          ? 'bg-green-500 text-white'
                          : 'bg-nuskin-primary text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    )}
                  >
                    {priority.charAt(0).toUpperCase() + priority.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Actions List */}
        <div className="space-y-4">
          <AnimatePresence>
            {filteredActions.map((action, index) => {
              const actionType = action?.type || 'growth';
              const config = typeConfig[actionType as keyof typeof typeConfig] || typeConfig.growth;
              const Icon = config.icon;

              return (
                <motion.div
                  key={action?.id || index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ delay: index * 0.05 }}
                  className={cn(
                    'card p-6 border-l-4 hover:shadow-lg transition-all',
                    action?.priority === 'high'
                      ? 'border-l-red-500'
                      : action?.priority === 'medium'
                      ? 'border-l-amber-500'
                      : 'border-l-green-500'
                  )}
                >
                  <div className="flex items-start gap-4">
                    <div className={cn('p-3 rounded-xl', config.bgColor)}>
                      <Icon className={cn('w-6 h-6', config.color)} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-gray-900">
                              {action?.title || 'Recommendation'}
                            </h3>
                            <span
                              className={cn(
                                'text-xs px-2 py-0.5 rounded-full font-medium',
                                action?.priority === 'high'
                                  ? 'bg-red-100 text-red-700'
                                  : action?.priority === 'medium'
                                  ? 'bg-amber-100 text-amber-700'
                                  : 'bg-green-100 text-green-700'
                              )}
                            >
                              {action?.priority || 'medium'} priority
                            </span>
                            <span
                              className={cn(
                                'text-xs px-2 py-0.5 rounded-full font-medium',
                                config.bgColor,
                                config.color
                              )}
                            >
                              {config.label}
                            </span>
                          </div>
                          <p className="text-gray-600">{action?.description || 'No description available'}</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-1 text-nuskin-primary font-medium">
                            <Zap className="w-4 h-4" />
                            {action?.impact || 'Medium impact'}
                          </div>
                          {action?.confidence && (
                            <div className="flex items-center gap-1 text-gray-500">
                              <Target className="w-4 h-4" />
                              {Math.round(action.confidence * 100)}% confidence
                            </div>
                          )}
                          {action?.dueDate && (
                            <>
                              <div className="flex items-center gap-1 text-gray-500">
                                <Clock className="w-4 h-4" />
                                Due {formatRelativeTime(action.dueDate)}
                              </div>
                              <div className="flex items-center gap-1 text-gray-500">
                                <Calendar className="w-4 h-4" />
                                {new Date(action.dueDate).toLocaleDateString()}
                              </div>
                            </>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                            <MessageSquare className="w-5 h-5 text-gray-400" />
                          </button>
                          <button
                            onClick={() => handleComplete(action?.id || '')}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-green-100 text-green-700 hover:bg-green-200 transition-colors font-medium text-sm"
                          >
                            <CheckCircle className="w-4 h-4" />
                            Mark Complete
                          </button>
                          <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-nuskin-primary text-white hover:bg-nuskin-secondary transition-colors font-medium text-sm">
                            Take Action
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {filteredActions.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="card p-12 text-center"
            >
              <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">All caught up!</h3>
              <p className="text-gray-500 mb-4">
                You've completed all actions in this category. Great work!
              </p>
              <button
                onClick={() => {
                  setTypeFilter('all');
                  setPriorityFilter('all');
                }}
                className="btn-secondary"
              >
                View All Actions
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}

