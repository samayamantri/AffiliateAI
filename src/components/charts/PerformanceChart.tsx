'use client';

import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface PerformanceChartProps {
  data: {
    labels: string[];
    sales: number[];
    volume: number[];
  };
  type?: 'line' | 'bar';
}

export function PerformanceChart({ data, type = 'line' }: PerformanceChartProps) {
  const chartData = {
    labels: data.labels,
    datasets: [
      {
        label: 'Sales',
        data: data.sales,
        borderColor: '#003B5C',
        backgroundColor: type === 'line' ? 'rgba(0, 59, 92, 0.1)' : 'rgba(0, 59, 92, 0.8)',
        fill: type === 'line',
        tension: 0.4,
        borderWidth: 2,
        pointBackgroundColor: '#003B5C',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
      {
        label: 'Volume',
        data: data.volume,
        borderColor: '#00A9E0',
        backgroundColor: type === 'line' ? 'rgba(0, 169, 224, 0.1)' : 'rgba(0, 169, 224, 0.8)',
        fill: type === 'line',
        tension: 0.4,
        borderWidth: 2,
        pointBackgroundColor: '#00A9E0',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        align: 'end' as const,
        labels: {
          usePointStyle: true,
          pointStyle: 'circle',
          padding: 20,
          font: {
            size: 12,
            family: "'Inter', sans-serif",
          },
        },
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        titleColor: '#1F2937',
        bodyColor: '#4B5563',
        borderColor: '#E5E7EB',
        borderWidth: 1,
        padding: 12,
        cornerRadius: 8,
        displayColors: true,
        usePointStyle: true,
        callbacks: {
          label: (context: { dataset: { label?: string }; parsed: { y: number } }) => {
            const label = context.dataset.label || '';
            const value = context.parsed.y;
            return ` ${label}: $${value.toLocaleString()}`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 12,
            family: "'Inter', sans-serif",
          },
          color: '#9CA3AF',
        },
      },
      y: {
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
        ticks: {
          font: {
            size: 12,
            family: "'Inter', sans-serif",
          },
          color: '#9CA3AF',
          callback: (value: string | number) => `$${Number(value).toLocaleString()}`,
        },
      },
    },
    interaction: {
      intersect: false,
      mode: 'index' as const,
    },
  };

  return (
    <div className="chart-container">
      {type === 'line' ? (
        <Line data={chartData} options={options} />
      ) : (
        <Bar data={chartData} options={options} />
      )}
    </div>
  );
}

