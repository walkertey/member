// ============================================================
// /lib/store.ts — Zustand 全局状态管理
// 包装 pointsEngine 纯函数 + localStorage 持久化
// ============================================================

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  Member,
  Product,
  Order,
  PointTransaction,
  RedemptionRecord,
  ReferralLog,
  Gift,
} from './mockData';
import {
  seedMembers,
  seedProducts,
  seedOrders,
  seedPointTransactions,
  seedRedemptionRecords,
  seedReferralLogs,
  seedGifts,
} from './mockData';
import * as engine from './pointsEngine';
import type { Role } from './permissions';

export interface LogEntry {
  id: string;
  time: string;
  operator_id: string;
  action: string;
  detail: string;
}

interface PointsStoreState {
  // ---- 数据 ----
  members: Member[];
  products: Product[];
  orders: Order[];
  pointTransactions: PointTransaction[];
  redemptionRecords: RedemptionRecord[];
  referralLogs: ReferralLog[];
  gifts: Gift[];
  operationLogs: LogEntry[];

  // ---- 角色 ----
  currentRole: Role;

  // ---- Toast ----
  toasts: { id: string; type: 'success' | 'error' | 'info'; message: string }[];

  // ---- Hydration ----
  _hasHydrated: boolean;

  // ---- Actions ----
  setRole: (role: Role) => void;

  settleExpiredPoints: () => void;
  createOrder: (memberId: string, productId: string) => {
    order: Order;
    transaction: PointTransaction;
    referralBonus: PointTransaction | null;
  };
  redeemGift: (memberId: string, giftId: string) => RedemptionRecord;
  auditRedemption: (recordId: string, approve: boolean, auditorId: string) => RedemptionRecord;
  adjustPoints: (memberId: string, delta: number, remark: string) => PointTransaction;

  resetData: () => void;

  addToast: (type: 'success' | 'error' | 'info', message: string) => void;
  removeToast: (id: string) => void;

  _addLog: (operator_id: string, action: string, detail: string) => void;
}

let _logCounter = 2000;
let _toastCounter = 1;

