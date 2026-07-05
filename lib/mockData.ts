// ============================================================
// 会员积分系统 Demo — 种子数据 & 类型定义
// 所有数据均为假数据，仅供演示用途
// ============================================================

// ---- 类型定义 ----

export interface Member {
  id: string;
  member_no: string;
  name: string;
  phone: string;
  wechat?: string;
  register_time: string;
  referrer_id: string | null;
  total_points: number;
  available_points: number;
  expired_points: number;
  status: '正常' | '冻结';
}

export interface Product {
  id: string;
  code: 'A' | 'B' | 'C' | 'D';
  name: string;
  price: number;
  point_value: number;
  status: '上架' | '下架';
}

export interface Order {
  id: string;
  order_no: string;
  member_id: string;
  product_id: string;
  amount: number;
  point_earned: number;
  pay_time: string;
  operator_id: string;
  status: '已支付' | '已退款';
}

export type TransType = '购买' | '推荐30%' | '批量奖励' | '兑换扣除' | '后台调整';

export interface PointTransaction {
  id: string;
  member_id: string;
  trans_type: TransType;
  amount: number;
  balance_before: number;
  balance_after: number;
  source_id: string | null;
  expiry_date: string | null;
  expiry_status: '正常' | '已到期' | null;
  operator_id: string;
  create_time: string;
  remark: string;
}

export interface RedemptionRecord {
  id: string;
  order_no: string;
  member_id: string;
  gift_name: string;
  point_cost: number;
  balance_at_apply: number;
  apply_time: string;
  audit_time: string | null;
  auditor_id: string | null;
  status: '待审核' | '已发货' | '已完成' | '已取消';
  tracking_no: string | null;
}

export interface ReferralLog {
  id: string;
  inviter_id: string;
  invitee_id: string;
  register_time: string;
  first_order_time: string | null;
  reward_point: number;
  reward_status: '待发放' | '已发放';
  batch_reward_point: number | null;
  batch_status: '待发放' | '已发放' | null;
}

export interface Gift {
  id: string;
  name: string;
  point_cost: number;
  stock: number;
  status: '上架' | '下架';
}

// ---- 种子数据 ----

export const seedMembers: Member[] = [
  {
    id: 'M10001',
    member_no: 'M10001',
    name: '张伟',
    phone: '012-3456789',
    wechat: 'zhangwei_wx',
    register_time: '2025-01-15T10:30:00.000Z',
    referrer_id: null,
    total_points: 5800,
    available_points: 4200,
    expired_points: 1600,
    status: '正常',
  },
  {
    id: 'M10002',
    member_no: 'M10002',
    name: '李娜',
    phone: '012-3456790',
    wechat: 'lina_wx',
    register_time: '2025-03-20T14:00:00.000Z',
    referrer_id: 'M10001',
    total_points: 3200,
    available_points: 3200,
    expired_points: 0,
    status: '正常',
  },
  {
    id: 'M10003',
    member_no: 'M10003',
    name: '王强',
    phone: '012-3456791',
    register_time: '2025-02-10T09:15:00.000Z',
    referrer_id: null,
    total_points: 8500,
    available_points: 7000,
    expired_points: 1500,
    status: '正常',
  },
  {
    id: 'M10004',
    member_no: 'M10004',
    name: '赵敏',
    phone: '012-3456792',
    wechat: 'zhaomin_wx',
    register_time: '2025-06-05T11:00:00.000Z',
    referrer_id: 'M10001',
    total_points: 1500,
    available_points: 1500,
    expired_points: 0,
    status: '正常',
  },
  {
    id: 'M10005',
    member_no: 'M10005',
    name: '陈静',
    phone: '012-3456793',
    register_time: '2025-04-18T16:30:00.000Z',
    referrer_id: 'M10003',
    total_points: 4500,
    available_points: 3800,
    expired_points: 700,
    status: '正常',
  },
];

export const seedProducts: Product[] = [
  { id: 'P001', code: 'A', name: '基础配套', price: 300, point_value: 300, status: '上架' },
  { id: 'P002', code: 'B', name: '标准配套', price: 600, point_value: 600, status: '上架' },
  { id: 'P003', code: 'C', name: '高级配套', price: 1000, point_value: 1000, status: '上架' },
  { id: 'P004', code: 'D', name: '旗舰配套', price: 2000, point_value: 2000, status: '上架' },
];

