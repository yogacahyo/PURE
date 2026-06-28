'use client';

import { cn } from '@/lib/utils';
import { motion, type HTMLMotionProps } from 'framer-motion';
import React from 'react';

type ClayVariant = 'default' | 'raised' | 'floating' | 'glass';

interface ClayCardProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  variant?: ClayVariant;
  children: React.ReactNode;
  className?: string;
  noPadding?: boolean;
  noHover?: boolean;
}

const variantClasses: Record<ClayVariant, string> = {
  default: 'clay-card',
  raised: 'clay-raised',
  floating: 'clay-floating',
  glass: 'clay-card backdrop-blur-md bg-white/60',
};

export function ClayCard({
  variant = 'default',
  children,
  className,
  noPadding = false,
  noHover = false,
  ...motionProps
}: ClayCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      whileHover={noHover ? undefined : { y: -2, transition: { duration: 0.2 } }}
      className={cn(
        variantClasses[variant],
        !noPadding && 'p-6',
        className
      )}
      {...motionProps}
    >
      {children}
    </motion.div>
  );
}
