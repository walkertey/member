'use client';
import Link from 'next/link';
import { useI18n } from '@/components/raymond-i18n/RaymondI18nProvider';
const copy = {
  en: { title: 'Page not found', message: 'The page you requested does not exist or has moved.', home: 'Back to home' },
  zh: { title: '找不到页面', message: '你访问的页面不存在或已经移动。', home: '返回首页' },
  ms: { title: 'Halaman tidak dijumpai', message: 'Halaman yang diminta tidak wujud atau telah dipindahkan.', home: 'Kembali ke utama' },
};
export default function NotFound() {
  const { lang } = useI18n();
  const text = copy[lang];
  return (
    <section className="mx-auto flex min-h-[65vh] max-w-xl items-center justify-center px-4 py-12 text-center">
      <div className="rm-demo-card rm-liquid-card w-full p-8 md:p-10">
        <p className="rm-brand-wordmark text-5xl font-black text-[var(--rm-gold-deep)]">404</p>
        <h1 className="rm-demo-title mt-5 justify-center">{text.title}</h1>
        <p className="rm-demo-subtitle mx-auto max-w-md">{text.message}</p>
        <Link href="/" className="rm-demo-primary-button mt-6 inline-flex min-h-[44px] items-center justify-center px-5 py-2.5">
          {text.home}
        </Link>
      </div>
    </section>
  );
}
