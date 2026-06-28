'use client';

import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface WaterQualityScoreProps {
  score: number;
  status: 'excellent' | 'good' | 'warning' | 'critical';
  statusLabel: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const statusColors = {
  excellent: { stroke: '#10B981', bg: 'bg-emerald-50', text: 'text-emerald-600' },
  good: { stroke: '#0E8FEA', bg: 'bg-blue-50', text: 'text-blue-600' },
  warning: { stroke: '#F59E0B', bg: 'bg-amber-50', text: 'text-amber-600' },
  critical: { stroke: '#EF4444', bg: 'bg-red-50', text: 'text-red-600' },
};

const sizes = {
  sm: { container: 'w-24 h-24', text: 'text-xl', label: 'text-[10px]', strokeWidth: 6, radius: 40 },
  md: { container: 'w-36 h-36', text: 'text-3xl', label: 'text-xs', strokeWidth: 8, radius: 58 },
  lg: { container: 'w-48 h-48', text: 'text-4xl', label: 'text-sm', strokeWidth: 10, radius: 78 },
};

export function WaterQualityScore({
  score,
  status,
  statusLabel,
  size = 'md',
  className,
}: WaterQualityScoreProps) {
  const colors = statusColors[status];
  const sizeConfig = sizes[size];
  const circumference = 2 * Math.PI * sizeConfig.radius;
  const dashOffset = circumference - (score / 100) * circumference;
  const viewBox = size === 'sm' ? '0 0 96 96' : size === 'md' ? '0 0 144 144' : '0 0 192 192';
  const center = size === 'sm' ? 48 : size === 'md' ? 72 : 96;

  return (
    <div className={cn('flex flex-col items-center gap-2', className)}>
      <div className={cn('relative', sizeConfig.container)}>
        <svg className="w-full h-full -rotate-90" viewBox={viewBox}>
          {/* Background circle */}
          <circle
            cx={center}
            cy={center}
            r={sizeConfig.radius}
            fill="none"
            stroke="#E8F4FD"
            strokeWidth={sizeConfig.strokeWidth}
          />
          {/* Progress circle */}
          <motion.circle
            cx={center}
            cy={center}
            r={sizeConfig.radius}
            fill="none"
            stroke={colors.stroke}
            strokeWidth={sizeConfig.strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: dashOffset }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
          />
        </svg>
        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            className={cn('font-bold', sizeConfig.text, colors.text)}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            {score}
          </motion.span>
          <span className={cn('text-pure-muted font-medium', sizeConfig.label)}>/100</span>
        </div>
      </div>
      <span className={cn(
        'clay-badge border font-semibold',
        colors.text,
        colors.bg,
        status === 'excellent' && 'border-emerald-200',
        status === 'good' && 'border-blue-200',
        status === 'warning' && 'border-amber-200',
        status === 'critical' && 'border-red-200',
      )}>
        {statusLabel}
      </span>
    </div>
  );
}
