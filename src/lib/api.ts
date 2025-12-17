const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
const MCP_URL = process.env.NEXT_PUBLIC_MCP_SERVER_URL || 'http://localhost:3000';

// Generic fetch wrapper with error handling
async function fetchAPI<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

// =============================================================================
// Type Definitions based on actual API responses from localhost:8000/docs
// =============================================================================

// Account Overview API Response
export interface AccountOverviewResponse {
  account: {
    id: number;
    external_id: string;
    name: string;
    role: string;
    market: string;
    join_date: string;
    active: boolean;
    current_title: string;
  };
  summary: {
    id: number;
    account_id: string;
    period_id: number;
    dc_sv: number;
    gsv: number;
    csv: number;
    ltsv_5k_teams: number;
    ltsv_10k_teams: number;
    ltsv_20k_teams: number;
    ltsv_30k_teams: number;
    brand_rep_maintained: boolean;
    flex_used: boolean;
  };
  title: string;
  team_buckets: {
    ltsv_5k: number;
    ltsv_10k: number;
    ltsv_20k: number;
    ltsv_30k: number;
  };
  downline_tree: {
    nodes: Array<{
      id: string;
      external_id: string;
      name: string;
      role: string;
      current_title: string;
      gsv: number;
      csv: number;
      dc_sv: number;
      depth: number;
    }>;
    edges: Array<{ from: string; to: string; type: string }>;
  };
}

// Chart Data API Response
export interface ChartDataResponse {
  person_id: number;
  performance_chart: {
    labels: string[];
    datasets: Array<{
      label: string;
      data: number[];
      borderColor: string;
      backgroundColor: string;
      tension: number;
      fill: boolean;
    }>;
  };
  qualification_chart: {
    labels: string[];
    datasets: Array<{
      label: string;
      data: number[];
      backgroundColor: string[];
      borderWidth: number;
    }>;
  };
  team_chart: {
    labels: string[];
    datasets: Array<{
      data: number[];
      backgroundColor: string[];
      borderWidth: number;
    }>;
  };
  growth_metrics: Array<{
    label: string;
    value: string;
    change: string;
    icon: string;
    color: string;
  }>;
  performance_history: {
    person_id: number;
    external_id: string;
    current_title: string;
    history: Array<{
      period: string;
      period_label: string;
      month_label: string;
      dc_sv: number;
      gsv: number;
      csv: number;
      ltsv_5k_teams: number;
      ltsv_10k_teams: number;
      ltsv_20k_teams: number;
      ltsv_30k_teams: number;
      brand_rep_maintained: boolean;
      flex_used: boolean;
    }>;
    metrics: {
      monthly_growth_rate: number;
      monthly_growth_rate_change: number;
      team_size: number;
      team_size_change: number;
      qualification_score: number;
      qualification_score_change: number;
      current_title: string;
      title_status: string;
      has_historical_data: boolean;
    };
    summary: {
      total_periods: number;
      periods_with_data: number;
      average_gsv: number;
      max_gsv: number;
      min_gsv: number;
    };
  };
}

// NBA API Response
export interface NBAResponse {
  action_id: string;
  label: string;
  explanation: {
    person_id: string;
    action_id: string;
    decision_time: string;
    priority: number;
    because: Array<{
      metric: string;
      value: number;
      threshold: number;
      direction: string;
    }>;
    plan_rules: Array<{
      rule_id: string;
      status: string;
    }>;
    counterfactual: string;
    model_contributors: Array<{
      feature: string;
      importance: number;
    }>;
    confidence: {
      p50: number;
      interval: number[];
    };
    fairness_checks: {
      blocked_features: string[];
      passed: boolean;
    };
  };
}

// Qualifications API Response
export interface QualificationsResponse {
  person_id: number;
  qualifications: Array<{
    id: string;
    name: string;
    status: string;
    progress: number;
    current: number;
    required: number;
    met: boolean;
  }>;
  metrics: {
    total_qualifications: number;
    met_qualifications: number;
    pending_qualifications: number;
    expired_qualifications: number;
    success_rate: number;
  };
}

