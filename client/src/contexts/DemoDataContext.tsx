import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

export type DemoRole = "owner" | "manager" | "staff";
export type MemberStatus = "active" | "frozen";

export interface DemoMember {
  id: string;
  name: string;
  phone: string;
  points: number;
  expiredPoints: number;
  status: MemberStatus;
  referrerId?: string;
}

export interface DemoOrder {
  id: string;
  memberId: string;
  packageName: string;
  amount: number;
  pointsEarned: number;
  createdAt: string;
  status: "paid" | "refunded";
}

export interface DemoGift {
  id: string;
  name: string;
  cost: number;
  stock: number;
}

export interface DemoRedemption {
  id: string;
  memberId: string;
  giftId: string;
  cost: number;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
}

export interface PointLog {
  id: string;
  memberId: string;
  delta: number;
  reason: string;
  createdAt: string;
}

interface PersistedDemoData {
  role: DemoRole;
  members: DemoMember[];
  orders: DemoOrder[];
  gifts: DemoGift[];
  redemptions: DemoRedemption[];
  pointLogs: PointLog[];
}

interface DemoDataState extends PersistedDemoData {
  setRole: (role: DemoRole) => void;
  addMember: (name: string, phone: string) => void;
  toggleMember: (memberId: string) => void;
  createOrder: (memberId: string, packageName: string, amount: number) => void;
  adjustPoints: (memberId: string, delta: number, reason: string) => void;
  redeemGift: (memberId: string, giftId: string) => void;
  reviewRedemption: (id: string, approve: boolean) => void;
  resetDemo: () => void;
}

const STORAGE_KEY = "raymond-demo-business-v1";

const seed: PersistedDemoData = {
  role: "owner",
  members: [
    { id: "M10001", name: "Alex Tan", phone: "012-3456789", points: 4200, expiredPoints: 600, status: "active" },
    { id: "M10002", name: "Li Na", phone: "012-3456790", points: 3200, expiredPoints: 0, status: "active", referrerId: "M10001" },
    { id: "M10003", name: "Aiman", phone: "012-3456791", points: 7000, expiredPoints: 1500, status: "active" },
    { id: "M10004", name: "Mei Ling", phone: "012-3456792", points: 1500, expiredPoints: 0, status: "frozen" },
  ],
  orders: [
    { id: "ORD-001", memberId: "M10001", packageName: "Premium Package", amount: 1000, pointsEarned: 1000, createdAt: "2026-07-01", status: "paid" },
    { id: "ORD-002", memberId: "M10002", packageName: "Standard Package", amount: 600, pointsEarned: 600, createdAt: "2026-07-03", status: "paid" },
  ],
  gifts: [
    { id: "G001", name: "Premium Gift Box", cost: 1200, stock: 20 },
    { id: "G002", name: "RM50 Member Voucher", cost: 800, stock: 50 },
    { id: "G003", name: "Priority Service Pass", cost: 500, stock: 100 },
  ],
  redemptions: [],
  pointLogs: [],
};

function cloneSeed(): PersistedDemoData {
  return {
    ...seed,
    members: seed.members.map((item) => ({ ...item })),
    orders: seed.orders.map((item) => ({ ...item })),
    gifts: seed.gifts.map((item) => ({ ...item })),
    redemptions: [],
    pointLogs: [],
  };
}

function loadState(): PersistedDemoData {
  if (typeof window === "undefined") return cloneSeed();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return cloneSeed();
    const parsed = JSON.parse(raw) as Partial<PersistedDemoData>;
    return {
      ...cloneSeed(),
      ...parsed,
      members: parsed.members ?? seed.members,
      orders: parsed.orders ?? seed.orders,
      gifts: parsed.gifts ?? seed.gifts,
      redemptions: parsed.redemptions ?? [],
      pointLogs: parsed.pointLogs ?? [],
    };
  } catch {
    return cloneSeed();
  }
}

const DemoDataContext = createContext<DemoDataState | null>(null);

