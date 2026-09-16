"use client";

import * as React from "react";
import { motion } from "framer-motion";

interface MatchScoreRingProps {
  score: number; // 0 - 100
  size?: number; // default 54
  strokeWidth?: number; // default 4
  showLabel?: boolean;
}

export function MatchScoreRing({
  score,
  size = 56,
  strokeWidth = 4,
  showLabel = true,
}: MatchScoreRingProps) {
  const normalizedScore = Math.max(0, Math.min(100, Math.round(score)));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (normalizedScore / 100) * circumference;

  // Dynamic color palette based on match score
  let strokeColor = "#10b981"; // emerald-500 (80%+)
  let textColor = "text-emerald-600 dark:text-emerald-400";
  let badgeLabel = "Strong Match";

  if (normalizedScore < 60) {
    strokeColor = "#f43f5e"; // rose-500
    textColor = "text-rose-600 dark:text-rose-400";
    badgeLabel = "Low Match";
  } else if (normalizedScore < 72) {
    strokeColor = "#f59e0b"; // amber-500
    textColor = "text-amber-600 dark:text-amber-400";
    badgeLabel = "Good Match";
  } else if (normalizedScore < 85) {
    strokeColor = "#6366f1"; // indigo-500
    textColor = "text-indigo-600 dark:text-indigo-400";
    badgeLabel = "High Match";
  }

  return (
    <div className="flex items-center gap-2" title={`AI Match Score: ${normalizedScore}%`}>
      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="-rotate-90 transform"
        >
          {/* Background circle track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className="text-slate-100 dark:text-slate-800/80"
            fill="transparent"
          />
          {/* Animated score circle */}
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
            strokeLinecap="round"
            fill="transparent"
          />
        </svg>

        {/* Center score percentage */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center select-none">
          <span className={`text-[12px] font-bold ${textColor} tracking-tight leading-none`}>
            {normalizedScore}%
          </span>
        </div>
      </div>

      {showLabel && (
        <div className="hidden sm:flex flex-col text-left">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Vector Match
          </span>
          <span className={`text-[11px] font-semibold ${textColor}`}>
            {badgeLabel}
          </span>
        </div>
      )}
    </div>
  );
}
