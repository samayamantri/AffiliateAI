'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Settings,
  User,
  Bell,
  Shield,
  Palette,
  Globe,
  CreditCard,
  HelpCircle,
  ChevronRight,
  Moon,
  Sun,
  Check,
} from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { useAccount } from '@/context/AccountContext';
import { cn, getInitials } from '@/lib/utils';

type SettingsTab = 'profile' | 'notifications' | 'appearance' | 'security' | 'billing';

export default function SettingsPage() {
  const { accountData, accountId, setAccountId } = useAccount();
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    sms: false,
    weekly: true,
    achievements: true,
    teamUpdates: true,
  });
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('light');

  const tabs = [
    { id: 'profile' as const, label: 'Profile', icon: User },
    { id: 'notifications' as const, label: 'Notifications', icon: Bell },
    { id: 'appearance' as const, label: 'Appearance', icon: Palette },
    { id: 'security' as const, label: 'Security', icon: Shield },
    { id: 'billing' as const, label: 'Billing', icon: CreditCard },
  ];

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-2xl font-display font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-1">Manage your account preferences</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Navigation */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <div className="card p-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    'w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-left',
                    activeTab === tab.id
                      ? 'bg-nuskin-primary text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  )}
                >
                  <tab.icon className="w-5 h-5" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              ))}
            </div>
          </motion.div>

          {/* Content Area */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-3"
          >
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="card p-6 space-y-6">
                <div className="flex items-center gap-6">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-nuskin-primary to-nuskin-secondary flex items-center justify-center text-white text-2xl font-bold">
                    {accountData ? getInitials(accountData.name) : 'U'}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      {accountData?.name || 'User Name'}
                    </h3>
                    <p className="text-gray-500">{accountData?.email || 'email@example.com'}</p>
                    <button className="mt-2 text-sm text-nuskin-primary font-medium hover:text-nuskin-secondary">
                      Change Photo
                    </button>
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-6 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        defaultValue={accountData?.name || ''}
                        className="input-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        defaultValue={accountData?.email || ''}
                        className="input-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Account ID
                      </label>
                      <input
                        type="text"
                        value={accountId}
                        onChange={(e) => setAccountId(e.target.value)}
                        className="input-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Current Rank
                      </label>
                      <input
                        type="text"
                        defaultValue={accountData?.rank || ''}
                        className="input-primary"
                        disabled
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3">
                  <button className="btn-secondary">Cancel</button>
                  <button className="btn-primary">Save Changes</button>
                </div>
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <div className="card p-6 space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    Notification Preferences
                  </h3>
                  <p className="text-sm text-gray-500">
                    Choose how you want to receive updates and alerts
                  </p>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium text-gray-700">Channels</h4>
                  {[
                    { key: 'email', label: 'Email Notifications', description: 'Receive updates via email' },
                    { key: 'push', label: 'Push Notifications', description: 'Browser and mobile notifications' },
                    { key: 'sms', label: 'SMS Notifications', description: 'Text message alerts' },
                  ].map((item) => (
                    <div key={item.key} className="flex items-center justify-between p-4 rounded-xl bg-gray-50">
                      <div>
                        <p className="font-medium text-gray-900">{item.label}</p>
                        <p className="text-sm text-gray-500">{item.description}</p>
                      </div>
                      <button
                        onClick={() => setNotifications({ ...notifications, [item.key]: !notifications[item.key as keyof typeof notifications] })}
                        className={cn(
                          'w-12 h-6 rounded-full transition-colors relative',
                          notifications[item.key as keyof typeof notifications] ? 'bg-nuskin-primary' : 'bg-gray-300'
                        )}
                      >
                        <span
                          className={cn(
                            'absolute top-1 w-4 h-4 rounded-full bg-white transition-transform',
                            notifications[item.key as keyof typeof notifications] ? 'translate-x-7' : 'translate-x-1'
                          )}
                        />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="border-t border-gray-100 pt-6 space-y-4">
                  <h4 className="font-medium text-gray-700">Types</h4>
                  {[
                    { key: 'weekly', label: 'Weekly Summary', description: 'Weekly performance digest' },
                    { key: 'achievements', label: 'Achievement Alerts', description: 'When you or team members hit milestones' },
                    { key: 'teamUpdates', label: 'Team Updates', description: 'Activity from your downlines' },
                  ].map((item) => (
                    <div key={item.key} className="flex items-center justify-between p-4 rounded-xl bg-gray-50">
                      <div>
                        <p className="font-medium text-gray-900">{item.label}</p>
                        <p className="text-sm text-gray-500">{item.description}</p>
                      </div>
                      <button
                        onClick={() => setNotifications({ ...notifications, [item.key]: !notifications[item.key as keyof typeof notifications] })}
                        className={cn(
                          'w-12 h-6 rounded-full transition-colors relative',
                          notifications[item.key as keyof typeof notifications] ? 'bg-nuskin-primary' : 'bg-gray-300'
                        )}
                      >
                        <span
                          className={cn(
                            'absolute top-1 w-4 h-4 rounded-full bg-white transition-transform',
                            notifications[item.key as keyof typeof notifications] ? 'translate-x-7' : 'translate-x-1'
                          )}
                        />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Appearance Tab */}
            {activeTab === 'appearance' && (
              <div className="card p-6 space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">Appearance</h3>
                  <p className="text-sm text-gray-500">Customize how Stela AI looks</p>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium text-gray-700">Theme</h4>
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { id: 'light' as const, icon: Sun, label: 'Light' },
                      { id: 'dark' as const, icon: Moon, label: 'Dark' },
                      { id: 'system' as const, icon: Settings, label: 'System' },
                    ].map((option) => (
                      <button
                        key={option.id}
                        onClick={() => setTheme(option.id)}
                        className={cn(
                          'p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2',
                          theme === option.id
                            ? 'border-nuskin-primary bg-nuskin-light'
                            : 'border-gray-200 hover:border-gray-300'
                        )}
                      >
                        <option.icon className={cn(
                          'w-6 h-6',
                          theme === option.id ? 'text-nuskin-primary' : 'text-gray-500'
                        )} />
                        <span className={cn(
                          'font-medium',
                          theme === option.id ? 'text-nuskin-primary' : 'text-gray-700'
                        )}>
                          {option.label}
                        </span>
                        {theme === option.id && (
                          <Check className="w-5 h-5 text-nuskin-primary" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-6 space-y-4">
                  <h4 className="font-medium text-gray-700">Language & Region</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Language
                      </label>
                      <select className="input-primary">
                        <option>English (US)</option>
                        <option>English (UK)</option>
                        <option>Spanish</option>
                        <option>French</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Timezone
                      </label>
                      <select className="input-primary">
                        <option>Pacific Time (PT)</option>
                        <option>Mountain Time (MT)</option>
                        <option>Central Time (CT)</option>
                        <option>Eastern Time (ET)</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
              <div className="card p-6 space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">Security</h3>
                  <p className="text-sm text-gray-500">Manage your account security settings</p>
                </div>

                <div className="space-y-4">
                  {[
                    { label: 'Change Password', description: 'Update your account password', action: 'Update' },
                    { label: 'Two-Factor Authentication', description: 'Add an extra layer of security', action: 'Enable' },
                    { label: 'Active Sessions', description: 'Manage your active login sessions', action: 'View' },
                    { label: 'API Keys', description: 'Manage API keys for integrations', action: 'Manage' },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center justify-between p-4 rounded-xl bg-gray-50">
                      <div>
                        <p className="font-medium text-gray-900">{item.label}</p>
                        <p className="text-sm text-gray-500">{item.description}</p>
                      </div>
                      <button className="text-sm font-medium text-nuskin-primary hover:text-nuskin-secondary flex items-center gap-1">
                        {item.action}
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Billing Tab */}
            {activeTab === 'billing' && (
              <div className="card p-6 space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">Billing</h3>
                  <p className="text-sm text-gray-500">Manage your subscription and payment methods</p>
                </div>

                <div className="p-4 rounded-xl bg-gradient-to-r from-nuskin-primary to-nuskin-secondary text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white/80 text-sm">Current Plan</p>
                      <p className="text-xl font-bold">Stela AI Pro</p>
                    </div>
                    <button className="px-4 py-2 bg-white text-nuskin-primary rounded-lg font-medium hover:bg-white/90 transition-colors">
                      Upgrade Plan
                    </button>
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-6">
                  <h4 className="font-medium text-gray-700 mb-4">Payment Methods</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-4 rounded-xl border border-gray-200">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-8 bg-blue-600 rounded flex items-center justify-center text-white text-xs font-bold">
                          VISA
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">•••• •••• •••• 4242</p>
                          <p className="text-sm text-gray-500">Expires 12/25</p>
                        </div>
                      </div>
                      <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">Default</span>
                    </div>
                    <button className="w-full py-3 rounded-xl border-2 border-dashed border-gray-200 text-gray-500 hover:border-nuskin-accent hover:text-nuskin-primary transition-colors">
                      + Add Payment Method
                    </button>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </MainLayout>
  );
}

