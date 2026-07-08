'use client';

import { useEffect, useMemo, useState } from 'react';
import { usePointsStore } from '@/lib/store';
import { getExpiringTransactions } from '@/lib/pointsEngine';
import Link from 'next/link';

function RaymondFlowerMark() {
  const petals = Array.from({ length: 12 }, (_, index) => {
    const angle = index * 30;
    return (
      <ellipse
        key={angle}
        cx="16"
        cy="6"
        rx="3.2"
        ry="6"
        transform={`rotate(${angle} 16 16)`}
        fill="var(--rm-gold)"
        opacity={index % 2 === 0 ? 1 : 0.78}
      />
    );
  });
  return (
    <svg
      viewBox="0 0 32 32"
      className="h-8 w-8"
      style={{ filter: 'drop-shadow(0 0 10px rgba(240,180,41,0.55))' }}
      aria-hidden="true"
    >
      {petals}
      <circle cx="16" cy="16" r="4" fill="var(--rm-gold-deep)" />
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 text-white/80" aria-hidden="true">
      <path
        d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="12" r="3" fill="currentColor" />
    </svg>
  );
}

function usePlatformShell() {
  const [platform] = useState<'ios' | 'android' | 'desktop'>(() => {
    if (typeof window === 'undefined') return 'ios';
    const ua = navigator.userAgent || '';
    const width = window.innerWidth;

    if (width >= 768) return 'desktop';
    if (/iPhone|iPad|iPod/i.test(ua)) return 'ios';
    return 'android';
  });

  return platform;
}

