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
    <div className="rm-demo-card p-4 md:p-6">
      <h2 className="text-lg font-black text-rm-text-dark mb-1">
        {member.name}
        <span className="text-sm font-medium text-rm-text-dark-secondary ml-2">
          ID: {member.member_no}
        </span>
      </h2>
      <div className="text-xs md:text-sm text-rm-text-dark-secondary mb-4">
        <span className="block md:inline">手机: {member.phone}</span>
        {member.wechat && (
          <span className="md:ml-3 md:before:content-['|'] md:before:mx-2 block md:inline">
            微信: {member.wechat}
          </span>
        )}
        {member.status === '冻结' && (
          <span className="ml-2 rm-badge rm-badge-danger">已冻结</span>
        )}
      </div>

      {/* Points cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4 mb-5">
        <div className="rm-stat-card text-center">
          <div className="rm-stat-label">总积分</div>
          <div className="rm-stat-value" style={{ color: 'var(--rm-icon-navy)' }}>
            {member.total_points.toLocaleString()}
          </div>
        </div>
        <div className="rm-stat-card text-center">
          <div className="rm-stat-label">可用积分</div>
          <div className="rm-stat-value" style={{ color: 'var(--rm-gold-deep)' }}>
            {member.available_points.toLocaleString()}
          </div>
        </div>
        <div className="rm-stat-card text-center">
          <div className="rm-stat-label">已到期积分</div>
          <div className="rm-stat-value" style={{ color: 'var(--rm-icon-red)' }}>
            {member.expired_points.toLocaleString()}
            {member.expired_points > 0 && <span className="text-sm ml-1">⚠️</span>}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-2 md:gap-3">
        <button onClick={onViewHistory} className="rm-demo-primary-button px-4 py-2.5 text-sm">
          查看明细流水
        </button>
        <button onClick={onAdjust} className="rm-demo-secondary-button px-4 py-2.5 text-sm">
          手动调整
        </button>
        <button onClick={onRedeem} className="rm-demo-secondary-button px-4 py-2.5 text-sm">
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
      <div className="bg-white rounded-t-2xl sm:rounded-2xl p-5 md:p-6 w-full max-w-md shadow-2xl max-h-[90vh] overflow-y-auto border border-[var(--rm-border-light)]">
        <h3 className="text-lg font-black text-rm-text-dark mb-4">手动调整积分</h3>
        <div className="mb-3">
          <label className="block text-sm text-rm-text-dark-secondary mb-1 font-medium">调整数额（正数为加，负数为扣）</label>
          <input
            type="number"
            value={delta}
            onChange={(e) => setDelta(e.target.value)}
            className="rm-demo-filter w-full"
            placeholder="例如: 100 或 -50"
          />
        </div>
        <div className="mb-5">
          <label className="block text-sm text-rm-text-dark-secondary mb-1 font-medium">调整原因（必填）</label>
          <input
            type="text"
            value={remark}
            onChange={(e) => setRemark(e.target.value)}
            className="rm-demo-filter w-full"
            placeholder="请填写调整原因"
          />
        </div>
        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="rm-demo-secondary-button px-4 py-2.5 text-sm">
            取消
          </button>
          <button
            onClick={handleSubmit}
            disabled={!delta || !remark.trim()}
            className="rm-demo-primary-button px-4 py-2.5 text-sm"
          >
            确认调整
          </button>
        </div>
      </div>
    </div>
  );
}
