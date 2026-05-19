import { useNavigate } from "react-router";
import { Clock, ArrowRight, Check } from "lucide-react";
import { Card, PrimaryButton } from "@/components/ui";
import { useAppState, useAppDispatch } from "@/app/store";
import { modeConfig, type Mode } from "@/data/constants";
import { useT } from "@/app/hooks/useT";

export function SelectMode() {
  const navigate = useNavigate();
  const { mode } = useAppState();
  const dispatch = useAppDispatch();
  const t = useT();

  const select = (m: Mode) => dispatch({ type: "SET_MODE", mode: m });

  const modeCards: Array<{ key: Mode; time: string; desc: string; audioGuide?: boolean }> = [
    { key: "walk", time: t.mode.walk_time, desc: t.mode.walk_desc },
    { key: "bike", time: t.mode.bike_time, desc: t.mode.bike_desc },
    { key: "boat", time: t.mode.boat_time, desc: t.mode.boat_desc, audioGuide: true },
  ];

  const modeLabel = (key: Mode) =>
    key === "walk" ? t.modes.walk : key === "bike" ? t.modes.bike : t.modes.boat;

  return (
    <div className="min-h-screen w-full bg-[#FFFDF5]">
      <div className="max-w-[960px] mx-auto px-6 py-10">
        <div className="text-center mb-10">
          <h2 className="font-['Anuphan'] text-3xl md:text-4xl font-bold text-[#1A1207] mb-2">{t.mode.title}</h2>
          <p className="font-['Bai_Jamjuree'] text-[#1A1207]/55 text-sm">{t.mode.subtitle}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {modeCards.map(m => {
            const cfg = modeConfig[m.key];
            const isSelected = mode === m.key;
            return (
              <div key={m.key} onClick={() => select(m.key)} className="cursor-pointer group">
                <Card
                  className="p-6 relative overflow-hidden transition-transform duration-200 group-hover:-translate-y-1"
                  style={{
                    borderTop: `4px solid ${cfg.color}`,
                    boxShadow: isSelected ? `6px 6px 0 ${cfg.color}` : "4px 4px 0 #1A1207",
                    borderColor: isSelected ? cfg.color : "#1A1207",
                  }}
                >
                  {isSelected && (
                    <div className="absolute top-4 right-4 w-7 h-7 rounded-full border-2 border-[#1A1207] flex items-center justify-center text-white" style={{ backgroundColor: cfg.color, boxShadow: "2px 2px 0 #1A1207" }}>
                      <Check size={14} strokeWidth={3} />
                    </div>
                  )}
                  {m.audioGuide && !isSelected && (
                    <div className="absolute top-4 right-4 bg-[#0057B8] text-white font-['Anuphan'] text-[10px] px-2 py-0.5 rounded-full border border-[#1A1207]">
                      🎧 Audio
                    </div>
                  )}
                  <div className="text-5xl mb-5">{cfg.emoji}</div>
                  <h3 className="font-['Anuphan'] text-2xl font-bold text-[#1A1207] mb-2">{modeLabel(m.key)}</h3>
                  <div className="flex items-center gap-2 mb-4">
                    <Clock size={13} className="text-[#1A1207]/40" />
                    <span className="font-['Bai_Jamjuree'] text-sm text-[#1A1207]/55">{m.time}</span>
                  </div>
                  <p className="font-['Bai_Jamjuree'] text-sm text-[#1A1207]/70 leading-relaxed mb-5">{m.desc}</p>
                  <div className="pt-4 border-t-2 border-[#E2D5B0]">
                    <div
                      className="w-full font-['Anuphan'] text-sm py-2.5 rounded-full border-2 border-[#1A1207] text-white text-center"
                      style={{ backgroundColor: isSelected ? cfg.color : `${cfg.color}CC`, boxShadow: "2px 2px 0 #1A1207" }}
                    >
                      {isSelected ? t.mode.selected : t.mode.select}
                    </div>
                  </div>
                </Card>
              </div>
            );
          })}
        </div>

        <div className="flex justify-center">
          <PrimaryButton onClick={() => navigate("/explore")} disabled={!mode} className="px-10 py-4 text-base flex items-center gap-2">
            {t.mode.start} <ArrowRight size={18} />
          </PrimaryButton>
        </div>
        {!mode && (
          <p className="font-['Bai_Jamjuree'] text-center text-xs text-[#1A1207]/40 mt-3">{t.mode.pick_first}</p>
        )}
      </div>
    </div>
  );
}
