'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { usePointsStore } from '@/lib/store';
import PointsPanel, { AdjustModal } from '@/components/PointsPanel';
import { translate } from '@/lib/i18n';

// VISUAL-07 audit: max-w-4xl → max-w-6xl; added hero header with translated title;
// added rm-demo-number to transaction table numeric columns; unified section spacing to mb-5.
// ============================================================
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
  const locale = usePointsStore((s) => s.locale);

  const isIntern = currentRole === '实习生';

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
      <div className="max-w-6xl mx-auto text-center py-12 rm-demo-page">
        <p className="text-rm-text-dark-secondary">{translate(locale, 'members.notFound')}</p>
        <button
          onClick={() => router.push('/members')}
          className="rm-demo-link mt-3 inline-block text-sm min-h-[44px]"
        >
          {translate(locale, 'members.backToList')}
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
      addToast('success', '兑换申请已提交，等待审核');
      setShowRedeem(false);
      setSelectedGiftId('');
    } catch (e) {
      addToast('error', (e as Error).message);
    }
  };

  return (
    <div className="max-w-6xl mx-auto rm-demo-page">
      {/* Hero header */}
      <div className="rm-demo-hero">
        <div>
          <h2 className="rm-demo-title">{member.name}</h2>
          <p className="rm-demo-subtitle">ID: {member.member_no} · {member.phone}</p>
        </div>
        <button
          onClick={() => router.push('/members')}
          className="rm-demo-secondary-button px-3 py-1.5 text-xs min-h-[36px]"
        >
          &larr; {translate(locale, 'members.backToList')}
        </button>
      </div>

      {isIntern && (
        <div className="mb-5 px-4 py-2 rm-badge rm-badge-warning text-xs inline-flex">
          实习生 · 只读模式（编辑按钮已隐藏）
        </div>
      )}

      {/* Points panel */}
      <PointsPanel
        member={member}
        onAdjust={isIntern ? () => {} : () => setShowAdjust(true)}
        onRedeem={isIntern ? () => {} : () => setShowRedeem(true)}
        onViewHistory={() => {
          document.getElementById('tx-history')?.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* Referral tree */}
      <div className="rm-demo-card p-4 md:p-6 mb-5">
        <h3 className="text-md font-bold text-rm-text-dark mb-4">推荐关系树</h3>
        {referrer ? (
          <div className="mb-4 p-3 rm-stat-card border-blue-200 bg-blue-50/50 text-sm">
            推荐人：{referrer.name} (ID: {referrer.member_no})
          </div>
        ) : (
          <div className="mb-4 p-3 bg-zinc-50 rounded-xl text-sm text-rm-text-dark-secondary">
            无推荐人
          </div>
        )}

        <p className="mb-2 text-sm font-bold text-rm-text-dark">
          下线列表 ({downlineList.length})
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
                    {item.hasOrder ? '已购' : '未购'}
                  </span>
                </div>
                <div className="text-rm-text-dark-secondary text-xs">
                  推荐奖励: {item.referral.reward_point} 分
                  {item.referral.batch_reward_point && (
                    <span className="ml-2">
                      | 批量: {item.referral.batch_reward_point} 分 ({item.referral.batch_status === '已发放' ? '已发放' : '待发放'})
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-rm-text-dark-secondary mb-4">暂无下线</p>
        )}

        {/* Batch reward status */}
        {referralLogs
          .filter((r) => r.invitee_id === memberId && r.batch_reward_point)
          .map((r) => (
            <div key={r.id} className="p-3 rm-stat-card border-amber-200 bg-amber-50/50 text-sm">
              批量奖励状态：
              {r.batch_status === '已发放' ? (
                <span className="text-emerald-700 font-bold">
                  ✅ 已发放 (X+Y={r.batch_reward_point}分)
                </span>
              ) : (
                <span className="text-amber-700 font-bold">
                  ⏳ 待发放 (X+Y={r.batch_reward_point}分)
                </span>
              )}
            </div>
          ))}
      </div>

      {/* Transaction history */}
      <div id="tx-history" className="rm-demo-card p-4 md:p-6 mb-5">
        <h3 className="text-md font-bold text-rm-text-dark mb-4">积分流水记录</h3>
        <div className="rm-demo-table-wrap">
          <table className="rm-demo-table min-w-[700px]">
            <thead>
              <tr>
                <th>时间</th>
                <th>类型</th>
                <th className="text-right">变动</th>
                <th className="text-right">变动前</th>
                <th className="text-right">变动后</th>
                <th>到期日</th>
                <th>备注</th>
              </tr>
            </thead>
            <tbody>
              {memberTxs.map((tx) => {
                const isExpired = tx.expiry_status === '已到期';
                return (
                  <tr key={tx.id} className={isExpired ? 'bg-red-50/50' : ''}>
                    <td className="text-xs">{new Date(tx.create_time).toLocaleString('zh-CN')}</td>
                    <td><span className={`rm-badge ${txTypeBadge(tx.trans_type)}`}>{tx.trans_type}</span></td>
                    <td className={`text-right font-bold rm-demo-number ${tx.amount > 0 ? 'text-emerald-700' : 'text-red-600'}`}>
                      {tx.amount > 0 ? '+' : ''}{tx.amount.toLocaleString()}
                      {isExpired && <span className="ml-1 text-xs">⚠️</span>}
                    </td>
                    <td className="text-right text-rm-text-dark-secondary">{tx.balance_before.toLocaleString()}</td>
                    <td className="text-right rm-demo-number">{tx.balance_after.toLocaleString()}</td>
                    <td className="text-xs text-rm-text-dark-secondary">
                      {tx.expiry_date ? new Date(tx.expiry_date).toLocaleDateString('zh-CN') : '-'}
                    </td>
                    <td className="text-xs text-rm-text-dark-secondary max-w-[200px] truncate">{tx.remark}</td>
                  </tr>
                );
              })}
              {memberTxs.length === 0 && (
                <tr><td colSpan={7} className="text-center text-rm-text-dark-secondary py-6">暂无流水记录</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Adjust modal */}
      <AdjustModal
        open={showAdjust}
        onClose={() => setShowAdjust(false)}
        onSubmit={handleAdjust}
      />

      {/* Redeem modal */}
      {showRedeem && (
        <div className="fixed inset-0 bg-black/40 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
          <div className="rm-glass-light rounded-t-2xl sm:rounded-2xl p-5 md:p-6 w-full max-w-md shadow-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-black text-rm-text-dark mb-4">兑换礼品</h3>
            <p className="text-sm text-rm-text-dark-secondary mb-4">
              当前可用积分: <span className="font-black text-emerald-700">{member.available_points.toLocaleString()}</span>
            </p>
            <div className="mb-4">
              <label className="block text-sm text-rm-text-dark-secondary mb-1 font-medium">选择礼品</label>
              <select
                value={selectedGiftId}
                onChange={(e) => setSelectedGiftId(e.target.value)}
                className="rm-demo-filter w-full"
              >
                <option value="">-- 请选择礼品 --</option>
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
                          积分不足！需要 {gift.point_cost.toLocaleString()} 分
                        </span>
                      );
                    }
                    return (
                      <span className="rm-badge rm-badge-success">
                        兑换后剩余: {(member.available_points - gift.point_cost).toLocaleString()} 分
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
                取消
              </button>
              <button
                onClick={handleRedeem}
                disabled={!selectedGiftId}
                className="rm-demo-primary-button px-4 py-2.5 text-sm"
              >
                确认兑换
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