export const usePointsStore = create<PointsStoreState>()(
  persist(
    (set, get) => ({
      // ---- 初始数据 ----
      members: seedMembers,
      products: seedProducts,
      orders: seedOrders,
      pointTransactions: seedPointTransactions,
      redemptionRecords: seedRedemptionRecords,
      referralLogs: seedReferralLogs,
      gifts: seedGifts,
      operationLogs: [
        { id: 'LOG001', time: '2026-07-01T09:00:00Z', operator_id: 'STAFF001', action: '系统启动', detail: 'Demo 环境初始化' },
        { id: 'LOG002', time: '2026-07-01T09:05:00Z', operator_id: 'STAFF001', action: '数据加载', detail: '加载种子数据完成' },
      ],
      currentRole: '超级管理员',
      toasts: [],
      _hasHydrated: false,

      // ---- 角色 ----
      setRole: (role) => set({ currentRole: role }),

      // ---- 操作日志 ----
      _addLog: (operator_id, action, detail) => {
        const id = `LOG${++_logCounter}`;
        const time = new Date().toISOString();
        set((s) => ({
          operationLogs: [...s.operationLogs, { id, time, operator_id, action, detail }],
        }));
      },

      // ---- Toast ----
      addToast: (type, message) => {
        const id = `toast-${++_toastCounter}`;
        set((s) => ({ toasts: [...s.toasts, { id, type, message }] }));
        setTimeout(() => {
          set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) }));
        }, 4000);
      },
      removeToast: (id) => {
        set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) }));
      },

      // ---- 到期结算 ----
      settleExpiredPoints: () => {
        const state = get();
        const { transactions: newTransactions, members: newMembers } = engine.settleExpiredPoints(
          state.pointTransactions,
          state.members
        );
        set({
          pointTransactions: newTransactions,
          members: newMembers,
        });
      },

      // ---- 创建订单 ----
      createOrder: (memberId, productId) => {
        const state = get();
        const result = engine.createOrder(
          memberId,
          productId,
          state.members,
          state.products,
          state.orders,
          state.pointTransactions,
          state.referralLogs,
          'STAFF001'
        );
        set({
          members: result.members,
          orders: result.orders,
          pointTransactions: result.transactions,
          referralLogs: result.referralLogs,
        });
        const member = state.members.find((m) => m.id === memberId);
        const product = state.products.find((p) => p.id === productId);
        get()._addLog('STAFF001', '创建订单', `订单${result.order.order_no}，会员${member?.name}，${product?.name}`);
        return { order: result.order, transaction: result.transaction, referralBonus: result.referralBonus };
      },

      // ---- 兑换礼品 ----
      redeemGift: (memberId, giftId) => {
        const state = get();
        try {
          const result = engine.redeemGift(
            memberId,
            giftId,
            state.members,
            state.pointTransactions,
            state.redemptionRecords,
            state.gifts
          );
          set({
            members: result.members,
            pointTransactions: result.transactions,
            redemptionRecords: result.redemptionRecords,
          });
          const member = state.members.find((m) => m.id === memberId);
          const gift = state.gifts.find((g) => g.id === giftId);
          get()._addLog('STAFF001', '兑换礼品', `会员${member?.name}兑换${gift?.name}，消耗${gift?.point_cost}分`);
          return result.redemptionRecord;
        } catch (e) {
          throw e;
        }
      },

      // ---- 审核兑换 ----
      auditRedemption: (recordId, approve, auditorId) => {
        const state = get();
        try {
          const result = engine.auditRedemption(
            recordId,
            approve,
            auditorId,
            state.members,
            state.pointTransactions,
            state.redemptionRecords
          );
          set({
            members: result.members,
            pointTransactions: result.transactions,
            redemptionRecords: result.redemptionRecords,
          });
          const record = state.redemptionRecords.find((r) => r.id === recordId);
          const member = state.members.find((m) => m.id === record?.member_id);
          get()._addLog(
            auditorId,
            approve ? '审核通过' : '审核驳回',
            `兑换记录${record?.order_no}（${member?.name}，${record?.gift_name}）${approve ? '已发货' : '已取消并退还积分'}`
          );
          return result.redemptionRecord;
        } catch (e) {
          throw e;
        }
      },

      // ---- 手动调整积分 ----
      adjustPoints: (memberId, delta, remark) => {
        const state = get();
        try {
          const result = engine.adjustPoints(
            memberId,
            delta,
            remark,
            'STAFF001',
            state.members,
            state.pointTransactions
          );
          set({
            members: result.members,
            pointTransactions: result.transactions,
          });
          const member = state.members.find((m) => m.id === memberId);
          get()._addLog('STAFF001', '手动调整积分', `会员${member?.name}，${delta > 0 ? '+' : ''}${delta}分，${remark}`);
          return result.transaction;
        } catch (e) {
          throw e;
        }
      },

      // ---- 重置数据 ----
      resetData: () => {
        _logCounter = 2000;
        _toastCounter = 1;
        set({
          members: seedMembers.map((m) => ({ ...m })),
          products: seedProducts.map((p) => ({ ...p })),
          orders: seedOrders.map((o) => ({ ...o })),
          pointTransactions: seedPointTransactions.map((tx) => ({ ...tx })),
          redemptionRecords: seedRedemptionRecords.map((r) => ({ ...r })),
          referralLogs: seedReferralLogs.map((r) => ({ ...r })),
          gifts: seedGifts.map((g) => ({ ...g })),
          operationLogs: [
            { id: 'LOG001', time: new Date().toISOString(), operator_id: 'STAFF001', action: '系统重置', detail: '数据已恢复至初始状态' },
          ],
        });
      },
    }),
    {
      name: 'cgo-demo-storage',
      onRehydrateStorage: () => (state) => {
        if (state) {
          state._hasHydrated = true;
        }
      },
    }
  )
);
