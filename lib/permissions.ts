// ============================================================
// /lib/permissions.ts — 角色 → 菜单可见性映射
// ============================================================

export type Role = '超级管理员' | '运营主管' | '客服专员' | '实习生';

export const ALL_ROLES: Role[] = ['超级管理员', '运营主管', '客服专员', '实习生'];

export const MENU_VISIBILITY: Record<Role, string[]> = {
  '超级管理员': ['dashboard', 'members', 'orders', 'points', 'redemption', 'reports', 'settings', 'permissions'],
  '运营主管':   ['dashboard', 'members', 'orders', 'points', 'redemption', 'reports', 'settings'],
  '客服专员':   ['dashboard', 'members', 'orders', 'points', 'redemption', 'reports'],
  '实习生':     ['dashboard', 'members', 'points'],
};

export interface MenuItem {
  key: string;
  label: string;
  href: string;
}

export const ALL_MENU_ITEMS: MenuItem[] = [
  { key: 'dashboard',   label: '工作台',   href: '/' },
  { key: 'members',     label: '会员管理', href: '/members' },
  { key: 'orders',      label: '订单管理', href: '/orders' },
  { key: 'points',      label: '积分中心', href: '/points' },
  { key: 'redemption',  label: '兑换商城', href: '/redemption' },
  { key: 'reports',     label: '报表中心', href: '/reports' },
  { key: 'settings',    label: '系统设置', href: '/settings' },
  { key: 'permissions', label: '权限管理', href: '/permissions' },
];

export function getVisibleMenu(role: Role): MenuItem[] {
  const keys = MENU_VISIBILITY[role] ?? [];
  return ALL_MENU_ITEMS.filter((item) => keys.includes(item.key));
}
