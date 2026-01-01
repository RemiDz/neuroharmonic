// NeuroHarmonic - Button Component

import { motion, HTMLMotionProps } from 'framer-motion';
import { ReactNode } from 'react';

interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
  loading?: boolean;
  fullWidth?: boolean;
  glow?: boolean;
}

const variants = {
  primary: {
    background: 'linear-gradient(135deg, var(--accent-cyan) 0%, var(--accent-violet) 100%)',
    color: 'white',
    border: 'none',
    hoverFilter: 'brightness(1.1)',
    activeFiter: 'brightness(0.95)'
  },
  secondary: {
    background: 'var(--bg-tertiary)',
    color: 'var(--text-primary)',
    border: '1px solid var(--border-medium)',
    hoverFilter: 'brightness(1.2)',
    activeFilter: 'brightness(0.9)'
  },
  ghost: {
    background: 'transparent',
    color: 'var(--text-secondary)',
    border: '1px solid transparent',
    hoverFilter: 'none',
    activeFilter: 'none'
  },
  danger: {
    background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
    color: 'white',
    border: 'none',
    hoverFilter: 'brightness(1.1)',
    activeFilter: 'brightness(0.95)'
  }
};

const sizes = {
  sm: {
    padding: '8px 16px',
    fontSize: '0.875rem',
    gap: '6px',
    minHeight: '36px'
  },
  md: {
    padding: '12px 24px',
    fontSize: '1rem',
    gap: '8px',
    minHeight: '48px'
  },
  lg: {
    padding: '16px 32px',
    fontSize: '1.125rem',
    gap: '10px',
    minHeight: '56px'
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
  disabled,
  style,
  ...props
}: ButtonProps) {
  const variantStyles = variants[variant];
  const sizeStyles = sizes[size];

  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      disabled={disabled || loading}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: sizeStyles.gap,
        padding: sizeStyles.padding,
        fontSize: sizeStyles.fontSize,
        minHeight: sizeStyles.minHeight,
        fontFamily: 'var(--font-primary)',
        fontWeight: 500,
        borderRadius: 'var(--radius-md)',
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'all var(--transition-fast)',
        width: fullWidth ? '100%' : 'auto',
        background: variantStyles.background,
        color: variantStyles.color,
        border: variantStyles.border,
        opacity: disabled ? 0.5 : 1,
        boxShadow: glow ? 'var(--shadow-glow)' : 'none',
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
