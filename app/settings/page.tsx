'use client';

import { usePointsStore } from '@/lib/store';

export default function SettingsPage() {
  const products = usePointsStore((s) => s.products);
  const currentRole = usePointsStore((s) => s.currentRole);

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-lg md:text-xl font-semibold text-zinc-800 mb-4 md:mb-6">系统设置</h2>

      {currentRole !== '超级管理员' && (
        <div className="mb-4 md:mb-6 px-3 md:px-4 py-3 bg-amber-50 text-amber-700 text-sm rounded border border-amber-200">
          仅超级管理员可修改系统设置（当前为只读模式）
        </div>
      )}

      {/* 配套价格配置 */}
      <div className="bg-white border border-zinc-200 rounded-lg p-4 md:p-5 mb-4 md:mb-6">
        <h3 className="text-md font-semibold text-zinc-700 mb-3 md:mb-4">配套价格配置</h3>
        <div className="table-responsive">
          <table className="w-full text-sm min-w-[500px]">
            <thead>
              <tr className="bg-zinc-50 border-b border-zinc-200">
                <th className="text-left px-3 py-2 font-medium text-zinc-600">配套代码</th>
                <th className="text-left px-3 py-2 font-medium text-zinc-600">名称</th>
                <th className="text-right px-3 py-2 font-medium text-zinc-600">价格 (RM)</th>
                <th className="text-right px-3 py-2 font-medium text-zinc-600">积分价值</th>
                <th className="text-center px-3 py-2 font-medium text-zinc-600">状态</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="border-b border-zinc-100">
                  <td className="px-3 py-2 font-mono">{p.code}</td>
                  <td className="px-3 py-2">{p.name}</td>
                  <td className="px-3 py-2 text-right font-medium">
                    RM {p.price.toLocaleString()}
                  </td>
                  <td className="px-3 py-2 text-right">{p.point_value.toLocaleString()}</td>
                  <td className="px-3 py-2 text-center">
                    <span
                      className={`px-1.5 py-0.5 text-xs rounded ${
                        p.status === '上架'
                          ? 'bg-green-50 text-green-700'
                          : 'bg-red-50 text-red-700'
                      }`}
                    >
                      {p.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 积分规则 */}
      <div className="bg-white border border-zinc-200 rounded-lg p-4 md:p-5">
        <h3 className="text-md font-semibold text-zinc-700 mb-3 md:mb-4">积分规则配置</h3>
        <div className="space-y-2 md:space-y-3 text-sm">
          <div className="flex flex-col sm:flex-row sm:justify-between p-3 bg-zinc-50 rounded gap-1">
            <span className="text-zinc-600">积分有效期</span>
            <span className="font-medium text-zinc-800">获得日起 12 个月</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:justify-between p-3 bg-zinc-50 rounded gap-1">
            <span className="text-zinc-600">购买积分比例</span>
            <span className="font-medium text-zinc-800">1:1（RM1 = 1 分）</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:justify-between p-3 bg-zinc-50 rounded gap-1">
            <span className="text-zinc-600">推荐奖励比例</span>
            <span className="font-medium text-zinc-800">订单金额 × 30%（四舍五入）</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:justify-between p-3 bg-zinc-50 rounded gap-1">
            <span className="text-zinc-600">积分清算规则</span>
            <span className="font-medium text-zinc-800">每次页面加载时自动结算到期积分</span>
          </div>
        </div>
      </div>
    </div>
  );
}
