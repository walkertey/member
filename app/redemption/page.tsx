'use client';

import { useState, useMemo } from 'react';
import { usePointsStore } from '@/lib/store';
import { MENU_VISIBILITY } from '@/lib/permissions';
import type { Role } from '@/lib/permissions';

export default function RedemptionPage() {
  const members = usePointsStore((s) => s.members);
  const gifts = usePointsStore((s) => s.gifts);
  const redemptionRecords = usePointsStore((s) => s.redemptionRecords);
  const auditRedemption = usePointsStore((s) => s.auditRedemption);
  const addToast = usePointsStore((s) => s.addToast);
  const currentRole = usePointsStore((s) => s.currentRole);

  // 判断是否可审核：客服专员、运营主管、超级管理员
  const canAudit = MENU_VISIBILITY[currentRole as Role]?.includes('redemption') &&
    currentRole !== '实习生';

  // 筛选
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

  return (
    <div className="max-w-6xl mx-auto">
      <h2 className="text-xl font-semibold text-zinc-800 mb-6">兑换商城</h2>

      {/* 礼品列表 */}
      <div className="bg-white border border-zinc-200 rounded-lg p-5 mb-6">
        <h3 className="text-md font-semibold text-zinc-700 mb-4">可兑换礼品</h3>
        <div className="grid grid-cols-4 gap-4">
          {gifts.map((gift) => (
            <div
              key={gift.id}
              className={`border rounded-lg p-4 text-center ${
                gift.status === '上架'
                  ? 'border-zinc-200 hover:border-blue-300'
                  : 'border-zinc-100 bg-zinc-50 opacity-60'
              }`}
            >
              <div className="text-lg font-semibold text-zinc-800 mb-1">{gift.name}</div>
              <div className="text-2xl font-bold text-blue-600 mb-2">
                {gift.point_cost.toLocaleString()}
              </div>
              <div className="text-xs text-zinc-400">分</div>
              <div className="mt-2 text-xs text-zinc-500">
                库存: {gift.stock}
                {gift.status === '下架' && (
                  <span className="ml-1 text-red-500">已下架</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 待审核队列 */}
      {canAudit && (
        <div className="bg-white border border-zinc-200 rounded-lg p-5 mb-6">
          <h3 className="text-md font-semibold text-zinc-700 mb-4">
            待审核兑换
            {pendingRecords.length > 0 && (
              <span className="ml-2 px-2 py-0.5 text-xs bg-amber-100 text-amber-700 rounded-full">
                {pendingRecords.length}
              </span>
            )}
          </h3>
          {pendingRecords.length > 0 ? (
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-zinc-50 border-b border-zinc-200">
                  <th className="text-left px-3 py-2 font-medium text-zinc-600">兑换单号</th>
                  <th className="text-left px-3 py-2 font-medium text-zinc-600">会员</th>
                  <th className="text-left px-3 py-2 font-medium text-zinc-600">礼品</th>
                  <th className="text-right px-3 py-2 font-medium text-zinc-600">消耗积分</th>
                  <th className="text-right px-3 py-2 font-medium text-zinc-600">申请时余额</th>
                  <th className="text-left px-3 py-2 font-medium text-zinc-600">申请时间</th>
                  <th className="text-center px-3 py-2 font-medium text-zinc-600">操作</th>
                </tr>
              </thead>
              <tbody>
                {pendingRecords.map((r) => {
                  const member = members.find((m) => m.id === r.member_id);
                  return (
                    <tr key={r.id} className="border-b border-zinc-100">
                      <td className="px-3 py-2 font-mono text-xs">{r.order_no}</td>
                      <td className="px-3 py-2">{member?.name ?? r.member_id}</td>
                      <td className="px-3 py-2">{r.gift_name}</td>
                      <td className="px-3 py-2 text-right font-medium text-red-600">
                        -{r.point_cost.toLocaleString()}
                      </td>
                      <td className="px-3 py-2 text-right text-zinc-500">
                        {r.balance_at_apply.toLocaleString()}
                      </td>
                      <td className="px-3 py-2 text-xs text-zinc-500">
                        {new Date(r.apply_time).toLocaleString('zh-CN')}
                      </td>
                      <td className="px-3 py-2 text-center">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => handleAudit(r.id, true)}
                            className="px-3 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700"
                          >
                            通过
                          </button>
                          <button
                            onClick={() => handleAudit(r.id, false)}
                            className="px-3 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700"
                          >
                            驳回
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <p className="text-sm text-zinc-400 text-center py-4">暂无待审核记录</p>
          )}
        </div>
      )}

      {/* 全部兑换记录 */}
      <div className="bg-white border border-zinc-200 rounded-lg p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-md font-semibold text-zinc-700">兑换记录</h3>
          <div className="flex gap-3">
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
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="text-sm border border-zinc-300 rounded px-2 py-1.5"
            >
              <option value="">全部状态</option>
              <option value="待审核">待审核</option>
              <option value="已发货">已发货</option>
              <option value="已完成">已完成</option>
              <option value="已取消">已取消</option>
            </select>
          </div>
        </div>

        <table className="w-full text-sm">
          <thead>
            <tr className="bg-zinc-50 border-b border-zinc-200">
              <th className="text-left px-3 py-2 font-medium text-zinc-600">兑换单号</th>
              <th className="text-left px-3 py-2 font-medium text-zinc-600">会员</th>
              <th className="text-left px-3 py-2 font-medium text-zinc-600">礼品</th>
              <th className="text-right px-3 py-2 font-medium text-zinc-600">消耗积分</th>
              <th className="text-left px-3 py-2 font-medium text-zinc-600">申请时间</th>
              <th className="text-center px-3 py-2 font-medium text-zinc-600">状态</th>
              <th className="text-left px-3 py-2 font-medium text-zinc-600">快递单号</th>
            </tr>
          </thead>
          <tbody>
            {filteredRecords.map((r) => {
              const member = members.find((m) => m.id === r.member_id);
              return (
                <tr key={r.id} className="border-b border-zinc-100 hover:bg-zinc-50">
                  <td className="px-3 py-2 font-mono text-xs">{r.order_no}</td>
                  <td className="px-3 py-2">{member?.name ?? r.member_id}</td>
                  <td className="px-3 py-2">{r.gift_name}</td>
                  <td className="px-3 py-2 text-right font-medium text-red-600">
                    -{r.point_cost.toLocaleString()}
                  </td>
                  <td className="px-3 py-2 text-xs text-zinc-500">
                    {new Date(r.apply_time).toLocaleString('zh-CN')}
                  </td>
                  <td className="px-3 py-2 text-center">
                    <span
                      className={`px-1.5 py-0.5 text-xs rounded ${
                        r.status === '待审核'
                          ? 'bg-amber-50 text-amber-700'
                          : r.status === '已发货'
                          ? 'bg-blue-50 text-blue-700'
                          : r.status === '已完成'
                          ? 'bg-green-50 text-green-700'
                          : 'bg-red-50 text-red-700'
                      }`}
                    >
                      {r.status}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-xs text-zinc-500">
                    {r.tracking_no ?? '-'}
                  </td>
                </tr>
              );
            })}
            {filteredRecords.length === 0 && (
              <tr>
                <td colSpan={7} className="px-3 py-6 text-center text-zinc-400">
                  暂无兑换记录
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
