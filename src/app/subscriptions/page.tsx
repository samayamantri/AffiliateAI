'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  Package,
  TrendingUp,
  Users,
  DollarSign,
  Calendar,
  RefreshCw,
  AlertCircle,
  ChevronRight,
  Plus,
} from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { StatCard } from '@/components/ui/StatCard';
import { PerformanceChart } from '@/components/charts/PerformanceChart';
import { DonutChart } from '@/components/charts/DonutChart';
import { useSubscriptionData } from '@/hooks/useApiData';
import { cn, formatCurrency } from '@/lib/utils';

export default function SubscriptionsPage() {
  const { data: subscriptions, loading } = useSubscriptionData();

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-nuskin-accent border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-500">Loading subscription data...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  // Safe defaults for subscription data
  const safeSubscriptions = {
    totalSubscribers: subscriptions?.totalSubscribers || 0,
    activeSubscriptions: subscriptions?.activeSubscriptions || 0,
    monthlyRecurring: subscriptions?.monthlyRecurring || subscriptions?.metrics?.totalMonthlySv || 0,
    churnRate: subscriptions?.churnRate || 0,
    growth: subscriptions?.growth || 0,
    byProduct: subscriptions?.byProduct || [],
    metrics: subscriptions?.metrics || { totalMonthlySv: 0, totalMonthlyCsv: 0, cancelled: 0, paused: 0 },
  };

  const growthData = {
    labels: ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    sales: [120, 128, 135, 140, 148, 156],
    volume: [10500, 10800, 11200, 11600, 12000, 12400],
  };

  const productData = {
    labels: safeSubscriptions.byProduct.map((p: { name?: string }) => p?.name || ''),
    values: safeSubscriptions.byProduct.map((p: { subscribers?: number }) => p?.subscribers || 0),
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
              Subscription Management
            </h1>
            <p className="text-gray-600 mt-1">
              Monitor and grow your recurring revenue
            </p>
          </motion.div>

          <motion.button
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add Subscription
          </motion.button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Subscribers"
            value={safeSubscriptions.totalSubscribers}
            change={safeSubscriptions.growth}
            icon={Users}
            iconColor="text-nuskin-primary"
            delay={0}
          />
          <StatCard
            title="Active Subscriptions"
            value={safeSubscriptions.activeSubscriptions}
            icon={Package}
            iconColor="text-green-600"
            description={`${safeSubscriptions.metrics?.paused || 0} paused`}
            delay={1}
          />
          <StatCard
            title="Monthly Recurring"
            value={safeSubscriptions.monthlyRecurring}
            change={12.3}
            format="currency"
            icon={DollarSign}
            iconColor="text-nuskin-gold"
            delay={2}
          />
          <StatCard
            title="Churn Rate"
            value={safeSubscriptions.churnRate}
            format="percentage"
            icon={RefreshCw}
            iconColor="text-amber-600"
            description="Last 30 days"
            delay={3}
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2 card p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-semibold text-gray-900">Subscription Growth</h3>
                <p className="text-sm text-gray-500">Subscribers and revenue over time</p>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-nuskin-primary" />
                  <span className="text-gray-600">Subscribers</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-nuskin-accent" />
                  <span className="text-gray-600">Revenue</span>
                </div>
              </div>
            </div>
            <PerformanceChart data={growthData} type="bar" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="card p-6"
          >
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900">By Product</h3>
              <p className="text-sm text-gray-500">Subscription distribution</p>
            </div>
            {productData.labels.length > 0 ? (
              <DonutChart
                data={productData}
                centerLabel="Products"
                centerValue={safeSubscriptions.byProduct.length}
              />
            ) : (
              <div className="h-64 flex items-center justify-center text-gray-400">
                <div className="text-center">
                  <Package className="w-8 h-8 mx-auto mb-2" />
                  <p>No product data available</p>
                </div>
              </div>
            )}
          </motion.div>
        </div>

        {/* Product Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="card p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-semibold text-gray-900">Product Performance</h3>
              <p className="text-sm text-gray-500">Revenue by subscription product</p>
            </div>
            <button className="text-sm text-nuskin-primary font-medium hover:text-nuskin-secondary flex items-center gap-1">
              View All Products
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {safeSubscriptions.byProduct.length > 0 ? (
              safeSubscriptions.byProduct.map((product: { name?: string; revenue?: number; subscribers?: number }, index: number) => (
                <motion.div
                  key={product?.name || index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="p-4 rounded-xl bg-gray-50 hover:bg-white hover:shadow-md transition-all cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-medium text-gray-900">{product?.name || 'Unknown Product'}</span>
                    <Package className="w-5 h-5 text-nuskin-accent" />
                  </div>
                  <p className="text-2xl font-bold text-gray-900 mb-1">
                    {formatCurrency(product?.revenue || 0)}
                  </p>
                  <p className="text-sm text-gray-500">
                    {product?.subscribers || 0} subscribers
                  </p>
                </motion.div>
              ))
            ) : (
              <div className="col-span-4 p-8 text-center text-gray-400">
                <Package className="w-8 h-8 mx-auto mb-2" />
                <p>No product data available</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Insights & Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="card p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-xl bg-green-100">
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Growth Opportunities</h3>
                <p className="text-sm text-gray-500">Ways to increase subscriptions</p>
              </div>
            </div>

            <div className="space-y-3">
              {[
                { title: 'Upsell to existing customers', potential: '+$2,400/mo', description: '45 customers eligible for upgrade' },
                { title: 'Reactivate paused subscriptions', potential: '+$800/mo', description: '14 paused subscriptions' },
                { title: 'Convert one-time buyers', potential: '+$1,200/mo', description: '28 recent buyers not subscribed' },
              ].map((opportunity, index) => (
                <div
                  key={index}
                  className="p-4 rounded-xl bg-gray-50 hover:bg-white hover:shadow-sm transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">{opportunity.title}</p>
                      <p className="text-sm text-gray-500">{opportunity.description}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-600">{opportunity.potential}</p>
                      <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-nuskin-primary transition-colors ml-auto" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="card p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-xl bg-amber-100">
                <AlertCircle className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">At-Risk Subscriptions</h3>
                <p className="text-sm text-gray-500">Subscribers who may churn</p>
              </div>
            </div>

            <div className="space-y-3">
              {[
                { name: 'John Smith', product: 'ageLOC Meta', risk: 'High', reason: 'Payment failed twice' },
                { name: 'Lisa Wong', product: 'TR90', risk: 'Medium', reason: 'No orders in 60 days' },
                { name: 'Mike Chen', product: 'LifePak', risk: 'Low', reason: 'Reduced order frequency' },
              ].map((subscriber, index) => (
                <div
                  key={index}
                  className="p-4 rounded-xl bg-gray-50 hover:bg-white hover:shadow-sm transition-all cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">{subscriber.name}</p>
                      <p className="text-sm text-gray-500">{subscriber.product} - {subscriber.reason}</p>
                    </div>
                    <span className={cn(
                      'px-2 py-1 rounded-full text-xs font-medium',
                      subscriber.risk === 'High' ? 'bg-red-100 text-red-700' :
                      subscriber.risk === 'Medium' ? 'bg-amber-100 text-amber-700' :
                      'bg-green-100 text-green-700'
                    )}>
                      {subscriber.risk} Risk
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <button className="mt-4 w-full py-3 rounded-xl bg-amber-100 text-amber-700 font-medium hover:bg-amber-200 transition-colors">
              View All At-Risk ({3} total)
            </button>
          </motion.div>
        </div>
      </div>
    </MainLayout>
  );
}

