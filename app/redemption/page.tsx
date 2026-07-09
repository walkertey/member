'use client';

import { useState, useMemo } from 'react';
import { usePointsStore } from '@/lib/store';
import { useI18n } from '@/components/raymond-i18n/RaymondI18nProvider';
import { t, transRole, transStatus, getLangLocale } from '@/components/raymond-i18n/raymondTranslations';
import { MENU_VISIBILITY } from '@/lib/permissions';
import type { Role } from '@/lib/permissions';

export default function RedemptionPage() {
  const { lang } = useI18n();
  const members = usePointsStore((s) => s.members);
  const gifts = usePointsStore((s) => s.gifts);
  const redemptionRecords = usePointsStore((s) => s.redemptionRecords);
  const auditRedemption = usePointsStore((s) => s.auditRedemption);
  const addToast = usePointsStore((s) => s.addToast);
  const currentRole = usePointsStore((s) => s.currentRole);

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
      addToast('success', approve ? t('redemption.approved', lang) : t('redemption.rejected', lang));
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

  const statusLabel = (status: string) => {
    const map: Record<string, string> = {
      '待审核': t('redemption.statusPending', lang),
      '已发货': t('redemption.statusShipped', lang),
      '已完成': t('redemption.statusCompleted', lang),
      '已取消': t('redemption.statusCancelled', lang),
    };
    return map[status] ?? status;
  };

  return (
    <div className="max-w-6xl mx-auto rm-demo-page">
      <div className="rm-demo-hero">
        <div>
          <h2 className="rm-demo-title">{t('redemption.title', lang)}</h2>
          <p className="rm-demo-subtitle">{t('redemption.subtitle', lang)}</p>
        </div>
        {currentRole !== '超级管理员' && (
          <span className="rm-badge rm-badge-neutral">{transRole(currentRole, lang)}</span>
        )}
      </div>

      {/* Gift list */}
      <div className="rm-demo-card rm-liquid-card p-4 md:p-5 mb-5">
        <h3 className="text-md font-bold text-rm-text-dark mb-4">{t('redemption.availableGifts', lang)}</h3>
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
              <div className="text-xs text-rm-text-dark-secondary">{t('redemption.pts', lang)}</div>
              <div className="mt-2 text-xs text-rm-text-dark-secondary">
                {t('redemption.stock', lang)}: {gift.stock}
                {gift.status === '下架' && (
                  <span className="ml-1 rm-badge rm-badge-danger">{transStatus(gift.status, lang)}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pending audit */}
      {canAudit && (
        <div className="rm-demo-card rm-liquid-card p-4 md:p-5 mb-5">
          <h3 className="text-md font-bold text-rm-text-dark mb-4">
            {t('redemption.pendingAudit', lang)}
            {pendingRecords.length > 0 && (
              <span className="ml-2 rm-badge rm-badge-warning">{pendingRecords.length}</span>
            )}
          </h3>
          {pendingRecords.length > 0 ? (
            <div className="rm-demo-table-wrap">
              <table className="rm-demo-table min-w-[650px]">
                <thead>
                  <tr>
                    <th>{t('redemption.orderNo', lang)}</th>
                    <th>{t('orders.member', lang)}</th>
                    <th>{t('redemption.gift', lang)}</th>
                    <th className="text-right">{t('redemption.pointCost', lang)}</th>
                    <th className="text-right">{t('redemption.balanceAtApply', lang)}</th>
                    <th>{t('redemption.applyTime', lang)}</th>
                    <th className="text-center">{t('permissions.action', lang)}</th>
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
                        <td className="text-xs text-rm-text-dark-secondary">{new Date(r.apply_time).toLocaleString(getLangLocale(lang))}</td>
                        <td className="text-center">
                          <div className="flex justify-center gap-2">
                            <button onClick={() => handleAudit(r.id, true)} className="rm-demo-primary-button px-3 py-1.5 text-xs min-h-[36px] !rounded-lg">
                              {t('redemption.approve', lang)}
                            </button>
                            <button onClick={() => handleAudit(r.id, false)} className="rm-demo-secondary-button px-3 py-1.5 text-xs min-h-[36px] !rounded-lg text-red-600 border-red-200">
                              {t('redemption.reject', lang)}
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
            <p className="text-sm text-rm-text-dark-secondary text-center py-6">{t('redemption.noPending', lang)}</p>
          )}
        </div>
      )}

      {/* All records */}
      <div className="rm-demo-card rm-liquid-card p-4 md:p-5">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
          <h3 className="text-md font-bold text-rm-text-dark">{t('redemption.records', lang)}</h3>
          <div className="flex gap-2 sm:ml-auto">
            <select value={filterMember} onChange={(e) => setFilterMember(e.target.value)} className="rm-demo-filter">
              <option value="">{t('redemption.allMembers', lang)}</option>
              {members.map((m) => (
                <option key={m.id} value={m.id}>{m.name}</option>
              ))}
            </select>
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="rm-demo-filter">
              <option value="">{t('redemption.allStatus', lang)}</option>
              <option value="待审核">{t('redemption.statusPending', lang)}</option>
              <option value="已发货">{t('redemption.statusShipped', lang)}</option>
              <option value="已完成">{t('redemption.statusCompleted', lang)}</option>
              <option value="已取消">{t('redemption.statusCancelled', lang)}</option>
            </select>
          </div>
        </div>

        <div className="rm-demo-table-wrap">
          <table className="rm-demo-table min-w-[600px]">
            <thead>
              <tr>
                <th>{t('redemption.orderNo', lang)}</th>
                <th>{t('orders.member', lang)}</th>
                <th>{t('redemption.gift', lang)}</th>
                <th className="text-right">{t('redemption.pointCost', lang)}</th>
                <th>{t('redemption.applyTime', lang)}</th>
                <th className="text-center">{t('permissions.status', lang)}</th>
                <th>{t('redemption.trackingNo', lang)}</th>
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
                    <td className="text-xs text-rm-text-dark-secondary">{new Date(r.apply_time).toLocaleString(getLangLocale(lang))}</td>
                    <td className="text-center">
                      <span className={`rm-badge ${statusBadge(r.status)}`}>{statusLabel(r.status)}</span>
                    </td>
                    <td className="text-xs text-rm-text-dark-secondary">{r.tracking_no ?? '-'}</td>
                  </tr>
                );
              })}
              {filteredRecords.length === 0 && (
                <tr><td colSpan={7} className="text-center text-rm-text-dark-secondary py-6">{t('redemption.noRecords', lang)}</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
