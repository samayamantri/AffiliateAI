'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  Search,
  Filter,
  ChevronRight,
  TrendingUp,
  TrendingDown,
  Minus,
  UserPlus,
  MoreVertical,
  Mail,
  Phone,
  MessageSquare,
  Activity,
  AlertCircle,
} from 'lucide-react';
import Link from 'next/link';
import { MainLayout } from '@/components/layout/MainLayout';
import { StatCard } from '@/components/ui/StatCard';
import { useDownlineData } from '@/hooks/useApiData';
import { cn, getInitials, getRankColor, formatVolume, formatPercentage } from '@/lib/utils';
import { useAccount } from '@/context/AccountContext';

type FilterType = 'all' | 'active' | 'inactive' | 'at-risk';

export default function DownlinesPage() {
  const { accountData, capabilities } = useAccount();
  const { data: downlines, loading } = useDownlineData();
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<FilterType>('all');
  const [selectedDownline, setSelectedDownline] = useState<string | null>(null);

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-nuskin-accent border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-500">Loading team data...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  // Show message for accounts that don't have team building capabilities
  if (!capabilities.hasDownlines) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-md mx-auto px-4"
          >
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-nuskin-primary/10 to-nuskin-accent/10 flex items-center justify-center">
              <Users className="w-10 h-10 text-nuskin-primary" />
            </div>
            <h2 className="text-xl font-display font-bold text-gray-900 mb-3">
              Build Your Team
            </h2>
            <p className="text-gray-600 mb-6">
              As a {capabilities.roleDisplayName}, you can start building your team by becoming an affiliate. 
              This will unlock team management features and additional earning opportunities.
            </p>
            <div className="space-y-3">
              <Link href="/chat" className="btn-primary w-full flex items-center justify-center gap-2">
                <MessageSquare className="w-4 h-4" />
                Learn About Team Building
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

  // Safely handle downlines data
  const safeDownlines = downlines || [];

  const filteredDownlines = safeDownlines.filter((d) => {
    const matchesSearch = (d?.name || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter =
      filter === 'all' ||
      (filter === 'active' && d?.active) ||
      (filter === 'inactive' && !d?.active) ||
      (filter === 'at-risk' && (d?.growth || 0) < 0);
    return matchesSearch && matchesFilter;
  });

  const stats = {
    total: safeDownlines.length,
    active: safeDownlines.filter((d) => d?.active).length,
    inactive: safeDownlines.filter((d) => !d?.active).length,
    atRisk: safeDownlines.filter((d) => (d?.growth || 0) < 0).length,
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
              Team Management
            </h1>
            <p className="text-gray-600 mt-1">
              Monitor and support your downline network
            </p>
          </motion.div>

          <motion.button
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="btn-primary flex items-center gap-2"
          >
            <UserPlus className="w-5 h-5" />
            Add Team Member
          </motion.button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Downlines"
            value={accountData?.stats?.totalDownlines || accountData?.stats?.total_downlines || stats.total}
            icon={Users}
            iconColor="text-nuskin-primary"
            delay={0}
          />
          <StatCard
            title="Active Members"
            value={accountData?.stats?.activeDownlines || accountData?.stats?.active_downlines || stats.active}
            icon={Activity}
            iconColor="text-green-600"
            change={4.5}
            delay={1}
          />
          <StatCard
            title="Inactive Members"
            value={stats.inactive}
            icon={Users}
            iconColor="text-gray-400"
            delay={2}
          />
          <StatCard
            title="At Risk"
            value={stats.atRisk}
            icon={AlertCircle}
            iconColor="text-amber-500"
            delay={3}
          />
        </div>

        {/* Search and Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card p-4"
        >
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search team members..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-primary pl-10"
              />
            </div>

            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-400" />
              {(['all', 'active', 'inactive', 'at-risk'] as FilterType[]).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={cn(
                    'px-4 py-2 rounded-xl text-sm font-medium transition-all',
                    filter === f
                      ? 'bg-nuskin-primary text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  )}
                >
                  {f.charAt(0).toUpperCase() + f.slice(1).replace('-', ' ')}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Team List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left p-4 text-sm font-medium text-gray-500">
                    Member
                  </th>
                  <th className="text-left p-4 text-sm font-medium text-gray-500">
                    Rank
                  </th>
                  <th className="text-left p-4 text-sm font-medium text-gray-500">
                    Volume
                  </th>
                  <th className="text-left p-4 text-sm font-medium text-gray-500">
                    Growth
                  </th>
                  <th className="text-left p-4 text-sm font-medium text-gray-500">
                    Status
                  </th>
                  <th className="text-right p-4 text-sm font-medium text-gray-500">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredDownlines.map((member, index) => (
                  <motion.tr
                    key={member?.id || member?.person_id || index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={cn(
                      'border-b border-gray-50 hover:bg-gray-50 transition-colors cursor-pointer',
                      selectedDownline === (member?.id || member?.person_id) && 'bg-nuskin-light/50'
                    )}
                    onClick={() => setSelectedDownline(
                      selectedDownline === (member?.id || member?.person_id) ? null : (member?.id || member?.person_id || null)
                    )}
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <div
                            className={cn(
                              'w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium',
                              member?.active
                                ? 'bg-gradient-to-br from-nuskin-primary to-nuskin-secondary text-white'
                                : 'bg-gray-200 text-gray-500'
                            )}
                          >
                            {getInitials(member?.name)}
                          </div>
                          {member?.active && (
                            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{member?.name || 'Unknown'}</p>
                          <p className="text-sm text-gray-500">ID: {member?.id || member?.person_id || 'N/A'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span
                        className={cn(
                          'px-3 py-1 rounded-full text-sm font-medium',
                          getRankColor(member?.title || member?.rank)
                        )}
                      >
                        {member?.title || member?.rank || 'Member'}
                      </span>
                    </td>
                    <td className="p-4">
                      <p className="font-medium text-gray-900">
                        {formatVolume(member?.gsv || member?.volume || 0)}
                      </p>
                      {member?.csv !== undefined && member.csv > 0 && (
                        <p className="text-xs text-gray-500">CSV: {formatVolume(member.csv)}</p>
                      )}
                    </td>
                    <td className="p-4">
                      <div
                        className={cn(
                          'flex items-center gap-1 font-medium',
                          (member?.growth || 0) > 0
                            ? 'text-green-600'
                            : (member?.growth || 0) < 0
                            ? 'text-red-600'
                            : 'text-gray-400'
                        )}
                      >
                        {(member?.growth || 0) > 0 ? (
                          <TrendingUp className="w-4 h-4" />
                        ) : (member?.growth || 0) < 0 ? (
                          <TrendingDown className="w-4 h-4" />
                        ) : (
                          <Minus className="w-4 h-4" />
                        )}
                        {formatPercentage(member?.growth || 0)}
                      </div>
                    </td>
                    <td className="p-4">
                      <span
                        className={cn(
                          'px-3 py-1 rounded-full text-sm font-medium',
                          member?.active
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-500'
                        )}
                      >
                        {member?.active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                          <Mail className="w-4 h-4 text-gray-400" />
                        </button>
                        <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                          <Phone className="w-4 h-4 text-gray-400" />
                        </button>
                        <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                          <MessageSquare className="w-4 h-4 text-gray-400" />
                        </button>
                        <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                          <MoreVertical className="w-4 h-4 text-gray-400" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredDownlines.length === 0 && (
            <div className="p-12 text-center">
              <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No team members found</p>
            </div>
          )}
        </motion.div>

        {/* Selected Member Detail */}
        {selectedDownline && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Member Details</h3>
              <button className="text-sm text-nuskin-primary font-medium hover:text-nuskin-secondary flex items-center gap-1">
                View Full Profile
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            <p className="text-gray-500">
              Select a team member to view their detailed performance, 
              qualification progress, and personalized recommendations.
            </p>
          </motion.div>
        )}
      </div>
    </MainLayout>
  );
}

