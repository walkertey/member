import React from 'react';
import { cn } from '@/lib/utils';

interface RaymondCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  variant?: 'default' | 'action' | 'premium';
}

/**
 * Raymond 品牌卡片组件
 * 参考主页设计：半透明深蓝背景 + 金色边框 + 轻微阴影 + 金色跑动特效
 */
export function RaymondCard({
  children,
  className,
  onClick,
  variant = 'default',
}: RaymondCardProps) {
  const baseStyles = 'rounded-[13px] border backdrop-blur-sm transition-all duration-200 relative overflow-hidden';

  const variants = {
    default: 'bg-[rgba(34,63,91,0.58)] border-[rgba(150,177,210,0.35)] shadow-[0_7px_14px_rgba(0,8,26,0.13)]',
    action: 'bg-[rgba(34,63,91,0.58)] border-[rgba(150,177,210,0.35)] shadow-[0_5px_9px_rgba(0,8,26,0.18)] hover:opacity-90 active:scale-95',
    premium: 'bg-gradient-to-br from-[#FFF0B7] via-[#D9A85A] to-[#B77A35] shadow-[0_2px_10px_rgba(244,198,110,0.42)]',
  };

  return (
    <div
      className={cn(baseStyles, variants[variant], className)}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {/* 金色跑动特效 - 所有卡片都有 */}
      <div
        className="absolute inset-0 rounded-[13px] pointer-events-none opacity-60"
        style={{
          background: 'linear-gradient(90deg, transparent 0%, rgba(235,203,131,0.4) 50%, transparent 100%)',
          animation: 'shimmer 4s infinite',
        }}
      />
      {children}
    </div>
  );
}

interface RaymondCardHeaderProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
}

export function RaymondCardHeader({ title, subtitle, icon }: RaymondCardHeaderProps) {
  return (
    <div className="flex items-start justify-between gap-3">
      <div className="flex-1">
        <h3 className="text-[15px] font-semibold text-[#F2F3F7] leading-[21px] tracking-[0.1px]">
          {title}
        </h3>
        {subtitle && (
          <p className="mt-1 text-[12px] font-normal text-[#7F8FA8] leading-[17px] tracking-[0.1px]">
            {subtitle}
          </p>
        )}
      </div>
      {icon && <div className="flex-shrink-0">{icon}</div>}
    </div>
  );
}

interface RaymondCardBodyProps {
  children: React.ReactNode;
  className?: string;
}

export function RaymondCardBody({ children, className }: RaymondCardBodyProps) {
  return <div className={cn('p-4', className)}>{children}</div>;
}
