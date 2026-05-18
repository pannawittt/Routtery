import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Navigation, ArrowRight, X, ChevronRight, MapPin, Utensils } from "lucide-react";
import { useAppState } from "@/app/store";
import { checkpoints, modeConfig, places, PlaceData } from "@/data/constants";
import { motion, AnimatePresence } from "motion/react";
import { useT } from "@/app/hooks/useT";

// ─── CANAL ROUTE ───────────────────────────────────────────────────────────────
// Updated path along Khlong Phaduong Krung Kasem matching actual checkpoint coordinates

const CANAL_PATH: [number, number][] = [
  [13.7322126, 100.5150767], // ตลาดน้อย
  [13.735, 100.5153],
  [13.738095, 100.515669],   // หัวลำโพง
  [13.7420, 100.5165],
  [13.7460, 100.5172],
  [13.7500, 100.5175],
  [13.751483, 100.517557],   // โบ๊เบ๊ / นางเลิ้ง
  [13.7540, 100.5170],
  [13.756622, 100.516321],   // สถานที่ราชการ
  [13.7600, 100.5120],
  [13.7640, 100.5070],
  [13.7680, 100.5050],
  [13.769756, 100.503858],   // เทเวศร์
];

const MAP_CENTER: [number, number] = [13.751, 100.515];

const CATEGORY_COLOR: Record<string, string> = {
  food: "#E8340A",
  cafe: "#7B2FBE",
  shop: "#0057B8",
  temple: "#F5A800",
};

// ─── CUSTOM MARKER ICONS ───────────────────────────────────────────────────────

function makeCheckpointIcon(
  num: number,
  color: string,
  state: "done" | "current" | "upcoming"
) {
  const bg = state === "done" ? "#00A878" : state === "current" ? color : "#E2D5B0";
  const textColor = state === "upcoming" ? "#1A1207" : "#fff";
  const border = state === "current" ? `3px solid ${color}` : "2px solid #1A1207";
  const shadow = state === "current" ? `0 0 0 3px ${color}40` : "";
  const size = state === "current" ? 42 : 34;

  return L.divIcon({
    className: "",
    html: `
      <div style="
        width:${size}px;height:${size}px;
        background:${bg};border:${border};border-radius:50%;
        display:flex;align-items:center;justify-content:center;
        font-family:'Fahkwang',sans-serif;font-size:${state === "current" ? 14 : 12}px;font-weight:700;
        color:${textColor};
        box-shadow:2px 2px 0 #1A1207${shadow ? `,${shadow}` : ""};
        position:relative;
      ">
        ${state === "done" ? "✓" : num + 1}
        ${state === "current" ? `<div style="position:absolute;bottom:-8px;left:50%;transform:translateX(-50%);width:0;height:0;border-left:5px solid transparent;border-right:5px solid transparent;border-top:8px solid #1A1207;"></div>` : ""}
      </div>`,
    iconSize: [size, size + (state === "current" ? 8 : 0)],
    iconAnchor: [size / 2, size + (state === "current" ? 8 : 0)],
  });
}

function makePlaceIcon(emoji: string, category: string) {
  const color = CATEGORY_COLOR[category] ?? "#1A1207";
  return L.divIcon({
    className: "",
    html: `
      <div style="
        width:32px;height:32px;
        background:white;border:2px solid ${color};border-radius:50%;
        display:flex;align-items:center;justify-content:center;
        font-size:14px;
        box-shadow:2px 2px 0 #1A1207;
        position:relative;
      ">
        ${emoji}
        <div style="
          position:absolute;bottom:-5px;left:50%;transform:translateX(-50%);
          width:0;height:0;border-left:4px solid transparent;border-right:4px solid transparent;border-top:5px solid ${color};
        "></div>
      </div>`,
    iconSize: [32, 37],
    iconAnchor: [16, 37],
  });
}

function makeUserIcon() {
  return L.divIcon({
    className: "",
    html: `
      <div style="position:relative;width:20px;height:20px;">
        <div style="
          position:absolute;inset:0;
          background:#1a73e8;border-radius:50%;
          border:2.5px solid white;
          box-shadow:0 2px 6px rgba(0,0,0,0.35);
          z-index:2;
        "></div>
        <div style="
          position:absolute;top:-8px;left:-8px;right:-8px;bottom:-8px;
          background:#1a73e840;border-radius:50%;
          animation:pulse-ring 1.6s ease-out infinite;
          z-index:1;
        "></div>
      </div>`,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  });
}

