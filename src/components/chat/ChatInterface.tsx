'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { Bar, Line, Pie, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import {
  Send,
  Sparkles,
  User,
  Loader2,
  RefreshCw,
  Copy,
  Check,
  Mic,
  Paperclip,
  ChevronDown,
  BarChart3,
  TrendingUp,
  PieChart,
} from 'lucide-react';
import { cn, getInitials } from '@/lib/utils';
import { useAccount } from '@/context/AccountContext';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface ChartData {
  type: 'bar' | 'line' | 'pie' | 'doughnut';
  title: string;
  data: {
    labels: string[];
    datasets: Array<{
      label?: string;
      data: number[];
      backgroundColor?: string | string[];
      borderColor?: string | string[];
      borderWidth?: number;
      tension?: number;
      fill?: boolean;
    }>;
  };
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isLoading?: boolean;
  charts?: ChartData[];
}

interface SuggestedPrompt {
  icon: React.ReactNode;
  title: string;
  prompt: string;
}

const suggestedPrompts: SuggestedPrompt[] = [
  {
    icon: '🎯',
    title: 'Qualification Status',
    prompt: 'Show me my qualification progress and what I need to do to reach the next rank.',
  },
  {
    icon: '⚡',
    title: 'What Should I Do?',
    prompt: 'What are my top priority actions right now to grow my business?',
  },
  {
    icon: '👥',
    title: 'Team Focus',
    prompt: 'Who on my team needs attention and how can I help them?',
  },
  {
    icon: '📊',
    title: 'My Progress',
    prompt: 'Show me how I\'m doing this month with trends and insights.',
  },
];

// Generate a context-aware response when API fails
// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function generateSmartFallbackResponse(
  query: string, 
  accountData: any,
  accountId: string
): Promise<string> {
  const name = accountData?.account?.name || accountData?.name || 'there';
  const firstName = name.split(' ')[0];
  const rank = accountData?.account?.current_title || accountData?.title || 'Member';
  const gsv = accountData?.summary?.gsv || accountData?.stats?.gsv || 0;
  const csv = accountData?.summary?.csv || accountData?.stats?.csv || 0;
  const dcSv = accountData?.summary?.dc_sv || accountData?.stats?.dcSv || 0;

  const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  const queryLower = query.toLowerCase();

  // Detect what the user is asking about
  const isQualificationQuery = queryLower.includes('qualification') || queryLower.includes('rank') || queryLower.includes('progress');
  const isTeamQuery = queryLower.includes('team') || queryLower.includes('downline') || queryLower.includes('who needs');
  const isNBAQuery = queryLower.includes('priority') || queryLower.includes('action') || queryLower.includes('should i do') || queryLower.includes('recommendation');
  const isPerformanceQuery = queryLower.includes('performance') || queryLower.includes('how am i doing') || queryLower.includes('stats');

  let response = `# Hey ${firstName}! 👋\n\n`;

  // Try to fetch relevant data based on the question
  try {
    if (isQualificationQuery) {
      const qualData = await fetch(`${backendUrl}/api/accounts/${accountId}/rule-qualifications`).then(r => r.json());
      if (qualData.qualifications) {
        response += `## 🎯 Your Qualification Progress\n\n`;
        response += `**Current Rank:** ${rank}\n\n`;
        response += `| Requirement | Progress | Status |\n|-------------|----------|--------|\n`;
        qualData.qualifications.forEach((q: any) => {
          const status = q.status === 'MET' ? '✅ Met' : `⏳ ${q.progress_percentage}%`;
          response += `| ${q.name} | ${q.current_progress}/${q.target_value} ${q.unit || ''} | ${status} |\n`;
        });
        response += `\n`;
        
        // Add qualification chart
        const metCount = qualData.qualifications.filter((q: any) => q.status === 'MET').length;
        const totalCount = qualData.qualifications.length;
        response += `\`\`\`chart
{
  "type": "doughnut",
  "title": "Qualification Progress",
  "data": {
    "labels": ["Met", "Pending"],
    "datasets": [{
      "data": [${metCount}, ${totalCount - metCount}],
      "backgroundColor": ["#10B981", "#E5E7EB"]
    }]
  }
}
\`\`\`\n\n`;
      }
    }

    if (isTeamQuery) {
      const teamData = await fetch(`${backendUrl}/api/accounts/${accountId}/downline`).then(r => r.json());
      if (teamData.downlines?.length > 0) {
        response += `## 👥 Your Team Overview\n\n`;
        response += `| Member | Rank | GSV | Status |\n|--------|------|-----|--------|\n`;
        teamData.downlines.slice(0, 5).forEach((d: any) => {
          const status = d.active ? '🟢 Active' : '🔴 Inactive';
          response += `| ${d.name} | ${d.current_title || 'Member'} | ${(d.gsv || 0).toLocaleString()} | ${status} |\n`;
        });
        if (teamData.downlines.length > 5) {
          response += `\n*...and ${teamData.downlines.length - 5} more team members*\n`;
        }
        response += `\n`;
      }
    }

    if (isNBAQuery) {
      const nbaData = await fetch(`${backendUrl}/api/accounts/${accountId}/nba`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
      }).then(r => r.json());
      
      const actions = nbaData.actions || nbaData.recommendations || [];
      if (actions.length > 0) {
        response += `## ⚡ Your Priority Actions\n\n`;
        actions.slice(0, 3).forEach((a: any, i: number) => {
          response += `${i + 1}. **${a.title || a.action}**\n   ${a.description || a.reason || ''}\n\n`;
        });
      }
    }

    // Always show current volumes if we have them
    if (gsv > 0 || csv > 0) {
      response += `## 📊 Your Current Volumes\n\n`;
      response += `| Metric | Value |\n|--------|-------|\n`;
      response += `| Group Sales Volume (GSV) | ${gsv.toLocaleString()} |\n`;
      response += `| Customer Sales Volume (CSV) | ${csv.toLocaleString()} |\n`;
      response += `| Direct Customer Sales (DC-SV) | ${dcSv.toLocaleString()} |\n\n`;

      response += `\`\`\`chart
{
  "type": "bar",
  "title": "Your Current Volumes",
  "data": {
    "labels": ["GSV", "CSV", "DC-SV"],
    "datasets": [{
      "label": "Volume",
      "data": [${gsv}, ${csv}, ${dcSv}],
      "backgroundColor": ["#003B5C", "#0077A8", "#00A9E0"]
    }]
  }
}
\`\`\`\n\n`;
    }

  } catch (error) {
    console.error('Fallback data fetch error:', error);
    // Add basic info if API calls fail
    response += `## 📊 Your Current Status\n\n`;
    response += `**Rank:** ${rank}\n\n`;
    if (gsv > 0) {
      response += `| Metric | Value |\n|--------|-------|\n`;
      response += `| GSV | ${gsv.toLocaleString()} |\n`;
      response += `| CSV | ${csv.toLocaleString()} |\n`;
    }
  }

  response += `---\n\n*Note: AI assistant is currently running in offline mode. For full functionality, ensure AWS credentials are refreshed.*\n\n`;
  response += `### 💡 Try asking:\n`;
  response += `- "Show me my qualification progress"\n`;
  response += `- "What are my priorities today?"\n`;
  response += `- "How is my team doing?"\n`;

  return response;
}

