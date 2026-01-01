// NeuroHarmonic - Card Component

import { motion, HTMLMotionProps } from 'framer-motion';
import { ReactNode } from 'react';

interface CardProps extends HTMLMotionProps<'div'> {
  children: ReactNode;
  variant?: 'default' | 'elevated' | 'glass' | 'gradient';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  interactive?: boolean;
  glowColor?: string;
  gradient?: string;
}

const paddingSizes = {
  none: '0',
  sm: 'var(--spacing-sm)',
  md: 'var(--spacing-md)',
  lg: 'var(--spacing-lg)'
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
  const baseStyles: React.CSSProperties = {
    borderRadius: 'var(--radius-lg)',
    padding: paddingSizes[padding],
    transition: 'all var(--transition-medium)'
  };

  const variantStyles: Record<string, React.CSSProperties> = {
    default: {
      background: 'var(--bg-secondary)',
      border: '1px solid var(--border-subtle)'
    },
    elevated: {
      background: 'var(--bg-secondary)',
      border: '1px solid var(--border-subtle)',
      boxShadow: 'var(--shadow-soft)'
    },
    glass: {
      background: 'var(--bg-glass)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      border: '1px solid var(--border-subtle)'
    },
    gradient: {
      background: gradient || 'linear-gradient(135deg, var(--bg-secondary) 0%, var(--bg-tertiary) 100%)',
      border: '1px solid var(--border-subtle)'
    }
  };

  const glowStyles: React.CSSProperties = glowColor ? {
    boxShadow: `0 0 20px ${glowColor}40, 0 0 40px ${glowColor}20`
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
