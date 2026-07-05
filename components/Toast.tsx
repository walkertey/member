'use client';

import { usePointsStore } from '@/lib/store';

export default function ToastContainer() {
  const toasts = usePointsStore((s) => s.toasts);
  const removeToast = usePointsStore((s) => s.removeToast);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 md:top-4 md:right-4 md:left-auto md:translate-x-0 z-[100] flex flex-col gap-2 w-[calc(100%-2rem)] max-w-[360px] md:w-auto px-safe">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`px-4 py-3 rounded-lg shadow-lg text-sm flex items-center gap-2 animate-toast-in ${
            t.type === 'success'
              ? 'bg-green-600 text-white'
              : t.type === 'error'
              ? 'bg-red-600 text-white'
              : 'bg-blue-600 text-white'
          }`}
        >
          <span className="flex-1">{t.message}</span>
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
