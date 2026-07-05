'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { usePointsStore } from '@/lib/store';
import PointsPanel, { AdjustModal } from '@/components/PointsPanel';

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

  // 推荐关系
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

  if (!member) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <p className="text-zinc-500">会员不存在</p>
        <button
          onClick={() => router.push('/members')}
          className="mt-3 text-blue-600 hover:underline text-sm"
        >
          返回会员列表
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
    <div className="max-w-4xl mx-auto">
      <button
        onClick={() => router.push('/members')}
        className="text-sm text-blue-600 hover:underline mb-4 inline-block"
      >
        &larr; 返回会员列表
      </button>

      {isIntern && (
        <div className="mb-4 px-3 py-2 bg-amber-50 text-amber-700 text-xs rounded border border-amber-200">
          实习生 — 只读模式（编辑按钮已隐藏）
        </div>
      )}

      {/* 积分面板 */}
      <PointsPanel
        member={member}
        onAdjust={isIntern ? () => {} : () => setShowAdjust(true)}
        onRedeem={isIntern ? () => {} : () => setShowRedeem(true)}
        onViewHistory={() => {
          document.getElementById('tx-history')?.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* 推荐关系树 */}
      <div className="bg-white border border-zinc-200 rounded-lg p-6 mt-6">
        <h3 className="text-md font-semibold text-zinc-800 mb-4">推荐关系树</h3>
        {referrer ? (
          <div className="mb-4 p-3 bg-blue-50 rounded text-sm">
            推荐人：{referrer.name} (ID: {referrer.member_no})
          </div>
        ) : (
          <div className="mb-4 p-3 bg-zinc-50 rounded text-sm text-zinc-500">
            无推荐人
          </div>
        )}

        <div className="mb-2 text-sm font-medium text-zinc-700">
          下线列表 ({downlineList.length})
        </div>
        {downlineList.length > 0 ? (
          <div className="space-y-2 mb-4">
            {downlineList.map((item) => (
              <div
                key={item.referral.id}
                className="flex items-center justify-between p-3 border border-zinc-200 rounded text-sm"
              >
                <div>
                  <span className="font-medium">{item.member?.name ?? item.referral.invitee_id}</span>
                  <span className="text-zinc-400 ml-2">
                    (ID: {item.referral.invitee_id})
                  </span>
                  <span
                    className={`ml-2 px-1.5 py-0.5 text-xs rounded ${
                      item.hasOrder
                        ? 'bg-green-50 text-green-600'
                        : 'bg-zinc-100 text-zinc-400'
                    }`}
                  >
                    {item.hasOrder ? '已购' : '未购'}
                  </span>
                </div>
                <div className="text-zinc-500 text-xs">
                  推荐奖励: {item.referral.reward_point} 分
                  {item.referral.batch_reward_point && (
                    <span className="ml-2">
                      | 批量: {item.referral.batch_reward_point} 分 ({item.referral.batch_status === '已发放' ? '✅ 已发放' : '⏳ 待发放'})
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-sm text-zinc-400 mb-4">暂无下线</div>
        )}

        {/* 批量奖励状态 */}
        {referralLogs
          .filter((r) => r.invitee_id === memberId && r.batch_reward_point)
          .map((r) => (
            <div key={r.id} className="p-3 bg-amber-50 rounded text-sm">
              批量奖励状态：
              {r.batch_status === '已发放' ? (
                <span className="text-green-600 font-medium">
                  ✅ 已发放 (X+Y={r.batch_reward_point}分)
                </span>
              ) : (
                <span className="text-amber-600 font-medium">
                  ⏳ 待发放 (X+Y={r.batch_reward_point}分)
                </span>
              )}
            </div>
          ))}
      </div>

      {/* 积分流水 */}
      <div id="tx-history" className="bg-white border border-zinc-200 rounded-lg p-6 mt-6">
        <h3 className="text-md font-semibold text-zinc-800 mb-4">积分流水记录</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-zinc-50 border-b border-zinc-200">
                <th className="text-left px-3 py-2 font-medium text-zinc-600">时间</th>
                <th className="text-left px-3 py-2 font-medium text-zinc-600">类型</th>
                <th className="text-right px-3 py-2 font-medium text-zinc-600">变动</th>
                <th className="text-right px-3 py-2 font-medium text-zinc-600">变动前</th>
                <th className="text-right px-3 py-2 font-medium text-zinc-600">变动后</th>
                <th className="text-left px-3 py-2 font-medium text-zinc-600">到期日</th>
                <th className="text-left px-3 py-2 font-medium text-zinc-600">备注</th>
              </tr>
            </thead>
            <tbody>
              {memberTxs.map((tx) => (
                <tr
                  key={tx.id}
                  className={`border-b border-zinc-100 ${
                    tx.expiry_status === '已到期' ? 'bg-red-50' : ''
                  }`}
                >
                  <td className="px-3 py-2 text-xs">
                    {new Date(tx.create_time).toLocaleString('zh-CN')}
                  </td>
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
                      <span className="ml-1 text-xs">⚠️</span>
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
                  <td className="px-3 py-2 text-xs text-zinc-500 max-w-[200px] truncate">
                    {tx.remark}
                  </td>
                </tr>
              ))}
              {memberTxs.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-3 py-6 text-center text-zinc-400">
                    暂无流水记录
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 调整积分模态框 */}
      <AdjustModal
        open={showAdjust}
        onClose={() => setShowAdjust(false)}
        onSubmit={handleAdjust}
      />

      {/* 兑换礼品模态框 */}
      {showRedeem && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl">
            <h3 className="text-lg font-semibold mb-4">兑换礼品</h3>
            <p className="text-sm text-zinc-500 mb-3">
              当前可用积分: <span className="font-bold text-green-600">{member.available_points.toLocaleString()}</span>
            </p>
            <div className="mb-4">
              <label className="block text-sm text-zinc-600 mb-1">选择礼品</label>
              <select
                value={selectedGiftId}
                onChange={(e) => setSelectedGiftId(e.target.value)}
                className="w-full border border-zinc-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                <div className="mt-2 text-sm text-zinc-500">
                  {(() => {
                    const gift = gifts.find((g) => g.id === selectedGiftId);
                    if (!gift) return null;
                    if (member.available_points < gift.point_cost) {
                      return (
                        <span className="text-red-500">
                          积分不足！需要 {gift.point_cost.toLocaleString()} 分
                        </span>
                      );
                    }
                    return (
                      <span className="text-green-600">
                        兑换后剩余: {(member.available_points - gift.point_cost).toLocaleString()} 分
                      </span>
                    );
                  })()}
                </div>
              )}
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowRedeem(false);
                  setSelectedGiftId('');
                }}
                className="px-4 py-2 text-sm border border-zinc-300 rounded hover:bg-zinc-50"
              >
                取消
              </button>
              <button
                onClick={handleRedeem}
                disabled={!selectedGiftId}
                className="px-4 py-2 text-sm bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
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
