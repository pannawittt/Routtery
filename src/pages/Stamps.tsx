import { useState } from "react";
import { Check } from "lucide-react";
import { Card, HexStamp } from "@/components/ui";
import { useAppState } from "@/app/store";
import { checkpoints } from "@/data/constants";
import { useT } from "@/app/hooks/useT";

const stampColors = ["#E8340A", "#F5A800", "#00A878", "#0057B8", "#7B2FBE", "#E8340A"];
const stampDates = ["15 พ.ค. 2567", "15 พ.ค. 2567", "15 พ.ค. 2567", "15 พ.ค. 2567", "", ""];

export function Stamps() {
  const { completedCheckpoints } = useAppState();
  const t = useT();
  const [selected, setSelected] = useState<number>(0);
  const [sheetOpen, setSheetOpen] = useState(false);

  const stamps = checkpoints.map((cp, i) => ({
    ...cp,
    collected: completedCheckpoints[i],
    color: stampColors[i],
    date: stampDates[i],
  }));

  const sel = stamps[selected];
  const collectedCount = stamps.filter(s => s.collected).length;

  const handleSelect = (i: number) => {
    setSelected(i);
    setSheetOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#FFFDF5]">
      <div className="max-w-[960px] mx-auto px-4 md:px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="font-['Fahkwang'] text-3xl font-bold text-[#1A1207]">{t.stamps.title}</h2>
            <p className="font-['Sarabun'] text-[#1A1207]/55 mt-1 text-sm">
              {t.stamps.collected} {collectedCount} / {stamps.length} {t.stamps.of_stamps}
            </p>
          </div>
          {/* Progress bar */}
          <div className="hidden md:block w-40">
            <div className="w-full bg-[#E2D5B0] rounded-full h-2.5 border border-[#1A1207]/20">
              <div
                className="bg-[#E8340A] h-2.5 rounded-full transition-all"
                style={{ width: `${(collectedCount / stamps.length) * 100}%` }}
              />
            </div>
            <div className="font-['Sarabun'] text-xs text-[#1A1207]/45 mt-1 text-right">{Math.round((collectedCount / stamps.length) * 100)}%</div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Stamp grid — 3 columns */}
          <div className="flex-1">
            <div className="grid grid-cols-3 gap-4 md:gap-6 justify-items-center">
              {stamps.map((stamp, i) => (
                <button
                  key={stamp.id}
                  onClick={() => handleSelect(i)}
                  className={`focus:outline-none transition-transform duration-200 ${selected === i ? "scale-110" : "hover:scale-105"}`}
                >
                  <HexStamp
                    collected={stamp.collected}
                    color={stamp.color}
                    label={stamp.name}
                  />
                </button>
              ))}
            </div>
            <p className="font-['Sarabun'] text-xs text-center text-[#1A1207]/35 mt-6">
              {t.stamps.collected_on === "สะสมเมื่อ" ? "แตะตราประทับเพื่อดูรายละเอียด" : "Tap a stamp to view details"}
            </p>
          </div>

          {/* Detail panel — desktop */}
          <div className="hidden md:block w-72 flex-shrink-0">
            <Card className="p-6 sticky top-20">
              <div
                className="w-14 h-14 rounded-2xl border-2 border-[#1A1207] flex items-center justify-center text-2xl mb-4"
                style={{
                  backgroundColor: sel.collected ? sel.color : "#F0EDE0",
                  boxShadow: "3px 3px 0 #1A1207",
                }}
              >
                {sel.collected ? "✓" : "?"}
              </div>
              <h3 className="font-['Fahkwang'] text-xl font-bold text-[#1A1207] mb-1">{sel.name}</h3>
              <p className="font-['Sarabun'] text-xs text-[#1A1207]/45 mb-3">{sel.subtitle}</p>
              {sel.collected ? (
                <>
                  {sel.date && (
                    <div className="font-['Sarabun'] text-xs text-[#1A1207]/40 mb-3">{t.stamps.collected_on} {sel.date}</div>
                  )}
                  <p className="font-['Sarabun'] text-sm text-[#1A1207]/70 leading-relaxed">{sel.story}</p>
                  <div className="mt-5 pt-4 border-t border-[#E2D5B0]">
                    <div className="font-['Fahkwang'] text-sm text-[#00A878] flex items-center gap-1.5">
                      <Check size={14} /> {t.stamps.collected}
                    </div>
                  </div>
                </>
              ) : (
                <p className="font-['Sarabun'] text-sm text-[#1A1207]/35 leading-relaxed">
                  {t.stamps.locked}<br />
                  <span className="text-xs">{t.stamps.explore_hint}</span>
                </p>
              )}
            </Card>
          </div>
        </div>
      </div>

      {/* Mobile bottom sheet */}
      {sheetOpen && (
        <div className="md:hidden fixed inset-0 z-[200] flex items-end">
          <div className="absolute inset-0 bg-[#1A1207]/40" onClick={() => setSheetOpen(false)} />
          <div
            className="relative w-full bg-[#FFFDF5] border-t-2 border-[#1A1207] rounded-t-3xl p-6 z-10"
            style={{ boxShadow: "0 -6px 0 #1A1207" }}
          >
            <div className="w-10 h-1 bg-[#E2D5B0] rounded-full mx-auto mb-5" />
            <div className="flex items-center gap-4 mb-4">
              <div
                className="w-12 h-12 rounded-xl border-2 border-[#1A1207] flex items-center justify-center text-2xl flex-shrink-0"
                style={{ backgroundColor: sel.collected ? sel.color : "#F0EDE0", boxShadow: "2px 2px 0 #1A1207" }}
              >
                {sel.collected ? "✓" : "?"}
              </div>
              <div>
                <h3 className="font-['Fahkwang'] text-lg font-bold text-[#1A1207]">{sel.name}</h3>
                <p className="font-['Sarabun'] text-xs text-[#1A1207]/45">{sel.subtitle}</p>
              </div>
            </div>
            {sel.collected ? (
              <>
                {sel.date && <p className="font-['Sarabun'] text-xs text-[#1A1207]/40 mb-2">{t.stamps.collected_on} {sel.date}</p>}
                <p className="font-['Sarabun'] text-sm text-[#1A1207]/70 leading-relaxed">{sel.teaser}</p>
                <div className="mt-4 font-['Fahkwang'] text-sm text-[#00A878] flex items-center gap-1.5">
                  <Check size={13} /> {t.stamps.collected}
                </div>
              </>
            ) : (
              <p className="font-['Sarabun'] text-sm text-[#1A1207]/40">{t.stamps.locked}</p>
            )}
            <button
              onClick={() => setSheetOpen(false)}
              className="mt-6 w-full font-['Sarabun'] text-sm text-[#1A1207]/50 py-3 border-t border-[#E2D5B0]"
            >
              ปิด
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
