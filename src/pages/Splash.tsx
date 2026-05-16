import { useNavigate } from "react-router";
import { ArrowRight } from "lucide-react";
import { CanalIllustration, PrimaryButton, SecondaryButton } from "@/components/ui";
import { useAppState, useAppDispatch } from "@/app/store";
import { useT } from "@/app/hooks/useT";

export function Splash() {
  const navigate = useNavigate();
  const { lang } = useAppState();
  const dispatch = useAppDispatch();
  const t = useT();

  return (
    <div className="min-h-screen w-full bg-[#FFFDF5] flex flex-col lg:flex-row overflow-hidden">
      {/* Illustration — left 55% on desktop, top 45vh on mobile */}
      <div className="w-full lg:w-[55%] h-[45vh] lg:h-screen bg-[#FFF1D0] relative overflow-hidden flex-shrink-0 border-b-2 lg:border-b-0 lg:border-r-2 border-[#1A1207]">
        <CanalIllustration />
        <div className="absolute top-5 left-5 hidden lg:block">
          <div
            className="font-['Fahkwang'] text-2xl font-bold text-[#E8340A] bg-[#FFFDF5] border-2 border-[#1A1207] px-4 py-2 rounded-full"
            style={{ boxShadow: "3px 3px 0 #1A1207" }}
          >
            Routtery
          </div>
        </div>
        {/* Mode badges */}
        <div className="absolute bottom-4 right-4 flex gap-2">
          {[
            { emoji: "🚶", color: "#00A878" },
            { emoji: "🚲", color: "#7B2FBE" },
            { emoji: "⛵", color: "#0057B8" },
          ].map((m, i) => (
            <span
              key={i}
              className="text-base bg-white border-2 border-[#1A1207] rounded-full w-9 h-9 flex items-center justify-center"
              style={{ boxShadow: "2px 2px 0 #1A1207" }}
            >
              {m.emoji}
            </span>
          ))}
        </div>
        {/* Canal label */}
        <div className="absolute bottom-4 left-4">
          <span
            className="font-['Sarabun'] text-xs text-[#1A1207] bg-[#F5A800] border-2 border-[#1A1207] px-3 py-1.5 rounded-full"
            style={{ boxShadow: "2px 2px 0 #1A1207" }}
          >
            {t.splash.canal_label}
          </span>
        </div>
      </div>

      {/* Content panel — right 45% on desktop, overlapping card on mobile */}
      <div className="w-full lg:w-[45%] flex items-center justify-center px-6 md:px-12 py-10 lg:py-0 bg-[#FFFDF5] relative -mt-8 lg:mt-0 rounded-t-3xl lg:rounded-none border-t-2 lg:border-t-0 border-[#1A1207]">
        <div className="max-w-md w-full">
          <p className="font-['Sarabun'] text-xs text-[#1A1207]/45 uppercase tracking-widest mb-4">
            {t.splash.tagline}
          </p>
          <h1 className="font-['Fahkwang'] text-5xl md:text-[56px] font-bold text-[#1A1207] leading-[1.05] mb-3">
            Routtery
          </h1>
          <div className="w-16 h-1.5 bg-[#E8340A] rounded-full mb-5" style={{ boxShadow: "2px 2px 0 #1A1207" }} />
          <p className="font-['Sarabun'] text-lg text-[#1A1207]/75 mb-2 leading-relaxed" style={{ whiteSpace: "pre-line" }}>
            {t.splash.subtitle_th}
          </p>
          <p className="font-['Sarabun'] text-sm text-[#1A1207]/40 mb-10">
            {t.splash.subtitle_en}
          </p>

          <div className="flex flex-col sm:flex-row gap-3 mb-8">
            <PrimaryButton
              onClick={() => navigate("/plan")}
              className="text-base px-8 py-4 flex items-center justify-center gap-2 flex-1 sm:flex-none"
            >
              {t.splash.start} <ArrowRight size={18} />
            </PrimaryButton>
            <SecondaryButton className="text-sm flex-1 sm:flex-none text-center">
              {t.splash.learn_more}
            </SecondaryButton>
          </div>

          <button
            onClick={() => dispatch({ type: "SET_LANG", lang: lang === "TH" ? "EN" : "TH" })}
            className="font-['Fahkwang'] text-sm text-[#1A1207]/50 border border-[#E2D5B0] px-4 py-2 rounded-full hover:bg-[#F5F0E0] transition-colors"
          >
            {lang === "TH" ? "TH → EN" : "EN → TH"}
          </button>
        </div>
      </div>
    </div>
  );
}
