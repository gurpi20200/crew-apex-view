import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";

interface RealTimeCounterProps {
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  duration?: number;
  className?: string;
  trend?: 'up' | 'down' | 'neutral';
  highlightChange?: boolean;
  formatType?: 'currency' | 'percentage' | 'number';
}

export function RealTimeCounter({
  value,
  prefix = "",
  suffix = "",
  decimals = 0,
  duration = 1000,
  className = "",
  trend = 'neutral',
  highlightChange = false,
  formatType = 'number'
}: RealTimeCounterProps) {
  const [displayValue, setDisplayValue] = useState(value);
  const [isAnimating, setIsAnimating] = useState(false);
  const previousValue = useRef(value);

  useEffect(() => {
    if (previousValue.current !== value) {
      setIsAnimating(true);
      previousValue.current = value;
    }

    const startValue = displayValue;
    const endValue = value;
    const startTime = Date.now();

    const updateValue = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function for smooth animation
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      
      const currentValue = startValue + (endValue - startValue) * easeProgress;
      setDisplayValue(currentValue);

      if (progress < 1) {
        requestAnimationFrame(updateValue);
      } else {
        setIsAnimating(false);
      }
    };

    requestAnimationFrame(updateValue);
  }, [value, duration, displayValue]);

  const formatValue = (val: number) => {
    switch (formatType) {
      case 'currency':
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals,
        }).format(val);
      case 'percentage':
        return `${val.toFixed(decimals)}%`;
      default:
        return val.toFixed(decimals);
    }
  };

  const getTrendColor = () => {
    switch (trend) {
      case 'up':
        return 'text-profit';
      case 'down':
        return 'text-loss';
      default:
        return '';
    }
  };

  return (
    <motion.span
      className={`${className} ${getTrendColor()} ${highlightChange && isAnimating ? 'animate-pulse' : ''}`}
      initial={{ scale: 1 }}
      animate={{ 
        scale: isAnimating ? [1, 1.05, 1] : 1,
        color: isAnimating && highlightChange ? ['currentColor', '#22c55e', 'currentColor'] : 'currentColor'
      }}
      transition={{ duration: 0.3 }}
    >
      {prefix}{formatValue(displayValue)}{suffix}
    </motion.span>
  );
}