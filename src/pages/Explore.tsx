import { useState, useRef } from "react";
import { useNavigate } from "react-router";
import { Play, Pause, ChevronDown, ChevronUp, ArrowRight, QrCode, Volume2, X } from "lucide-react";
import { Card, PrimaryButton, ProgressDots } from "@/components/ui";
import { useAppState, useAppDispatch } from "@/app/store";
import { checkpoints, lotteryData, modeConfig, type LotteryChallenge } from "@/data/constants";
import { motion, AnimatePresence } from "motion/react";
import { useT } from "@/app/hooks/useT";

// ─── TICKET HELPERS ────────────────────────────────────────────────────────────

const TICKET_COLORS = ["#E8340A", "#00A878", "#0057B8", "#7B2FBE", "#F5A800"];
const METHOD_EMOJI: Record<string, string> = { walk: "🚶", bike: "🚲", boat: "⛵" };
const METHOD_COLOR: Record<string, string> = { walk: "#00A878", bike: "#7B2FBE", boat: "#0057B8" };

const ticketColor = (id: number) => TICKET_COLORS[(id - 1) % TICKET_COLORS.length];

const ticketNumber = (id: number) => {
  const n = ((id * 137593 + 482913) % 1000000).toString().padStart(6, "0");
  return `${n.slice(0, 1)} ${n.slice(1, 3)} ${n.slice(3, 6)}`;
};

// ─── SINGLE TICKET ─────────────────────────────────────────────────────────────

function LotteryTicket({
  challenge,
  selected,
  onClick,
}: {
  challenge: LotteryChallenge;
  selected: boolean;
  onClick: () => void;
}) {
  const color = ticketColor(challenge.id);
  const num = ticketNumber(challenge.id);

  return (
    <motion.button
      onClick={onClick}
      whileTap={{ scale: 0.92 }}
      className="relative flex flex-col overflow-hidden rounded-lg w-full bg-[#FFFDF5] border-2 select-none"
      style={{
        borderColor: selected ? color : "rgba(26,18,7,0.18)",
        boxShadow: selected
          ? `0 0 0 2px ${color}, 2px 2px 0 #1A1207`
          : "1px 1px 0 rgba(26,18,7,0.35)",
        minHeight: 148,
      }}
    >
      {/* Color header band */}
      <div
        className="w-full flex flex-col items-center justify-center gap-0.5"
        style={{ backgroundColor: color, paddingTop: 6, paddingBottom: 5 }}
      >
        <span
          className="font-['Fahkwang'] text-white font-bold tracking-widest uppercase"
          style={{ fontSize: 7, letterSpacing: "0.15em" }}
        >
          สลากความท้าทาย
        </span>
        <span className="font-['Sarabun'] text-white/70" style={{ fontSize: 6 }}>
          Challenge Lottery
        </span>
      </div>

      {/* Wavy tear line top */}
      <svg viewBox="0 0 60 4" className="w-full" style={{ height: 4, display: "block" }} preserveAspectRatio="none">
        <path
          d="M0,2 Q3,0 6,2 Q9,4 12,2 Q15,0 18,2 Q21,4 24,2 Q27,0 30,2 Q33,4 36,2 Q39,0 42,2 Q45,4 48,2 Q51,0 54,2 Q57,4 60,2"
          fill="none"
          stroke={color}
          strokeWidth="0.8"
          opacity="0.6"
        />
      </svg>

      {/* Ticket number */}
      <div className="flex-1 flex flex-col items-center justify-center px-1.5 py-2">
        <div
          className="font-['Fahkwang'] font-bold text-[#1A1207] tracking-widest tabular-nums"
          style={{ fontSize: 16, letterSpacing: "0.1em" }}
        >
          {num}
        </div>
        <div className="font-['Sarabun'] text-[#1A1207]/30 mt-0.5" style={{ fontSize: 7 }}>
          หมายเลขสลาก
        </div>
      </div>

      {/* Wavy tear line bottom */}
      <svg viewBox="0 0 60 4" className="w-full" style={{ height: 4, display: "block" }} preserveAspectRatio="none">
        <path
          d="M0,2 Q3,4 6,2 Q9,0 12,2 Q15,4 18,2 Q21,0 24,2 Q27,4 30,2 Q33,0 36,2 Q39,4 42,2 Q45,0 48,2 Q51,4 54,2 Q57,0 60,2"
          fill="none"
          stroke={color}
          strokeWidth="0.8"
          opacity="0.6"
        />
      </svg>

      {/* Footer — hidden until picked */}
      <div
        className="w-full px-2 py-1.5 flex items-center justify-center gap-1.5"
        style={{ backgroundColor: `${color}14` }}
      >
        {selected ? (
          <span className="font-['Fahkwang'] font-bold" style={{ fontSize: 9, color }}>เปิดดูด้านล่าง ↓</span>
        ) : (
          <>
            <span style={{ fontSize: 10 }}>🎲</span>
            <span className="font-['Fahkwang'] text-[#1A1207]/30 tracking-widest" style={{ fontSize: 9 }}>? ? ?</span>
            <span style={{ fontSize: 10 }}>🎲</span>
          </>
        )}
      </div>

      {/* Selected badge */}
      {selected && (
        <div
          className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full flex items-center justify-center"
          style={{ backgroundColor: color, border: "1px solid rgba(255,255,255,0.5)" }}
        >
          <span className="text-white" style={{ fontSize: 8 }}>✓</span>
        </div>
      )}
    </motion.button>
  );
}

