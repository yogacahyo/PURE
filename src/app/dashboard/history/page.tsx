'use client';

import { useState, useMemo } from 'react';
import { ClayCard } from '@/components/ui/clay-card';
import { StatusBadge, SensorIcon } from '@/components/ui/status-badge';
import { sensorHistory, parameterConfigs, getParameterStatus, type ParameterKey } from '@/data/mock-data';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Clock, Download, Search, Filter, BarChart3 } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

type ViewMode = 'table' | 'chart';

const chartColors: Record<ParameterKey, string> = {
  temperature: '#F97316',
  ph: '#8B5CF6',
  dissolvedOxygen: '#06B6D4',
  ammonia: '#EF4444',
  turbidity: '#3B82F6',
  tds: '#F59E0B',
};

export default function HistoryPage() {
  const [selectedParam, setSelectedParam] = useState<ParameterKey | 'all'>('all');
  const [viewMode, setViewMode] = useState<ViewMode>('table');
  const [searchQuery, setSearchQuery] = useState('');

  // Take a subset for display
  const displayData = useMemo(() => {
    let data = sensorHistory.slice(-100);
    return data.reverse(); // Most recent first
  }, []);

  const chartData = useMemo(() => {
    return sensorHistory.slice(-168).map(r => ({
      time: new Date(r.timestamp).toLocaleDateString('id-ID', { day: '2-digit', month: 'short' }) + 
            ' ' + new Date(r.timestamp).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      temperature: r.temperature,
      ph: r.ph,
      dissolvedOxygen: r.dissolvedOxygen,
      ammonia: r.ammonia,
      turbidity: r.turbidity,
      tds: r.tds,
    }));
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-pure-dark">History</h1>
          <p className="text-sm text-pure-muted mt-1">Riwayat data sensor kualitas air</p>
        </div>

        {/* Export Buttons */}
        <div className="flex gap-2">
          <button className="clay-button !px-4 !py-2 bg-white text-pure-dark border border-blue-100 text-sm flex items-center gap-2 hover:bg-pure-sky/50">
            <Download className="w-4 h-4" />
            CSV
          </button>
          <button className="clay-button !px-4 !py-2 bg-white text-pure-dark border border-blue-100 text-sm flex items-center gap-2 hover:bg-pure-sky/50">
            <Download className="w-4 h-4" />
            PDF
          </button>
        </div>
      </div>

      {/* Filters */}
      <ClayCard variant="raised" noHover className="!p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-pure-muted" />
            <input
              type="text"
              placeholder="Search pond / device..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-pure-sky/30 border border-blue-50 text-sm text-pure-dark placeholder:text-pure-muted focus:outline-none focus:ring-2 focus:ring-pure-primary/20"
            />
          </div>

          {/* Parameter Filter */}
          <div className="flex flex-wrap gap-1">
            <button
              onClick={() => setSelectedParam('all')}
              className={cn(
                'clay-badge text-xs cursor-pointer border transition-all',
                selectedParam === 'all'
                  ? 'bg-pure-primary/10 text-pure-primary border-pure-primary/20'
                  : 'bg-white text-pure-muted border-blue-50',
              )}
            >
              All
            </button>
            {parameterConfigs.map(config => (
              <button
                key={config.key}
                onClick={() => setSelectedParam(config.key)}
                className={cn(
                  'clay-badge text-xs cursor-pointer border transition-all',
                  selectedParam === config.key
                    ? 'bg-pure-primary/10 text-pure-primary border-pure-primary/20'
                    : 'bg-white text-pure-muted border-blue-50',
                )}
              >
                {config.name}
              </button>
            ))}
          </div>

          {/* View Toggle */}
          <div className="flex gap-1 p-1 rounded-xl bg-pure-sky/30">
            <button
              onClick={() => setViewMode('table')}
              className={cn(
                'px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
                viewMode === 'table' ? 'bg-white text-pure-primary shadow-sm' : 'text-pure-muted',
              )}
            >
              Table
            </button>
            <button
              onClick={() => setViewMode('chart')}
              className={cn(
                'px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
                viewMode === 'chart' ? 'bg-white text-pure-primary shadow-sm' : 'text-pure-muted',
              )}
            >
              Chart
            </button>
          </div>
        </div>
      </ClayCard>

      {/* Chart View */}
      {viewMode === 'chart' && (
        <ClayCard variant="raised" noHover>
          <h3 className="text-lg font-semibold text-pure-dark mb-4">Trend Data Historis</h3>
          <div className="h-72 sm:h-96">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  {parameterConfigs.map(config => (
                    <linearGradient key={config.key} id={`hist-${config.key}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={chartColors[config.key]} stopOpacity={0.2} />
                      <stop offset="95%" stopColor={chartColors[config.key]} stopOpacity={0} />
                    </linearGradient>
                  ))}
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E8F4FD" vertical={false} />
                <XAxis dataKey="time" tick={{ fontSize: 9, fill: '#6B8AA3' }} tickLine={false} axisLine={{ stroke: '#E8F4FD' }} interval="preserveStartEnd" />
                <YAxis tick={{ fontSize: 10, fill: '#6B8AA3' }} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    borderRadius: '16px',
                    border: 'none',
                    boxShadow: '0 4px 12px rgba(14, 143, 234, 0.1)',
                    fontSize: '12px',
                  }}
                />
                {parameterConfigs
                  .filter(c => selectedParam === 'all' || selectedParam === c.key)
                  .map(config => (
                    <Area
                      key={config.key}
                      type="monotone"
                      dataKey={config.key}
                      stroke={chartColors[config.key]}
                      strokeWidth={2}
                      fill={`url(#hist-${config.key})`}
                      dot={false}
                    />
                  ))}
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </ClayCard>
      )}

      {/* Table View - Desktop */}
      {viewMode === 'table' && (
        <>
          {/* Desktop Table */}
          <div className="hidden md:block">
            <ClayCard variant="raised" noPadding noHover>
              <div className="overflow-x-auto custom-scrollbar">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-blue-50">
                      <th className="text-left p-4 text-xs font-semibold text-pure-muted">Timestamp</th>
                      <th className="text-left p-4 text-xs font-semibold text-pure-muted">Device</th>
                      {parameterConfigs
                        .filter(c => selectedParam === 'all' || selectedParam === c.key)
                        .map(config => (
                          <th key={config.key} className="text-left p-4 text-xs font-semibold text-pure-muted">
                            {config.name} ({config.unit || '-'})
                          </th>
                        ))}
                    </tr>
                  </thead>
                  <tbody>
                    {displayData.slice(0, 20).map((row, i) => (
                      <motion.tr
                        key={i}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: i * 0.02 }}
                        className="border-b border-blue-50/50 hover:bg-pure-sky/20 transition-colors"
                      >
                        <td className="p-4 text-xs text-pure-muted whitespace-nowrap">
                          {new Date(row.timestamp).toLocaleString('id-ID')}
                        </td>
                        <td className="p-4 text-xs font-medium text-pure-dark">{row.deviceId}</td>
                        {parameterConfigs
                          .filter(c => selectedParam === 'all' || selectedParam === c.key)
                          .map(config => {
                            const value = row[config.key];
                            const status = getParameterStatus(config.key, value);
                            return (
                              <td key={config.key} className="p-4">
                                <div className="flex items-center gap-2">
                                  <span className="text-sm font-medium text-pure-dark">
                                    {(value as number).toFixed(config.decimals)}
                                  </span>
                                  <StatusBadge status={status} className="!text-[9px] !px-1.5 !py-0" />
                                </div>
                              </td>
                            );
                          })}
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </ClayCard>
          </div>

          {/* Mobile Card List */}
          <div className="md:hidden space-y-3">
            {displayData.slice(0, 15).map((row, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
              >
                <ClayCard className="!p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] text-pure-muted">
                      {new Date(row.timestamp).toLocaleString('id-ID')}
                    </span>
                    <span className="clay-badge bg-pure-sky text-pure-primary text-[9px]">
                      {row.deviceId.slice(-7)}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {parameterConfigs
                      .filter(c => selectedParam === 'all' || selectedParam === c.key)
                      .slice(0, 6)
                      .map(config => {
                        const value = row[config.key];
                        const status = getParameterStatus(config.key, value);
                        return (
                          <div key={config.key} className="text-center p-1.5 rounded-xl bg-pure-sky/30">
                            <p className="text-[9px] text-pure-muted">{config.name}</p>
                            <p className="text-xs font-bold text-pure-dark">
                              {(value as number).toFixed(config.decimals)}
                            </p>
                          </div>
                        );
                      })}
                  </div>
                </ClayCard>
              </motion.div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
