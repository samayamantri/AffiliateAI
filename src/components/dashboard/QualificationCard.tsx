'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Target, ChevronRight, Award, CheckCircle2, Circle } from 'lucide-react';
import { ProgressRing } from '@/components/ui/ProgressRing';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { cn, getRankColor } from '@/lib/utils';

interface Requirement {
  name: string;
  current: number;
  required: number;
  met: boolean;
}

interface QualificationCardProps {
  currentRank: string;
  nextRank: string;
  progress: number;
  requirements: Requirement[];
  monthsQualified?: number;
}

export function QualificationCard({
  currentRank,
  nextRank,
  progress,
  requirements,
  monthsQualified,
}: QualificationCardProps) {
  const metCount = requirements.filter((r) => r.met).length;

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-gradient-to-br from-nuskin-gold/80 to-nuskin-gold">
            <Target className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Qualification Progress</h3>
            <p className="text-sm text-gray-500">Track your rank advancement</p>
          </div>
        </div>
        <button className="text-sm text-nuskin-primary font-medium hover:text-nuskin-secondary transition-colors flex items-center gap-1">
          View Details
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <div className="flex items-center gap-8 mb-6">
        <ProgressRing
          progress={progress}
          size={120}
          label="Complete"
          sublabel={`${metCount}/${requirements.length} met`}
        />

        <div className="flex-1">
          <div className="flex items-center gap-3 mb-4">
            <div>
              <p className="text-sm text-gray-500">Current Rank</p>
              <span className={cn('inline-block mt-1 px-3 py-1 rounded-full text-sm font-medium', getRankColor(currentRank))}>
                {currentRank}
              </span>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-300" />
            <div>
              <p className="text-sm text-gray-500">Next Rank</p>
              <span className={cn('inline-block mt-1 px-3 py-1 rounded-full text-sm font-medium', getRankColor(nextRank))}>
                {nextRank}
              </span>
            </div>
          </div>

          {monthsQualified && (
            <div className="flex items-center gap-2 text-sm">
              <Award className="w-4 h-4 text-nuskin-gold" />
              <span className="text-gray-600">
                Qualified for <strong className="text-nuskin-primary">{monthsQualified} months</strong>
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="text-sm font-medium text-gray-700">Requirements</h4>
        {requirements.map((req, index) => (
          <motion.div
            key={req.name}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center gap-3"
          >
            {req.met ? (
              <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
            ) : (
              <Circle className="w-5 h-5 text-gray-300 flex-shrink-0" />
            )}
            <div className="flex-1">
              <ProgressBar
                value={req.current}
                max={req.required}
                label={req.name}
                size="sm"
                color={req.met ? 'success' : 'default'}
              />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

