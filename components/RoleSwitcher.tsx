'use client';

import { usePointsStore } from '@/lib/store';
import type { Role } from '@/lib/permissions';
import { ALL_ROLES } from '@/lib/permissions';

export default function RoleSwitcher() {
  const currentRole = usePointsStore((s) => s.currentRole);
  const setRole = usePointsStore((s) => s.setRole);

  return (
    <div className="flex items-center gap-1.5 md:gap-2">
      <label
        htmlFor="role-switcher"
        className="text-xs md:text-sm text-zinc-500 whitespace-nowrap hidden xs:inline"
      >
        角色:
      </label>
      <select
        id="role-switcher"
        value={currentRole}
        onChange={(e) => setRole(e.target.value as Role)}
        className="text-sm border border-zinc-300 rounded px-2 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[44px]"
      >
        {ALL_ROLES.map((r) => (
          <option key={r} value={r}>
            {r}
          </option>
        ))}
      </select>
    </div>
  );
}
