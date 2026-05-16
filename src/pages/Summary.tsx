import { useNavigate } from "react-router";
import { Check, ArrowRight } from "lucide-react";
import { Card, PrimaryButton, HexStamp } from "@/components/ui";
import { useAppState } from "@/app/store";
import { checkpoints, lotteryData, modeConfig } from "@/data/constants";
import { useT } from "@/app/hooks/useT";

const stampColors = ["#E8340A", "#F5A800", "#00A878", "#0057B8", "#7B2FBE", "#E8340A"];

export function Summary() {
  const navigate = useNavigate();
  const { origin, destination, mode, completedCheckpoints, lotteryStatuses } = useAppState();
  const t = useT();

  const effectiveMode = mode ?? "walk";
  const cfg = modeConfig[effectiveMode];
  const doneLotteries = lotteryData.filter(l => lotteryStatuses[l.id] === "done");
  const completedCount = completedCheckpoints.filter(Boolean).length;
  const distUnit = t.summary.distance === "Distance" ? "km" : "กม.";
  const timeUnit = t.summary.time_spent === "Time Spent" ? "min" : "นาที";
  const distEstimate = `${(completedCount * 0.7).toFixed(1)} ${distUnit}`;
  const timeEstimate = `${completedCount * 15} ${timeUnit}`;
  const modeLabel = effectiveMode === "walk" ? t.modes.walk : effectiveMode === "bike" ? t.modes.bike : t.modes.boat;

  return (
    <div className="min-h-screen bg-[#FFFDF5]">
      {/* Confetti header */}
      <div
        className="bg-[#F5A800] border-b-2 border-[#1A1207] py-10 px-6 text-center relative overflow-hidden"
        style={{ boxShadow: "0 4px 0 #1A1207" }}
      >
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none opacity-10 text-8xl tracking-widest">
          🎉🎊🎉🎊🎉
        </div>
        <h2 className="font-['Fahkwang'] text-3xl md:text-4xl font-bold text-[#1A1207] relative z-10">
          {t.summary.congrats}
        </h2>
        <p className="font-['Sarabun'] text-[#1A1207]/75 mt-2 relative z-10">
          {completedCount > 0
            ? `${t.summary.completed_n} ${completedCount} ${t.summary.completed_spots}`
            : t.summary.finished}
        </p>
        {origin && (
          <div className="mt-3 font-['Sarabun'] text-sm text-[#1A1207]/60 relative z-10">
            {origin} {destination ? `→ ${destination}` : ""}
          </div>
        )}
      </div>

      <div className="max-w-[960px] mx-auto px-4 md:px-6 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Left: stats + lottery badges */}
          <div className="flex-1">
            <h3 className="font-['Fahkwang'] text-xl font-bold text-[#1A1207] mb-4">{t.summary.route_stats}</h3>
            <div className="grid grid-cols-2 gap-4 mb-8">
              {[
                { label: t.summary.distance, value: distEstimate, icon: "📍", color: "#E8340A" },
                { label: t.summary.time_spent, value: timeEstimate, icon: "⏱", color: "#F5A800" },
                { label: t.summary.checkpoints_done, value: `${completedCount}`, icon: "🏁", color: "#00A878" },
                { label: t.nav.title_mode.split(" ")[0], value: modeLabel, icon: cfg.emoji, color: cfg.color },
              ].map(stat => (
                <Card key={stat.label} className="p-4">
                  <div className="text-2xl mb-2">{stat.icon}</div>
                  <div className="font-['Fahkwang'] text-xl font-bold" style={{ color: stat.color }}>{stat.value}</div>
                  <div className="font-['Sarabun'] text-xs text-[#1A1207]/50 mt-0.5 leading-tight">{stat.label}</div>
                </Card>
              ))}
            </div>

            {/* Lottery badges */}
            <h3 className="font-['Fahkwang'] text-xl font-bold text-[#1A1207] mb-4">
              {t.summary.lottery_badges} {doneLotteries.length > 0 ? `(${doneLotteries.length})` : ""}
            </h3>
            {doneLotteries.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {doneLotteries.map(item => (
                  <div
                    key={item.id}
                    className="flex items-center gap-2 bg-white border-2 border-[#1A1207] rounded-full px-3 py-1.5"
                    style={{ boxShadow: "2px 2px 0 #1A1207" }}
                  >
                    <div className="w-4 h-4 rounded-full bg-[#F5A800] flex items-center justify-center border border-[#1A1207]">
                      <Check size={9} className="text-[#1A1207]" strokeWidth={3} />
                    </div>
                    <span className="font-['Fahkwang'] text-xs text-[#1A1207]">{item.name}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="font-['Sarabun'] text-sm text-[#1A1207]/40">{t.summary.lottery_badges} — 0</p>
            )}
          </div>

          {/* Right: checkpoint timeline + stamp preview */}
          <div className="flex-1">
            <h3 className="font-['Fahkwang'] text-xl font-bold text-[#1A1207] mb-4">{t.summary.checkpoints_done}</h3>
            <div className="relative pl-5">
              <div className="absolute left-5 top-4 bottom-4 w-0.5 bg-[#E2D5B0]" />
              <div className="space-y-4">
                {checkpoints.map((cp, i) => {
                  const done = completedCheckpoints[i];
                  return (
                    <div key={cp.id} className={`flex items-start gap-4 relative ${!done ? "opacity-40" : ""}`}>
                      <div
                        className="w-10 h-10 rounded-full border-2 border-[#1A1207] flex items-center justify-center flex-shrink-0 relative z-10"
                        style={{ backgroundColor: done ? stampColors[i] : "#F0EDE0", color: done ? "white" : "#1A1207" }}
                      >
                        {done ? <Check size={14} strokeWidth={3} /> : <span className="font-['Fahkwang'] text-xs">{i + 1}</span>}
                      </div>
                      <div className="pt-2">
                        <div className="font-['Fahkwang'] text-sm font-bold text-[#1A1207]">{cp.name}</div>
                        <div className="font-['Sarabun'] text-xs text-[#1A1207]/45">{cp.subtitle}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Stamp teaser */}
            <div className="mt-8">
              <h3 className="font-['Fahkwang'] text-base font-bold text-[#1A1207] mb-4">{t.summary.stamps_collected}</h3>
              <div className="flex gap-3 flex-wrap">
                {checkpoints.map((cp, i) => (
                  <HexStamp
                    key={cp.id}
                    collected={completedCheckpoints[i]}
                    color={stampColors[i]}
                    label={cp.name}
                    size="small"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 flex justify-center">
          <PrimaryButton onClick={() => navigate("/stamps")} className="px-10 py-4 text-base flex items-center gap-2">
            {t.stamps.title} <ArrowRight size={18} />
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
}
