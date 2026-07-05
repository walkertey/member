'use client';

import { useState } from 'react';
import type { Member } from '@/lib/mockData';

interface PointsPanelProps {
  member: Member;
  onAdjust: () => void;
  onRedeem: () => void;
  onViewHistory: () => void;
}

export default function PointsPanel({ member, onAdjust, onRedeem, onViewHistory }: PointsPanelProps) {
  return (
    <div className="bg-white border border-zinc-200 rounded-lg p-4 md:p-6">
      <h2 className="text-base md:text-lg font-semibold text-zinc-800 mb-2 md:mb-4">
        {member.name} (ID: {member.member_no})
      </h2>
      <div className="text-xs md:text-sm text-zinc-500 mb-3 md:mb-4">
        <span className="block md:inline">手机: {member.phone}</span>
        {member.wechat && (
          <span className="md:ml-2 md:before:content-['|'] md:before:mx-1 block md:inline">
            微信: {member.wechat}
          </span>
        )}
        {member.status === '冻结' && (
          <span className="ml-2 px-2 py-0.5 bg-red-100 text-red-700 rounded text-xs">已冻结</span>
        )}
      </div>

      {/* 积分卡片 — 3 col desktop, 1 col mobile */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4 mb-4 md:mb-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 md:p-4 text-center">
          <div className="text-xs text-blue-600 mb-1">总积分</div>
          <div className="text-xl md:text-2xl font-bold text-blue-700">
            {member.total_points.toLocaleString()}
          </div>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-3 md:p-4 text-center">
          <div className="text-xs text-green-600 mb-1">可用积分</div>
          <div className="text-xl md:text-2xl font-bold text-green-700">
            {member.available_points.toLocaleString()}
          </div>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 md:p-4 text-center">
          <div className="text-xs text-red-600 mb-1">已到期积分</div>
          <div className="text-xl md:text-2xl font-bold text-red-700">
            {member.expired_points.toLocaleString()}
            {member.expired_points > 0 && <span className="text-sm ml-1">⚠️</span>}
          </div>
        </div>
      </div>

      {/* 操作按钮 — stack on mobile */}
      <div className="flex flex-col sm:flex-row gap-2 md:gap-3">
        <button
          onClick={onViewHistory}
          className="px-4 py-2.5 sm:py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors min-h-[44px]"
        >
          查看明细流水
        </button>
        <button
          onClick={onAdjust}
          className="px-4 py-2.5 sm:py-2 text-sm bg-amber-600 text-white rounded hover:bg-amber-700 transition-colors min-h-[44px]"
        >
          手动调整
        </button>
        <button
          onClick={onRedeem}
          className="px-4 py-2.5 sm:py-2 text-sm bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors min-h-[44px]"
        >
          兑换礼品
        </button>
      </div>
    </div>
  );
}

interface AdjustModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (delta: number, remark: string) => void;
}

export function AdjustModal({ open, onClose, onSubmit }: AdjustModalProps) {
  const [delta, setDelta] = useState('');
  const [remark, setRemark] = useState('');

  if (!open) return null;

  const handleSubmit = () => {
    const num = Number(delta);
    if (isNaN(num) || num === 0) return;
    if (!remark.trim()) return;
    onSubmit(num, remark.trim());
    setDelta('');
    setRemark('');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
      <div className="bg-white rounded-t-lg sm:rounded-lg p-5 md:p-6 w-full max-w-md shadow-xl max-h-[90vh] overflow-y-auto">
        <h3 className="text-lg font-semibold mb-4">手动调整积分</h3>
        <div className="mb-3">
          <label className="block text-sm text-zinc-600 mb-1">调整数额（正数为加，负数为扣）</label>
          <input
            type="number"
            value={delta}
            onChange={(e) => setDelta(e.target.value)}
            className="w-full border border-zinc-300 rounded px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[44px]"
            placeholder="例如: 100 或 -50"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm text-zinc-600 mb-1">调整原因（必填）</label>
          <input
            type="text"
            value={remark}
            onChange={(e) => setRemark(e.target.value)}
            className="w-full border border-zinc-300 rounded px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[44px]"
            placeholder="请填写调整原因"
          />
        </div>
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2.5 sm:py-2 text-sm border border-zinc-300 rounded hover:bg-zinc-50 min-h-[44px]"
          >
            取消
          </button>
          <button
            onClick={handleSubmit}
            disabled={!delta || !remark.trim()}
            className="px-4 py-2.5 sm:py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px]"
          >
            确认调整
          </button>
        </div>
      </div>
    </div>
  );
}
