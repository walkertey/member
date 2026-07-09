// ============================================================
// /lib/i18n.ts — 多语言字典 & 取词 hook
//
// 设计原则：
// 1. 底层数据（lib/mockData.ts 里的 status/type 中文值）保持不变，
//    不去改动数据结构或业务逻辑，避免牵动 pointsEngine / permissions。
// 2. 这里只提供「显示层」的翻译：UI 文案 key → 三语文本，
//    以及一份「数据值 → 显示文本」的映射表（enumLabel）。
// 3. 默认语言为英文（'en'），可切换 'zh' / 'ms'。
// ============================================================

export type Locale = 'en' | 'zh' | 'ms';

export const ALL_LOCALES: { code: Locale; label: string }[] = [
  { code: 'en', label: 'English' },
  { code: 'zh', label: '中文' },
  { code: 'ms', label: 'Bahasa Melayu' },
];

export const DEFAULT_LOCALE: Locale = 'en';

const dict = {
  'common.confirm': { en: 'Confirm', zh: '确认', ms: 'Sahkan' },
  'common.cancel': { en: 'Cancel', zh: '取消', ms: 'Batal' },
  'common.close': { en: 'Close', zh: '关闭', ms: 'Tutup' },
  'common.back': { en: 'Back', zh: '返回', ms: 'Kembali' },
  'common.all': { en: 'All', zh: '全部', ms: 'Semua' },
  'common.status': { en: 'Status', zh: '状态', ms: 'Status' },
  'common.type': { en: 'Type', zh: '类型', ms: 'Jenis' },
  'common.time': { en: 'Time', zh: '时间', ms: 'Masa' },
  'common.action': { en: 'Action', zh: '操作', ms: 'Tindakan' },
  'common.remark': { en: 'Remark', zh: '备注', ms: 'Catatan' },
  'common.name': { en: 'Name', zh: '姓名', ms: 'Nama' },
  'common.phone': { en: 'Phone', zh: '手机', ms: 'Telefon' },
  'common.loading': { en: 'Loading', zh: '加载中', ms: 'Memuatkan' },
  'common.noData': { en: 'No records', zh: '暂无记录', ms: 'Tiada rekod' },
  'common.readOnly': { en: 'Read-only mode', zh: '只读模式', ms: 'Mod baca sahaja' },
  'common.points': { en: 'pts', zh: '分', ms: 'mata' },

  'nav.dashboard': { en: 'Dashboard', zh: '工作台', ms: 'Papan Pemuka' },
  'nav.members': { en: 'Members', zh: '会员管理', ms: 'Pengurusan Ahli' },
  'nav.orders': { en: 'Orders', zh: '订单管理', ms: 'Pengurusan Pesanan' },
  'nav.points': { en: 'Points Center', zh: '积分中心', ms: 'Pusat Mata' },
  'nav.redemption': { en: 'Redemption Mall', zh: '兑换商城', ms: 'Pasar Tukaran' },
  'nav.reports': { en: 'Reports', zh: '报表中心', ms: 'Pusat Laporan' },
  'nav.settings': { en: 'Settings', zh: '系统设置', ms: 'Tetapan Sistem' },
  'nav.permissions': { en: 'Permissions', zh: '权限管理', ms: 'Pengurusan Kebenaran' },
  'nav.home': { en: 'Home', zh: '首页', ms: 'Laman Utama' },
  'nav.discover': { en: 'Discover', zh: '发现', ms: 'Terokai' },
  'nav.manage': { en: 'Manage', zh: '管理', ms: 'Urus' },
  'nav.me': { en: 'Me', zh: '我的', ms: 'Saya' },
  'nav.notifications': { en: 'Notifications', zh: '通知', ms: 'Pemberitahuan' },
  'nav.currentRole': { en: 'Current role', zh: '当前角色', ms: 'Peranan semasa' },
  'nav.openMenu': { en: 'Open menu', zh: '打开菜单', ms: 'Buka menu' },
  'nav.closeMenu': { en: 'Close menu', zh: '关闭菜单', ms: 'Tutup menu' },

  'home.brandSub': { en: 'Points Management', zh: '积分管理', ms: 'Pengurusan Mata' },
  'home.cardTagline': { en: 'Points Membership', zh: '积 赏 管 理', ms: 'Ganjaran Mata' },
  'home.balanceLabel': { en: 'Available points', zh: '当前可用积分', ms: 'Mata tersedia' },
  'home.resetDemo': { en: 'Reset demo data', zh: '重置 Demo 数据', ms: 'Set semula data demo' },
  'home.resetConfirmTitle': { en: 'Reset all demo data?', zh: '确定要重置所有 Demo 数据吗', ms: 'Set semula semua data demo?' },
  'home.resetConfirmBody': { en: 'This action cannot be undone.', zh: '此操作不可恢复', ms: 'Tindakan ini tidak boleh dibuat asal.' },
  'home.resetDone': { en: 'Data has been reset to initial state', zh: '数据已重置为初始状态', ms: 'Data telah ditetapkan semula' },
  'home.pointsGrant': { en: 'Grant Points', zh: '积分发放', ms: 'Beri Mata' },
  'home.pointsRedeem': { en: 'Redeem Points', zh: '积分兑换', ms: 'Tukar Mata' },
  'home.redemptionRecords': { en: 'Redemption Records', zh: '兑换记录', ms: 'Rekod Tukaran' },
  'home.permissionMgmt': { en: 'Access Control', zh: '权限管理', ms: 'Kawalan Akses' },
  'home.coreFeatures': { en: 'Core Features', zh: '核心功能', ms: 'Fungsi Teras' },
  'home.viewAll': { en: 'View all', zh: '全部', ms: 'Lihat semua' },
  'home.memberMgmt': { en: 'Member Management', zh: '会员管理', ms: 'Pengurusan Ahli' },
  'home.pointsMall': { en: 'Points Mall', zh: '积分商城', ms: 'Pasar Mata' },
  'home.financeReports': { en: 'Finance Reports', zh: '财务报表', ms: 'Laporan Kewangan' },
  'home.marketingTools': { en: 'Marketing Tools', zh: '营销工具', ms: 'Alat Pemasaran' },
  'home.ruleSettings': { en: 'Rule Settings', zh: '规则设置', ms: 'Tetapan Peraturan' },
  'home.staffMgmt': { en: 'Staff Management', zh: '员工管理', ms: 'Pengurusan Kakitangan' },
  'home.auditLog': { en: 'Audit Log', zh: '审计日志', ms: 'Log Audit' },
  'home.more': { en: 'More', zh: '更多', ms: 'Lagi' },
  'home.bannerSub': { en: 'Intelligent Points Operations Expert', zh: '智能积分运营专家', ms: 'Pakar Operasi Mata Pintar' },
  'home.learnMore': { en: 'Learn more', zh: '了解更多', ms: 'Ketahui lebih lanjut' },
  'home.systemOverview': { en: 'System Overview', zh: '系统概览', ms: 'Gambaran Sistem' },
  'home.newMembersToday': { en: 'New members', zh: '新增会员', ms: 'Ahli baharu' },
  'home.ordersToday': { en: "Today's orders", zh: '今日订单', ms: 'Pesanan hari ini' },
  'home.expiringWarning': { en: 'Expiring soon', zh: '临期预警', ms: 'Akan tamat tempoh' },
  'home.pendingAudit': { en: 'Pending audit', zh: '待审核', ms: 'Menunggu semakan' },
  'home.goManage': { en: 'Manage', zh: '前往管理', ms: 'Urus' },

  'members.title': { en: 'Member Management', zh: '会员管理', ms: 'Pengurusan Ahli' },
  'members.memberNo': { en: 'Member No.', zh: '会员编号', ms: 'No. Ahli' },
  'members.totalMembers': { en: 'Total Members', zh: '总会员', ms: 'Jumlah Ahli' },
  'members.newToday': { en: 'New Today', zh: '今日新增', ms: 'Baharu Hari Ini' },
  'members.activeMembers': { en: 'Active Members', zh: '活跃会员', ms: 'Ahli Aktif' },
  'members.totalPoints': { en: 'Total Points', zh: '积分总额', ms: 'Jumlah Mata' },
  'members.availablePoints': { en: 'Available Points', zh: '可用积分', ms: 'Mata Tersedia' },
  'members.detail': { en: 'Details', zh: '详情', ms: 'Butiran' },
  'members.count': { en: 'members', zh: '名会员', ms: 'ahli' },
  'members.total': { en: 'Total', zh: '共', ms: 'Jumlah' },
  'members.notFound': { en: 'Member not found', zh: '会员不存在', ms: 'Ahli tidak dijumpai' },
  'members.backToList': { en: 'Back to member list', zh: '返回会员列表', ms: 'Kembali ke senarai ahli' },
  'members.referrer': { en: 'Referrer', zh: '推荐人', ms: 'Perujuk' },
  'members.noReferrer': { en: 'No referrer', zh: '无推荐人', ms: 'Tiada perujuk' },
  'members.referralTree': { en: 'Referral tree', zh: '推荐关系树', ms: 'Pokok Rujukan' },
  'members.downline': { en: 'Downline', zh: '下线列表', ms: 'Senarai Bawahan' },
  'members.noDownline': { en: 'No downline yet', zh: '暂无下线', ms: 'Tiada bawahan lagi' },
  'members.pointFlow': { en: 'Point transaction history', zh: '积分流水记录', ms: 'Sejarah Transaksi Mata' },
  'members.noFlow': { en: 'No transaction records', zh: '暂无流水记录', ms: 'Tiada rekod transaksi' },
  'members.manualAdjust': { en: 'Manual Adjustment', zh: '手动调整', ms: 'Pelarasan Manual' },
  'members.redeemGift': { en: 'Redeem Gift', zh: '兑换礼品', ms: 'Tukar Hadiah' },

  'orders.title': { en: 'Order Management', zh: '订单管理', ms: 'Pengurusan Pesanan' },
  'orders.list': { en: 'Order List', zh: '订单列表', ms: 'Senarai Pesanan' },
  'orders.newOrder': { en: 'New Order', zh: '订单录入', ms: 'Pesanan Baharu' },
  'orders.orderNo': { en: 'Order No.', zh: '订单号', ms: 'No. Pesanan' },
  'orders.selectMember': { en: 'Select member', zh: '选择会员', ms: 'Pilih ahli' },
  'orders.selectPackage': { en: 'Select package', zh: '选择配套', ms: 'Pilih pakej' },
  'orders.amount': { en: 'Amount', zh: '金额', ms: 'Jumlah' },
  'orders.payTime': { en: 'Payment time', zh: '支付时间', ms: 'Masa bayaran' },
  'orders.operator': { en: 'Operator', zh: '操作人', ms: 'Operator' },
  'orders.confirmPay': { en: 'Confirm payment', zh: '确认支付', ms: 'Sahkan bayaran' },
  'orders.noOrders': { en: 'No order records', zh: '暂无订单记录', ms: 'Tiada rekod pesanan' },
  'orders.allOperators': { en: 'All operators', zh: '全部操作人', ms: 'Semua operator' },
  'orders.allPackages': { en: 'All packages', zh: '全部配套', ms: 'Semua pakej' },

  'points.title': { en: 'Points Center', zh: '积分中心', ms: 'Pusat Mata' },
  'points.flowOverview': { en: 'Point Ledger Overview', zh: '积分流水总览', ms: 'Gambaran Ledger Mata' },
  'points.expiringWarning': { en: 'Expiry Warning', zh: '到期预警', ms: 'Amaran Tamat Tempoh' },
  'points.expiringDesc': { en: 'Points expiring within the next 30 days', zh: '以下为未来 30 天内即将到期的积分流水', ms: 'Mata yang akan tamat tempoh dalam 30 hari akan datang' },
  'points.noExpiring': { en: 'No points expiring soon', zh: '暂无即将到期的积分', ms: 'Tiada mata akan tamat tempoh' },
  'points.remainingDays': { en: 'Days left', zh: '剩余天数', ms: 'Hari berbaki' },
  'points.expiryDate': { en: 'Expiry date', zh: '到期日', ms: 'Tarikh tamat' },
  'points.clearFilter': { en: 'Clear filters', zh: '清除筛选', ms: 'Kosongkan penapis' },

  'redemption.title': { en: 'Redemption Mall', zh: '兑换商城', ms: 'Pasar Tukaran' },
  'redemption.availableGifts': { en: 'Available Gifts', zh: '可兑换礼品', ms: 'Hadiah Tersedia' },
  'redemption.giftExchange': { en: 'Gift Redemption', zh: '礼品兑换', ms: 'Tukaran Hadiah' },
  'redemption.selectGift': { en: 'Select a gift', zh: '请选择礼品', ms: 'Sila pilih hadiah' },
  'redemption.confirmRedeem': { en: 'Confirm Redemption', zh: '确认兑换', ms: 'Sahkan Tukaran' },
  'redemption.stock': { en: 'Stock', zh: '库存', ms: 'Stok' },
  'redemption.pointCost': { en: 'Points required', zh: '消耗积分', ms: 'Mata diperlukan' },
  'redemption.applyTime': { en: 'Applied at', zh: '申请时间', ms: 'Masa mohon' },
  'redemption.balanceAtApply': { en: 'Balance at application', zh: '申请时余额', ms: 'Baki semasa mohon' },
  'redemption.pendingAudit': { en: 'Pending Audit', zh: '待审核兑换', ms: 'Menunggu Semakan' },
  'redemption.auditMgmt': { en: 'Audit Management', zh: '审核管理', ms: 'Pengurusan Semakan' },
  'redemption.approve': { en: 'Approve', zh: '通过', ms: 'Lulus' },
  'redemption.reject': { en: 'Reject', zh: '驳回', ms: 'Tolak' },
  'redemption.trackingNo': { en: 'Tracking No.', zh: '快递单号', ms: 'No. Penjejakan' },
  'redemption.orderNo': { en: 'Redemption No.', zh: '兑换单号', ms: 'No. Tukaran' },
  'redemption.noRecords': { en: 'No redemption records', zh: '暂无兑换记录', ms: 'Tiada rekod tukaran' },
  'redemption.noPending': { en: 'No pending records', zh: '暂无待审核记录', ms: 'Tiada rekod menunggu' },

  'reports.title': { en: 'Reports Center', zh: '报表中心', ms: 'Pusat Laporan' },
  'reports.keyMetrics': { en: 'Key Metrics', zh: '关键指标一览', ms: 'Metrik Utama' },
  'reports.totalMembers': { en: 'Total members', zh: '总会员数', ms: 'Jumlah ahli' },
  'reports.totalOrders': { en: 'Total orders', zh: '总订单', ms: 'Jumlah pesanan' },
  'reports.pointsIssued': { en: 'Points issued', zh: '积分发行', ms: 'Mata dikeluarkan' },
  'reports.pointsConsumed': { en: 'Points consumed', zh: '积分消耗', ms: 'Mata digunakan' },
  'reports.salesTotal': { en: 'Total sales', zh: '销售总额', ms: 'Jumlah jualan' },
  'reports.byOperator': { en: 'By operator', zh: '按操作员分组', ms: 'Mengikut operator' },
  'reports.byMonth': { en: 'By month', zh: '按月', ms: 'Mengikut bulan' },
  'reports.staffPerformance': { en: 'Staff Performance', zh: '员工业绩', ms: 'Prestasi Kakitangan' },
  'reports.memberRegistration': { en: 'Member Registrations', zh: '会员注册统计', ms: 'Statistik Pendaftaran Ahli' },
  'reports.packageSales': { en: 'Package Sales', zh: '配套销售统计', ms: 'Statistik Jualan Pakej' },

  'settings.title': { en: 'System Settings', zh: '系统设置', ms: 'Tetapan Sistem' },
  'settings.readOnlyNotice': { en: 'Only super admins can modify system settings', zh: '仅超级管理员可修改系统设置', ms: 'Hanya pentadbir super boleh ubah tetapan' },
  'settings.pointRules': { en: 'Points Rules', zh: '积分规则配置', ms: 'Konfigurasi Peraturan Mata' },
  'settings.packageConfig': { en: 'Package Configuration', zh: '配套配置', ms: 'Konfigurasi Pakej' },
  'settings.settlementRules': { en: 'Settlement Rules', zh: '积分清算规则', ms: 'Peraturan Penyelesaian Mata' },

  'permissions.title': { en: 'Access Control', zh: '权限管理', ms: 'Kawalan Akses' },
  'permissions.roleOverview': { en: 'Role & Permission Overview', zh: '角色权限一览', ms: 'Gambaran Peranan & Kebenaran' },
  'permissions.staffList': { en: 'Staff List', zh: '员工列表', ms: 'Senarai Kakitangan' },
  'permissions.staffId': { en: 'Staff ID', zh: '员工ID', ms: 'ID Kakitangan' },
  'permissions.staffRole': { en: 'Staff role', zh: '员工角色', ms: 'Peranan kakitangan' },
  'permissions.opLog': { en: 'Operation Log', zh: '操作日志', ms: 'Log Operasi' },
  'permissions.role': { en: 'Role', zh: '角色', ms: 'Peranan' },

  'panel.frozen': { en: 'Frozen', zh: '冻结', ms: 'Beku' },
  'panel.wechat': { en: 'WeChat', zh: '微信', ms: 'WeChat' },
  'panel.viewDetail': { en: 'View transaction history', zh: '查看明细流水', ms: 'Lihat sejarah transaksi' },
  'panel.adjustAmount': { en: 'Adjustment amount', zh: '调整数额', ms: 'Jumlah pelarasan' },
  'panel.adjustReason': { en: 'Adjustment reason', zh: '调整原因', ms: 'Sebab pelarasan' },
  'panel.required': { en: 'required', zh: '必填', ms: 'wajib' },
  'panel.hintSign': { en: 'Positive to add, negative to deduct', zh: '正数为加，负数为扣', ms: 'Positif untuk tambah, negatif untuk tolak' },

  'role.超级管理员': { en: 'Super Admin', zh: '超级管理员', ms: 'Pentadbir Super' },
  'role.运营主管': { en: 'Ops Manager', zh: '运营主管', ms: 'Pengurus Operasi' },
  'role.客服专员': { en: 'Support Staff', zh: '客服专员', ms: 'Kakitangan Sokongan' },
  'role.实习生': { en: 'Intern', zh: '实习生', ms: 'Pelatih' },

  'status.正常': { en: 'Active', zh: '正常', ms: 'Aktif' },
  'status.冻结': { en: 'Frozen', zh: '冻结', ms: 'Beku' },
  'status.已支付': { en: 'Paid', zh: '已支付', ms: 'Dibayar' },
  'status.已退款': { en: 'Refunded', zh: '已退款', ms: 'Dikembalikan' },
  'status.上架': { en: 'Listed', zh: '上架', ms: 'Disenaraikan' },
  'status.下架': { en: 'Unlisted', zh: '下架', ms: 'Dinyahsenarai' },
  'status.待审核': { en: 'Pending Audit', zh: '待审核', ms: 'Menunggu Semakan' },
  'status.已发货': { en: 'Shipped', zh: '已发货', ms: 'Dihantar' },
  'status.已完成': { en: 'Completed', zh: '已完成', ms: 'Selesai' },
  'status.已取消': { en: 'Cancelled', zh: '已取消', ms: 'Dibatalkan' },
  'status.已到期': { en: 'Expired', zh: '已到期', ms: 'Tamat Tempoh' },

  'transType.购买': { en: 'Purchase', zh: '购买', ms: 'Pembelian' },
  'transType.推荐30%': { en: 'Referral 30%', zh: '推荐30%', ms: 'Rujukan 30%' },
  'transType.批量奖励': { en: 'Bulk Reward', zh: '批量奖励', ms: 'Ganjaran Pukal' },
  'transType.兑换扣除': { en: 'Redemption Deduction', zh: '兑换扣除', ms: 'Potongan Tukaran' },
  'transType.后台调整': { en: 'Manual Adjustment', zh: '后台调整', ms: 'Pelarasan Manual' },
} as const;

export type DictKey = keyof typeof dict;

export function translate(locale: Locale, key: DictKey): string {
  const entry = dict[key];
  if (!entry) return key;
  return entry[locale] ?? entry[DEFAULT_LOCALE];
}

export function statusLabel(locale: Locale, raw: string): string {
  const key = `status.${raw}` as DictKey;
  return dict[key] ? translate(locale, key) : raw;
}

export function roleLabel(locale: Locale, raw: string): string {
  const key = `role.${raw}` as DictKey;
  return dict[key] ? translate(locale, key) : raw;
}

export function transTypeLabel(locale: Locale, raw: string): string {
  const key = `transType.${raw}` as DictKey;
  return dict[key] ? translate(locale, key) : raw;
}
