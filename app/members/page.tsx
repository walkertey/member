'use client';

import { useEffect, useMemo } from 'react';
import Link from 'next/link';
import { usePointsStore } from '@/lib/store';
import { useI18n } from '@/components/raymond-i18n/RaymondI18nProvider';
import { t } from '@/components/raymond-i18n/raymondTranslations';

const WARN_SVG = (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M12 2L2 22h20L12 2z" fill="var(--rm-gold)" stroke="var(--rm-gold-deep)" strokeWidth="1.5" strokeLinejoin="round"/>
    <line x1="12" y1="9" x2="12" y2="14" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"/>
    <circle cx="12" cy="17.5" r="1.2" fill="#fff"/>
  </svg>
);

export default function MembersPage() {
  const members = usePointsStore((s) => s.members);
  const settleExpiredPoints = usePointsStore((s) => s.settleExpiredPoints);
  const currentRole = usePointsStore((s) => s.currentRole);
  const isIntern = currentRole === '实习生';
  const { lang } = useI18n();

  useEffect(() => {
    settleExpiredPoints();
  }, [settleExpiredPoints]);

  const todayStr = useMemo(() => {
    const d = new Date();
    return d.toISOString().slice(0, 10);
  }, []);

  const stats = useMemo(() => {
    const active = members.filter((m) => m.status === '正常').length;
    const totalPoints = members.reduce((s, m) => s + m.total_points, 0);
    const todayNew = members.filter((m) => m.register_time.slice(0, 10) === todayStr).length;
    return { active, totalPoints, todayNew };
  }, [members, todayStr]);

  const statCards = [
    { label: t('members.total', lang), value: members.length, accent: 'var(--rm-icon-navy)' },
    { label: t('members.active', lang), value: stats.active, accent: 'var(--rm-gold)' },
    { label: t('members.totalPoints', lang), value: stats.totalPoints.toLocaleString(), accent: 'var(--rm-icon-blue)' },
    { label: t('members.todayNew', lang), value: stats.todayNew, accent: 'var(--rm-gold-deep)' },
  ];

  return (
    <div className="max-w-6xl mx-auto rm-demo-page">
      <div className="rm-demo-page-header rm-section-hero">
        <div>
          <h2 className="rm-demo-title">{t('members.title', lang)}</h2>
          <p className="rm-demo-subtitle">
            {`${t('members.total', lang)}: ${members.length} · ${t('members.active', lang)}: ${stats.active}`}
          </p>
        </div>
        {!isIntern && (
          <span className="rm-badge rm-badge-info">{t('members.roleBadge', lang)}</span>
        )}
        {isIntern && (
          <span className="rm-badge rm-badge-warning">{t('members.internReadonly', lang)}</span>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-5">
        {statCards.map((card) => (
          <div key={card.label} className="rm-stat-card rm-depth-card">
            <div className="rm-stat-label">{card.label}</div>
            <div className="rm-stat-value" style={{ color: card.accent }}>
              {card.value}
            </div>
          </div>
        ))}
      </div>

      <div className="rm-demo-table-wrap rm-liquid-card">
        <table className="rm-demo-table min-w-[700px]">
          <thead>
            <tr>
              <th>{t('members.memberNo', lang)}</th>
              <th>{t('members.name', lang)}</th>
              <th>{t('members.phone', lang)}</th>
              <th className="text-right">{t('members.totalPointsCol', lang)}</th>
              <th className="text-right">{t('members.availablePointsCol', lang)}</th>
              <th className="text-right">{t('members.expiredCol', lang)}</th>
              <th className="text-center">{t('members.status', lang)}</th>
              <th className="text-center">{t('members.actions', lang)}</th>
            </tr>
          </thead>
          <tbody>
            {members.map((m) => (
              <tr key={m.id}>
                <td className="font-mono text-xs">{m.member_no}</td>
                <td>{m.name}</td>
                <td className="text-rm-text-dark-secondary">{m.phone}</td>
                <td className="text-right font-medium">
                  {m.total_points.toLocaleString()}
                </td>
                <td className="text-right font-medium text-rm-icon-emerald">
                  {m.available_points.toLocaleString()}
                </td>
                <td className="text-right text-rm-text-dark-secondary">
                  {m.expired_points > 0 ? (
                    <span>{m.expired_points.toLocaleString()} {WARN_SVG}</span>
                  ) : (
                    '0'
                  )}
                </td>
                <td className="text-center">
                  <span className={`rm-badge ${m.status === '正常' ? 'rm-badge-success' : 'rm-badge-danger'}`}>
                    {m.status}
                  </span>
                </td>
                <td className="text-center">
                  <Link
                    href={`/members/${m.id}`}
                    className="rm-demo-link inline-block min-h-[36px] leading-[36px]"
                  >
                    {t('members.detail', lang)}
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
