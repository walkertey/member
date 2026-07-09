'use client';

import { useState, useMemo } from 'react';
import { usePointsStore } from '@/lib/store';
import { useI18n } from '@/components/raymond-i18n/RaymondI18nProvider';
import { t, transStatus, getLangLocale } from '@/components/raymond-i18n/raymondTranslations';

export default function OrdersPage() {
  const { lang } = useI18n();
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
      addToast('success', t('orders.orderGenerated', lang, { no: result.order.order_no }));
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
      <div className="rm-demo-page-header rm-section-hero">
        <div>
          <h2 className="rm-demo-title">{t('orders.title', lang)}</h2>
          <p className="rm-demo-subtitle">{t('orders.subtitle', lang)}</p>
        </div>
      </div>

      {/* Result banner */}
      {resultBanner && (
        <div className="mb-5 p-3 md:p-4 rm-demo-card rm-floating-panel border-emerald-200 bg-emerald-50/50">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-sm font-bold text-emerald-800">
                {t('orders.orderMemberPoints', lang, { name: resultBanner.memberName, amount: resultBanner.amount.toLocaleString() })}
              </p>
              {resultBanner.referralName && (
                <p className="text-sm text-emerald-700 mt-1">
                  {t('orders.orderReferral', lang, { name: resultBanner.referralName, amount: resultBanner.referralAmount?.toLocaleString() ?? '0' })}
                </p>
              )}
            </div>
            <button
              onClick={() => setResultBanner(null)}
              className="text-emerald-700 hover:text-emerald-900 text-sm shrink-0 min-h-[44px] font-bold"
            >
              {t('orders.closeBanner', lang)}
            </button>
          </div>
        </div>
      )}

      {/* Order form */}
      <div className="rm-demo-card rm-liquid-card p-4 md:p-5 mb-5">
        <h3 className="text-md font-bold text-rm-text-dark mb-4">{t('orders.createOrder', lang)}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 items-end">
          <div>
            <label className="block text-sm text-rm-text-dark-secondary mb-1 font-medium">{t('orders.selectMemberLabel', lang)}</label>
            <select
              value={selectedMemberId}
              onChange={(e) => setSelectedMemberId(e.target.value)}
              className="rm-demo-filter w-full"
            >
              <option value="">{t('orders.selectMember', lang)}</option>
              {members.filter((m) => m.status === '正常').map((m) => (
                <option key={m.id} value={m.id}>{m.name} ({m.member_no})</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm text-rm-text-dark-secondary mb-1 font-medium">{t('orders.selectProductLabel', lang)}</label>
            <select
              value={selectedProductId}
              onChange={(e) => setSelectedProductId(e.target.value)}
              className="rm-demo-filter w-full"
            >
              <option value="">{t('orders.selectProduct', lang)}</option>
              {products.filter((p) => p.status === '上架').map((p) => (
                <option key={p.id} value={p.id}>{p.name} ({p.code}{t('orders.product', lang)}) — RM{p.price.toLocaleString()}</option>
              ))}
            </select>
          </div>
          <div>
            <div className="text-sm text-rm-text-dark-secondary mb-1 font-medium">{t('orders.price', lang)}</div>
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
              {submitting ? t('orders.processing', lang) : t('orders.confirmPayment', lang)}
            </button>
          </div>
        </div>
      </div>

      {/* Order list */}
      <div className="rm-demo-card rm-liquid-card p-4 md:p-5">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
          <h3 className="text-md font-bold text-rm-text-dark">{t('orders.orderList', lang)}</h3>
          <div className="flex gap-2 sm:ml-auto">
            <select value={filterProduct} onChange={(e) => setFilterProduct(e.target.value)} className="rm-demo-filter">
              <option value="">{t('orders.allProducts', lang)}</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
            <select value={filterOperator} onChange={(e) => setFilterOperator(e.target.value)} className="rm-demo-filter">
              <option value="">{t('orders.allOperators', lang)}</option>
              <option value="STAFF001">STAFF001</option>
              <option value="SYSTEM">SYSTEM</option>
            </select>
          </div>
        </div>

        <div className="rm-demo-table-wrap">
          <table className="rm-demo-table min-w-[650px]">
            <thead>
              <tr>
                <th>{t('orders.orderNo', lang)}</th>
                <th>{t('orders.member', lang)}</th>
                <th>{t('orders.product', lang)}</th>
                <th className="text-right">{t('orders.amount', lang)}</th>
                <th>{t('orders.payTime', lang)}</th>
                <th className="text-center">{t('orders.status', lang)}</th>
                <th>{t('orders.operator', lang)}</th>
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
                    <td className="text-xs text-rm-text-dark-secondary">{new Date(o.pay_time).toLocaleString(getLangLocale(lang))}</td>
                    <td className="text-center">
                      <span className={`rm-badge ${o.status === '已支付' ? 'rm-badge-success' : 'rm-badge-danger'}`}>
                        {transStatus(o.status, lang)}
                      </span>
                    </td>
                    <td className="text-xs text-rm-text-dark-secondary">{o.operator_id}</td>
                  </tr>
                );
              })}
              {filteredOrders.length === 0 && (
                <tr><td colSpan={7} className="text-center text-rm-text-dark-secondary py-6">{t('orders.noData', lang)}</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
