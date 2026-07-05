'use client';

import { useEffect, useState, useMemo } from 'react';
import { usePointsStore } from '@/lib/store';
import { getExpiringTransactions } from '@/lib/pointsEngine';

export default function PointsPage() {
  const pointTransactions = usePointsStore((s) => s.pointTransactions);
  const members = usePointsStore((s) => s.members);
  const settleExpiredPoints = usePointsStore((s) => s.settleExpiredPoints);
  const currentRole = usePointsStore((s) => s.currentRole);
  const isIntern = currentRole === '实习生';

  const [activeTab, setActiveTab] = useState<'all' | 'expiring'>('all');

  // 筛选
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

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-zinc-800">积分中心</h2>
        {isIntern && (
          <span className="text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded">
            实习生 — 只读模式
          </span>
        )}
      </div>

      {/* Tab 切换 */}
      <div className="flex border-b border-zinc-200 mb-6">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px ${
            activeTab === 'all'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-zinc-500 hover:text-zinc-700'
          }`}
        >
          流水总表
        </button>
        <button
          onClick={() => setActiveTab('expiring')}
          className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px ${
            activeTab === 'expiring'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-zinc-500 hover:text-zinc-700'
          }`}
        >
          到期预警
          {expiringTransactions.length > 0 && (
            <span className="ml-1.5 px-1.5 py-0.5 text-xs bg-red-100 text-red-600 rounded-full">
              {expiringTransactions.length}
            </span>
          )}
        </button>
      </div>

      {activeTab === 'all' && (
        <div>
          {/* 筛选栏 */}
          <div className="flex gap-3 mb-4 flex-wrap">
            <select
              value={filterMember}
              onChange={(e) => setFilterMember(e.target.value)}
              className="text-sm border border-zinc-300 rounded px-2 py-1.5"
            >
              <option value="">全部会员</option>
              {members.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="text-sm border border-zinc-300 rounded px-2 py-1.5"
            >
              <option value="">全部类型</option>
              {transTypes.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
            <input
              type="date"
              value={filterDateFrom}
              onChange={(e) => setFilterDateFrom(e.target.value)}
              className="text-sm border border-zinc-300 rounded px-2 py-1.5"
              placeholder="开始日期"
            />
            <input
              type="date"
              value={filterDateTo}
              onChange={(e) => setFilterDateTo(e.target.value)}
              className="text-sm border border-zinc-300 rounded px-2 py-1.5"
              placeholder="结束日期"
            />
            {(filterMember || filterType || filterDateFrom || filterDateTo) && (
              <button
                onClick={() => {
                  setFilterMember('');
                  setFilterType('');
                  setFilterDateFrom('');
                  setFilterDateTo('');
                }}
                className="text-sm text-blue-600 hover:underline"
              >
                清除筛选
              </button>
            )}
          </div>

          {/* 流水表 */}
          <div className="bg-white border border-zinc-200 rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-zinc-50 border-b border-zinc-200">
                  <th className="text-left px-3 py-2 font-medium text-zinc-600">时间</th>
                  <th className="text-left px-3 py-2 font-medium text-zinc-600">会员</th>
                  <th className="text-left px-3 py-2 font-medium text-zinc-600">类型</th>
                  <th className="text-right px-3 py-2 font-medium text-zinc-600">变动</th>
                  <th className="text-right px-3 py-2 font-medium text-zinc-600">变动前</th>
                  <th className="text-right px-3 py-2 font-medium text-zinc-600">变动后</th>
                  <th className="text-left px-3 py-2 font-medium text-zinc-600">到期日</th>
                  <th className="text-left px-3 py-2 font-medium text-zinc-600">备注</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((tx) => {
                  const member = members.find((m) => m.id === tx.member_id);
                  return (
                    <tr
                      key={tx.id}
                      className={`border-b border-zinc-100 hover:bg-zinc-50 ${
                        tx.expiry_status === '已到期' ? 'bg-red-50' : ''
                      }`}
                    >
                      <td className="px-3 py-2 text-xs">
                        {new Date(tx.create_time).toLocaleString('zh-CN')}
                      </td>
                      <td className="px-3 py-2">{member?.name ?? tx.member_id}</td>
                      <td className="px-3 py-2">
                        <span
                          className={`px-1.5 py-0.5 text-xs rounded ${
                            tx.trans_type === '购买'
                              ? 'bg-blue-50 text-blue-700'
                              : tx.trans_type === '推荐30%'
                              ? 'bg-green-50 text-green-700'
                              : tx.trans_type === '批量奖励'
                              ? 'bg-purple-50 text-purple-700'
                              : tx.trans_type === '兑换扣除'
                              ? 'bg-orange-50 text-orange-700'
                              : 'bg-zinc-100 text-zinc-600'
                          }`}
                        >
                          {tx.trans_type}
                        </span>
                      </td>
                      <td
                        className={`px-3 py-2 text-right font-medium ${
                          tx.amount > 0 ? 'text-green-600' : 'text-red-600'
                        }`}
                      >
                        {tx.amount > 0 ? '+' : ''}
                        {tx.amount.toLocaleString()}
                        {tx.expiry_status === '已到期' && (
                          <span className="ml-1">⚠️</span>
                        )}
                      </td>
                      <td className="px-3 py-2 text-right text-zinc-500">
                        {tx.balance_before.toLocaleString()}
                      </td>
                      <td className="px-3 py-2 text-right">
                        {tx.balance_after.toLocaleString()}
                      </td>
                      <td className="px-3 py-2 text-xs text-zinc-500">
                        {tx.expiry_date
                          ? new Date(tx.expiry_date).toLocaleDateString('zh-CN')
                          : '-'}
                      </td>
                      <td className="px-3 py-2 text-xs text-zinc-500 max-w-[150px] truncate">
                        {tx.remark}
                      </td>
                    </tr>
                  );
                })}
                {filteredTransactions.length === 0 && (
                  <tr>
                    <td colSpan={8} className="px-3 py-6 text-center text-zinc-400">
                      暂无记录
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'expiring' && (
        <div>
          <p className="text-sm text-zinc-500 mb-4">
            以下为未来 30 天内即将到期的积分流水（按剩余天数升序排列）
          </p>
          <div className="bg-white border border-zinc-200 rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-zinc-50 border-b border-zinc-200">
                  <th className="text-left px-3 py-2 font-medium text-zinc-600">会员</th>
                  <th className="text-left px-3 py-2 font-medium text-zinc-600">类型</th>
                  <th className="text-right px-3 py-2 font-medium text-zinc-600">积分数</th>
                  <th className="text-left px-3 py-2 font-medium text-zinc-600">到期日</th>
                  <th className="text-right px-3 py-2 font-medium text-zinc-600">剩余天数</th>
                  <th className="text-left px-3 py-2 font-medium text-zinc-600">备注</th>
                </tr>
              </thead>
              <tbody>
                {expiringTransactions.map((tx) => {
                  const urgent = tx.days_left <= 7;
                  return (
                    <tr
                      key={tx.id}
                      className={`border-b border-zinc-100 hover:bg-zinc-50 ${
                        urgent ? 'bg-red-50' : ''
                      }`}
                    >
                      <td className="px-3 py-2">{tx.member_name}</td>
                      <td className="px-3 py-2">
                        <span className="px-1.5 py-0.5 text-xs bg-blue-50 text-blue-700 rounded">
                          {tx.trans_type}
                        </span>
                      </td>
                      <td className="px-3 py-2 text-right font-medium text-green-600">
                        +{tx.amount.toLocaleString()}
                      </td>
                      <td className="px-3 py-2 text-xs">
                        {new Date(tx.expiry_date!).toLocaleDateString('zh-CN')}
                      </td>
                      <td className="px-3 py-2 text-right">
                        <span
                          className={`font-medium ${
                            urgent ? 'text-red-600' : 'text-amber-600'
                          }`}
                        >
                          {tx.days_left} 天
                        </span>
                      </td>
                      <td className="px-3 py-2 text-xs text-zinc-500">{tx.remark}</td>
                    </tr>
                  );
                })}
                {expiringTransactions.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-3 py-6 text-center text-zinc-400">
                      暂无即将到期的积分
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
