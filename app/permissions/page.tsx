'use client';

import { usePointsStore } from '@/lib/store';
import type { Role } from '@/lib/permissions';
import { ALL_ROLES, MENU_VISIBILITY } from '@/lib/permissions';

const FAKE_STAFF = [
  { id: 'STAFF001', name: '管理员', role: '超级管理员' as Role, status: '激活' },
  { id: 'STAFF002', name: '运营经理', role: '运营主管' as Role, status: '激活' },
  { id: 'STAFF003', name: '客服A', role: '客服专员' as Role, status: '激活' },
  { id: 'STAFF004', name: '实习生B', role: '实习生' as Role, status: '激活' },
];

export default function PermissionsPage() {
  const operationLogs = usePointsStore((s) => s.operationLogs);

  return (
    <div className="max-w-6xl mx-auto">
      <h2 className="text-lg md:text-xl font-semibold text-zinc-800 mb-4 md:mb-6">权限管理</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {/* 员工列表 */}
        <div className="bg-white border border-zinc-200 rounded-lg p-4 md:p-5">
          <h3 className="text-md font-semibold text-zinc-700 mb-3 md:mb-4">员工列表</h3>
          <div className="table-responsive">
            <table className="w-full text-sm min-w-[320px]">
              <thead>
                <tr className="bg-zinc-50 border-b border-zinc-200">
                  <th className="text-left px-3 py-2 font-medium text-zinc-600">员工ID</th>
                  <th className="text-left px-3 py-2 font-medium text-zinc-600">姓名</th>
                  <th className="text-left px-3 py-2 font-medium text-zinc-600">角色</th>
                  <th className="text-center px-3 py-2 font-medium text-zinc-600">状态</th>
                </tr>
              </thead>
              <tbody>
                {FAKE_STAFF.map((s) => (
                  <tr key={s.id} className="border-b border-zinc-100">
                    <td className="px-3 py-2 font-mono text-xs">{s.id}</td>
                    <td className="px-3 py-2">{s.name}</td>
                    <td className="px-3 py-2">{s.role}</td>
                    <td className="px-3 py-2 text-center">
                      <span className="px-1.5 py-0.5 text-xs bg-green-50 text-green-700 rounded">
                        {s.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 角色列表 */}
        <div className="bg-white border border-zinc-200 rounded-lg p-4 md:p-5">
          <h3 className="text-md font-semibold text-zinc-700 mb-3 md:mb-4">角色权限一览</h3>
          <div className="space-y-2 md:space-y-3">
            {ALL_ROLES.map((role) => {
              const menus = MENU_VISIBILITY[role];
              return (
                <div key={role} className="p-3 border border-zinc-200 rounded">
                  <div className="font-medium text-sm text-zinc-800 mb-1">{role}</div>
                  <div className="flex flex-wrap gap-1">
                    {menus.map((m) => (
                      <span
                        key={m}
                        className="px-1.5 py-0.5 text-xs bg-blue-50 text-blue-600 rounded"
                      >
                        {m}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 操作日志 */}
      <div className="bg-white border border-zinc-200 rounded-lg p-4 md:p-5 mt-4 md:mt-6">
        <h3 className="text-md font-semibold text-zinc-700 mb-3 md:mb-4">操作日志</h3>
        <div className="table-responsive">
          <table className="w-full text-sm min-w-[450px]">
            <thead>
              <tr className="bg-zinc-50 border-b border-zinc-200">
                <th className="text-left px-3 py-2 font-medium text-zinc-600">时间</th>
                <th className="text-left px-3 py-2 font-medium text-zinc-600">操作人</th>
                <th className="text-left px-3 py-2 font-medium text-zinc-600">操作</th>
                <th className="text-left px-3 py-2 font-medium text-zinc-600">详情</th>
              </tr>
            </thead>
            <tbody>
              {[...operationLogs].reverse().map((log) => (
                <tr key={log.id} className="border-b border-zinc-100 hover:bg-zinc-50">
                  <td className="px-3 py-2 text-xs text-zinc-500">
                    {new Date(log.time).toLocaleString('zh-CN')}
                  </td>
                  <td className="px-3 py-2 text-xs">{log.operator_id}</td>
                  <td className="px-3 py-2">{log.action}</td>
                  <td className="px-3 py-2 text-xs text-zinc-500">{log.detail}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
