'use client';

import { useEffect, useMemo, useState, type ReactElement } from 'react';
import { usePointsStore } from '@/lib/store';
import { getExpiringTransactions } from '@/lib/pointsEngine';
import { getVisibleMenu } from '@/lib/permissions';
import Link from 'next/link';
import { useI18n } from '@/components/raymond-i18n/RaymondI18nProvider';
import { t } from '@/components/raymond-i18n/raymondTranslations';

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
      style={{ filter: 'drop-shadow(0 0 12px rgba(240,180,41,0.6))' }}
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

const QUICK_ICONS: Record<string, ReactElement> = {
  grant: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="rm-quick-icon-gold">
      <path d="M6 2L2 6l4 4" stroke="currentColor" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M2 6h10" stroke="currentColor" strokeWidth="4.5" strokeLinecap="round" />
      <path d="M14 18l4-4-4-4" stroke="currentColor" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M18 14H8" stroke="currentColor" strokeWidth="4.5" strokeLinecap="round" />
    </svg>
  ),
  exchange: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="rm-quick-icon-gold">
      <rect x="1" y="2" width="18" height="16" rx="3" stroke="currentColor" strokeWidth="4" fill="none" />
      <polyline points="3,16 7,10 11,12 15,5 19,7" stroke="currentColor" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  ),
  record: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="rm-quick-icon-bluegold">
      <rect x="1" y="4" width="18" height="12" rx="3" fill="var(--rm-icon-blue)" fillOpacity="0.3" stroke="var(--rm-icon-blue)" strokeWidth="4" />
      <line x1="1" y1="8" x2="19" y2="8" stroke="var(--rm-icon-blue)" strokeWidth="3" />
      <rect x="7" y="11" width="6" height="4" rx="1.5" fill="var(--rm-gold)" />
    </svg>
  ),
  permission: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="rm-quick-icon-gold">
      <polygon points="12,2 5,11 9,11 7,18 15,9 11,9 13,3" fill="currentColor" fillOpacity="0.35" stroke="currentColor" strokeWidth="4.5" strokeLinejoin="round" />
    </svg>
  ),
};

const FEATURE_ICONS: Record<string, ReactElement> = {
  member: (
    <svg width="24" height="24" viewBox="0 0 28 28" fill="none" className="rm-feature-main-icon">
      <circle cx="14" cy="8" r="5" fill="currentColor" />
      <path d="M4 25c0-5.5 4.5-10 10-10s10 4.5 10 10" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="23" cy="4" r="3.5" className="rm-feature-badge" fill="currentColor" />
    </svg>
  ),
  shop: (
    <svg width="24" height="24" viewBox="0 0 28 28" fill="none" className="rm-feature-main-icon">
      <path d="M4 5h20l-3 10H7L4 5z" fill="currentColor" opacity="0.9" />
      <path d="M7 15v8a2 2 0 002 2h10a2 2 0 002-2v-8" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round" />
    </svg>
  ),
  report: (
    <svg width="24" height="24" viewBox="0 0 28 28" fill="none" className="rm-feature-main-icon">
      <rect x="2" y="17" width="5" height="8" rx="1.5" fill="currentColor" opacity="0.55" />
      <rect x="9" y="11" width="5" height="14" rx="1.5" fill="currentColor" opacity="0.75" />
      <rect x="16" y="5" width="5" height="20" rx="1.5" fill="currentColor" />
    </svg>
  ),
  marketing: (
    <svg width="24" height="24" viewBox="0 0 28 28" fill="none" className="rm-feature-main-icon">
      <path d="M2 12h12l-2 5h7l-4 8" fill="currentColor" opacity="0.9" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M2 12v5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="24" cy="5" r="3.5" className="rm-feature-badge" fill="currentColor" />
    </svg>
  ),
  rule: (
    <svg width="24" height="24" viewBox="0 0 28 28" fill="none" className="rm-feature-main-icon">
      <path d="M14 2L5 6v5c0 5 3.5 8.5 9 11 5.5-2.5 9-6 9-11V6l-9-4z" fill="currentColor" opacity="0.85" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <circle cx="23" cy="4" r="3.5" className="rm-feature-badge" fill="currentColor" />
    </svg>
  ),
  staff: (
    <svg width="24" height="24" viewBox="0 0 28 28" fill="none" className="rm-feature-main-icon">
      <circle cx="9" cy="7" r="4" fill="currentColor" opacity="0.8" />
      <circle cx="19" cy="7" r="3.5" fill="currentColor" />
      <path d="M2 24c0-5 3.6-9 8-9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M15 23c0-4 3.5-6.5 6-6.5s5.5 2.5 5.5 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <circle cx="25" cy="5" r="3.5" className="rm-feature-badge" fill="currentColor" />
    </svg>
  ),
  audit: (
    <svg width="24" height="24" viewBox="0 0 28 28" fill="none" className="rm-feature-main-icon">
      <rect x="2" y="3" width="24" height="21" rx="3" fill="currentColor" opacity="0.12" stroke="currentColor" strokeWidth="2.2" />
      <line x1="8" y1="10" x2="20" y2="10" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      <line x1="8" y1="15" x2="17" y2="15" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      <line x1="8" y1="20" x2="13" y2="20" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      <circle cx="24" cy="5" r="3.5" className="rm-feature-badge" fill="currentColor" />
    </svg>
  ),
  more: (
    <svg width="24" height="24" viewBox="0 0 28 28" fill="none" className="rm-feature-main-icon">
      <rect x="3" y="3" width="9" height="9" rx="2.5" fill="currentColor" opacity="0.4" />
      <rect x="16" y="3" width="9" height="9" rx="2.5" fill="currentColor" opacity="0.6" />
      <rect x="3" y="16" width="9" height="9" rx="2.5" fill="currentColor" opacity="0.75" />
      <rect x="16" y="16" width="9" height="9" rx="2.5" fill="currentColor" />
    </svg>
  ),
};