export const seedGifts: Gift[] = [
  { id: 'G001', name: '保温杯', point_cost: 300, stock: 200, status: '上架' },
  { id: 'G002', name: '蓝牙耳机', point_cost: 500, stock: 100, status: '上架' },
  { id: 'G003', name: '行李箱', point_cost: 1000, stock: 50, status: '上架' },
  { id: 'G004', name: '智能手表', point_cost: 2000, stock: 30, status: '上架' },
];

// 订单种子（6 笔历史订单）
export const seedOrders: Order[] = [
  {
    id: 'ORD001',
    order_no: 'ORD-20260601-001',
    member_id: 'M10001',
    product_id: 'P002',
    amount: 600,
    point_earned: 600,
    pay_time: '2026-06-01T10:00:00.000Z',
    operator_id: 'STAFF001',
    status: '已支付',
  },
  {
    id: 'ORD002',
    order_no: 'ORD-20260515-001',
    member_id: 'M10001',
    product_id: 'P003',
    amount: 1000,
    point_earned: 1000,
    pay_time: '2026-05-15T14:30:00.000Z',
    operator_id: 'STAFF001',
    status: '已支付',
  },
  {
    id: 'ORD003',
    order_no: 'ORD-20260610-001',
    member_id: 'M10002',
    product_id: 'P001',
    amount: 300,
    point_earned: 300,
    pay_time: '2026-06-10T09:00:00.000Z',
    operator_id: 'STAFF001',
    status: '已支付',
  },
  {
    id: 'ORD004',
    order_no: 'ORD-20260420-001',
    member_id: 'M10003',
    product_id: 'P004',
    amount: 2000,
    point_earned: 2000,
    pay_time: '2026-04-20T11:00:00.000Z',
    operator_id: 'STAFF001',
    status: '已支付',
  },
  {
    id: 'ORD005',
    order_no: 'ORD-20260615-001',
    member_id: 'M10005',
    product_id: 'P002',
    amount: 600,
    point_earned: 600,
    pay_time: '2026-06-15T13:00:00.000Z',
    operator_id: 'STAFF001',
    status: '已支付',
  },
  {
    id: 'ORD006',
    order_no: 'ORD-20260701-001',
    member_id: 'M10004',
    product_id: 'P003',
    amount: 1000,
    point_earned: 1000,
    pay_time: '2026-07-01T15:00:00.000Z',
    operator_id: 'STAFF001',
    status: '已支付',
  },
];

