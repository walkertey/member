import { PageShell, Panel, StatusBadge } from "./PageShell";

const orders = [
  { id: "ORD-260714-001", date: "14 Jul 2026", amount: "RM 288.00", status: "Completed" },
  { id: "ORD-260630-018", date: "30 Jun 2026", amount: "RM 128.00", status: "Completed" },
  { id: "ORD-260518-006", date: "18 May 2026", amount: "RM 88.00", status: "Processing" },
];

export default function Orders() {
  return (
    <PageShell title="My Orders" subtitle="我的订单 · Pesanan Saya">
      <div className="space-y-4">
        {orders.map((order) => (
          <Panel key={order.id}>
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <p className="font-semibold">{order.id}</p>
                <p className="mt-1 text-xs text-[#A9B6CB]">{order.date}</p>
              </div>
              <StatusBadge>{order.status}</StatusBadge>
            </div>
            <div className="flex items-end justify-between">
              <span className="text-sm text-[#A9B6CB]">Order total</span>
              <span className="text-xl font-bold text-[#F2D188]">
                {order.amount}
              </span>
            </div>
          </Panel>
        ))}
      </div>
    </PageShell>
  );
}
