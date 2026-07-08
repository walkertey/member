'use client';

import { useEffect, useMemo } from 'react';
import { usePointsStore } from '@/lib/store';
import { getExpiringTransactions } from '@/lib/pointsEngine';
import Link from 'next/link';

export default function DashboardPage() {
  const members = usePointsStore((s) => s.members);
  const orders = usePointsStore((s) => s.orders);
  const pointTransactions = usePointsStore((s) => s.pointTransactions);
  const redemptionRecords = usePointsStore((s) => s.redemptionRecords);
  const settleExpiredPoints = usePointsStore((s) => s.settleExpiredPoints);
  const resetData = usePointsStore((s) => s.resetData);
  const addToast = usePointsStore((s) => s.addToast);

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

  return (
    <div className="min-h-screen bg-rm-bg-deep -m-4 md:-m-6 p-4 md:p-6">
      {/* 顶部品牌条 */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-white text-lg font-bold">
          Raymond{' '}
          <span className="text-sm font-normal text-rm-text-secondary ml-1">积分管理</span>
        </h1>
        <button
          onClick={handleReset}
          className="text-xs text-rm-text-secondary border border-white/15 rounded px-2 py-1.5 min-h-[36px] hover:bg-white/5 transition-colors"
        >
          重置 Demo 数据
        </button>
      </div>

      {/* 金色描边余额卡 */}
      <div className="rm-card-gold-border rounded-2xl p-6 mb-5 bg-rm-bg-card relative overflow-hidden">
        <div className="flex items-center justify-between mb-1">
          <div>
            <h2 className="text-white text-xl font-serif font-bold">Raymond</h2>
            <p className="text-rm-text-secondary text-xs mt-0.5">积 赏 管 理</p>
          </div>
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none" className="text-rm-gold" style={{ filter: 'drop-shadow(0 0 4px rgba(240,180,41,0.35))' }}>
            <path d="M14 2l2.5 8.5h8.5l-7 5.5 2.5 8.5-6.5-5-6.5 5 2.5-8.5-7-5.5h8.5z" fill="currentColor" />
          </svg>
        </div>
        <p className="text-rm-text-secondary text-xs mt-6 mb-1">当前可用积分</p>
        <p className="text-white text-3xl font-bold tracking-tight">
          {totalAvailablePoints.toLocaleString('en-US', { minimumFractionDigits: 2 })}
        </p>
      </div>

      {/* 4宫格快捷入口 */}
      <div className="grid grid-cols-4 gap-3 mb-5">
        {quickActions.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className="flex flex-col items-center gap-2"
          >
            <div className="w-14 h-14 rounded-xl bg-rm-bg-card flex items-center justify-center border border-white/10">
              {item.icon === 'grant' && (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-rm-gold" style={{ filter: 'drop-shadow(0 0 3px rgba(240,180,41,0.25))' }}>
                  <rect x="3" y="8" width="18" height="13" rx="2" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M3 8l9-6 9 6" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                  <line x1="12" y1="13" x2="12" y2="17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  <circle cx="12" cy="11" r="1" fill="currentColor" />
                </svg>
              )}
              {item.icon === 'exchange' && (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-rm-gold" style={{ filter: 'drop-shadow(0 0 3px rgba(240,180,41,0.25))' }}>
                  <polyline points="17,1 21,5 17,9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                  <path d="M3 11V9a4 4 0 014-4h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none" />
                  <polyline points="7,23 3,19 7,15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                  <path d="M21 13v2a4 4 0 01-4 4H3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none" />
                </svg>
              )}
              {item.icon === 'record' && (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-rm-gold" style={{ filter: 'drop-shadow(0 0 3px rgba(240,180,41,0.25))' }}>
                  <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                  <polyline points="14,2 14,8 20,8" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                  <line x1="8" y1="13" x2="16" y2="13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  <line x1="8" y1="17" x2="16" y2="17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              )}
              {item.icon === 'permission' && (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-rm-gold" style={{ filter: 'drop-shadow(0 0 3px rgba(240,180,41,0.25))' }}>
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                  <polyline points="9,12 11,14 15,10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </div>
            <span className="text-rm-text-secondary text-[11px]">{item.label}</span>
          </Link>
        ))}
      </div>

      {/* 白色"核心功能"卡片区 */}
      <div className="bg-rm-bg-light rounded-2xl p-5 mb-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-rm-text-dark font-semibold text-base">核心功能</h3>
          <Link href="/settings" className="text-rm-text-dark-secondary text-xs">
            全部 ›
          </Link>
        </div>
        <div className="grid grid-cols-4 gap-y-5">
          {coreFeatures.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="flex flex-col items-center gap-2"
            >
              <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center border border-rm-border-light">
                {item.icon === 'member' && (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-[#3b82f6]">
                    <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.5" />
                    <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                )}
                {item.icon === 'shop' && (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-[#f59e0b]">
                    <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                    <line x1="3" y1="6" x2="21" y2="6" stroke="currentColor" strokeWidth="1.5" />
                    <path d="M16 10a4 4 0 01-8 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                )}
                {item.icon === 'report' && (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-[#06b6d4]">
                    <rect x="3" y="13" width="4" height="7" rx="1" fill="currentColor" opacity="0.3" />
                    <rect x="10" y="9" width="4" height="11" rx="1" fill="currentColor" opacity="0.6" />
                    <rect x="17" y="5" width="4" height="15" rx="1" fill="currentColor" />
                  </svg>
                )}
                {item.icon === 'marketing' && (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-[#ef4444]">
                    <path d="M18 8a3 3 0 000-6M18 8a3 3 0 010 6m-7 4v2m0 0v2m0-2h3m-3 0H8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    <rect x="4" y="3" width="14" height="7" rx="2" stroke="currentColor" strokeWidth="1.5" />
                    <circle cx="11" cy="6.5" r="1.5" fill="currentColor" />
                  </svg>
                )}
                {item.icon === 'rule' && (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-[#6366f1]">
                    <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" />
                    <path d="M12 1v2m0 18v2m-9.9-11h2m15.8 0h2M4.2 4.2l1.4 1.4m12.8 12.8l1.4 1.4M2 12h2m16 0h2M4.2 19.8l1.4-1.4m12.8-12.8l1.4-1.4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                )}
                {item.icon === 'staff' && (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-[#06b6d4]">
                    <circle cx="9" cy="7" r="3" stroke="currentColor" strokeWidth="1.5" />
                    <circle cx="16" cy="7" r="2" stroke="currentColor" strokeWidth="1.5" />
                    <path d="M3 20c0-3 2.7-5.5 6-5.5M13.5 19c0-2.5 2.5-4 4-4s4 1.5 4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                )}
                {item.icon === 'audit' && (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-[#3b82f6]">
                    <rect x="3" y="4" width="14" height="16" rx="2" stroke="currentColor" strokeWidth="1.5" />
                    <polyline points="7,9 10,12 7,15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                    <path d="M13 10h6m-6 4h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                )}
                {item.icon === 'more' && (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-[#8b5cf6]">
                    <circle cx="12" cy="5" r="1.5" fill="currentColor" />
                    <circle cx="12" cy="12" r="1.5" fill="currentColor" />
                    <circle cx="12" cy="19" r="1.5" fill="currentColor" />
                    <circle cx="5" cy="12" r="1.5" fill="currentColor" />
                    <circle cx="19" cy="12" r="1.5" fill="currentColor" />
                  </svg>
                )}
              </div>
              <span className="text-rm-text-dark text-[11px]">{item.label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* 统计卡片（保留原有数据逻辑，仅视觉改为深色系） */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { label: '今日新增会员', value: todayNewMembers },
          { label: '今日订单数', value: todayOrders },
          { label: '临期积分预警(30天)', value: expiringCount },
          { label: '待审核兑换', value: pendingAuditCount },
        ].map((card) => (
          <div
            key={card.label}
            className="bg-rm-bg-card rounded-xl p-3 border border-white/10"
          >
            <p className="text-rm-text-secondary text-[11px] mb-1">{card.label}</p>
            <p className="text-white text-lg font-bold">{card.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
