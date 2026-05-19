import { useRef, useState } from "react";
import { useNavigate } from "react-router";
import { Camera, Check, X, ChevronLeft, ArrowRight } from "lucide-react";
import { Card, PrimaryButton } from "@/components/ui";
import { useAppState, useAppDispatch } from "@/app/store";
import { lotteryData } from "@/data/constants";
import { motion, AnimatePresence } from "motion/react";

const colorTargets = ["#E8340A", "#F5A800", "#00A878", "#0057B8", "#7B2FBE", "#1A1207"];
const colorLabels = ["แดงอิฐ", "เหลืองทอง", "เขียวน้ำ", "น้ำเงินคลอง", "ม่วงไทย", "ดำหมึก"];

const METHOD_COLOR: Record<string, string> = { walk: "#00A878", bike: "#7B2FBE", boat: "#0057B8" };
const METHOD_EMOJI: Record<string, string> = { walk: "🚶", bike: "🚲", boat: "⛵" };

// ─── EXIT SHEET ───────────────────────────────────────────────────────────────

function ExitSheet({
  challengeName,
  onConfirm,
  onCancel,
}: {
  challengeName: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[150] flex items-end justify-center">
      <motion.div
        className="absolute inset-0 bg-[#1A1207]/60"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        onClick={onCancel}
      />
      <motion.div
        className="relative w-full max-w-lg bg-[#FFFDF5] rounded-t-[24px] border-t-2 border-x-2 border-[#1A1207] px-5 pt-5 pb-8"
        style={{ boxShadow: "0 -5px 0 #1A1207" }}
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", stiffness: 320, damping: 30 }}
      >
        {/* Handle */}
        <div className="flex justify-center mb-4">
          <div className="w-9 h-1 rounded-full bg-[#E2D5B0]" />
        </div>

        {/* Icon */}
        <div
          className="w-12 h-12 rounded-2xl border-2 border-[#1A1207] flex items-center justify-center mb-4"
          style={{ backgroundColor: "#E8340A10", boxShadow: "2px 2px 0 #1A1207" }}
        >
          <X size={22} className="text-[#E8340A]" />
        </div>

        <h3 className="font-['Anuphan'] text-xl font-bold text-[#1A1207] mb-1">
          ออกจากภารกิจ?
        </h3>
        <p className="font-['Bai_Jamjuree'] text-sm text-[#1A1207]/55 mb-6 leading-relaxed">
          "{challengeName}" จะถูกรีเซ็ตและกลับไปอยู่ในกล่องสลาก พร้อมให้เลือกใหม่ในครั้งหน้า
        </p>

        <div className="flex gap-3">
          <button
            onClick={onConfirm}
            className="flex-1 font-['Anuphan'] text-sm text-white py-3.5 rounded-full border-2 border-[#1A1207] bg-[#E8340A] active:translate-x-px active:translate-y-px transition-transform"
            style={{ boxShadow: "3px 3px 0 #1A1207" }}
          >
            ออกจากภารกิจ
          </button>
          <button
            onClick={onCancel}
            className="flex-1 font-['Anuphan'] text-sm text-[#1A1207] py-3.5 rounded-full border-2 border-[#1A1207] bg-white active:translate-x-px active:translate-y-px transition-transform"
            style={{ boxShadow: "3px 3px 0 #1A1207" }}
          >
            ทำต่อ
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────

export function LotteryActive() {
  const navigate = useNavigate();
  const { activeLotteryId, uploadedPhotos } = useAppState();
  const dispatch = useAppDispatch();
  const [showExit, setShowExit] = useState(false);
  const [previews, setPreviews] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const challenge = lotteryData.find(l => l.id === activeLotteryId);
  if (!challenge) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="font-['Bai_Jamjuree'] text-[#1A1207]/60 mb-4">ไม่พบความท้าทายที่เลือก</p>
          <button onClick={() => navigate("/lottery")} className="font-['Anuphan'] text-sm text-[#E8340A] underline">
            กลับไปหน้าล็อตเตอรี่
          </button>
        </div>
      </div>
    );
  }

  const uploaded = uploadedPhotos[challenge.id] || 0;
  const isColour = challenge.name === "colour hunting";
  const currentSlot = Math.min(uploaded, challenge.requiredPhotos - 1);
  const targetColor = isColour ? colorTargets[currentSlot % colorTargets.length] : null;
  const progress = Math.min((uploaded / challenge.requiredPhotos) * 100, 100);
  const isDone = uploaded >= challenge.requiredPhotos;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || isDone) return;
    const url = URL.createObjectURL(file);
    setPreviews(prev => [...prev, url]);
    dispatch({ type: "ADD_PHOTO", id: challenge.id, photoUrl: url });
    e.target.value = "";
    if (uploaded + 1 >= challenge.requiredPhotos) {
      setTimeout(() => {
        dispatch({ type: "COMPLETE_LOTTERY", id: challenge.id });
        navigate("/lottery");
      }, 800);
    }
  };

  const handleConfirmExit = () => {
    dispatch({ type: "RESET_LOTTERY", id: challenge.id });
    setPreviews([]);
    navigate("/explore");
  };

  return (
    <>
      <AnimatePresence>
        {showExit && (
          <ExitSheet
            challengeName={challenge.name}
            onConfirm={handleConfirmExit}
            onCancel={() => setShowExit(false)}
          />
        )}
      </AnimatePresence>

      {/* Sticky sub-header */}
      <div
        className="sticky top-14 z-40 bg-[#FFFDF5] border-b-2 border-[#E2D5B0] px-4 md:px-6 flex items-center gap-3"
        style={{ height: 52 }}
      >
        {/* Back to explore */}
        <button
          onClick={() => navigate("/explore")}
          className="flex items-center gap-1 font-['Anuphan'] text-xs text-[#1A1207]/50 hover:text-[#1A1207] transition-colors flex-shrink-0"
        >
          <ChevronLeft size={15} /> สำรวจ
        </button>

        {/* Challenge name centred */}
        <div className="flex-1 text-center min-w-0">
          <span className="font-['Anuphan'] text-sm font-bold text-[#1A1207] truncate">
            {challenge.name}
          </span>
        </div>

        {/* Exit button — always visible */}
        <button
          onClick={() => setShowExit(true)}
          className="flex items-center gap-1.5 font-['Anuphan'] text-xs text-white px-3 py-1.5 rounded-full border-2 border-[#1A1207] flex-shrink-0"
          style={{ backgroundColor: "#E8340A", boxShadow: "2px 2px 0 #1A1207" }}
        >
          <X size={12} /> ออก
        </button>
      </div>

      <div className="max-w-[640px] mx-auto px-4 md:px-6 py-6">

        {/* Challenge banner */}
        <div
          className="rounded-2xl border-2 border-[#1A1207] p-4 mb-6"
          style={{ boxShadow: "4px 4px 0 #1A1207", background: "linear-gradient(135deg, #FFFDF5 0%, #FFF8E6 100%)" }}
        >
          <div className="flex items-start justify-between gap-2 mb-2">
            <h2 className="font-['Anuphan'] text-2xl font-bold text-[#1A1207]">{challenge.name}</h2>
            <div className="flex gap-1 flex-shrink-0">
              {challenge.methods.map(m => (
                <span
                  key={m}
                  className="text-[10px] text-white px-2 py-0.5 rounded-full border border-[#1A1207] font-['Bai_Jamjuree']"
                  style={{ backgroundColor: METHOD_COLOR[m] }}
                >
                  {METHOD_EMOJI[m]}
                </span>
              ))}
            </div>
          </div>
          <p className="font-['Bai_Jamjuree'] text-[#1A1207]/65 text-sm leading-relaxed mb-3">
            {challenge.task}
          </p>

          {/* Inline progress bar */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-2.5 bg-[#E2D5B0] rounded-full border border-[#1A1207]/15 overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ backgroundColor: isDone ? "#00A878" : "#F5A800" }}
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
            </div>
            <span className="font-['Anuphan'] text-xs text-[#1A1207] flex-shrink-0">
              {uploaded} / {challenge.requiredPhotos}
            </span>
          </div>
        </div>

        {/* Colour hunting: target swatch */}
        {isColour && targetColor && (
          <div className="mb-5">
            <div className="font-['Anuphan'] text-sm text-[#1A1207]/55 mb-2">สีเป้าหมาย</div>
            <Card className="p-4 flex items-center gap-4">
              <div
                className="w-16 h-16 rounded-2xl border-2 border-[#1A1207] flex-shrink-0"
                style={{ backgroundColor: targetColor, boxShadow: "3px 3px 0 #1A1207" }}
              />
              <div>
                <div className="font-['Anuphan'] text-lg font-bold text-[#1A1207]">
                  {colorLabels[currentSlot % colorLabels.length]}
                </div>
                <div className="font-['Bai_Jamjuree'] text-xs text-[#1A1207]/45">{targetColor}</div>
                <div className="font-['Bai_Jamjuree'] text-xs text-[#1A1207]/45 mt-0.5">
                  ภาพที่ {currentSlot + 1} จาก {challenge.requiredPhotos}
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Camera viewfinder */}
        <div className="mb-5">
          <div className="font-['Anuphan'] text-sm text-[#1A1207]/55 mb-2">กล้อง</div>
          <Card
            className="p-0 overflow-hidden cursor-pointer"
            onClick={() => !isDone && fileInputRef.current?.click()}
          >
            <div className="w-full h-56 bg-[#1A1207] relative flex items-center justify-center">
              {previews.length > 0 ? (
                <img src={previews[previews.length - 1]} alt="preview" className="w-full h-full object-cover opacity-90" />
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <Camera size={40} className="text-white/15" />
                  <span className="font-['Bai_Jamjuree'] text-white/25 text-xs">แตะเพื่อเปิดกล้อง</span>
                </div>
              )}

              {/* Viewfinder corners */}
              <div className="absolute inset-3 pointer-events-none">
                <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-[#F5A800]" />
                <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-[#F5A800]" />
                <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-[#F5A800]" />
                <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-[#F5A800]" />
              </div>

              {/* Recording dot */}
              {!isDone && (
                <div className="absolute top-3 right-3 w-2.5 h-2.5 rounded-full bg-[#E8340A] border border-white animate-pulse" />
              )}

              {/* Done overlay */}
              {isDone && (
                <div className="absolute inset-0 bg-[#00A878]/80 flex flex-col items-center justify-center gap-2">
                  <Check size={44} className="text-white" strokeWidth={3} />
                  <span className="font-['Anuphan'] text-white text-lg font-bold">ภารกิจสำเร็จ!</span>
                </div>
              )}
            </div>
            <div className="px-4 py-2.5 border-t border-[#E2D5B0] flex items-center justify-between">
              <span className="font-['Bai_Jamjuree'] text-xs text-[#1A1207]/55">
                {isDone ? "ครบแล้ว! 🎉" : "แตะเพื่อถ่ายภาพ"}
              </span>
              {!isDone && (
                <span className="font-['Anuphan'] text-xs text-[#1A1207]/40">
                  เหลือ {challenge.requiredPhotos - uploaded} ภาพ
                </span>
              )}
            </div>
          </Card>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>

        {/* Photo slots */}
        <div className="mb-6">
          <div className="font-['Anuphan'] text-sm text-[#1A1207]/55 mb-2.5">ภาพที่ถ่ายแล้ว</div>
          <div className="flex gap-2 flex-wrap">
            {Array.from({ length: challenge.requiredPhotos }).map((_, i) => {
              const slotSize = challenge.requiredPhotos > 4 ? 52 : 64;
              const done = i < uploaded;
              return (
                <motion.div
                  key={i}
                  className="border-2 border-[#1A1207] rounded-xl overflow-hidden flex-shrink-0"
                  style={{
                    width: slotSize,
                    height: slotSize,
                    backgroundColor: done ? "#00A878" : "#F0EDE0",
                    boxShadow: done ? "2px 2px 0 #1A1207" : "none",
                  }}
                  animate={done ? { scale: [1, 1.12, 1] } : {}}
                  transition={{ duration: 0.25 }}
                >
                  {previews[i] ? (
                    <img src={previews[i]} alt="" className="w-full h-full object-cover" />
                  ) : done ? (
                    <div className="w-full h-full flex items-center justify-center">
                      <Check size={slotSize > 52 ? 24 : 18} className="text-white" strokeWidth={3} />
                    </div>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Camera size={slotSize > 52 ? 18 : 14} className="text-[#1A1207]/25" />
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Main CTA */}
        {!isDone ? (
          <PrimaryButton
            onClick={() => fileInputRef.current?.click()}
            className="w-full py-4 text-base flex items-center justify-center gap-2 mb-3"
          >
            <Camera size={20} /> 📸 ถ่ายภาพ ({uploaded}/{challenge.requiredPhotos})
          </PrimaryButton>
        ) : (
          <button
            onClick={() => navigate("/lottery")}
            className="w-full font-['Anuphan'] text-base text-white py-4 rounded-full border-2 border-[#1A1207] flex items-center justify-center gap-2 bg-[#00A878] mb-3 active:translate-x-px active:translate-y-px transition-transform"
            style={{ boxShadow: "4px 4px 0 #1A1207" }}
          >
            ดูสลากทั้งหมด <ArrowRight size={18} />
          </button>
        )}

        {/* Exit link — secondary, always visible */}
        <button
          onClick={() => setShowExit(true)}
          className="w-full font-['Bai_Jamjuree'] text-sm text-[#1A1207]/40 hover:text-[#E8340A] py-2 transition-colors"
        >
          ออกจากภารกิจ
        </button>
      </div>
    </>
  );
}
