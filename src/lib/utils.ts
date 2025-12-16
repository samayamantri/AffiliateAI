import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-US').format(num);
}

export function formatVolume(volume: number | null | undefined): string {
  if (volume === null || volume === undefined) return '0';
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(volume);
}

export function formatPercentage(value: number, decimals = 1): string {
  return `${value >= 0 ? '+' : ''}${value.toFixed(decimals)}%`;
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(date));
}

export function formatRelativeTime(date: string | Date): string {
  const now = new Date();
  const target = new Date(date);
  const diffInDays = Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  if (diffInDays === 0) return 'Today';
  if (diffInDays === 1) return 'Tomorrow';
  if (diffInDays === -1) return 'Yesterday';
  if (diffInDays > 0 && diffInDays <= 7) return `In ${diffInDays} days`;
  if (diffInDays < 0 && diffInDays >= -7) return `${Math.abs(diffInDays)} days ago`;

  return formatDate(date);
}

export function getInitials(name?: string | null): string {
  if (!name) return '??';
  return name
    .split(' ')
    .filter(part => part.length > 0)
    .map((part) => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || '??';
}

export function getGrowthColor(growth: number): string {
  if (growth > 0) return 'text-green-600';
  if (growth < 0) return 'text-red-600';
  return 'text-gray-500';
}

export function getGrowthBgColor(growth: number): string {
  if (growth > 0) return 'bg-green-100';
  if (growth < 0) return 'bg-red-100';
  return 'bg-gray-100';
}

export function getRankColor(rank?: string | null): string {
  if (!rank) return 'bg-gray-100 text-gray-700';
  
  const colors: Record<string, string> = {
    'Executive': 'bg-slate-100 text-slate-700',
    'Silver': 'bg-gray-200 text-gray-700',
    'Gold': 'bg-amber-100 text-amber-700',
    'Lapis': 'bg-blue-100 text-blue-700',
    'Ruby': 'bg-red-100 text-red-700',
    'Emerald': 'bg-emerald-100 text-emerald-700',
    'Diamond': 'bg-cyan-100 text-cyan-700',
    'Blue Diamond': 'bg-sky-100 text-sky-700',
  };
  
  for (const [key, value] of Object.entries(colors)) {
    if (rank.toLowerCase().includes(key.toLowerCase())) {
      return value;
    }
  }
  
  return 'bg-gray-100 text-gray-700';
}

export function truncateText(text?: string | null, maxLength: number = 50): string {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export function calculateProgress(current: number, target: number): number {
  if (target === 0) return 0;
  return Math.min(Math.round((current / target) * 100), 100);
}

