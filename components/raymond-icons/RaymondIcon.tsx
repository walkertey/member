'use client';

import type { CSSProperties } from 'react';

export type IconName =
  | 'home'
  | 'members'
  | 'orders'
  | 'points'
  | 'redemption'
  | 'reports'
  | 'settings'
  | 'permissions'
  | 'grant'
  | 'exchange'
  | 'record'
  | 'permission'
  | 'member'
  | 'shop'
  | 'report'
  | 'marketing'
  | 'rule'
  | 'staff'
  | 'audit'
  | 'more'
  | 'eye'
  | 'bell'
  | 'close'
  | 'menu'
  | 'chevronRight'
  | 'arrowLeft'
  | 'shield'
  | 'gift'
  | 'receipt'
  | 'chart'
  | 'scan'
  | 'lightning'
  | 'check'
  | 'x'
  | 'user';

export type IconVariant = 'gold' | 'navy' | 'blue' | 'white' | 'mixed';

interface RaymondIconProps {
  name: IconName;
  size?: number;
  variant?: IconVariant;
  className?: string;
  style?: CSSProperties;
}

const variantColors: Record<IconVariant, { primary: string; secondary?: string; glow?: string }> = {
  gold: { primary: 'var(--rm-gold)', secondary: 'var(--rm-gold-deep)', glow: '0 0 10px rgba(240,180,41,0.48)' },
  navy: { primary: 'var(--rm-icon-navy)', secondary: 'var(--rm-icon-blue)', glow: '0 4px 6px rgba(15,23,42,0.18)' },
  blue: { primary: 'var(--rm-icon-blue)', secondary: 'var(--rm-icon-cyan)', glow: '0 0 8px rgba(59,130,246,0.35)' },
  white: { primary: '#fff', secondary: 'rgba(255,255,255,0.6)', glow: '0 0 6px rgba(255,255,255,0.15)' },
  mixed: { primary: 'var(--rm-gold)', secondary: 'var(--rm-icon-navy)', glow: '0 0 8px rgba(240,180,41,0.35)' },
};

