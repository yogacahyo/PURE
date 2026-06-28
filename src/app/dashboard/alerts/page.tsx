'use client';

import { useState } from 'react';
import { ClayCard } from '@/components/ui/clay-card';
import { mockAlerts, parameterConfigs, type AlertItem } from '@/data/mock-data';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Bell, AlertTriangle, CheckCircle2, Eye, Filter } from 'lucide-react';

type TabFilter = 'all' | 'active' | 'resolved' | 'monitoring';
type LevelFilter = 'all' | 'critical' | 'warning' | 'info';

export default function AlertsPage() {
  const [tab, setTab] = useState<TabFilter>('all');
  const [levelFilter, setLevelFilter] = useState<LevelFilter>('all');

  const filtered = mockAlerts.filter(alert => {
    if (tab !== 'all' && alert.status !== tab) return false;
    if (levelFilter !== 'all' && alert.level !== levelFilter) return false;
    return true;
  });

  const counts = {
    all: mockAlerts.length,
    active: mockAlerts.filter(a => a.status === 'active').length,
    resolved: mockAlerts.filter(a => a.status === 'resolved').length,
    monitoring: mockAlerts.filter(a => a.status === 'monitoring').length,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-pure-dark">Alerts</h1>
        <p className="text-sm text-pure-muted mt-1">Daftar alarm dan notifikasi kualitas air</p>
      </div>

      {/* Tab Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="flex gap-1 p-1 rounded-xl bg-white/80 clay-card !p-1 !rounded-xl">
          {(['all', 'active', 'monitoring', 'resolved'] as TabFilter[]).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={cn(
                'px-3 py-2 rounded-lg text-xs font-medium transition-all capitalize',
                tab === t
                  ? 'bg-gradient-to-r from-pure-primary to-pure-cyan text-white shadow-sm'
                  : 'text-pure-muted hover:text-pure-dark',
              )}
            >
              {t} ({counts[t]})
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-pure-muted" />
          <div className="flex gap-1">
            {(['all', 'critical', 'warning', 'info'] as LevelFilter[]).map(level => (
              <button
                key={level}
                onClick={() => setLevelFilter(level)}
                className={cn(
                  'clay-badge text-xs capitalize cursor-pointer transition-all border',
                  levelFilter === level
                    ? level === 'critical' ? 'bg-red-50 text-red-600 border-red-200' :
                      level === 'warning' ? 'bg-amber-50 text-amber-600 border-amber-200' :
                      level === 'info' ? 'bg-blue-50 text-blue-600 border-blue-200' :
                      'bg-pure-primary/10 text-pure-primary border-pure-primary/20'
                    : 'bg-white text-pure-muted border-blue-50 hover:bg-pure-sky/30',
                )}
              >
                {level}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Alert List */}
      <div className="space-y-3">
        {filtered.length === 0 && (
          <ClayCard className="text-center py-12">
            <Bell className="w-12 h-12 text-pure-muted/30 mx-auto mb-3" />
            <p className="text-pure-muted">Tidak ada alert yang cocok dengan filter.</p>
          </ClayCard>
        )}

        {filtered.map((alert, i) => {
          const config = parameterConfigs.find(p => p.key === alert.parameter);
          return (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <ClayCard className={cn(
                'border-l-4',
                alert.level === 'critical' && 'border-l-red-400',
                alert.level === 'warning' && 'border-l-amber-400',
                alert.level === 'info' && 'border-l-blue-400',
              )}>
                <div className="flex items-start gap-3">
                  <div className={cn(
                    'p-2 rounded-xl flex-shrink-0',
                    alert.status === 'active' && 'bg-red-50',
                    alert.status === 'monitoring' && 'bg-amber-50',
                    alert.status === 'resolved' && 'bg-emerald-50',
                  )}>
                    {alert.status === 'active' && <AlertTriangle className="w-5 h-5 text-red-500" />}
                    {alert.status === 'monitoring' && <Eye className="w-5 h-5 text-amber-500" />}
                    {alert.status === 'resolved' && <CheckCircle2 className="w-5 h-5 text-emerald-500" />}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="font-semibold text-pure-dark">{alert.title}</h3>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className={cn(
                          'clay-badge text-[10px] uppercase tracking-wide border',
                          alert.level === 'critical' && 'bg-red-50 text-red-600 border-red-200',
                          alert.level === 'warning' && 'bg-amber-50 text-amber-600 border-amber-200',
                          alert.level === 'info' && 'bg-blue-50 text-blue-600 border-blue-200',
                        )}>
                          {alert.level}
                        </span>
                        <span className={cn(
                          'clay-badge text-[10px] border',
                          alert.status === 'active' && 'bg-red-50 text-red-600 border-red-200',
                          alert.status === 'monitoring' && 'bg-amber-50 text-amber-600 border-amber-200',
                          alert.status === 'resolved' && 'bg-emerald-50 text-emerald-600 border-emerald-200',
                        )}>
                          {alert.status}
                        </span>
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-2 mb-2 text-xs text-pure-muted">
                      <div>
                        <span>Parameter: </span>
                        <span className="font-medium text-pure-dark">{config?.name || alert.parameter}</span>
                      </div>
                      <div>
                        <span>Threshold: </span>
                        <span className="font-medium text-pure-dark">{alert.threshold}</span>
                      </div>
                      <div>
                        <span>Value: </span>
                        <span className="font-medium text-red-600">
                          {alert.value} {config?.unit || ''}
                        </span>
                      </div>
                      <div>
                        <span>Time: </span>
                        <span className="font-medium text-pure-dark">
                          {new Date(alert.timestamp).toLocaleString('id-ID')}
                        </span>
                      </div>
                    </div>

                    <div className="p-2 rounded-xl bg-pure-sky/30 text-xs text-pure-muted">
                      <strong className="text-pure-dark">Rekomendasi:</strong> {alert.recommendation}
                    </div>
                  </div>
                </div>
              </ClayCard>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
