import { useLanguage } from "@/i18n/LanguageContext";
import { translations } from "@/i18n/translations";
import { PageShell, Panel, StatusBadge } from "./PageShell";

export default function Member() {
  const { language } = useLanguage();
  const t = translations[language];

  const details = [
    [t.memberId, "RM-2026-000888"],
    [t.memberLevel, t.premiumMember],
    [t.joinDate, "14 July 2026"],
    [t.mobile, "+60 12-*** 8888"],
    [t.email, "raymond@example.com"],
  ];

  return (
    <PageShell title={t.memberCenter} subtitle={t.memberSubtitle}>
      <Panel className="mb-4">
        <div className="mb-5 flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-[#EBCB83] bg-[#001733] font-serif text-3xl font-bold text-[#F2D188]">
            R
          </div>

          <div>
            <h2 className="font-serif text-2xl font-semibold">Raymond</h2>
            <div className="mt-2">
              <StatusBadge>{t.active}</StatusBadge>
            </div>
          </div>
        </div>

        <div className="divide-y divide-[rgba(169,182,203,0.15)]">
          {details.map(([label, value]) => (
            <div key={label} className="flex justify-between gap-4 py-3">
              <span className="text-sm text-[#A9B6CB]">{label}</span>
              <span className="text-right text-sm font-semibold">{value}</span>
            </div>
          ))}
        </div>
      </Panel>

      <Panel>
        <p className="text-xs uppercase tracking-wider text-[#A9B6CB]">
          {t.availablePoints}
        </p>
        <p className="mt-2 text-4xl font-black tracking-tight text-[#F2D188]">
          888,888.00
        </p>
      </Panel>
    </PageShell>
  );
}
