'use client';

import { useState } from 'react';
import { Eye, EyeOff, Bell, ChevronRight, Diamond, ShoppingBag, Database, Gift } from 'lucide-react';
import { RaymondCard, RaymondCardBody } from '@/components/RaymondCard';

interface ActionItem {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
}

type Language = 'en' | 'zh' | 'ms';

const TRANSLATIONS = {
  en: {
    pointsLabel: 'Available Points',
    pointsManagement: 'Points Management',
    memberLevel: 'Member Level',
    premiumMember: 'Premium Member',
    memberCenter: 'Member Center',
    viewMemberInfo: 'View member info',
    myOrders: 'My Orders',
    viewOrderDetails: 'View order details',
    pointsDetails: 'Points Details',
    viewPointsRecord: 'View points record',
    pointsRedemption: 'Points Redemption',
    redeemRewards: 'Redeem rewards',
  },
  zh: {
    pointsLabel: '当前可用积分',
    pointsManagement: '积分管理',
    memberLevel: '会员等级',
    premiumMember: '尊享会员',
    memberCenter: '会员中心',
    viewMemberInfo: '查看会员信息',
    myOrders: '我的订单',
    viewOrderDetails: '查看订单详情',
    pointsDetails: '积分明细',
    viewPointsRecord: '查看积分记录',
    pointsRedemption: '积分兑换',
    redeemRewards: '兑换超值好礼',
  },
  ms: {
    pointsLabel: 'Poin Tersedia',
    pointsManagement: 'Pengurusan Poin',
    memberLevel: 'Tahap Ahli',
    premiumMember: 'Ahli Premium',
    memberCenter: 'Pusat Ahli',
    viewMemberInfo: 'Lihat info ahli',
    myOrders: 'Pesanan Saya',
    viewOrderDetails: 'Lihat detail pesanan',
    pointsDetails: 'Detail Poin',
    viewPointsRecord: 'Lihat catatan poin',
    pointsRedemption: 'Penebusan Poin',
    redeemRewards: 'Tukar hadiah berharga',
  },
};

