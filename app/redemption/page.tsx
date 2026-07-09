'use client';

import { useState, useMemo } from 'react';
import { usePointsStore } from '@/lib/store';
import { MENU_VISIBILITY } from '@/lib/permissions';
import type { Role } from '@/lib/permissions';
import { translate } from '@/lib/i18n';

export default function RedemptionPage() {
  const members = usePointsStore((s) => s.members);
  const gifts = usePointsStore((s) => s.gifts);
  const redemptionRecords = usePointsStore((s) => s.redemptionRecords);
  const auditRedemption = usePointsStore((s) => s.auditRedemption);
  const addToast = usePointsStore((s) => s.addToast);
  const currentRole = usePointsStore((s) => s.currentRole);
  const locale = usePointsStore((s) => s.locale);

  const canAudit = MENU_VISIBILITY[currentRole as Role]?.includes('redemption') &&
    currentRole !== '实习生';

  const [filterMember, setFilterMember] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  const filteredRecords = useMemo(() => {
    return redemptionRecords
      .filter((r) => {
        if (filterMember && r.member_id !== filterMember) return false;
        if (filterStatus && r.status !== filterStatus) return false;
        return true;
      })
      .sort((a, b) => new Date(b.apply_time).getTime() - new Date(a.apply_time).getTime());
  }, [redemptionRecords, filterMember, filterStatus]);

  const pendingRecords = useMemo(
    () => redemptionRecords.filter((r) => r.status === '待审核'),
    [redemptionRecords]
  );

  const handleAudit = (recordId: string, approve: boolean) => {
    try {
      auditRedemption(recordId, approve, 'STAFF001');
      addToast('success', approve ? '审核通过，已安排发货' : '已驳回，积分已退还');
    } catch (e) {
      addToast('error', (e as Error).message);
    }
  };

  const statusBadge = (status: string) => {
    const map: Record<string, string> = {
      '待审核': 'rm-badge-warning',
      '已发货': 'rm-badge-info',
      '已完成': 'rm-badge-success',
      '已取消': 'rm-badge-danger',
    };
    return map[status] ?? 'rm-badge-neutral';
  };

  return (
    <div className="max-w-6xl mx-auto rm-demo-page">
      <div className="rm-demo-hero">
        <div>
          <h2 className="rm-demo-title">{translate(locale, 'redemption.title')}</h2>
          <p className="rm-demo-subtitle">礼品兑换 · 审核管理</p>
        </div>
        {currentRole !== '超级管理员' && (
          <span className="rm-badge rm-badge-neutral">{currentRole}</span>
        )}
      </div>

      {/* Gift list */}
      <div className="rm-demo-card p-4 md:p-5 mb-5">
        <h3 className="text-md font-bold text-rm-text-dark mb-4">可兑换礼品</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          {gifts.map((gift) => (
            <div
              key={gift.id}
              className={`rounded-xl border p-4 text-center transition-colors ${
                gift.status === '上架'
                  ? 'border-[var(--rm-border-light)] hover:border-[var(--rm-gold)] hover:shadow-md'
                  : 'border-zinc-200 bg-zinc-50/60 opacity-60'
              }`}
            >
              <div className="text-base font-bold text-rm-text-dark mb-1">{gift.name}</div>
              <div className="text-2xl font-black rm-demo-number text-[var(--rm-gold-deep)] mb-1">
                {gift.point_cost.toLocaleString()}
              </div>
              <div className="text-xs text-rm-text-dark-secondary">分</div>
              <div className="mt-2 text-xs text-rm-text-dark-secondary">
                库存: {gift.stock}
                {gift.status === '下架' && (
                  <span className="ml-1 rm-badge rm-badge-danger">已下架</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pending audit */}
      {canAudit && (
        <div className="rm-demo-card p-4 md:p-5 mb-5">
          <h3 className="text-md font-bold text-rm-text-dark mb-4">
            待审核兑换
            {pendingRecords.length > 0 && (
              <span className="ml-2 rm-badge rm-badge-warning">{pendingRecords.length}</span>
            )}
          </h3>
          {pendingRecords.length > 0 ? (
            <div className="rm-demo-table-wrap">
              <table className="rm-demo-table min-w-[650px]">
                <thead>
                  <tr>
                    <th>兑换单号</th>
                    <th>会员</th>
                    <th>礼品</th>
                    <th className="text-right">消耗积分</th>
                    <th className="text-right">申请时余额</th>
                    <th>申请时间</th>
                    <th className="text-center">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingRecords.map((r) => {
                    const member = members.find((m) => m.id === r.member_id);
                    return (
                      <tr key={r.id}>
                        <td className="font-mono text-xs">{r.order_no}</td>
                        <td>{member?.name ?? r.member_id}</td>
                        <td>{r.gift_name}</td>
                        <td className="text-right font-bold rm-demo-number text-red-600">-{r.point_cost.toLocaleString()}</td>
                        <td className="text-right text-rm-text-dark-secondary">{r.balance_at_apply.toLocaleString()}</td>
                        <td className="text-xs text-rm-text-dark-secondary">{new Date(r.apply_time).toLocaleString('zh-CN')}</td>
                        <td className="text-center">
                          <div className="flex justify-center gap-2">
                            <button onClick={() => handleAudit(r.id, true)} className="rm-demo-primary-button px-3 py-1.5 text-xs min-h-[36px] !rounded-lg">
                              通过
                            </button>
                            <button onClick={() => handleAudit(r.id, false)} className="rm-demo-secondary-button px-3 py-1.5 text-xs min-h-[36px] !rounded-lg text-red-600 border-red-200">
                              驳回
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-sm text-rm-text-dark-secondary text-center py-6">暂无待审核记录</p>
          )}
        </div>
      )}

      {/* All records */}
      <div className="rm-demo-card p-4 md:p-5">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
          <h3 className="text-md font-bold text-rm-text-dark">兑换记录</h3>
          <div className="flex gap-2 sm:ml-auto">
            <select value={filterMember} onChange={(e) => setFilterMember(e.target.value)} className="rm-demo-filter">
              <option value="">全部会员</option>
              {members.map((m) => (
                <option key={m.id} value={m.id}>{m.name}</option>
              ))}
            </select>
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="rm-demo-filter">
              <option value="">全部状态</option>
              <option value="待审核">待审核</option>
              <option value="已发货">已发货</option>
              <option value="已完成">已完成</option>
              <option value="已取消">已取消</option>
            </select>
          </div>
        </div>

        <div className="rm-demo-table-wrap">
          <table className="rm-demo-table min-w-[600px]">
            <thead>
              <tr>
                <th>兑换单号</th>
                <th>会员</th>
                <th>礼品</th>
                <th className="text-right">消耗积分</th>
                <th>申请时间</th>
                <th className="text-center">状态</th>
                <th>快递单号</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecords.map((r) => {
                const member = members.find((m) => m.id === r.member_id);
                return (
                  <tr key={r.id}>
                    <td className="font-mono text-xs">{r.order_no}</td>
                    <td>{member?.name ?? r.member_id}</td>
                    <td>{r.gift_name}</td>
                    <td className="text-right font-bold rm-demo-number text-red-600">-{r.point_cost.toLocaleString()}</td>
                    <td className="text-xs text-rm-text-dark-secondary">{new Date(r.apply_time).toLocaleString('zh-CN')}</td>
                    <td className="text-center">
                      <span className={`rm-badge ${statusBadge(r.status)}`}>{r.status}</span>
                    </td>
                    <td className="text-xs text-rm-text-dark-secondary">{r.tracking_no ?? '-'}</td>
                  </tr>
                );
              })}
              {filteredRecords.length === 0 && (
                <tr><td colSpan={7} className="text-center text-rm-text-dark-secondary py-6">暂无兑换记录</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
