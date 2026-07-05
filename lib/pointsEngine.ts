// ============================================================
// /lib/pointsEngine.ts — 核心积分引擎（纯函数，无 UI 依赖）
// ============================================================

import type {
  Member,
  Product,
  Order,
  PointTransaction,
  RedemptionRecord,
  ReferralLog,
  Gift,
} from './mockData';

let _orderCounter = 100;
let _txCounter = 1000;
let _redemptionCounter = 100;
function nextOrderId(): string { _orderCounter++; return `ORD${_orderCounter}`; }
function nextTxId(): string { _txCounter++; return `PT${_txCounter}`; }
function nextRedemptionId(): string { _redemptionCounter++; return `RED${_redemptionCounter}`; }
function genOrderNo(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  const seq = String(_orderCounter).padStart(3, '0');
  return `ORD-${y}${m}${d}-${seq}`;
}
function genRedemptionNo(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  const seq = String(_redemptionCounter).padStart(3, '0');
  return `RED-${y}${m}${d}-${seq}`;
}
function genTrackingNo(): string {
  return `SF${Date.now().toString(36).toUpperCase()}${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
}

/**
 * 计算到期日 = 获得日 + 12个月
 */
export function calcExpiryDate(gainDateISO: string): string {
  const d = new Date(gainDateISO);
  d.setFullYear(d.getFullYear() + 1);
  return d.toISOString();
}

/**
 * 扫描并"结算"到期：把 expiry_date 已过去且 expiry_status='正常' 的流水标记为'已到期'，
 * 并重新计算受影响会员的 available_points / expired_points。
 */
export function settleExpiredPoints(
  transactions: PointTransaction[],
  members: Member[]
): { transactions: PointTransaction[]; members: Member[] } {
  const now = new Date();
  const newTransactions = transactions.map((tx) => {
    if (
      tx.expiry_date &&
      tx.expiry_status === '正常' &&
      new Date(tx.expiry_date) < now
    ) {
      return { ...tx, expiry_status: '已到期' as const };
    }
    return tx;
  });

  // 重新计算每个会员的 expired_points 和 available_points
  const affectedIds = new Set<string>();
  for (let i = 0; i < transactions.length; i++) {
    if (transactions[i].expiry_status !== newTransactions[i].expiry_status) {
      affectedIds.add(transactions[i].member_id);
    }
  }

  const newMembers = members.map((m) => {
    if (!affectedIds.has(m.id)) return m;
    const memberTxs = newTransactions.filter((tx) => tx.member_id === m.id);
    const expired = memberTxs
      .filter((tx) => tx.amount > 0 && tx.expiry_status === '已到期')
      .reduce((sum, tx) => sum + tx.amount, 0);
    const positiveSum = memberTxs
      .filter((tx) => tx.amount > 0)
      .reduce((sum, tx) => sum + tx.amount, 0);
    const consumed = memberTxs
      .filter((tx) => tx.amount < 0)
      .reduce((sum, tx) => sum + Math.abs(tx.amount), 0);
    return {
      ...m,
      total_points: positiveSum,
      expired_points: expired,
      available_points: positiveSum - expired - consumed,
    };
  });

  return { transactions: newTransactions, members: newMembers };
}

/**
 * 获取会员当前可用积分（现算，不依赖冗余字段）
 */
export function getAvailablePoints(
  memberId: string,
  transactions: PointTransaction[]
): number {
  const memberTxs = transactions.filter((tx) => tx.member_id === memberId);
  const positiveSum = memberTxs
    .filter((tx) => tx.amount > 0 && tx.expiry_status !== '已到期')
    .reduce((sum, tx) => sum + tx.amount, 0);
  const consumed = memberTxs
    .filter((tx) => tx.amount < 0)
    .reduce((sum, tx) => sum + Math.abs(tx.amount), 0);
  return positiveSum - consumed;
}

/**
 * 新增购买订单
 */
export function createOrder(
  memberId: string,
  productId: string,
  members: Member[],
  products: Product[],
  orders: Order[],
  transactions: PointTransaction[],
  referralLogs: ReferralLog[],
  operatorId: string = 'STAFF001'
): {
  order: Order;
  transaction: PointTransaction;
  referralBonus: PointTransaction | null;
  members: Member[];
  orders: Order[];
  transactions: PointTransaction[];
  referralLogs: ReferralLog[];
} {
  const member = members.find((m) => m.id === memberId);
  if (!member) throw new Error(`会员 ${memberId} 不存在`);
  if (member.status === '冻结') throw new Error('会员已被冻结，无法下单');

  const product = products.find((p) => p.id === productId);
  if (!product) throw new Error(`配套 ${productId} 不存在`);
  if (product.status === '下架') throw new Error('该配套已下架');

  const now = new Date().toISOString();

  // balance_before 的计算
  const memberTxs = transactions.filter((tx) => tx.member_id === memberId);
  const allPositive = memberTxs.filter((tx) => tx.amount > 0).reduce((s, tx) => s + tx.amount, 0);
  const allNegative = memberTxs.filter((tx) => tx.amount < 0).reduce((s, tx) => s + Math.abs(tx.amount), 0);
  const balanceBefore = allPositive - allNegative;

  // 创建订单
  const order: Order = {
    id: nextOrderId(),
    order_no: genOrderNo(),
    member_id: memberId,
    product_id: productId,
    amount: product.price,
    point_earned: product.price,
    pay_time: now,
    operator_id: operatorId,
    status: '已支付',
  };

  // 创建积分流水
  const transaction: PointTransaction = {
    id: nextTxId(),
    member_id: memberId,
    trans_type: '购买',
    amount: product.price,
    balance_before: balanceBefore,
    balance_after: balanceBefore + product.price,
    source_id: order.id,
    expiry_date: calcExpiryDate(now),
    expiry_status: '正常',
    operator_id: operatorId,
    create_time: now,
    remark: `购买${product.name}`,
  };

  // 更新会员
  const newMember: Member = {
    ...member,
    total_points: member.total_points + product.price,
    available_points: member.available_points + product.price,
  };

  const newMembers = members.map((m) => (m.id === memberId ? newMember : m));
  const newOrders = [...orders, order];
  const newTransactions = [...transactions, transaction];
  let newReferralLogs = [...referralLogs];

  // 推荐奖励
  let referralBonus: PointTransaction | null = null;
  if (member.referrer_id) {
    const bonusResult = addReferralBonusInternal(
      member.referrer_id,
      memberId,
      product.price,
      newMembers,
      newTransactions,
      newReferralLogs,
      order.id
    );
    if (bonusResult) {
      referralBonus = bonusResult.transaction;
      newMembers.splice(0, newMembers.length, ...bonusResult.members);
      newTransactions.splice(0, newTransactions.length, ...bonusResult.transactions);
      newReferralLogs = bonusResult.referralLogs;
    }
  }

  return {
    order,
    transaction,
    referralBonus,
    members: newMembers,
    orders: newOrders,
    transactions: newTransactions,
    referralLogs: newReferralLogs,
  };
}

function addReferralBonusInternal(
  inviterId: string,
  inviteeId: string,
  orderAmount: number,
  members: Member[],
  transactions: PointTransaction[],
  referralLogs: ReferralLog[],
  sourceOrderId: string
): { transaction: PointTransaction; members: Member[]; transactions: PointTransaction[]; referralLogs: ReferralLog[] } | null {
  const referralLog = referralLogs.find(
    (r) => r.inviter_id === inviterId && r.invitee_id === inviteeId
  );
  if (!referralLog) {
    console.warn(`推荐关系未找到: inviter=${inviterId}, invitee=${inviteeId}`);
    return null;
  }

  const inviter = members.find((m) => m.id === inviterId);
  if (!inviter) {
    console.warn(`推荐人 ${inviterId} 不存在`);
    return null;
  }

  const amount = Math.round(orderAmount * 0.3);
  if (amount <= 0) return null;

  const now = new Date().toISOString();

  const memberTxs = transactions.filter((tx) => tx.member_id === inviterId);
  const allPositive = memberTxs.filter((tx) => tx.amount > 0).reduce((s, tx) => s + tx.amount, 0);
  const allNegative = memberTxs.filter((tx) => tx.amount < 0).reduce((s, tx) => s + Math.abs(tx.amount), 0);
  const balanceBefore = allPositive - allNegative;

  const transaction: PointTransaction = {
    id: nextTxId(),
    member_id: inviterId,
    trans_type: '推荐30%',
    amount,
    balance_before: balanceBefore,
    balance_after: balanceBefore + amount,
    source_id: sourceOrderId,
    expiry_date: calcExpiryDate(now),
    expiry_status: '正常',
    operator_id: 'SYSTEM',
    create_time: now,
    remark: `推荐奖励：下线购买订单`,
  };

  const newMembers = members.map((m) =>
    m.id === inviterId
      ? {
          ...m,
          total_points: m.total_points + amount,
          available_points: m.available_points + amount,
        }
      : m
  );

  const newTransactions = [...transactions, transaction];
  const newReferralLogs = referralLogs.map((r) =>
    r.id === referralLog.id ? { ...r, reward_status: '已发放' as const } : r
  );

  return {
    transaction,
    members: newMembers,
    transactions: newTransactions,
    referralLogs: newReferralLogs,
  };
}

/**
 * 推荐奖励（对外接口）
 */
export function addReferralBonus(
  inviterId: string,
  inviteeId: string,
  orderAmount: number,
  members: Member[],
  transactions: PointTransaction[],
  referralLogs: ReferralLog[],
  sourceOrderId: string = ''
): PointTransaction | null {
  const result = addReferralBonusInternal(
    inviterId, inviteeId, orderAmount,
    members, transactions, referralLogs, sourceOrderId
  );
  return result ? result.transaction : null;
}

/**
 * 兑换礼品
 */
export function redeemGift(
  memberId: string,
  giftId: string,
  members: Member[],
  transactions: PointTransaction[],
  redemptionRecords: RedemptionRecord[],
  gifts: Gift[]
): {
  redemptionRecord: RedemptionRecord;
  transaction: PointTransaction;
  members: Member[];
  transactions: PointTransaction[];
  redemptionRecords: RedemptionRecord[];
} {
  const member = members.find((m) => m.id === memberId);
  if (!member) throw new Error(`会员 ${memberId} 不存在`);
  if (member.status === '冻结') throw new Error('会员已被冻结，无法兑换');

  const gift = gifts.find((g) => g.id === giftId);
  if (!gift) throw new Error(`礼品 ${giftId} 不存在`);
  if (gift.status === '下架') throw new Error('该礼品已下架');
  if (gift.stock <= 0) throw new Error('该礼品库存不足');

  const available = getAvailablePoints(memberId, transactions);
  if (available < gift.point_cost) {
    throw new Error(`积分不足：当前可用 ${available} 分，需要 ${gift.point_cost} 分`);
  }

  const now = new Date().toISOString();

  const memberTxs = transactions.filter((tx) => tx.member_id === memberId);
  const allPositive = memberTxs.filter((tx) => tx.amount > 0).reduce((s, tx) => s + tx.amount, 0);
  const allNegative = memberTxs.filter((tx) => tx.amount < 0).reduce((s, tx) => s + Math.abs(tx.amount), 0);
  const balanceBefore = allPositive - allNegative;

  const transaction: PointTransaction = {
    id: nextTxId(),
    member_id: memberId,
    trans_type: '兑换扣除',
    amount: -gift.point_cost,
    balance_before: balanceBefore,
    balance_after: balanceBefore - gift.point_cost,
    source_id: null,
    expiry_date: null,
    expiry_status: null,
    operator_id: 'STAFF001',
    create_time: now,
    remark: `兑换${gift.name}`,
  };

  const redemptionRecord: RedemptionRecord = {
    id: nextRedemptionId(),
    order_no: genRedemptionNo(),
    member_id: memberId,
    gift_name: gift.name,
    point_cost: gift.point_cost,
    balance_at_apply: available,
    apply_time: now,
    audit_time: null,
    auditor_id: null,
    status: '待审核',
    tracking_no: null,
  };

  const newMembers = members.map((m) =>
    m.id === memberId
      ? { ...m, available_points: m.available_points - gift.point_cost }
      : m
  );

  const newTransactions = [...transactions, transaction];
  const newRedemptionRecords = [...redemptionRecords, redemptionRecord];

  return {
    redemptionRecord,
    transaction,
    members: newMembers,
    transactions: newTransactions,
    redemptionRecords: newRedemptionRecords,
  };
}

/**
 * 审核兑换记录
 */
export function auditRedemption(
  recordId: string,
  approve: boolean,
  auditorId: string,
  members: Member[],
  transactions: PointTransaction[],
  redemptionRecords: RedemptionRecord[]
): {
  redemptionRecord: RedemptionRecord;
  refundTransaction: PointTransaction | null;
  members: Member[];
  transactions: PointTransaction[];
  redemptionRecords: RedemptionRecord[];
} {
  const record = redemptionRecords.find((r) => r.id === recordId);
  if (!record) throw new Error(`兑换记录 ${recordId} 不存在`);
  if (record.status !== '待审核') throw new Error('只能审核"待审核"状态的兑换记录');

  const now = new Date().toISOString();
  let newMembers = [...members];
  let newTransactions = [...transactions];
  let refundTransaction: PointTransaction | null = null;

  const updatedRecord: RedemptionRecord = {
    ...record,
    audit_time: now,
    auditor_id: auditorId,
  };

  if (approve) {
    updatedRecord.status = '已发货';
    updatedRecord.tracking_no = genTrackingNo();
  } else {
    updatedRecord.status = '已取消';
    // 回滚积分
    const member = members.find((m) => m.id === record.member_id);
    if (member) {
      const memberTxs = newTransactions.filter((tx) => tx.member_id === member.id);
      const allPositive = memberTxs.filter((tx) => tx.amount > 0).reduce((s, tx) => s + tx.amount, 0);
      const allNegative = memberTxs.filter((tx) => tx.amount < 0).reduce((s, tx) => s + Math.abs(tx.amount), 0);
      const balanceBefore = allPositive - allNegative;

      refundTransaction = {
        id: nextTxId(),
        member_id: record.member_id,
        trans_type: '后台调整',
        amount: record.point_cost,
        balance_before: balanceBefore,
        balance_after: balanceBefore + record.point_cost,
        source_id: record.id,
        expiry_date: null,
        expiry_status: null,
        operator_id: auditorId,
        create_time: now,
        remark: '兑换驳回退还',
      };

      newTransactions = [...newTransactions, refundTransaction];
      newMembers = newMembers.map((m) =>
        m.id === record.member_id
          ? { ...m, available_points: m.available_points + record.point_cost }
          : m
      );
    }
  }

  const newRedemptionRecords = redemptionRecords.map((r) =>
    r.id === recordId ? updatedRecord : r
  );

  return {
    redemptionRecord: updatedRecord,
    refundTransaction,
    members: newMembers,
    transactions: newTransactions,
    redemptionRecords: newRedemptionRecords,
  };
}

/**
 * 手动调整积分
 */
export function adjustPoints(
  memberId: string,
  delta: number,
  remark: string,
  operatorId: string,
  members: Member[],
  transactions: PointTransaction[]
): {
  transaction: PointTransaction;
  members: Member[];
  transactions: PointTransaction[];
} {
  const member = members.find((m) => m.id === memberId);
  if (!member) throw new Error(`会员 ${memberId} 不存在`);

  if (delta < 0) {
    const available = getAvailablePoints(memberId, transactions);
    if (available + delta < 0) {
      throw new Error('调整后余额不可为负');
    }
  }

  const now = new Date().toISOString();

  const memberTxs = transactions.filter((tx) => tx.member_id === memberId);
  const allPositive = memberTxs.filter((tx) => tx.amount > 0).reduce((s, tx) => s + tx.amount, 0);
  const allNegative = memberTxs.filter((tx) => tx.amount < 0).reduce((s, tx) => s + Math.abs(tx.amount), 0);
  const balanceBefore = allPositive - allNegative;

  const transaction: PointTransaction = {
    id: nextTxId(),
    member_id: memberId,
    trans_type: '后台调整',
    amount: delta,
    balance_before: balanceBefore,
    balance_after: balanceBefore + delta,
    source_id: null,
    expiry_date: null,
    expiry_status: null,
    operator_id: operatorId,
    create_time: now,
    remark,
  };

  const newMembers = members.map((m) => {
    if (m.id !== memberId) return m;
    const newTotal = delta > 0 ? m.total_points + delta : m.total_points;
    const newAvailable = m.available_points + delta;
    return {
      ...m,
      total_points: newTotal,
      available_points: newAvailable,
    };
  });

  const newTransactions = [...transactions, transaction];

  return {
    transaction,
    members: newMembers,
    transactions: newTransactions,
  };
}

/**
 * 到期预警：返回剩余天数 <= days 且 expiry_status='正常' 的所有流水
 */
export function getExpiringTransactions(
  transactions: PointTransaction[],
  members: Member[],
  days: number = 30
): (PointTransaction & { member_name: string; days_left: number })[] {
  const now = new Date();
  const result: (PointTransaction & { member_name: string; days_left: number })[] = [];

  for (const tx of transactions) {
    if (!tx.expiry_date || tx.expiry_status !== '正常') continue;
    if (tx.amount <= 0) continue;

    const expiry = new Date(tx.expiry_date);
    const diffMs = expiry.getTime() - now.getTime();
    const daysLeft = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

    if (daysLeft > days || daysLeft < 0) continue;

    const member = members.find((m) => m.id === tx.member_id);
    result.push({
      ...tx,
      member_name: member ? member.name : '未知',
      days_left: daysLeft,
    });
  }

  result.sort((a, b) => a.days_left - b.days_left);
  return result;
}
