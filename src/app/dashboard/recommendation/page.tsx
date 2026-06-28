'use client';

import { useState, useMemo } from 'react';
import { useSensorData } from '@/context/sensor-context';
import { ClayCard } from '@/components/ui/clay-card';
import { StatusBadge, SensorIcon, PriorityBadge } from '@/components/ui/status-badge';
import { parameterConfigs, getParameterStatus } from '@/data/mock-data';
import { fishDatabase } from '@/data/fish-data';
import { getFishRecommendations, getGapAnalysis, getCorrectiveRecommendations } from '@/lib/dss-engine';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { CheckCircle2, XCircle, AlertCircle, Info, Target, Sparkles, AlertTriangle } from 'lucide-react';

export default function RecommendationPage() {
  const { current } = useSensorData();
  const [selectedFish, setSelectedFish] = useState<string>('');
  const recommendations = useMemo(() => getFishRecommendations(current), [current]);

  const targetFish = fishDatabase.find(f => f.id === selectedFish);
  const gapAnalysis = targetFish ? getGapAnalysis(targetFish, current) : null;
  const correctiveRecs = targetFish ? getCorrectiveRecommendations(targetFish, current) : null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-pure-dark">Fish Recommendation</h1>
        <p className="text-sm text-pure-muted mt-1">Decision Support System untuk rekomendasi jenis ikan</p>
      </div>

      {/* Current Water Profile */}
      <ClayCard variant="raised" noHover>
        <h3 className="text-lg font-semibold text-pure-dark mb-4">Current Water Profile</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {parameterConfigs.map((config) => {
            const value = current[config.key];
            const status = getParameterStatus(config.key, value);
            return (
              <div key={config.key} className="flex items-center gap-3 p-3 rounded-2xl bg-pure-sky/30 border border-blue-50">
                <SensorIcon icon={config.icon} className="w-10 h-10" />
                <div>
                  <p className="text-[10px] text-pure-muted">{config.name}</p>
                  <p className="text-sm font-bold text-pure-dark">
                    {value.toFixed(config.decimals)} {config.unit}
                  </p>
                  <StatusBadge status={status} className="mt-1 !text-[9px] !px-2 !py-0.5" />
                </div>
              </div>
            );
          })}
        </div>
      </ClayCard>

      {/* Fish Recommendation Ranking */}
      <div>
        <h3 className="text-lg font-semibold text-pure-dark mb-4">Rekomendasi Jenis Ikan</h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {recommendations.map((rec, i) => {
            const statusStyles = {
              'highly-recommended': { bg: 'bg-emerald-50 border-emerald-200', badge: 'bg-emerald-50 text-emerald-700', icon: <Sparkles className="w-3.5 h-3.5 inline-block -mt-0.5 mr-1" /> },
              'recommended': { bg: 'bg-blue-50 border-blue-200', badge: 'bg-blue-50 text-blue-700', icon: <CheckCircle2 className="w-3.5 h-3.5 inline-block -mt-0.5 mr-1" /> },
              'conditional': { bg: 'bg-amber-50 border-amber-200', badge: 'bg-amber-50 text-amber-700', icon: <AlertTriangle className="w-3.5 h-3.5 inline-block -mt-0.5 mr-1" /> },
              'not-recommended': { bg: 'bg-red-50 border-red-200', badge: 'bg-red-50 text-red-700', icon: <XCircle className="w-3.5 h-3.5 inline-block -mt-0.5 mr-1" /> },
            };
            const style = statusStyles[rec.status];

            return (
              <motion.div
                key={rec.fish.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
              >
                <ClayCard className="h-full">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <img src={rec.fish.image} alt={rec.fish.name} className="w-12 h-12 object-contain" />
                      <div>
                        <h4 className="font-semibold text-pure-dark">{rec.fish.name}</h4>
                        <p className="text-[10px] text-pure-muted italic">{rec.fish.scientificName}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-bold text-pure-primary">{rec.score}%</span>
                    </div>
                  </div>

                  {/* Score Bar */}
                  <div className="w-full h-2 rounded-full bg-pure-sky mb-3 overflow-hidden">
                    <motion.div
                      className={cn(
                        'h-full rounded-full',
                        rec.score >= 85 ? 'bg-emerald-500' :
                        rec.score >= 70 ? 'bg-blue-500' :
                        rec.score >= 50 ? 'bg-amber-500' : 'bg-red-500',
                      )}
                      initial={{ width: 0 }}
                      animate={{ width: `${rec.score}%` }}
                      transition={{ duration: 0.8, delay: i * 0.1 }}
                    />
                  </div>

                  <span className={cn('clay-badge text-xs mb-3 inline-block', style.badge)}>
                    {style.icon} {rec.statusLabel}
                  </span>

                  {/* Parameter Match */}
                  <div className="space-y-1.5 mb-3">
                    {rec.matchedParams.slice(0, 3).map(param => {
                      const config = parameterConfigs.find(p => p.key === param);
                      return (
                        <div key={param} className="flex items-center gap-1.5 text-xs text-emerald-600">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>{config?.name} — ideal</span>
                        </div>
                      );
                    })}
                    {rec.mismatchedParams.slice(0, 2).map(mp => {
                      const config = parameterConfigs.find(p => p.key === mp.key);
                      return (
                        <div key={mp.key} className="flex items-center gap-1.5 text-xs text-amber-600">
                          <AlertCircle className="w-3 h-3" />
                          <span>{config?.name} — perlu diperbaiki</span>
                        </div>
                      );
                    })}
                  </div>

                  <p className="text-xs text-pure-muted leading-relaxed">{rec.explanation}</p>
                </ClayCard>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* DSS Explanation */}
      <ClayCard variant="raised" noHover>
        <div className="flex items-center gap-3 mb-4">
          <div className="sensor-bubble bg-purple-50">
            <Info className="w-5 h-5 text-purple-500" />
          </div>
          <h3 className="text-lg font-semibold text-pure-dark">Why This Recommendation?</h3>
        </div>
        <div className="space-y-3 text-sm text-pure-muted">
          <p>Sistem PURE menghitung <strong className="text-pure-dark">fitness score</strong> berdasarkan kesesuaian parameter kualitas air dengan kebutuhan ideal setiap jenis ikan.</p>
          <div className="grid sm:grid-cols-2 gap-3">
            <div className="p-3 rounded-2xl bg-pure-sky/30 border border-blue-50">
              <p className="text-xs font-semibold text-pure-dark mb-2">Parameter Weights</p>
              <div className="space-y-1.5">
                {[
                  { name: 'Dissolved Oxygen', weight: '25%' },
                  { name: 'Amonia', weight: '25%' },
                  { name: 'pH', weight: '20%' },
                  { name: 'Suhu', weight: '15%' },
                  { name: 'Kekeruhan', weight: '10%' },
                  { name: 'TDS', weight: '5%' },
                ].map(p => (
                  <div key={p.name} className="flex justify-between text-xs">
                    <span>{p.name}</span>
                    <span className="font-medium text-pure-primary">{p.weight}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="p-3 rounded-2xl bg-pure-sky/30 border border-blue-50">
              <p className="text-xs font-semibold text-pure-dark mb-2">Scoring Method</p>
              <ul className="space-y-1 text-xs text-pure-muted">
                <li>• DO dan Amonia memiliki bobot tertinggi karena dampak langsung pada kelangsungan hidup ikan.</li>
                <li>• Parameter dalam rentang optimal mendapat skor 85–100%.</li>
                <li>• Parameter di luar rentang ideal mendapat penalti berdasarkan jarak dari rentang.</li>
                <li>• Skor akhir = rata-rata tertimbang semua parameter.</li>
              </ul>
            </div>
          </div>
        </div>
      </ClayCard>

      {/* Target Species Simulation */}
      <ClayCard variant="raised" noHover>
        <div className="flex items-center gap-3 mb-4">
          <div className="sensor-bubble bg-cyan-50">
            <Target className="w-5 h-5 text-cyan-500" />
          </div>
          <h3 className="text-lg font-semibold text-pure-dark">Target Species Simulation</h3>
        </div>

        <p className="text-sm text-pure-muted mb-4">
          Pilih jenis ikan target untuk melihat gap analysis dan tindakan korektif yang diperlukan.
        </p>

        {/* Fish Selector */}
        <div className="flex flex-wrap gap-2 mb-6">
          {fishDatabase.map(fish => (
            <button
              key={fish.id}
              onClick={() => setSelectedFish(fish.id === selectedFish ? '' : fish.id)}
              className={cn(
                'clay-button !px-4 !py-2 text-sm',
                selectedFish === fish.id
                  ? 'bg-gradient-to-r from-pure-primary to-pure-cyan text-white'
                  : 'bg-white text-pure-dark border border-blue-100',
              )}
            >
              <img src={fish.image} alt={fish.name} className="w-5 h-5 object-contain inline-block mr-2" />
              {fish.name}
            </button>
          ))}
        </div>

        {/* Gap Analysis */}
        {targetFish && gapAnalysis && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <h4 className="font-semibold text-pure-dark">
              Gap Analysis: <img src={targetFish.image} alt={targetFish.name} className="w-6 h-6 object-contain inline-block mr-2 align-middle" /> {targetFish.name}
            </h4>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {gapAnalysis.map(gap => (
                <div
                  key={gap.parameter}
                  className={cn(
                    'p-3 rounded-2xl border',
                    gap.isInRange ? 'bg-emerald-50/50 border-emerald-100' : 'bg-amber-50/50 border-amber-100',
                  )}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-pure-dark">{gap.parameterName}</span>
                    {gap.isInRange 
                      ? <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      : <XCircle className="w-4 h-4 text-amber-500" />
                    }
                  </div>
                  <div className="text-xs text-pure-muted">
                    <div className="flex justify-between">
                      <span>Aktual:</span>
                      <span className="font-medium text-pure-dark">{gap.currentValue} {gap.unit}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Ideal:</span>
                      <span className="font-medium">{gap.idealMin}–{gap.idealMax} {gap.unit}</span>
                    </div>
                    {!gap.isInRange && (
                      <div className="flex justify-between text-amber-600 mt-1">
                        <span>Gap:</span>
                        <span className="font-medium">{gap.direction === 'low' ? '↓' : '↑'} {gap.gap} {gap.unit}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Corrective Actions */}
            {correctiveRecs && correctiveRecs.length > 0 && (
              <div className="mt-4">
                <h4 className="font-semibold text-pure-dark mb-3">Rekomendasi Tindakan Korektif</h4>
                <div className="space-y-3">
                  {correctiveRecs.map(rec => (
                    <div key={rec.parameter} className="p-4 rounded-2xl bg-white border border-blue-50">
                      <div className="flex items-center gap-2 mb-2">
                        <PriorityBadge priority={rec.priority} />
                        <span className="text-sm font-medium text-pure-dark">{rec.parameterName}</span>
                      </div>
                      <ol className="space-y-1">
                        {rec.actions.map((action, i) => (
                          <li key={i} className="flex items-start gap-2 text-xs text-pure-muted">
                            <span className="font-medium text-pure-primary mt-px">{i + 1}.</span>
                            {action}
                          </li>
                        ))}
                      </ol>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {correctiveRecs && correctiveRecs.length === 0 && (
              <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100 text-center">
                <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                <p className="text-sm font-medium text-emerald-700">
                  Semua parameter sudah ideal untuk {targetFish.name}! 🎉
                </p>
                <p className="text-xs text-emerald-600 mt-1">
                  Kondisi air siap untuk penebaran benih.
                </p>
              </div>
            )}
          </motion.div>
        )}
      </ClayCard>
    </div>
  );
}
