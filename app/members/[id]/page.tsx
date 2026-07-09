'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { usePointsStore } from '@/lib/store';
import PointsPanel, { AdjustModal } from '@/components/PointsPanel';
import { useI18n } from '@/components/raymond-i18n/RaymondI18nProvider';
import { t } from '@/components/raymond-i18n/raymondTranslations';

const WARN_SVG = (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M12 2L2 22h20L12 2z" fill="var(--rm-gold)" stroke="var(--rm-gold-deep)" strokeWidth="1.5" strokeLinejoin="round"/>
    <line x1="12" y1="9" x2="12" y2="14" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"/>
    <circle cx="12" cy="17.5" r="1.2" fill="#fff"/>
  </svg>
);

const CHECK_SVG = (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <circle cx="12" cy="12" r="11" fill="var(--rm-icon-emerald)"/>
    <path d="M7 12l3 3 7-7" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const HOURGLASS_SVG = (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <rect x="6" y="2" width="12" height="20" rx="2" fill="var(--rm-gold)" stroke="var(--rm-gold-deep)" strokeWidth="1.5"/>
    <line x1="12" y1="6" x2="12" y2="10" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
    <line x1="12" y1="14" x2="12" y2="18" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
    <line x1="8" y1="12" x2="16" y2="12" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

export default function MemberDetailPage() {
  const params = useParams();
  const router = useRouter();
  const memberId = params.id as string;

  const members = usePointsStore((s) => s.members);
  const pointTransactions = usePointsStore((s) => s.pointTransactions);
  const referralLogs = usePointsStore((s) => s.referralLogs);
  const orders = usePointsStore((s) => s.orders);
  const gifts = usePointsStore((s) => s.gifts);
  const settleExpiredPoints = usePointsStore((s) => s.settleExpiredPoints);
  const adjustPoints = usePointsStore((s) => s.adjustPoints);
  const redeemGift = usePointsStore((s) => s.redeemGift);
  const addToast = usePointsStore((s) => s.addToast);
  const currentRole = usePointsStore((s) => s.currentRole);

  const isIntern = currentRole === '实习生';
  const { lang } = useI18n();

  const [showAdjust, setShowAdjust] = useState(false);
  const [showRedeem, setShowRedeem] = useState(false);
  const [selectedGiftId, setSelectedGiftId] = useState('');

  useEffect(() => {
    settleExpiredPoints();
  }, [settleExpiredPoints]);

  const member = useMemo(() => members.find((m) => m.id === memberId), [members, memberId]);

  const memberTxs = useMemo(
    () =>
      pointTransactions
        .filter((tx) => tx.member_id === memberId)
        .sort((a, b) => new Date(b.create_time).getTime() - new Date(a.create_time).getTime()),
    [pointTransactions, memberId]
  );

  const referrer = useMemo(
    () => (member?.referrer_id ? members.find((m) => m.id === member.referrer_id) : null),
    [members, member]
  );

  const referrals = useMemo(
    () => referralLogs.filter((r) => r.inviter_id === memberId),
    [referralLogs, memberId]
  );

  const downlineList = useMemo(() => {
    return referrals.map((ref) => {
      const invitee = members.find((m) => m.id === ref.invitee_id);
      const hasOrder = orders.some(
        (o) => o.member_id === ref.invitee_id && o.status === '已支付'
      );
      return { referral: ref, member: invitee, hasOrder };
    });
  }, [referrals, members, orders]);

  const txTypeBadge = (type: string) => {
    const map: Record<string, string> = {
      '购买': 'rm-badge-info',
      '推荐30%': 'rm-badge-success',
      '批量奖励': 'rm-badge-gold',
      '兑换扣除': 'rm-badge-warning',
    };
    return map[type] ?? 'rm-badge-neutral';
  };

  if (!member) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12 rm-demo-page">
        <p className="text-rm-text-dark-secondary">{t('members.notFound', lang)}</p>
        <button
          onClick={() => router.push('/members')}
          className="rm-demo-link mt-3 inline-block text-sm min-h-[44px]"
        >
          {t('members.backToList', lang)}
        </button>
      </div>
    );
  }

  const handleAdjust = (delta: number, remark: string) => {
    try {
      adjustPoints(memberId, delta, remark);
      addToast('success', `积分调整成功：${delta > 0 ? '+' : ''}${delta} 分`);
    } catch (e) {
      addToast('error', (e as Error).message);
    }
  };

  const handleRedeem = () => {
    if (!selectedGiftId) return;
    try {
      redeemGift(memberId, selectedGiftId);
      addToast('success', t('member.redeemSubmitted', lang));
      setShowRedeem(false);
      setSelectedGiftId('');
    } catch (e) {
      addToast('error', (e as Error).message);
    }
  };

  return (
    <div className="max-w-4xl mx-auto rm-demo-page">
      <button
        onClick={() => router.push('/members')}
        className="rm-demo-link text-sm mb-4 inline-flex items-center gap-1 min-h-[44px]"
      >
        &larr; {t('members.backToList', lang)}
      </button>

      {isIntern && (
        <div className="mb-4 px-4 py-2 rm-badge rm-badge-warning text-xs inline-flex">
          {t('member.internReadonly', lang)}
        </div>
      )}

      <PointsPanel
        member={member}
        onAdjust={isIntern ? () => {} : () => setShowAdjust(true)}
        onRedeem={isIntern ? () => {} : () => setShowRedeem(true)}
        onViewHistory={() => {
          document.getElementById('tx-history')?.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      <div className="rm-demo-card rm-liquid-card p-4 md:p-6 mt-5">
        <h3 className="text-md font-bold text-rm-text-dark mb-4">{t('member.referralTree', lang)}</h3>
        {referrer ? (
          <div className="mb-4 p-3 rm-stat-card border-blue-200 bg-blue-50/50 text-sm">
            {t('member.referrer', lang)}: {referrer.name} (ID: {referrer.member_no})
          </div>
        ) : (
          <div className="mb-4 p-3 bg-zinc-50 rounded-xl text-sm text-rm-text-dark-secondary">
            {t('member.noReferrer', lang)}
          </div>
        )}

        <p className="mb-2 text-sm font-bold text-rm-text-dark">
          {t('member.downline', lang)} ({downlineList.length})
        </p>
        {downlineList.length > 0 ? (
          <div className="space-y-2 mb-4">
            {downlineList.map((item) => (
              <div
                key={item.referral.id}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 border border-[var(--rm-border-light)] rounded-xl text-sm gap-2"
              >
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                  <span className="font-bold">{item.member?.name ?? item.referral.invitee_id}</span>
                  <span className="text-rm-text-dark-secondary text-xs">
                    (ID: {item.referral.invitee_id})
                  </span>
                  <span className={`rm-badge ${item.hasOrder ? 'rm-badge-success' : 'rm-badge-neutral'}`}>
                    {item.hasOrder ? t('member.purchased', lang) : t('member.notPurchased', lang)}
                  </span>
                </div>
                <div className="text-rm-text-dark-secondary text-xs">
                  {t('member.referralReward', lang)}: {item.referral.reward_point} 分
                  {item.referral.batch_reward_point && (
                    <span className="ml-2">
                      | {t('member.batchStatus', lang)}: {item.referral.batch_reward_point} 分 ({item.referral.batch_status === '已发放' ? t('member.issued', lang) : t('member.pending', lang)})
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-rm-text-dark-secondary mb-4">{t('member.noReferrer', lang)}</p>
        )}

        {referralLogs
          .filter((r) => r.invitee_id === memberId && r.batch_reward_point)
          .map((r) => (
            <div key={r.id} className="p-3 rm-stat-card border-amber-200 bg-amber-50/50 text-sm">
              {t('member.batchStatus', lang)}:
              {r.batch_status === '已发放' ? (
                <span className="text-emerald-700 font-bold">
                  {' '}{CHECK_SVG} {t('member.issued', lang)} (X+Y={r.batch_reward_point}分)
                </span>
              ) : (
                <span className="text-amber-700 font-bold">
                  {' '}{HOURGLASS_SVG} {t('member.pending', lang)} (X+Y={r.batch_reward_point}分)
                </span>
              )}
            </div>
          ))}
      </div>

      <div id="tx-history" className="rm-demo-card rm-liquid-card p-4 md:p-6 mt-5">
        <h3 className="text-md font-bold text-rm-text-dark mb-4">{t('member.txHistory', lang)}</h3>
        <div className="rm-demo-table-wrap">
          <table className="rm-demo-table min-w-[700px]">
            <thead>
              <tr>
                <th>{t('points.time', lang)}</th>
                <th>{t('points.type', lang)}</th>
                <th className="text-right">{t('points.change', lang)}</th>
                <th className="text-right">{t('points.before', lang)}</th>
                <th className="text-right">{t('points.after', lang)}</th>
                <th>{t('points.expiryDate', lang)}</th>
                <th>{t('points.remark', lang)}</th>
              </tr>
            </thead>
            <tbody>
              {memberTxs.map((tx) => {
                const isExpired = tx.expiry_status === '已到期';
                return (
                  <tr key={tx.id} className={isExpired ? 'bg-red-50/50' : ''}>
                    <td className="text-xs">{new Date(tx.create_time).toLocaleString('zh-CN')}</td>
                    <td><span className={`rm-badge ${txTypeBadge(tx.trans_type)}`}>{tx.trans_type}</span></td>
                    <td className={`text-right font-bold ${tx.amount > 0 ? 'text-emerald-700' : 'text-red-600'}`}>
                      {tx.amount > 0 ? '+' : ''}{tx.amount.toLocaleString()}
                      {isExpired && <span className="ml-1">{WARN_SVG}</span>}
                    </td>
                    <td className="text-right text-rm-text-dark-secondary">{tx.balance_before.toLocaleString()}</td>
                    <td className="text-right">{tx.balance_after.toLocaleString()}</td>
                    <td className="text-xs text-rm-text-dark-secondary">
                      {tx.expiry_date ? new Date(tx.expiry_date).toLocaleDateString('zh-CN') : '-'}
                    </td>
                    <td className="text-xs text-rm-text-dark-secondary max-w-[200px] truncate">{tx.remark}</td>
                  </tr>
                );
              })}
              {memberTxs.length === 0 && (
                <tr><td colSpan={7} className="text-center text-rm-text-dark-secondary py-6">{t('member.noTx', lang)}</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AdjustModal
        open={showAdjust}
        onClose={() => setShowAdjust(false)}
        onSubmit={handleAdjust}
      />

      {showRedeem && (
        <div className="fixed inset-0 bg-black/40 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
          <div className="bg-white rounded-t-2xl sm:rounded-2xl p-5 md:p-6 w-full max-w-md shadow-2xl max-h-[90vh] overflow-y-auto border border-[var(--rm-border-light)]">
            <h3 className="text-lg font-black text-rm-text-dark mb-4">{t('member.redeemTitle', lang)}</h3>
            <p className="text-sm text-rm-text-dark-secondary mb-4">
              {t('member.redeemAvailable', lang)}: <span className="font-black text-emerald-700">{member.available_points.toLocaleString()}</span>
            </p>
            <div className="mb-4">
              <label className="block text-sm text-rm-text-dark-secondary mb-1 font-medium">{t('member.redeemSelect', lang)}</label>
              <select
                value={selectedGiftId}
                onChange={(e) => setSelectedGiftId(e.target.value)}
                className="rm-demo-filter w-full"
              >
                <option value="">{t('member.redeemSelectPlaceholder', lang)}</option>
                {gifts
                  .filter((g) => g.status === '上架')
                  .map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.name} — {g.point_cost.toLocaleString()} 分 (库存: {g.stock})
                    </option>
                  ))}
              </select>
              {selectedGiftId && (
                <div className="mt-2 text-sm text-rm-text-dark-secondary">
                  {(() => {
                    const gift = gifts.find((g) => g.id === selectedGiftId);
                    if (!gift) return null;
                    if (member.available_points < gift.point_cost) {
                      return (
                        <span className="rm-badge rm-badge-danger">
                          {t('member.redeemInsufficient', lang, { cost: gift.point_cost })}
                        </span>
                      );
                    }
                    return (
                      <span className="rm-badge rm-badge-success">
                        {t('member.redeemRemaining', lang, { remaining: (member.available_points - gift.point_cost).toLocaleString() })}
                      </span>
                    );
                  })()}
                </div>
              )}
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => { setShowRedeem(false); setSelectedGiftId(''); }}
                className="rm-demo-secondary-button px-4 py-2.5 text-sm"
              >
                {t('member.cancel', lang)}
              </button>
              <button
                onClick={handleRedeem}
                disabled={!selectedGiftId}
                className="rm-demo-primary-button px-4 py-2.5 text-sm"
              >
                {t('member.redeemConfirm', lang)}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