// Subscriptions API Response  
export interface SubscriptionsResponse {
  person_id: number;
  subscriptions: Array<{
    id: string;
    product_name: string;
    status: string;
    monthly_sv: number;
    monthly_csv: number;
    start_date: string;
    next_renewal: string;
  }>;
  metrics: {
    total_subscriptions: number;
    active_subscriptions: number;
    total_monthly_sv: number;
    total_monthly_csv: number;
    cancelled_subscriptions: number;
    paused_subscriptions: number;
  };
}

// Downline API Response
export interface DownlineResponse {
  person_id: number;
  downlines: Array<{
    id: string;
    external_id: string;
    name: string;
    role: string;
    current_title: string;
    gsv: number;
    csv: number;
    dc_sv: number;
    depth: number;
    active: boolean;
  }>;
  nodes?: Array<{
    id: string;
    external_id: string;
    name: string;
    role: string;
    current_title: string;
    gsv: number;
    csv: number;
    dc_sv: number;
    depth: number;
  }>;
  edges?: Array<{ from: string; to: string; type: string }>;
}

// =============================================================================
// Transformed types for the UI (what components expect)
// =============================================================================

export interface AccountOverview {
  id: number;
  personId: string;
  name: string;
  email?: string;
  rank: string;
  title: string;
  role: string;
  market: string;
  joinDate: string;
  active: boolean;
  stats: {
    totalSales: number;
    monthlyVolume: number;
    gsv: number;
    csv: number;
    dcSv: number;
    activeDownlines: number;
    totalDownlines: number;
  };
}

export interface PerformanceData {
  monthly: Array<{ month: string; sales: number; volume: number; gsv: number; csv: number }>;
  currentMonth: {
    sales: number;
    volume: number;
    gsv: number;
    csv: number;
    growth: number;
    target?: number;
  };
  chartData: {
    labels: string[];
    datasets: Array<{
      label: string;
      data: number[];
      borderColor: string;
      backgroundColor: string;
    }>;
  };
  growthMetrics: Array<{
    label: string;
    value: string;
    change: string;
    icon: string;
    color: string;
  }>;
}

export interface QualificationData {
  currentRank: string;
  nextRank: string;
  progress: number;
  requirements: Array<{
    name: string;
    current: number;
    required: number;
    met: boolean;
  }>;
  monthsQualified: number;
  metrics: {
    total: number;
    met: number;
    pending: number;
    successRate: number;
  };
}

export interface DownlineData {
  id: string;
  personId: string;
  name: string;
  rank: string;
  title: string;
  volume: number;
  gsv: number;
  csv: number;
  growth: number;
  active: boolean;
  depth: number;
}

export interface NBAData {
  id: string;
  actionId: string;
  type: 'growth' | 'retention' | 'qualification' | 'opportunity';
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  impact: string;
  counterfactual: string;
  confidence: number;
}

export interface SubscriptionData {
  totalSubscribers: number;
  activeSubscriptions: number;
  growth: number;
  churnRate: number;
  monthlyRecurring: number;
  byProduct: Array<{
    name: string;
    subscribers: number;
    revenue: number;
  }>;
  metrics: {
    totalMonthlySv: number;
    totalMonthlyCsv: number;
    cancelled: number;
    paused: number;
  };
}

export interface InsightData {
  id: string;
  type: 'trend' | 'alert' | 'tip';
  title: string;
  message: string;
  icon?: string;
}

// =============================================================================
// Data Service - Main interface for the app (transforms API responses)
// =============================================================================

