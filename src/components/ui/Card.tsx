// NeuroHarmonic - Card Component

import { motion } from 'framer-motion';
import type { HTMLMotionProps } from 'framer-motion';
import type { ReactNode, CSSProperties } from 'react';

interface CardProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  children: ReactNode;
  variant?: 'default' | 'glass' | 'elevated' | 'gradient';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  interactive?: boolean;
  glowColor?: string;
  gradient?: string;
}

const paddingSizes: Record<string, string> = {
  none: '0',
  sm: 'var(--space-sm)',
  md: 'var(--space-md)',
  lg: 'var(--space-lg)'
};

export function Card({
  children,
  variant = 'default',
  padding = 'md',
  interactive = false,
  glowColor,
  gradient,
  style,
  ...props
}: CardProps) {
  const baseStyles: CSSProperties = {
    borderRadius: 'var(--radius-lg)',
    padding: paddingSizes[padding],
    transition: 'all var(--transition-base)'
  };

  const variantStyles: Record<string, CSSProperties> = {
    default: {
      background: 'var(--bg-tertiary)',
      border: '1px solid var(--border-subtle)'
    },
    glass: {
      background: 'var(--bg-glass)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      border: '1px solid var(--border-subtle)'
    },
    elevated: {
      background: 'var(--bg-elevated)',
      border: '1px solid var(--border-subtle)',
      boxShadow: 'var(--shadow-md)'
    },
    gradient: {
      background: gradient || 'linear-gradient(135deg, var(--bg-tertiary) 0%, var(--bg-elevated) 100%)',
      border: '1px solid var(--border-subtle)'
    }
  };

  const glowStyles: CSSProperties = glowColor ? {
    boxShadow: `0 0 30px ${glowColor}30, 0 0 60px ${glowColor}15`
  } : {};

  return (
    <motion.div
      whileHover={interactive ? { scale: 1.02, y: -2 } : undefined}
      whileTap={interactive ? { scale: 0.98 } : undefined}
      style={{
        ...baseStyles,
        ...variantStyles[variant],
        ...glowStyles,
        cursor: interactive ? 'pointer' : 'default',
        ...style
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
}