// 积分流水种子（与订单 / 推荐 / 兑换 记录保持字段自洽）
// balance_before / balance_after 按时间线对每个会员分别递增
export const seedPointTransactions: PointTransaction[] = [
  // --- M10001 (张伟) ---
  // 已到期的老购买记录
  {
    id: 'PT001',
    member_id: 'M10001',
    trans_type: '购买',
    amount: 1600,
    balance_before: 0,
    balance_after: 1600,
    source_id: 'ORD-OLD-001',
    expiry_date: '2025-06-01T00:00:00.000Z',
    expiry_status: '已到期',
    operator_id: 'STAFF001',
    create_time: '2024-06-01T10:00:00.000Z',
    remark: '历史订单（已到期）',
  },
  // ORD001: B配套 600
  {
    id: 'PT002',
    member_id: 'M10001',
    trans_type: '购买',
    amount: 600,
    balance_before: 1600,
    balance_after: 2200,
    source_id: 'ORD001',
    expiry_date: '2027-06-01T10:00:00.000Z',
    expiry_status: '正常',
    operator_id: 'STAFF001',
    create_time: '2026-06-01T10:00:00.000Z',
    remark: '购买标准配套',
  },
  // ORD002: C配套 1000
  {
    id: 'PT003',
    member_id: 'M10001',
    trans_type: '购买',
    amount: 1000,
    balance_before: 2200,
    balance_after: 3200,
    source_id: 'ORD002',
    expiry_date: '2027-05-15T14:30:00.000Z',
    expiry_status: '正常',
    operator_id: 'STAFF001',
    create_time: '2026-05-15T14:30:00.000Z',
    remark: '购买高级配套',
  },
  // 推荐奖励：M10002 的 ORD003 (300) → 30% = 90
  {
    id: 'PT004',
    member_id: 'M10001',
    trans_type: '推荐30%',
    amount: 90,
    balance_before: 3200,
    balance_after: 3290,
    source_id: 'ORD003',
    expiry_date: '2027-06-10T09:00:00.000Z',
    expiry_status: '正常',
    operator_id: 'SYSTEM',
    create_time: '2026-06-10T09:00:00.000Z',
    remark: '推荐奖励：李娜购买基础配套',
  },
  // 推荐奖励：M10004 的 ORD006 (1000) → 30% = 300
  {
    id: 'PT005',
    member_id: 'M10001',
    trans_type: '推荐30%',
    amount: 300,
    balance_before: 3290,
    balance_after: 3590,
    source_id: 'ORD006',
    expiry_date: '2027-07-01T15:00:00.000Z',
    expiry_status: '正常',
    operator_id: 'SYSTEM',
    create_time: '2026-07-01T15:00:00.000Z',
    remark: '推荐奖励：赵敏购买高级配套',
  },
  // 后台调整：领取过期退还
  {
    id: 'PT006',
    member_id: 'M10001',
    trans_type: '后台调整',
    amount: 2210,
    balance_before: 3590,
    balance_after: 5800,
    source_id: null,
    expiry_date: null,
    expiry_status: null,
    operator_id: 'STAFF001',
    create_time: '2025-08-15T10:00:00.000Z',
    remark: '历史积分补录调整',
  },

  // --- M10002 (李娜) ---
  // ORD003: A配套 300
  {
    id: 'PT007',
    member_id: 'M10002',
    trans_type: '购买',
    amount: 300,
    balance_before: 0,
    balance_after: 300,
    source_id: 'ORD003',
    expiry_date: '2027-06-10T09:00:00.000Z',
    expiry_status: '正常',
    operator_id: 'STAFF001',
    create_time: '2026-06-10T09:00:00.000Z',
    remark: '购买基础配套',
  },
  // 即将到期（14天内）：模拟一笔即将到期的积分
  {
    id: 'PT008',
    member_id: 'M10002',
    trans_type: '购买',
    amount: 2900,
    balance_before: 300,
    balance_after: 3200,
    source_id: 'ORD-OLD-002',
    expiry_date: '2026-07-20T00:00:00.000Z',
    expiry_status: '正常',
    operator_id: 'STAFF001',
    create_time: '2025-07-20T09:00:00.000Z',
    remark: '历史订单（即将到期）',
  },

  // --- M10003 (王强) ---
  // 已到期的老购买记录
  {
    id: 'PT009',
    member_id: 'M10003',
    trans_type: '购买',
    amount: 1500,
    balance_before: 0,
    balance_after: 1500,
    source_id: 'ORD-OLD-003',
    expiry_date: '2025-07-01T00:00:00.000Z',
    expiry_status: '已到期',
    operator_id: 'STAFF001',
    create_time: '2024-07-01T10:00:00.000Z',
    remark: '历史订单（已到期）',
  },
  // ORD004: D配套 2000
  {
    id: 'PT010',
    member_id: 'M10003',
    trans_type: '购买',
    amount: 2000,
    balance_before: 1500,
    balance_after: 3500,
    source_id: 'ORD004',
    expiry_date: '2027-04-20T11:00:00.000Z',
    expiry_status: '正常',
    operator_id: 'STAFF001',
    create_time: '2026-04-20T11:00:00.000Z',
    remark: '购买旗舰配套',
  },
  // 后台调整
  {
    id: 'PT011',
    member_id: 'M10003',
    trans_type: '后台调整',
    amount: 5000,
    balance_before: 3500,
    balance_after: 8500,
    source_id: null,
    expiry_date: null,
    expiry_status: null,
    operator_id: 'STAFF001',
    create_time: '2025-10-01T10:00:00.000Z',
    remark: '大客户积分赠送',
  },

  // --- M10004 (赵敏) ---
  // ORD006: C配套 1000
  {
    id: 'PT012',
    member_id: 'M10004',
    trans_type: '购买',
    amount: 1000,
    balance_before: 0,
    balance_after: 1000,
    source_id: 'ORD006',
    expiry_date: '2027-07-01T15:00:00.000Z',
    expiry_status: '正常',
    operator_id: 'STAFF001',
    create_time: '2026-07-01T15:00:00.000Z',
    remark: '购买高级配套',
  },
  // 推荐奖励：来自某推荐人（仅为保持数据完整性）
  {
    id: 'PT013',
    member_id: 'M10004',
    trans_type: '推荐30%',
    amount: 500,
    balance_before: 1000,
    balance_after: 1500,
    source_id: 'ORD-OLD-004',
    expiry_date: '2027-01-15T10:00:00.000Z',
    expiry_status: '正常',
    operator_id: 'SYSTEM',
    create_time: '2026-01-15T10:00:00.000Z',
    remark: '推荐奖励',
  },

  // --- M10005 (陈静) ---
  // 已到期的推荐奖励
  {
    id: 'PT014',
    member_id: 'M10005',
    trans_type: '推荐30%',
    amount: 700,
    balance_before: 0,
    balance_after: 700,
    source_id: 'ORD-OLD-005',
    expiry_date: '2025-08-01T00:00:00.000Z',
    expiry_status: '已到期',
    operator_id: 'SYSTEM',
    create_time: '2024-08-01T10:00:00.000Z',
    remark: '历史推荐奖励（已到期）',
  },
  // ORD005: B配套 600
  {
    id: 'PT015',
    member_id: 'M10005',
    trans_type: '购买',
    amount: 600,
    balance_before: 700,
    balance_after: 1300,
    source_id: 'ORD005',
    expiry_date: '2027-06-15T13:00:00.000Z',
    expiry_status: '正常',
    operator_id: 'STAFF001',
    create_time: '2026-06-15T13:00:00.000Z',
    remark: '购买标准配套',
  },
  // 后台调整
  {
    id: 'PT016',
    member_id: 'M10005',
    trans_type: '后台调整',
    amount: 3200,
    balance_before: 1300,
    balance_after: 4500,
    source_id: null,
    expiry_date: null,
    expiry_status: null,
    operator_id: 'STAFF001',
    create_time: '2026-01-10T10:00:00.000Z',
    remark: '年度积分奖励',
  },
];

