'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  TrendingUp,
  Users,
  Package,
  Sparkles,
  RefreshCw,
  AlertCircle,
  ChevronRight,
  Zap,
  MessageSquare,
} from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { StatCard } from '@/components/ui/StatCard';
import { PerformanceChart } from '@/components/charts/PerformanceChart';
import { DonutChart } from '@/components/charts/DonutChart';
import { NBACard } from '@/components/dashboard/NBACard';
import { QualificationProgress } from '@/components/dashboard/QualificationProgress';
import { DownlinePreview } from '@/components/dashboard/DownlinePreview';
import { InsightsCard } from '@/components/dashboard/InsightsCard';
import { useAccount } from '@/context/AccountContext';
import { useDashboardData } from '@/hooks/useApiData';

export default function Dashboard() {
  const { accountData, accountId, loading: accountLoading, error: accountError } = useAccount();
  const { data, loading: dataLoading, error: dataError, refetch } = useDashboardData();

  const loading = accountLoading || dataLoading;
  const error = accountError || dataError;

  // Extract chart data from performance data
  const chartData = data?.performance?.chartData || {
    labels: data?.performance?.monthly?.map((m: { month: string }) => m.month) || [],
    datasets: [{
      label: 'GSV',
      data: data?.performance?.monthly?.map((m: { gsv: number }) => m.gsv) || [],
      borderColor: '#008bb2',
      backgroundColor: 'rgba(0, 139, 178, 0.1)',
    }],
  };

  // Transform chart data to what PerformanceChart expects
  const performanceChartData = {
    labels: chartData.labels,
    sales: chartData.datasets?.[0]?.data || [],
    volume: chartData.datasets?.[1]?.data || chartData.datasets?.[0]?.data || [],
  };

  // Subscription chart data
  const subscriptionProducts = data?.subscriptions?.byProduct || [];
  const subscriptionChartData = {
    labels: subscriptionProducts.map((p: { name: string }) => p.name),
    values: subscriptionProducts.map((p: { revenue: number }) => p.revenue),
  };

  // Loading state - mobile optimized
  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 relative">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-nuskin-primary to-nuskin-accent flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-white animate-pulse" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-nuskin-gold border-2 border-white flex items-center justify-center">
                <RefreshCw className="w-3 h-3 text-white animate-spin" />
              </div>
            </div>
            <p className="text-gray-600 font-medium">Loading your dashboard...</p>
            <p className="text-sm text-gray-400 mt-1">ID: {accountId}</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  // Error state - mobile optimized
  if (error && !data?.performance && !accountData) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-[60vh] px-4">
          <div className="text-center max-w-sm">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-red-100 flex items-center justify-center">
              <AlertCircle className="w-8 h-8 text-red-500" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Connection Error</h2>
            <p className="text-gray-500 text-sm mb-6">{error}</p>
            <button onClick={refetch} className="btn-primary w-full">
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </button>
          </div>
        </div>
      </MainLayout>
    );
  }

  // Get current month stats
  const currentStats = {
    totalSales: accountData?.stats?.totalSales || data?.performance?.currentMonth?.gsv || 0,
    monthlyVolume: accountData?.stats?.monthlyVolume || data?.performance?.currentMonth?.volume || 0,
    growth: data?.performance?.currentMonth?.growth || 0,
    activeDownlines: accountData?.stats?.activeDownlines || data?.downlines?.length || 0,
    totalDownlines: accountData?.stats?.totalDownlines || data?.downlines?.length || 0,
    gsv: accountData?.stats?.gsv || data?.performance?.currentMonth?.gsv || 0,
    csv: accountData?.stats?.csv || data?.performance?.currentMonth?.csv || 0,
  };

  // Build qualification requirements from REAL API data only
  // Data already transformed by dataService.getQualifications()
  const qualificationRequirements = data?.qualifications?.requirements || [];

  return (
    <MainLayout>
      <div className="space-y-4 md:space-y-6">
        {/* Compact Welcome Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <Sparkles className="w-4 h-4 text-nuskin-accent" />
              <span className="text-xs font-medium text-gray-500">Welcome back</span>
            </div>
            <h1 className="text-xl md:text-2xl font-display font-bold text-gray-900">
              {accountData?.name ? `Hello, ${accountData.name.split(' ')[0]}!` : `Hey there!`}
            </h1>
          </div>
          <Link href="/chat">
            <motion.div
              whileTap={{ scale: 0.95 }}
              className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br from-nuskin-primary to-nuskin-accent flex items-center justify-center shadow-lg"
            >
              <MessageSquare className="w-5 h-5 md:w-6 md:h-6 text-white" />
            </motion.div>
          </Link>
        </motion.div>

        {/* 🎯 QUALIFICATION PROGRESS - TOP OF PAGE */}
        {data?.qualifications && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <QualificationProgress
              currentRank={data.qualifications.currentRank || data.qualifications.current_rank || accountData?.title || 'Member'}
              nextRank={data.qualifications.nextRank || data.qualifications.next_rank || 'Next Level'}
              overallProgress={data.qualifications.progress || data.qualifications.metrics?.success_rate || 0}
              requirements={qualificationRequirements}
              monthsQualified={data.qualifications.monthsQualified || data.qualifications.metrics?.met_qualifications || 0}
            />
          </motion.div>
        )}

        {/* ⚡ NEXT BEST ACTIONS - Prominent */}
        {data?.nba && data.nba.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Link href="/nba">
              <div className="card p-4 bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200 hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center flex-shrink-0">
                    <Zap className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 text-sm">
                      ⚡ {data.nba.length} Priority Action{data.nba.length > 1 ? 's' : ''} for You
                    </p>
                    <p className="text-xs text-gray-500">
                      Based on your current progress
                    </p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
                </div>
                
                {/* Show top 2 actions */}
                <div className="space-y-2">
                  {data.nba.slice(0, 2).map((action: { id?: string; title?: string; label?: string; priority?: string }, index: number) => (
                    <div
                      key={action.id || index}
                      className="flex items-center gap-2 p-2 bg-white/60 rounded-lg"
                    >
                      <span className={`w-2 h-2 rounded-full ${
                        action.priority === 'high' ? 'bg-red-500' : 
                        action.priority === 'medium' ? 'bg-amber-500' : 'bg-green-500'
                      }`} />
                      <span className="text-sm text-gray-700 flex-1 truncate">
                        {action.title || action.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </Link>
          </motion.div>
        )}

        {/* Stats Grid - Horizontal scroll on mobile */}
        <div className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0">
          <div className="flex md:grid md:grid-cols-4 gap-3 md:gap-4 min-w-max md:min-w-0">
            <div className="w-36 md:w-auto flex-shrink-0 md:flex-shrink">
              <StatCard
                title="Group Sales Volume"
                value={currentStats.gsv}
                change={currentStats.growth}
                format="volume"
                icon={TrendingUp}
                iconColor="text-green-600"
                delay={0}
              />
            </div>
            <div className="w-36 md:w-auto flex-shrink-0 md:flex-shrink">
              <StatCard
                title="Customer Sales Volume"
                value={currentStats.csv}
                change={8.2}
                format="volume"
                icon={TrendingUp}
                iconColor="text-nuskin-accent"
                delay={1}
              />
            </div>
            <div className="w-36 md:w-auto flex-shrink-0 md:flex-shrink">
              <StatCard
                title="Team Members"
                value={currentStats.totalDownlines}
                change={4.5}
                icon={Users}
                iconColor="text-nuskin-secondary"
                description={`${currentStats.activeDownlines} active`}
                delay={2}
              />
            </div>
            <div className="w-36 md:w-auto flex-shrink-0 md:flex-shrink">
              <StatCard
                title="Subscriptions"
                value={data?.subscriptions?.totalSubscribers || 0}
                change={data?.subscriptions?.growth || 0}
                icon={Package}
                iconColor="text-purple-600"
                description={`${data?.subscriptions?.activeSubscriptions || 0} active`}
                delay={3}
              />
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          {/* Performance Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-2 card p-4 md:p-6"
          >
            <div className="flex items-center justify-between mb-4 md:mb-6">
              <div>
                <h3 className="font-semibold text-gray-900 text-sm md:text-base">Performance Trends</h3>
                <p className="text-xs md:text-sm text-gray-500">Your growth over time</p>
              </div>
              <Link href="/performance" className="text-xs text-nuskin-primary font-medium flex items-center gap-1">
                View All <ChevronRight className="w-3 h-3" />
              </Link>
            </div>
            {performanceChartData.labels.length > 0 ? (
              <div className="chart-container">
                <PerformanceChart data={performanceChartData} />
              </div>
            ) : (
              <div className="h-48 md:h-64 flex items-center justify-center text-gray-400">
                <div className="text-center">
                  <AlertCircle className="w-8 h-8 mx-auto mb-2" />
                  <p className="text-sm">No performance data</p>
                </div>
              </div>
            )}
          </motion.div>

          {/* Subscription Distribution - Hidden on mobile */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="hidden lg:block card p-4 md:p-6"
          >
            <div className="mb-4 md:mb-6">
              <h3 className="font-semibold text-gray-900 text-sm md:text-base">Subscriptions</h3>
              <p className="text-xs md:text-sm text-gray-500">By product</p>
            </div>
            {subscriptionChartData.labels.length > 0 ? (
              <DonutChart
                data={subscriptionChartData}
                centerLabel="Monthly"
                centerValue={data?.subscriptions?.monthlyRecurring || 0}
              />
            ) : (
              <div className="h-48 flex items-center justify-center text-gray-400">
                <div className="text-center">
                  <Package className="w-8 h-8 mx-auto mb-2" />
                  <p className="text-sm">No subscription data</p>
                </div>
              </div>
            )}
          </motion.div>
        </div>

        {/* Team Preview */}
        {data?.downlines && data.downlines.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <DownlinePreview
              downlines={data.downlines}
              totalActive={data.downlines.filter((d: { active: boolean }) => d.active).length}
              totalDownlines={data.downlines.length}
            />
          </motion.div>
        )}

        {/* NBA Card - Full on desktop */}
        {data?.nba && data.nba.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="hidden md:block"
          >
            <NBACard actions={data.nba} />
          </motion.div>
        )}

        {/* Insights */}
        {data?.insights && data.insights.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <InsightsCard insights={data.insights} />
          </motion.div>
        )}

        {/* Refresh Button */}
        <div className="flex justify-center pb-4">
          <button
            onClick={refetch}
            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-500 hover:text-nuskin-primary transition-colors touch-manipulation"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh Data
          </button>
        </div>
      </div>
    </MainLayout>
  );
}
