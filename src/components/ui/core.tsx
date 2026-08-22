import React from 'react';
import { theme } from '../../styles/theme';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  ...props 
}) => {
  let vClass = '';
  if (variant === 'primary') vClass = `${theme.colors.primary} ${theme.colors.primaryHover}`;
  if (variant === 'secondary') vClass = `${theme.colors.secondary} ${theme.colors.secondaryHover}`;
  if (variant === 'danger') vClass = `${theme.colors.danger} ${theme.colors.dangerHover}`;
  if (variant === 'success') vClass = theme.colors.success;

  let sClass = '';
  if (size === 'sm') sClass = 'px-3 py-1.5 text-sm';
  if (size === 'md') sClass = 'px-4 py-2';
  if (size === 'lg') sClass = 'px-6 py-3 text-lg';

  const baseClass = `inline-flex items-center justify-center font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${theme.radius.md} ${theme.typography.body} ${theme.shadow.sm}`;

  return (
    <button className={`${baseClass} ${vClass} ${sClass} ${className}`} {...props}>
      {children}
    </button>
  );
};

export const Card: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, className = '', ...props }) => (
  <div className={`${theme.colors.surface} ${theme.radius.lg} ${theme.shadow.md} p-4 sm:p-6 ${className}`} {...props}>
    {children}
  </div>
);

export const Badge: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className = '' }) => (
  <span className={`inline-block px-2 py-0.5 ${theme.colors.background} ${theme.colors.textMuted} ${theme.radius.sm} text-xs font-bold ${className}`}>
    {children}
  </span>
);
