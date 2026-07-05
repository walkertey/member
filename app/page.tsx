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

  const cards = [
    { label: '今日新增会员', value: todayNewMembers, color: 'blue' },
    { label: '今日订单数', value: todayOrders, color: 'green' },
    { label: '临期积分预警(30天)', value: expiringCount, color: 'amber' },
    { label: '待审核兑换', value: pendingAuditCount, color: 'purple' },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-4 md:mb-6">
        <h2 className="text-lg md:text-xl font-semibold text-zinc-800">工作台</h2>
        <button
          onClick={handleReset}
          className="px-3 py-2 text-xs border border-zinc-300 text-zinc-500 rounded hover:bg-zinc-100 transition-colors min-h-[44px]"
        >
          重置 Demo 数据
        </button>
      </div>

      {/* 汇总卡片 — 2 col mobile, 4 col desktop */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8">
        {cards.map((card, i) => (
          <div
            key={i}
            className={`bg-white border border-zinc-200 rounded-lg p-3 md:p-5 ${
              card.color === 'blue'
                ? 'border-l-4 border-l-blue-500'
                : card.color === 'green'
                ? 'border-l-4 border-l-green-500'
                : card.color === 'amber'
                ? 'border-l-4 border-l-amber-500'
                : 'border-l-4 border-l-purple-500'
            }`}
          >
            <div className="text-xs md:text-sm text-zinc-500 mb-1">{card.label}</div>
            <div className="text-2xl md:text-3xl font-bold text-zinc-800">{card.value}</div>
          </div>
        ))}
      </div>

      {/* 快捷入口 — 2 col mobile, 4 col desktop */}
      <div className="bg-white border border-zinc-200 rounded-lg p-4 md:p-5">
        <h3 className="text-sm font-semibold text-zinc-700 mb-3">快捷入口</h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-3">
          <Link
            href="/members"
            className="block p-3 border border-zinc-200 rounded text-center text-sm text-zinc-600 hover:bg-zinc-50 hover:border-blue-300 transition-colors min-h-[44px] flex items-center justify-center"
          >
            会员管理
          </Link>
          <Link
            href="/orders"
            className="block p-3 border border-zinc-200 rounded text-center text-sm text-zinc-600 hover:bg-zinc-50 hover:border-blue-300 transition-colors min-h-[44px] flex items-center justify-center"
          >
            录入订单
          </Link>
          <Link
            href="/points"
            className="block p-3 border border-zinc-200 rounded text-center text-sm text-zinc-600 hover:bg-zinc-50 hover:border-blue-300 transition-colors min-h-[44px] flex items-center justify-center"
          >
            积分中心
          </Link>
          <Link
            href="/redemption"
            className="block p-3 border border-zinc-200 rounded text-center text-sm text-zinc-600 hover:bg-zinc-50 hover:border-blue-300 transition-colors min-h-[44px] flex items-center justify-center"
          >
            兑换商城
          </Link>
        </div>
      </div>
    </div>
  );
}
