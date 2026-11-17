import React from 'react';
import { motion } from 'motion/react';

/**
 * Calm, organic settling deceleration curve with zero bounce/overshoot.
 */
export const BREATH_EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Shared site-wide route / view cross-fade transition.
 */
export const PAGE_BREATH_INITIAL = { opacity: 0, y: 10 } as const;
export const PAGE_BREATH_ANIMATE = {
  opacity: 1,
  y: 0,
  transition: { duration: 0.42, ease: BREATH_EASE },
} as const;
export const PAGE_BREATH_EXIT = {
  opacity: 0,
  y: -8,
  transition: { duration: 0.24, ease: BREATH_EASE },
} as const;

interface BreathRevealProps {
  enabled?: boolean;
  delay?: number;
  yOffset?: number;
  duration?: number;
  className?: string;
  children: React.ReactNode;
}

export const BreathReveal: React.FC<BreathRevealProps> = ({
  enabled = true,
  delay = 0,
  yOffset = 14,
  duration = 0.62,
  className = '',
  children,
}) => {
  if (!enabled) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: yOffset }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -45px 0px' }}
      transition={{ duration, delay, ease: BREATH_EASE }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

interface BreathHairlineProps {
  enabled?: boolean;
  delay?: number;
  duration?: number;
  origin?: 'left' | 'center' | 'right';
  className?: string;
}

export const BreathHairline: React.FC<BreathHairlineProps> = ({
  enabled = true,
  delay = 0.08,
  duration = 0.65,
  origin = 'left',
  className = 'w-full h-px bg-stone-200/80',
}) => {
  const originClass =
    origin === 'center'
      ? 'origin-center'
      : origin === 'right'
      ? 'origin-right'
      : 'origin-left';

  if (!enabled) {
    return <div className={className} aria-hidden="true" />;
  }

  return (
    <motion.div
      initial={{ scaleX: 0, opacity: 0.4 }}
      whileInView={{ scaleX: 1, opacity: 1 }}
      viewport={{ once: true, margin: '0px 0px -40px 0px' }}
      transition={{ duration, delay, ease: BREATH_EASE }}
      className={`${className} ${originClass} will-change-transform`}
      aria-hidden="true"
    />
  );
};