// 推荐关系种子
export const seedReferralLogs: ReferralLog[] = [
  {
    id: 'REF001',
    inviter_id: 'M10001',
    invitee_id: 'M10002',
    register_time: '2025-03-20T14:00:00.000Z',
    first_order_time: '2026-06-10T09:00:00.000Z',
    reward_point: 90,
    reward_status: '已发放',
    batch_reward_point: 3000,
    batch_status: '已发放',
  },
  {
    id: 'REF002',
    inviter_id: 'M10001',
    invitee_id: 'M10004',
    register_time: '2025-06-05T11:00:00.000Z',
    first_order_time: '2026-07-01T15:00:00.000Z',
    reward_point: 300,
    reward_status: '已发放',
    batch_reward_point: null,
    batch_status: null,
  },
  {
    id: 'REF003',
    inviter_id: 'M10003',
    invitee_id: 'M10005',
    register_time: '2025-04-18T16:30:00.000Z',
    first_order_time: '2026-06-15T13:00:00.000Z',
    reward_point: 180,
    reward_status: '待发放',
    batch_reward_point: 1500,
    batch_status: '待发放',
  },
];

// 兑换记录种子（覆盖 待审核/已发货/已完成 三种状态）
export const seedRedemptionRecords: RedemptionRecord[] = [
  {
    id: 'RED001',
    order_no: 'RED-20260705-001',
    member_id: 'M10002',
    gift_name: '蓝牙耳机',
    point_cost: 500,
    balance_at_apply: 3200,
    apply_time: '2026-07-05T10:00:00.000Z',
    audit_time: null,
    auditor_id: null,
    status: '待审核',
    tracking_no: null,
  },
  {
    id: 'RED002',
    order_no: 'RED-20260703-001',
    member_id: 'M10001',
    gift_name: '保温杯',
    point_cost: 300,
    balance_at_apply: 4500,
    apply_time: '2026-07-03T14:00:00.000Z',
    audit_time: '2026-07-03T16:00:00.000Z',
    auditor_id: 'STAFF001',
    status: '已发货',
    tracking_no: 'SF1234567890',
  },
  {
    id: 'RED003',
    order_no: 'RED-20260701-001',
    member_id: 'M10005',
    gift_name: '行李箱',
    point_cost: 1000,
    balance_at_apply: 4500,
    apply_time: '2026-07-01T09:00:00.000Z',
    audit_time: '2026-07-02T10:00:00.000Z',
    auditor_id: 'STAFF001',
    status: '已完成',
    tracking_no: 'SF0987654321',
  },
];
