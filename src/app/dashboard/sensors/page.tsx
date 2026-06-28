'use client';

import { useSensorData } from '@/context/sensor-context';
import { ClayCard } from '@/components/ui/clay-card';
import { StatusBadge, TrendIndicator, SensorIcon } from '@/components/ui/status-badge';
import { RealtimeChart } from '@/components/charts/realtime-chart';
import { parameterConfigs, getParameterStatus, getTrend, type ParameterKey } from '@/data/mock-data';
import { motion } from 'framer-motion';

export default function SensorsPage() {
  const { current, history } = useSensorData();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-pure-dark">Sensor Details</h1>
        <p className="text-sm text-pure-muted mt-1">Detail pembacaan setiap sensor kualitas air</p>
      </div>

      {/* Individual Sensor Charts */}
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
            transition={{ delay: i * 0.08 }}
          >
            <ClayCard variant="raised" noHover>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <div className="flex items-center gap-3">
                  <SensorIcon icon={config.icon} />
                  <div>
                    <h3 className="font-semibold text-pure-dark">{config.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-2xl font-bold text-pure-dark">
                        {value.toFixed(config.decimals)}
                      </span>
                      {config.unit && (
                        <span className="text-sm text-pure-muted">{config.unit}</span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <TrendIndicator trend={trend} />
                  <StatusBadge status={status} />
                </div>
              </div>

              {/* Parameter-specific chart */}
              <RealtimeChart
                history={history}
                parameters={[config.key]}
                className="!p-0 !shadow-none !bg-transparent !border-0"
              />

              {/* Range Info */}
              <div className="grid grid-cols-3 gap-2 mt-4 text-xs">
                <div className="p-2 rounded-xl bg-emerald-50/50 text-center">
                  <p className="text-emerald-600 font-medium">Optimal</p>
                  <p className="text-pure-dark">{config.optimalMin} – {config.optimalMax}</p>
                </div>
                <div className="p-2 rounded-xl bg-amber-50/50 text-center">
                  <p className="text-amber-600 font-medium">Warning</p>
                  <p className="text-pure-dark">{config.warningMin} – {config.warningMax}</p>
                </div>
                <div className="p-2 rounded-xl bg-red-50/50 text-center">
                  <p className="text-red-600 font-medium">Critical</p>
                  <p className="text-pure-dark">&lt;{config.criticalMin} / &gt;{config.criticalMax}</p>
                </div>
              </div>
            </ClayCard>
          </motion.div>
        );
      })}
    </div>
  );
}
