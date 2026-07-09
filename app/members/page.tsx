'use client';

import { useEffect, useMemo } from 'react';
import Link from 'next/link';
import { usePointsStore } from '@/lib/store';
import { translate } from '@/lib/i18n';

export default function MembersPage() {
  const members = usePointsStore((s) => s.members);
  const settleExpiredPoints = usePointsStore((s) => s.settleExpiredPoints);
  const currentRole = usePointsStore((s) => s.currentRole);
  const locale = usePointsStore((s) => s.locale);
  const isIntern = currentRole === '实习生';

  useEffect(() => {
    settleExpiredPoints();
  }, [settleExpiredPoints]);

  const todayStr = useMemo(() => {
    const d = new Date();
    return d.toISOString().slice(0, 10);
  }, []);

  const stats = useMemo(() => {
    const active = members.filter((m) => m.status === '正常').length;
    const totalPoints = members.reduce((s, m) => s + m.total_points, 0);
    const todayNew = members.filter((m) => m.register_time.slice(0, 10) === todayStr).length;
    return { active, totalPoints, todayNew };
  }, [members, todayStr]);

  return (
    <div className="max-w-6xl mx-auto rm-demo-page">
      <div className="rm-demo-hero">
        <div>
          <h2 className="rm-demo-title">{translate(locale, 'members.title')}</h2>
          <p className="rm-demo-subtitle">
            共 {members.length} 名会员 · 活跃 {stats.active} 名
          </p>
        </div>
        {!isIntern && (
          <span className="rm-badge rm-badge-info">管理</span>
        )}
        {isIntern && (
          <span className="rm-badge rm-badge-warning">实习生 · 只读</span>
        )}
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-5">
        {[
          { label: '总会员', value: members.length, accent: 'var(--rm-icon-navy)' },
          { label: '活跃会员', value: stats.active, accent: 'var(--rm-gold)' },
          { label: '积分总额', value: stats.totalPoints.toLocaleString(), accent: 'var(--rm-icon-blue)' },
          { label: '今日新增', value: stats.todayNew, accent: 'var(--rm-gold-deep)' },
        ].map((card) => (
          <div key={card.label} className="rm-stat-card">
            <div className="rm-stat-label">{card.label}</div>
            <div className="rm-stat-value" style={{ color: card.accent }}>
              {card.value}
            </div>
          </div>
        ))}
      </div>

      {/* Member table */}
      <div className="rm-demo-table-wrap">
        <table className="rm-demo-table min-w-[700px]">
          <thead>
            <tr>
              <th>会员编号</th>
              <th>姓名</th>
              <th>手机</th>
              <th className="text-right">总积分</th>
              <th className="text-right">可用积分</th>
              <th className="text-right">已到期</th>
              <th className="text-center">状态</th>
              <th className="text-center">操作</th>
            </tr>
          </thead>
          <tbody>
            {members.map((m) => (
              <tr key={m.id}>
                <td className="font-mono text-xs">{m.member_no}</td>
                <td>{m.name}</td>
                <td className="text-rm-text-dark-secondary">{m.phone}</td>
                <td className="text-right font-medium rm-demo-number">
                  {m.total_points.toLocaleString()}
                </td>
                <td className="text-right font-medium rm-demo-number text-rm-icon-emerald">
                  {m.available_points.toLocaleString()}
                </td>
                <td className="text-right text-rm-text-dark-secondary">
                  {m.expired_points > 0 ? (
                    <span>{m.expired_points.toLocaleString()} ⚠️</span>
                  ) : (
                    '0'
                  )}
                </td>
                <td className="text-center">
                  <span className={`rm-badge ${m.status === '正常' ? 'rm-badge-success' : 'rm-badge-danger'}`}>
                    {m.status}
                  </span>
                </td>
                <td className="text-center">
                  <Link
                    href={`/members/${m.id}`}
                    className="rm-demo-link inline-block min-h-[36px] leading-[36px]"
                  >
                    详情
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
