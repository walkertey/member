'use client';

import { useEffect, useState, useMemo } from 'react';
import { usePointsStore } from '@/lib/store';
import { getExpiringTransactions } from '@/lib/pointsEngine';
import { useI18n } from '@/components/raymond-i18n/RaymondI18nProvider';
import { t, transType, transStatus, getLangLocale } from '@/components/raymond-i18n/raymondTranslations';

const WARN_SVG = (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M12 2L2 22h20L12 2z" fill="var(--rm-gold)" stroke="var(--rm-gold-deep)" strokeWidth="1.5" strokeLinejoin="round"/>
    <line x1="12" y1="9" x2="12" y2="14" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"/>
    <circle cx="12" cy="17.5" r="1.2" fill="#fff"/>
  </svg>
);

export default function PointsPage() {
  const pointTransactions = usePointsStore((s) => s.pointTransactions);
  const members = usePointsStore((s) => s.members);
  const settleExpiredPoints = usePointsStore((s) => s.settleExpiredPoints);
  const currentRole = usePointsStore((s) => s.currentRole);
  const isIntern = currentRole === '实习生';
  const { lang } = useI18n();

  const [activeTab, setActiveTab] = useState<'all' | 'expiring'>('all');

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

  const transTypeBadge = (type: string) => {
    const map: Record<string, string> = {
      '购买': 'rm-badge-info',
      '推荐30%': 'rm-badge-success',
      '批量奖励': 'rm-badge-gold',
      '兑换扣除': 'rm-badge-warning',
    };
    return map[type] ?? 'rm-badge-neutral';
  };

  return (
    <div className="max-w-6xl mx-auto rm-demo-page">
      <div className="rm-demo-hero">
        <div>
          <h2 className="rm-demo-title">{t('points.title', lang)}</h2>
          <p className="rm-demo-subtitle">{t('points.subtitle', lang)}</p>
        </div>
        {isIntern && (
          <span className="rm-badge rm-badge-warning">{t('members.internReadonly', lang)}</span>
        )}
      </div>

      <div className="flex border-b border-[var(--rm-border-light)] mb-5 overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-4 py-2.5 text-sm font-bold transition-colors border-b-2 -mb-px whitespace-nowrap min-h-[44px] ${
            activeTab === 'all'
              ? 'border-[var(--rm-gold)] text-[var(--rm-gold-deep)]'
              : 'border-transparent text-rm-text-dark-secondary hover:text-rm-text-dark'
          }`}
        >
          {t('points.allTab', lang)}
        </button>
        <button
          onClick={() => setActiveTab('expiring')}
          className={`px-4 py-2.5 text-sm font-bold transition-colors border-b-2 -mb-px whitespace-nowrap min-h-[44px] ${
            activeTab === 'expiring'
              ? 'border-[var(--rm-gold)] text-[var(--rm-gold-deep)]'
              : 'border-transparent text-rm-text-dark-secondary hover:text-rm-text-dark'
          }`}
        >
          {t('points.expiringTab', lang)}
          {expiringTransactions.length > 0 && (
            <span className="ml-1.5 rm-badge rm-badge-danger">
              {expiringTransactions.length}
            </span>
          )}
        </button>
      </div>

      {activeTab === 'all' && (
        <div>
          <div className="flex gap-2 md:gap-3 mb-4 flex-wrap">
            <select value={filterMember} onChange={(e) => setFilterMember(e.target.value)} className="rm-demo-filter">
              <option value="">{t('points.allMembers', lang)}</option>
              {members.map((m) => (
                <option key={m.id} value={m.id}>{m.name}</option>
              ))}
            </select>
            <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="rm-demo-filter">
              <option value="">{t('points.allTypes', lang)}</option>
              {transTypes.map((ty) => (
                <option key={ty} value={ty}>{transType(ty, lang)}</option>
              ))}
            </select>
            <input type="date" value={filterDateFrom} onChange={(e) => setFilterDateFrom(e.target.value)} className="rm-demo-filter" placeholder={t('points.startDate', lang)} />
            <input type="date" value={filterDateTo} onChange={(e) => setFilterDateTo(e.target.value)} className="rm-demo-filter" placeholder={t('points.endDate', lang)} />
            {(filterMember || filterType || filterDateFrom || filterDateTo) && (
              <button
                onClick={() => { setFilterMember(''); setFilterType(''); setFilterDateFrom(''); setFilterDateTo(''); }}
                className="rm-demo-link text-sm min-h-[44px] px-3"
              >
                {t('points.clearFilter', lang)}
              </button>
            )}
          </div>

          <div className="rm-demo-table-wrap rm-liquid-card">
            <table className="rm-demo-table min-w-[750px]">
              <thead>
                <tr>
                  <th>{t('points.time', lang)}</th>
                  <th>{t('points.member', lang)}</th>
                  <th>{t('points.type', lang)}</th>
                  <th className="text-right">{t('points.change', lang)}</th>
                  <th className="text-right">{t('points.before', lang)}</th>
                  <th className="text-right">{t('points.after', lang)}</th>
                  <th>{t('points.expiryDate', lang)}</th>
                  <th>{t('points.remark', lang)}</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((tx) => {
                  const member = members.find((m) => m.id === tx.member_id);
                  const isExpired = tx.expiry_status === '已到期';
                  return (
                    <tr key={tx.id} className={isExpired ? 'bg-red-50/50' : ''}>
                      <td className="text-xs">{new Date(tx.create_time).toLocaleString(getLangLocale(lang))}</td>
                      <td>{member?.name ?? tx.member_id}</td>
                      <td><span className={`rm-badge ${transTypeBadge(tx.trans_type)}`}>{transType(tx.trans_type, lang)}</span></td>
                      <td className={`text-right font-bold rm-demo-number ${tx.amount > 0 ? 'text-emerald-700' : 'text-red-600'}`}>
                        {tx.amount > 0 ? '+' : ''}{tx.amount.toLocaleString()}
                        {isExpired && <span className="ml-1">{WARN_SVG}</span>}
                      </td>
                      <td className="text-right text-rm-text-dark-secondary">{tx.balance_before.toLocaleString()}</td>
                      <td className="text-right">{tx.balance_after.toLocaleString()}</td>
                      <td className="text-xs text-rm-text-dark-secondary">
                        {tx.expiry_date ? new Date(tx.expiry_date).toLocaleDateString(getLangLocale(lang)) : '-'}
                      </td>
                      <td className="text-xs text-rm-text-dark-secondary max-w-[150px] truncate">{tx.remark}</td>
                    </tr>
                  );
                })}
                {filteredTransactions.length === 0 && (
                  <tr><td colSpan={8} className="text-center text-rm-text-dark-secondary py-6">{t('points.noData', lang)}</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'expiring' && (
        <div>
          <p className="text-sm text-rm-text-dark-secondary mb-4">
            {t('points.expiringDesc', lang)}
          </p>
          <div className="rm-demo-table-wrap rm-liquid-card">
            <table className="rm-demo-table min-w-[550px]">
              <thead>
                <tr>
                  <th>{t('points.member', lang)}</th>
                  <th>{t('points.type', lang)}</th>
                  <th className="text-right">{t('points.change', lang)}</th>
                  <th>{t('points.expiryDate', lang)}</th>
                  <th className="text-right">{t('points.daysLeft', lang)}</th>
                  <th>{t('points.remark', lang)}</th>
                </tr>
              </thead>
              <tbody>
                {expiringTransactions.map((tx) => {
                  const urgent = tx.days_left <= 7;
                  return (
                    <tr key={tx.id} className={urgent ? 'bg-red-50/50' : ''}>
                      <td>{tx.member_name}</td>
                      <td><span className="rm-badge rm-badge-info">{transType(tx.trans_type, lang)}</span></td>
                      <td className="text-right font-bold rm-demo-number text-emerald-700">+{tx.amount.toLocaleString()}</td>
                      <td className="text-xs">{new Date(tx.expiry_date!).toLocaleDateString(getLangLocale(lang))}</td>
                      <td className={`text-right font-bold ${urgent ? 'text-red-600' : 'text-amber-700'}`}>
                        {tx.days_left} {t('points.daysUnit', lang)}
                      </td>
                      <td className="text-xs text-rm-text-dark-secondary">{tx.remark}</td>
                    </tr>
                  );
                })}
                {expiringTransactions.length === 0 && (
                  <tr><td colSpan={6} className="text-center text-rm-text-dark-secondary py-6">{t('points.noExpiring', lang)}</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
