import { useMemo, useState } from "react";
import { BarChart3, Gift, RotateCcw, Settings, ShoppingBag, SlidersHorizontal, Users } from "lucide-react";
import { PageShell, Panel, StatusBadge } from "./PageShell";
import { useDemoData, type DemoRole } from "@/contexts/DemoDataContext";

const sections = ["members", "orders", "points", "rewards", "reports", "settings"] as const;
type Section = (typeof sections)[number];

const copy = {
  en: { title: "Management Center", subtitle: "Complete Raymond demo operations", members: "Members", orders: "Orders", points: "Points", rewards: "Rewards", reports: "Reports", settings: "Settings", add: "Add", create: "Create order", adjust: "Adjust points", redeem: "Redeem", approve: "Approve", reject: "Reject", reset: "Reset demo data", role: "Current role" },
  zh: { title: "管理中心", subtitle: "完整 Raymond Demo 营运功能", members: "会员", orders: "订单", points: "积分", rewards: "兑换", reports: "报表", settings: "设置", add: "新增", create: "创建订单", adjust: "调整积分", redeem: "兑换", approve: "通过", reject: "驳回", reset: "重置 Demo 数据", role: "当前角色" },
  ms: { title: "Pusat Pengurusan", subtitle: "Operasi demo Raymond lengkap", members: "Ahli", orders: "Pesanan", points: "Poin", rewards: "Ganjaran", reports: "Laporan", settings: "Tetapan", add: "Tambah", create: "Cipta pesanan", adjust: "Laras poin", redeem: "Tebus", approve: "Lulus", reject: "Tolak", reset: "Tetapkan semula data", role: "Peranan semasa" },
};

const sectionIcons = { members: Users, orders: ShoppingBag, points: SlidersHorizontal, rewards: Gift, reports: BarChart3, settings: Settings };

