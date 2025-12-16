'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  Target,
  Award,
  CheckCircle2,
  Circle,
  ChevronRight,
  TrendingUp,
  Calendar,
  Sparkles,
  Info,
} from 'lucide-react';
import Link from 'next/link';
import { MainLayout } from '@/components/layout/MainLayout';
import { ProgressRing } from '@/components/ui/ProgressRing';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { useQualificationData } from '@/hooks/useApiData';
import { useAccount } from '@/context/AccountContext';
import { cn, getRankColor } from '@/lib/utils';

const rankPath = [
  { name: 'Executive', achieved: true, date: 'Mar 2021' },
  { name: 'Silver', achieved: true, date: 'Aug 2021' },
  { name: 'Gold', achieved: true, date: 'Jan 2022' },
  { name: 'Gold Director', achieved: true, date: 'Sep 2023', current: true },
  { name: 'Lapis Director', achieved: false },
  { name: 'Ruby Director', achieved: false },
  { name: 'Emerald Director', achieved: false },
  { name: 'Diamond', achieved: false },
];

export default function QualificationsPage() {
  const { capabilities } = useAccount();
  const { data: qualifications, loading } = useQualificationData();

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-nuskin-accent border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-500">Loading qualifications...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  // Show message for accounts that don't have qualification tracking
  if (!capabilities.hasQualifications) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-md mx-auto px-4"
          >
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-nuskin-primary/10 to-nuskin-accent/10 flex items-center justify-center">
              <Target className="w-10 h-10 text-nuskin-primary" />
            </div>
            <h2 className="text-xl font-display font-bold text-gray-900 mb-3">
              Unlock Qualifications
            </h2>
            <p className="text-gray-600 mb-6">
              As a {capabilities.roleDisplayName}, qualification tracking becomes available when you start building your business. 
              Talk to Stela AI to learn about advancement opportunities.
            </p>
            <div className="space-y-3">
              <Link href="/chat" className="btn-primary w-full flex items-center justify-center gap-2">
                <Sparkles className="w-4 h-4" />
                Learn About Qualifications
              </Link>
              <Link href="/" className="btn-secondary w-full">
                Back to Dashboard
              </Link>
            </div>
          </motion.div>
        </div>
      </MainLayout>
    );
  }

  // Safe defaults for qualification data
  const safeQualifications = {
    currentRank: qualifications?.currentRank || 'Member',
    nextRank: qualifications?.nextRank || 'Next Level',
    progress: qualifications?.progress || qualifications?.metrics?.successRate || 0,
    monthsQualified: qualifications?.monthsQualified || qualifications?.metrics?.met || 0,
    consecutiveMonths: qualifications?.metrics?.met || 0,
    requirements: qualifications?.requirements || [],
    metrics: qualifications?.metrics || { total: 0, met: 0, pending: 0, successRate: 0 },
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-2xl font-display font-bold text-gray-900">
            Qualification Tracker
          </h1>
          <p className="text-gray-600 mt-1">
            Track your progress and see what you need to reach the next level
          </p>
        </motion.div>

        {/* Current Status Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card p-6 bg-gradient-to-br from-white to-nuskin-light/30"
        >
          <div className="flex flex-col lg:flex-row lg:items-center gap-8">
            {/* Progress Ring */}
            <div className="flex items-center gap-8">
              <ProgressRing
                progress={safeQualifications.progress}
                size={140}
                strokeWidth={10}
                label="to Next Rank"
              />
              
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Award className="w-5 h-5 text-nuskin-gold" />
                  <span className="text-sm text-gray-500">Current Rank</span>
                </div>
                <h2 className={cn(
                  'text-2xl font-bold px-4 py-2 rounded-xl inline-block',
                  getRankColor(safeQualifications.currentRank)
                )}>
                  {safeQualifications.currentRank}
                </h2>
                
                <div className="mt-4 flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span>Qualified for {safeQualifications.monthsQualified} months</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-green-600 mt-1">
                  <TrendingUp className="w-4 h-4" />
                  <span>{safeQualifications.consecutiveMonths} consecutive months</span>
                </div>
              </div>
            </div>

            {/* Next Rank Preview */}
            <div className="flex-1 lg:border-l lg:pl-8 border-gray-200">
              <div className="flex items-center gap-2 mb-3">
                <Target className="w-5 h-5 text-nuskin-accent" />
                <span className="text-sm font-medium text-gray-700">Next Goal</span>
              </div>
              <h3 className={cn(
                'text-xl font-bold px-4 py-2 rounded-xl inline-block mb-4',
                getRankColor(safeQualifications.nextRank)
              )}>
                {safeQualifications.nextRank}
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white rounded-xl p-4 shadow-sm">
                  <p className="text-sm text-gray-500">Requirements Met</p>
                  <p className="text-2xl font-bold text-nuskin-primary">
                    {safeQualifications.requirements.filter((r: { met?: boolean }) => r?.met).length}/{safeQualifications.requirements.length}
                  </p>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm">
                  <p className="text-sm text-gray-500">Estimated Time</p>
                  <p className="text-2xl font-bold text-nuskin-accent">~2 months</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Requirements Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {safeQualifications.requirements.length > 0 ? (
            safeQualifications.requirements.map((req: { name?: string; met?: boolean; current?: number; required?: number }, index: number) => (
              <motion.div
                key={req?.name || index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={cn(
                  'card p-6 border-l-4',
                  req?.met ? 'border-l-green-500' : 'border-l-amber-500'
                )}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    {req?.met ? (
                      <div className="p-2 rounded-xl bg-green-100">
                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                      </div>
                    ) : (
                      <div className="p-2 rounded-xl bg-amber-100">
                        <Circle className="w-5 h-5 text-amber-600" />
                      </div>
                    )}
                    <div>
                      <h3 className="font-semibold text-gray-900">{req?.name || 'Requirement'}</h3>
                      <p className="text-sm text-gray-500">
                        {req?.met ? 'Requirement met!' : `Need ${(req?.required || 0) - (req?.current || 0)} more`}
                      </p>
                    </div>
                  </div>
                  <span className={cn(
                    'text-sm font-medium px-2 py-1 rounded-full',
                    req?.met ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                  )}>
                    {req?.met ? 'Complete' : 'In Progress'}
                  </span>
                </div>

                <ProgressBar
                  value={req?.current || 0}
                  max={req?.required || 100}
                  size="md"
                  color={req?.met ? 'success' : 'default'}
                />

                {!req?.met && (
                  <button className="mt-4 flex items-center gap-2 text-sm text-nuskin-primary font-medium hover:text-nuskin-secondary transition-colors">
                    <Sparkles className="w-4 h-4" />
                    Get tips to achieve this
                    <ChevronRight className="w-4 h-4" />
                  </button>
                )}
              </motion.div>
            ))
          ) : (
            <div className="col-span-2 card p-12 text-center text-gray-400">
              <Target className="w-12 h-12 mx-auto mb-4" />
              <p>No qualification requirements available</p>
              <p className="text-sm">Check back when your qualifications are loaded</p>
            </div>
          )}
        </div>

        {/* Rank Journey */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="card p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-xl bg-gradient-to-br from-nuskin-gold/20 to-nuskin-gold/10">
              <Award className="w-5 h-5 text-nuskin-gold" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Your Rank Journey</h3>
              <p className="text-sm text-gray-500">See how far you've come</p>
            </div>
          </div>

          <div className="relative">
            {/* Progress Line */}
            <div className="absolute top-5 left-5 right-5 h-1 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-nuskin-primary to-nuskin-accent rounded-full"
                style={{ width: '50%' }}
              />
            </div>

            {/* Rank Steps */}
            <div className="relative flex justify-between">
              {rankPath.map((rank, index) => (
                <div key={rank.name} className="flex flex-col items-center">
                  <div
                    className={cn(
                      'w-10 h-10 rounded-full flex items-center justify-center border-4 border-white shadow-md z-10',
                      rank.current
                        ? 'bg-gradient-to-br from-nuskin-primary to-nuskin-accent'
                        : rank.achieved
                        ? 'bg-nuskin-primary'
                        : 'bg-gray-200'
                    )}
                  >
                    {rank.achieved ? (
                      <CheckCircle2 className="w-5 h-5 text-white" />
                    ) : (
                      <Circle className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                  <div className="mt-3 text-center">
                    <p className={cn(
                      'text-xs font-medium',
                      rank.current ? 'text-nuskin-primary' : rank.achieved ? 'text-gray-700' : 'text-gray-400'
                    )}>
                      {rank.name}
                    </p>
                    {rank.date && (
                      <p className="text-xs text-gray-400">{rank.date}</p>
                    )}
                    {rank.current && (
                      <span className="inline-block mt-1 text-xs bg-nuskin-accent/20 text-nuskin-primary px-2 py-0.5 rounded-full">
                        Current
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Info Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-nuskin-light/50 border border-nuskin-accent/20 rounded-2xl p-6"
        >
          <div className="flex items-start gap-4">
            <div className="p-2 rounded-xl bg-nuskin-accent/20">
              <Info className="w-5 h-5 text-nuskin-primary" />
            </div>
            <div>
              <h4 className="font-semibold text-nuskin-primary mb-1">
                Understanding Qualifications
              </h4>
              <p className="text-sm text-gray-600 mb-3">
                Qualifications are calculated based on your rolling 3-month performance.
                Meeting all requirements for 3 consecutive months qualifies you for the next rank.
              </p>
              <a
                href="/spp"
                className="inline-flex items-center gap-2 text-sm font-medium text-nuskin-primary hover:text-nuskin-secondary transition-colors"
              >
                Learn more about SPP rules
                <ChevronRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </MainLayout>
  );
}

