import { useState } from "react";
import { Gift } from "lucide-react";
import { PageShell, Panel } from "./PageShell";

const rewards = [
  { name: "Premium Gift Box", points: 12000 },
  { name: "RM50 Member Voucher", points: 8000 },
  { name: "Priority Service Pass", points: 5000 },
];

export default function Benefits() {
  const [redeemed, setRedeemed] = useState<string[]>([]);

  const redeem = (name: string) => {
    if (!redeemed.includes(name)) {
      setRedeemed((current) => [...current, name]);
    }
  };

  return (
    <PageShell title="Points Redemption" subtitle="积分兑换 · Penebusan Poin">
      <div className="space-y-4">
        {rewards.map((reward) => {
          const isRedeemed = redeemed.includes(reward.name);

          return (
            <Panel key={reward.name}>
              <div className="mb-5 flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[rgba(235,203,131,0.14)] text-[#EBCB83]">
                  <Gift className="h-7 w-7" />
                </div>
                <div className="flex-1">
                  <h2 className="font-semibold">{reward.name}</h2>
                  <p className="mt-1 text-sm font-bold text-[#F2D188]">
                    {reward.points.toLocaleString()} points
                  </p>
                </div>
              </div>

              <button
                type="button"
                disabled={isRedeemed}
                onClick={() => redeem(reward.name)}
                className="w-full rounded-xl bg-gradient-to-r from-[#C89448] to-[#F2D188] px-4 py-3 font-bold text-[#001733] disabled:cursor-not-allowed disabled:opacity-55"
              >
                {isRedeemed ? "Redeemed" : "Redeem reward"}
              </button>
            </Panel>
          );
        })}
      </div>
    </PageShell>
  );
}