export default function RaymondIcon({ name, size = 24, variant = 'gold', className = '', style }: RaymondIconProps) {
  const colors = variantColors[variant];
  const strokeColor = colors.primary;
  const fillColor = colors.secondary || colors.primary;
  const filter = colors.glow ? `drop-shadow(${colors.glow})` : undefined;

  const iconStyle: CSSProperties = {
    width: size,
    height: size,
    filter,
    flexShrink: 0,
    ...style,
  };

  const vb = '0 0 24 24';

  switch (name) {
    case 'home':
      return (
        <svg viewBox={vb} style={iconStyle} className={className} aria-hidden="true" fill="none">
          <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" stroke={strokeColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <polyline points="9,22 9,12 15,12 15,22" stroke={strokeColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case 'members':
      return (
        <svg viewBox={vb} style={iconStyle} className={className} aria-hidden="true" fill="none">
          <circle cx="9" cy="7" r="4" stroke={strokeColor} strokeWidth="2" fill={fillColor} fillOpacity="0.2" />
          <path d="M2 21v-2a4 4 0 014-4h6a4 4 0 014 4v2" stroke={strokeColor} strokeWidth="2" strokeLinecap="round" />
          <circle cx="21" cy="4" r="3" fill={colors.secondary || strokeColor} fillOpacity="0.9" />
        </svg>
      );
    case 'orders':
      return (
        <svg viewBox={vb} style={iconStyle} className={className} aria-hidden="true" fill="none">
          <rect x="2" y="4" width="20" height="16" rx="3" stroke={strokeColor} strokeWidth="2" />
          <line x1="2" y1="8" x2="22" y2="8" stroke={strokeColor} strokeWidth="2" />
          <rect x="7" y="11" width="10" height="5" rx="2" fill={fillColor} fillOpacity="0.5" />
        </svg>
      );
    case 'points':
      return (
        <svg viewBox={vb} style={iconStyle} className={className} aria-hidden="true" fill="none">
          <path d="M3 18l3-9 3 5 3-8 3 8 3-5 3 9v2a2 2 0 01-2 2H5a2 2 0 01-2-2z" stroke={strokeColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill={fillColor} fillOpacity="0.15" />
        </svg>
      );
    case 'redemption':
      return (
        <svg viewBox={vb} style={iconStyle} className={className} aria-hidden="true" fill="none">
          <circle cx="12" cy="12" r="10" stroke={strokeColor} strokeWidth="2" />
          <polygon points="16.24,7.76 14.12,14.12 7.76,16.24 9.88,9.88 16.24,7.76" fill={fillColor} fillOpacity="0.8" stroke={strokeColor} strokeWidth="1.5" strokeLinejoin="round" />
        </svg>
      );
    case 'reports':
      return (
        <svg viewBox={vb} style={iconStyle} className={className} aria-hidden="true" fill="none">
          <rect x="3" y="14" width="4" height="7" rx="1" fill={fillColor} fillOpacity="0.4" />
          <rect x="8.5" y="9" width="4" height="12" rx="1" fill={fillColor} fillOpacity="0.65" />
          <rect x="14" y="5" width="4" height="16" rx="1" fill={fillColor} fillOpacity="0.9" />
        </svg>
      );
    case 'settings':
      return (
        <svg viewBox={vb} style={iconStyle} className={className} aria-hidden="true" fill="none">
          <circle cx="12" cy="12" r="3" stroke={strokeColor} strokeWidth="2" />
          <path d="M12 1v3M12 20v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M1 12h3M20 12h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12" stroke={strokeColor} strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      );
    case 'permissions':
      return (
        <svg viewBox={vb} style={iconStyle} className={className} aria-hidden="true" fill="none">
          <path d="M12 2L4 6v5c0 5 3.5 8.5 8 11 4.5-2.5 8-6 8-11V6l-8-4z" fill={fillColor} fillOpacity="0.35" stroke={strokeColor} strokeWidth="2" strokeLinejoin="round" />
          <path d="M9 12l2 2 4-4" stroke={strokeColor} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case 'grant':
      return (
        <svg viewBox={vb} style={iconStyle} className={className} aria-hidden="true" fill="none">
          <path d="M5 5l-3 3 3 3" stroke={strokeColor} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M2 8h8" stroke={strokeColor} strokeWidth="3" strokeLinecap="round" />
          <path d="M14 19l3-3-3-3" stroke={strokeColor} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M22 16h-8" stroke={strokeColor} strokeWidth="3" strokeLinecap="round" />
        </svg>
      );
    case 'exchange':
      return (
        <svg viewBox={vb} style={iconStyle} className={className} aria-hidden="true" fill="none">
          <rect x="1" y="3" width="22" height="18" rx="3" stroke={strokeColor} strokeWidth="2.5" />
          <polyline points="3,17 7,10 11,13 14,7 17,11 21,9" stroke={strokeColor} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill={fillColor} fillOpacity="0.15" />
        </svg>
      );
    case 'record':
      return (
        <svg viewBox={vb} style={iconStyle} className={className} aria-hidden="true" fill="none">
          <rect x="1" y="4" width="22" height="15" rx="3" stroke={strokeColor} strokeWidth="2.2" fill={fillColor} fillOpacity="0.15" />
          <line x1="1" y1="8" x2="23" y2="8" stroke={strokeColor} strokeWidth="2" />
          <rect x="8" y="10" width="8" height="5" rx="1.5" fill={fillColor} fillOpacity="0.6" />
        </svg>
      );
    case 'permission':
      return (
        <svg viewBox={vb} style={iconStyle} className={className} aria-hidden="true" fill="none">
          <polygon points="14,2 7,12 10,12 8,20 17,10 13,10 15,3" stroke={strokeColor} strokeWidth="2.2" strokeLinejoin="round" fill={fillColor} fillOpacity="0.2" />
        </svg>
      );
    case 'member':
      return (
        <svg viewBox={vb} style={iconStyle} className={className} aria-hidden="true" fill="none">
          <circle cx="12" cy="7" r="4.5" fill={fillColor} fillOpacity="0.9" />
          <path d="M3 22c0-5 4-9 9-9s9 4 9 9" stroke={strokeColor} strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      );
    case 'shop':
      return (
        <svg viewBox={vb} style={iconStyle} className={className} aria-hidden="true" fill="none">
          <path d="M3 5h18l-3 9H6L3 5z" fill={fillColor} fillOpacity="0.7" stroke={strokeColor} strokeWidth="1.5" strokeLinejoin="round" />
          <path d="M6 14v7a2 2 0 002 2h8a2 2 0 002-2v-7" stroke={strokeColor} strokeWidth="2" strokeLinejoin="round" />
        </svg>
      );
    case 'report':
      return (
        <svg viewBox={vb} style={iconStyle} className={className} aria-hidden="true" fill="none">
          <rect x="2" y="15" width="5" height="7" rx="1.5" fill={fillColor} fillOpacity="0.45" />
          <rect x="9" y="10" width="5" height="12" rx="1.5" fill={fillColor} fillOpacity="0.65" />
          <rect x="16" y="5" width="5" height="17" rx="1.5" fill={fillColor} fillOpacity="0.9" />
        </svg>
      );
    case 'marketing':
      return (
        <svg viewBox={vb} style={iconStyle} className={className} aria-hidden="true" fill="none">
          <path d="M2 11h12l-2 5h7l-4 8" fill={fillColor} fillOpacity="0.55" stroke={strokeColor} strokeWidth="1.8" strokeLinejoin="round" />
          <path d="M2 11v6" stroke={strokeColor} strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      );
    case 'rule':
      return (
        <svg viewBox={vb} style={iconStyle} className={className} aria-hidden="true" fill="none">
          <path d="M12 2L3 6v5c0 5.5 3.5 9 9 11.5 5.5-2.5 9-6 9-11.5V6l-9-4z" fill={fillColor} fillOpacity="0.55" stroke={strokeColor} strokeWidth="1.8" strokeLinejoin="round" />
        </svg>
      );
    case 'staff':
      return (
        <svg viewBox={vb} style={iconStyle} className={className} aria-hidden="true" fill="none">
          <circle cx="8" cy="6" r="3.5" fill={fillColor} fillOpacity="0.7" />
          <circle cx="17" cy="6" r="3" fill={fillColor} fillOpacity="0.9" />
          <path d="M2 21c0-4.5 3-8 7-8" stroke={strokeColor} strokeWidth="2" strokeLinecap="round" />
          <path d="M13 21c0-3.5 3-6 5.5-6s5 2.5 5 6" stroke={strokeColor} strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    case 'audit':
      return (
        <svg viewBox={vb} style={iconStyle} className={className} aria-hidden="true" fill="none">
          <rect x="2" y="3" width="20" height="18" rx="3" stroke={strokeColor} strokeWidth="2" fill={fillColor} fillOpacity="0.08" />
          <line x1="7" y1="9" x2="17" y2="9" stroke={strokeColor} strokeWidth="2" strokeLinecap="round" />
          <line x1="7" y1="13" x2="15" y2="13" stroke={strokeColor} strokeWidth="2" strokeLinecap="round" />
          <line x1="7" y1="17" x2="11" y2="17" stroke={strokeColor} strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    case 'more':
      return (
        <svg viewBox={vb} style={iconStyle} className={className} aria-hidden="true" fill="none">
          <rect x="3" y="3" width="7" height="7" rx="2" fill={fillColor} fillOpacity="0.35" />
          <rect x="14" y="3" width="7" height="7" rx="2" fill={fillColor} fillOpacity="0.55" />
          <rect x="3" y="14" width="7" height="7" rx="2" fill={fillColor} fillOpacity="0.7" />
          <rect x="14" y="14" width="7" height="7" rx="2" fill={fillColor} fillOpacity="0.9" />
        </svg>
      );
    case 'eye':
      return (
        <svg viewBox={vb} style={iconStyle} className={className} aria-hidden="true" fill="none">
          <path d="M1.5 12s3.5-6 10.5-6 10.5 6 10.5 6-3.5 6-10.5 6-10.5-6-10.5-6Z" stroke={strokeColor} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="12" cy="12" r="3.5" fill={fillColor} fillOpacity="0.8" />
        </svg>
      );
    case 'bell':
      return (
        <svg viewBox={vb} style={iconStyle} className={className} aria-hidden="true" fill="none">
          <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" stroke={strokeColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M13.73 21a2 2 0 01-3.46 0" stroke={strokeColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="18" cy="4" r="3" fill={fillColor} fillOpacity="0.9" />
        </svg>
      );
    case 'close':
      return (
        <svg viewBox={vb} style={iconStyle} className={className} aria-hidden="true" fill="none">
          <path d="M5 5l14 14M19 5L5 19" stroke={strokeColor} strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      );
    case 'menu':
      return (
        <svg viewBox={vb} style={iconStyle} className={className} aria-hidden="true" fill="none">
          <path d="M3 5h18" stroke={strokeColor} strokeWidth="2.5" strokeLinecap="round" />
          <path d="M3 12h18" stroke={strokeColor} strokeWidth="2.5" strokeLinecap="round" />
          <path d="M3 19h18" stroke={strokeColor} strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      );
    case 'chevronRight':
      return (
        <svg viewBox={vb} style={iconStyle} className={className} aria-hidden="true" fill="none">
          <path d="M8 4l8 8-8 8" stroke={strokeColor} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case 'arrowLeft':
      return (
        <svg viewBox={vb} style={iconStyle} className={className} aria-hidden="true" fill="none">
          <path d="M16 4l-8 8 8 8" stroke={strokeColor} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case 'shield':
      return (
        <svg viewBox={vb} style={iconStyle} className={className} aria-hidden="true" fill="none">
          <path d="M12 2L4 6v5c0 5.5 3.5 9 8 11.5 4.5-2.5 8-6 8-11.5V6l-8-4z" fill={fillColor} fillOpacity="0.35" stroke={strokeColor} strokeWidth="2" strokeLinejoin="round" />
        </svg>
      );
    case 'gift':
      return (
        <svg viewBox={vb} style={iconStyle} className={className} aria-hidden="true" fill="none">
          <rect x="2" y="8" width="20" height="14" rx="3" stroke={strokeColor} strokeWidth="2" fill={fillColor} fillOpacity="0.15" />
          <path d="M12 8V3m-3 5a3 3 0 116 0" stroke={strokeColor} strokeWidth="2" strokeLinecap="round" />
          <line x1="12" y1="13" x2="12" y2="22" stroke={strokeColor} strokeWidth="2" />
        </svg>
      );
    case 'receipt':
      return (
        <svg viewBox={vb} style={iconStyle} className={className} aria-hidden="true" fill="none">
          <rect x="3" y="2" width="18" height="20" rx="3" stroke={strokeColor} strokeWidth="2" fill={fillColor} fillOpacity="0.08" />
          <line x1="8" y1="8" x2="16" y2="8" stroke={strokeColor} strokeWidth="2" strokeLinecap="round" />
          <line x1="8" y1="12" x2="16" y2="12" stroke={strokeColor} strokeWidth="2" strokeLinecap="round" />
          <line x1="8" y1="16" x2="13" y2="16" stroke={strokeColor} strokeWidth="2" strokeLinecap="round" />
          <circle cx="19" cy="5" r="2.5" fill={colors.secondary || strokeColor} fillOpacity="0.9" />
        </svg>
      );
    case 'chart':
      return (
        <svg viewBox={vb} style={iconStyle} className={className} aria-hidden="true" fill="none">
          <rect x="2" y="12" width="4" height="9" rx="1" fill={fillColor} fillOpacity="0.4" />
          <rect x="8" y="7" width="4" height="14" rx="1" fill={fillColor} fillOpacity="0.65" />
          <rect x="14" y="2" width="4" height="19" rx="1" fill={fillColor} fillOpacity="0.9" />
          <rect x="20" y="9" width="4" height="12" rx="1" fill={fillColor} fillOpacity="0.55" />
        </svg>
      );
    case 'scan':
      return (
        <svg viewBox={vb} style={iconStyle} className={className} aria-hidden="true" fill="none">
          <rect x="3" y="9" width="18" height="2" rx="1" fill={fillColor} fillOpacity="0.9" />
          <path d="M6 2H4a2 2 0 00-2 2v2" stroke={strokeColor} strokeWidth="2" strokeLinecap="round" />
          <path d="M18 2h2a2 2 0 012 2v2" stroke={strokeColor} strokeWidth="2" strokeLinecap="round" />
          <path d="M6 22H4a2 2 0 01-2-2v-2" stroke={strokeColor} strokeWidth="2" strokeLinecap="round" />
          <path d="M18 22h2a2 2 0 002-2v-2" stroke={strokeColor} strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    case 'lightning':
      return (
        <svg viewBox={vb} style={iconStyle} className={className} aria-hidden="true" fill="none">
          <path d="M14 2L6 12h5l-2 10 9-10h-6l3-10z" fill={fillColor} fillOpacity="0.35" stroke={strokeColor} strokeWidth="2" strokeLinejoin="round" />
        </svg>
      );
    case 'check':
      return (
        <svg viewBox={vb} style={iconStyle} className={className} aria-hidden="true" fill="none">
          <path d="M5 13l4 4L19 7" stroke={strokeColor} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case 'x':
      return (
        <svg viewBox={vb} style={iconStyle} className={className} aria-hidden="true" fill="none">
          <path d="M6 6l12 12M18 6L6 18" stroke={strokeColor} strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      );
    case 'user':
      return (
        <svg viewBox={vb} style={iconStyle} className={className} aria-hidden="true" fill="none">
          <circle cx="12" cy="7" r="4.5" fill={fillColor} fillOpacity="0.85" />
          <path d="M3 22v-2a4 4 0 014-4h10a4 4 0 014 4v2" stroke={strokeColor} strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    default:
      return (
        <svg viewBox={vb} style={iconStyle} className={className} aria-hidden="true" fill="none">
          <circle cx="12" cy="12" r="10" stroke={strokeColor} strokeWidth="2" fill={fillColor} fillOpacity="0.1" />
          <path d="M12 6v6l4 2" stroke={strokeColor} strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
  }
}
