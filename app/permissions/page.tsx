'use client';

import { usePointsStore } from '@/lib/store';
import { useI18n } from '@/components/raymond-i18n/RaymondI18nProvider';
import { t, transRole, transStatus, getLangLocale } from '@/components/raymond-i18n/raymondTranslations';
import type { TranslationKey } from '@/components/raymond-i18n/raymondTranslations';
import type { Role } from '@/lib/permissions';
import { ALL_ROLES, MENU_VISIBILITY } from '@/lib/permissions';

const FAKE_STAFF = [
  { id: 'STAFF001', name: '管理员', role: '超级管理员' as Role, status: '激活' },
  { id: 'STAFF002', name: '运营经理', role: '运营主管' as Role, status: '激活' },
  { id: 'STAFF003', name: '客服A', role: '客服专员' as Role, status: '激活' },
  { id: 'STAFF004', name: '实习生B', role: '实习生' as Role, status: '激活' },
];

const PERM_LABEL_MAP: Record<string, string> = {
  dashboard: '仪表盘',
  members: '会员管理',
  orders: '订单管理',
  points: '积分中心',
  redemption: '兑换商城',
  reports: '报表中心',
  settings: '系统设置',
  permissions: '权限管理',
};

const NAV_KEY_MAP: Record<string, TranslationKey> = {
  dashboard: 'nav.home',
  members: 'nav.members',
  orders: 'nav.orders',
  points: 'nav.points',
  redemption: 'nav.redemption',
  reports: 'nav.reports',
  settings: 'nav.settings',
  permissions: 'nav.permissions',
};

export default function PermissionsPage() {
  const { lang } = useI18n();
  const operationLogs = usePointsStore((s) => s.operationLogs);

  return (
    <div className="max-w-6xl mx-auto rm-demo-page">
      <div className="rm-demo-hero">
        <div>
          <h2 className="rm-demo-title">{t('permissions.title', lang)}</h2>
          <p className="rm-demo-subtitle">{t('permissions.subtitle', lang)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Staff list */}
        <div className="rm-demo-card rm-liquid-card p-4 md:p-5">
          <h3 className="text-md font-bold text-rm-text-dark mb-4">{t('permissions.staffList', lang)}</h3>
          <div className="rm-demo-table-wrap">
            <table className="rm-demo-table min-w-[320px]">
              <thead>
                <tr>
                  <th>{t('permissions.staffId', lang)}</th>
                  <th>{t('permissions.name', lang)}</th>
                  <th>{t('permissions.role', lang)}</th>
                  <th className="text-center">{t('permissions.status', lang)}</th>
                </tr>
              </thead>
              <tbody>
                {FAKE_STAFF.map((s) => (
                  <tr key={s.id}>
                    <td className="font-mono text-xs">{s.id}</td>
                    <td>{s.name}</td>
                    <td>
                      <span className="rm-badge rm-badge-gold">{transRole(s.role, lang)}</span>
                    </td>
                    <td className="text-center">
                      <span className="rm-badge rm-badge-success">{t('badge.active', lang)}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Role permissions */}
        <div className="rm-demo-card rm-liquid-card p-4 md:p-5">
          <h3 className="text-md font-bold text-rm-text-dark mb-4">{t('permissions.roleOverview', lang)}</h3>
          <div className="space-y-2 md:space-y-3">
            {ALL_ROLES.map((role) => {
              const menus = MENU_VISIBILITY[role];
              return (
                <div key={role} className="p-3 rounded-xl border border-[var(--rm-border-light)] hover:border-[var(--rm-gold)] transition-colors">
                  <div className="font-bold text-sm text-rm-text-dark mb-2">{role}</div>
                  <div className="flex flex-wrap gap-1">
                    {menus.map((m) => {
                      const navKey = NAV_KEY_MAP[m];
                      return (
                        <span
                          key={m}
                          className="rm-badge rm-badge-info"
                        >
                          {navKey ? t(navKey, lang) : (PERM_LABEL_MAP[m] ?? m)}
                        </span>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Operation log */}
      <div className="rm-demo-card rm-liquid-card p-4 md:p-5 mt-5">
        <h3 className="text-md font-bold text-rm-text-dark mb-4">{t('permissions.auditLog', lang)}</h3>
        <div className="rm-demo-table-wrap">
          <table className="rm-demo-table min-w-[450px]">
            <thead>
              <tr>
                <th>{t('permissions.time', lang)}</th>
                <th>{t('permissions.operator', lang)}</th>
                <th>{t('permissions.action', lang)}</th>
                <th>{t('permissions.detail', lang)}</th>
              </tr>
            </thead>
            <tbody>
              {[...operationLogs].reverse().map((log) => (
                <tr key={log.id}>
                  <td className="text-xs text-rm-text-dark-secondary">{new Date(log.time).toLocaleString(getLangLocale(lang))}</td>
                  <td className="text-xs">{log.operator_id}</td>
                  <td>{log.action}</td>
                  <td className="text-xs text-rm-text-dark-secondary">{log.detail}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
