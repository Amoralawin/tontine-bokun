"use client";

import React from "react";

interface LogoIconProps {
  size?: number;
  className?: string;
}

export const LogoIcon: React.FC<LogoIconProps> = ({ size = 40, className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <defs>
      <linearGradient id="cleanNavyBg" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#0b132b" />
        <stop offset="100%" stopColor="#1c2541" />
      </linearGradient>
      <linearGradient id="indigoLine" x1="0" y1="0" x2="48" y2="0" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#1e3a8a" />
        <stop offset="50%" stopColor="#2563eb" />
        <stop offset="100%" stopColor="#60a5fa" />
      </linearGradient>
    </defs>

    {/* Fond carré arrondi — Bleu nuit marin */}
    <rect width="48" height="48" rx="13" fill="url(#cleanNavyBg)" />

    {/* Lettre T — grande, blanche, bold et pure */}
    <text
      x="24"
      y="32"
      textAnchor="middle"
      fontSize="30"
      fontWeight="900"
      fontFamily="'Arial Black', 'Helvetica Neue', Arial, sans-serif"
      fill="#ffffff"
      letterSpacing="-1"
    >
      T
    </text>

    {/* Trait sous le T en dégradé Indigo pur */}
    <rect x="11" y="36" width="26" height="3.5" rx="1.75" fill="url(#indigoLine)" />
  </svg>
);