export default function DashboardPage() {
  const members = usePointsStore((s) => s.members);
  const orders = usePointsStore((s) => s.orders);
  const pointTransactions = usePointsStore((s) => s.pointTransactions);
  const redemptionRecords = usePointsStore((s) => s.redemptionRecords);
  const settleExpiredPoints = usePointsStore((s) => s.settleExpiredPoints);
  const resetData = usePointsStore((s) => s.resetData);
  const addToast = usePointsStore((s) => s.addToast);

  const platform = usePlatformShell();
  const isIOS = platform === 'ios';
  const isAndroid = platform === 'android';

  useEffect(() => {
    settleExpiredPoints();
  }, [settleExpiredPoints]);

  const todayStr = useMemo(() => {
    const d = new Date();
    return d.toISOString().slice(0, 10);
  }, []);

  const todayNewMembers = useMemo(
    () => members.filter((m) => m.register_time.slice(0, 10) === todayStr).length,
    [members, todayStr]
  );

  const todayOrders = useMemo(
    () => orders.filter((o) => o.pay_time.slice(0, 10) === todayStr).length,
    [orders, todayStr]
  );

  const expiringCount = useMemo(
    () => getExpiringTransactions(pointTransactions, members, 30).length,
    [pointTransactions, members]
  );

  const pendingAuditCount = useMemo(
    () => redemptionRecords.filter((r) => r.status === '待审核').length,
    [redemptionRecords]
  );

  const handleReset = () => {
    if (window.confirm('确定要重置所有 Demo 数据吗？此操作不可恢复。')) {
      resetData();
      addToast('success', '数据已重置为初始状态');
    }
  };

  const totalAvailablePoints = useMemo(
    () => members.reduce((sum, m) => sum + (m.available_points ?? 0), 0),
    [members]
  );

  const quickActions = [
    { label: '积分发放', href: '/points', icon: 'grant' },
    { label: '积分兑换', href: '/redemption', icon: 'exchange' },
    { label: '兑换记录', href: '/redemption', icon: 'record' },
    { label: '权限管理', href: '/permissions', icon: 'permission' },
  ];

  const coreFeatures = [
    { label: '会员管理', href: '/members', icon: 'member' },
    { label: '积分商城', href: '/redemption', icon: 'shop' },
    { label: '财务报表', href: '/reports', icon: 'report' },
    { label: '营销工具', href: '/settings', icon: 'marketing' },
    { label: '规则设置', href: '/settings', icon: 'rule' },
    { label: '员工管理', href: '/permissions', icon: 'staff' },
    { label: '审计日志', href: '/reports', icon: 'audit' },
    { label: '更多', href: '/settings', icon: 'more' },
  ];

  const QuickIcon = ({ icon }: { icon: string }) => {
    if (icon === 'grant') {
      return (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="rm-quick-icon-gold">
          <path d="M6 2L2 6l4 4" stroke="currentColor" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          <path d="M2 6h10" stroke="currentColor" strokeWidth="4.5" strokeLinecap="round" />
          <path d="M14 18l4-4-4-4" stroke="currentColor" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          <path d="M18 14H8" stroke="currentColor" strokeWidth="4.5" strokeLinecap="round" />
        </svg>
      );
    }
    if (icon === 'exchange') {
      return (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="rm-quick-icon-gold">
          <rect x="1" y="2" width="18" height="16" rx="3" stroke="currentColor" strokeWidth="4" fill="none" />
          <polyline points="3,16 7,10 11,12 15,5 19,7" stroke="currentColor" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </svg>
      );
    }
    if (icon === 'record') {
      return (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="rm-quick-icon-bluegold">
          <rect x="1" y="4" width="18" height="12" rx="3" fill="#3b82f6" fillOpacity="0.3" stroke="#3b82f6" strokeWidth="4" />
          <line x1="1" y1="8" x2="19" y2="8" stroke="#3b82f6" strokeWidth="3" />
          <rect x="7" y="11" width="6" height="4" rx="1.5" fill="var(--rm-gold)" />
        </svg>
      );
    }
    return (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="rm-quick-icon-gold">
        <polygon points="12,2 5,11 9,11 7,18 15,9 11,9 13,3" fill="currentColor" fillOpacity="0.35" stroke="currentColor" strokeWidth="4.5" strokeLinejoin="round" />
      </svg>
    );
  };

  const FeatureIcon = ({ icon }: { icon: string }) => {
    if (icon === 'member') {
      return (
        <svg width="24" height="24" viewBox="0 0 28 28" fill="none" className="rm-feature-main-icon">
          <circle cx="14" cy="8" r="5" fill="currentColor" />
          <path d="M4 25c0-5.5 4.5-10 10-10s10 4.5 10 10" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="23" cy="4" r="3.5" className="rm-feature-badge" fill="currentColor" />
        </svg>
      );
    }
    if (icon === 'shop') {
      return (
        <svg width="24" height="24" viewBox="0 0 28 28" fill="none" className="rm-feature-main-icon">
          <path d="M4 5h20l-3 10H7L4 5z" fill="currentColor" opacity="0.9" />
          <path d="M7 15v8a2 2 0 002 2h10a2 2 0 002-2v-8" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round" />
        </svg>
      );
    }
    if (icon === 'report') {
      return (
        <svg width="24" height="24" viewBox="0 0 28 28" fill="none" className="rm-feature-main-icon">
          <rect x="2" y="17" width="5" height="8" rx="1.5" fill="currentColor" opacity="0.55" />
          <rect x="9" y="11" width="5" height="14" rx="1.5" fill="currentColor" opacity="0.75" />
          <rect x="16" y="5" width="5" height="20" rx="1.5" fill="currentColor" />
        </svg>
      );
    }
    if (icon === 'marketing') {
      return (
        <svg width="24" height="24" viewBox="0 0 28 28" fill="none" className="rm-feature-main-icon">
          <path d="M2 12h12l-2 5h7l-4 8" fill="currentColor" opacity="0.9" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
          <path d="M2 12v5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="24" cy="5" r="3.5" className="rm-feature-badge" fill="currentColor" />
        </svg>
      );
    }
    if (icon === 'rule') {
      return (
        <svg width="24" height="24" viewBox="0 0 28 28" fill="none" className="rm-feature-main-icon">
          <path d="M14 2L5 6v5c0 5 3.5 8.5 9 11 5.5-2.5 9-6 9-11V6l-9-4z" fill="currentColor" opacity="0.85" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
          <circle cx="23" cy="4" r="3.5" className="rm-feature-badge" fill="currentColor" />
        </svg>
      );
    }
    if (icon === 'staff') {
      return (
        <svg width="24" height="24" viewBox="0 0 28 28" fill="none" className="rm-feature-main-icon">
          <circle cx="9" cy="7" r="4" fill="currentColor" opacity="0.8" />
          <circle cx="19" cy="7" r="3.5" fill="currentColor" />
          <path d="M2 24c0-5 3.6-9 8-9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <path d="M15 23c0-4 3.5-6.5 6-6.5s5.5 2.5 5.5 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <circle cx="25" cy="5" r="3.5" className="rm-feature-badge" fill="currentColor" />
        </svg>
      );
    }
    if (icon === 'audit') {
      return (
        <svg width="24" height="24" viewBox="0 0 28 28" fill="none" className="rm-feature-main-icon">
          <rect x="2" y="3" width="24" height="21" rx="3" fill="currentColor" opacity="0.12" stroke="currentColor" strokeWidth="2.2" />
          <line x1="8" y1="10" x2="20" y2="10" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
          <line x1="8" y1="15" x2="17" y2="15" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
          <line x1="8" y1="20" x2="13" y2="20" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
          <circle cx="24" cy="5" r="3.5" className="rm-feature-badge" fill="currentColor" />
        </svg>
      );
    }
    return (
      <svg width="24" height="24" viewBox="0 0 28 28" fill="none" className="rm-feature-main-icon">
        <rect x="3" y="3" width="9" height="9" rx="2.5" fill="currentColor" opacity="0.4" />
        <rect x="16" y="3" width="9" height="9" rx="2.5" fill="currentColor" opacity="0.6" />
        <rect x="3" y="16" width="9" height="9" rx="2.5" fill="currentColor" opacity="0.75" />
        <rect x="16" y="16" width="9" height="9" rx="2.5" fill="currentColor" />
      </svg>
    );
  };

  return (
    <>
      {/* ======== MOBILE LAYOUT (Apple + Android) ======== */}
      <div className={`rm-mobile-home -m-4 md:hidden ${isAndroid ? 'rm-android-home' : ''}`}>
        {/* Apple iOS status bar — only on actual iOS devices */}
        {isIOS ? (
          <div className="rm-ios-statusbar relative" aria-label="iPhone status preview">
            <span>9:41</span>
            <span className="rm-dynamic-island" aria-hidden="true" />
            <span>▮▮▮ WiFi 87</span>
          </div>
        ) : null}

        <div className="rm-mobile-shell">
          {/* Top brand bar */}
          <header className="rm-home-topbar">
            <div className="rm-home-brand">
              <span className="rm-home-brand-main">Raymond</span>
              <span className="rm-home-brand-sub">积分管理</span>
            </div>
            <button onClick={handleReset} aria-label="通知" className="relative flex items-center justify-center w-8 h-8 rounded-full border border-white/15 hover:bg-white/5 transition-colors">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" opacity="0.7">
                <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 01-3.46 0" />
              </svg>
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rm-gold" />
            </button>
          </header>

          {/* Premium balance card */}
          <section className="rm-premium-card">
            <div className="rm-card-watermark">R</div>
            <div className="rm-card-content">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-white text-lg font-bold tracking-wide">Raymond</h2>
                  <p className="text-rm-text-secondary text-[11px] mt-0.5">积 赏 管 理</p>
                </div>
                <RaymondFlowerMark />
              </div>
              <div className="rm-balance-label">
                <span>当前可用积分</span>
                <EyeIcon />
              </div>
              <p className="rm-balance-number">
                {totalAvailablePoints.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </p>
            </div>
          </section>

          {/* Quick actions */}
          <nav className="rm-quick-grid">
            {quickActions.map((item) => (
              <Link key={item.label} href={item.href} className="rm-quick-link">
                <div className="rm-quick-tile">
                  <QuickIcon icon={item.icon} />
                </div>
                <span className="rm-quick-label">{item.label}</span>
              </Link>
            ))}
          </nav>

          {/* Core features + Banner */}
          <section className="rm-core-panel">
            <div className="rm-core-head">
              <h3 className="rm-core-title">核心功能</h3>
              <Link href="/settings" className="rm-core-more">全部 ›</Link>
            </div>
            <div className="rm-feature-grid">
              {coreFeatures.map((item) => (
                <Link key={item.label} href={item.href} className="rm-feature-link">
                  <div className="rm-feature-tile">
                    <FeatureIcon icon={item.icon} />
                  </div>
                  <span className="rm-feature-label">{item.label}</span>
                </Link>
              ))}
            </div>

            <div className="rm-raymond-banner">
              <div className="rm-banner-content">
                <span className="rm-banner-title">Raymond<span className="rm-banner-sub">| 智能积分运营专家</span></span>
                <span className="rm-banner-cta">了解更多</span>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* ======== DESKTOP LAYOUT ======== */}
      <div className="hidden md:block rm-desktop-home -m-6 min-h-screen px-10 py-8">
        <div className="rm-desktop-container">
          {/* Desktop header */}
          <div className="rm-desktop-header">
            <div>
              <h1 className="rm-desktop-title">Raymond 积分管理</h1>
              <p className="rm-desktop-subtitle">智能积分运营专家 · Demo v1.0</p>
            </div>
            <button onClick={handleReset} className="rounded-lg bg-white/5 border border-white/10 px-4 py-2 text-sm text-rm-text-secondary hover:bg-white/10 transition-colors min-h-[44px]">
              重置 Demo 数据
            </button>
          </div>

          {/* Hero row: balance card + stats sidebar */}
          <div className="rm-desktop-grid">
            <section className="rm-premium-card rm-desktop-card">
              <div className="rm-card-watermark">R</div>
              <div className="rm-card-content">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-white text-xl font-bold tracking-wide">Raymond</h2>
                    <p className="text-rm-text-secondary text-xs mt-0.5">积 赏 管 理</p>
                  </div>
                  <RaymondFlowerMark />
                </div>
                <div className="rm-balance-label">
                  <span>当前可用积分</span>
                  <EyeIcon />
                </div>
                <p className="rm-balance-number">
                  {totalAvailablePoints.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </p>
              </div>
            </section>

            <section className="rm-desktop-stats">
              <h3 className="text-white/60 text-xs font-semibold uppercase tracking-wider mb-3">系统概览</h3>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: '新增会员', value: todayNewMembers },
                  { label: '今日订单', value: todayOrders },
                  { label: '临期预警', value: expiringCount },
                  { label: '待审核', value: pendingAuditCount },
                ].map((card) => (
                  <div key={card.label} className="bg-rm-bg-card rounded-xl p-3 border border-white/8">
                    <p className="text-rm-text-secondary text-[11px] mb-1">{card.label}</p>
                    <p className="text-white text-xl font-bold">{card.value}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Quick actions row */}
          <nav className="rm-desktop-actions">
            {quickActions.map((item) => (
              <Link key={item.label} href={item.href} className="rm-desktop-action-card">
                <div className="rm-quick-tile rm-desktop-quick-tile">
                  <QuickIcon icon={item.icon} />
                </div>
                <div>
                  <p className="text-white text-sm font-semibold">{item.label}</p>
                  <p className="text-rm-text-secondary text-[11px] mt-0.5">前往管理</p>
                </div>
              </Link>
            ))}
          </nav>

          {/* Core features panel */}
          <section className="rm-desktop-panel">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-rm-text-dark text-lg font-bold">核心功能</h3>
              <Link href="/settings" className="text-rm-text-dark-secondary text-sm hover:text-rm-text-dark transition-colors">
                全部 ›
              </Link>
            </div>
            <div className="grid grid-cols-4 gap-4">
              {coreFeatures.map((item) => (
                <Link key={item.label} href={item.href} className="rm-desktop-feature-link">
                  <div className="rm-feature-tile rm-desktop-feature-tile">
                    <FeatureIcon icon={item.icon} />
                  </div>
                  <span className="rm-feature-label">{item.label}</span>
                </Link>
              ))}
            </div>
          </section>

          {/* Banner + stats row */}
          <div className="rm-desktop-bottom-row">
            <div className="rm-raymond-banner rm-desktop-banner">
              <div className="rm-banner-content">
                <span className="rm-banner-title">Raymond<span className="rm-banner-sub">| 智能积分运营专家</span></span>
                <span className="rm-banner-cta">了解更多</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
