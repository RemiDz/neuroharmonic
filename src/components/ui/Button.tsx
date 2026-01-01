// NeuroHarmonic - Button Component

import { motion } from 'framer-motion';
import type { HTMLMotionProps } from 'framer-motion';
import type { ReactNode, CSSProperties } from 'react';

interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
  loading?: boolean;
  fullWidth?: boolean;
  glow?: boolean;
  gradient?: string;
}

const sizeStyles: Record<string, CSSProperties & { fontSize: string; gap: string }> = {
  sm: { padding: '8px 16px', fontSize: '0.85rem', gap: '6px', minHeight: '36px' },
  md: { padding: '12px 24px', fontSize: '0.95rem', gap: '8px', minHeight: '48px' },
  lg: { padding: '16px 32px', fontSize: '1rem', gap: '10px', minHeight: '56px' },
  xl: { padding: '20px 40px', fontSize: '1.1rem', gap: '12px', minHeight: '64px' }
};

const variantStyles: Record<string, { background: string; color: string; border: string }> = {
  primary: {
    background: 'linear-gradient(135deg, var(--accent-cyan) 0%, var(--accent-violet) 100%)',
    color: '#000000',
    border: 'none'
  },
  secondary: {
    background: 'var(--bg-elevated)',
    color: 'var(--text-primary)',
    border: '1px solid var(--border-medium)'
  },
  ghost: {
    background: 'transparent',
    color: 'var(--text-secondary)',
    border: '1px solid transparent'
  },
  danger: {
    background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
    color: '#FFFFFF',
    border: 'none'
  },
  success: {
    background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
    color: '#FFFFFF',
    border: 'none'
  }
};

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'left',
  loading = false,
  fullWidth = false,
  glow = false,
  gradient,
  disabled,
  style,
  ...props
}: ButtonProps) {
  const sizeStyle = sizeStyles[size];
  const variantStyle = variantStyles[variant];

  return (
    <motion.button
      whileHover={{ scale: disabled || loading ? 1 : 1.02 }}
      whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
      disabled={disabled || loading}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: sizeStyle.gap,
        padding: sizeStyle.padding,
        fontSize: sizeStyle.fontSize,
        minHeight: sizeStyle.minHeight,
        fontFamily: 'var(--font-sans)',
        fontWeight: 600,
        borderRadius: 'var(--radius-lg)',
        cursor: disabled || loading ? 'not-allowed' : 'pointer',
        transition: 'all var(--transition-fast)',
        width: fullWidth ? '100%' : 'auto',
        background: gradient || variantStyle.background,
        color: variantStyle.color,
        border: variantStyle.border,
        opacity: disabled ? 0.4 : 1,
        boxShadow: glow ? 'var(--shadow-glow-cyan)' : 'none',
        flexDirection: iconPosition === 'right' ? 'row-reverse' : 'row',
        ...style
      }}
      {...props}
    >
      {loading ? (
        <motion.span
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          style={{
            width: '1em',
            height: '1em',
            border: '2px solid currentColor',
            borderTopColor: 'transparent',
            borderRadius: '50%'
          }}
        />
      ) : icon ? (
        <span style={{ display: 'flex', alignItems: 'center' }}>{icon}</span>
      ) : null}
      {children}
    </motion.button>
  );
}
