import image_logo_2 from '@/imports/logo-2.png'
import image_logo from '@/imports/logo.png'
import { useState } from "react";
import { Link, NavLink, Outlet, useLocation, useNavigate } from "react-router";
import { Menu, X, Map, Navigation, Ticket, BookOpen } from "lucide-react";
import { useAppState, useAppDispatch } from "./store";
import { modeConfig, type Mode } from "@/data/constants";
import { useT } from "@/app/hooks/useT";

function ChangeModeDialog({ onClose }: { onClose: () => void }) {
  const { mode } = useAppState();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const t = useT();

  const handleSelect = (m: Mode) => {
    dispatch({ type: "SET_MODE", mode: m });
    onClose();
    navigate("/explore");
  };

  const modeLabel = (key: Mode) =>
    key === "walk" ? t.modes.walk : key === "bike" ? t.modes.bike : t.modes.boat;

  return (
    <div className="fixed inset-0 z-[300] flex items-end md:items-center justify-center">
      <div className="absolute inset-0 bg-[#1A1207]/60 backdrop-blur-sm" onClick={onClose} />
      <div
        className="relative w-full md:max-w-[480px] md:mx-auto bg-[#FFFDF5] border-t-2 md:border-2 border-[#1A1207] md:rounded-[24px] p-6 z-10"
        style={{ boxShadow: "0 -6px 0 #1A1207" }}
      >
        <div className="w-10 h-1 bg-[#E2D5B0] rounded-full mx-auto mb-5 md:hidden" />
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-['Fahkwang'] text-xl font-bold text-[#1A1207]">{t.nav.change_mode}</h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full border-2 border-[#1A1207] flex items-center justify-center bg-white"
            style={{ boxShadow: "2px 2px 0 #1A1207" }}
          >
            <X size={15} />
          </button>
        </div>
        {mode && (
          <div className="mb-5 p-4 rounded-2xl border-2 border-[#E2D5B0] bg-white/60">
            <p className="font-['Sarabun'] text-xs text-[#1A1207]/45 mb-1.5">{t.nav.current_mode}</p>
            <div className="flex items-center gap-3">
              <span className="text-3xl">{modeConfig[mode].emoji}</span>
              <span className="font-['Fahkwang'] text-lg font-bold text-[#1A1207]">{modeLabel(mode)}</span>
              <div className="ml-auto w-3 h-3 rounded-full border-2 border-[#1A1207]" style={{ backgroundColor: modeConfig[mode].color }} />
            </div>
          </div>
        )}
        <div className="space-y-3 mb-5">
          {(Object.entries(modeConfig) as [Mode, typeof modeConfig[Mode]][]).map(([key, m]) => (
            <button
              key={key}
              onClick={() => handleSelect(key)}
              disabled={key === mode}
              className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all ${key === mode ? "border-[#E2D5B0] bg-white/40 opacity-50 cursor-default" : "border-[#1A1207] bg-white hover:bg-[#FFFDF5] active:translate-x-[1px] active:translate-y-[1px]"}`}
              style={key !== mode ? { boxShadow: "3px 3px 0 #1A1207" } : {}}
            >
              <span className="text-2xl">{m.emoji}</span>
              <span className="font-['Fahkwang'] text-base font-bold text-[#1A1207] flex-1 text-left">{modeLabel(key as Mode)}</span>
              <div className="w-3 h-3 rounded-full border-2 border-[#1A1207]" style={{ backgroundColor: m.color }} />
            </button>
          ))}
        </div>
        <button onClick={onClose} className="w-full font-['Sarabun'] text-sm text-[#1A1207]/40 hover:text-[#1A1207] py-2 transition-colors">
          {t.nav.cancel}
        </button>
      </div>
    </div>
  );
}

export function Root() {
  const location = useLocation();
  const { lang, mode } = useAppState();
  const dispatch = useAppDispatch();
  const t = useT();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [modeDialogOpen, setModeDialogOpen] = useState(false);

  const isSplash = location.pathname === "/";
  const isExplore = location.pathname === "/explore";

  const pageTitles: Record<string, string> = {
    "/": "",
    "/plan": t.nav.title_plan,
    "/mode": t.nav.title_mode,
    "/map": t.nav.title_map,
    "/explore": t.nav.title_explore,
    "/lottery": t.nav.title_lottery,
    "/lottery/active": t.nav.title_lottery_active,
    "/summary": t.nav.title_summary,
    "/stamps": t.nav.title_stamps,
  };

  const drawerLinks = [
    { href: "/", label: "🏠 " + (lang === "TH" ? "หน้าหลัก" : "Home") },
    { href: "/plan", label: "🗺️ " + t.nav.title_plan },
    { href: "/map", label: "📍 " + t.nav.map },
    { href: "/explore", label: "🧭 " + t.nav.explore },
    { href: "/lottery", label: "🎲 " + t.nav.lottery },
    { href: "/stamps", label: "📖 " + t.nav.stamps },
  ];

  const bottomTabs = [
    { href: "/map", label: t.nav.map, icon: Map, match: ["/map"] },
    { href: "/explore", label: t.nav.explore, icon: Navigation, match: ["/explore", "/mode", "/plan"] },
    { href: "/lottery", label: t.nav.lottery, icon: Ticket, match: ["/lottery", "/lottery/active"] },
    { href: "/stamps", label: t.nav.stamps, icon: BookOpen, match: ["/stamps"] },
  ];

  const modeLabel = (key: Mode) =>
    key === "walk" ? t.modes.walk : key === "bike" ? t.modes.bike : t.modes.boat;

  const title = pageTitles[location.pathname] ?? "";

  return (
    <div className="min-h-screen bg-[#FFFDF5]">
      {/* Top nav — hidden on splash */}
      {!isSplash && (
        <header className="fixed top-0 left-0 right-0 z-[100] bg-[#FFFDF5] border-b-2 border-[#E2D5B0] h-14 flex items-center justify-center px-4 md:px-6 relative">
          <Link to="/" className="flex-shrink-0">
            <img src={image_logo_2} alt="Routtery" className="h-8" />
          </Link>

          {/* Right side controls — absolute positioned */}
          <div className="absolute right-4 md:right-6 flex items-center gap-2">
            {/* TH|EN toggle */}
            <button
              onClick={() => dispatch({ type: "SET_LANG", lang: lang === "TH" ? "EN" : "TH" })}
              className="font-['Fahkwang'] text-xs border-2 border-[#1A1207] px-3 py-1 rounded-full bg-white text-[#1A1207] hidden md:flex"
              style={{ boxShadow: "2px 2px 0 #1A1207" }}
            >
              {lang === "TH" ? "TH → EN" : "EN → TH"}
            </button>

            {/* Mode chip — only on /explore */}
            {isExplore && mode && (
              <button
                onClick={() => setModeDialogOpen(true)}
                className="text-xs border-2 border-[#1A1207] px-3 py-1 rounded-full text-white font-['Fahkwang'] flex items-center gap-1"
                style={{ backgroundColor: modeConfig[mode].color, boxShadow: "2px 2px 0 #1A1207" }}
              >
                {modeConfig[mode].emoji} {modeLabel(mode)}
              </button>
            )}
          </div>
        </header>
      )}

      {/* Mobile Drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-[200] flex md:hidden">
          <div className="absolute inset-0 bg-[#1A1207]/50" onClick={() => setDrawerOpen(false)} />
          <div className="relative w-72 bg-[#FFFDF5] border-r-2 border-[#1A1207] h-full flex flex-col p-6 z-10" style={{ boxShadow: "6px 0 0 #1A1207" }}>
            <div className="flex items-center justify-between mb-8">
              <img src="/src/imports/logo.png" alt="Routtery" className="h-7" />
              <button onClick={() => setDrawerOpen(false)} className="w-8 h-8 border-2 border-[#1A1207] rounded-full flex items-center justify-center">
                <X size={15} />
              </button>
            </div>
            <div className="space-y-2">
              {drawerLinks.map(l => (
                <Link
                  key={l.href}
                  to={l.href}
                  onClick={() => setDrawerOpen(false)}
                  className="block font-['Sarabun'] text-base font-medium text-[#1A1207] p-3 rounded-xl hover:bg-[#F5A800]/15 transition-colors"
                >
                  {l.label}
                </Link>
              ))}
            </div>
            <div className="mt-auto">
              <button
                onClick={() => { dispatch({ type: "SET_LANG", lang: lang === "TH" ? "EN" : "TH" }); }}
                className="w-full font-['Fahkwang'] text-sm border-2 border-[#1A1207] px-4 py-2.5 rounded-full text-[#1A1207] bg-white"
                style={{ boxShadow: "2px 2px 0 #1A1207" }}
              >
                {lang === "TH" ? "TH → EN" : "EN → TH"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Page content */}
      <main className="pb-24 md:pb-0">
        <Outlet />
      </main>

      {/* Bottom nav — floating pill, mobile only, hidden on splash */}
      {!isSplash && (
        <nav className="fixed bottom-4 left-4 right-4 z-[100] md:hidden">
          <div
            className="flex items-center bg-[#1A1207] rounded-[28px] px-2 py-2"
            style={{ boxShadow: "0 8px 32px rgba(26,18,7,0.28), 0 2px 8px rgba(26,18,7,0.18)" }}
          >
            {bottomTabs.map(tab => {
              const isActive = tab.match.includes(location.pathname);
              const Icon = tab.icon;
              return (
                <NavLink
                  key={tab.href}
                  to={tab.href}
                  className="flex-1 flex items-center justify-center"
                >
                  <div
                    className="flex items-center gap-2 px-3 py-2 rounded-[20px] transition-all duration-200"
                    style={isActive ? { backgroundColor: "#E8340A" } : {}}
                  >
                    <Icon
                      size={20}
                      className="flex-shrink-0 transition-transform duration-200"
                      style={{
                        color: isActive ? "#fff" : "rgba(255,253,245,0.4)",
                        transform: isActive ? "scale(1.1)" : "scale(1)",
                      }}
                    />
                    {isActive && (
                      <span className="font-['Fahkwang'] text-[11px] text-white whitespace-nowrap leading-none">
                        {tab.label}
                      </span>
                    )}
                  </div>
                </NavLink>
              );
            })}
          </div>
        </nav>
      )}

      {/* Change mode dialog */}
      {modeDialogOpen && <ChangeModeDialog onClose={() => setModeDialogOpen(false)} />}
    </div>
  );
}
