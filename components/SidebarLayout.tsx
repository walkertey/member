'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { usePointsStore } from '@/lib/store';
import { getVisibleMenu, type MenuItem } from '@/lib/permissions';
import RoleSwitcher from '@/components/RoleSwitcher';
import ToastContainer from '@/components/Toast';
import LanguageSwitcher from '@/components/raymond-i18n/LanguageSwitcher';
import { useI18n } from '@/components/raymond-i18n/RaymondI18nProvider';
import { t, transRole } from '@/components/raymond-i18n/raymondTranslations';
import type { TranslationKey, SupportedLang } from '@/components/raymond-i18n/raymondTranslations';
import IconTile from '@/components/IconTile';
import type { IconTileColor } from '@/components/IconTile';

const MENU_LABEL_MAP: Record<string, string> = {
  dashboard: 'nav.home',
  members: 'nav.members',
  orders: 'nav.orders',
  points: 'nav.points',
  redemption: 'nav.redemption',
  reports: 'nav.reports',
  settings: 'nav.settings',
  permissions: 'nav.permissions',
};

function NavLinks({ items, pathname, lang }: { items: MenuItem[]; pathname: string; lang: string }) {
  return (
    <>
      {items.map((item) => {
        const isActive = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
        const labelKey = MENU_LABEL_MAP[item.key];
        const displayLabel = labelKey ? t(labelKey as TranslationKey, lang as SupportedLang) : item.label;
        return (
          <Link
            key={item.key}
            href={item.href}
            aria-current={isActive ? 'page' : undefined}
            className={`block rounded px-3 py-2.5 text-sm rm-sidebar-link transition-colors ${
              isActive
                ? 'border-l-[3px] border-rm-gold bg-rm-gold-soft pl-[9px] font-medium text-rm-gold'
                : 'text-rm-text-secondary hover:bg-white/5'
            }`}
          >
            {displayLabel}
          </Link>
        );
      })}
    </>
  );
}

