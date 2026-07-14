import { useLanguage } from "@/i18n/LanguageContext";
import { translations } from "@/i18n/translations";
import { Gift } from "lucide-react";
import { useState } from "react";
import { PageShell, Panel } from "./PageShell";

interface Reward {
  id: string;
  name: string;
  points: number;
}

export default function Benefits() {
  const { language } = useLanguage();
  const t = translations[language];
  const [redeemedIds, setRedeemedIds] = useState<string[]>([]);

  const rewards: Reward[] = [
    { id: "premium-gift-box", name: t.premiumGiftBox, points: 12000 },
    { id: "member-voucher-50", name: t.memberVoucher, points: 8000 },
    { id: "priority-service-pass", name: t.priorityServicePass, points: 5000 },
  ];

  const redeem = (rewardId: string) => {
    setRedeemedIds((current) =>
      current.includes(rewardId) ? current : [...current, rewardId],
    );
  };

  return (
    <PageShell title={t.pointsRedemption} subtitle={t.benefitsSubtitle}>
      <div className="space-y-4">
        {rewards.map((reward) => {
          const isRedeemed = redeemedIds.includes(reward.id);

          return (
            <Panel key={reward.id}>
              <div className="mb-5 flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[rgba(235,203,131,0.14)] text-[#EBCB83]">
                  <Gift className="h-7 w-7" />
                </div>

                <div className="flex-1">
                  <h2 className="font-semibold">{reward.name}</h2>
                  <p className="mt-1 text-sm font-bold text-[#F2D188]">
                    {reward.points.toLocaleString()} {t.pointsUnit}
                  </p>
                </div>
              </div>

              <button
                type="button"
                disabled={isRedeemed}
                onClick={() => redeem(reward.id)}
                className="w-full rounded-xl bg-gradient-to-r from-[#C89448] to-[#F2D188] px-4 py-3 font-bold text-[#001733] disabled:cursor-not-allowed disabled:opacity-55"
              >
                {isRedeemed ? t.redeemed : t.redeemReward}
              </button>
            </Panel>
          );
        })}
      </div>
    </PageShell>
  );
}