export default function DashboardPage() {
  const members = usePointsStore((s) => s.members);
  const orders = usePointsStore((s) => s.orders);
  const pointTransactions = usePointsStore((s) => s.pointTransactions);
  const redemptionRecords = usePointsStore((s) => s.redemptionRecords);
  const settleExpiredPoints = usePointsStore((s) => s.settleExpiredPoints);
  const resetData = usePointsStore((s) => s.resetData);
  const addToast = usePointsStore((s) => s.addToast);
  const currentRole = usePointsStore((s) => s.currentRole);
  const { lang } = useI18n();

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
    if (window.confirm(t('home.resetConfirm', lang))) {
      resetData();
      addToast('success', t('home.resetDone', lang));
    }
  };

  const totalAvailablePoints = useMemo(
    () => members.reduce((sum, m) => sum + (m.available_points ?? 0), 0),
    [members]
  );

  const quickActions = useMemo(() => {
    const visibleMenu = getVisibleMenu(currentRole);
    const canSeePermissions = visibleMenu.some((m) => m.href === '/permissions');
    return [
      { label: t('home.quickGrant', lang), href: '/points', icon: 'grant' as const },
      { label: t('home.quickRedeem', lang), href: '/redemption', icon: 'exchange' as const },
      { label: t('home.quickRecords', lang), href: '/redemption', icon: 'record' as const },
      canSeePermissions
        ? { label: t('home.quickPermissions', lang), href: '/permissions', icon: 'permission' as const }
        : { label: t('home.quickMembers', lang), href: '/members', icon: 'grant' as const },
    ];
  }, [currentRole, lang]);

  const coreFeatures = useMemo(() => {
    const visibleMenu = getVisibleMenu(currentRole);
    const canSeePermissions = visibleMenu.some((m) => m.href === '/permissions');
    const all = [
      { label: t('home.featMembers', lang), href: '/members', icon: 'member' as const },
      { label: t('home.featMall', lang), href: '/redemption', icon: 'shop' as const },
      { label: t('home.featReports', lang), href: '/reports', icon: 'report' as const },
      { label: t('home.featMarketing', lang), href: '/settings', icon: 'marketing' as const },
      { label: t('home.featRules', lang), href: '/settings', icon: 'rule' as const },
      { label: t('home.featStaff', lang), href: '/permissions', icon: 'staff' as const },
      { label: t('home.featAudit', lang), href: '/reports', icon: 'audit' as const },
      { label: t('home.featMore', lang), href: '/settings', icon: 'more' as const },
    ];
    return all.filter((item) => item.href !== '/permissions' || canSeePermissions);
  }, [currentRole, lang]);

  const QuickIcon = ({ icon }: { icon: string }) => QUICK_ICONS[icon] ?? QUICK_ICONS.grant;
  const FeatureIcon = ({ icon }: { icon: string }) => FEATURE_ICONS[icon] ?? FEATURE_ICONS.more;

  return (
    <>
      {/* ======== MOBILE LAYOUT (Apple + Android) ======== */}
      <div className={`rm-mobile-home -m-4 md:hidden ${isAndroid ? 'rm-android-home' : ''}`}>
        {isIOS ? (
          <div className="rm-ios-statusbar relative" aria-label="iPhone status preview">
            <span>9:41</span>
            <span className="rm-dynamic-island" aria-hidden="true" />
            <span>▮▮▮ WiFi 87</span>
          </div>
        ) : null}

        <div className="rm-mobile-shell">
          <header className="rm-home-topbar">
            <div className="rm-home-brand">
              <span className="rm-home-brand-main rm-brand-wordmark">Raymond</span>
              <span className="rm-home-brand-sub">{t('home.pointsSystem', lang)}</span>
            </div>
            <button onClick={handleReset} aria-label={t('home.resetData', lang)} className="relative flex items-center justify-center w-8 h-8 rounded-full border border-white/15 text-white/70 hover:bg-white/5 transition-colors">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 01-3.46 0" />
              </svg>
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rm-gold" />
            </button>
          </header>

          <section className="rm-premium-card rm-premium-shadow">
            <div className="rm-card-watermark rm-brand-wordmark">R</div>
            <div className="rm-card-content">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-white text-lg font-bold tracking-wide rm-brand-serif-title">Raymond</h2>
                  <p className="text-rm-text-secondary text-[11px] mt-0.5">{t('home.pointsSystem', lang)}</p>
                </div>
                <RaymondFlowerMark />
              </div>
              <div className="rm-balance-label">
                <span>{t('home.availablePoints', lang)}</span>
                <EyeIcon />
              </div>
              <p className="rm-balance-number rm-ui-number">
                {totalAvailablePoints.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </p>
            </div>
          </section>

          <nav className="rm-quick-grid">
            {quickActions.map((item) => (
              <Link key={item.label} href={item.href} className="rm-quick-link">
                <div className="rm-quick-tile rm-icon-orb rm-gold-glow-strong">
                  <QuickIcon icon={item.icon} />
                </div>
                <span className="rm-quick-label">{item.label}</span>
              </Link>
            ))}
          </nav>

          <section className="rm-core-panel rm-depth-card">
            <div className="rm-core-head">
              <h3 className="rm-core-title">{t('home.coreFeatures', lang)}</h3>
              <Link href="/settings" className="rm-core-more">{t('home.viewAll', lang)} ›</Link>
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
                <span className="rm-banner-title rm-brand-serif-title">Raymond<span className="rm-banner-sub"> | {t('home.smartOps', lang)}</span></span>
                <span className="rm-banner-cta">{t('home.learnMore', lang)}</span>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* ======== DESKTOP LAYOUT ======== */}
      <div className="hidden md:block rm-desktop-home -m-6 min-h-screen px-10 py-8">
        <div className="rm-desktop-container">
          <div className="rm-desktop-header">
            <div>
              <h1 className="rm-desktop-title"><span className="rm-brand-wordmark">Raymond</span> {t('home.pointsManagement', lang)}</h1>
              <p className="rm-desktop-subtitle">{t('home.smartOps', lang)} · Demo v1.0</p>
            </div>
            <button onClick={handleReset} className="rounded-lg bg-white/5 border border-white/10 px-4 py-2 text-sm text-rm-text-secondary hover:bg-white/10 transition-colors min-h-[44px]">
              {t('home.resetData', lang)}
            </button>
          </div>

          <div className="rm-desktop-grid">
            <section className="rm-premium-card rm-desktop-card rm-premium-shadow">
              <div className="rm-card-watermark rm-brand-wordmark">R</div>
              <div className="rm-card-content">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-white text-xl font-bold tracking-wide rm-brand-serif-title">Raymond</h2>
                    <p className="text-rm-text-secondary text-xs mt-0.5">{t('home.pointsSystem', lang)}</p>
                  </div>
                  <RaymondFlowerMark />
                </div>
                <div className="rm-balance-label">
                  <span>{t('home.availablePoints', lang)}</span>
                  <EyeIcon />
                </div>
                <p className="rm-balance-number rm-ui-number">
                  {totalAvailablePoints.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </p>
              </div>
            </section>

            <section className="rm-desktop-stats rm-depth-card">
              <h3 className="text-white/60 text-xs font-semibold uppercase tracking-wider mb-3">{t('home.systemOverview', lang)}</h3>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: t('home.newMembers', lang), value: todayNewMembers },
                  { label: t('home.todayOrders', lang), value: todayOrders },
                  { label: t('home.expiringAlerts', lang), value: expiringCount },
                  { label: t('home.pendingAudit', lang), value: pendingAuditCount },
                ].map((card) => (
                  <div key={card.label} className="rm-kpi-card">
                    <p className="rm-kpi-label">{card.label}</p>
                    <p className="rm-kpi-value">{card.value}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <nav className="rm-desktop-actions">
            {quickActions.map((item) => (
              <Link key={item.label} href={item.href} className="rm-desktop-action-card rm-depth-card rm-premium-shadow">
                <div className="rm-quick-tile rm-desktop-quick-tile">
                  <QuickIcon icon={item.icon} />
                </div>
                <div>
                  <p className="text-white text-sm font-semibold">{item.label}</p>
                  <p className="text-rm-text-secondary text-[11px] mt-0.5">{t('home.goToManage', lang)}</p>
                </div>
              </Link>
            ))}
          </nav>

          <section className="rm-desktop-panel rm-liquid-card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-rm-text-dark text-lg font-bold">{t('home.coreFeatures', lang)}</h3>
              <Link href="/settings" className="text-rm-text-dark-secondary text-sm hover:text-rm-text-dark transition-colors">
                {t('home.viewAll', lang)} ›
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

          <div className="rm-desktop-bottom-row">
            <div className="rm-raymond-banner rm-desktop-banner">
              <div className="rm-banner-content">
                <span className="rm-banner-title rm-brand-serif-title">Raymond<span className="rm-banner-sub"> | {t('home.smartOps', lang)}</span></span>
                <span className="rm-banner-cta">{t('home.learnMore', lang)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
