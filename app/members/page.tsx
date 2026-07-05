'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { usePointsStore } from '@/lib/store';

export default function MembersPage() {
  const members = usePointsStore((s) => s.members);
  const settleExpiredPoints = usePointsStore((s) => s.settleExpiredPoints);
  const currentRole = usePointsStore((s) => s.currentRole);
  const isIntern = currentRole === '实习生';

  useEffect(() => {
    settleExpiredPoints();
  }, [settleExpiredPoints]);

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-4 md:mb-6">
        <h2 className="text-lg md:text-xl font-semibold text-zinc-800">会员管理</h2>
        {!isIntern && (
          <span className="text-xs text-zinc-400">共 {members.length} 名会员</span>
        )}
        {isIntern && (
          <span className="text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded">
            实习生 — 只读模式
          </span>
        )}
      </div>

      <div className="bg-white border border-zinc-200 rounded-lg overflow-hidden">
        <div className="table-responsive">
          <table className="w-full text-sm min-w-[700px]">
            <thead>
              <tr className="bg-zinc-50 border-b border-zinc-200">
                <th className="text-left px-3 md:px-4 py-2.5 md:py-3 font-medium text-zinc-600">会员编号</th>
                <th className="text-left px-3 md:px-4 py-2.5 md:py-3 font-medium text-zinc-600">姓名</th>
                <th className="text-left px-3 md:px-4 py-2.5 md:py-3 font-medium text-zinc-600">手机</th>
                <th className="text-right px-3 md:px-4 py-2.5 md:py-3 font-medium text-zinc-600">总积分</th>
                <th className="text-right px-3 md:px-4 py-2.5 md:py-3 font-medium text-zinc-600">可用积分</th>
                <th className="text-right px-3 md:px-4 py-2.5 md:py-3 font-medium text-zinc-600">已到期</th>
                <th className="text-center px-3 md:px-4 py-2.5 md:py-3 font-medium text-zinc-600">状态</th>
                <th className="text-center px-3 md:px-4 py-2.5 md:py-3 font-medium text-zinc-600">操作</th>
              </tr>
            </thead>
            <tbody>
              {members.map((m) => (
                <tr key={m.id} className="border-b border-zinc-100 hover:bg-zinc-50">
                  <td className="px-3 md:px-4 py-2.5 md:py-3 font-mono text-xs">{m.member_no}</td>
                  <td className="px-3 md:px-4 py-2.5 md:py-3">{m.name}</td>
                  <td className="px-3 md:px-4 py-2.5 md:py-3 text-zinc-500">{m.phone}</td>
                  <td className="px-3 md:px-4 py-2.5 md:py-3 text-right font-medium">
                    {m.total_points.toLocaleString()}
                  </td>
                  <td className="px-3 md:px-4 py-2.5 md:py-3 text-right text-green-600 font-medium">
                    {m.available_points.toLocaleString()}
                  </td>
                  <td className="px-3 md:px-4 py-2.5 md:py-3 text-right text-red-500">
                    {m.expired_points > 0 ? (
                      <span>
                        {m.expired_points.toLocaleString()}
                        <span className="ml-1">⚠️</span>
                      </span>
                    ) : (
                      '0'
                    )}
                  </td>
                  <td className="px-3 md:px-4 py-2.5 md:py-3 text-center">
                    <span
                      className={`px-2 py-0.5 text-xs rounded ${
                        m.status === '正常'
                          ? 'bg-green-50 text-green-700'
                          : 'bg-red-50 text-red-700'
                      }`}
                    >
                      {m.status}
                    </span>
                  </td>
                  <td className="px-3 md:px-4 py-2.5 md:py-3 text-center">
                    <Link
                      href={`/members/${m.id}`}
                      className="text-blue-600 hover:text-blue-800 text-sm inline-block min-h-[36px] leading-[36px]"
                    >
                      详情
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
