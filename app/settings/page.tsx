'use client';

import { usePointsStore } from '@/lib/store';
import { useI18n } from '@/components/raymond-i18n/RaymondI18nProvider';
import { t } from '@/components/raymond-i18n/raymondTranslations';

export default function SettingsPage() {
  const { lang } = useI18n();
  const products = usePointsStore((s) => s.products);
  const currentRole = usePointsStore((s) => s.currentRole);

  return (
    <div className="max-w-4xl mx-auto rm-demo-page">
      <div className="rm-demo-page-header rm-section-hero">
        <div>
          <h2 className="rm-demo-title">{t('settings.title', lang)}</h2>
          <p className="rm-demo-subtitle">{t('settings.subtitle', lang)}</p>
        </div>
      </div>

      {currentRole !== '超级管理员' && (
        <div className="mb-5 px-4 py-3 rm-stat-card border-amber-200 bg-amber-50/50">
          <p className="text-sm font-medium text-amber-800">
            {t('settings.readonlyNotice', lang)}
          </p>
        </div>
      )}

      {/* Products config */}
      <div className="rm-demo-card rm-liquid-card p-4 md:p-5 mb-5">
        <h3 className="text-md font-bold text-rm-text-dark mb-4">{t('settings.productConfig', lang)}</h3>
        <div className="rm-demo-table-wrap">
          <table className="rm-demo-table min-w-[500px]">
            <thead>
              <tr>
                <th>{t('settings.productCode', lang)}</th>
                <th>{t('settings.productName', lang)}</th>
                <th className="text-right">{t('settings.price', lang)}</th>
                <th className="text-right">{t('settings.pointValue', lang)}</th>
                <th className="text-center">{t('settings.status', lang)}</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id}>
                  <td className="font-mono">{p.code}</td>
                  <td>{p.name}</td>
                  <td className="text-right font-bold">RM {p.price.toLocaleString()}</td>
                  <td className="text-right">{p.point_value.toLocaleString()}</td>
                  <td className="text-center">
                    <span className={`rm-badge ${p.status === '上架' ? 'rm-badge-success' : 'rm-badge-danger'}`}>
                      {p.status === '上架' ? t('badge.listed', lang) : t('badge.unlisted', lang)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Points rules */}
      <div className="rm-demo-card rm-liquid-card p-4 md:p-5">
        <h3 className="text-md font-bold text-rm-text-dark mb-4">{t('settings.pointsRules', lang)}</h3>
        <div className="space-y-2 md:space-y-3 text-sm">
          {[
            { label: t('settings.ruleExpiry', lang), value: t('settings.ruleExpiryValue', lang) },
            { label: t('settings.ruleRatio', lang), value: t('settings.ruleRatioValue', lang) },
            { label: t('settings.ruleReferral', lang), value: t('settings.ruleReferralValue', lang) },
            { label: t('settings.ruleSettlement', lang), value: t('settings.ruleSettlementValue', lang) },
          ].map((rule) => (
            <div key={rule.label} className="flex flex-col sm:flex-row sm:justify-between p-3 bg-zinc-50 rounded-xl gap-1">
              <span className="text-rm-text-dark-secondary font-medium">{rule.label}</span>
              <span className="font-bold text-rm-text-dark">{rule.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
