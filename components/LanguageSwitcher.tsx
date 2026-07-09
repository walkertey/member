'use client';

import { usePointsStore } from '@/lib/store';
import type { Locale } from '@/lib/i18n';
import { ALL_LOCALES } from '@/lib/i18n';

export default function LanguageSwitcher() {
  const locale = usePointsStore((s) => s.locale);
  const setLocale = usePointsStore((s) => s.setLocale);

  return (
    <div className="flex items-center gap-1.5 md:gap-2">
      <select
        id="language-switcher"
        value={locale}
        onChange={(e) => setLocale(e.target.value as Locale)}
        className="rm-demo-filter text-sm min-h-[44px]"
      >
        {ALL_LOCALES.map((l) => (
          <option key={l.code} value={l.code}>
            {l.label}
          </option>
        ))}
      </select>
    </div>
  );
}