export default function Management() {
  const data = useDemoData();
  const [section, setSection] = useState<Section>("members");
  const [lang] = useState<keyof typeof copy>(() => (localStorage.getItem("raymond-language") as keyof typeof copy) || "en");
  const t = copy[lang] ?? copy.en;
  const [memberName, setMemberName] = useState("");
  const [memberPhone, setMemberPhone] = useState("");
  const [memberId, setMemberId] = useState(data.members[0]?.id ?? "");
  const [packageName, setPackageName] = useState("Standard Package");
  const [amount, setAmount] = useState(600);
  const [delta, setDelta] = useState(100);
  const [reason, setReason] = useState("Service recovery");
  const [giftId, setGiftId] = useState(data.gifts[0]?.id ?? "");
  const [message, setMessage] = useState("");

  const totalPoints = useMemo(() => data.members.reduce((sum, member) => sum + member.points, 0), [data.members]);
  const totalRevenue = useMemo(() => data.orders.reduce((sum, order) => sum + order.amount, 0), [data.orders]);

  const run = (action: () => void) => {
    try { action(); setMessage("PASS"); } catch (error) { setMessage(error instanceof Error ? error.message : "Action failed"); }
  };

  return (
    <PageShell title={t.title} subtitle={t.subtitle}>
      <div className="mb-5 grid grid-cols-3 gap-2">
        {sections.map((item) => {
          const Icon = sectionIcons[item];
          return <button key={item} type="button" onClick={() => setSection(item)} className={`min-h-[72px] rounded-xl border px-2 py-3 text-xs font-semibold ${section === item ? "border-[#EBCB83] bg-[#EBCB83] text-[#001733]" : "border-white/10 bg-white/5 text-[#D5DEEA]"}`}><Icon className="mx-auto mb-1 h-5 w-5" />{t[item]}</button>;
        })}
      </div>

      {message && <div className="mb-4 rounded-xl border border-[#EBCB83]/30 bg-[#EBCB83]/10 px-4 py-3 text-sm text-[#F2D188]">{message}</div>}

      {section === "members" && <div className="space-y-4">
        <Panel><div className="grid gap-3"><input value={memberName} onChange={(event) => setMemberName(event.target.value)} placeholder="Member name" className="rounded-xl bg-[#001733] px-4 py-3" /><input value={memberPhone} onChange={(event) => setMemberPhone(event.target.value)} placeholder="Phone" className="rounded-xl bg-[#001733] px-4 py-3" /><button type="button" onClick={() => run(() => { if (!memberName || !memberPhone) throw new Error("Name and phone required"); data.addMember(memberName, memberPhone); setMemberName(""); setMemberPhone(""); })} className="rounded-xl bg-[#EBCB83] px-4 py-3 font-bold text-[#001733]">{t.add}</button></div></Panel>
        {data.members.map((member) => <Panel key={member.id}><div className="flex items-start justify-between gap-3"><div><h2 className="font-semibold">{member.name}</h2><p className="text-sm text-[#A9B6CB]">{member.id} · {member.phone}</p><p className="mt-2 font-bold text-[#F2D188]">{member.points.toLocaleString()} points</p></div><button type="button" onClick={() => data.toggleMember(member.id)}><StatusBadge>{member.status}</StatusBadge></button></div></Panel>)}
      </div>}

      {section === "orders" && <div className="space-y-4"><Panel><div className="grid gap-3"><select value={memberId} onChange={(event) => setMemberId(event.target.value)} className="rounded-xl bg-[#001733] px-4 py-3">{data.members.map((member) => <option key={member.id} value={member.id}>{member.name}</option>)}</select><input value={packageName} onChange={(event) => setPackageName(event.target.value)} className="rounded-xl bg-[#001733] px-4 py-3" /><input type="number" value={amount} onChange={(event) => setAmount(Number(event.target.value))} className="rounded-xl bg-[#001733] px-4 py-3" /><button type="button" onClick={() => run(() => data.createOrder(memberId, packageName, amount))} className="rounded-xl bg-[#EBCB83] px-4 py-3 font-bold text-[#001733]">{t.create}</button></div></Panel>{[...data.orders].reverse().map((order) => <Panel key={order.id}><div className="flex justify-between gap-3"><div><h2 className="font-semibold">{order.packageName}</h2><p className="text-sm text-[#A9B6CB]">{order.memberId} · {order.createdAt.slice(0, 10)}</p></div><p className="font-bold text-[#F2D188]">RM {order.amount}</p></div></Panel>)}</div>}

      {section === "points" && <div className="space-y-4"><Panel><div className="grid gap-3"><select value={memberId} onChange={(event) => setMemberId(event.target.value)} className="rounded-xl bg-[#001733] px-4 py-3">{data.members.map((member) => <option key={member.id} value={member.id}>{member.name}</option>)}</select><input type="number" value={delta} onChange={(event) => setDelta(Number(event.target.value))} className="rounded-xl bg-[#001733] px-4 py-3" /><input value={reason} onChange={(event) => setReason(event.target.value)} className="rounded-xl bg-[#001733] px-4 py-3" /><button type="button" onClick={() => run(() => data.adjustPoints(memberId, delta, reason))} className="rounded-xl bg-[#EBCB83] px-4 py-3 font-bold text-[#001733]">{t.adjust}</button></div></Panel>{[...data.pointLogs].reverse().map((log) => <Panel key={log.id}><div className="flex justify-between gap-3"><div><h2 className="font-semibold">{log.reason}</h2><p className="text-sm text-[#A9B6CB]">{log.memberId}</p></div><p className={`font-bold ${log.delta >= 0 ? "text-emerald-300" : "text-rose-300"}`}>{log.delta > 0 ? "+" : ""}{log.delta}</p></div></Panel>)}</div>}

      {section === "rewards" && <div className="space-y-4"><Panel><div className="grid gap-3"><select value={memberId} onChange={(event) => setMemberId(event.target.value)} className="rounded-xl bg-[#001733] px-4 py-3">{data.members.map((member) => <option key={member.id} value={member.id}>{member.name}</option>)}</select><select value={giftId} onChange={(event) => setGiftId(event.target.value)} className="rounded-xl bg-[#001733] px-4 py-3">{data.gifts.map((gift) => <option key={gift.id} value={gift.id}>{gift.name} · {gift.cost}</option>)}</select><button type="button" onClick={() => run(() => data.redeemGift(memberId, giftId))} className="rounded-xl bg-[#EBCB83] px-4 py-3 font-bold text-[#001733]">{t.redeem}</button></div></Panel>{data.redemptions.map((record) => <Panel key={record.id}><p className="font-semibold">{record.memberId} · {data.gifts.find((gift) => gift.id === record.giftId)?.name}</p><div className="mt-3 flex items-center justify-between"><StatusBadge>{record.status}</StatusBadge>{record.status === "pending" && data.role !== "staff" && <div className="flex gap-2"><button type="button" onClick={() => data.reviewRedemption(record.id, true)} className="rounded-lg bg-emerald-500/20 px-3 py-2 text-xs">{t.approve}</button><button type="button" onClick={() => data.reviewRedemption(record.id, false)} className="rounded-lg bg-rose-500/20 px-3 py-2 text-xs">{t.reject}</button></div>}</div></Panel>)}</div>}

      {section === "reports" && <div className="grid grid-cols-2 gap-3"><Panel><p className="text-xs text-[#A9B6CB]">Members</p><p className="mt-2 text-3xl font-black text-[#F2D188]">{data.members.length}</p></Panel><Panel><p className="text-xs text-[#A9B6CB]">Revenue</p><p className="mt-2 text-2xl font-black text-[#F2D188]">RM {totalRevenue}</p></Panel><Panel><p className="text-xs text-[#A9B6CB]">Points</p><p className="mt-2 text-2xl font-black text-[#F2D188]">{totalPoints}</p></Panel><Panel><p className="text-xs text-[#A9B6CB]">Pending</p><p className="mt-2 text-3xl font-black text-[#F2D188]">{data.redemptions.filter((record) => record.status === "pending").length}</p></Panel></div>}

      {section === "settings" && <div className="space-y-4"><Panel><p className="mb-3 text-sm text-[#A9B6CB]">{t.role}</p><div className="grid grid-cols-3 gap-2">{(["owner", "manager", "staff"] as DemoRole[]).map((role) => <button key={role} type="button" onClick={() => data.setRole(role)} className={`rounded-xl px-3 py-3 text-sm font-semibold ${data.role === role ? "bg-[#EBCB83] text-[#001733]" : "bg-[#001733]"}`}>{role}</button>)}</div></Panel><button type="button" onClick={data.resetDemo} className="flex w-full items-center justify-center gap-2 rounded-xl border border-rose-400/30 bg-rose-500/10 px-4 py-3 font-semibold text-rose-200"><RotateCcw className="h-4 w-4" />{t.reset}</button></div>}
    </PageShell>
  );
}
