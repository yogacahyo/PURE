'use client';

import { useState, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { ClayCard } from '@/components/ui/clay-card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import type { SensorReading, ParameterKey } from '@/data/mock-data';
import { parameterConfigs } from '@/data/mock-data';

type TimeRange = '1H' | '6H' | '24H' | '7D';

interface RealtimeChartProps {
  history: SensorReading[];
  parameters?: ParameterKey[];
  className?: string;
}

const chartColors: Record<ParameterKey, string> = {
  temperature: '#F97316',
  ph: '#8B5CF6',
  dissolvedOxygen: '#06B6D4',
  ammonia: '#EF4444',
  turbidity: '#3B82F6',
  tds: '#F59E0B',
};

const timeRangeConfig: Record<TimeRange, { label: string; points: number }> = {
  '1H': { label: '1H', points: 12 },
  '6H': { label: '6H', points: 72 },
  '24H': { label: '24H', points: 288 },
  '7D': { label: '7D', points: 500 },
};

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ name: string; value: number; color: string }>; label?: string }) {
  if (!active || !payload) return null;

  return (
    <div className="clay-card p-3 !rounded-xl text-xs">
      <p className="font-medium text-pure-dark mb-1">{label}</p>
      {payload.map((entry, i) => {
        const config = parameterConfigs.find(p => p.key === entry.name);
        return (
          <div key={i} className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
            <span className="text-pure-muted">{config?.name || entry.name}:</span>
            <span className="font-medium text-pure-dark">
              {entry.value} {config?.unit || ''}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export function RealtimeChart({ history, parameters = ['dissolvedOxygen', 'ph', 'temperature', 'ammonia'], className }: RealtimeChartProps) {
  const [timeRange, setTimeRange] = useState<TimeRange>('1H');
  const [activeParams, setActiveParams] = useState<ParameterKey[]>(parameters);

  const chartData = useMemo(() => {
    const maxPoints = timeRangeConfig[timeRange].points;
    const sliced = history.slice(-maxPoints);
    
    return sliced.map(reading => ({
      time: new Date(reading.timestamp).toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
      }),
      ...Object.fromEntries(
        parameters.map(p => [p, reading[p]])
      ),
    }));
  }, [history, timeRange, parameters]);

  const toggleParam = (param: ParameterKey) => {
    setActiveParams(prev => {
      if (prev.includes(param)) {
        if (prev.length === 1) return prev; // Keep at least one
        return prev.filter(p => p !== param);
      }
      return [...prev, param];
    });
  };

  return (
    <ClayCard variant="raised" className={cn('', className)} noHover>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <h3 className="text-lg font-semibold text-pure-dark">Real-Time Water Quality Trends</h3>
        
        {/* Time Range Selector */}
        <div className="flex gap-1 p-1 rounded-xl bg-pure-sky/50">
          {(Object.keys(timeRangeConfig) as TimeRange[]).map(range => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={cn(
                'px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
                timeRange === range
                  ? 'bg-white text-pure-primary shadow-sm'
                  : 'text-pure-muted hover:text-pure-dark',
              )}
            >
              {timeRangeConfig[range].label}
            </button>
          ))}
        </div>
      </div>

      {/* Parameter Toggles */}
      <div className="flex flex-wrap gap-2 mb-4">
        {parameters.map(param => {
          const config = parameterConfigs.find(p => p.key === param);
          const isActive = activeParams.includes(param);
          return (
            <button
              key={param}
              onClick={() => toggleParam(param)}
              className={cn(
                'flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-all border',
                isActive
                  ? 'bg-white border-blue-200 shadow-sm'
                  : 'border-transparent bg-pure-sky/30 text-pure-muted',
              )}
            >
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: isActive ? chartColors[param] : '#CBD5E1' }}
              />
              {config?.name || param}
            </button>
          );
        })}
      </div>

      {/* Chart */}
      <div className="h-64 sm:h-72 lg:h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
            <defs>
              {activeParams.map(param => (
                <linearGradient key={param} id={`gradient-${param}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={chartColors[param]} stopOpacity={0.15} />
                  <stop offset="95%" stopColor={chartColors[param]} stopOpacity={0} />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#E8F4FD" vertical={false} />
            <XAxis
              dataKey="time"
              tick={{ fontSize: 10, fill: '#6B8AA3' }}
              tickLine={false}
              axisLine={{ stroke: '#E8F4FD' }}
              interval="preserveStartEnd"
            />
            <YAxis
              tick={{ fontSize: 10, fill: '#6B8AA3' }}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            {activeParams.map(param => (
              <Area
                key={param}
                type="monotone"
                dataKey={param}
                stroke={chartColors[param]}
                strokeWidth={2}
                fill={`url(#gradient-${param})`}
                dot={false}
                activeDot={{ r: 4, strokeWidth: 2, fill: '#fff' }}
              />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </ClayCard>
  );
}
