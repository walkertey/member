'use client';

import { useMemo } from 'react';
import { usePointsStore } from '@/lib/store';
import { translate } from '@/lib/i18n';

export default function ReportsPage() {
  const members = usePointsStore((s) => s.members);
  const orders = usePointsStore((s) => s.orders);
  const pointTransactions = usePointsStore((s) => s.pointTransactions);
  const products = usePointsStore((s) => s.products);
  const locale = usePointsStore((s) => s.locale);

  const memberRegStats = useMemo(() => {
    const map: Record<string, number> = {};
    members.forEach((m) => {
      const month = m.register_time.slice(0, 7);
      map[month] = (map[month] || 0) + 1;
    });
    return Object.entries(map).sort();
  }, [members]);

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

  const pointsIssuedVsConsumed = useMemo(() => {
    const issued = pointTransactions
      .filter((tx) => tx.amount > 0)
      .reduce((s, tx) => s + tx.amount, 0);
    const consumed = pointTransactions
      .filter((tx) => tx.amount < 0)
      .reduce((s, tx) => s + Math.abs(tx.amount), 0);
    return { issued, consumed };
  }, [pointTransactions]);

  const staffPerformance = useMemo(() => {
    const map: Record<string, number> = {};
    orders.forEach((o) => {
      map[o.operator_id] = (map[o.operator_id] || 0) + 1;
    });
    return Object.entries(map).sort((a, b) => b[1] - a[1]);
  }, [orders]);

  return (
    <div className="max-w-6xl mx-auto rm-demo-page">
      <div className="rm-demo-hero">
        <div>
          <h2 className="rm-demo-title">{translate(locale, 'reports.title')}</h2>
          <p className="rm-demo-subtitle">业务数据分析 · 关键指标一览</p>
        </div>
      </div>

      {/* KPI overview — dark cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-5">
        {[
          { label: '总会员数', value: members.length },
          { label: '总订单', value: orders.length },
          { label: '积分发行', value: pointsIssuedVsConsumed.issued.toLocaleString() },
          { label: '积分消耗', value: pointsIssuedVsConsumed.consumed.toLocaleString() },
        ].map((kpi) => (
          <div key={kpi.label} className="rm-demo-card-dark rounded-xl p-4 text-center">
            <div className="text-xs text-rm-text-secondary mb-1 font-bold uppercase tracking-wider">{kpi.label}</div>
            <div className="text-2xl font-black rm-demo-number text-white">{kpi.value}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Member registration */}
        <div className="rm-demo-card p-4 md:p-5">
          <h3 className="text-md font-bold text-rm-text-dark mb-4">会员注册统计（按月）</h3>
          <div className="rm-demo-table-wrap">
            <table className="rm-demo-table min-w-[200px]">
              <thead>
                <tr>
                  <th>月份</th>
                  <th className="text-right">新增会员</th>
                </tr>
              </thead>
              <tbody>
                {memberRegStats.map(([month, count]) => (
                  <tr key={month}>
                    <td>{month}</td>
                    <td className="text-right font-medium">{count}</td>
                  </tr>
                ))}
                <tr className="bg-zinc-50 font-bold">
                  <td>合计</td>
                  <td className="text-right">{members.length}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Product sales */}
        <div className="rm-demo-card p-4 md:p-5">
          <h3 className="text-md font-bold text-rm-text-dark mb-4">配套销售统计</h3>
          <div className="rm-demo-table-wrap">
            <table className="rm-demo-table min-w-[250px]">
              <thead>
                <tr>
                  <th>配套</th>
                  <th className="text-right">订单数</th>
                  <th className="text-right">销售总额</th>
                </tr>
              </thead>
              <tbody>
                {productSalesStats.map((p) => (
                  <tr key={p.name}>
                    <td>{p.name}</td>
                    <td className="text-right">{p.count}</td>
                    <td className="text-right font-bold rm-demo-number">RM {p.amount.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Points issued vs consumed */}
        <div className="rm-demo-card p-4 md:p-5">
          <h3 className="text-md font-bold text-rm-text-dark mb-4">积分发行 vs 消耗</h3>
          <div className="grid grid-cols-2 gap-3 md:gap-4">
            <div className="rm-stat-card text-center">
              <div className="rm-stat-label">正向发行</div>
              <div className="rm-stat-value" style={{ color: 'var(--rm-gold-deep)' }}>
                {pointsIssuedVsConsumed.issued.toLocaleString()}
              </div>
            </div>
            <div className="rm-stat-card text-center">
              <div className="rm-stat-label">已消耗</div>
              <div className="rm-stat-value" style={{ color: 'var(--rm-icon-red)' }}>
                {pointsIssuedVsConsumed.consumed.toLocaleString()}
              </div>
            </div>
          </div>
        </div>

        {/* Staff performance */}
        <div className="rm-demo-card p-4 md:p-5">
          <h3 className="text-md font-bold text-rm-text-dark mb-4">员工业绩（按操作员分组）</h3>
          <div className="rm-demo-table-wrap">
            <table className="rm-demo-table min-w-[200px]">
              <thead>
                <tr>
                  <th>操作员</th>
                  <th className="text-right">订单数</th>
                </tr>
              </thead>
              <tbody>
                {staffPerformance.map(([op, count]) => (
                  <tr key={op}>
                    <td>{op}</td>
                    <td className="text-right font-medium">{count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