export const dataService = {
  getAccountOverview: async (personId: string): Promise<AccountOverview> => {
    const response = await fetchAPI<AccountOverviewResponse>(`/api/accounts/${personId}/overview`);
    
    // Transform to expected format
    return {
      id: response.account.id,
      personId: response.account.external_id,
      name: response.account.name,
      rank: response.account.current_title,
      title: response.title,
      role: response.account.role,
      market: response.account.market,
      joinDate: response.account.join_date,
      active: response.account.active,
      stats: {
        totalSales: response.summary.gsv,
        monthlyVolume: response.summary.gsv,
        gsv: response.summary.gsv,
        csv: response.summary.csv,
        dcSv: response.summary.dc_sv,
        activeDownlines: response.downline_tree?.nodes?.length || 0,
        totalDownlines: response.downline_tree?.nodes?.length || 0,
      },
    };
  },

  getPerformance: async (personId: string): Promise<PerformanceData> => {
    try {
      const response = await fetchAPI<ChartDataResponse>(`/api/analytics/${personId}/chart-data`);
      
      // Check if response contains an error detail (backend sometimes returns 200 with error)
      if ((response as { detail?: string }).detail) {
        console.warn('[API] Performance chart has error:', (response as { detail?: string }).detail);
        throw new Error((response as { detail?: string }).detail);
      }
      
      // Extract history data for monthly breakdown
      const history = response.performance_history?.history || [];
      const lastMonth = history[history.length - 1];
      const previousMonth = history[history.length - 2];
      
      // Calculate growth
      const currentGsv = lastMonth?.gsv || 0;
      const previousGsv = previousMonth?.gsv || 0;
      const growth = previousGsv > 0 ? ((currentGsv - previousGsv) / previousGsv) * 100 : 0;
      
      return {
        monthly: history.map(h => ({
          month: h.month_label,
          sales: h.gsv,
          volume: h.gsv,
          gsv: h.gsv,
          csv: h.csv,
        })),
        currentMonth: {
          sales: currentGsv,
          volume: currentGsv,
          gsv: currentGsv,
          csv: lastMonth?.csv || 0,
          growth: response.performance_history?.metrics?.monthly_growth_rate || growth,
        },
        chartData: {
          labels: response.performance_chart?.labels || [],
          datasets: response.performance_chart?.datasets?.map(ds => ({
            label: ds.label,
            data: ds.data,
            borderColor: ds.borderColor,
            backgroundColor: ds.backgroundColor,
          })) || [],
        },
        growthMetrics: response.growth_metrics || [],
      };
    } catch (error) {
      console.warn('[API] Performance fetch failed, returning empty data:', error);
      // Return empty performance data structure
      return {
        monthly: [],
        currentMonth: {
          sales: 0,
          volume: 0,
          gsv: 0,
          csv: 0,
          growth: 0,
        },
        chartData: {
          labels: [],
          datasets: [],
        },
        growthMetrics: [],
      };
    }
  },

  getQualifications: async (personId: string): Promise<QualificationData> => {
    // Use rule-qualifications endpoint (qualifications returns 404)
    const response = await fetchAPI<{
      person_id: number;
      period: string;
      qualifications: Array<{
        id: string;
        name: string;
        status: string;
        current_progress: number;
        target_value: number;
        progress_percentage: number;
        gap: number;
        unit: string;
      }>;
      metrics?: {
        total_qualifications: number;
        met_qualifications: number;
        pending_qualifications: number;
        success_rate: number;
      };
    }>(`/api/accounts/${personId}/rule-qualifications`);
    
    // Also get account overview for rank info
    let currentRank = 'Member';
    let nextRank = 'Next Level';
    
    try {
      const overview = await fetchAPI<AccountOverviewResponse>(`/api/accounts/${personId}/overview`);
      currentRank = overview.title || overview.account?.current_title || 'Member';
    } catch {
      // Use default if overview fails
    }
    
    // Transform qualifications to expected format
    const qualifications = response.qualifications || [];
    const metCount = qualifications.filter(q => q.status === 'MET').length;
    const totalCount = qualifications.length;
    const successRate = totalCount > 0 ? (metCount / totalCount) * 100 : 0;
    
    return {
      currentRank,
      nextRank,
      progress: successRate,
      requirements: qualifications.map(q => ({
        name: q.name || q.id,
        current: q.current_progress || 0,
        required: q.target_value || 0,
        met: q.status === 'MET',
        unit: q.unit,
      })),
      monthsQualified: metCount,
      metrics: {
        total: totalCount,
        met: metCount,
        pending: totalCount - metCount,
        successRate: successRate,
      },
    };
  },

  getDownlines: async (personId: string): Promise<DownlineData[]> => {
    // Get current period
    const now = new Date();
    const period = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    
    // Use team-network endpoint which returns actual team data
    // The /downline endpoint has a backend bug
    const response = await fetchAPI<{
      nodes: Array<{
        id: string;
        name: string;
        external_id?: string;
        title?: string;
        current_title?: string;
        level?: number;
        gsv?: number;
        csv?: number;
        dcsv?: number;
        status?: string;
        performance?: string;
        joinDate?: string;
        lastActivity?: string;
      }>;
      links: Array<{ source: string; target: string }>;
      period: string;
      person_id: number;
    }>(`/api/accounts/${personId}/team-network?period=${period}`);
    
    // Filter out the root node (the user themselves) and extract team members
    const nodes = response.nodes || [];
    const teamMembers = nodes.filter(node => node.level !== 0 && node.id !== String(personId));
    
    return teamMembers.slice(0, 100).map((node, index) => ({
      id: node.id || node.external_id || `downline-${index}`,
      personId: node.external_id || node.id || '',
      name: node.name || `Team Member ${index + 1}`,
      rank: node.title || node.current_title || 'Member',
      title: node.title || node.current_title || 'Member',
      volume: node.gsv || 0,
      gsv: node.gsv || 0,
      csv: node.csv || 0,
      growth: 0, // Not available in API response
      active: node.status === 'active' || node.performance !== 'inactive',
      depth: node.level || 1,
    }));
  },

  getNBA: async (personId: string): Promise<NBAData[]> => {
    try {
      // Get current period for NBA request
      let period = '2025-12';
      try {
        const periods = await fetchAPI<Array<{ id: number; label: string }>>('/api/periods/');
        if (periods.length > 0) {
          period = periods[periods.length - 1]?.label || period;
        }
      } catch {
        // Use default period
      }
      
      const response = await fetchAPI<NBAResponse[]>(`/api/accounts/${personId}/nba`, {
        method: 'POST',
        body: JSON.stringify({ period }),
      });
      
      // Ensure response is array
      const nbaArray = Array.isArray(response) ? response : [];
      
      return nbaArray.map((nba, index) => {
        // Determine type based on action_id
        let type: 'growth' | 'retention' | 'qualification' | 'opportunity' = 'growth';
        if (nba.action_id?.includes('QUALIFY') || nba.action_id?.includes('BR')) {
          type = 'qualification';
        } else if (nba.action_id?.includes('RETAIN')) {
          type = 'retention';
        } else if (nba.action_id?.includes('BUILD') || nba.action_id?.includes('GSV')) {
          type = 'growth';
        }
        
        // Map priority from confidence to high/medium/low
        const priorityValue = nba.explanation?.priority || 0.5;
        let priority: 'high' | 'medium' | 'low' = 'medium';
        if (priorityValue >= 0.7) priority = 'high';
        else if (priorityValue <= 0.3) priority = 'low';
        
        return {
          id: nba.action_id || `nba-${index}`,
          actionId: nba.action_id,
          type,
          priority,
          title: nba.label,
          description: nba.explanation?.counterfactual || '',
          impact: `${Math.round((nba.explanation?.priority || 0.5) * 100)}% priority`,
          counterfactual: nba.explanation?.counterfactual || '',
          confidence: nba.explanation?.confidence?.p50 || 0.75,
        };
      });
    } catch (error) {
      console.error('[API] NBA fetch failed:', error);
      // Return empty array on error instead of throwing
      return [];
    }
  },

  getSubscriptions: async (personId: string): Promise<SubscriptionData> => {
    try {
      const response = await fetchAPI<SubscriptionsResponse>(`/api/accounts/${personId}/subscriptions`);
      
      // Group subscriptions by product for byProduct breakdown
      const productMap = new Map<string, { subscribers: number; revenue: number }>();
      
      (response.subscriptions || []).forEach(sub => {
        const productName = sub.product_name || 'Other';
        const existing = productMap.get(productName) || { subscribers: 0, revenue: 0 };
        productMap.set(productName, {
          subscribers: existing.subscribers + 1,
          revenue: existing.revenue + (sub.monthly_sv || 0),
        });
      });
      
      return {
        totalSubscribers: response.metrics?.total_subscriptions || 0,
        activeSubscriptions: response.metrics?.active_subscriptions || 0,
        growth: 0, // Not available in API
        churnRate: response.metrics?.cancelled_subscriptions > 0 
          ? (response.metrics.cancelled_subscriptions / (response.metrics?.total_subscriptions || 1)) * 100 
          : 0,
        monthlyRecurring: response.metrics?.total_monthly_sv || 0,
        byProduct: Array.from(productMap.entries()).map(([name, data]) => ({
          name,
          subscribers: data.subscribers,
          revenue: data.revenue,
        })),
        metrics: {
          totalMonthlySv: response.metrics?.total_monthly_sv || 0,
          totalMonthlyCsv: response.metrics?.total_monthly_csv || 0,
          cancelled: response.metrics?.cancelled_subscriptions || 0,
          paused: response.metrics?.paused_subscriptions || 0,
        },
      };
    } catch (error) {
      console.warn('[API] Subscriptions endpoint failed, returning empty data:', error);
      // Return empty subscription data on error
      return {
        totalSubscribers: 0,
        activeSubscriptions: 0,
        growth: 0,
        churnRate: 0,
        monthlyRecurring: 0,
        byProduct: [],
        metrics: {
          totalMonthlySv: 0,
          totalMonthlyCsv: 0,
          cancelled: 0,
          paused: 0,
        },
      };
    }
  },

  getInsights: async (personId: string): Promise<InsightData[]> => {
    // Try to get insights from motivational-insight endpoint
    try {
      const response = await fetchAPI<{ insight?: string; insights?: Array<{ title: string; message: string }> }>(
        '/api/llm/motivational-insight',
        { method: 'POST', body: JSON.stringify({ person_id: personId }) }
      );
      
      // Handle different response formats
      if (Array.isArray(response)) {
        return response.map((insight, i) => ({
          id: `insight-${i}`,
          type: 'tip' as const,
          title: insight.title || 'Insight',
          message: insight.message || String(insight),
        }));
      }
      
      if (response.insight) {
        return [{
          id: 'insight-1',
          type: 'tip' as const,
          title: 'AI Insight',
          message: response.insight,
        }];
      }
      
      if (response.insights) {
        return response.insights.map((insight, i) => ({
          id: `insight-${i}`,
          type: 'tip' as const,
          title: insight.title || 'Insight',
          message: insight.message,
        }));
      }
      
      return [];
    } catch {
      // Return generated insights based on available data
      return [
        {
          id: 'insight-default-1',
          type: 'tip',
          title: 'Growth Opportunity',
          message: 'Focus on building your team volume to reach the next qualification level.',
        },
        {
          id: 'insight-default-2',
          type: 'trend',
          title: 'Team Activity',
          message: 'Monitor your downline activity to identify members who may need support.',
        },
      ];
    }
  },

  getSegments: async (personId: string) => {
    return fetchAPI(`/api/accounts/${personId}/segments`);
  },

  getTeamNetwork: async (personId: string) => {
    return fetchAPI(`/api/accounts/${personId}/team-network`);
  },
  
  getRuleQualifications: async (personId: string) => {
    return fetchAPI(`/api/accounts/${personId}/rule-qualifications`);
  },
};

