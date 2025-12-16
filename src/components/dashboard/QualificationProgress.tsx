'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  CheckCircle2, 
  AlertCircle, 
  TrendingUp, 
  ChevronRight,
  Sparkles,
  Target
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface Requirement {
  name: string;
  current: number;
  required: number;
  met: boolean;
  unit?: string;
  description?: string;
  status?: string;
}

interface QualificationProgressProps {
  currentRank: string;
  nextRank: string;
  overallProgress: number;
  requirements: Requirement[];
  monthsQualified?: number;
}

// Circular progress component
function CircularProgress({ 
  progress, 
  size = 80, 
  strokeWidth = 6,
  label,
  value,
  target,
  met,
  unit = '',
  delay = 0
}: { 
  progress: number;
  size?: number;
  strokeWidth?: number;
  label: string;
  value: number;
  target: number;
  met: boolean;
  unit?: string;
  delay?: number;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (Math.min(progress, 100) / 100) * circumference;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: delay * 0.1, duration: 0.5 }}
      className="flex flex-col items-center"
    >
      <div className="relative" style={{ width: size, height: size }}>
        {/* Background circle */}
        <svg className="transform -rotate-90" width={size} height={size}>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#E5E7EB"
            strokeWidth={strokeWidth}
          />
          {/* Progress circle */}
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={met ? '#10B981' : progress >= 75 ? '#F59E0B' : '#003B5C'}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1, delay: delay * 0.1, ease: 'easeOut' }}
          />
        </svg>
        
        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {met ? (
            <CheckCircle2 className="w-5 h-5 md:w-6 md:h-6 text-green-500" />
          ) : (
            <span className="text-sm md:text-lg font-bold text-gray-900">
              {Math.round(progress)}%
            </span>
          )}
        </div>
      </div>
      
      {/* Label */}
      <div className="mt-2 text-center">
        <p className="text-[10px] md:text-xs font-medium text-gray-500 uppercase tracking-wide">
          {label}
        </p>
        <p className={cn(
          'text-xs md:text-sm font-semibold',
          met ? 'text-green-600' : 'text-gray-900'
        )}>
          {value.toLocaleString()}{unit} / {target.toLocaleString()}{unit}
        </p>
      </div>
    </motion.div>
  );
}

export function QualificationProgress({
  currentRank,
  nextRank,
  overallProgress,
  requirements,
  monthsQualified = 0,
}: QualificationProgressProps) {
  const metCount = requirements.filter(r => r.met).length;
  const totalCount = requirements.length;
  
  // Identify areas doing well and areas to improve
  const doingWell = requirements.filter(r => r.met || (r.current / r.required) >= 0.8);
  const needsWork = requirements.filter(r => !r.met && (r.current / r.required) < 0.8);

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card overflow-hidden"
    >
      {/* Header with gradient */}
      <div className="bg-gradient-to-r from-nuskin-primary via-nuskin-secondary to-nuskin-accent p-4 md:p-6 text-white">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            <span className="text-sm font-medium text-white/80">Qualification Tracker</span>
          </div>
          <Link 
            href="/qualifications" 
            className="flex items-center gap-1 text-xs font-medium text-white/80 hover:text-white transition-colors"
          >
            View Details <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white/70 text-xs mb-1">Current Rank</p>
            <h2 className="text-xl md:text-2xl font-bold">{currentRank}</h2>
          </div>
          <div className="text-center px-4">
            <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-white/20 flex items-center justify-center mb-1">
              <TrendingUp className="w-6 h-6 md:w-8 md:h-8 text-white" />
            </div>
            <p className="text-[10px] md:text-xs text-white/70">{metCount}/{totalCount} met</p>
          </div>
          <div className="text-right">
            <p className="text-white/70 text-xs mb-1">Next Rank</p>
            <h2 className="text-xl md:text-2xl font-bold">{nextRank}</h2>
          </div>
        </div>
      </div>

      {/* Progress Circles */}
      <div className="p-4 md:p-6 bg-gray-50">
        {requirements.length > 0 ? (
          <div className="flex justify-around items-start gap-2 overflow-x-auto pb-2">
            {requirements.slice(0, 4).map((req, index) => {
              const progress = req.required > 0 ? Math.min((req.current / req.required) * 100, 100) : 0;
              return (
                <CircularProgress
                  key={req.name || index}
                  progress={progress}
                  size={80}
                  strokeWidth={6}
                  label={req.name?.replace('Volume', '').replace('Sales', '').trim() || `Req ${index + 1}`}
                  value={req.current || 0}
                  target={req.required || 0}
                  met={req.met || false}
                  unit={req.unit}
                  delay={index}
                />
              );
            })}
          </div>
        ) : (
          <div className="text-center py-4 text-gray-500">
            <p className="text-sm">Loading qualification data...</p>
          </div>
        )}
      </div>

      {/* Action Items */}
      <div className="p-4 md:p-6 border-t border-gray-100">
        {requirements.length > 0 ? (
          <>
            {/* Doing Well Section */}
            {doingWell.length > 0 && (
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-4 h-4 text-green-500" />
                  <h3 className="text-sm font-semibold text-gray-900">You're Doing Great!</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {doingWell.map((req, index) => (
                    <span
                      key={req.name || index}
                      className="inline-flex items-center gap-1 px-2 py-1 bg-green-50 text-green-700 rounded-full text-xs font-medium"
                    >
                      <CheckCircle2 className="w-3 h-3" />
                      {req.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Needs Improvement Section */}
            {needsWork.length > 0 && (
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="w-4 h-4 text-amber-500" />
                  <h3 className="text-sm font-semibold text-gray-900">Focus Areas</h3>
                </div>
                <div className="space-y-2">
                  {needsWork.slice(0, 2).map((req, index) => {
                    const needed = (req.required || 0) - (req.current || 0);
                    const progress = req.required > 0 ? ((req.current || 0) / req.required) * 100 : 0;
                    return (
                      <div
                        key={req.name || index}
                        className="p-3 bg-amber-50 border border-amber-100 rounded-xl"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium text-gray-900">{req.name}</span>
                          <span className="text-xs font-semibold text-amber-600">
                            Need {needed.toLocaleString()} more
                          </span>
                        </div>
                        <div className="h-1.5 bg-amber-100 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 1, delay: 0.5 }}
                            className="h-full bg-amber-500 rounded-full"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-2 text-gray-500 text-sm">
            <p>Ask Stela AI for personalized recommendations</p>
          </div>
        )}

        {/* Quick Actions */}
        <div className="flex flex-col sm:flex-row gap-2 mt-4">
          <Link href="/chat" className="flex-1">
            <button className="w-full btn-primary text-sm py-2.5 flex items-center justify-center gap-2">
              <Sparkles className="w-4 h-4" />
              Get Personalized Tips
            </button>
          </Link>
          <Link href="/qualifications" className="flex-1">
            <button className="w-full btn-secondary text-sm py-2.5 flex items-center justify-center gap-2">
              <Target className="w-4 h-4" />
              View Full Tracker
            </button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

