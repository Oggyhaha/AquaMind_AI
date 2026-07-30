import React, { useState, useEffect, useRef } from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

export interface AnimatedKPIProps {
  label: string;
  value: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
  trend?: string;
  trendPositive?: boolean;
  icon?: React.ReactNode;
  sparklineData?: number[];
  className?: string;
}

export const AnimatedKPI: React.FC<AnimatedKPIProps> = ({
  label,
  value,
  suffix = '',
  prefix = '',
  decimals = 0,
  trend,
  trendPositive = true,
  icon,
  sparklineData,
  className = '',
}) => {
  const [displayValue, setDisplayValue] = useState<number>(0);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const startValue = 0;
    const endValue = value;
    const duration = 1500; // ~1.5s animation
    let startTime: number | null = null;

    // easeOutExpo easing function: 1 - 2^(-10 * x)
    const easeOutExpo = (x: number): number => {
      return x === 1 ? 1 : 1 - Math.pow(2, -10 * x);
    };

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutExpo(progress);

      const current = startValue + (endValue - startValue) * easedProgress;
      setDisplayValue(current);

      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(step);
      }
    };

    animationFrameRef.current = requestAnimationFrame(step);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [value]);

  const generateSparklinePoints = (data: number[]): string => {
    if (!data || data.length === 0) return '';
    if (data.length === 1) return '0,10 50,10';

    const width = 50;
    const height = 20;
    const paddingY = 3;
    const paddingX = 2;

    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min === 0 ? 1 : max - min;

    const usableWidth = width - paddingX * 2;
    const usableHeight = height - paddingY * 2;

    return data
      .map((val, index) => {
        const x = paddingX + (index / (data.length - 1)) * usableWidth;
        const y = height - paddingY - ((val - min) / range) * usableHeight;
        return `${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(' ');
  };

  const formatValue = (num: number): string => {
    return num.toLocaleString('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
  };

  const isPositive = trendPositive !== false;

  return (
    <div
      className={`rounded-3xl border shadow-xs p-5 space-y-1 bg-white border-slate-200/80 text-slate-900 dark:bg-slate-900/80 dark:border-slate-800 dark:text-white transition-all duration-300 hover:shadow-md dark:hover:border-slate-700/80 ${className}`}
    >
      {/* Header: Label (top left) & Icon (top right) */}
      <div className="flex items-center justify-between gap-2">
        <span className="uppercase text-xs font-extrabold text-slate-400 dark:text-slate-500 tracking-wider">
          {label}
        </span>
        {icon && (
          <div className="p-2 rounded-2xl bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 shrink-0">
            {icon}
          </div>
        )}
      </div>

      {/* Animated Value */}
      <div className="text-3xl font-black tracking-tight text-slate-900 dark:text-white flex items-baseline gap-1 my-1">
        {prefix && (
          <span className="text-2xl font-bold text-slate-500 dark:text-slate-400">
            {prefix}
          </span>
        )}
        <span>{formatValue(displayValue)}</span>
        {suffix && (
          <span className="text-lg font-bold text-slate-500 dark:text-slate-400">
            {suffix}
          </span>
        )}
      </div>

      {/* Bottom Section: Trend Badge & Inline Sparkline Chart */}
      {(trend || (sparklineData && sparklineData.length > 0)) && (
        <div className="flex items-center justify-between gap-2 pt-1">
          {trend ? (
            <div
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold border ${
                isPositive
                  ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50/80 dark:bg-emerald-950/40 border-emerald-200/60 dark:border-emerald-800/50'
                  : 'text-red-600 dark:text-red-400 bg-red-50/80 dark:bg-red-950/40 border-red-200/60 dark:border-red-800/50'
              }`}
            >
              {isPositive ? (
                <ArrowUpRight className="w-3.5 h-3.5 shrink-0" />
              ) : (
                <ArrowDownRight className="w-3.5 h-3.5 shrink-0" />
              )}
              <span>{trend}</span>
            </div>
          ) : (
            <div />
          )}

          {sparklineData && sparklineData.length > 0 && (
            <div className="flex items-center shrink-0">
              <svg
                width="50"
                height="20"
                viewBox="0 0 50 20"
                className="overflow-visible shrink-0"
                aria-label="Sparkline trend chart"
              >
                <polyline
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points={generateSparklinePoints(sparklineData)}
                  className={
                    isPositive
                      ? 'text-emerald-500 dark:text-emerald-400'
                      : 'text-red-500 dark:text-red-400'
                  }
                />
              </svg>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AnimatedKPI;