function ActionCard({ item, t, onClick }: { item: ActionItem; t: typeof TRANSLATIONS.en; onClick?: () => void }) {
  return (
    <RaymondCard variant="action" className="p-4 flex items-center gap-3 cursor-pointer hover:opacity-90 active:scale-95" onClick={onClick}>
      <div className="w-10 h-10 flex items-center justify-center flex-shrink-0 text-[#EBCB83]">
        {item.icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[15px] font-semibold text-[#F2F3F7] leading-[21px] tracking-[0.1px]">
          {item.title}
        </p>
        <p className="mt-0.5 text-[12px] font-normal text-[#7F8FA8] leading-[17px] tracking-[0.1px]">
          {item.subtitle}
        </p>
      </div>
      <ChevronRight className="w-5 h-5 text-[#8FA0B7] flex-shrink-0" />
    </RaymondCard>
  );
}

function PremiumCard({ language }: { language: Language }) {
  const [hidePoints, setHidePoints] = useState(false);
  const t = TRANSLATIONS[language];

  return (
    <div className="relative w-full aspect-[1.258] rounded-[16px] p-1.5 bg-gradient-to-br from-[#FFF0B7] via-[#D9A85A] to-[#B77A35] shadow-[0_2px_10px_rgba(244,198,110,0.42)]">
      <div className="relative w-full h-full rounded-[14.5px] border border-[rgba(255,247,211,0.8)] bg-[#001733] overflow-hidden">
        {/* 背景纹理 */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#12395F] via-[#001733] to-[#000B19]" />

        {/* 渐变叠加 */}
        <div className="absolute inset-0 bg-gradient-to-br from-[rgba(37,80,126,0.28)] via-[rgba(0,19,43,0.08)] to-[rgba(0,8,22,0.48)]" />

        {/* 顶部光晕 */}
        <div className="absolute top-0 left-1/4 w-1/2 h-1.5 bg-[#FFF0B4] rounded-full blur-lg opacity-90" />

        {/* 卡片内容 */}
        <div className="relative flex flex-col h-full px-6 pt-6 pb-5">
          {/* 顶部：标题 + 徽章 */}
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-[28px] font-semibold text-[#F5F1E8] leading-[34px] tracking-[0.25px] font-serif">
                Raymond
              </h2>
              <p className="mt-1.5 text-[13px] font-medium text-[#A9B6CB] leading-[18px] tracking-[0.25px]">
                {t.pointsManagement}
              </p>
            </div>
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#FFEAB0] to-[#C88F3F] p-0.5 flex-shrink-0 flex items-center justify-center">
              <div className="w-full h-full rounded-full bg-[rgba(1,28,58,0.96)] flex items-center justify-center overflow-hidden">
                <img
                  src="/raymond/gold-flower-badge.png"
                  alt="Raymond gold flower badge"
                  className="h-11 w-11 object-contain"
                />
              </div>
            </div>
          </div>

          {/* 积分显示 - 36px 贴金框底部 */}
          <div className="absolute bottom-4 left-6 right-6">
            <div className="flex items-center justify-between mb-1">
              <p className="text-[11px] font-medium text-[#A9B6CB] leading-[16px] tracking-[0.3px] uppercase">
                {t.pointsLabel}
              </p>
              <button
                onClick={() => setHidePoints(!hidePoints)}
                className="w-6 h-6 flex items-center justify-center text-[#F2F4F8] hover:opacity-80 active:scale-90 transition-all"
              >
                {hidePoints ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            <p className="text-[36px] font-black text-[#F2D188] leading-[36px] tracking-[0.1px]" style={{ fontFamily: 'Dijita, monospace' }}>
              {hidePoints ? '•••••••.••' : '888,888.00'}
            </p>
          </div>

          {/* R 品牌 - 替换为用户提供的抠图 R */}
          <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-[45%] pointer-events-none flex items-center justify-center">
            <div className="relative w-[180px] h-[180px]">
              {/* 光晕效果 */}
              <div className="absolute inset-0 blur-xl bg-[#D4A574] opacity-20 rounded-full" />
              <img
                src="/r_ornate_cutout.png"
                alt="R Logo"
                className="relative w-full h-full object-contain drop-shadow-[0_0_15px_rgba(212,165,116,0.5)]"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const [language, setLanguage] = useState<Language>('en');
  const t = TRANSLATIONS[language];

  const cycleLanguage = () => {
    const languages: Language[] = ['en', 'zh', 'ms'];
    const currentIndex = languages.indexOf(language);
    setLanguage(languages[(currentIndex + 1) % languages.length]);
  };

  const ACTIONS: ActionItem[] = [
    { title: t.memberCenter, subtitle: t.viewMemberInfo, icon: <Diamond className="w-8 h-8" /> },
    { title: t.myOrders, subtitle: t.viewOrderDetails, icon: <ShoppingBag className="w-8 h-8" /> },
    { title: t.pointsDetails, subtitle: t.viewPointsRecord, icon: <Database className="w-8 h-8" /> },
    { title: t.pointsRedemption, subtitle: t.redeemRewards, icon: <Gift className="w-8 h-8" /> },
  ];

  const handleNavigation = (_index: number) => {
    // Visual demo only: keep action cards interactive without navigating
    // to unfinished routes.
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#00162E] via-[#032344] to-[#00172F] pt-4 pb-24 px-4 sm:px-6">
      {/* 背景渐变装饰 */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/3 w-96 h-96 bg-gradient-to-br from-[#EBCB83] to-transparent opacity-5 rounded-full blur-3xl" />
      </div>

      <style>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
            opacity: 0.3;
          }
          50% {
            opacity: 0.8;
          }
          100% {
            transform: translateX(100%);
            opacity: 0.3;
          }
        }
      `}</style>

      <div className="relative max-w-md mx-auto space-y-6">
        {/* 页面头部 */}
        <div className="flex items-start justify-between pt-2 px-1">
          <div>
            <h1 className="text-[31px] font-semibold text-[#F6F3EC] leading-[38px] tracking-[0.15px] font-serif">
              Raymond
            </h1>
            <div className="mt-2 flex items-center gap-2">
              <Diamond className="w-4 h-4 text-[#A4B1C6]" />
              <button
                onClick={cycleLanguage}
                className="text-[13px] font-medium text-[#A4B1C6] leading-[18px] tracking-[0.3px] hover:text-[#EBCB83] transition-colors"
              >
                {t.memberLevel} · {t.premiumMember}
              </button>
            </div>
          </div>
          <button className="w-11 h-11 rounded-full bg-[rgba(35,61,86,0.58)] border border-[rgba(134,158,189,0.2)] flex items-center justify-center shadow-[0_5px_9px_rgba(0,0,0,0.18)] hover:opacity-80 active:scale-95 transition-all">
            <Bell className="w-6 h-6 text-[#F6F3EC]" />
            <div className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-gradient-to-br from-[#FFE29B] to-[#CD9040] border border-[#F4D995] animate-pulse" />
          </button>
        </div>

        {/* 高级卡片 */}
        <PremiumCard language={language} />

        {/* 操作网格 */}
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            {ACTIONS.map((item, idx) => (
              <ActionCard key={idx} item={item} t={t} onClick={() => handleNavigation(idx)} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
