import { useState } from "react";
import { useNavigate } from "react-router";
import { Search, MapPin, ArrowRight, Check } from "lucide-react";
import { PrimaryButton } from "@/components/ui";
import { useAppDispatch } from "@/app/store";
import { checkpoints as cpData } from "@/data/constants";
import { useT } from "@/app/hooks/useT";

export function Plan() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const t = useT();
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [selected, setSelected] = useState<string[]>([]);

  const toggleCp = (id: string) =>
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  const canProceed = origin.trim().length > 0;

  const handleSubmit = () => {
    if (!canProceed) return;
    dispatch({ type: "SET_PLAN", origin: origin.trim(), destination: destination.trim(), checkpoints: selected });
    navigate("/mode");
  };

  return (
    <div className="min-h-screen w-full bg-[#FFFDF5]">
      <div className="max-w-[640px] mx-auto px-6 py-10">
        <h2 className="font-['Fahkwang'] text-3xl md:text-4xl font-bold text-[#1A1207] mb-1">{t.plan.title}</h2>
        <p className="font-['Sarabun'] text-[#1A1207]/55 mb-8 text-sm">{t.plan.subtitle}</p>

        {/* Origin — required */}
        <div className="mb-5">
          <label className="font-['Fahkwang'] text-sm text-[#E8340A] mb-2 block">
            {t.plan.origin_label} <span className="text-[#E8340A]">*</span>
          </label>
          <div className="relative">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#1A1207]/40 pointer-events-none" />
            <input
              value={origin}
              onChange={e => setOrigin(e.target.value)}
              placeholder={t.plan.origin_placeholder}
              className="w-full pl-10 pr-4 py-4 font-['Sarabun'] border-2 border-[#1A1207] rounded-full bg-white focus:outline-none focus:ring-2 focus:ring-[#E8340A]/30 text-[#1A1207] placeholder:text-[#1A1207]/30"
              style={{ boxShadow: "3px 3px 0 #1A1207" }}
            />
          </div>
          {!origin && (
            <p className="font-['Sarabun'] text-xs text-[#E8340A]/70 mt-2 ml-4">{t.plan.origin_required}</p>
          )}
        </div>

        {/* Destination — optional */}
        <div className="mb-8">
          <label className="font-['Fahkwang'] text-sm text-[#1A1207]/50 mb-2 block">
            {t.plan.dest_label} <span className="text-[#1A1207]/30">{t.plan.dest_optional}</span>
          </label>
          <div className="relative">
            <MapPin size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#1A1207]/30 pointer-events-none" />
            <input
              value={destination}
              onChange={e => setDestination(e.target.value)}
              placeholder={t.plan.dest_placeholder}
              className="w-full pl-10 pr-4 py-4 font-['Sarabun'] border-2 border-[#E2D5B0] rounded-full bg-white/80 focus:outline-none focus:border-[#1A1207] text-[#1A1207] placeholder:text-[#1A1207]/25"
            />
          </div>
          <div className="flex gap-2 mt-3 flex-wrap">
            {["เทเวศร์", "หัวลำโพง", "ตลาดน้อย"].map(s => (
              <button
                key={s}
                onClick={() => setDestination(s)}
                className="font-['Sarabun'] text-xs border border-[#E2D5B0] rounded-full px-3 py-1.5 bg-white text-[#1A1207]/60 hover:border-[#1A1207] transition-colors"
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Checkpoints */}
        <h3 className="font-['Fahkwang'] text-lg font-semibold text-[#1A1207] mb-3">{t.plan.checkpoints_title}</h3>
        <p className="font-['Sarabun'] text-xs text-[#1A1207]/45 mb-4">{t.plan.checkpoints_hint}</p>
        <div className="grid grid-cols-2 gap-3">
          {cpData.map(cp => {
            const isOn = selected.includes(cp.name);
            return (
              <button
                key={cp.id}
                onClick={() => toggleCp(cp.name)}
                className={`flex items-center gap-3 p-4 rounded-2xl border-2 text-left transition-all ${
                  isOn
                    ? "bg-[#E8340A] border-[#1A1207] text-white"
                    : "bg-white border-[#E2D5B0] text-[#1A1207] hover:border-[#1A1207]"
                }`}
                style={isOn ? { boxShadow: "3px 3px 0 #1A1207" } : {}}
              >
                <span className="text-xl flex-shrink-0">{cp.subtitle.split(" ")[0]}</span>
                <span className="font-['Sarabun'] text-sm font-medium leading-tight">{cp.name}</span>
                {isOn && <Check size={13} className="ml-auto flex-shrink-0" strokeWidth={3} />}
              </button>
            );
          })}
        </div>

        {/* CTA */}
        <div className="mt-10 pb-4">
          <PrimaryButton
            onClick={handleSubmit}
            disabled={!canProceed}
            className="w-full text-base py-4 flex items-center justify-center gap-2"
          >
            {t.plan.next} <ArrowRight size={18} />
          </PrimaryButton>
          {!canProceed && (
            <p className="font-['Sarabun'] text-center text-xs text-[#1A1207]/40 mt-3">{t.plan.fill_origin}</p>
          )}
        </div>
      </div>
    </div>
  );
}
