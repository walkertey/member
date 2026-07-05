'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { usePointsStore } from '@/lib/store';
import { getVisibleMenu } from '@/lib/permissions';
import RoleSwitcher from '@/components/RoleSwitcher';
import ToastContainer from '@/components/Toast';

export default function SidebarLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const currentRole = usePointsStore((s) => s.currentRole);
  const hasHydrated = usePointsStore((s) => s._hasHydrated);
  const visibleMenu = getVisibleMenu(currentRole);

  if (!hasHydrated) {
    return (
      <div className="flex h-screen bg-zinc-50 items-center justify-center">
        <p className="text-zinc-400 text-sm">加载中...</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-zinc-50">
      {/* 左侧导航 */}
      <aside className="w-56 bg-white border-r border-zinc-200 flex flex-col shrink-0">
        <div className="px-5 py-4 border-b border-zinc-200">
          <h1 className="text-lg font-bold text-zinc-800">CGO 会员积分系统</h1>
          <p className="text-xs text-zinc-400 mt-0.5">Demo v1.0</p>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {visibleMenu.map((item) => {
            const isActive =
              item.href === '/'
                ? pathname === '/'
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.key}
                href={item.href}
                className={`block px-3 py-2 rounded text-sm transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 font-medium'
                    : 'text-zinc-600 hover:bg-zinc-100'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="px-3 py-3 border-t border-zinc-200 text-xs text-zinc-400">
          当前角色: {currentRole}
        </div>
      </aside>

      {/* 右侧内容区 */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* 顶部 Header */}
        <header className="h-14 bg-white border-b border-zinc-200 flex items-center justify-between px-6 shrink-0">
          <div className="text-sm text-zinc-600">
            {visibleMenu.find((m) => {
              if (m.href === '/') return pathname === '/';
              return pathname.startsWith(m.href);
            })?.label ?? '工作台'}
          </div>
          <RoleSwitcher />
        </header>

        {/* 主内容区 */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>

      {/* Toast 通知 */}
      <ToastContainer />
    </div>
  );
}
