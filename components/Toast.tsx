'use client';

import { usePointsStore } from '@/lib/store';

const toastStyles: Record<string, string> = {
  success: 'bg-emerald-600/90 backdrop-blur text-white border border-emerald-500/30',
  error: 'bg-red-600/90 backdrop-blur text-white border border-red-500/30',
};

export default function ToastContainer() {
  const toasts = usePointsStore((s) => s.toasts);
  const removeToast = usePointsStore((s) => s.removeToast);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 md:top-4 md:right-4 md:left-auto md:translate-x-0 z-[100] flex flex-col gap-2 w-[calc(100%-2rem)] max-w-[360px] md:w-auto px-safe">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`px-4 py-3 rounded-xl shadow-2xl text-sm flex items-center gap-2 animate-toast-in ${
            toastStyles[t.type] ?? 'bg-rm-icon-blue/90 backdrop-blur text-white border border-rm-icon-blue/30'
          }`}
        >
          <span className="flex-1 font-medium">{t.message}</span>
          <button
            onClick={() => removeToast(t.id)}
            className="text-white/80 hover:text-white text-lg leading-none min-w-[32px] min-h-[32px] flex items-center justify-center"
            aria-label="关闭通知"
          >
            &times;
          </button>
        </div>
      ))}
    </div>
  );
}
