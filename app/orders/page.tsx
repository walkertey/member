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
    <div className="max-w-6xl mx-auto rm-demo-page">
      <div className="rm-demo-page-header">
        <div>
          <h2 className="rm-demo-title">订单管理</h2>
          <p className="rm-demo-subtitle">订单录入 · 列表查询</p>
        </div>
      </div>

      {/* Result banner */}
      {resultBanner && (
        <div className="mb-5 p-3 md:p-4 rm-demo-card border-emerald-200 bg-emerald-50/50">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-sm font-bold text-emerald-800">
                已生成订单 {resultBanner.orderNo}，会员 {resultBanner.memberName} 积分 +{resultBanner.amount.toLocaleString()}
              </p>
              {resultBanner.referralName && (
                <p className="text-sm text-emerald-700 mt-1">
                  推荐人 {resultBanner.referralName} 积分 +{resultBanner.referralAmount?.toLocaleString()}
                </p>
              )}
            </div>
            <button
              onClick={() => setResultBanner(null)}
              className="text-emerald-700 hover:text-emerald-900 text-sm shrink-0 min-h-[44px] font-bold"
            >
              关闭
            </button>
          </div>
        </div>
      )}

      {/* Order form */}
      <div className="rm-demo-card p-4 md:p-5 mb-5">
        <h3 className="text-md font-bold text-rm-text-dark mb-4">录入订单</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 items-end">
          <div>
            <label className="block text-sm text-rm-text-dark-secondary mb-1 font-medium">选择会员</label>
            <select
              value={selectedMemberId}
              onChange={(e) => setSelectedMemberId(e.target.value)}
              className="rm-demo-filter w-full"
            >
              <option value="">-- 选择会员 --</option>
              {members.filter((m) => m.status === '正常').map((m) => (
                <option key={m.id} value={m.id}>{m.name} ({m.member_no})</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm text-rm-text-dark-secondary mb-1 font-medium">选择配套</label>
            <select
              value={selectedProductId}
              onChange={(e) => setSelectedProductId(e.target.value)}
              className="rm-demo-filter w-full"
            >
              <option value="">-- 选择配套 --</option>
              {products.filter((p) => p.status === '上架').map((p) => (
                <option key={p.id} value={p.id}>{p.name} ({p.code}配套) — RM{p.price.toLocaleString()}</option>
              ))}
            </select>
          </div>
          <div>
            <div className="text-sm text-rm-text-dark-secondary mb-1 font-medium">价格</div>
            <div className="px-3 py-2.5 text-sm font-bold text-rm-text-dark">
              {selectedProduct ? `RM ${selectedProduct.price.toLocaleString()}` : '-'}
            </div>
          </div>
          <div>
            <button
              onClick={handleSubmit}
              disabled={!selectedMemberId || !selectedProductId || submitting}
              className="rm-demo-primary-button w-full px-4 py-2.5 text-sm"
            >
              {submitting ? '处理中...' : '确认支付'}
            </button>
          </div>
        </div>
      </div>

      {/* Order list */}
      <div className="rm-demo-card p-4 md:p-5">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
          <h3 className="text-md font-bold text-rm-text-dark">订单列表</h3>
          <div className="flex gap-2 sm:ml-auto">
            <select value={filterProduct} onChange={(e) => setFilterProduct(e.target.value)} className="rm-demo-filter">
              <option value="">全部配套</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
            <select value={filterOperator} onChange={(e) => setFilterOperator(e.target.value)} className="rm-demo-filter">
              <option value="">全部操作人</option>
              <option value="STAFF001">STAFF001</option>
              <option value="SYSTEM">SYSTEM</option>
            </select>
          </div>
        </div>

        <div className="rm-demo-table-wrap">
          <table className="rm-demo-table min-w-[650px]">
            <thead>
              <tr>
                <th>订单号</th>
                <th>会员</th>
                <th>配套</th>
                <th className="text-right">金额</th>
                <th>支付时间</th>
                <th className="text-center">状态</th>
                <th>操作人</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((o) => {
                const member = members.find((m) => m.id === o.member_id);
                const product = products.find((p) => p.id === o.product_id);
                return (
                  <tr key={o.id}>
                    <td className="font-mono text-xs">{o.order_no}</td>
                    <td>{member?.name ?? o.member_id}</td>
                    <td>{product?.name ?? o.product_id}</td>
                    <td className="text-right font-bold">RM {o.amount.toLocaleString()}</td>
                    <td className="text-xs text-rm-text-dark-secondary">{new Date(o.pay_time).toLocaleString('zh-CN')}</td>
                    <td className="text-center">
                      <span className={`rm-badge ${o.status === '已支付' ? 'rm-badge-success' : 'rm-badge-danger'}`}>
                        {o.status}
                      </span>
                    </td>
                    <td className="text-xs text-rm-text-dark-secondary">{o.operator_id}</td>
                  </tr>
                );
              })}
              {filteredOrders.length === 0 && (
                <tr><td colSpan={7} className="text-center text-rm-text-dark-secondary py-6">暂无订单记录</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
