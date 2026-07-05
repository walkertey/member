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
                ? 'bg-blue-50 text-blue-700 font-medium'
                : 'text-zinc-600 hover:bg-zinc-100'
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
      <div className="flex h-screen bg-zinc-50 items-center justify-center">
        <p className="text-zinc-400 text-sm">加载中...</p>
      </div>
    );
  }

  const currentPageLabel =
    visibleMenu.find((m) => {
      if (m.href === '/') return pathname === '/';
      return pathname.startsWith(m.href);
    })?.label ?? '工作台';

  return (
    <div className="flex flex-col h-screen bg-zinc-50">
      {/* Top Header (mobile + desktop) */}
      <header className="h-14 bg-white border-b border-zinc-200 flex items-center shrink-0 px-3 md:px-6 gap-3">
        {/* Hamburger menu button — mobile only */}
        <button
          onClick={() => openDrawer()}
          className="md:hidden flex items-center justify-center min-w-[44px] min-h-[44px] -ml-1 rounded text-zinc-600 hover:bg-zinc-100 transition-colors"
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
          <h1 className="text-base md:text-lg font-bold text-zinc-800 truncate">
            <span className="hidden md:inline">CGO 会员积分系统</span>
            <span className="md:hidden">{currentPageLabel}</span>
          </h1>
          {currentRole && (
            <p className="text-xs text-zinc-400 hidden md:block">Demo v1.0</p>
          )}
        </div>

        {/* Role Switcher */}
        <RoleSwitcher />
      </header>

      {/* Desktop layout: sidebar + content */}
      <div className="flex-1 flex min-h-0">
        {/* Desktop sidebar — hidden on mobile */}
        <aside className="hidden md:flex w-56 bg-white border-r border-zinc-200 flex-col shrink-0">
          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
            <NavLinks items={visibleMenu} pathname={pathname} />
          </nav>
          <div className="px-3 py-3 border-t border-zinc-200 text-xs text-zinc-400">
            当前角色: {currentRole}
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 pb-safe">
          {children}
        </main>
      </div>

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
          <div className="relative w-64 max-w-[80vw] bg-white h-full flex flex-col shadow-xl animate-slide-in">
            <div className="px-5 py-4 border-b border-zinc-200 flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-zinc-800">CGO 会员积分系统</h2>
                <p className="text-xs text-zinc-400">Demo v1.0</p>
              </div>
              <button
                onClick={() => closeDrawer()}
                className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded text-zinc-500 hover:bg-zinc-100 transition-colors"
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
            <div className="px-3 py-3 border-t border-zinc-200 text-xs text-zinc-400">
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