export default function SidebarLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const currentRole = usePointsStore((state) => state.currentRole);
  const hasHydrated = usePointsStore((state) => state._hasHydrated);
  const visibleMenu = getVisibleMenu(currentRole);
  const { lang } = useI18n();
  const [drawerOriginPath, setDrawerOriginPath] = useState<string | null>(null);
  const drawerOpen = drawerOriginPath === pathname;
  const openDrawer = () => setDrawerOriginPath(pathname);
  const closeDrawer = () => setDrawerOriginPath(null);

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeDrawer();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  useEffect(() => {
    document.body.style.overflow = drawerOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [drawerOpen]);

  if (!hasHydrated) {
    return (
      <div className="flex h-dvh items-center justify-center bg-rm-bg-deep">
        <p className="text-sm text-rm-text-secondary">{t('layout.loading', lang)}</p>
      </div>
    );
  }

  const currentPageItem = visibleMenu.find((item) =>
    item.href === '/' ? pathname === '/' : pathname.startsWith(item.href),
  );
  const currentPageLabel = currentPageItem
    ? MENU_LABEL_MAP[currentPageItem.key]
      ? t(MENU_LABEL_MAP[currentPageItem.key] as TranslationKey, lang)
      : currentPageItem.label
    : t('nav.home', lang);

  const isHome = pathname === '/';
  const visibleHrefs = new Set(visibleMenu.map((item) => item.href));
  const mobileTabs = [
    { key: 'home', label: t('nav.home', lang), href: '/', color: 'navy' as IconTileColor },
    { key: 'members', label: t('nav.members', lang), href: '/members', color: 'emerald' as IconTileColor },
    { key: 'points', label: t('nav.points', lang), href: '/points', color: 'blue' as IconTileColor },
    { key: 'discover', label: t('nav.discover', lang), href: '/redemption', color: 'cyan' as IconTileColor },
    {
      key: 'manage',
      label: t('nav.manage', lang),
      href: visibleHrefs.has('/permissions')
        ? '/permissions'
        : visibleHrefs.has('/reports')
          ? '/reports'
          : '/settings',
      color: 'gold' as IconTileColor,
    },
  ].filter(
    (tab, index, all) => visibleHrefs.has(tab.href) && all.findIndex((item) => item.href === tab.href) === index,
  );

  const shellClassName = isHome ? 'flex h-dvh flex-col rm-bg-page' : 'flex h-dvh flex-col rm-subpage-bg';
  const mainClassName = isHome
    ? 'flex-1 overflow-y-auto p-4 pb-20 md:p-6 md:pb-6'
    : 'flex-1 overflow-y-auto p-4 pb-20 text-zinc-900 rm-subpage-bg md:p-6 md:pb-6';

  return (
    <div className={shellClassName}>
      {!isHome && (
        <header className="safe-area-top flex h-14 shrink-0 items-center gap-3 border-b border-white/10 px-3 rm-chrome-glass md:px-6">
          <button
            type="button"
            onClick={openDrawer}
            className="-ml-1 flex min-h-[44px] min-w-[44px] items-center justify-center rounded text-white/80 transition-colors hover:bg-white/5 md:hidden"
            aria-label={t('layout.openMenu', lang)}
          >
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M3 5h16" />
              <path d="M3 11h16" />
              <path d="M3 17h16" />
            </svg>
          </button>

          <div className="min-w-0 flex-1">
            <h1 className="truncate text-base font-bold text-white md:text-lg">
              <span className="hidden rm-brand-wordmark md:inline">Raymond</span>
              <span className="md:hidden">{currentPageLabel}</span>
            </h1>
            <p className="hidden text-xs text-rm-text-secondary md:block">{t('layout.demoVersion', lang)}</p>
          </div>

          <LanguageSwitcher />
          <RoleSwitcher />
        </header>
      )}

      <div className="flex min-h-0 flex-1">
        <aside className="hidden w-56 shrink-0 flex-col border-r border-white/10 rm-chrome-glass md:flex">
          <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
            <NavLinks items={visibleMenu} pathname={pathname} lang={lang} />
          </nav>
          <div className="border-t border-white/10 px-3 py-3 text-xs text-rm-text-secondary">
            {t('layout.currentRole', lang)}: {transRole(currentRole, lang)}
          </div>
        </aside>

        <main className={mainClassName}>{children}</main>
      </div>

      <nav className="fixed bottom-0 left-0 right-0 z-30 flex items-center justify-around gap-1 border-t border-white/10 px-1 pt-2 rm-chrome-glass rm-tabbar-safe md:hidden">
        {mobileTabs.map((tab) => {
          const isActive = tab.href === '/' ? pathname === '/' : pathname.startsWith(tab.href);
          return (
            <Link
              key={tab.key}
              href={tab.href}
              aria-current={isActive ? 'page' : undefined}
              className={`flex min-w-[54px] flex-col items-center gap-0.5 py-1 ${isActive ? 'text-rm-gold' : 'text-white/50'}`}
            >
              <IconTile color={tab.color} size="sm" active={isActive}>
                {tab.key === 'home' && (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                    <polyline points="9,22 9,12 15,12 15,22" />
                  </svg>
                )}
                {tab.key === 'members' && (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                )}
                {tab.key === 'points' && (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 18l3-9 3 5 3-8 3 8 3-5 3 9v2a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                  </svg>
                )}
                {tab.key === 'discover' && (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <polygon points="16.24,7.76 14.12,14.12 7.76,16.24 9.88,9.88 16.24,7.76" />
                  </svg>
                )}
                {tab.key === 'manage' && (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2L3 6v5c0 5.5 4 9 9 11 5-2 9-5.5 9-11V6L12 2z" />
                  </svg>
                )}
              </IconTile>
              <span className="text-[10px]">{tab.label}</span>
            </Link>
          );
        })}
      </nav>

      {drawerOpen && (
        <div className="fixed inset-0 z-40 flex md:hidden" role="dialog" aria-modal="true">
          <button type="button" className="absolute inset-0 bg-black/40" onClick={closeDrawer} aria-label={t('layout.closeMenu', lang)} />
          <div className="relative flex h-full w-64 max-w-[80vw] flex-col shadow-xl rm-chrome-glass animate-slide-in">
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
              <div>
                <h2 className="text-base font-bold text-white rm-brand-wordmark">Raymond</h2>
                <p className="text-xs text-rm-text-secondary">{t('layout.demoVersion', lang)}</p>
              </div>
              <button
                type="button"
                onClick={closeDrawer}
                className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded text-white/60 transition-colors hover:bg-white/5"
                aria-label={t('layout.closeMenu', lang)}
              >
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M4 4l10 10M14 4l-10 10" />
                </svg>
              </button>
            </div>
            <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
              <NavLinks items={visibleMenu} pathname={pathname} lang={lang} />
            </nav>
            <div className="border-t border-white/10 px-3 py-3 text-xs text-rm-text-secondary">
              {t('layout.currentRole', lang)}: {transRole(currentRole, lang)}
            </div>
          </div>
        </div>
      )}

      <ToastContainer />
    </div>
  );
}
