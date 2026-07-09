'use client';

import { usePointsStore } from '@/lib/store';
import { useI18n } from '@/components/raymond-i18n/RaymondI18nProvider';
import { t } from '@/components/raymond-i18n/raymondTranslations';

const toastStyles: Record<string, string> = {
  success: 'bg-emerald-600/85 text-white border border-emerald-400/30',
  error: 'bg-red-600/85 text-white border border-red-400/30',
};

export default function ToastContainer() {
  const toasts = usePointsStore((s) => s.toasts);
  const removeToast = usePointsStore((s) => s.removeToast);
  const { lang } = useI18n();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 md:top-4 md:right-4 md:left-auto md:translate-x-0 z-[100] flex flex-col gap-2 w-[calc(100%-2rem)] max-w-[360px] md:w-auto px-safe">
      {toasts.map((tst) => (
        <div
          key={tst.id}
          className={`rm-toast-glass px-4 py-3 text-sm flex items-center gap-2 animate-toast-in ${
            toastStyles[tst.type] ?? 'bg-rm-icon-blue/85 text-white border border-rm-icon-blue/30'
          }`}
        >
          <span className="flex-1 font-medium">{tst.message}</span>
          <button
            onClick={() => removeToast(tst.id)}
            className="text-white/80 hover:text-white text-lg leading-none min-w-[32px] min-h-[32px] flex items-center justify-center"
            aria-label={t('toast.close', lang)}
          >
            &times;
          </button>
        </div>
      ))}
    </div>
  );
}
