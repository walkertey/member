import { useLanguage } from "@/i18n/LanguageContext";
import { translations } from "@/i18n/translations";
import { PageShell, Panel } from "./PageShell";

export default function Points() {
  const { language } = useLanguage();
  const t = translations[language];

  const transactions = [
    {
      date: "14 Jul",
      description: t.premiumPurchase,
      change: "+2,880",
      balance: "888,888",
    },
    {
      date: "02 Jul",
      description: t.rewardRedemption,
      change: "-8,000",
      balance: "886,008",
    },
    {
      date: "30 Jun",
      description: t.memberPurchase,
      change: "+1,280",
      balance: "894,008",
    },
  ];

  return (
    <PageShell title={t.pointsDetails} subtitle={t.pointsSubtitle}>
      <Panel className="mb-4">
        <p className="text-xs uppercase tracking-wider text-[#A9B6CB]">
          {t.currentBalance}
        </p>
        <p className="mt-2 text-4xl font-black tracking-tight text-[#F2D188]">
          888,888.00
        </p>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <div className="rounded-xl bg-[rgba(0,23,51,0.75)] p-3">
            <p className="text-xs text-[#A9B6CB]">{t.earned}</p>
            <p className="mt-1 font-bold text-emerald-300">+25,480</p>
          </div>

          <div className="rounded-xl bg-[rgba(0,23,51,0.75)] p-3">
            <p className="text-xs text-[#A9B6CB]">{t.redeemedPoints}</p>
            <p className="mt-1 font-bold text-rose-300">-8,000</p>
          </div>
        </div>
      </Panel>

      <Panel>
        <h2 className="mb-4 font-semibold">{t.transactionHistory}</h2>

        <div className="space-y-4">
          {transactions.map((item) => (
            <div
              key={`${item.date}-${item.description}`}
              className="flex items-center justify-between border-b border-[rgba(169,182,203,0.12)] pb-4 last:border-0 last:pb-0"
            >
              <div>
                <p className="text-sm font-semibold">{item.description}</p>
                <p className="mt-1 text-xs text-[#A9B6CB]">{item.date}</p>
              </div>

              <div className="text-right">
                <p
                  className={`font-bold ${
                    item.change.startsWith("+")
                      ? "text-emerald-300"
                      : "text-rose-300"
                  }`}
                >
                  {item.change}
                </p>
                <p className="mt-1 text-xs text-[#A9B6CB]">{item.balance}</p>
              </div>
            </div>
          ))}
        </div>
      </Panel>
    </PageShell>
  );
}