// =============================================================================
// Raw API exports for direct access when needed
// =============================================================================

export const accountAPI = {
  listAccounts: () => fetchAPI('/api/accounts/'),
  getOverview: (personId: string) => fetchAPI<AccountOverviewResponse>(`/api/accounts/${personId}/overview`),
  getDownline: (personId: string) => fetchAPI<DownlineResponse>(`/api/accounts/${personId}/downline`),
  getSegments: (personId: string) => fetchAPI(`/api/accounts/${personId}/segments`),
  getOrders: (personId: string) => fetchAPI(`/api/accounts/${personId}/orders`),
  getSalesBreakdown: (personId: string) => fetchAPI(`/api/accounts/${personId}/sales-breakdown`),
  getDownlineFunnel: (personId: string) => fetchAPI(`/api/accounts/${personId}/downline-funnel`),
  getTeamNetwork: (personId: string) => fetchAPI(`/api/accounts/${personId}/team-network`),
  getDownlineTrends: (personId: string) => fetchAPI(`/api/accounts/${personId}/downline-trends`),
};

export const subscriptionAPI = {
  getSubscriptions: (personId: string) => fetchAPI<SubscriptionsResponse>(`/api/accounts/${personId}/subscriptions`),
  getSubscriptionInsights: (personId: string) => fetchAPI(`/api/accounts/${personId}/subscription-insights`),
  getDownlineSubscriptionPerformance: (personId: string) => 
    fetchAPI(`/api/accounts/${personId}/downline-subscription-performance`),
};

