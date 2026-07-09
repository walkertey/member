'use client';

export type IconTileColor = 'navy' | 'blue' | 'cyan' | 'red' | 'violet' | 'emerald' | 'gold';

interface IconTileProps {
  /** The SVG icon node to render inside the tile */
  children: React.ReactNode;
  /** Color key from the --rm-icon-* token palette */
  color?: IconTileColor;
  /** Tile size variant */
  size?: 'sm' | 'md';
  /** Whether this tile is in active/highlighted state */
  active?: boolean;
  /** Additional CSS classes */
  className?: string;
}

const COLOR_TOKEN_MAP: Record<IconTileColor, string> = {
  navy: 'var(--rm-icon-navy)',
  blue: 'var(--rm-icon-blue)',
  cyan: 'var(--rm-icon-cyan)',
  red: 'var(--rm-icon-red)',
  violet: 'var(--rm-icon-violet)',
  emerald: 'var(--rm-icon-emerald)',
  gold: 'var(--rm-gold)',
};

const SIZE_MAP = {
  sm: 'w-8 h-8 min-w-[32px] min-h-[32px] rounded-[10px]',
  md: 'w-[54px] h-[54px] rounded-[13px]',
};

export default function IconTile({
  children,
  color = 'blue',
  size = 'md',
  active = false,
  className = '',
}: IconTileProps) {
  const sizeClass = SIZE_MAP[size];
  const c = COLOR_TOKEN_MAP[color];

  return (
    <span
      className={`${sizeClass} flex items-center justify-center ${className}`}
      style={{
        background: active
          ? `linear-gradient(145deg, ${c}, ${c}88)`
          : `linear-gradient(145deg, rgba(27, 43, 88, 0.96), rgba(12, 22, 52, 0.96))`,
        border: active
          ? `1px solid ${c}66`
          : '1px solid rgba(255, 255, 255, 0.16)',
        boxShadow: active
          ? `0 0 12px ${c}33, inset 0 1px 0 rgba(255, 255, 255, 0.12)`
          : 'inset 0 1px 0 rgba(255, 255, 255, 0.08), 0 8px 16px rgba(0, 0, 0, 0.22)',
        color: active ? '#ffffff' : 'rgba(255, 255, 255, 0.7)',
      }}
    >
      {children}
    </span>
  );
}
