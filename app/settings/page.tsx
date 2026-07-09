'use client';

import { usePointsStore } from '@/lib/store';
import { translate } from '@/lib/i18n';

export default function SettingsPage() {
  const products = usePointsStore((s) => s.products);
  const currentRole = usePointsStore((s) => s.currentRole);
  const locale = usePointsStore((s) => s.locale);

  return (
    <div className="max-w-4xl mx-auto rm-demo-page">
      <div className="rm-demo-hero">
        <div>
          <h2 className="rm-demo-title">{translate(locale, 'settings.title')}</h2>
          <p className="rm-demo-subtitle">配套配置 · 积分规则</p>
        </div>
      </div>

      {currentRole !== '超级管理员' && (
        <div className="mb-5 px-4 py-3 rm-stat-card border-amber-200 bg-amber-50/50">
          <p className="text-sm font-medium text-amber-800">
            仅超级管理员可修改系统设置（当前为只读模式）
          </p>
        </div>
      )}

      {/* Products config */}
      <div className="rm-demo-card p-4 md:p-5 mb-5">
        <h3 className="text-md font-bold text-rm-text-dark mb-4">配套价格配置</h3>
        <div className="rm-demo-table-wrap">
          <table className="rm-demo-table min-w-[500px]">
            <thead>
              <tr>
                <th>配套代码</th>
                <th>名称</th>
                <th className="text-right">价格 (RM)</th>
                <th className="text-right">积分价值</th>
                <th className="text-center">状态</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id}>
                  <td className="font-mono">{p.code}</td>
                  <td>{p.name}</td>
                  <td className="text-right font-bold">RM {p.price.toLocaleString()}</td>
                  <td className="text-right rm-demo-number">{p.point_value.toLocaleString()}</td>
                  <td className="text-center">
                    <span className={`rm-badge ${p.status === '上架' ? 'rm-badge-success' : 'rm-badge-danger'}`}>
                      {p.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Points rules */}
      <div className="rm-demo-card p-4 md:p-5">
        <h3 className="text-md font-bold text-rm-text-dark mb-4">积分规则配置</h3>
        <div className="space-y-2 md:space-y-3 text-sm">
          {[
            { label: '积分有效期', value: '获得日起 12 个月' },
            { label: '购买积分比例', value: '1:1（RM1 = 1 分）' },
            { label: '推荐奖励比例', value: '订单金额 × 30%（四舍五入）' },
            { label: '积分清算规则', value: '每次页面加载时自动结算到期积分' },
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
