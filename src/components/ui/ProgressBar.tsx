import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface ProgressBarProps {
  value: number;
  max?: number;
  label?: string;
  showValue?: boolean;
  color?: 'indigo' | 'green' | 'yellow' | 'red' | 'cyan' | 'purple' | 'gradient';
  size?: 'sm' | 'md' | 'lg';
  animate?: boolean;
  className?: string;
}

const colorMap = {
  indigo: 'bg-indigo-500',
  green: 'bg-green-500',
  yellow: 'bg-yellow-500',
  red: 'bg-red-500',
  cyan: 'bg-cyan-500',
  purple: 'bg-purple-500',
  gradient: 'bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500',
};

const sizeMap = {
  sm: 'h-1.5',
  md: 'h-2.5',
  lg: 'h-4',
};

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  label,
  showValue = false,
  color = 'gradient',
  size = 'md',
  animate = true,
  className = '',
}) => {
  const [width, setWidth] = useState(animate ? 0 : (value / max) * 100);

  useEffect(() => {
    if (animate) {
      const timer = setTimeout(() => {
        setWidth((value / max) * 100);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [value, max, animate]);

  const percentage = Math.round((value / max) * 100);

  const getColorByValue = () => {
    if (color !== 'gradient' && color !== 'indigo') return colorMap[color];
    if (percentage >= 75) return 'bg-gradient-to-r from-green-500 to-emerald-400';
    if (percentage >= 50) return 'bg-gradient-to-r from-indigo-500 to-purple-400';
    if (percentage >= 25) return 'bg-gradient-to-r from-yellow-500 to-orange-400';
    return 'bg-gradient-to-r from-red-500 to-rose-400';
  };

  return (
    <div className={`${className}`}>
      {(label || showValue) && (
        <div className="flex items-center justify-between mb-1.5">
          {label && <span className="text-sm text-gray-400">{label}</span>}
          {showValue && <span className="text-sm font-semibold text-white">{percentage}%</span>}
        </div>
      )}
      <div className={`w-full bg-white/10 rounded-full overflow-hidden ${sizeMap[size]}`}>
        <motion.div
          className={`h-full rounded-full ${color === 'gradient' ? getColorByValue() : colorMap[color]}`}
          initial={{ width: animate ? '0%' : `${width}%` }}
          animate={{ width: `${width}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
};