// Inject pulse keyframe once
if (typeof document !== "undefined" && !document.getElementById("map-pulse-style")) {
  const style = document.createElement("style");
  style.id = "map-pulse-style";
  style.textContent = `
    @keyframes pulse-ring {
      0% { transform: scale(0.6); opacity: 0.9; }
      80%, 100% { transform: scale(1.8); opacity: 0; }
    }
  `;
  document.head.appendChild(style);
}

// ─── DISTANCE UTIL ─────────────────────────────────────────────────────────────

function haversineKm(a: [number, number], b: [number, number]) {
  const R = 6371;
  const dLat = ((b[0] - a[0]) * Math.PI) / 180;
  const dLng = ((b[1] - a[1]) * Math.PI) / 180;
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((a[0] * Math.PI) / 180) *
      Math.cos((b[0] * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
}

function formatDist(km: number) {
  return km < 1 ? `${Math.round(km * 1000)} ม.` : `${km.toFixed(1)} กม.`;
}

// ─── CHECKPOINT PANEL ──────────────────────────────────────────────────────────

function CheckpointPanel({
  cp, idx, state, modeColor, onClose, onExplore, t,
}: {
  cp: typeof checkpoints[0];
  idx: number;
  state: "done" | "current" | "upcoming";
  modeColor: string;
  onClose: () => void;
  onExplore: () => void;
  t: ReturnType<typeof useT>;
}) {
  const stateLabel = state === "done" ? `✓ ${t.map.done}` : state === "current" ? t.map.current : t.map.upcoming;
  const stateColor = state === "done" ? "#00A878" : state === "current" ? modeColor : "#1A1207";

  return (
    <motion.div
      className="absolute bottom-0 left-0 right-0 z-[400] bg-[#FFFDF5] rounded-t-[24px] border-t-2 border-x-2 border-[#1A1207] overflow-hidden"
      style={{ boxShadow: "0 -4px 0 #1A1207" }}
      initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
      transition={{ type: "spring", stiffness: 320, damping: 30 }}
    >
      <div className="flex justify-center pt-3 pb-1">
        <div className="w-8 h-1 rounded-full bg-[#E2D5B0]" />
      </div>
      <div className="relative h-36 overflow-hidden mx-4 rounded-2xl border-2 border-[#1A1207] mb-4" style={{ boxShadow: "3px 3px 0 #1A1207" }}>
        <img src={cp.image} alt={cp.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1A1207]/60 to-transparent" />
        <div className="absolute bottom-3 left-3 right-10">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-white/30 mb-1" style={{ backgroundColor: `${stateColor}cc` }}>
            <span className="font-['Sarabun'] text-white text-[10px]">{stateLabel}</span>
          </div>
          <h3 className="font-['Fahkwang'] text-white text-xl font-bold drop-shadow">{cp.name}</h3>
          <p className="font-['Sarabun'] text-white/70 text-xs">{cp.subtitle}</p>
        </div>
        <button onClick={onClose} className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center">
          <X size={13} className="text-white" />
        </button>
      </div>
      <div className="px-4 mb-4">
        <p className="font-['Sarabun'] text-[#1A1207]/65 text-sm leading-relaxed">{cp.teaser}</p>
      </div>
      <div className="px-4 pb-6">
        {state === "current" ? (
          <button onClick={onExplore} className="w-full font-['Fahkwang'] text-sm text-white py-3.5 rounded-full border-2 border-[#1A1207] flex items-center justify-center gap-2" style={{ backgroundColor: modeColor, boxShadow: "3px 3px 0 #1A1207" }}>
            {t.map.go_here} <ArrowRight size={16} />
          </button>
        ) : state === "done" ? (
          <div className="w-full font-['Fahkwang'] text-sm py-3.5 rounded-full border-2 border-[#1A1207] flex items-center justify-center gap-2" style={{ backgroundColor: "#00A87815", color: "#00A878" }}>
            {t.map.already_done} {idx + 1}
          </div>
        ) : (
          <div className="w-full font-['Sarabun'] text-sm text-[#1A1207]/45 py-3.5 rounded-full border-2 border-[#E2D5B0] flex items-center justify-center gap-2 bg-white">
            {t.map.not_yet}
          </div>
        )}
      </div>
    </motion.div>
  );
}

// ─── PLACE PANEL ───────────────────────────────────────────────────────────────

function PlacePanel({ place, onClose, t }: { place: PlaceData; onClose: () => void; t: ReturnType<typeof useT> }) {
  const color = CATEGORY_COLOR[place.category] ?? "#1A1207";
  const isEN = t.map.canal_name !== "คลองผดุงกรุงเกษม";
  const categoryLabel: Record<string, string> = isEN
    ? { food: "Food", cafe: "Café", shop: "Shop", temple: "Temple" }
    : { food: "อาหาร", cafe: "คาเฟ่", shop: "ร้านค้า", temple: "วัด" };

  return (
    <motion.div
      className="absolute bottom-0 left-0 right-0 z-[400] bg-[#FFFDF5] rounded-t-[24px] border-t-2 border-x-2 border-[#1A1207] overflow-hidden"
      style={{ boxShadow: "0 -4px 0 #1A1207" }}
      initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
      transition={{ type: "spring", stiffness: 320, damping: 30 }}
    >
      <div className="flex justify-center pt-3 pb-1">
        <div className="w-8 h-1 rounded-full bg-[#E2D5B0]" />
      </div>
      <div className="px-4 pb-6">
        <div className="flex items-start gap-3">
          <div className="w-14 h-14 rounded-2xl border-2 border-[#1A1207] flex items-center justify-center flex-shrink-0 text-2xl" style={{ backgroundColor: `${color}15`, boxShadow: "2px 2px 0 #1A1207" }}>
            {place.emoji}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <span className="font-['Fahkwang'] text-xs px-2 py-0.5 rounded-full border border-[#1A1207]" style={{ backgroundColor: `${color}20`, color }}>
                {categoryLabel[place.category]}
              </span>
            </div>
            <h3 className="font-['Fahkwang'] text-lg font-bold text-[#1A1207] leading-tight">{place.name}</h3>
            <p className="font-['Sarabun'] text-xs text-[#1A1207]/50">{place.nameEn}</p>
          </div>
          <button onClick={onClose} className="w-7 h-7 rounded-full border-2 border-[#1A1207] flex items-center justify-center flex-shrink-0 bg-white">
            <X size={13} className="text-[#1A1207]" />
          </button>
        </div>
        <p className="font-['Sarabun'] text-sm text-[#1A1207]/70 leading-relaxed mt-3">
          {place.description}
        </p>
        <div className="mt-3 flex items-center gap-1.5">
          <MapPin size={12} style={{ color }} />
          <span className="font-['Sarabun'] text-xs text-[#1A1207]/50">
            {t.map.near_checkpoint} {place.nearCheckpoint + 1} — {checkpoints[place.nearCheckpoint].name}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────

export function MapView() {
  const navigate = useNavigate();
  const { mode, currentCheckpoint, completedCheckpoints } = useAppState();
  const t = useT();
  const effectiveMode = mode ?? "walk";
  const cfg = modeConfig[effectiveMode];

  const [selected, setSelected] = useState<number | null>(null);
  const [selectedPlace, setSelectedPlace] = useState<PlaceData | null>(null);
  const [showPlaces, setShowPlaces] = useState(true);
  const [userLatLng, setUserLatLng] = useState<[number, number] | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);

  const mapRef = useRef<L.Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const placeMarkersRef = useRef<L.Marker[]>([]);
  const userMarkerRef = useRef<L.Marker | null>(null);
  const watchIdRef = useRef<number | null>(null);
  const pathLinesRef = useRef<L.Polyline[]>([]);

  const completedCount = completedCheckpoints.filter(Boolean).length;
  const selectedCp = selected !== null ? checkpoints[selected] : null;
  const selectedState = selected !== null
    ? completedCheckpoints[selected] ? "done" : selected === currentCheckpoint ? "current" : "upcoming"
    : null;

  const currentCp = checkpoints[currentCheckpoint];
  const distToCurrentCp = userLatLng
    ? haversineKm(userLatLng, [currentCp.lat, currentCp.lng])
    : null;

  // Initialize map
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      center: MAP_CENTER,
      zoom: 14,
      zoomControl: false,
    });

    L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>',
      maxZoom: 19,
    }).addTo(map);

    const bounds = L.latLngBounds(checkpoints.map(cp => [cp.lat, cp.lng]));
    map.fitBounds(bounds, { padding: [52, 52] });

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Watch user location
  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationError("UNSUPPORTED");
      return;
    }

    watchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        setUserLatLng([pos.coords.latitude, pos.coords.longitude]);
        setLocationError(null);
      },
      (err) => {
        if (err.code === 1) setLocationError("DENIED");
      },
      { enableHighAccuracy: true, maximumAge: 5000 }
    );

    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, []);

  // Update user location marker
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    if (userMarkerRef.current) {
      userMarkerRef.current.remove();
      userMarkerRef.current = null;
    }

    if (userLatLng) {
      userMarkerRef.current = L.marker(userLatLng, {
        icon: makeUserIcon(),
        zIndexOffset: 1000,
      }).addTo(map);
    }
  }, [userLatLng]);

  // Update checkpoint markers
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];

    checkpoints.forEach((cp, i) => {
      const state = completedCheckpoints[i] ? "done" : i === currentCheckpoint ? "current" : "upcoming";
      const marker = L.marker([cp.lat, cp.lng], { icon: makeCheckpointIcon(i, cfg.color, state) })
        .addTo(map)
        .on("click", () => { setSelected(i); setSelectedPlace(null); });
      markersRef.current.push(marker);
    });
  }, [cfg.color, currentCheckpoint, completedCheckpoints]);

  // Update path lines based on completed checkpoints
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Remove existing path lines
    pathLinesRef.current.forEach(line => line.remove());
    pathLinesRef.current = [];

    // Draw lines between checkpoints
    for (let i = 0; i < checkpoints.length - 1; i++) {
      const currentCp = checkpoints[i];
      const nextCp = checkpoints[i + 1];
      const segment: [number, number][] = [[currentCp.lat, currentCp.lng], [nextCp.lat, nextCp.lng]];

      // Determine if this segment is completed (both checkpoints are done)
      const isCompleted = completedCheckpoints[i] && completedCheckpoints[i + 1];
      const isCurrentSegment = i === currentCheckpoint || i + 1 === currentCheckpoint;

      // Background line (wider, lighter)
      const bgLine = L.polyline(segment, {
        color: isCompleted ? "#00754b" : isCurrentSegment ? cfg.color : "#C5D9CC",
        weight: 12,
        opacity: isCompleted ? 0.15 : 0.08,
      }).addTo(map);
      pathLinesRef.current.push(bgLine);

      // Foreground line (narrower, more visible)
      const fgLine = L.polyline(segment, {
        color: isCompleted ? "#00754b" : isCurrentSegment ? cfg.color : "#C5D9CC",
        weight: 5,
        opacity: isCompleted ? 0.7 : isCurrentSegment ? 0.5 : 0.25,
        dashArray: isCompleted ? undefined : "10 6",
      }).addTo(map);
      pathLinesRef.current.push(fgLine);
    }
  }, [completedCheckpoints, currentCheckpoint, cfg.color]);

  // Update place markers
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    placeMarkersRef.current.forEach(m => m.remove());
    placeMarkersRef.current = [];

    if (!showPlaces) return;

    places.forEach((place) => {
      const marker = L.marker([place.lat, place.lng], { icon: makePlaceIcon(place.emoji, place.category) })
        .addTo(map)
        .on("click", () => { setSelectedPlace(place); setSelected(null); });
      placeMarkersRef.current.push(marker);
    });
  }, [showPlaces]);

  const flyToUser = useCallback(() => {
    if (userLatLng && mapRef.current) {
      mapRef.current.flyTo(userLatLng, 16, { duration: 1 });
    }
  }, [userLatLng]);

  return (
    <div className="relative bg-[#FFFDF5]" style={{ height: "calc(100vh - 56px - 64px)" }}>

      {/* Progress overlay — top */}
      <div className="absolute top-0 left-0 right-0 z-[300] pointer-events-none px-3 pt-3">
        <div
          className="flex items-center justify-between bg-[#FFFDF5] border-2 border-[#1A1207] rounded-2xl px-4 py-2.5 pointer-events-auto"
          style={{ boxShadow: "3px 3px 0 #1A1207" }}
        >
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full border-2 border-[#1A1207] flex items-center justify-center" style={{ backgroundColor: cfg.color }}>
              <span style={{ fontSize: 10 }}>{cfg.emoji}</span>
            </div>
            <div>
              <div className="font-['Fahkwang'] text-xs font-bold text-[#1A1207]">
                {effectiveMode === "walk" ? t.modes.walk : effectiveMode === "bike" ? t.modes.bike : t.modes.boat}
              </div>
              <div className="font-['Sarabun'] text-[10px] text-[#1A1207]/45">
                {distToCurrentCp !== null
                  ? `${t.map.dist_to} ${currentCheckpoint + 1}: ${formatDist(distToCurrentCp)}`
                  : t.map.canal_name}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {checkpoints.map((_, i) => (
              <div
                key={i}
                className="rounded-full border border-[#1A1207]"
                style={{
                  width: 10, height: 10,
                  backgroundColor: completedCheckpoints[i] ? cfg.color : i === currentCheckpoint ? "#F5A800" : "#E2D5B0",
                }}
              />
            ))}
            <span className="font-['Fahkwang'] text-xs text-[#1A1207] ml-1.5">{completedCount}/6</span>
          </div>

          <button
            onClick={() => navigate("/explore")}
            className="flex items-center gap-1 font-['Fahkwang'] text-xs text-white px-3 py-1.5 rounded-full border-2 border-[#1A1207]"
            style={{ backgroundColor: "#E8340A", boxShadow: "2px 2px 0 #1A1207" }}
          >
            {t.map.go_explore} <ChevronRight size={12} />
          </button>
        </div>
      </div>

      {/* Location error toast */}
      <AnimatePresence>
        {locationError && (
          <motion.div
            className="absolute top-20 left-1/2 -translate-x-1/2 z-[300] bg-[#1A1207] text-white font-['Sarabun'] text-xs px-3 py-2 rounded-full whitespace-nowrap"
            initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
          >
            📍 {locationError === "DENIED" ? t.map.location_denied : t.map.location_unsupported}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Map */}
      <div ref={containerRef} className="w-full h-full" style={{ zIndex: 1 }} />

      {/* FAB column — bottom right */}
      <div className="absolute bottom-4 right-4 z-[300] flex flex-col gap-2 items-center">
        {/* Toggle places */}
        <button
          onClick={() => setShowPlaces(v => !v)}
          className="w-11 h-11 rounded-full border-2 border-[#1A1207] flex items-center justify-center bg-white transition-colors"
          style={{
            boxShadow: "3px 3px 0 #1A1207",
            backgroundColor: showPlaces ? "#FFFDF5" : "#1A1207",
          }}
          title={t.map.places_toggle}
        >
          <Utensils size={18} style={{ color: showPlaces ? "#E8340A" : "#FFFDF5" }} />
        </button>

        {/* Fly to user location */}
        <button
          onClick={flyToUser}
          className="w-12 h-12 rounded-full border-2 border-[#1A1207] flex items-center justify-center bg-white"
          style={{ boxShadow: "3px 3px 0 #1A1207" }}
          title={t.map.my_location}
        >
          <Navigation
            size={20}
            style={{ color: userLatLng ? "#1a73e8" : cfg.color }}
            fill={userLatLng ? "#1a73e820" : "none"}
          />
        </button>
      </div>

      {/* Panels */}
      <AnimatePresence>
        {selectedCp && selectedState && (
          <CheckpointPanel
            key="cp"
            cp={selectedCp}
            idx={selected!}
            state={selectedState}
            modeColor={cfg.color}
            onClose={() => setSelected(null)}
            onExplore={() => navigate("/explore")}
            t={t}
          />
        )}
        {selectedPlace && !selectedCp && (
          <PlacePanel key="place" place={selectedPlace} onClose={() => setSelectedPlace(null)} t={t} />
        )}
      </AnimatePresence>
    </div>
  );
}
