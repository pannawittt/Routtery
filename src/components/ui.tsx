import type { ReactNode, CSSProperties } from "react";

// ─── CARD ─────────────────────────────────────────────────────────────────────

export function Card({ children, className = "", style = {}, onClick }: {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  onClick?: () => void;
}) {
  return (
    <div
      className={`bg-white rounded-[20px] border-2 border-[#1A1207] ${onClick ? "cursor-pointer" : ""} ${className}`}
      style={{ boxShadow: "4px 4px 0 #1A1207", ...style }}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

// ─── BUTTONS ──────────────────────────────────────────────────────────────────

export function PrimaryButton({ children, onClick, className = "", disabled = false, type = "button" }: {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  type?: "button" | "submit";
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`bg-[#E8340A] text-white font-['Fahkwang'] border-2 border-[#1A1207] px-6 py-3 rounded-full transition-all active:translate-x-[2px] active:translate-y-[2px] disabled:opacity-40 disabled:cursor-not-allowed disabled:active:translate-x-0 disabled:active:translate-y-0 ${className}`}
      style={{ boxShadow: "4px 4px 0 #1A1207" }}
    >
      {children}
    </button>
  );
}

export function SecondaryButton({ children, onClick, className = "" }: {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`font-['Fahkwang'] border-2 border-[#1A1207] px-6 py-3 rounded-full bg-white text-[#1A1207] transition-all active:translate-x-[2px] active:translate-y-[2px] hover:bg-[#FFFDF5] ${className}`}
      style={{ boxShadow: "3px 3px 0 #1A1207" }}
    >
      {children}
    </button>
  );
}

export function YellowButton({ children, onClick, className = "" }: {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`font-['Fahkwang'] bg-[#F5A800] text-[#1A1207] border-2 border-[#1A1207] px-6 py-3 rounded-full transition-all active:translate-x-[2px] active:translate-y-[2px] ${className}`}
      style={{ boxShadow: "4px 4px 0 #1A1207" }}
    >
      {children}
    </button>
  );
}

// ─── PROGRESS DOTS ────────────────────────────────────────────────────────────

export function ProgressDots({ total, current, color }: { total: number; current: number; color: string }) {
  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className="rounded-full border-2 border-[#1A1207] transition-all duration-300"
          style={{
            width: i === current ? 28 : 10,
            height: 10,
            backgroundColor: i <= current ? color : "#F0EDE0",
          }}
        />
      ))}
    </div>
  );
}

// ─── HEX STAMP ────────────────────────────────────────────────────────────────

export function HexStamp({ collected, color, label, size = "normal" }: {
  collected: boolean;
  color?: string;
  label: string;
  size?: "normal" | "small";
}) {
  const pts = "50,4 96,27 96,73 50,96 4,73 4,27";
  return (
    <div className="flex flex-col items-center gap-1.5">
      <svg
        viewBox="0 0 100 100"
        className={size === "small" ? "w-[80px] h-[80px]" : "w-[100px] h-[100px] md:w-[130px] md:h-[130px]"}
        xmlns="http://www.w3.org/2000/svg"
      >
        <polygon
          points={pts}
          fill={collected ? (color ?? "#E8340A") : "#F0EDE0"}
          stroke="#1A1207"
          strokeWidth={collected ? "2.5" : "2"}
          strokeDasharray={collected ? undefined : "6 4"}
        />
        {collected ? (
          <text x="50" y="63" textAnchor="middle" fontSize="30" fontFamily="Fahkwang" fill="white" fontWeight="bold">✓</text>
        ) : (
          <text x="50" y="63" textAnchor="middle" fontSize="34" fontFamily="Fahkwang" fill="#1A1207" opacity="0.2">?</text>
        )}
      </svg>
      <span className={`font-['Fahkwang'] text-center leading-tight text-[#1A1207] ${size === "small" ? "text-[9px] w-[75px]" : "text-[10px] md:text-xs w-[90px] md:w-[120px]"}`}>
        {label}
      </span>
    </div>
  );
}

// ─── CANAL ILLUSTRATION ───────────────────────────────────────────────────────

