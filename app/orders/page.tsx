'use client';

import { useState, useMemo } from 'react';
import { usePointsStore } from '@/lib/store';

export default function OrdersPage() {
  const members = usePointsStore((s) => s.members);
  const products = usePointsStore((s) => s.products);
  const orders = usePointsStore((s) => s.orders);
  const createOrder = usePointsStore((s) => s.createOrder);
  const addToast = usePointsStore((s) => s.addToast);

  const [selectedMemberId, setSelectedMemberId] = useState('');
  const [selectedProductId, setSelectedProductId] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [resultBanner, setResultBanner] = useState<{
    orderNo: string;
    memberName: string;
    amount: number;
    referralName?: string;
    referralAmount?: number;
  } | null>(null);

  const [filterProduct, setFilterProduct] = useState('');
  const [filterOperator, setFilterOperator] = useState('');

  const selectedProduct = useMemo(
    () => products.find((p) => p.id === selectedProductId),
    [products, selectedProductId]
  );

  const handleSubmit = () => {
    if (!selectedMemberId || !selectedProductId) return;
    setSubmitting(true);
    try {
      const result = createOrder(selectedMemberId, selectedProductId);
      const member = members.find((m) => m.id === selectedMemberId);
      const banner: typeof resultBanner = {
        orderNo: result.order.order_no,
        memberName: member?.name ?? selectedMemberId,
        amount: result.transaction.amount,
      };
      if (result.referralBonus) {
        const referrer = members.find((m) => m.id === member?.referrer_id);
        banner.referralName = referrer?.name ?? member?.referrer_id ?? undefined;
        banner.referralAmount = result.referralBonus.amount;
      }
      setResultBanner(banner);
      addToast('success', `订单 ${result.order.order_no} 已生成`);
      setSelectedMemberId('');
      setSelectedProductId('');
    } catch (e) {
      addToast('error', (e as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      if (filterProduct && o.product_id !== filterProduct) return false;
      if (filterOperator && o.operator_id !== filterOperator) return false;
      return true;
    }).sort((a, b) => new Date(b.pay_time).getTime() - new Date(a.pay_time).getTime());
  }, [orders, filterProduct, filterOperator]);

  return (
    <div className="max-w-6xl mx-auto">
      <h2 className="text-lg md:text-xl font-semibold text-zinc-800 mb-4 md:mb-6">订单管理</h2>

      {/* 结果横幅 */}
      {resultBanner && (
        <div className="mb-4 md:mb-6 p-3 md:p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-sm font-medium text-green-800">
                已生成订单 {resultBanner.orderNo}，会员 {resultBanner.memberName} 积分 +{resultBanner.amount.toLocaleString()}
              </p>
              {resultBanner.referralName && (
                <p className="text-sm text-green-700 mt-1">
                  推荐人 {resultBanner.referralName} 积分 +{resultBanner.referralAmount?.toLocaleString()}
                </p>
              )}
            </div>
            <button
              onClick={() => setResultBanner(null)}
              className="text-green-600 hover:text-green-800 text-sm shrink-0 min-h-[44px]"
            >
              关闭
            </button>
          </div>
        </div>
      )}

      {/* 录入订单表单 — stack on mobile */}
      <div className="bg-white border border-zinc-200 rounded-lg p-4 md:p-5 mb-4 md:mb-6">
        <h3 className="text-md font-semibold text-zinc-700 mb-3 md:mb-4">录入订单</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 items-end">
          <div>
            <label className="block text-sm text-zinc-600 mb-1">选择会员</label>
            <select
              value={selectedMemberId}
              onChange={(e) => setSelectedMemberId(e.target.value)}
              className="w-full border border-zinc-300 rounded px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[44px]"
            >
              <option value="">-- 选择会员 --</option>
              {members
                .filter((m) => m.status === '正常')
                .map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name} ({m.member_no})
                  </option>
                ))}
            </select>
          </div>
          <div>
            <label className="block text-sm text-zinc-600 mb-1">选择配套</label>
            <select
              value={selectedProductId}
              onChange={(e) => setSelectedProductId(e.target.value)}
              className="w-full border border-zinc-300 rounded px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[44px]"
            >
              <option value="">-- 选择配套 --</option>
              {products
                .filter((p) => p.status === '上架')
                .map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.code}配套) — RM{p.price.toLocaleString()}
                  </option>
                ))}
            </select>
          </div>
          <div>
            <div className="text-sm text-zinc-600 mb-1">价格</div>
            <div className="px-3 py-2.5 text-sm font-medium text-zinc-800">
              {selectedProduct ? `RM ${selectedProduct.price.toLocaleString()}` : '-'}
            </div>
          </div>
          <div>
            <button
              onClick={handleSubmit}
              disabled={!selectedMemberId || !selectedProductId || submitting}
              className="w-full px-4 py-2.5 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors min-h-[44px]"
            >
              {submitting ? '处理中...' : '确认支付'}
            </button>
          </div>
        </div>
      </div>

      {/* 订单列表 */}
      <div className="bg-white border border-zinc-200 rounded-lg p-4 md:p-5">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
          <h3 className="text-md font-semibold text-zinc-700">订单列表</h3>
          <div className="flex gap-2 sm:ml-auto">
            <select
              value={filterProduct}
              onChange={(e) => setFilterProduct(e.target.value)}
              className="text-sm border border-zinc-300 rounded px-2 py-2 min-h-[44px]"
            >
              <option value="">全部配套</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
            <select
              value={filterOperator}
              onChange={(e) => setFilterOperator(e.target.value)}
              className="text-sm border border-zinc-300 rounded px-2 py-2 min-h-[44px]"
            >
              <option value="">全部操作人</option>
              <option value="STAFF001">STAFF001</option>
              <option value="SYSTEM">SYSTEM</option>
            </select>
          </div>
        </div>

        <div className="table-responsive">
          <table className="w-full text-sm min-w-[650px]">
            <thead>
              <tr className="bg-zinc-50 border-b border-zinc-200">
                <th className="text-left px-3 py-2 font-medium text-zinc-600">订单号</th>
                <th className="text-left px-3 py-2 font-medium text-zinc-600">会员</th>
                <th className="text-left px-3 py-2 font-medium text-zinc-600">配套</th>
                <th className="text-right px-3 py-2 font-medium text-zinc-600">金额</th>
                <th className="text-left px-3 py-2 font-medium text-zinc-600">支付时间</th>
                <th className="text-center px-3 py-2 font-medium text-zinc-600">状态</th>
                <th className="text-left px-3 py-2 font-medium text-zinc-600">操作人</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((o) => {
                const member = members.find((m) => m.id === o.member_id);
                const product = products.find((p) => p.id === o.product_id);
                return (
                  <tr key={o.id} className="border-b border-zinc-100 hover:bg-zinc-50">
                    <td className="px-3 py-2 font-mono text-xs">{o.order_no}</td>
                    <td className="px-3 py-2">{member?.name ?? o.member_id}</td>
                    <td className="px-3 py-2">{product?.name ?? o.product_id}</td>
                    <td className="px-3 py-2 text-right font-medium">
                      RM {o.amount.toLocaleString()}
                    </td>
                    <td className="px-3 py-2 text-xs text-zinc-500">
                      {new Date(o.pay_time).toLocaleString('zh-CN')}
                    </td>
                    <td className="px-3 py-2 text-center">
                      <span
                        className={`px-1.5 py-0.5 text-xs rounded ${
                          o.status === '已支付'
                            ? 'bg-green-50 text-green-700'
                            : 'bg-red-50 text-red-700'
                        }`}
                      >
                        {o.status}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-xs text-zinc-500">{o.operator_id}</td>
                  </tr>
                );
              })}
              {filteredOrders.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-3 py-6 text-center text-zinc-400">
                    暂无订单记录
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
