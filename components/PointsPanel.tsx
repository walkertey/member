'use client';

import { useState } from 'react';
import type { Member } from '@/lib/mockData';
import { useI18n } from '@/components/raymond-i18n/RaymondI18nProvider';
import { t } from '@/components/raymond-i18n/raymondTranslations';

interface PointsPanelProps {
  member: Member;
  onAdjust: () => void;
  onRedeem: () => void;
  onViewHistory: () => void;
}

export default function PointsPanel({ member, onAdjust, onRedeem, onViewHistory }: PointsPanelProps) {
  const { lang } = useI18n();

  return (
    <div className="rm-demo-card p-4 md:p-6 rm-liquid-card">
      <h2 className="text-lg font-black text-rm-text-dark mb-1">
        {member.name}
        <span className="text-sm font-medium text-rm-text-dark-secondary ml-2">
          ID: {member.member_no}
        </span>
      </h2>
      <div className="text-xs md:text-sm text-rm-text-dark-secondary mb-4">
        <span className="block md:inline">{t('member.phone', lang)}: {member.phone}</span>
        {member.wechat && (
          <span className="md:ml-3 md:before:content-['|'] md:before:mx-2 block md:inline">
            {t('member.wechat', lang)}: {member.wechat}
          </span>
        )}
        {member.status === '冻结' && (
          <span className="ml-2 rm-badge rm-badge-danger">{t('member.frozen', lang)}</span>
        )}
      </div>

      {/* Points cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4 mb-5">
        <div className="rm-stat-card rm-depth-card text-center">
          <div className="rm-stat-label">{t('member.totalPts', lang)}</div>
          <div className="rm-stat-value" style={{ color: 'var(--rm-icon-navy)' }}>
            {member.total_points.toLocaleString()}
          </div>
        </div>
        <div className="rm-stat-card rm-depth-card text-center">
          <div className="rm-stat-label">{t('member.availablePts', lang)}</div>
          <div className="rm-stat-value" style={{ color: 'var(--rm-gold-deep)' }}>
            {member.available_points.toLocaleString()}
          </div>
        </div>
        <div className="rm-stat-card rm-depth-card text-center">
          <div className="rm-stat-label">{t('member.expiredPts', lang)}</div>
          <div className="rm-stat-value" style={{ color: 'var(--rm-icon-red)' }}>
            {member.expired_points.toLocaleString()}
            {member.expired_points > 0 && (
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="inline-block align-middle ml-1" aria-hidden="true">
                <path d="M8 1.5L1.5 14h13L8 1.5z" fill="var(--rm-gold)" stroke="var(--rm-gold-deep)" strokeWidth="1" strokeLinejoin="round" />
                <path d="M8 6v3" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" />
                <circle cx="8" cy="11.5" r="0.8" fill="#fff" />
              </svg>
            )}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-2 md:gap-3">
        <button onClick={onViewHistory} className="rm-demo-primary-button px-4 py-2.5 text-sm">
          {t('member.viewHistory', lang)}
        </button>
        <button onClick={onAdjust} className="rm-demo-secondary-button px-4 py-2.5 text-sm">
          {t('member.adjustPoints', lang)}
        </button>
        <button onClick={onRedeem} className="rm-demo-secondary-button px-4 py-2.5 text-sm">
          {t('member.redeemGift', lang)}
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
  const { lang } = useI18n();

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
        <h3 className="text-lg font-black text-rm-text-dark mb-4">{t('member.adjustTitle', lang)}</h3>
        <div className="mb-3">
          <label className="block text-sm text-rm-text-dark-secondary mb-1 font-medium">{t('member.adjustAmount', lang)}</label>
          <input
            type="number"
            value={delta}
            onChange={(e) => setDelta(e.target.value)}
            className="rm-demo-filter w-full"
            placeholder={t('member.adjustPlaceholder', lang)}
          />
        </div>
        <div className="mb-5">
          <label className="block text-sm text-rm-text-dark-secondary mb-1 font-medium">{t('member.adjustReason', lang)}</label>
          <input
            type="text"
            value={remark}
            onChange={(e) => setRemark(e.target.value)}
            className="rm-demo-filter w-full"
            placeholder={t('member.adjustReasonPlaceholder', lang)}
          />
        </div>
        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="rm-demo-secondary-button px-4 py-2.5 text-sm">
            {t('member.cancel', lang)}
          </button>
          <button
            onClick={handleSubmit}
            disabled={!delta || !remark.trim()}
            className="rm-demo-primary-button px-4 py-2.5 text-sm"
          >
            {t('member.confirm', lang)}
          </button>
        </div>
      </div>
    </div>
  );
}
