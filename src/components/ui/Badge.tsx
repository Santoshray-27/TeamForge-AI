import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'purple' | 'cyan';
  size?: 'sm' | 'md';
  dot?: boolean;
  className?: string;
}

const variants = {
  default: 'bg-white/10 text-gray-300 border border-white/20',
  success: 'bg-green-500/20 text-green-300 border border-green-500/30',
  warning: 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30',
  danger: 'bg-red-500/20 text-red-300 border border-red-500/30',
  info: 'bg-blue-500/20 text-blue-300 border border-blue-500/30',
  purple: 'bg-purple-500/20 text-purple-300 border border-purple-500/30',
  cyan: 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30',
};

const dotColors = {
  default: 'bg-gray-400',
  success: 'bg-green-400',
  warning: 'bg-yellow-400',
  danger: 'bg-red-400',
  info: 'bg-blue-400',
  purple: 'bg-purple-400',
  cyan: 'bg-cyan-400',
};

const sizes = {
  sm: 'px-2 py-0.5 text-xs rounded-full',
  md: 'px-3 py-1 text-xs rounded-full',
};

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  dot = false,
  className = '',
}) => {
  return (
    <span className={`inline-flex items-center gap-1.5 font-medium ${variants[variant]} ${sizes[size]} ${className}`}>
      {dot && (
        <span className={`w-1.5 h-1.5 rounded-full ${dotColors[variant]} animate-pulse`} />
      )}
      {children}
    </span>
  );
};
