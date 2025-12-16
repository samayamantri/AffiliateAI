'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  HelpCircle,
  Search,
  MessageSquare,
  Book,
  Video,
  Mail,
  Phone,
  ChevronRight,
  ExternalLink,
  Sparkles,
} from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { cn } from '@/lib/utils';

const helpCategories = [
  {
    icon: Book,
    title: 'Getting Started',
    description: 'Learn the basics of using Stela AI',
    articles: 12,
    color: 'bg-blue-100 text-blue-600',
  },
  {
    icon: MessageSquare,
    title: 'Using AI Chat',
    description: 'Get the most out of Stela AI assistant',
    articles: 8,
    color: 'bg-purple-100 text-purple-600',
  },
  {
    icon: Video,
    title: 'Video Tutorials',
    description: 'Watch step-by-step guides',
    articles: 15,
    color: 'bg-red-100 text-red-600',
  },
  {
    icon: HelpCircle,
    title: 'FAQs',
    description: 'Answers to common questions',
    articles: 24,
    color: 'bg-amber-100 text-amber-600',
  },
];

const popularArticles = [
  { title: 'How to track your qualification progress', views: 1234 },
  { title: 'Understanding the Sales Performance Plan', views: 987 },
  { title: 'Managing your downline effectively', views: 876 },
  { title: 'Setting up subscription reminders', views: 765 },
  { title: 'Using AI insights to grow your business', views: 654 },
];

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-8"
        >
          <h1 className="text-3xl font-display font-bold text-gray-900 mb-2">
            How can we help you?
          </h1>
          <p className="text-gray-600 mb-6">
            Search our knowledge base or browse categories below
          </p>

          <div className="max-w-xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search for help articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-200 focus:border-nuskin-accent focus:ring-2 focus:ring-nuskin-accent/20 outline-none text-lg shadow-lg"
            />
          </div>
        </motion.div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {helpCategories.map((category, index) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="card p-6 hover:shadow-lg transition-all cursor-pointer group"
            >
              <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center mb-4', category.color)}>
                <category.icon className="w-6 h-6" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-nuskin-primary transition-colors">
                {category.title}
              </h3>
              <p className="text-sm text-gray-500 mb-3">{category.description}</p>
              <span className="text-sm text-nuskin-primary font-medium">
                {category.articles} articles
              </span>
            </motion.div>
          ))}
        </div>

        {/* Popular Articles */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card p-6"
        >
          <h3 className="font-semibold text-gray-900 mb-4">Popular Articles</h3>
          <div className="space-y-3">
            {popularArticles.map((article, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-gray-400 w-6">{index + 1}</span>
                  <span className="text-gray-900 group-hover:text-nuskin-primary transition-colors">
                    {article.title}
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-400">{article.views.toLocaleString()} views</span>
                  <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-nuskin-primary transition-colors" />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Contact Options */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="card p-6 text-center"
          >
            <div className="w-14 h-14 rounded-2xl bg-nuskin-light flex items-center justify-center mx-auto mb-4">
              <MessageSquare className="w-7 h-7 text-nuskin-primary" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Live Chat</h3>
            <p className="text-sm text-gray-500 mb-4">Chat with our support team</p>
            <button className="btn-primary w-full">Start Chat</button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="card p-6 text-center"
          >
            <div className="w-14 h-14 rounded-2xl bg-green-100 flex items-center justify-center mx-auto mb-4">
              <Mail className="w-7 h-7 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Email Support</h3>
            <p className="text-sm text-gray-500 mb-4">Get help via email</p>
            <button className="btn-secondary w-full">Send Email</button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="card p-6 text-center"
          >
            <div className="w-14 h-14 rounded-2xl bg-purple-100 flex items-center justify-center mx-auto mb-4">
              <Phone className="w-7 h-7 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Phone Support</h3>
            <p className="text-sm text-gray-500 mb-4">Call us directly</p>
            <button className="btn-secondary w-full">1-800-NUSKIN</button>
          </motion.div>
        </div>

        {/* AI Assistant CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-gradient-to-r from-nuskin-primary via-nuskin-secondary to-nuskin-accent rounded-2xl p-8 text-white text-center"
        >
          <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Need Personalized Help?</h2>
          <p className="text-white/80 mb-6 max-w-lg mx-auto">
            Ask Stela AI anything about your business, qualifications, or how to grow. 
            Get instant, personalized answers 24/7.
          </p>
          <a
            href="/chat"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-nuskin-primary rounded-xl font-medium hover:bg-white/90 transition-colors"
          >
            <Sparkles className="w-5 h-5" />
            Ask Stela AI
          </a>
        </motion.div>

        {/* External Resources */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="card p-6"
        >
          <h3 className="font-semibold text-gray-900 mb-4">External Resources</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { title: 'NuSkin Official Website', url: 'https://nuskin.com' },
              { title: 'Sales Performance Plan (PDF)', url: 'https://www.nuskin.com/content/dam/office/pacific_new/shared/en/legal/PAC%20New%20SPP%20March%202025%20v2%20280125.pdf' },
              { title: 'Product Catalog', url: 'https://nuskin.com/products' },
              { title: 'Training Academy', url: 'https://nuskin.com/training' },
            ].map((resource) => (
              <a
                key={resource.title}
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-4 rounded-xl border border-gray-200 hover:border-nuskin-accent hover:bg-nuskin-light/50 transition-all group"
              >
                <span className="font-medium text-gray-900 group-hover:text-nuskin-primary">
                  {resource.title}
                </span>
                <ExternalLink className="w-5 h-5 text-gray-400 group-hover:text-nuskin-primary" />
              </a>
            ))}
          </div>
        </motion.div>
      </div>
    </MainLayout>
  );
}

