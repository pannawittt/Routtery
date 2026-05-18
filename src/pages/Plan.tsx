import { useState } from "react";
import { useNavigate } from "react-router";
import { MapPin, ArrowRight, ChevronDown } from "lucide-react";
import { PrimaryButton } from "@/components/ui";
import { useAppDispatch } from "@/app/store";
import { checkpoints as cpData, modeConfig, type Mode } from "@/data/constants";
import { useT } from "@/app/hooks/useT";

export function Plan() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const t = useT();
  const [originId, setOriginId] = useState<number | null>(null);
  const [mode, setMode] = useState<Mode | null>(null);

  const canProceed = originId !== null && mode !== null;

  const handleSubmit = () => {
    if (!canProceed || !mode || originId === null) return;
    dispatch({ type: "SET_PLAN", originCheckpointId: originId, destinationCheckpointId: null, checkpoints: [] });
    dispatch({ type: "SET_MODE", mode: mode });
    navigate("/explore");
  };

  const modeLabel = (key: Mode) =>
    key === "walk" ? t.modes.walk : key === "bike" ? t.modes.bike : t.modes.boat;

  return (
    <div className="min-h-screen w-full bg-[#FFFDF5]">
      <div className="max-w-[640px] mx-auto px-6 py-10">
        <h2 className="font-['Fahkwang'] text-3xl md:text-4xl font-bold text-[#1A1207] mb-1">{t.plan.title}</h2>
        <p className="font-['Sarabun'] text-[#1A1207]/55 mb-8 text-sm">{t.plan.subtitle}</p>

        {/* Origin — required */}
        <div className="mb-8">
          <label className="font-['Fahkwang'] text-sm text-[#E8340A] mb-2 block">
            {t.plan.origin_label} <span className="text-[#E8340A]">*</span>
          </label>
          <div className="relative">
            <MapPin size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#1A1207]/40 pointer-events-none z-10" />
            <select
              value={originId ?? ""}
              onChange={e => setOriginId(e.target.value ? Number(e.target.value) : null)}
              className="w-full pl-10 pr-10 py-4 font-['Sarabun'] border-2 border-[#1A1207] rounded-full bg-white focus:outline-none focus:ring-2 focus:ring-[#E8340A]/30 text-[#1A1207] appearance-none cursor-pointer"
              style={{ boxShadow: "3px 3px 0 #1A1207" }}
            >
              <option value="" className="text-[#1A1207]/30">{t.plan.origin_placeholder}</option>
              {cpData.map(cp => (
                <option key={cp.id} value={cp.id}>
                  {cp.name} — {cp.subtitle}
                </option>
              ))}
            </select>
            <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#1A1207]/40 pointer-events-none" />
          </div>
          {originId === null && (
            <p className="font-['Sarabun'] text-xs text-[#E8340A]/70 mt-2 ml-4">{t.plan.origin_required}</p>
          )}
        </div>

        {/* Mode Selection — required */}
        <div className="mb-8">
          <label className="font-['Fahkwang'] text-sm text-[#E8340A] mb-3 block">
            {t.mode.title} <span className="text-[#E8340A]">*</span>
          </label>
          <div className="space-y-3">
            {(Object.entries(modeConfig) as [Mode, typeof modeConfig[Mode]][]).map(([key, m]) => (
              <button
                key={key}
                onClick={() => setMode(key)}
                disabled={originId === 0 && key === "boat"}
                className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all ${
                  originId === 0 && key === "boat"
                    ? "border-[#E2D5B0] bg-gray-100 text-[#1A1207]/30 cursor-not-allowed"
                    : mode === key
                    ? "border-[#1A1207] text-white"
                    : "border-[#E2D5B0] bg-white text-[#1A1207] hover:border-[#1A1207]"
                }`}
                style={mode === key ? { backgroundColor: m.color, boxShadow: "3px 3px 0 #1A1207" } : {}}
              >
                <span className="text-2xl">{m.emoji}</span>
                <span className="font-['Fahkwang'] text-base font-bold flex-1 text-left">{modeLabel(key)}</span>
                <div className="w-3 h-3 rounded-full border-2 border-[#1A1207]" style={{ backgroundColor: mode === key ? "#fff" : m.color }} />
              </button>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-10 pb-4">
          <PrimaryButton
            onClick={handleSubmit}
            disabled={!canProceed}
            className="w-full text-base py-4 flex items-center justify-center gap-2"
          >
            {t.mode.start} <ArrowRight size={18} />
          </PrimaryButton>
          {!canProceed && (
            <p className="font-['Sarabun'] text-center text-xs text-[#1A1207]/40 mt-3">
              {originId === null ? t.plan.fill_origin : t.mode.pick_first}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
