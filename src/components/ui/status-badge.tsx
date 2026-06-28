'use client';

import { cn } from '@/lib/utils';
import type { StatusLevel, TrendDirection } from '@/data/mock-data';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import {
  Thermometer,
  FlaskConical,
  Wind,
  AlertTriangle,
  Waves,
  Zap,
} from 'lucide-react';

// ============================================
// Status Badge
// ============================================

const statusStyles: Record<StatusLevel, { bg: string; text: string; label: string }> = {
  optimal: { bg: 'bg-emerald-50 border-emerald-200', text: 'text-emerald-700', label: 'Optimal' },
  normal: { bg: 'bg-blue-50 border-blue-200', text: 'text-blue-700', label: 'Normal' },
  warning: { bg: 'bg-amber-50 border-amber-200', text: 'text-amber-700', label: 'Waspada' },
  critical: { bg: 'bg-red-50 border-red-200', text: 'text-red-700', label: 'Kritis' },
};

export function StatusBadge({ status, className }: { status: StatusLevel; className?: string }) {
  const style = statusStyles[status];
  return (
    <span
      className={cn(
        'clay-badge border',
        style.bg,
        style.text,
        className
      )}
    >
      <span className={cn(
        'inline-block w-1.5 h-1.5 rounded-full mr-1.5',
        status === 'optimal' && 'bg-emerald-500',
        status === 'normal' && 'bg-blue-500',
        status === 'warning' && 'bg-amber-500',
        status === 'critical' && 'bg-red-500 animate-pulse',
      )} />
      {style.label}
    </span>
  );
}

// ============================================
// Trend Indicator
// ============================================

const trendConfig: Record<TrendDirection, { icon: typeof TrendingUp; color: string; label: string }> = {
  up: { icon: TrendingUp, color: 'text-rose-500', label: 'Naik' },
  down: { icon: TrendingDown, color: 'text-blue-500', label: 'Turun' },
  stable: { icon: Minus, color: 'text-slate-400', label: 'Stabil' },
};

export function TrendIndicator({ trend, className }: { trend: TrendDirection; className?: string }) {
  const config = trendConfig[trend];
  const Icon = config.icon;
  return (
    <span className={cn('inline-flex items-center gap-1 text-xs font-medium', config.color, className)}>
      <Icon className="w-3.5 h-3.5" />
      {config.label}
    </span>
  );
}

// ============================================
// Sensor Icon
// ============================================

const iconMap: Record<string, typeof Thermometer> = {
  Thermometer,
  FlaskConical,
  Wind,
  AlertTriangle,
  Waves,
  Zap,
};

const sensorColors: Record<string, { bg: string; icon: string }> = {
  Thermometer: { bg: 'bg-orange-50', icon: 'text-orange-500' },
  FlaskConical: { bg: 'bg-purple-50', icon: 'text-purple-500' },
  Wind: { bg: 'bg-cyan-50', icon: 'text-cyan-500' },
  AlertTriangle: { bg: 'bg-red-50', icon: 'text-red-500' },
  Waves: { bg: 'bg-blue-50', icon: 'text-blue-500' },
  Zap: { bg: 'bg-amber-50', icon: 'text-amber-500' },
};

export function SensorIcon({ icon, className }: { icon: string; className?: string }) {
  const IconComponent = iconMap[icon] || Waves;
  const colors = sensorColors[icon] || { bg: 'bg-blue-50', icon: 'text-blue-500' };
  
  return (
    <div className={cn('sensor-bubble', colors.bg, className)}>
      <IconComponent className={cn('w-5 h-5', colors.icon)} />
    </div>
  );
}

// ============================================
// Connection Status
// ============================================

export function ConnectionStatus({ status }: { status: 'connected' | 'reconnecting' | 'disconnected' }) {
  const configs = {
    connected: { color: 'bg-emerald-500', text: 'text-emerald-700', label: 'MQTT Connected', pulse: true },
    reconnecting: { color: 'bg-amber-500', text: 'text-amber-700', label: 'Reconnecting...', pulse: true },
    disconnected: { color: 'bg-red-500', text: 'text-red-700', label: 'Disconnected', pulse: false },
  };
  const config = configs[status];
  
  return (
    <div className="flex items-center gap-2">
      <span className="relative flex h-2.5 w-2.5">
        {config.pulse && (
          <span className={cn('animate-ping absolute inline-flex h-full w-full rounded-full opacity-75', config.color)} />
        )}
        <span className={cn('relative inline-flex rounded-full h-2.5 w-2.5', config.color)} />
      </span>
      <span className={cn('text-xs font-medium', config.text)}>{config.label}</span>
    </div>
  );
}

// ============================================
// Priority Badge
// ============================================

export function PriorityBadge({ priority }: { priority: 'urgent' | 'important' | 'monitoring' }) {
  const styles = {
    urgent: 'bg-red-50 text-red-700 border-red-200',
    important: 'bg-amber-50 text-amber-700 border-amber-200',
    monitoring: 'bg-blue-50 text-blue-700 border-blue-200',
  };
  const labels = {
    urgent: 'Urgent',
    important: 'Important',
    monitoring: 'Monitoring',
  };

  return (
    <span className={cn('clay-badge border font-semibold uppercase tracking-wide text-[10px]', styles[priority])}>
      {labels[priority]}
    </span>
  );
}
