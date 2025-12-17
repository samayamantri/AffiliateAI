'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  Target,
  Calendar,
  Download,
  ChevronDown,
} from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { StatCard } from '@/components/ui/StatCard';
import { PerformanceChart } from '@/components/charts/PerformanceChart';
import { DonutChart } from '@/components/charts/DonutChart';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { usePerformanceData } from '@/hooks/useApiData';
import { useAccount } from '@/context/AccountContext';
import { cn, formatVolume } from '@/lib/utils';

type TimeRange = '1M' | '3M' | '6M' | '1Y';

export default function PerformancePage() {
  const { accountData } = useAccount();
  const { data: performanceData, loading } = usePerformanceData();
  const [timeRange, setTimeRange] = useState<TimeRange>('6M');

  if (loading || !performanceData) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-nuskin-accent border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-500">Loading performance data...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  const chartData = {
    labels: performanceData.monthly.map((m) => m.month),
    sales: performanceData.monthly.map((m) => m.sales),
    volume: performanceData.monthly.map((m) => m.volume),
  };

  const volumeBreakdown = {
    labels: ['Personal Volume', 'Group Volume', 'Team Bonus'],
    values: [
      accountData?.stats.personalVolume || 2500,
      accountData?.stats.groupVolume || 6000,
      2500,
    ],
  };

  const monthlyGoals = [
    { name: 'Sales Target', current: 8500, target: 10000 },
    { name: 'Personal Volume', current: 2500, target: 3000 },
    { name: 'New Customers', current: 12, target: 15 },
    { name: 'Team Growth', current: 3, target: 5 },
  ];

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
              Performance Analytics
            </h1>
            <p className="text-gray-600 mt-1">
              Track your business growth and key metrics
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3"
          >
            <button className="btn-secondary flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export Report
            </button>
            <button className="btn-primary flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Dec 2024
              <ChevronDown className="w-4 h-4" />
            </button>
          </motion.div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total GSV"
            value={performanceData.currentMonth.sales}
            change={performanceData.currentMonth.growth}
            format="volume"
            icon={TrendingUp}
            iconColor="text-green-600"
            description="This month"
            delay={0}
          />
          <StatCard
            title="Monthly Volume"
            value={performanceData.currentMonth.volume}
            change={8.2}
            format="volume"
            icon={TrendingUp}
            iconColor="text-nuskin-accent"
            delay={1}
          />
          <StatCard
            title="Personal Volume"
            value={accountData?.stats.personalVolume || 2500}
            change={5.5}
            format="volume"
            icon={Target}
            iconColor="text-purple-600"
            delay={2}
          />
          <StatCard
            title="Target Progress"
            value={85}
            format="percentage"
            icon={Target}
            iconColor="text-nuskin-gold"
            description="Monthly goal"
            delay={3}
          />
        </div>

        {/* Main Chart Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2 card p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-semibold text-gray-900">Sales & Volume Trends</h3>
                <p className="text-sm text-gray-500">Historical performance data</p>
              </div>
              <div className="flex items-center gap-2 bg-gray-100 rounded-xl p-1">
                {(['1M', '3M', '6M', '1Y'] as TimeRange[]).map((range) => (
                  <button
                    key={range}
                    onClick={() => setTimeRange(range)}
                    className={cn(
                      'px-4 py-1.5 rounded-lg text-sm font-medium transition-all',
                      timeRange === range
                        ? 'bg-white text-nuskin-primary shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    )}
                  >
                    {range}
                  </button>
                ))}
              </div>
            </div>
            <PerformanceChart data={chartData} type="line" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="card p-6"
          >
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900">Volume Breakdown</h3>
              <p className="text-sm text-gray-500">Distribution by source</p>
            </div>
            <DonutChart
              data={volumeBreakdown}
              centerLabel="Total Volume"
              centerValue={accountData?.stats.monthlyVolume || 8500}
            />
          </motion.div>
        </div>

        {/* Monthly Goals */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="card p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-semibold text-gray-900">Monthly Goals</h3>
              <p className="text-sm text-gray-500">Track your progress towards targets</p>
            </div>
            <button className="text-sm text-nuskin-primary font-medium hover:text-nuskin-secondary">
              Edit Goals
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {monthlyGoals.map((goal, index) => {
              const progress = Math.round((goal.current / goal.target) * 100);
              const isComplete = goal.current >= goal.target;
              
              return (
                <motion.div
                  key={goal.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className={cn(
                    'p-4 rounded-xl border',
                    isComplete ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-100'
                  )}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-medium text-gray-900">{goal.name}</span>
                    <span className={cn(
                      'text-sm font-bold',
                      isComplete ? 'text-green-600' : 'text-nuskin-primary'
                    )}>
                      {progress}%
                    </span>
                  </div>
                  <ProgressBar
                    value={goal.current}
                    max={goal.target}
                    showValues
                    size="md"
                    color={isComplete ? 'success' : 'default'}
                  />
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Comparison Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="card p-6"
        >
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900">Period Comparison</h3>
            <p className="text-sm text-gray-500">Compare performance across periods</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 rounded-xl bg-nuskin-light/50">
              <p className="text-sm text-gray-500 mb-1">This Month</p>
              <p className="text-2xl font-bold text-nuskin-primary">
                {formatVolume(performanceData.currentMonth.sales)}
              </p>
              <p className="text-sm text-green-600 mt-1">
                +{performanceData.currentMonth.growth}% vs last month
              </p>
            </div>
            <div className="p-4 rounded-xl bg-gray-50">
              <p className="text-sm text-gray-500 mb-1">Last Month</p>
              <p className="text-2xl font-bold text-gray-700">
                {formatVolume(9100)}
              </p>
              <p className="text-sm text-gray-500 mt-1">November 2024</p>
            </div>
            <div className="p-4 rounded-xl bg-gray-50">
              <p className="text-sm text-gray-500 mb-1">Same Period Last Year</p>
              <p className="text-2xl font-bold text-gray-700">
                {formatVolume(6800)}
              </p>
              <p className="text-sm text-green-600 mt-1">+25% YoY growth</p>
            </div>
          </div>
        </motion.div>
      </div>
    </MainLayout>
  );
}

