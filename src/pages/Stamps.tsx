import { useState } from "react";
import { Check, Award } from "lucide-react";
import { Card, HexStamp } from "@/components/ui";
import { useAppState } from "@/app/store";
import { checkpoints, lotteryData } from "@/data/constants";
import { useT } from "@/app/hooks/useT";

const stampColors = ["#E8340A", "#F5A800", "#00A878", "#0057B8", "#7B2FBE", "#E8340A"];
const stampDates = ["15 พ.ค. 2567", "15 พ.ค. 2567", "15 พ.ค. 2567", "15 พ.ค. 2567", "", ""];

const challengeColors = ["#00A878", "#F5A800", "#E8340A", "#7B2FBE", "#0057B8", "#E8340A", "#00A878", "#F5A800", "#0057B8", "#F5A800", "#E8340A", "#0057B8", "#00A878", "#7B2FBE"];

type TabType = "checkpoints" | "challenges";

export function Stamps() {
  const state = useAppState();
  const { completedCheckpoints, lotteryStatuses, modesUsed, checkpointAnswers } = state;
  const t = useT();
  const [activeTab, setActiveTab] = useState<TabType>("checkpoints");
  const [selected, setSelected] = useState<number>(0);
  const [selectedChallenge, setSelectedChallenge] = useState<number>(0);
  const [sheetOpen, setSheetOpen] = useState(false);

  const stamps = checkpoints.map((cp, i) => ({
    ...cp,
    collected: completedCheckpoints[i],
    color: stampColors[i],
    date: stampDates[i],
  }));

  // Map lottery challenges to stamps - collected if lottery status is "done"
  const challenges = lotteryData.map((lottery, i) => ({
    id: lottery.id,
    name: lottery.name,
    task: lottery.task,
    requiredPhotos: lottery.requiredPhotos,
    methods: lottery.methods,
    collected: lotteryStatuses[lottery.id] === "done",
    color: challengeColors[i % challengeColors.length],
    photos: state.lotteryPhotos[lottery.id] || [],
  }));

  const sel = stamps[selected];
  const selChallenge = challenges[selectedChallenge];
  const collectedCount = stamps.filter(s => s.collected).length;
  const challengeCollectedCount = challenges.filter(c => c.collected).length;

  const handleSelect = (i: number) => {
    setSelected(i);
    setSheetOpen(true);
  };

  const handleSelectChallenge = (i: number) => {
    setSelectedChallenge(i);
    setSheetOpen(true);
  };

  const currentCount = activeTab === "checkpoints" ? collectedCount : challengeCollectedCount;
  const totalCount = activeTab === "checkpoints" ? stamps.length : challenges.length;

  return (
    <div className="min-h-screen bg-[#FFFDF5]">
      <div className="max-w-[960px] mx-auto px-4 md:px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-['Anuphan'] text-3xl font-bold text-[#1A1207]">{t.stamps.title}</h2>
            <p className="font-['Bai_Jamjuree'] text-[#1A1207]/55 mt-1 text-sm">
              {t.stamps.collected} {currentCount} / {totalCount} {t.stamps.of_stamps}
            </p>
          </div>
          {/* Progress bar */}
          <div className="hidden md:block w-40">
            <div className="w-full bg-[#E2D5B0] rounded-full h-2.5 border border-[#1A1207]/20">
              <div
                className="bg-[#E8340A] h-2.5 rounded-full transition-all"
                style={{ width: `${(currentCount / totalCount) * 100}%` }}
              />
            </div>
            <div className="font-['Bai_Jamjuree'] text-xs text-[#1A1207]/45 mt-1 text-right">{Math.round((currentCount / totalCount) * 100)}%</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 border-b-2 border-[#E2D5B0]">
          <button
            onClick={() => setActiveTab("checkpoints")}
            className={`font-['Anuphan'] px-6 py-3 transition-all ${
              activeTab === "checkpoints"
                ? "text-[#E8340A] border-b-2 border-[#E8340A] -mb-[2px]"
                : "text-[#1A1207]/40 hover:text-[#1A1207]/70"
            }`}
          >
            {t.stamps.tab_checkpoints}
          </button>
          <button
            onClick={() => setActiveTab("challenges")}
            className={`font-['Anuphan'] px-6 py-3 transition-all flex items-center gap-2 ${
              activeTab === "challenges"
                ? "text-[#E8340A] border-b-2 border-[#E8340A] -mb-[2px]"
                : "text-[#1A1207]/40 hover:text-[#1A1207]/70"
            }`}
          >
            <Award size={18} />
            {t.stamps.tab_challenges}
          </button>
        </div>

        {activeTab === "checkpoints" ? (
          <div className="flex flex-col md:flex-row gap-8">
            {/* Stamp grid — 3 columns */}
            <div className="flex-1">
              <div className="grid grid-cols-3 gap-4 md:gap-6 justify-items-center">
                {stamps.map((stamp, i) => (
                  <button
                    key={stamp.id}
                    onClick={() => handleSelect(i)}
                    className={`focus:outline-none transition-transform duration-200 ${selected === i && activeTab === "checkpoints" ? "scale-110" : "hover:scale-105"}`}
                  >
                    <HexStamp
                      collected={stamp.collected}
                      color={stamp.color}
                      label={stamp.name}
                      checkpointId={stamp.id}
                    />
                  </button>
                ))}
              </div>
              <p className="font-['Bai_Jamjuree'] text-xs text-center text-[#1A1207]/35 mt-6">
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
                <h3 className="font-['Anuphan'] text-xl font-bold text-[#1A1207] mb-1">{sel.name}</h3>
                <p className="font-['Bai_Jamjuree'] text-xs text-[#1A1207]/45 mb-3">{sel.subtitle}</p>
                {sel.collected ? (
                  <>
                    {sel.date && (
                      <div className="font-['Bai_Jamjuree'] text-xs text-[#1A1207]/40 mb-3">{t.stamps.collected_on} {sel.date}</div>
                    )}
                    <p className="font-['Bai_Jamjuree'] text-sm text-[#1A1207]/70 leading-relaxed">{sel.teaser}</p>
                    <div className="mt-5 pt-4 border-t border-[#E2D5B0]">
                      <div className="font-['Anuphan'] text-sm text-[#00A878] flex items-center gap-1.5">
                        <Check size={14} /> {t.stamps.collected}
                      </div>
                    </div>
                  </>
                ) : (
                  <p className="font-['Bai_Jamjuree'] text-sm text-[#1A1207]/35 leading-relaxed">
                    {t.stamps.locked}<br />
                    <span className="text-xs">{t.stamps.explore_hint}</span>
                  </p>
                )}
              </Card>
            </div>
          </div>
        ) : (
          <div className="flex flex-col md:flex-row gap-8">
            {/* Challenge grid — 3 columns */}
            <div className="flex-1">
              <div className="grid grid-cols-3 gap-4 md:gap-6 justify-items-center">
                {challenges.map((challenge, i) => (
                  <button
                    key={challenge.id}
                    onClick={() => handleSelectChallenge(i)}
                    className={`focus:outline-none transition-transform duration-200 ${selectedChallenge === i && activeTab === "challenges" ? "scale-110" : "hover:scale-105"}`}
                  >
                    <div className="flex flex-col items-center">
                      <div
                        className="w-20 h-20 md:w-24 md:h-24 rounded-full border-2 border-[#1A1207] flex items-center justify-center text-3xl transition-all"
                        style={{
                          backgroundColor: challenge.collected ? challenge.color : "#F0EDE0",
                          boxShadow: "3px 3px 0 #1A1207",
                          opacity: challenge.collected ? 1 : 0.4,
                        }}
                      >
                        {challenge.collected ? <Award size={32} strokeWidth={2.5} className="text-[#FFFDF5]" /> : "?"}
                      </div>
                      <span className="font-['Bai_Jamjuree'] text-xs text-[#1A1207]/70 mt-2 text-center max-w-[80px]">
                        {challenge.name}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
              <p className="font-['Bai_Jamjuree'] text-xs text-center text-[#1A1207]/35 mt-6">
                {t.stamps.collected_on === "สะสมเมื่อ" ? "แตะตราประทับเพื่อดูรายละเอียด" : "Tap a stamp to view details"}
              </p>
            </div>

            {/* Challenge detail panel — desktop */}
            <div className="hidden md:block w-72 flex-shrink-0">
              <Card className="p-6 sticky top-20">
                <div
                  className="w-14 h-14 rounded-2xl border-2 border-[#1A1207] flex items-center justify-center text-2xl mb-4"
                  style={{
                    backgroundColor: selChallenge.collected ? selChallenge.color : "#F0EDE0",
                    boxShadow: "3px 3px 0 #1A1207",
                  }}
                >
                  {selChallenge.collected ? <Award size={28} strokeWidth={2.5} className="text-[#FFFDF5]" /> : "?"}
                </div>
                <h3 className="font-['Anuphan'] text-xl font-bold text-[#1A1207] mb-1">{selChallenge.name}</h3>
                <p className="font-['Bai_Jamjuree'] text-xs text-[#1A1207]/45 mb-3">{t.lottery.challenge_label}</p>
                {selChallenge.collected ? (
                  <>
                    <div className="bg-[#F0EDE0] rounded-lg p-3 mb-3">
                      <div className="font-['Anuphan'] text-xs text-[#1A1207]/50 mb-1">{t.lottery.task}</div>
                      <div className="font-['Bai_Jamjuree'] text-sm text-[#1A1207]">{selChallenge.task}</div>
                    </div>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="font-['Anuphan'] text-xs text-[#1A1207]/50">{t.lottery.photos_left}:</span>
                      <span className="font-['Bai_Jamjuree'] text-sm text-[#1A1207]">
                        {selChallenge.photos.length} / {selChallenge.requiredPhotos}
                      </span>
                    </div>
                    {selChallenge.photos.length > 0 && (
                      <div className="grid grid-cols-3 gap-2 mb-4">
                        {selChallenge.photos.slice(0, 6).map((photo, idx) => (
                          <div key={idx} className="aspect-square rounded-lg overflow-hidden border border-[#1A1207]/20">
                            <img src={photo} alt={`Photo ${idx + 1}`} className="w-full h-full object-cover" />
                          </div>
                        ))}
                      </div>
                    )}
                    <div className="mt-5 pt-4 border-t border-[#E2D5B0]">
                      <div className="font-['Anuphan'] text-sm text-[#00A878] flex items-center gap-1.5">
                        <Check size={14} /> {t.stamps.collected}
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="bg-[#F0EDE0] rounded-lg p-3 mb-3">
                      <div className="font-['Anuphan'] text-xs text-[#1A1207]/50 mb-1">{t.lottery.task}</div>
                      <div className="font-['Bai_Jamjuree'] text-sm text-[#1A1207]/40">{selChallenge.task}</div>
                    </div>
                    <div className="flex items-center gap-2 mb-4">
                      <span className="font-['Anuphan'] text-xs text-[#1A1207]/50">{t.lottery.photos_left}:</span>
                      <span className="font-['Bai_Jamjuree'] text-sm text-[#1A1207]/40">
                        {selChallenge.requiredPhotos} {t.stamps.of_stamps}
                      </span>
                    </div>
                    <p className="font-['Bai_Jamjuree'] text-sm text-[#1A1207]/35 leading-relaxed">
                      {t.stamps.challenge_locked}<br />
                      <span className="text-xs">{t.stamps.challenge_hint}</span>
                    </p>
                  </>
                )}
              </Card>
            </div>
          </div>
        )}
      </div>

      {/* Mobile bottom sheet */}
      {sheetOpen && activeTab === "checkpoints" && (
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
                <h3 className="font-['Anuphan'] text-lg font-bold text-[#1A1207]">{sel.name}</h3>
                <p className="font-['Bai_Jamjuree'] text-xs text-[#1A1207]/45">{sel.subtitle}</p>
              </div>
            </div>
            {sel.collected ? (
              <>
                {sel.date && <p className="font-['Bai_Jamjuree'] text-xs text-[#1A1207]/40 mb-2">{t.stamps.collected_on} {sel.date}</p>}
                <p className="font-['Bai_Jamjuree'] text-sm text-[#1A1207]/70 leading-relaxed">{sel.teaser}</p>
                <div className="mt-4 font-['Anuphan'] text-sm text-[#00A878] flex items-center gap-1.5">
                  <Check size={13} /> {t.stamps.collected}
                </div>
              </>
            ) : (
              <p className="font-['Bai_Jamjuree'] text-sm text-[#1A1207]/40">{t.stamps.locked}</p>
            )}
            <button
              onClick={() => setSheetOpen(false)}
              className="mt-6 w-full font-['Bai_Jamjuree'] text-sm text-[#1A1207]/50 py-3 border-t border-[#E2D5B0]"
            >
              ปิด
            </button>
          </div>
        </div>
      )}

      {/* Mobile bottom sheet for challenges */}
      {sheetOpen && activeTab === "challenges" && (
        <div className="md:hidden fixed inset-0 z-[200] flex items-end">
          <div className="absolute inset-0 bg-[#1A1207]/40" onClick={() => setSheetOpen(false)} />
          <div
            className="relative w-full bg-[#FFFDF5] border-t-2 border-[#1A1207] rounded-t-3xl p-6 z-10 max-h-[80vh] overflow-y-auto"
            style={{ boxShadow: "0 -6px 0 #1A1207" }}
          >
            <div className="w-10 h-1 bg-[#E2D5B0] rounded-full mx-auto mb-5" />
            <div className="flex items-center gap-4 mb-4">
              <div
                className="w-12 h-12 rounded-xl border-2 border-[#1A1207] flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: selChallenge.collected ? selChallenge.color : "#F0EDE0", boxShadow: "2px 2px 0 #1A1207" }}
              >
                {selChallenge.collected ? <Award size={24} strokeWidth={2.5} className="text-[#FFFDF5]" /> : "?"}
              </div>
              <div>
                <h3 className="font-['Anuphan'] text-lg font-bold text-[#1A1207]">{selChallenge.name}</h3>
                <p className="font-['Bai_Jamjuree'] text-xs text-[#1A1207]/45">{t.lottery.challenge_label}</p>
              </div>
            </div>
            <div className="bg-[#F0EDE0] rounded-lg p-3 mb-3">
              <div className="font-['Anuphan'] text-xs text-[#1A1207]/50 mb-1">{t.lottery.task}</div>
              <div className={`font-['Bai_Jamjuree'] text-sm ${selChallenge.collected ? "text-[#1A1207]" : "text-[#1A1207]/40"}`}>
                {selChallenge.task}
              </div>
            </div>
            <div className="flex items-center gap-2 mb-3">
              <span className="font-['Anuphan'] text-xs text-[#1A1207]/50">{t.lottery.photos_left}:</span>
              <span className={`font-['Bai_Jamjuree'] text-sm ${selChallenge.collected ? "text-[#1A1207]" : "text-[#1A1207]/40"}`}>
                {selChallenge.collected ? `${selChallenge.photos.length} / ${selChallenge.requiredPhotos}` : `${selChallenge.requiredPhotos} ${t.stamps.of_stamps}`}
              </span>
            </div>
            {selChallenge.collected && selChallenge.photos.length > 0 && (
              <div className="grid grid-cols-3 gap-2 mb-4">
                {selChallenge.photos.slice(0, 6).map((photo, idx) => (
                  <div key={idx} className="aspect-square rounded-lg overflow-hidden border border-[#1A1207]/20">
                    <img src={photo} alt={`Photo ${idx + 1}`} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            )}
            {selChallenge.collected ? (
              <div className="mt-4 font-['Anuphan'] text-sm text-[#00A878] flex items-center gap-1.5">
                <Check size={13} /> {t.stamps.collected}
              </div>
            ) : (
              <p className="font-['Bai_Jamjuree'] text-sm text-[#1A1207]/40">{t.stamps.challenge_locked}</p>
            )}
            <button
              onClick={() => setSheetOpen(false)}
              className="mt-6 w-full font-['Bai_Jamjuree'] text-sm text-[#1A1207]/50 py-3 border-t border-[#E2D5B0]"
            >
              ปิด
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