export function CanalIllustration() {
  return (
    <svg viewBox="0 0 560 660" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
      <rect width="560" height="660" fill="#FFF1D0" />
      <circle cx="430" cy="110" r="65" fill="#F5A800" />
      <circle cx="430" cy="110" r="50" fill="#FFD24A" />
      {Array.from({ length: 8 }, (_, i) => {
        const a = (i * 45 * Math.PI) / 180;
        return <line key={i} x1={430 + 58 * Math.cos(a)} y1={110 + 58 * Math.sin(a)} x2={430 + 82 * Math.cos(a)} y2={110 + 82 * Math.sin(a)} stroke="#F5A800" strokeWidth="4" strokeLinecap="round" />;
      })}
      <ellipse cx="80" cy="85" rx="42" ry="24" fill="white" />
      <ellipse cx="112" cy="72" rx="36" ry="22" fill="white" />
      <ellipse cx="52" cy="78" rx="30" ry="20" fill="white" />
      <ellipse cx="280" cy="65" rx="52" ry="28" fill="white" />
      <ellipse cx="316" cy="52" rx="40" ry="23" fill="white" />
      <polygon points="195,390 212,210 229,390" fill="#E8340A" />
      <polygon points="206,248 212,205 218,248" fill="#F5A800" />
      <rect x="190" y="388" width="44" height="22" fill="#C8280A" />
      <rect x="184" y="408" width="56" height="32" fill="#E8340A" />
      <rect x="178" y="438" width="68" height="64" fill="#F5A800" />
      <rect x="185" y="448" width="14" height="32" fill="#1A1207" rx="3" />
      <rect x="207" y="448" width="14" height="32" fill="#1A1207" rx="3" />
      <rect x="229" y="448" width="14" height="32" fill="#1A1207" rx="3" />
      <polygon points="308,368 326,235 344,368" fill="#7B2FBE" />
      <polygon points="319,270 326,228 333,270" fill="#F5A800" />
      <rect x="304" y="366" width="44" height="20" fill="#5A1F9E" />
      <rect x="298" y="384" width="56" height="28" fill="#7B2FBE" />
      <rect x="288" y="410" width="76" height="82" fill="#F5A800" />
      <rect x="296" y="422" width="14" height="28" fill="#1A1207" rx="3" />
      <rect x="318" y="422" width="14" height="28" fill="#1A1207" rx="3" />
      <rect x="340" y="422" width="14" height="28" fill="#1A1207" rx="3" />
      <rect x="18" y="428" width="86" height="64" fill="#00A878" />
      <polygon points="8,428 61,370 114,428" fill="#E8340A" />
      <rect x="32" y="450" width="22" height="42" fill="#1A1207" />
      <rect x="64" y="448" width="22" height="28" fill="#FFF1D0" rx="3" />
      <rect x="416" y="404" width="104" height="82" fill="#F5A800" />
      <polygon points="406,404 468,344 530,404" fill="#E8340A" />
      <rect x="432" y="432" width="26" height="54" fill="#1A1207" />
      <rect x="468" y="430" width="32" height="32" fill="#FFFDF5" rx="3" />
      <rect x="92" y="440" width="10" height="52" fill="#5D3A1A" />
      <ellipse cx="97" cy="424" rx="24" ry="32" fill="#00A878" />
      <ellipse cx="97" cy="412" rx="16" ry="22" fill="#007A58" />
      <rect x="382" y="450" width="10" height="38" fill="#5D3A1A" />
      <ellipse cx="387" cy="436" rx="22" ry="28" fill="#00A878" />
      <rect x="0" y="488" width="560" height="10" fill="#C8B89A" />
      <rect x="0" y="484" width="560" height="6" fill="#E2D5B0" />
      <rect x="0" y="496" width="560" height="164" fill="#0057B8" />
      <rect x="0" y="496" width="560" height="6" fill="#4A90D8" opacity="0.5" />
      <ellipse cx="110" cy="522" rx="65" ry="9" fill="#0047A8" opacity="0.4" />
      <ellipse cx="360" cy="538" rx="85" ry="9" fill="#0047A8" opacity="0.4" />
      <ellipse cx="210" cy="555" rx="58" ry="7" fill="#0047A8" opacity="0.35" />
      <polygon points="46,498 188,498 192,510 42,510" fill="#F5A800" />
      <polygon points="46,498 32,504 42,510" fill="#E8340A" />
      <rect x="88" y="470" width="8" height="30" fill="#1A1207" />
      <ellipse cx="92" cy="468" rx="22" ry="11" fill="#E8340A" />
      <circle cx="178" cy="502" r="7" fill="#1A1207" />
      <polygon points="348,510 456,510 460,522 344,522" fill="#00A878" />
      <polygon points="348,510 334,516 344,522" fill="#1A1207" />
      <rect x="368" y="485" width="7" height="26" fill="#1A1207" />
      <ellipse cx="372" cy="483" rx="18" ry="10" fill="#F5A800" />
      <ellipse cx="16" cy="492" rx="28" ry="14" fill="#00A878" opacity="0.8" />
      <ellipse cx="544" cy="492" rx="28" ry="14" fill="#00A878" opacity="0.8" />
    </svg>
  );
}
