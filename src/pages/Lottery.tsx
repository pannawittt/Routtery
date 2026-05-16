import { useNavigate } from "react-router";
import { Card, YellowButton } from "@/components/ui";
import { useAppState, useAppDispatch } from "@/app/store";
import { lotteryData, type Mode } from "@/data/constants";

const methodColors: Record<Mode, string> = {
  walk: "#00A878",
  bike: "#7B2FBE",
  boat: "#0057B8",
};

const methodEmoji: Record<Mode, string> = {
  walk: "🚶",
  bike: "🚲",
  boat: "⛵",
};

const statusConfig = {
  available: { label: "พร้อม", bg: "#F5F0E0", text: "#1A1207" },
  active: { label: "กำลังทำ", bg: "#F5A800", text: "#1A1207" },
  done: { label: "สำเร็จ ✓", bg: "#00A878", text: "white" },
};

export function Lottery() {
  const navigate = useNavigate();
  const { lotteryStatuses, uploadedPhotos } = useAppState();
  const dispatch = useAppDispatch();

  const handleAccept = (id: number) => {
    dispatch({ type: "ACTIVATE_LOTTERY", id });
    navigate("/lottery/active");
  };

  const handleRandom = () => {
    const available = lotteryData.filter(l => lotteryStatuses[l.id] === "available");
    if (available.length === 0) return;
    const pick = available[Math.floor(Math.random() * available.length)];
    dispatch({ type: "ACTIVATE_LOTTERY", id: pick.id });
    navigate("/lottery/active");
  };

  return (
    <div className="min-h-screen w-full bg-[#FFFDF5]">
      <div className="max-w-[960px] mx-auto px-4 md:px-6 py-8">
        {/* Header */}
        <div className="flex items-start justify-between mb-8 flex-wrap gap-4">
          <div>
            <h2 className="font-['Fahkwang'] text-3xl font-bold text-[#1A1207] mb-1">ความท้าทาย</h2>
            <p className="font-['Sarabun'] text-[#1A1207]/55 text-sm">
              สำเร็จแล้ว {lotteryData.filter(l => lotteryStatuses[l.id] === "done").length} / {lotteryData.length}
            </p>
          </div>
          <YellowButton onClick={handleRandom} className="flex items-center gap-2 text-sm">
            🎲 สุ่มล็อตเตอรี่!
          </YellowButton>
        </div>

        {/* Card grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {lotteryData.map(challenge => {
            const status = lotteryStatuses[challenge.id];
            const uploaded = uploadedPhotos[challenge.id] || 0;
            const sc = statusConfig[status];
            const progress = Math.min((uploaded / challenge.requiredPhotos) * 100, 100);

            return (
              <Card key={challenge.id} className="p-5 transition-transform hover:-translate-y-0.5">
                <div className="flex items-start justify-between gap-2 mb-3">
                  <h4 className="font-['Fahkwang'] text-lg font-bold text-[#1A1207] leading-tight">{challenge.name}</h4>
                  <div className="flex gap-1.5 flex-wrap justify-end flex-shrink-0">
                    {challenge.methods.map(m => (
                      <span
                        key={m}
                        className="text-[10px] text-white px-2 py-0.5 rounded-full border border-[#1A1207] font-['Sarabun']"
                        style={{ backgroundColor: methodColors[m] }}
                      >
                        {methodEmoji[m]}
                      </span>
                    ))}
                  </div>
                </div>

                <p className="font-['Sarabun'] text-sm text-[#1A1207]/65 mb-4 leading-relaxed">{challenge.task}</p>

                {/* Progress bar */}
                <div className="mb-4 space-y-1.5">
                  <div className="flex justify-between">
                    <span className="font-['Sarabun'] text-xs text-[#1A1207]/45">ภาพ {uploaded}/{challenge.requiredPhotos}</span>
                    <span className="font-['Fahkwang'] text-xs text-[#1A1207]">{Math.round(progress)}%</span>
                  </div>
                  <div className="w-full bg-[#F0EDE0] rounded-full h-2 border border-[#1A1207]/15">
                    <div
                      className="h-2 rounded-full transition-all duration-500"
                      style={{
                        width: `${progress}%`,
                        backgroundColor: status === "done" ? "#00A878" : status === "active" ? "#F5A800" : "#E2D5B0",
                      }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span
                    className="font-['Fahkwang'] text-xs px-3 py-1 rounded-full border border-[#1A1207]"
                    style={{ backgroundColor: sc.bg, color: sc.text }}
                  >
                    {sc.label}
                  </span>
                  {status === "available" && (
                    <button
                      onClick={() => handleAccept(challenge.id)}
                      className="font-['Fahkwang'] text-xs text-white px-4 py-2 rounded-full border-2 border-[#1A1207] flex items-center gap-1.5 bg-[#E8340A]"
                      style={{ boxShadow: "2px 2px 0 #1A1207" }}
                    >
                      รับความท้าทาย →
                    </button>
                  )}
                  {status === "active" && (
                    <button
                      onClick={() => navigate("/lottery/active")}
                      className="font-['Fahkwang'] text-xs text-[#1A1207] px-4 py-2 rounded-full border-2 border-[#1A1207] bg-[#F5A800]"
                      style={{ boxShadow: "2px 2px 0 #1A1207" }}
                    >
                      ดำเนินต่อ →
                    </button>
                  )}
                  {status === "done" && (
                    <span className="font-['Fahkwang'] text-xs text-[#00A878]">สำเร็จแล้ว! 🏆</span>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
