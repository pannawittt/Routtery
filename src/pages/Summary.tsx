import { useNavigate } from "react-router";
import { Check, ArrowRight, Share2, Download, MapIcon } from "lucide-react";
import { Card, PrimaryButton, HexStamp } from "@/components/ui";
import { useAppState } from "@/app/store";
import { checkpoints, lotteryData, modeConfig } from "@/data/constants";
import { useT } from "@/app/hooks/useT";
import { useState, useMemo, useRef, useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import html2canvas from "html2canvas";

// Helper function to calculate distance between two GPS coordinates (Haversine formula)
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Format milliseconds to readable time
function formatDuration(ms: number, lang: "TH" | "EN"): string {
  const minutes = Math.floor(ms / 60000);
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  if (hours > 0) {
    return lang === "TH" ? `${hours} ชม. ${mins} นาที` : `${hours}h ${mins}m`;
  }
  return lang === "TH" ? `${mins} นาที` : `${mins}m`;
}

// Create checkpoint marker icon
function makeCheckpointIcon(num: number, isCompleted: boolean) {
  const bg = isCompleted ? "#00754b" : "#C5D9CC";
  const textColor = isCompleted ? "#fff" : "#12201a";
  const size = 28;

  return L.divIcon({
    className: "",
    html: `
      <div style="
        width:${size}px;height:${size}px;
        background:${bg};border:2px solid #12201a;border-radius:50%;
        display:flex;align-items:center;justify-content:center;
        font-family:'Anuphan',sans-serif;font-size:11px;font-weight:700;
        color:${textColor};
        box-shadow:2px 2px 0 #12201a;
      ">
        ${isCompleted ? "✓" : num + 1}
      </div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size],
  });
}

const stampColors = ["#E8340A", "#F5A800", "#00A878", "#0057B8", "#7B2FBE", "#E8340A"];

const storyCategoryInfo = {
  history: { label: "ประวัติศาสตร์", labelEn: "History", emoji: "📜", color: "#0057B8" },
  funFact: { label: "ข้อเท็จจริง", labelEn: "Fun Fact", emoji: "💡", color: "#F5A800" },
  horror: { label: "เรื่องลี้ลับ", labelEn: "Mystery", emoji: "👻", color: "#E8340A" },
};

export function Summary() {
  const navigate = useNavigate();
  const { originCheckpointId, destinationCheckpointId, mode, modesUsed, completedCheckpoints, lotteryStatuses, storyCategories, lotteryPhotos, lang, startTime, checkpointTimestamps, routeCoordinates } = useAppState();
  const t = useT();
  const [showMap, setShowMap] = useState(false);
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const summaryContentRef = useRef<HTMLDivElement>(null);

  // Look up checkpoint names from IDs
  const originCheckpoint = originCheckpointId !== null ? checkpoints.find(cp => cp.id === originCheckpointId) : null;
  const destinationCheckpoint = destinationCheckpointId !== null ? checkpoints.find(cp => cp.id === destinationCheckpointId) : null;

  const effectiveMode = mode ?? "walk";
  const cfg = modeConfig[effectiveMode];
  const doneLotteries = lotteryData.filter(l => lotteryStatuses[l.id] === "done");
  const completedCount = completedCheckpoints.filter(Boolean).length;
  const distUnit = t.summary.distance === "Distance" ? "km" : "กม.";
  const modeLabel = effectiveMode === "walk" ? t.modes.walk : effectiveMode === "bike" ? t.modes.bike : t.modes.boat;

  // Calculate real distance from GPS coordinates
  const realDistance = useMemo(() => {
    const completedCoords = checkpointTimestamps
      .filter((ts, idx) => ts && completedCheckpoints[idx] && ts.coordinates)
      .map(ts => ts!.coordinates!);

    if (completedCoords.length < 2) return null;

    let totalDistance = 0;
    for (let i = 0; i < completedCoords.length - 1; i++) {
      const curr = completedCoords[i];
      const next = completedCoords[i + 1];
      totalDistance += calculateDistance(curr.lat, curr.lng, next.lat, next.lng);
    }
    return totalDistance;
  }, [checkpointTimestamps, completedCheckpoints]);

  // Calculate real time from timestamps
  const realTime = useMemo(() => {
    if (!startTime) return null;

    const completedTimes = checkpointTimestamps
      .filter((ts, idx) => ts && completedCheckpoints[idx])
      .map(ts => ts!.completedAt);

    if (completedTimes.length === 0) return null;

    const lastTime = Math.max(...completedTimes);
    return lastTime - startTime;
  }, [startTime, checkpointTimestamps, completedCheckpoints]);

  // Display values - use real data if available, otherwise estimate
  const distEstimate = realDistance
    ? `${realDistance.toFixed(1)} ${distUnit}`
    : `~${(completedCount * 0.7).toFixed(1)} ${distUnit}`;

  const timeEstimate = realTime
    ? formatDuration(realTime, lang)
    : `~${completedCount * 15} ${lang === "TH" ? "นาที" : "min"}`;

  const handleShare = async () => {
    const text = `ฉันเพิ่งสำรวจคลองผดุงกรุงเกษมเสร็จแล้ว! ได้ไป ${completedCount} จุด ด้วย${modeLabel} 🎉`;
    if (navigator.share) {
      try {
        await navigator.share({ title: "Routtery - Canal Explorer", text });
      } catch (err) {
        console.log("Share cancelled");
      }
    } else {
      navigator.clipboard.writeText(text);
      alert(lang === "TH" ? "คัดลอกข้อความแล้ว!" : "Text copied!");
    }
  };

  const handleDownload = async () => {
    if (!summaryContentRef.current) return;

    try {
      // Temporarily remove dark class if present to avoid oklch colors
      const htmlEl = document.documentElement;
      const hadDarkClass = htmlEl.classList.contains('dark');
      if (hadDarkClass) {
        htmlEl.classList.remove('dark');
      }

      // Capture the summary content as canvas
      const canvas = await html2canvas(summaryContentRef.current, {
        backgroundColor: "#FFFDF5",
        scale: 2, // Higher quality
        logging: false,
        useCORS: true,
        ignoreElements: (element) => {
          // Skip leaflet map tiles to avoid CORS issues
          return element.classList?.contains('leaflet-tile-pane') ||
                 element.classList?.contains('leaflet-control');
        },
      });

      // Restore dark class if it was present
      if (hadDarkClass) {
        htmlEl.classList.add('dark');
      }

      // Convert canvas to blob
      canvas.toBlob((blob) => {
        if (!blob) return;

        // Create download link
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        const timestamp = new Date().toISOString().slice(0, 10);
        link.download = `routtery-summary-${timestamp}.png`;
        link.href = url;
        link.click();

        // Cleanup
        URL.revokeObjectURL(url);
      }, "image/png");
    } catch (error) {
      console.error("Failed to export image:", error);
      alert(lang === "TH" ? "ไม่สามารถดาวน์โหลดได้" : "Failed to download");
    }
  };

  // Initialize map when shown
  useEffect(() => {
    if (!showMap || !mapContainerRef.current || mapRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [13.751, 100.515],
      zoom: 13,
      zoomControl: true,
      scrollWheelZoom: false,
    });

    L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(map);

    mapRef.current = map;

    // Fit to completed checkpoints
    const completedCoords = checkpoints
      .filter((_, i) => completedCheckpoints[i])
      .map(cp => [cp.lat, cp.lng] as [number, number]);

    if (completedCoords.length > 0) {
      const bounds = L.latLngBounds(completedCoords);
      map.fitBounds(bounds, { padding: [40, 40] });
    }

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [showMap, completedCheckpoints]);

  // Update markers and lines when map is available
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !showMap) return;

    // Clear existing layers except tile layer
    map.eachLayer((layer) => {
      if (layer instanceof L.Marker || layer instanceof L.Polyline) {
        map.removeLayer(layer);
      }
    });

    // Add checkpoint markers
    checkpoints.forEach((cp, i) => {
      const isCompleted = completedCheckpoints[i];
      L.marker([cp.lat, cp.lng], {
        icon: makeCheckpointIcon(i, isCompleted),
      }).addTo(map);
    });

    // Draw lines between completed checkpoints
    const completedIndices = completedCheckpoints
      .map((completed, i) => (completed ? i : -1))
      .filter(i => i !== -1);

    if (completedIndices.length > 1) {
      for (let i = 0; i < completedIndices.length - 1; i++) {
        const currentIdx = completedIndices[i];
        const nextIdx = completedIndices[i + 1];
        const start = checkpoints[currentIdx];
        const end = checkpoints[nextIdx];

        // Background line
        L.polyline([[start.lat, start.lng], [end.lat, end.lng]], {
          color: "#00754b",
          weight: 10,
          opacity: 0.15,
        }).addTo(map);

        // Foreground line
        L.polyline([[start.lat, start.lng], [end.lat, end.lng]], {
          color: "#00754b",
          weight: 4,
          opacity: 0.7,
        }).addTo(map);
      }
    }
  }, [showMap, completedCheckpoints]);

  return (
    <div className="min-h-screen bg-[#FFFDF5]">
      {/* Confetti header */}
      <div
        className="bg-[#EC3FAA] border-b-2 border-[#1A1207] py-10 px-6 text-center relative overflow-hidden"
        style={{ boxShadow: "0 4px 0 #1A1207" }}
      >
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none opacity-10 text-8xl tracking-widest">
          🎉🎊🎉🎊🎉
        </div>
        <h2 className="font-['Anuphan'] text-3xl md:text-4xl font-bold text-[#1A1207] relative z-10">
          {t.summary.congrats}
        </h2>
        <p className="font-['Bai_Jamjuree'] text-[#1A1207]/75 mt-2 relative z-10">
          {completedCount > 0
            ? `${t.summary.completed_n} ${completedCount} ${t.summary.completed_spots}`
            : t.summary.finished}
        </p>
        {originCheckpoint && (
          null
        )}
        {/* Share buttons */}
        <div className="flex gap-2 justify-center mt-4 relative z-10">
          
          
        </div>
      </div>

      <div ref={summaryContentRef} className="max-w-[960px] mx-auto px-4 md:px-6 py-8">
        {/* Map Visualization */}
        <div className="mb-8">
          <button
            onClick={() => setShowMap(!showMap)}
            className="w-full flex items-center justify-between p-4 rounded-2xl border-2 border-[#1A1207] bg-white hover:bg-[#FFFDF5] transition-colors mb-4"
            style={{ boxShadow: "3px 3px 0 #1A1207" }}
          >
            <div className="flex items-center gap-3">
              <MapIcon size={20} className="text-[#E8340A]" />
              <span className="font-['Anuphan'] text-lg font-bold text-[#1A1207]">
                {lang === "TH" ? "แผนที่เส้นทาง" : "Route Map"}
              </span>
            </div>
            <span className="font-['Bai_Jamjuree'] text-sm text-[#1A1207]/60">
              {showMap ? "▲" : "▼"}
            </span>
          </button>
          {showMap && (
            <Card className="p-4 bg-[#E2D5B0]/20">
              <div className="aspect-video bg-white rounded-xl border-2 border-[#1A1207] overflow-hidden relative">
                {completedCount > 0 ? (
                  <div ref={mapContainerRef} className="w-full h-full" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-center p-4">
                      <MapIcon size={48} className="text-[#E8340A] mx-auto mb-2 opacity-30" />
                      <p className="font-['Bai_Jamjuree'] text-sm text-[#1A1207]/50">
                        {lang === "TH" ? "ยังไม่มีจุดที่เสร็จสมบูรณ์" : "No completed checkpoints yet"}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          )}
        </div>
        <div className="flex flex-col md:flex-row gap-8">
          {/* Left: stats + lottery badges */}
          <div className="flex-1">
            <h3 className="font-['Anuphan'] text-xl font-bold text-[#1A1207] mb-4">{t.summary.route_stats}</h3>
            <div className="grid grid-cols-2 gap-4 mb-8">
              {[
                { label: t.summary.distance, value: distEstimate, icon: "📍", color: "#E8340A" },
                { label: t.summary.time_spent, value: timeEstimate, icon: "⏱", color: "#F5A800" },
                { label: t.summary.checkpoints_done, value: `${completedCount}`, icon: "🏁", color: "#00A878" },
              ].map(stat => (
                <Card key={stat.label} className="p-4">
                  <div className="text-2xl mb-2">{stat.icon}</div>
                  <div className="font-['Anuphan'] text-xl font-bold" style={{ color: stat.color }}>{stat.value}</div>
                  <div className="font-['Bai_Jamjuree'] text-xs text-[#1A1207]/50 mt-0.5 leading-tight">{stat.label}</div>
                </Card>
              ))}
              <Card className="p-4">
                <div className="text-2xl mb-2 flex gap-1">
                  {modesUsed.length > 0 ? modesUsed.map((m, i) => <span key={i}>{modeConfig[m].emoji}</span>) : cfg.emoji}
                </div>
                <div className="font-['Anuphan'] text-xl font-bold flex flex-wrap gap-1" style={{ color: cfg.color }}>
                  {modesUsed.length > 0
                    ? modesUsed.map((m, i) => {
                        const label = m === "walk" ? t.modes.walk : m === "bike" ? t.modes.bike : t.modes.boat;
                        return <span key={i}>{label}{i < modesUsed.length - 1 ? "," : ""}</span>;
                      })
                    : modeLabel
                  }
                </div>
                <div className="font-['Bai_Jamjuree'] text-xs text-[#1A1207]/50 mt-0.5 leading-tight">{t.nav.title_mode.split(" ")[0]}</div>
              </Card>
            </div>

            {/* Lottery badges */}
            <h3 className="font-['Anuphan'] text-xl font-bold text-[#1A1207] mb-4">
              {t.summary.lottery_badges} {doneLotteries.length > 0 ? `(${doneLotteries.length})` : ""}
            </h3>
            {doneLotteries.length > 0 ? (
              <div className="space-y-3">
                {doneLotteries.map(item => {
                  const photos = lotteryPhotos[item.id] || [];
                  return (
                    <div key={item.id} className="bg-white border-2 border-[#1A1207] rounded-2xl p-3" style={{ boxShadow: "2px 2px 0 #1A1207" }}>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-4 h-4 rounded-full bg-[#F5A800] flex items-center justify-center border border-[#1A1207]">
                          <Check size={9} className="text-[#1A1207]" strokeWidth={3} />
                        </div>
                        <span className="font-['Anuphan'] text-sm text-[#1A1207] font-bold">{item.name}</span>
                      </div>
                      <p className="font-['Bai_Jamjuree'] text-xs text-[#1A1207]/60 mb-2">{item.task}</p>
                      {photos.length > 0 && (
                        <div className="grid grid-cols-3 gap-2">
                          {photos.map((photo, i) => (
                            <div key={i} className="aspect-square rounded-lg border-2 border-[#E2D5B0] bg-[#F0EDE0] overflow-hidden">
                              <img
                                src={photo}
                                alt={`Photo ${i + 1} for ${item.name}`}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="font-['Bai_Jamjuree'] text-sm text-[#1A1207]/40">{t.summary.lottery_badges} — 0</p>
            )}
          </div>

          {/* Right: checkpoint timeline + stamp preview */}
          <div className="flex-1">
            <h3 className="font-['Anuphan'] text-xl font-bold text-[#1A1207] mb-4">{t.summary.checkpoints_done}</h3>
            <div className="relative pl-5">
              <div className="absolute left-5 top-4 bottom-4 w-0.5 bg-[#E2D5B0]" />
              <div className="space-y-4">
                {checkpoints.map((cp, i) => {
                  const done = completedCheckpoints[i];
                  const category = storyCategories[i];
                  const categoryInfo = category ? storyCategoryInfo[category] : null;
                  const timestamp = checkpointTimestamps[i];
                  const completedTime = timestamp ? new Date(timestamp.completedAt) : null;

                  return (
                    <div key={cp.id} className={`flex items-start gap-4 relative ${!done ? "opacity-40" : ""}`}>
                      <div
                        className="w-10 h-10 rounded-full border-2 border-[#1A1207] flex items-center justify-center flex-shrink-0 relative z-10"
                        style={{ backgroundColor: done ? stampColors[i] : "#F0EDE0", color: done ? "white" : "#1A1207" }}
                      >
                        {done ? <Check size={14} strokeWidth={3} /> : <span className="font-['Anuphan'] text-xs">{i + 1}</span>}
                      </div>
                      <div className="pt-2 flex-1">
                        <div className="font-['Anuphan'] text-sm font-bold text-[#1A1207]">{cp.name}</div>
                        <div className="font-['Bai_Jamjuree'] text-xs text-[#1A1207]/45">{cp.subtitle}</div>
                        {completedTime && (
                          <div className="font-['Bai_Jamjuree'] text-[10px] text-[#1A1207]/35 mt-0.5">
                            {completedTime.toLocaleTimeString(lang === "TH" ? "th-TH" : "en-US", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </div>
                        )}
                        {categoryInfo && (
                          <div className="mt-1 flex items-center gap-1">
                            <span>{categoryInfo.emoji}</span>
                            <span className="font-['Bai_Jamjuree'] text-[10px]" style={{ color: categoryInfo.color }}>
                              {lang === "TH" ? categoryInfo.label : categoryInfo.labelEn}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Stamp teaser */}
            <div className="mt-8">
              <h3 className="font-['Anuphan'] text-base font-bold text-[#1A1207] mb-4">{t.summary.stamps_collected}</h3>
              <div className="flex gap-3 flex-wrap">
                {checkpoints.map((cp, i) => (
                  <HexStamp
                    key={cp.id}
                    collected={completedCheckpoints[i]}
                    color={stampColors[i]}
                    label={cp.name}
                    size="small"
                    checkpointId={cp.id}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 flex justify-center">
          <PrimaryButton onClick={() => navigate("/stamps")} className="px-10 py-4 text-base flex items-center gap-2">
            {t.stamps.title} <ArrowRight size={18} />
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
}
