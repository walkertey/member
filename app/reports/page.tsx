'use client';

import { useMemo } from 'react';
import { usePointsStore } from '@/lib/store';

export default function ReportsPage() {
  const members = usePointsStore((s) => s.members);
  const orders = usePointsStore((s) => s.orders);
  const pointTransactions = usePointsStore((s) => s.pointTransactions);
  const products = usePointsStore((s) => s.products);

  // 1. 会员注册统计（按月份）
  const memberRegStats = useMemo(() => {
    const map: Record<string, number> = {};
    members.forEach((m) => {
      const month = m.register_time.slice(0, 7);
      map[month] = (map[month] || 0) + 1;
    });
    return Object.entries(map).sort();
  }, [members]);

  // 2. 配套销售统计（按配套汇总订单金额）
  const productSalesStats = useMemo(() => {
    const map: Record<string, { name: string; count: number; amount: number }> = {};
    orders.forEach((o) => {
      const product = products.find((p) => p.id === o.product_id);
      const key = o.product_id;
      if (!map[key]) {
        map[key] = { name: product?.name ?? key, count: 0, amount: 0 };
      }
      map[key].count++;
      map[key].amount += o.amount;
    });
    return Object.values(map);
  }, [orders, products]);

  // 3. 积分发行 vs 消耗
  const pointsIssuedVsConsumed = useMemo(() => {
    const issued = pointTransactions
      .filter((tx) => tx.amount > 0)
      .reduce((s, tx) => s + tx.amount, 0);
    const consumed = pointTransactions
      .filter((tx) => tx.amount < 0)
      .reduce((s, tx) => s + Math.abs(tx.amount), 0);
    return { issued, consumed };
  }, [pointTransactions]);

  // 4. 员工业绩（按 operator_id 分组统计订单数）
  const staffPerformance = useMemo(() => {
    const map: Record<string, number> = {};
    orders.forEach((o) => {
      map[o.operator_id] = (map[o.operator_id] || 0) + 1;
    });
    return Object.entries(map).sort((a, b) => b[1] - a[1]);
  }, [orders]);

  return (
    <div className="max-w-6xl mx-auto">
      <h2 className="text-xl font-semibold text-zinc-800 mb-6">报表中心</h2>

      <div className="grid grid-cols-2 gap-6">
        {/* 会员注册统计 */}
        <div className="bg-white border border-zinc-200 rounded-lg p-5">
          <h3 className="text-md font-semibold text-zinc-700 mb-4">会员注册统计（按月）</h3>
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-zinc-50 border-b border-zinc-200">
                <th className="text-left px-3 py-2 font-medium text-zinc-600">月份</th>
                <th className="text-right px-3 py-2 font-medium text-zinc-600">新增会员</th>
              </tr>
            </thead>
            <tbody>
              {memberRegStats.map(([month, count]) => (
                <tr key={month} className="border-b border-zinc-100">
                  <td className="px-3 py-2">{month}</td>
                  <td className="px-3 py-2 text-right font-medium">{count}</td>
                </tr>
              ))}
              <tr className="bg-zinc-50 font-medium">
                <td className="px-3 py-2">合计</td>
                <td className="px-3 py-2 text-right">{members.length}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* 配套销售统计 */}
        <div className="bg-white border border-zinc-200 rounded-lg p-5">
          <h3 className="text-md font-semibold text-zinc-700 mb-4">配套销售统计</h3>
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-zinc-50 border-b border-zinc-200">
                <th className="text-left px-3 py-2 font-medium text-zinc-600">配套</th>
                <th className="text-right px-3 py-2 font-medium text-zinc-600">订单数</th>
                <th className="text-right px-3 py-2 font-medium text-zinc-600">销售总额</th>
              </tr>
            </thead>
            <tbody>
              {productSalesStats.map((p) => (
                <tr key={p.name} className="border-b border-zinc-100">
                  <td className="px-3 py-2">{p.name}</td>
                  <td className="px-3 py-2 text-right">{p.count}</td>
                  <td className="px-3 py-2 text-right font-medium">
                    RM {p.amount.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 积分发行 vs 消耗 */}
        <div className="bg-white border border-zinc-200 rounded-lg p-5">
          <h3 className="text-md font-semibold text-zinc-700 mb-4">积分发行 vs 消耗</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-center">
              <div className="text-xs text-green-600 mb-1">正向发行</div>
              <div className="text-2xl font-bold text-green-700">
                {pointsIssuedVsConsumed.issued.toLocaleString()}
              </div>
            </div>
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-center">
              <div className="text-xs text-red-600 mb-1">已消耗</div>
              <div className="text-2xl font-bold text-red-700">
                {pointsIssuedVsConsumed.consumed.toLocaleString()}
              </div>
            </div>
          </div>
        </div>

        {/* 员工业绩 */}
        <div className="bg-white border border-zinc-200 rounded-lg p-5">
          <h3 className="text-md font-semibold text-zinc-700 mb-4">员工业绩（按操作员分组）</h3>
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-zinc-50 border-b border-zinc-200">
                <th className="text-left px-3 py-2 font-medium text-zinc-600">操作员</th>
                <th className="text-right px-3 py-2 font-medium text-zinc-600">订单数</th>
              </tr>
            </thead>
            <tbody>
              {staffPerformance.map(([op, count]) => (
                <tr key={op} className="border-b border-zinc-100">
                  <td className="px-3 py-2">{op}</td>
                  <td className="px-3 py-2 text-right font-medium">{count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
