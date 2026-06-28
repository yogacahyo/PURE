'use client';

import { ClayCard } from '@/components/ui/clay-card';
import { PriorityBadge, SensorIcon } from '@/components/ui/status-badge';
import { mockCorrectiveActions, parameterConfigs } from '@/data/mock-data';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Wrench, CheckCircle2, AlertTriangle, Info } from 'lucide-react';

export default function ActionsPage() {
  const activeActions = mockCorrectiveActions.filter(a => a.isActive);
  const inactiveActions = mockCorrectiveActions.filter(a => !a.isActive);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-pure-dark">Corrective Actions</h1>
        <p className="text-sm text-pure-muted mt-1">Tindakan korektif berdasarkan kondisi parameter kualitas air</p>
      </div>

      {/* Active Actions */}
      {activeActions.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            <h2 className="text-lg font-semibold text-pure-dark">Tindakan Aktif</h2>
            <span className="clay-badge bg-red-50 text-red-600 border border-red-200 text-xs">
              {activeActions.length} items
            </span>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {activeActions.map((action, i) => {
              const config = parameterConfigs.find(p => p.key === action.parameter);
              return (
                <motion.div
                  key={action.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                >
                  <ClayCard className="h-full border-l-4 border-l-red-400">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <SensorIcon icon={config?.icon || 'Waves'} />
                        <div>
                          <h3 className="font-semibold text-pure-dark text-sm">{action.condition}</h3>
                          <p className="text-xs text-pure-muted">
                            Aktual: <span className="font-medium text-red-600">{action.currentValue} {config?.unit}</span>
                          </p>
                        </div>
                      </div>
                      <PriorityBadge priority={action.priority} />
                    </div>

                    <div className="space-y-2 mb-3">
                      {action.actions.map((step, j) => (
                        <div key={j} className="flex items-start gap-2 text-sm text-pure-dark">
                          <span className="flex items-center justify-center w-5 h-5 rounded-lg bg-pure-primary/10 text-pure-primary text-xs font-bold flex-shrink-0 mt-0.5">
                            {j + 1}
                          </span>
                          {step}
                        </div>
                      ))}
                    </div>

                    {action.notes && (
                      <div className="flex items-start gap-2 p-3 rounded-xl bg-amber-50/50 border border-amber-100 text-xs text-amber-700">
                        <Info className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                        {action.notes}
                      </div>
                    )}
                  </ClayCard>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {/* Inactive / Monitoring Actions */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <CheckCircle2 className="w-5 h-5 text-emerald-500" />
          <h2 className="text-lg font-semibold text-pure-dark">Panduan Pencegahan</h2>
          <span className="clay-badge bg-blue-50 text-blue-600 border border-blue-200 text-xs">
            {inactiveActions.length} items
          </span>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          {inactiveActions.map((action, i) => {
            const config = parameterConfigs.find(p => p.key === action.parameter);
            return (
              <motion.div
                key={action.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
              >
                <ClayCard className="h-full opacity-80">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <SensorIcon icon={config?.icon || 'Waves'} />
                      <div>
                        <h3 className="font-semibold text-pure-dark text-sm">{action.condition}</h3>
                        <p className="text-xs text-pure-muted">Threshold: {action.threshold}</p>
                      </div>
                    </div>
                    <PriorityBadge priority={action.priority} />
                  </div>

                  <div className="space-y-2">
                    {action.actions.map((step, j) => (
                      <div key={j} className="flex items-start gap-2 text-sm text-pure-muted">
                        <span className="flex items-center justify-center w-5 h-5 rounded-lg bg-pure-sky text-pure-muted text-xs font-bold flex-shrink-0 mt-0.5">
                          {j + 1}
                        </span>
                        {step}
                      </div>
                    ))}
                  </div>
                </ClayCard>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