// ─── LOTTERY MODAL ─────────────────────────────────────────────────────────────

function LotteryModal({
  onAccept,
  onSkip,
}: {
  onAccept: (challenge: LotteryChallenge) => void;
  onSkip: () => void;
}) {
  const { lotteryStatuses } = useAppState();
  const [selected, setSelected] = useState<LotteryChallenge | null>(null);

  const available = lotteryData.filter(l => lotteryStatuses[l.id] === "available");

  const handleSelect = (c: LotteryChallenge) =>
    setSelected(prev => (prev?.id === c.id ? null : c));

  return (
    <div className="fixed inset-0 z-[150] flex items-end justify-center">
      {/* Backdrop */}
      <motion.div
        className="absolute inset-0"
        style={{ backgroundColor: "rgba(26,18,7,0.82)" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        onClick={onSkip}
      />

      {/* Sheet */}
      <motion.div
        className="relative w-full max-w-lg flex flex-col rounded-t-[24px] border-t-2 border-x-2 overflow-hidden"
        style={{
          background: "linear-gradient(170deg, #2E1D0C 0%, #1A1207 100%)",
          borderColor: "#C8A96E",
          boxShadow: "0 -5px 0 #C8A96E",
          maxHeight: "91vh",
        }}
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", stiffness: 300, damping: 32 }}
      >
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-0 flex-shrink-0">
          <div className="w-9 h-1 rounded-full" style={{ backgroundColor: "rgba(200,169,110,0.35)" }} />
        </div>

        {/* Header */}
        <div
          className="px-4 pt-3 pb-3 flex-shrink-0"
          style={{ borderBottom: "1px solid rgba(200,169,110,0.2)" }}
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="font-['Fahkwang'] font-bold text-[#F5A800]" style={{ fontSize: 21 }}>
                เลือกสลากของคุณ
              </h3>
              <p className="font-['Sarabun'] text-[#C8A96E]/60 text-xs mt-0.5">
                ตอบถูกแล้ว! แตะสลากหมายเลขที่ชอบ
              </p>
            </div>
            <button
              onClick={onSkip}
              className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
              style={{ border: "1px solid rgba(200,169,110,0.3)", backgroundColor: "rgba(200,169,110,0.1)" }}
            >
              <X size={13} className="text-[#C8A96E]" />
            </button>
          </div>

          {/* Mode legend */}
          <div className="flex gap-3 mt-2">
            {(["walk", "bike", "boat"] as const).map(m => (
              <div key={m} className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: METHOD_COLOR[m] }} />
                <span className="font-['Sarabun'] text-[#C8A96E]/45" style={{ fontSize: 9 }}>
                  {METHOD_EMOJI[m]} {m}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Ticket board — wooden crate grid */}
        <div
          className="flex-1 overflow-y-auto px-2.5 py-2.5"
          style={{
            backgroundImage:
              "repeating-linear-gradient(90deg,rgba(200,169,110,0.05) 0,rgba(200,169,110,0.05) 1px,transparent 1px,transparent 40px)," +
              "repeating-linear-gradient(0deg,rgba(200,169,110,0.05) 0,rgba(200,169,110,0.05) 1px,transparent 1px,transparent 40px)",
          }}
        >
          {available.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 gap-2">
              <span className="text-3xl">🎟️</span>
              <span className="font-['Fahkwang'] text-[#C8A96E]/50 text-sm">ไม่มีสลากเหลือแล้ว</span>
            </div>
          ) : (
            <div
              className="grid gap-2"
              style={{ gridTemplateColumns: "repeat(3, 1fr)" }}
            >
              {available.map(c => (
                <LotteryTicket
                  key={c.id}
                  challenge={c}
                  selected={selected?.id === c.id}
                  onClick={() => handleSelect(c)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Bottom confirm panel */}
        <div
          className="flex-shrink-0"
          style={{ borderTop: "1px solid rgba(200,169,110,0.2)", minHeight: 90 }}
        >
          <AnimatePresence mode="wait">
            {selected ? (
              <motion.div
                key={`reveal-${selected.id}`}
                className="px-4 py-3"
                initial={{ opacity: 0, y: 14, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 6 }}
                transition={{ type: "spring", stiffness: 340, damping: 28 }}
              >
                {/* Reveal banner */}
                <div className="flex items-center justify-center gap-2 mb-2.5">
                  <div className="flex-1 h-px" style={{ backgroundColor: "rgba(200,169,110,0.2)" }} />
                  <span className="font-['Fahkwang'] text-[#F5A800]" style={{ fontSize: 11 }}>
                    🎉 คุณได้รับความท้าทาย!
                  </span>
                  <div className="flex-1 h-px" style={{ backgroundColor: "rgba(200,169,110,0.2)" }} />
                </div>

                {/* Revealed challenge — pops in */}
                <motion.div
                  className="rounded-2xl px-3 py-3 mb-3 relative overflow-hidden"
                  style={{
                    border: `2px solid ${ticketColor(selected.id)}`,
                    backgroundColor: `${ticketColor(selected.id)}20`,
                    boxShadow: `3px 3px 0 ${ticketColor(selected.id)}55`,
                  }}
                  initial={{ scale: 0.88 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 420, damping: 22, delay: 0.04 }}
                >
                  <div
                    className="absolute top-0 right-0 w-12 h-12 opacity-15 rounded-bl-full"
                    style={{ backgroundColor: ticketColor(selected.id) }}
                  />
                  <div className="flex items-start gap-3">
                    <div
                      className="w-9 h-12 rounded-lg flex items-center justify-center flex-shrink-0 border"
                      style={{ backgroundColor: ticketColor(selected.id), borderColor: "rgba(255,255,255,0.25)" }}
                    >
                      <span className="font-['Fahkwang'] text-white font-bold" style={{ fontSize: 12 }}>
                        {selected.id.toString().padStart(2, "0")}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-['Fahkwang'] font-bold text-white" style={{ fontSize: 15 }}>
                        {selected.name}
                      </div>
                      <div className="font-['Sarabun'] text-white/60 mt-0.5 leading-relaxed" style={{ fontSize: 11 }}>
                        {selected.task}
                      </div>
                      <div className="flex items-center gap-1.5 mt-1.5">
                        {selected.methods.map(m => (
                          <span
                            key={m}
                            className="text-white px-1.5 py-0.5 rounded-full font-['Sarabun']"
                            style={{ fontSize: 9, backgroundColor: METHOD_COLOR[m], border: "1px solid rgba(255,255,255,0.25)" }}
                          >
                            {METHOD_EMOJI[m]}
                          </span>
                        ))}
                        <span className="font-['Sarabun'] text-white/40" style={{ fontSize: 9 }}>
                          ×{selected.requiredPhotos} ภาพ
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Action buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={() => onAccept(selected)}
                    className="flex-1 font-['Fahkwang'] text-sm text-white py-3 rounded-full border-2 border-[#1A1207] flex items-center justify-center gap-1.5 bg-[#E8340A] active:translate-x-px active:translate-y-px transition-transform"
                    style={{ boxShadow: "3px 3px 0 #1A1207" }}
                  >
                    รับสลากนี้เลย! <ArrowRight size={14} />
                  </button>
                  <button
                    onClick={() => setSelected(null)}
                    className="font-['Fahkwang'] text-xs text-[#C8A96E] px-4 py-3 rounded-full"
                    style={{ border: "1px solid rgba(200,169,110,0.3)", backgroundColor: "rgba(200,169,110,0.08)" }}
                  >
                    เลือกใหม่
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="hint"
                className="flex items-center justify-center gap-2 py-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <span className="text-xl">🎟️</span>
                <span className="font-['Sarabun'] text-[#C8A96E]/40 text-sm">
                  แตะสลากหมายเลขที่ชอบ
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}

// ─── SIDEBAR ──────────────────────────────────────────────────────────────────

function Sidebar({ current, completed, modeColor, t }: { current: number; completed: boolean[]; modeColor: string; t: ReturnType<typeof useT> }) {
  return (
    <aside className="hidden md:flex flex-col w-72 lg:w-80 flex-shrink-0 border-r-2 border-[#E2D5B0] bg-[#FFFDF5] overflow-y-auto p-5">
      <h3 className="font-['Fahkwang'] text-base font-bold text-[#1A1207] mb-4">{t.plan.checkpoints_title}</h3>
      <div className="space-y-2">
        {checkpoints.map((cp, i) => (
          <div
            key={cp.id}
            className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all ${
              i === current ? "border-current" : "border-transparent"
            } ${i > current ? "opacity-35" : ""}`}
            style={i === current ? { borderColor: modeColor, backgroundColor: `${modeColor}10` } : {}}
          >
            <div
              className="w-8 h-8 rounded-full border-2 border-[#1A1207] flex items-center justify-center text-xs font-['Fahkwang'] font-bold flex-shrink-0"
              style={{
                backgroundColor: completed[i] ? modeColor : i === current ? "#F5A800" : "white",
                color: completed[i] || i === current ? "white" : "#1A1207",
              }}
            >
              {completed[i] ? "✓" : i + 1}
            </div>
            <div className="min-w-0">
              <div className="font-['Fahkwang'] text-sm font-medium text-[#1A1207] truncate">{cp.name}</div>
              <div className="font-['Sarabun'] text-[10px] text-[#1A1207]/45">{cp.subtitle}</div>
              {i === current && <div className="font-['Sarabun'] text-[10px] mt-0.5" style={{ color: modeColor }}>{t.explore.exploring}</div>}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-auto pt-6">
        <div className="font-['Sarabun'] text-xs text-[#1A1207]/45 mb-1.5">{t.explore.progress}</div>
        <div className="w-full bg-[#E2D5B0] rounded-full h-2.5 border border-[#1A1207]/20">
          <div
            className="h-2.5 rounded-full transition-all duration-500"
            style={{ width: `${(completed.filter(Boolean).length / checkpoints.length) * 100}%`, backgroundColor: modeColor }}
          />
        </div>
        <div className="font-['Sarabun'] text-xs text-[#1A1207]/50 mt-1.5">
          {completed.filter(Boolean).length} / {checkpoints.length} {t.explore.checkpoint}
        </div>
      </div>
    </aside>
  );
}

// ─── AUDIO BAR ────────────────────────────────────────────────────────────────

function AudioBar({ checkpoint }: { checkpoint: typeof checkpoints[0] }) {
  const [playing, setPlaying] = useState(false);
  const [progress] = useState(22);

  return (
    <div className="sticky bottom-0 left-0 right-0 bg-white border-t-2 border-[#1A1207] p-4 z-20" style={{ boxShadow: "0 -4px 0 #1A1207" }}>
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-xl border-2 border-[#1A1207] overflow-hidden flex-shrink-0 bg-[#C0D8F0]">
          <img src={checkpoint.image} alt="" className="w-full h-full object-cover" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-['Fahkwang'] text-sm text-[#1A1207] truncate mb-1">{checkpoint.name} — เรื่องเล่าจากเรือ</div>
          <div className="flex items-center gap-2">
            <span className="font-['Sarabun'] text-[10px] text-[#1A1207]/45 flex-shrink-0">1:42</span>
            <div className="flex-1 bg-[#E2D5B0] rounded-full h-1.5 relative border border-[#1A1207]/15">
              <div className="h-1.5 rounded-full bg-[#0057B8]" style={{ width: `${progress}%` }} />
              <div
                className="absolute top-1/2 w-3 h-3 rounded-full border-2 border-[#1A1207] bg-white"
                style={{ left: `${progress}%`, transform: "translate(-50%, -50%)" }}
              />
            </div>
            <span className="font-['Sarabun'] text-[10px] text-[#1A1207]/45 flex-shrink-0">7:30</span>
          </div>
        </div>
        <button
          onClick={() => setPlaying(p => !p)}
          className="w-10 h-10 rounded-full border-2 border-[#1A1207] flex items-center justify-center flex-shrink-0 bg-[#0057B8] text-white"
          style={{ boxShadow: "2px 2px 0 #1A1207" }}
        >
          {playing ? <Pause size={15} /> : <Play size={15} />}
        </button>
        <Volume2 size={15} className="text-[#1A1207]/35 flex-shrink-0" />
      </div>
    </div>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────

export function Explore() {
  const navigate = useNavigate();
  const state = useAppState();
  const dispatch = useAppDispatch();
  const t = useT();
  const { mode, currentCheckpoint, completedCheckpoints, checkpointAnswers } = state;

  const effectiveMode = mode ?? "walk";
  const cfg = modeConfig[effectiveMode];
  const cp = checkpoints[currentCheckpoint];

  const [storyExpanded, setStoryExpanded] = useState(false);
  const [viewMode, setViewMode] = useState<"listen" | "read">("listen");
  const [bikeCode, setBikeCode] = useState("");
  const [showLottery, setShowLottery] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const selectedAnswer = checkpointAnswers[currentCheckpoint];
  const isCorrect = selectedAnswer === cp.correct;
  const isCompleted = completedCheckpoints[currentCheckpoint];
  const allDone = completedCheckpoints.every(Boolean);

  const handleAnswer = (i: number) => {
    if (isCompleted) return;
    dispatch({ type: "SELECT_ANSWER", idx: currentCheckpoint, answer: i });
  };

  const handleSubmitAnswer = () => {
    if (!isCorrect || isCompleted) return;
    dispatch({ type: "COMPLETE_CHECKPOINT", idx: currentCheckpoint });
    setShowLottery(true);
  };

  const handleBikeSubmit = () => {
    if (!bikeCode.trim()) return;
    dispatch({ type: "COMPLETE_CHECKPOINT", idx: currentCheckpoint });
    setShowLottery(true);
  };

  const handleLotteryAccept = (challenge: LotteryChallenge) => {
    dispatch({ type: "ACTIVATE_LOTTERY", id: challenge.id });
    setShowLottery(false);
    navigate("/lottery/active");
  };

  const handleNext = () => {
    if (currentCheckpoint < checkpoints.length - 1) {
      dispatch({ type: "ADVANCE_CHECKPOINT" });
      setBikeCode("");
      setStoryExpanded(false);
    }
  };

  return (
    <>
      <AnimatePresence>
        {showLottery && (
          <LotteryModal
            onAccept={handleLotteryAccept}
            onSkip={() => setShowLottery(false)}
          />
        )}
      </AnimatePresence>

      <div className="flex bg-[#FFFDF5] h-[calc(100vh-120px)] md:h-[calc(100vh-56px)]">
        <div className="flex flex-1 overflow-hidden">
          <Sidebar current={currentCheckpoint} completed={completedCheckpoints} modeColor={cfg.color} t={t} />

          <div className="flex-1 flex flex-col overflow-y-auto">
            {/* Mobile progress */}
            <div className="flex items-center justify-center py-4 md:hidden border-b border-[#E2D5B0]">
              <ProgressDots total={6} current={currentCheckpoint} color={cfg.color} />
            </div>

            {/* Boat toggle */}
            {effectiveMode === "boat" && (
              <div className="flex items-center justify-between px-4 md:px-6 py-3 border-b border-[#E2D5B0]">
                <div className="hidden md:block">
                  <ProgressDots total={6} current={currentCheckpoint} color={cfg.color} />
                </div>
                <div className="flex rounded-full border-2 border-[#1A1207] overflow-hidden ml-auto" style={{ boxShadow: "2px 2px 0 #1A1207" }}>
                  {(["listen", "read"] as const).map(m => (
                    <button
                      key={m}
                      onClick={() => setViewMode(m)}
                      className={`font-['Fahkwang'] text-xs px-4 py-2 transition-colors ${viewMode === m ? "text-white" : "bg-white text-[#1A1207]"}`}
                      style={viewMode === m ? { backgroundColor: cfg.color } : {}}
                    >
                      {m === "listen" ? "🎧 ฟัง" : "📖 อ่าน"}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Hero image */}
            <div className="w-full h-52 md:h-72 relative overflow-hidden flex-shrink-0 bg-[#E2D5B0]">
              <img src={cp.image} alt={cp.name} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1A1207]/50 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-2.5 h-2.5 rounded-full border border-white" style={{ backgroundColor: cfg.color }} />
                  <span className="font-['Sarabun'] text-white/80 text-xs">{t.explore.checkpoint} {currentCheckpoint + 1} {t.explore.of} 6</span>
                </div>
                <h2 className="font-['Fahkwang'] text-white text-3xl font-bold drop-shadow-lg">{cp.name}</h2>
                <p className="font-['Sarabun'] text-white/75 text-sm">{cp.subtitle}</p>
              </div>
            </div>

            {/* Content area */}
            <div className="flex-1 px-4 md:px-8 py-5 space-y-5">
              {/* Story card */}
              <Card className="p-5" style={{ borderLeft: `4px solid ${cfg.color}` }}>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: cfg.color }} />
                  <span className="font-['Fahkwang'] text-sm" style={{ color: cfg.color }}>{t.explore.story}</span>
                </div>
                <p className="font-['Sarabun'] text-[#1A1207]/75 text-sm leading-relaxed">
                  {storyExpanded ? cp.story : cp.teaser}
                </p>
                <button
                  onClick={() => setStoryExpanded(e => !e)}
                  className="mt-3 flex items-center gap-1 font-['Fahkwang'] text-xs text-[#1A1207]/50 hover:text-[#1A1207] transition-colors"
                >
                  {storyExpanded ? (<><ChevronUp size={14} /> ย่อลง</>) : (<><ChevronDown size={14} /> อ่านเพิ่มเติม</>)}
                </button>
              </Card>

              {/* Mode interaction */}
              {effectiveMode === "bike" ? (
                <div>
                  <h4 className="font-['Fahkwang'] text-lg font-bold text-[#1A1207] mb-3">สแกนรหัสสถานี</h4>
                  <Card className="p-5 mb-4">
                    <div
                      className="w-full h-44 rounded-2xl border-2 border-dashed border-[#7B2FBE] flex flex-col items-center justify-center gap-3 mb-4 bg-[#7B2FBE]/5 cursor-pointer"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <QrCode size={40} className="text-[#7B2FBE]/40" />
                      <span className="font-['Sarabun'] text-sm text-[#7B2FBE]/60">แตะเพื่อสแกน QR Code</span>
                      <input ref={fileInputRef} type="file" accept="image/*" className="hidden" />
                    </div>
                    <div className="text-center mb-3">
                      <span className="font-['Sarabun'] text-xs text-[#1A1207]/40">หรือ พิมพ์รหัสสถานี</span>
                    </div>
                    <div className="flex gap-2">
                      <input
                        value={bikeCode}
                        onChange={e => setBikeCode(e.target.value)}
                        placeholder="รหัสสถานี เช่น BK-03"
                        disabled={isCompleted}
                        className="flex-1 px-4 py-3 font-['Sarabun'] border-2 border-[#E2D5B0] rounded-full focus:outline-none focus:border-[#7B2FBE] text-[#1A1207] placeholder:text-[#1A1207]/25 text-sm disabled:opacity-50"
                      />
                      <button
                        onClick={handleBikeSubmit}
                        disabled={!bikeCode.trim() || isCompleted}
                        className="px-5 py-3 font-['Fahkwang'] text-sm text-white rounded-full border-2 border-[#1A1207] disabled:opacity-40"
                        style={{ backgroundColor: "#7B2FBE", boxShadow: "2px 2px 0 #1A1207" }}
                      >
                        ยืนยัน
                      </button>
                    </div>
                  </Card>
                </div>
              ) : (
                <div>
                  <h4 className="font-['Fahkwang'] text-lg font-bold text-[#1A1207] mb-2">คำถามประจำจุด</h4>
                  <p className="font-['Sarabun'] text-[#1A1207]/75 text-sm mb-4 leading-relaxed">{cp.question}</p>
                  <div className="grid grid-cols-2 gap-3">
                    {cp.options.map((opt, i) => (
                      <button
                        key={i}
                        onClick={() => handleAnswer(i)}
                        disabled={isCompleted}
                        className={`p-4 rounded-2xl border-2 font-['Sarabun'] text-sm text-left transition-all disabled:cursor-default ${
                          selectedAnswer === i
                            ? i === cp.correct
                              ? "border-[#1A1207] text-white"
                              : "bg-[#E8340A]/10 border-[#E8340A] text-[#E8340A]"
                            : "bg-white border-[#E2D5B0] text-[#1A1207] hover:border-[#1A1207] disabled:hover:border-[#E2D5B0]"
                        }`}
                        style={selectedAnswer === i && i === cp.correct ? { backgroundColor: cfg.color, boxShadow: "3px 3px 0 #1A1207" } : {}}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                  {selectedAnswer !== null && !isCompleted && (
                    <div className="mt-4 flex flex-col gap-3">
                      <div
                        className="p-4 rounded-2xl border-2 border-[#1A1207] font-['Sarabun'] text-sm"
                        style={{ backgroundColor: isCorrect ? `${cfg.color}15` : "#E8340A10", color: isCorrect ? cfg.color : "#E8340A" }}
                      >
                        {isCorrect ? `✓ ${t.explore.correct} ${cp.options[cp.correct]}` : `✗ ${t.explore.wrong}`}
                      </div>
                      {isCorrect && (
                        <PrimaryButton onClick={handleSubmitAnswer} className="flex items-center justify-center gap-2 py-3">
                          บันทึกคำตอบ ✓
                        </PrimaryButton>
                      )}
                    </div>
                  )}
                </div>
              )}

              {isCompleted && (
                <div
                  className="p-4 rounded-2xl border-2 border-[#1A1207] font-['Sarabun'] text-sm"
                  style={{ backgroundColor: `${cfg.color}15`, color: cfg.color }}
                >
                  {t.explore.complete_cp}
                </div>
              )}

              {isCompleted && (
                currentCheckpoint < checkpoints.length - 1 ? (
                  <button
                    onClick={handleNext}
                    className="w-full font-['Fahkwang'] text-base py-4 text-white border-2 border-[#1A1207] rounded-full flex items-center justify-center gap-2 transition-all active:translate-x-[2px] active:translate-y-[2px]"
                    style={{ backgroundColor: cfg.color, boxShadow: "4px 4px 0 #1A1207" }}
                  >
                    {t.explore.next_cp} <ArrowRight size={18} />
                  </button>
                ) : allDone ? (
                  <PrimaryButton onClick={() => navigate("/summary")} className="w-full py-4 flex items-center justify-center gap-2 text-base">
                    {t.explore.finish} 🎉 <ArrowRight size={18} />
                  </PrimaryButton>
                ) : null
              )}

              <div className="h-4" />
            </div>

            {effectiveMode === "boat" && <AudioBar checkpoint={cp} />}
          </div>
        </div>
      </div>
    </>
  );
}