// NuSkin brand colors for charts
const chartColors = {
  primary: '#003B5C',
  secondary: '#0077A8',
  accent: '#00A9E0',
  gold: '#C4A962',
  light: '#E8F4F8',
  success: '#10B981',
  warning: '#F59E0B',
  danger: '#EF4444',
};

const defaultChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom' as const,
      labels: {
        usePointStyle: true,
        padding: 20,
        font: { size: 12 },
      },
    },
    title: {
      display: false,
    },
  },
};

// Parse chart blocks from content
function parseChartsFromContent(content: string): { cleanContent: string; charts: ChartData[] } {
  const chartRegex = /```chart\n([\s\S]*?)```/g;
  const charts: ChartData[] = [];
  let cleanContent = content;

  let match;
  while ((match = chartRegex.exec(content)) !== null) {
    try {
      const chartData = JSON.parse(match[1]);
      // Add default colors if not provided
      if (chartData.data?.datasets) {
        chartData.data.datasets = chartData.data.datasets.map((dataset: ChartData['data']['datasets'][0], index: number) => ({
          ...dataset,
          backgroundColor: dataset.backgroundColor || [
            chartColors.primary,
            chartColors.secondary,
            chartColors.accent,
            chartColors.gold,
            chartColors.success,
            chartColors.warning,
          ].slice(0, chartData.data.labels?.length || 6),
          borderColor: dataset.borderColor || chartColors.primary,
          borderWidth: dataset.borderWidth || 2,
        }));
      }
      charts.push(chartData);
      cleanContent = cleanContent.replace(match[0], '');
    } catch (e) {
      console.error('Failed to parse chart:', e);
    }
  }

  return { cleanContent: cleanContent.trim(), charts };
}

