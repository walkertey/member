'use client';

import { usePointsStore } from '@/lib/store';

export default function ToastContainer() {
  const toasts = usePointsStore((s) => s.toasts);
  const removeToast = usePointsStore((s) => s.removeToast);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`px-4 py-3 rounded-lg shadow-lg text-sm flex items-center gap-2 min-w-[280px] animate-in slide-in-from-right ${
            t.type === 'success'
              ? 'bg-green-600 text-white'
              : t.type === 'error'
              ? 'bg-red-600 text-white'
              : 'bg-blue-600 text-white'
          }`}
        >
          <span className="flex-1">{t.message}</span>
          <button onClick={() => removeToast(t.id)} className="text-white/80 hover:text-white text-lg leading-none">
            &times;
          </button>
        </div>
      ))}
    </div>
  );
}
