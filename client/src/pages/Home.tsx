'use client';

import LanguageSwitcher from '@/components/LanguageSwitcher';
import { RaymondCard } from '@/components/RaymondCard';
import { useLanguage } from '@/i18n/LanguageContext';
import { translations } from '@/i18n/translations';
import {
  Bell,
  ChevronRight,
  Database,
  Diamond,
  Eye,
  EyeOff,
  Gift,
  ShoppingBag,
  X,
} from 'lucide-react';
import { useState, type ReactNode } from 'react';
import { useLocation } from 'wouter';

interface ActionItem {
  title: string;
  subtitle: string;
  icon: ReactNode;
  route: string;
}

function ActionCard({ item, onClick }: { item: ActionItem; onClick: () => void }) {
  return (
    <RaymondCard
      variant="action"
      className="flex cursor-pointer items-center gap-3 p-4 hover:opacity-90 active:scale-95"
      onClick={onClick}
    >
      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center text-[#EBCB83]">
        {item.icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[15px] font-semibold leading-[21px] tracking-[0.1px] text-[#F2F3F7]">
          {item.title}
        </p>
        <p className="mt-0.5 text-[12px] font-normal leading-[17px] tracking-[0.1px] text-[#7F8FA8]">
          {item.subtitle}
        </p>
      </div>
      <ChevronRight className="h-5 w-5 flex-shrink-0 text-[#8FA0B7]" />
    </RaymondCard>
  );
}

function PremiumCard() {
  const [hidePoints, setHidePoints] = useState(false);
  const { language } = useLanguage();
  const t = translations[language];

  return (
    <div className="relative aspect-[1.258] w-full rounded-[16px] bg-gradient-to-br from-[#FFF0B7] via-[#D9A85A] to-[#B77A35] p-1.5 shadow-[0_2px_10px_rgba(244,198,110,0.42)]">
      <div className="relative h-full w-full overflow-hidden rounded-[14.5px] border border-[rgba(255,247,211,0.8)] bg-[#001733]">
        <div className="absolute inset-0 bg-gradient-to-br from-[#12395F] via-[#001733] to-[#000B19]" />
        <div className="absolute inset-0 bg-gradient-to-br from-[rgba(37,80,126,0.28)] via-[rgba(0,19,43,0.08)] to-[rgba(0,8,22,0.48)]" />
        <div className="absolute left-1/4 top-0 h-1.5 w-1/2 rounded-full bg-[#FFF0B4] opacity-90 blur-lg" />

        <div className="relative flex h-full flex-col px-6 pb-5 pt-6">
          <div className="mb-4 flex items-start justify-between">
            <div>
              <h2 className="font-serif text-[28px] font-semibold leading-[34px] tracking-[0.25px] text-[#F5F1E8]">
                Raymond
              </h2>
              <p className="mt-1.5 text-[13px] font-medium leading-[18px] tracking-[0.25px] text-[#A9B6CB]">
                {t.pointsManagement}
              </p>
            </div>
            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#FFEAB0] to-[#C88F3F] p-0.5">
              <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-full bg-[rgba(1,28,58,0.96)]">
                <img
                  src="/raymond/gold-flower-badge.png"
                  alt="Raymond gold flower badge"
                  className="h-11 w-11 object-contain"
                />
              </div>
            </div>
          </div>

          <div className="absolute bottom-4 left-6 right-6">
            <div className="mb-1 flex items-center justify-between">
              <p className="text-[11px] font-medium uppercase leading-[16px] tracking-[0.3px] text-[#A9B6CB]">
                {t.availablePoints}
              </p>
              <button
                type="button"
                onClick={() => setHidePoints((current) => !current)}
                aria-label={hidePoints ? t.showPoints : t.hidePoints}
                className="flex h-8 w-8 items-center justify-center text-[#F2F4F8] transition-all hover:opacity-80 active:scale-90"
              >
                {hidePoints ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            <p
              className="text-[36px] font-black leading-[36px] tracking-[0.1px] text-[#F2D188]"
              style={{ fontFamily: 'Dijita, monospace' }}
            >
              {hidePoints ? '•••••••.••' : '888,888.00'}
            </p>
          </div>

          <div className="pointer-events-none absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-[45%] transform items-center justify-center">
            <div className="relative h-[180px] w-[180px]">
              <div className="absolute inset-0 rounded-full bg-[#D4A574] opacity-20 blur-xl" />
              <img
                src="/r_ornate_cutout.png"
                alt="Raymond R logo"
                className="relative h-full w-full object-contain drop-shadow-[0_0_15px_rgba(212,165,116,0.5)]"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const { language } = useLanguage();
  const t = translations[language];
  const [, navigate] = useLocation();
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const actions: ActionItem[] = [
    {
      title: t.memberCenter,
      subtitle: t.viewMemberInfo,
      icon: <Diamond className="h-8 w-8" />,
      route: '/member',
    },
    {
      title: t.myOrders,
      subtitle: t.viewOrderDetails,
      icon: <ShoppingBag className="h-8 w-8" />,
      route: '/orders',
    },
    {
      title: t.pointsDetails,
      subtitle: t.viewPointsRecord,
      icon: <Database className="h-8 w-8" />,
      route: '/points',
    },
    {
      title: t.pointsRedemption,
      subtitle: t.redeemRewards,
      icon: <Gift className="h-8 w-8" />,
      route: '/benefits',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#00162E] via-[#032344] to-[#00172F] px-4 pb-24 pt-4 sm:px-6">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-1/3 top-0 h-96 w-96 rounded-full bg-gradient-to-br from-[#EBCB83] to-transparent opacity-5 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-md space-y-6">
        <div className="flex items-start justify-between px-1 pt-2">
          <div>
            <h1 className="font-serif text-[31px] font-semibold leading-[38px] tracking-[0.15px] text-[#F6F3EC]">
              Raymond
            </h1>
            <div className="mt-2 flex items-center gap-2">
              <Diamond className="h-4 w-4 text-[#A4B1C6]" />
              <p className="text-[13px] font-medium leading-[18px] tracking-[0.3px] text-[#A4B1C6]">
                {t.memberLevel} · {t.premiumMember}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <button
              type="button"
              aria-label={t.notifications}
              onClick={() => setNotificationsOpen(true)}
              className="relative flex h-11 w-11 items-center justify-center rounded-full border border-[rgba(134,158,189,0.2)] bg-[rgba(35,61,86,0.58)] shadow-[0_5px_9px_rgba(0,0,0,0.18)] transition-all hover:opacity-80 active:scale-95"
            >
              <Bell className="h-6 w-6 text-[#F6F3EC]" />
              <span className="absolute right-1 top-1 h-2.5 w-2.5 animate-pulse rounded-full border border-[#F4D995] bg-gradient-to-br from-[#FFE29B] to-[#CD9040]" />
            </button>
          </div>
        </div>

        <PremiumCard />

        <div className="grid grid-cols-2 gap-3">
          {actions.map((item) => (
            <ActionCard key={item.route} item={item} onClick={() => navigate(item.route)} />
          ))}
        </div>
      </div>

      {notificationsOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/55 px-4 pb-5 sm:items-center"
          role="dialog"
          aria-modal="true"
          aria-labelledby="notifications-title"
        >
          <div className="w-full max-w-md rounded-2xl border border-[rgba(235,203,131,0.25)] bg-[#082744] p-5 text-[#F6F3EC] shadow-2xl">
            <div className="mb-5 flex items-center justify-between">
              <h2 id="notifications-title" className="font-serif text-2xl font-semibold">
                {t.notifications}
              </h2>
              <button
                type="button"
                aria-label={t.close}
                onClick={() => setNotificationsOpen(false)}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <p className="rounded-xl bg-[#001733]/70 px-4 py-5 text-center text-sm text-[#A9B6CB]">
              {t.noNotifications}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