export const qualificationAPI = {
  getQualifications: (personId: string) => fetchAPI<QualificationsResponse>(`/api/accounts/${personId}/qualifications`),
  getUpcomingQualifications: (personId: string) => 
    fetchAPI(`/api/accounts/${personId}/qualifications/upcoming`),
  getRuleQualifications: (personId: string) => fetchAPI(`/api/accounts/${personId}/rule-qualifications`),
};

export const analyticsAPI = {
  getChartData: (personId: string) => fetchAPI<ChartDataResponse>(`/api/analytics/${personId}/chart-data`),
  getPerformanceHistory: (personId: string) => fetchAPI(`/api/analytics/${personId}/performance-history`),
  getQualificationProgress: (personId: string) => fetchAPI(`/api/analytics/${personId}/qualification-progress`),
  getTeamDistribution: (personId: string) => fetchAPI(`/api/analytics/${personId}/team-distribution`),
  getProductPerformance: (personId: string) => fetchAPI(`/api/analytics/${personId}/product-performance`),
  getProductTrends: (personId: string) => fetchAPI(`/api/analytics/${personId}/product-trends`),
};

export const nbaAPI = {
  getNBA: (personId: string, request?: { period?: string }) => fetchAPI<NBAResponse[]>(`/api/accounts/${personId}/nba`, {
    method: 'POST',
    body: JSON.stringify(request || { period: '2025-12' }),
  }),
};

