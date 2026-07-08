'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { usePointsStore } from '@/lib/store';
import { getVisibleMenu, type MenuItem } from '@/lib/permissions';
import RoleSwitcher from '@/components/RoleSwitcher';
import ToastContainer from '@/components/Toast';

function NavLinks({ items, pathname }: { items: MenuItem[]; pathname: string }) {
  return (
    <>
      {items.map((item) => {
        const isActive =
          item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
        return (
          <Link
            key={item.key}
            href={item.href}
            className={`block px-3 py-2.5 rounded text-sm transition-colors ${
              isActive
                ? 'bg-rm-gold-soft text-rm-gold font-medium'
                : 'text-rm-text-secondary hover:bg-white/5'
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </>
  );
}

export default function SidebarLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const currentRole = usePointsStore((s) => s.currentRole);
  const hasHydrated = usePointsStore((s) => s._hasHydrated);
  const visibleMenu = getVisibleMenu(currentRole);
  // Derive drawer state from pathname to auto-close on route change
  const [drawerOriginPath, setDrawerOriginPath] = useState<string | null>(null);
  const drawerOpen = drawerOriginPath === pathname;
  const openDrawer = () => setDrawerOriginPath(pathname);
  const closeDrawer = () => setDrawerOriginPath(null);

  // Close drawer on escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeDrawer();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  // Prevent body scroll when drawer is open on mobile
  useEffect(() => {
    if (drawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [drawerOpen]);

  if (!hasHydrated) {
    return (
      <div className="flex h-screen bg-rm-bg-deep items-center justify-center">
        <p className="text-rm-text-secondary text-sm">加载中...</p>
      </div>
    );
  }

  const currentPageLabel =
    visibleMenu.find((m) => {
      if (m.href === '/') return pathname === '/';
      return pathname.startsWith(m.href);
    })?.label ?? '工作台';

  return (
    <div className="flex flex-col h-screen bg-rm-bg-deep">
      {/* Top Header (mobile + desktop) */}
      <header className="h-14 bg-rm-bg-deep border-b border-white/10 flex items-center shrink-0 px-3 md:px-6 gap-3">
        {/* Hamburger menu button — mobile only */}
        <button
          onClick={() => openDrawer()}
          className="md:hidden flex items-center justify-center min-w-[44px] min-h-[44px] -ml-1 rounded text-white/80 hover:bg-white/5 transition-colors"
          aria-label="打开菜单"
        >
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M3 5h16" />
            <path d="M3 11h16" />
            <path d="M3 17h16" />
          </svg>
        </button>

        {/* Brand / page title */}
        <div className="flex-1 min-w-0">
          <h1 className="text-base md:text-lg font-bold text-white truncate">
            <span className="hidden md:inline">Raymond 积分管理</span>
            <span className="md:hidden">{currentPageLabel}</span>
          </h1>
          {currentRole && (
            <p className="text-xs text-rm-text-secondary hidden md:block">Demo v1.0</p>
          )}
        </div>

        {/* Role Switcher */}
        <RoleSwitcher />
      </header>

      {/* Desktop layout: sidebar + content */}
      <div className="flex-1 flex min-h-0">
        {/* Desktop sidebar — hidden on mobile */}
        <aside className="hidden md:flex w-56 bg-rm-bg-card border-r border-white/10 flex-col shrink-0">
          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
            <NavLinks items={visibleMenu} pathname={pathname} />
          </nav>
          <div className="px-3 py-3 border-t border-white/10 text-xs text-rm-text-secondary">
            当前角色: {currentRole}
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 pb-20 md:pb-6">
          {children}
        </main>
      </div>

      {/* Mobile bottom Tab Bar — hidden on desktop */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-rm-bg-deep border-t border-white/10 flex items-center justify-around rm-tabbar-safe pt-2 z-30">
        {[
          { key: 'home', label: '首页', href: '/' },
          { key: 'points', label: '积分', href: '/points' },
          { key: 'discover', label: '发现', href: '/redemption' },
          { key: 'manage', label: '管理', href: '/permissions' },
          { key: 'profile', label: '我的', href: '/settings' },
        ].map((tab) => {
          const isActive =
            tab.href === '/' ? pathname === '/' : pathname.startsWith(tab.href);
          return (
            <Link
              key={tab.key}
              href={tab.href}
              className={`flex flex-col items-center gap-1 min-w-[44px] min-h-[44px] justify-center ${
                isActive ? 'text-rm-gold' : 'text-white/50'
              }`}
            >
              <span className="inline-flex items-center justify-center w-6 h-6">
                {tab.key === 'home' && (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                    <polyline points="9,22 9,12 15,12 15,22" />
                  </svg>
                )}
                {tab.key === 'points' && (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
                  </svg>
                )}
                {tab.key === 'discover' && (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <polygon points="16.24,7.76 14.12,14.12 7.76,16.24 9.88,9.88 16.24,7.76" />
                  </svg>
                )}
                {tab.key === 'manage' && (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="7" height="7" rx="1" />
                    <rect x="14" y="3" width="7" height="7" rx="1" />
                    <rect x="3" y="14" width="7" height="7" rx="1" />
                    <rect x="14" y="14" width="7" height="7" rx="1" />
                  </svg>
                )}
                {tab.key === 'profile' && (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                )}
              </span>
              <span className="text-[10px]">{tab.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Mobile drawer overlay */}
      {drawerOpen && (
        <div className="md:hidden fixed inset-0 z-40 flex">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => closeDrawer()}
            aria-hidden="true"
          />

          {/* Drawer panel */}
          <div className="relative w-64 max-w-[80vw] bg-rm-bg-card h-full flex flex-col shadow-xl animate-slide-in">
            <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-white">Raymond 积分管理</h2>
                <p className="text-xs text-rm-text-secondary">Demo v1.0</p>
              </div>
              <button
                onClick={() => closeDrawer()}
                className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded text-white/60 hover:bg-white/5 transition-colors"
                aria-label="关闭菜单"
              >
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M4 4l10 10M14 4l-10 10" />
                </svg>
              </button>
            </div>
            <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
              <NavLinks items={visibleMenu} pathname={pathname} />
            </nav>
            <div className="px-3 py-3 border-t border-white/10 text-xs text-rm-text-secondary">
              当前角色: {currentRole}
            </div>
          </div>
        </div>
      )}

      {/* Toast notifications */}
      <ToastContainer />
    </div>
  );
}
