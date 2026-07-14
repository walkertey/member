'use client';

import type { ReactElement } from 'react';
import { useI18n } from './RaymondI18nProvider';
import { LANG_LABELS, t } from './raymondTranslations';
import type { SupportedLang } from './raymondTranslations';

const FLAG_ICONS: Record<SupportedLang, ReactElement> = {
  en: (
    <svg width="16" height="16" viewBox="0 0 24 16" fill="none" aria-hidden="true">
      <rect width="24" height="16" rx="2" fill="#1e3a8a" />
      <path d="M0 0h10l-4 4h-6v4h6l-4 4h10l-4-4h6v-4h-6l4-4z" fill="#fff" opacity="0.9" />
      <path d="M0 0h5v6h-5z" fill="#dc2626" />
      <path d="M0 0h3v4h-3z" fill="#f0b429" opacity="0.7" />
    </svg>
  ),
  zh: (
    <svg width="16" height="16" viewBox="0 0 24 16" fill="none" aria-hidden="true">
      <rect width="24" height="16" rx="2" fill="#dc2626" />
      <g fill="#f0b429">
        <polygon points="7,3.5 7.8,5.8 10.5,5.8 8.3,7.3 9.1,9.7 7,8.2 4.9,9.7 5.7,7.3 3.5,5.8 6.2,5.8" />
        <rect x="14" y="4" width="1.2" height="3" rx="0.5" />
        <rect x="18" y="2.5" width="1" height="5.5" rx="0.5" />
        <rect x="14" y="8.5" width="1.2" height="3" rx="0.5" />
        <polygon points="18,8.5 19.5,12 17,10 20,10 17.5,12" />
      </g>
    </svg>
  ),
  ms: (
    <svg width="16" height="16" viewBox="0 0 24 16" fill="none" aria-hidden="true">
      <rect width="24" height="16" rx="2" fill="#dc2626" />
      <rect x="0" y="0" width="24" height="8" fill="#fff" />
      <rect x="0" y="0" width="24" height="3.5" fill="#1e3a8a" />
      <g transform="translate(4,2)">
        <circle cx="8" cy="5" r="2.5" fill="#f0b429" />
        <path d="M8 1.8l0.6 1.8h1.9l-1.5 1.1 0.6 1.8-1.6-1.1-1.5 1.1 0.6-1.8-1.5-1.1h1.9z" fill="#f0b429" />
      </g>
    </svg>
  ),
};

export default function LanguageSwitcher() {
  const { lang, setLang, toggleLang } = useI18n();

  return (
    <div className="flex items-center gap-1.5">
      <div className="hidden min-w-[154px] items-center justify-end gap-1.5 sm:flex">
        {FLAG_ICONS[lang]}
        <select
          value={lang}
          onChange={(event) => setLang(event.target.value as SupportedLang)}
          className="min-h-[36px] w-[126px] cursor-pointer appearance-none rounded-lg border border-white/10 bg-transparent px-2 py-1.5 text-xs text-white/80 focus:border-rm-gold/40 focus:outline-none"
          aria-label={t('lang.label', lang)}
        >
          {(Object.keys(LANG_LABELS) as SupportedLang[]).map((code) => (
            <option key={code} value={code} className="bg-rm-bg-card text-white">
              {LANG_LABELS[code]}
            </option>
          ))}
        </select>
      </div>

      <button
        type="button"
        onClick={toggleLang}
        className="flex min-h-[36px] min-w-[44px] items-center justify-center gap-1.5 rounded-lg border border-white/10 px-2 py-1.5 text-xs text-white/80 transition-colors hover:bg-white/5 sm:hidden"
        aria-label={`${t('lang.label', lang)}: ${LANG_LABELS[lang]}`}
      >
        {FLAG_ICONS[lang]}
        <span className="text-[10px] font-medium uppercase">{lang}</span>
      </button>
    </div>
  );
}