export const llmAPI = {
  chat: (message: string, personId?: string, conversationId?: string) => fetchAPI('/api/llm/chat', {
    method: 'POST',
    body: JSON.stringify({ message, person_id: personId, conversation_id: conversationId }),
  }),
  getChatContext: () => fetchAPI('/api/llm/chat-context'),
  getPersonalizedAdvice: (personId: string, topic?: string) => fetchAPI('/api/llm/personalized-advice', {
    method: 'POST',
    body: JSON.stringify({ person_id: personId, topic }),
  }),
  explainRule: (ruleName: string) => fetchAPI('/api/llm/explain-rule', {
    method: 'POST',
    body: JSON.stringify({ rule_name: ruleName }),
  }),
  getMotivationalInsight: (personId: string) => fetchAPI('/api/llm/motivational-insight', {
    method: 'POST',
    body: JSON.stringify({ person_id: personId }),
  }),
  getConversationInsights: (conversationId: string) => fetchAPI('/api/llm/conversation-insights', {
    method: 'POST',
    body: JSON.stringify({ conversation_id: conversationId }),
  }),
};

export const crmAPI = {
  getSegmentAnalysis: () => fetchAPI('/api/crm/segments/analysis'),
  getSegmentMembers: (segmentType: string) => fetchAPI(`/api/crm/segments/${segmentType}/members`),
  getCommunications: () => fetchAPI('/api/crm/communications'),
};

export const genealogyAPI = {
  getDownlineTree: () => fetchAPI('/api/genealogy/downline-tree'),
};

export const commissionsAPI = {
  getEarningsCalendar: () => fetchAPI('/api/commissions/earnings/calendar'),
  getEarningsSummary: () => fetchAPI('/api/commissions/earnings/summary'),
  getStatements: () => fetchAPI('/api/commissions/statements'),
};

export const periodsAPI = {
  getPeriods: () => fetchAPI<Array<{ id: number; label: string }>>('/api/periods/'),
};

// Chat API for Stela AI
export const chatAPI = {
  sendMessage: async (message: string, personId: string, conversationId?: string) => {
    return llmAPI.chat(message, personId, conversationId);
  },
};
