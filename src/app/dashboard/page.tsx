'use client';

import { useSensorData } from '@/context/sensor-context';
import { ClayCard } from '@/components/ui/clay-card';
import { StatusBadge, TrendIndicator, SensorIcon } from '@/components/ui/status-badge';
import { WaterQualityScore } from '@/components/ui/water-quality-score';
import { RealtimeChart } from '@/components/charts/realtime-chart';
import { parameterConfigs, getParameterStatus, getTrend, type ParameterKey, mockAlerts } from '@/data/mock-data';
import { calculateWaterQualityScore } from '@/lib/dss-engine';
import { motion } from 'framer-motion';
import { Bell, AlertTriangle, CheckCircle2, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function DashboardPage() {
  const { current, history } = useSensorData();
  const qualityScore = calculateWaterQualityScore(current);

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div>
        <h1 className="text-2xl font-bold text-pure-dark">Dashboard Monitoring</h1>
        <p className="text-sm text-pure-muted mt-1">Pantau kualitas air tambak secara real-time</p>
      </div>

      {/* Sensor Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {parameterConfigs.map((config, i) => {
          const value = current[config.key];
          const status = getParameterStatus(config.key, value);
          const paramHistory = history.slice(-10).map(r => r[config.key] as number);
          const trend = getTrend(paramHistory);

          return (
            <motion.div
              key={config.key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <ClayCard className="h-full">
                <div className="flex items-start justify-between mb-3">
                  <SensorIcon icon={config.icon} />
                  <StatusBadge status={status} />
                </div>
                <p className="text-xs text-pure-muted mb-1">{config.name}</p>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-2xl font-bold text-pure-dark">
                    {value.toFixed(config.decimals)}
                  </span>
                  {config.unit && (
                    <span className="text-sm text-pure-muted">{config.unit}</span>
                  )}
                </div>
                <div className="mt-2">
                  <TrendIndicator trend={trend} />
                </div>
              </ClayCard>
            </motion.div>
          );
        })}
      </div>

      {/* Charts + Score Row */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Chart - spans 2 cols */}
        <div className="lg:col-span-2">
          <RealtimeChart history={history} />
        </div>

        {/* Water Quality Score */}
        <ClayCard variant="raised" noHover>
          <h3 className="text-lg font-semibold text-pure-dark mb-4">Pond Health Score</h3>
          <div className="flex flex-col items-center py-4">
            <WaterQualityScore
              score={qualityScore.score}
              status={qualityScore.status}
              statusLabel={qualityScore.statusLabel}
              size="lg"
            />
            <p className="text-sm text-pure-muted text-center mt-4 leading-relaxed max-w-xs">
              {qualityScore.summary}
            </p>
          </div>
        </ClayCard>
      </div>

      {/* Alert Panel */}
      <ClayCard variant="raised" noHover>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="sensor-bubble bg-red-50">
              <Bell className="w-5 h-5 text-red-500" />
            </div>
            <h3 className="text-lg font-semibold text-pure-dark">Recent Alerts</h3>
          </div>
          <span className="clay-badge bg-red-50 text-red-600 border border-red-200 text-xs">
            {mockAlerts.filter(a => a.status === 'active').length} Active
          </span>
        </div>

        <div className="space-y-3">
          {mockAlerts.slice(0, 4).map((alert, i) => (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className={cn(
                'flex items-start gap-3 p-3 rounded-2xl border transition-colors',
                alert.status === 'active' && 'bg-red-50/50 border-red-100',
                alert.status === 'monitoring' && 'bg-amber-50/50 border-amber-100',
                alert.status === 'resolved' && 'bg-emerald-50/50 border-emerald-100',
              )}
            >
              <div className={cn(
                'p-1.5 rounded-lg flex-shrink-0 mt-0.5',
                alert.status === 'active' && 'bg-red-100',
                alert.status === 'monitoring' && 'bg-amber-100',
                alert.status === 'resolved' && 'bg-emerald-100',
              )}>
                {alert.status === 'active' && <AlertTriangle className="w-4 h-4 text-red-600" />}
                {alert.status === 'monitoring' && <Eye className="w-4 h-4 text-amber-600" />}
                {alert.status === 'resolved' && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <h4 className="text-sm font-medium text-pure-dark">{alert.title}</h4>
                  <span className={cn(
                    'clay-badge text-[10px] flex-shrink-0',
                    alert.status === 'active' && 'bg-red-50 text-red-600',
                    alert.status === 'monitoring' && 'bg-amber-50 text-amber-600',
                    alert.status === 'resolved' && 'bg-emerald-50 text-emerald-600',
                  )}>
                    {alert.status === 'active' ? 'Active' : alert.status === 'monitoring' ? 'Monitoring' : 'Resolved'}
                  </span>
                </div>
                <p className="text-xs text-pure-muted mt-1">{alert.recommendation}</p>
                <p className="text-[10px] text-pure-muted mt-1">
                  {new Date(alert.timestamp).toLocaleString('id-ID')}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </ClayCard>
    </div>
  );
}
