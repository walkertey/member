'use client';

import { useEffect, useState, useMemo } from 'react';
import { usePointsStore } from '@/lib/store';
import { getExpiringTransactions } from '@/lib/pointsEngine';
import { translate } from '@/lib/i18n';

export default function PointsPage() {
  const pointTransactions = usePointsStore((s) => s.pointTransactions);
  const members = usePointsStore((s) => s.members);
  const settleExpiredPoints = usePointsStore((s) => s.settleExpiredPoints);
  const currentRole = usePointsStore((s) => s.currentRole);
  const locale = usePointsStore((s) => s.locale);
  const isIntern = currentRole === '实习生';

  const [activeTab, setActiveTab] = useState<'all' | 'expiring'>('all');

  const [filterMember, setFilterMember] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterDateFrom, setFilterDateFrom] = useState('');
  const [filterDateTo, setFilterDateTo] = useState('');

  useEffect(() => {
    settleExpiredPoints();
  }, [settleExpiredPoints]);

  const filteredTransactions = useMemo(() => {
    return pointTransactions
      .filter((tx) => {
        if (filterMember && tx.member_id !== filterMember) return false;
        if (filterType && tx.trans_type !== filterType) return false;
        if (filterDateFrom && tx.create_time < filterDateFrom) return false;
        if (filterDateTo && tx.create_time > filterDateTo + 'T23:59:59.999Z') return false;
        return true;
      })
      .sort((a, b) => new Date(b.create_time).getTime() - new Date(a.create_time).getTime());
  }, [pointTransactions, filterMember, filterType, filterDateFrom, filterDateTo]);

  const expiringTransactions = useMemo(
    () => getExpiringTransactions(pointTransactions, members, 30),
    [pointTransactions, members]
  );

  const transTypes = ['购买', '推荐30%', '批量奖励', '兑换扣除', '后台调整'];

  const transTypeBadge = (type: string) => {
    const map: Record<string, string> = {
      '购买': 'rm-badge-info',
      '推荐30%': 'rm-badge-success',
      '批量奖励': 'rm-badge-gold',
      '兑换扣除': 'rm-badge-warning',
    };
    return map[type] ?? 'rm-badge-neutral';
  };

  return (
    <div className="max-w-6xl mx-auto rm-demo-page">
      <div className="rm-demo-hero">
        <div>
          <h2 className="rm-demo-title">{translate(locale, 'points.title')}</h2>
          <p className="rm-demo-subtitle">积分流水总览 · 到期预警</p>
        </div>
        {isIntern && (
          <span className="rm-badge rm-badge-warning">实习生 · 只读</span>
        )}
      </div>

      {/* Tab switch */}
      <div className="flex border-b border-[var(--rm-border-light)] mb-5 overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-4 py-2.5 text-sm font-bold transition-colors border-b-2 -mb-px whitespace-nowrap min-h-[44px] ${
            activeTab === 'all'
              ? 'border-[var(--rm-gold)] text-[var(--rm-gold-deep)]'
              : 'border-transparent text-rm-text-dark-secondary hover:text-rm-text-dark'
          }`}
        >
          流水总表
        </button>
        <button
          onClick={() => setActiveTab('expiring')}
          className={`px-4 py-2.5 text-sm font-bold transition-colors border-b-2 -mb-px whitespace-nowrap min-h-[44px] ${
            activeTab === 'expiring'
              ? 'border-[var(--rm-gold)] text-[var(--rm-gold-deep)]'
              : 'border-transparent text-rm-text-dark-secondary hover:text-rm-text-dark'
          }`}
        >
          到期预警
          {expiringTransactions.length > 0 && (
            <span className="ml-1.5 rm-badge rm-badge-danger">
              {expiringTransactions.length}
            </span>
          )}
        </button>
      </div>

      {activeTab === 'all' && (
        <div>
          {/* Filters */}
          <div className="flex gap-2 md:gap-3 mb-4 flex-wrap">
            <select value={filterMember} onChange={(e) => setFilterMember(e.target.value)} className="rm-demo-filter">
              <option value="">全部会员</option>
              {members.map((m) => (
                <option key={m.id} value={m.id}>{m.name}</option>
              ))}
            </select>
            <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="rm-demo-filter">
              <option value="">全部类型</option>
              {transTypes.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
            <input type="date" value={filterDateFrom} onChange={(e) => setFilterDateFrom(e.target.value)} className="rm-demo-filter" placeholder="开始日期" />
            <input type="date" value={filterDateTo} onChange={(e) => setFilterDateTo(e.target.value)} className="rm-demo-filter" placeholder="结束日期" />
            {(filterMember || filterType || filterDateFrom || filterDateTo) && (
              <button
                onClick={() => { setFilterMember(''); setFilterType(''); setFilterDateFrom(''); setFilterDateTo(''); }}
                className="rm-demo-link text-sm min-h-[44px] px-3"
              >
                清除筛选
              </button>
            )}
          </div>

          {/* Transactions table */}
          <div className="rm-demo-table-wrap">
            <table className="rm-demo-table min-w-[750px]">
              <thead>
                <tr>
                  <th>时间</th>
                  <th>会员</th>
                  <th>类型</th>
                  <th className="text-right">变动</th>
                  <th className="text-right">变动前</th>
                  <th className="text-right">变动后</th>
                  <th>到期日</th>
                  <th>备注</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((tx) => {
                  const member = members.find((m) => m.id === tx.member_id);
                  const isExpired = tx.expiry_status === '已到期';
                  return (
                    <tr key={tx.id} className={isExpired ? 'bg-red-50/50' : ''}>
                      <td className="text-xs">{new Date(tx.create_time).toLocaleString('zh-CN')}</td>
                      <td>{member?.name ?? tx.member_id}</td>
                      <td><span className={`rm-badge ${transTypeBadge(tx.trans_type)}`}>{tx.trans_type}</span></td>
                      <td className={`text-right font-bold rm-demo-number ${tx.amount > 0 ? 'text-emerald-700' : 'text-red-600'}`}>
                        {tx.amount > 0 ? '+' : ''}{tx.amount.toLocaleString()}
                        {isExpired && <span className="ml-1">⚠️</span>}
                      </td>
                      <td className="text-right text-rm-text-dark-secondary">{tx.balance_before.toLocaleString()}</td>
                      <td className="text-right">{tx.balance_after.toLocaleString()}</td>
                      <td className="text-xs text-rm-text-dark-secondary">
                        {tx.expiry_date ? new Date(tx.expiry_date).toLocaleDateString('zh-CN') : '-'}
                      </td>
                      <td className="text-xs text-rm-text-dark-secondary max-w-[150px] truncate">{tx.remark}</td>
                    </tr>
                  );
                })}
                {filteredTransactions.length === 0 && (
                  <tr><td colSpan={8} className="text-center text-rm-text-dark-secondary py-6">暂无记录</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'expiring' && (
        <div>
          <p className="text-sm text-rm-text-dark-secondary mb-4">
            以下为未来 30 天内即将到期的积分流水（按剩余天数升序排列）
          </p>
          <div className="rm-demo-table-wrap">
            <table className="rm-demo-table min-w-[550px]">
              <thead>
                <tr>
                  <th>会员</th>
                  <th>类型</th>
                  <th className="text-right">积分数</th>
                  <th>到期日</th>
                  <th className="text-right">剩余天数</th>
                  <th>备注</th>
                </tr>
              </thead>
              <tbody>
                {expiringTransactions.map((tx) => {
                  const urgent = tx.days_left <= 7;
                  return (
                    <tr key={tx.id} className={urgent ? 'bg-red-50/50' : ''}>
                      <td>{tx.member_name}</td>
                      <td><span className="rm-badge rm-badge-info">{tx.trans_type}</span></td>
                      <td className="text-right font-bold rm-demo-number text-emerald-700">+{tx.amount.toLocaleString()}</td>
                      <td className="text-xs">{new Date(tx.expiry_date!).toLocaleDateString('zh-CN')}</td>
                      <td className={`text-right font-bold ${urgent ? 'text-red-600' : 'text-amber-700'}`}>
                        {tx.days_left} 天
                      </td>
                      <td className="text-xs text-rm-text-dark-secondary">{tx.remark}</td>
                    </tr>
                  );
                })}
                {expiringTransactions.length === 0 && (
                  <tr><td colSpan={6} className="text-center text-rm-text-dark-secondary py-6">暂无即将到期的积分</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