// Chart component
function ChartRenderer({ chart }: { chart: ChartData }) {
  const chartRef = useRef(null);
  
  const options = {
    ...defaultChartOptions,
    plugins: {
      ...defaultChartOptions.plugins,
      title: {
        display: true,
        text: chart.title,
        font: { size: 14, weight: 'bold' as const },
        padding: { bottom: 10 },
      },
    },
  };

  const ChartComponent = {
    bar: Bar,
    line: Line,
    pie: Pie,
    doughnut: Doughnut,
  }[chart.type] || Bar;

  const ChartIcon = {
    bar: BarChart3,
    line: TrendingUp,
    pie: PieChart,
    doughnut: PieChart,
  }[chart.type] || BarChart3;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="my-4 p-4 bg-white rounded-xl border border-gray-100 shadow-sm"
    >
      <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-100">
        <ChartIcon className="w-4 h-4 text-nuskin-primary" />
        <span className="text-sm font-medium text-gray-700">{chart.title}</span>
      </div>
      <div className="h-64">
        <ChartComponent ref={chartRef} data={chart.data} options={options} />
      </div>
    </motion.div>
  );
}

export function ChatInterface() {
  const { accountData, accountId } = useAccount();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (text?: string) => {
    const messageText = text || input.trim();
    if (!messageText || isLoading) return;

    // Cancel any ongoing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: messageText,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setIsStreaming(true);

    // Add loading message
    const assistantMessageId = (Date.now() + 1).toString();
    const loadingMessage: Message = {
      id: assistantMessageId,
      role: 'assistant',
      content: '',
      timestamp: new Date(),
      isLoading: true,
    };
    setMessages((prev) => [...prev, loadingMessage]);

    try {
      // Build conversation history
      const history = messages.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      // Use Next.js API route for streaming
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'text/event-stream',
        },
        body: JSON.stringify({
          message: messageText,
          person_id: accountId,
          history,
          context: {
            account_name: accountData?.account?.name,
            rank: accountData?.account?.current_title,
            gsv: accountData?.summary?.gsv,
            csv: accountData?.summary?.csv,
            dc_sv: accountData?.summary?.dc_sv,
          },
        }),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) throw new Error('Failed to get response');

      const contentType = response.headers.get('content-type');
      
      if (contentType?.includes('text/event-stream')) {
        // Handle streaming response
        const reader = response.body?.getReader();
        const decoder = new TextDecoder();
        let fullContent = '';

        if (reader) {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value);
            const lines = chunk.split('\n');

            for (const line of lines) {
              if (line.startsWith('data: ')) {
                const data = line.slice(6);
                if (data === '[DONE]') continue;

                try {
                  const parsed = JSON.parse(data);
                  if (parsed.text) {
                    fullContent += parsed.text;
                    const { cleanContent, charts } = parseChartsFromContent(fullContent);
                    
                    setMessages((prev) =>
                      prev.map((msg) =>
                        msg.id === assistantMessageId
                          ? { ...msg, content: cleanContent, charts, isLoading: false }
                          : msg
                      )
                    );
                  }
                } catch {
                  // Ignore parse errors
                }
              }
            }
          }
        }
      } else {
        // Handle non-streaming response (fallback)
        const data = await response.json();
        const responseContent = data.response || data.message || data.content || JSON.stringify(data);
        const { cleanContent, charts } = parseChartsFromContent(responseContent);
        
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantMessageId
              ? { ...msg, content: cleanContent, charts, isLoading: false }
              : msg
          )
        );
      }
    } catch (error) {
      if ((error as Error).name === 'AbortError') {
        return; // Request was cancelled
      }

      console.error('Chat error:', error);
      
      // Fallback to backend API directly
      try {
        const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
        const response = await fetch(`${backendUrl}/api/llm/chat`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: messageText,
            person_id: accountId,
            context: {
              account_name: accountData?.account?.name,
              rank: accountData?.account?.current_title,
            },
          }),
        });

        if (response.ok) {
          const data = await response.json();
          const responseContent = data.response || data.message || data.content || JSON.stringify(data);
          const { cleanContent, charts } = parseChartsFromContent(responseContent);
          
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === assistantMessageId
                ? { ...msg, content: cleanContent, charts, isLoading: false }
                : msg
            )
          );
          return;
        }
      } catch {
        // Ignore fallback error
      }

      // Generate intelligent fallback response based on the query and available data
      const fallbackResponse = await generateSmartFallbackResponse(messageText, accountData, accountId);
      const { cleanContent, charts } = parseChartsFromContent(fallbackResponse);
      
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantMessageId
            ? { ...msg, content: cleanContent, charts, isLoading: false }
            : msg
        )
      );
    } finally {
      setIsLoading(false);
      setIsStreaming(false);
    }
  };

  const handleCopy = async (content: string, id: string) => {
    await navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleRegenerate = () => {
    if (messages.length >= 2) {
      const lastUserMessage = [...messages].reverse().find((m) => m.role === 'user');
      if (lastUserMessage) {
        // Remove last assistant message
        setMessages((prev) => prev.slice(0, -1));
        handleSend(lastUserMessage.content);
      }
    }
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-background-primary to-white">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-3 md:px-4 py-4 md:py-6">
        {messages.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto text-center py-6 md:py-12 px-2"
          >
            {/* Welcome Animation - Smaller on mobile */}
            <div className="relative w-16 h-16 md:w-24 md:h-24 mx-auto mb-4 md:mb-6">
              <div className="absolute inset-0 bg-gradient-to-br from-nuskin-primary to-nuskin-accent rounded-2xl md:rounded-3xl rotate-6" />
              <div className="absolute inset-0 bg-gradient-to-br from-nuskin-secondary to-nuskin-accent rounded-2xl md:rounded-3xl -rotate-3" />
              <div className="relative bg-white rounded-2xl md:rounded-3xl w-full h-full flex items-center justify-center shadow-xl">
                <Sparkles className="w-7 h-7 md:w-10 md:h-10 text-nuskin-primary" />
              </div>
            </div>

            <h2 className="text-xl md:text-2xl font-display font-bold text-gray-900 mb-2">
              Hi, I&apos;m Stela AI
            </h2>
            <p className="text-sm md:text-base text-gray-600 mb-3 md:mb-4 max-w-md mx-auto">
              Your intelligent business companion. I can help you grow your NuSkin business.
            </p>
            <p className="text-xs md:text-sm text-nuskin-primary mb-6 md:mb-8">
              ✨ Ask me anything about your performance!
            </p>

            {/* Suggested Prompts - 2x2 grid on mobile */}
            <div className="grid grid-cols-2 gap-2 md:gap-3 max-w-lg mx-auto">
              {suggestedPrompts.map((prompt, index) => (
                <motion.button
                  key={prompt.title}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => handleSend(prompt.prompt)}
                  className="flex flex-col md:flex-row items-center md:items-start gap-2 md:gap-3 p-3 md:p-4 rounded-xl bg-white border border-gray-200 hover:border-nuskin-accent hover:shadow-md transition-all text-center md:text-left group touch-manipulation"
                >
                  <span className="text-xl md:text-2xl">{prompt.icon}</span>
                  <div className="min-w-0">
                    <p className="font-medium text-xs md:text-sm text-gray-900 group-hover:text-nuskin-primary transition-colors">
                      {prompt.title}
                    </p>
                    <p className="text-[10px] md:text-sm text-gray-500 line-clamp-2 hidden md:block">
                      {prompt.prompt}
                    </p>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        ) : (
          <div className="max-w-3xl mx-auto space-y-6">
            <AnimatePresence>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className={cn(
                    'flex gap-3',
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  )}
                >
                  {message.role === 'assistant' && (
                    <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-nuskin-primary to-nuskin-accent flex items-center justify-center">
                      <Sparkles className="w-4 h-4 text-white" />
                    </div>
                  )}

                  <div
                    className={cn(
                      'max-w-[85%] rounded-2xl',
                      message.role === 'user'
                        ? 'bg-gradient-to-r from-nuskin-primary to-nuskin-secondary text-white rounded-br-md px-4 py-3'
                        : 'bg-white border border-gray-100 shadow-sm rounded-bl-md'
                    )}
                  >
                    {message.isLoading ? (
                      <div className="flex items-center gap-2 py-2 px-4">
                        <Loader2 className="w-4 h-4 animate-spin text-nuskin-primary" />
                        <span className="text-sm text-gray-500">
                          {isStreaming ? 'Generating response...' : 'Thinking...'}
                        </span>
                      </div>
                    ) : (
                      <>
                        <div className={cn(
                          'prose prose-sm max-w-none',
                          message.role === 'user' ? 'prose-invert' : 'px-4 py-3'
                        )}>
                          <ReactMarkdown
                            components={{
                              strong: ({ children }) => (
                                <strong className="font-semibold text-nuskin-primary">{children}</strong>
                              ),
                              ul: ({ children }) => (
                                <ul className="space-y-1 my-2">{children}</ul>
                              ),
                              li: ({ children }) => (
                                <li className="flex items-start gap-2">
                                  <span className="text-nuskin-accent mt-1">•</span>
                                  <span>{children}</span>
                                </li>
                              ),
                              h1: ({ children }) => (
                                <h1 className="text-lg font-bold text-gray-900 mt-4 mb-2">{children}</h1>
                              ),
                              h2: ({ children }) => (
                                <h2 className="text-base font-bold text-gray-900 mt-3 mb-2">{children}</h2>
                              ),
                              h3: ({ children }) => (
                                <h3 className="text-sm font-bold text-gray-800 mt-2 mb-1">{children}</h3>
                              ),
                              code: ({ children, className }) => {
                                const isInline = !className;
                                return isInline ? (
                                  <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm font-mono text-nuskin-primary">
                                    {children}
                                  </code>
                                ) : (
                                  <code className="block bg-gray-50 p-3 rounded-lg text-sm font-mono overflow-x-auto">
                                    {children}
                                  </code>
                                );
                              },
                              table: ({ children }) => (
                                <div className="overflow-x-auto my-3">
                                  <table className="min-w-full border-collapse border border-gray-200 rounded-lg">
                                    {children}
                                  </table>
                                </div>
                              ),
                              th: ({ children }) => (
                                <th className="border border-gray-200 bg-gray-50 px-3 py-2 text-left text-sm font-medium">
                                  {children}
                                </th>
                              ),
                              td: ({ children }) => (
                                <td className="border border-gray-200 px-3 py-2 text-sm">
                                  {children}
                                </td>
                              ),
                            }}
                          >
                            {message.content}
                          </ReactMarkdown>
                        </div>

                        {/* Render Charts */}
                        {message.charts && message.charts.length > 0 && (
                          <div className="px-4 pb-4">
                            {message.charts.map((chart, index) => (
                              <ChartRenderer key={index} chart={chart} />
                            ))}
                          </div>
                        )}

                        {message.role === 'assistant' && message.content && (
                          <div className="flex items-center gap-2 px-4 py-2 border-t border-gray-100">
                            <button
                              onClick={() => handleCopy(message.content, message.id)}
                              className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                              title="Copy response"
                            >
                              {copiedId === message.id ? (
                                <Check className="w-4 h-4 text-green-500" />
                              ) : (
                                <Copy className="w-4 h-4 text-gray-400" />
                              )}
                            </button>
                            <button 
                              onClick={handleRegenerate}
                              className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                              title="Regenerate response"
                            >
                              <RefreshCw className="w-4 h-4 text-gray-400" />
                            </button>
                          </div>
                        )}
                      </>
                    )}
                  </div>

                  {message.role === 'user' && (
                    <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gray-200 flex items-center justify-center text-xs font-medium text-gray-600">
                      {accountData?.account?.name ? getInitials(accountData.account.name) : <User className="w-4 h-4" />}
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Scroll to bottom button - adjusted for mobile */}
      {messages.length > 3 && (
        <button
          onClick={() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })}
          className="absolute bottom-20 md:bottom-24 right-4 md:right-8 p-2 rounded-full bg-white shadow-lg border border-gray-200 hover:bg-gray-50 transition-colors touch-manipulation"
        >
          <ChevronDown className="w-5 h-5 text-gray-600" />
        </button>
      )}

      {/* Input Area - Mobile optimized with safe area */}
      <div className="border-t border-gray-100 bg-white p-3 md:p-4 safe-area-pb">
        <div className="max-w-3xl mx-auto">
          <div className="relative flex items-end gap-2">
            <div className="flex-1 relative">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask Stela anything..."
                rows={1}
                className="w-full px-3 md:px-4 py-3 pr-16 md:pr-24 rounded-2xl border border-gray-200 focus:border-nuskin-accent focus:ring-2 focus:ring-nuskin-accent/20 outline-none resize-none text-base"
                style={{ minHeight: '48px', maxHeight: '120px' }}
              />
              <div className="absolute right-2 bottom-2 flex items-center gap-0.5 md:gap-1">
                <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors hidden md:block" title="Attach file">
                  <Paperclip className="w-4 h-4 text-gray-400" />
                </button>
                <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors" title="Voice input">
                  <Mic className="w-4 h-4 text-gray-400" />
                </button>
              </div>
            </div>
            <button
              onClick={() => handleSend()}
              disabled={!input.trim() || isLoading}
              className={cn(
                'p-3 rounded-xl transition-all touch-manipulation min-w-[48px] min-h-[48px] flex items-center justify-center',
                input.trim() && !isLoading
                  ? 'bg-gradient-to-r from-nuskin-primary to-nuskin-secondary text-white shadow-lg active:scale-95'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              )}
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </button>
          </div>
          <p className="text-[10px] md:text-xs text-gray-400 text-center mt-2 hidden md:block">
            Powered by Claude via AWS Bedrock with real-time data access
          </p>
        </div>
      </div>
    </div>
  );
}
