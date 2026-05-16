Build a real responsive website for "Routtery" — a Thai exploration platform for คลองผดุงกรุงเกษม.

─── CRITICAL: REAL WEBSITE, NOT PROTOTYPE ───
Do NOT create prototype tabs or a navigation bar that just switches preview frames.
Build a real multi-page website with actual page routing (each screen = a real URL path).
Every interaction must use real component state, not frame links.
Navigation between pages must use real router links, not Figma prototype connections.

Routes:
  /                  → Splash / Home
  /plan              → Select Origin & Destination
  /mode              → Select Exploration Mode
  /explore           → Active Exploration (Checkpoint + Story)
  /lottery           → Lottery Hub
  /lottery/active    → Active Lottery Challenge
  /summary           → Route Summary
  /stamps            → Stamp Collection Book

─── RESPONSIVE LAYOUT (CRITICAL) ───
True fluid responsive — fills full browser width at every viewport.
NO phone frame. NO fixed-width centered mobile block on desktop.
Auto Layout with Fill Container (not Fixed width) on all frames.
- Desktop 1440px: multi-column, sidebar + main content
- Tablet 768px: 2-column or full-width stacked
- Mobile 390px: single column, full width

─── DESIGN SYSTEM ───
Fonts: Fahkwang (headings/labels), Sarabun (body)
Colors: Primary #E8340A | Secondary #F5A800 | Walk #00A878 | Bike #7B2FBE | Boat #0057B8 | Bg #FFFDF5 | Ink #1A1207 | Border #E2D5B0
Thai Pop Art: flat offset shadow 4px 4px 0 #1A1207 (no blur) | 2px solid #1A1207 border on cards/buttons | กนก texture 8% opacity on bg

─── PAGE SPECS ───

/ SPLASH
  Real state: CTA button navigates to /plan
  Desktop: full-width hero split — left 55% illustration คลองผดุงฯ (Thai pop art flat colors), right 45% white panel, "Routtery" Fahkwang 56px, subtitle "สำรวจคลองผดุงกรุงเกษม", "เริ่มสำรวจ →" red button routes to /plan
  Mobile: hero image top 45vh, content card overlapping

/plan SELECT ORIGIN / DESTINATION
  Real state: form inputs with validation, ต้นทาง required, ปลายทาง optional, "ถัดไป →" button disabled until origin filled, on submit routes to /mode
  Desktop: centered max-width 640px column on full-width bg
  Mobile: full-width, padding 24px
  Checkpoints to list: ตลาดน้อย / หัวลำโพง / โบ๊เบ๊ / นางเลิ้ง / สถานที่ราชการ / เทเวศร์

/mode SELECT MODE
  Real state: clicking a card sets selected mode in app state, "เริ่มเดินทาง →" routes to /explore
  Desktop: 3 cards in a row, max-width 960px centered
  Mobile: 3 cards stacked full width
  Cards: 🚶เดิน (#E8340A, ~90 min) | 🚲จักรยาน (#7B2FBE, ~60 min) | ⛵เรือคลอง (#0057B8, ~45 min, "🎧 Audio Guide" badge)
  Selected card state: mode color border + shadow, checkmark

/explore ACTIVE EXPLORATION
  Real state: checkpoint progress tracked (1-6), story expand/collapse, answer selection triggers correct/wrong feedback, completing all 6 checkpoints enables route to /summary
  Desktop: left sidebar 300px (checkpoint list, progress) | main content fills rest (hero image, story, check-in)
  Mobile: full-width scroll, progress dots top
  Walk: 4-option question pills, tap to select, submit answer
  Boat: floating audio player bar pinned bottom of content (not screen), toggle "ฟัง|อ่าน"
  Bike: QR code scan placeholder area + "พิมพ์รหัสสถานี" fallback input
  Change mode: button in header opens dialog, confirms stop current route, sets new mode

/lottery LOTTERY HUB
  Real state: each challenge has status (available / active / done), "รับความท้าทาย" sets status to active and routes to /lottery/active, "สุ่มล็อตเตอรี่!" randomly activates one available challenge
  Desktop: 2-column card grid, max-width 960px
  Mobile: 1-column list
  10 challenges with method badges and progress bars (see list below)

/lottery/active ACTIVE LOTTERY
  Real state: photo upload slots (tap to upload from device), progress counter updates on each upload, completing all required photos marks challenge done and routes back to /lottery
  Desktop: centered 640px, color swatch + upload zone side by side
  Mobile: stacked full width
  "หยุดความท้าทาย" button: confirm dialog then routes back to /lottery with status reset

/summary ROUTE SUMMARY
  Real state: reads completed checkpoints and lottery results from app state, displays actual data
  Desktop: 2 columns — left stats, right timeline + badges
  Mobile: stacked
  Shows: route (origin→destination), distance/time estimates, mode(s) used, checkpoint hex-stamps timeline, completed lottery badges, "ดูสมุดสะสม →" routes to /stamps

/stamps STAMP BOOK
  Real state: collected stamps filled with color, uncollected grayed dashed, tap collected stamp opens detail panel
  Desktop: 3-col stamp grid left | detail panel right (shows on stamp tap)
  Mobile: 3×2 grid, tap opens bottom sheet detail
  6 hexagon stamps: ตลาดน้อย / หัวลำโพง / โบ๊เบ๊ / นางเลิ้ง / สถานที่ราชการ / เทเวศร์

─── GLOBAL COMPONENTS ───
Top bar (all pages, full browser width): logo "Routtery" left → routes to / | page title center | TH|EN language toggle right
  Desktop: always visible
  Mobile: visible, hamburger replaces title on small screens
Bottom nav (mobile only, never desktop): แผนที่ / เส้นทาง / ล็อตเตอรี่ / สะสม — real links to /explore / /explore / /lottery / /stamps

Change mode dialog: real modal with overlay, not a separate frame

─── LOTTERY CHALLENGES ───
1. จอนหมาจร — 🚶🚲 — ถ่ายหมา 3 คาแรกเตอร์ (3 photos)
2. แชะ ship — all — ถ่ายเรือ 3 ลำ (3 photos)
3. สะพานเทวดาสร้าง — all — ถ่าย 5 สะพาน (5 photos)
4. colour hunting — 🚶🚲 — ถ่ายสิ่งของสีที่สุ่ม 6 รูป (6 photos, random color shown)
5. คลองตัดคลอง — all — ถ่ายทางแยกคลอง (3 photos)
6. กินเอาภาพ — all — ถ่ายอาหารก่อนกิน 3 ร้าน (3 photos)
7. กินเอาอิ่ม — all — ถ่ายอาหารหลังกิน 3 ร้าน (3 photos)
8. พิราบ(คาบ) — 🚶 — ถ่ายนกพิราบ (1 photo)
9. มองแมว — 🚶🚲 — ถ่ายแมว 3 ตัว (3 photos)
10. ป้ายยา — 🚶🚲 — ถ่ายป้ายร้านยา 6 ภาพ (6 photos)