export function DemoDataProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<PersistedDemoData>(loadState);

  const commit = (next: PersistedDemoData) => {
    setState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {}
  };

  const value = useMemo<DemoDataState>(() => ({
    ...state,
    setRole: (role) => commit({ ...state, role }),
    addMember: (name, phone) => {
      const member: DemoMember = {
        id: `M${Date.now().toString().slice(-5)}`,
        name,
        phone,
        points: 0,
        expiredPoints: 0,
        status: "active",
      };
      commit({ ...state, members: [...state.members, member] });
    },
    toggleMember: (memberId) => commit({
      ...state,
      members: state.members.map((member) =>
        member.id === memberId
          ? { ...member, status: member.status === "active" ? "frozen" : "active" }
          : member,
      ),
    }),
    createOrder: (memberId, packageName, amount) => {
      const order: DemoOrder = {
        id: `ORD-${Date.now()}`,
        memberId,
        packageName,
        amount,
        pointsEarned: amount,
        createdAt: new Date().toISOString(),
        status: "paid",
      };
      const bonus = Math.round(amount * 0.3);
      const buyer = state.members.find((member) => member.id === memberId);
      let members = state.members.map((member) =>
        member.id === memberId ? { ...member, points: member.points + amount } : member,
      );
      const logs: PointLog[] = [
        ...state.pointLogs,
        {
          id: `PT-${Date.now()}`,
          memberId,
          delta: amount,
          reason: `Order ${packageName}`,
          createdAt: new Date().toISOString(),
        },
      ];
      if (buyer?.referrerId) {
        members = members.map((member) =>
          member.id === buyer.referrerId ? { ...member, points: member.points + bonus } : member,
        );
        logs.push({
          id: `PT-${Date.now()}-R`,
          memberId: buyer.referrerId,
          delta: bonus,
          reason: "Referral 30% bonus",
          createdAt: new Date().toISOString(),
        });
      }
      commit({ ...state, members, orders: [...state.orders, order], pointLogs: logs });
    },
    adjustPoints: (memberId, delta, reason) => {
      const member = state.members.find((item) => item.id === memberId);
      if (!member || member.points + delta < 0) throw new Error("Insufficient points");
      commit({
        ...state,
        members: state.members.map((item) =>
          item.id === memberId ? { ...item, points: item.points + delta } : item,
        ),
        pointLogs: [
          ...state.pointLogs,
          { id: `PT-${Date.now()}`, memberId, delta, reason, createdAt: new Date().toISOString() },
        ],
      });
    },
    redeemGift: (memberId, giftId) => {
      const gift = state.gifts.find((item) => item.id === giftId);
      const member = state.members.find((item) => item.id === memberId);
      if (!gift || !member || member.points < gift.cost || gift.stock < 1) {
        throw new Error("Unable to redeem");
      }
      const redemption: DemoRedemption = {
        id: `RED-${Date.now()}`,
        memberId,
        giftId,
        cost: gift.cost,
        status: "pending",
        createdAt: new Date().toISOString(),
      };
      commit({
        ...state,
        members: state.members.map((item) =>
          item.id === memberId ? { ...item, points: item.points - gift.cost } : item,
        ),
        gifts: state.gifts.map((item) =>
          item.id === giftId ? { ...item, stock: item.stock - 1 } : item,
        ),
        redemptions: [...state.redemptions, redemption],
        pointLogs: [
          ...state.pointLogs,
          {
            id: `PT-${Date.now()}`,
            memberId,
            delta: -gift.cost,
            reason: `Redeem ${gift.name}`,
            createdAt: new Date().toISOString(),
          },
        ],
      });
    },
    reviewRedemption: (id, approve) => {
      const record = state.redemptions.find((item) => item.id === id);
      if (!record || record.status !== "pending") return;
      let members = state.members;
      let gifts = state.gifts;
      let pointLogs = state.pointLogs;
      if (!approve) {
        members = members.map((item) =>
          item.id === record.memberId ? { ...item, points: item.points + record.cost } : item,
        );
        gifts = gifts.map((item) =>
          item.id === record.giftId ? { ...item, stock: item.stock + 1 } : item,
        );
        pointLogs = [
          ...pointLogs,
          {
            id: `PT-${Date.now()}`,
            memberId: record.memberId,
            delta: record.cost,
            reason: "Rejected redemption refund",
            createdAt: new Date().toISOString(),
          },
        ];
      }
      commit({
        ...state,
        members,
        gifts,
        pointLogs,
        redemptions: state.redemptions.map((item) =>
          item.id === id ? { ...item, status: approve ? "approved" : "rejected" } : item,
        ),
      });
    },
    resetDemo: () => commit(cloneSeed()),
  }), [state]);

  return <DemoDataContext.Provider value={value}>{children}</DemoDataContext.Provider>;
}

export function useDemoData() {
  const context = useContext(DemoDataContext);
  if (!context) throw new Error("useDemoData must be used within DemoDataProvider");
  return context;
}
