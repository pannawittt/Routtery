# SKILL.md — Routtery × Figma Make

## What this skill is for

ใช้ SKILL.md นี้เมื่อ generate UI ใน Figma Make สำหรับ **Routtery** — Thai pop art exploration platform สำหรับคลองผดุงกรุงเกษม ทุกหน้าและทุก component ต้องสอดคล้องกับ Design.md

---

## Core Rules for Figma Make

### 1. Always read Design.md first
ก่อน generate ทุกครั้ง ให้ reference Design.md เพื่อดึง:
- Color tokens
- Font pair (Fahkwang + TEPC Kaniga/Sarabun)
- Shadow style (flat offset, ไม่มี blur)
- Border style (2px solid, --color-ink)
- Spacing tokens

### 2. Mobile-first
- Frame size: **390 × 844px** (iPhone 14 Pro) เป็น primary
- Desktop: **1280 × 800px** เป็น secondary
- ทุก component ออกแบบให้ scroll ได้ใน mobile frame

### 3. Thai Pop Art Signature — ห้ามลืม
- **Flat offset shadow** บนทุก card และ button (ไม่มี Gaussian blur)
- **Thick border** (2px) สีดำ (--color-ink) รอบ card และ button สำคัญ
- **Fahkwang** สำหรับ heading ทุกระดับ — เสมอ
- **Color block accent** ใน hero/splash screen (สี่เหลี่ยมสีจัดซ้อนกัน)
- ลายกนกประยุกต์เป็น texture เบา ๆ (opacity ≤ 10%) บน bg

### 4. Component Naming Convention

```
Page/[ScreenName]
  ↳ Component/[ComponentName]
      ↳ [Element]

Examples:
  Page/Home
  Page/SelectMode
  Page/Checkpoint_Walk
  Page/Checkpoint_Boat
  Page/Lottery
  Page/Storytelling
  Page/Summary
  Page/StampBook

  Component/ModeCard
  Component/CheckpointCard
  Component/LotteryCard
  Component/StampHex
  Component/BottomNav
  Component/TopBar
  Component/AudioGuideBar
  Component/StoryBlock
```

### 5. Auto Layout
- ใช้ Auto Layout ทุก component
- Gap, padding ต้องใช้ spacing tokens จาก Design.md
- ห้าม hard-code pixel ที่ไม่ตรงกับ token

### 6. Color Styles
สร้าง Figma Color Style ตาม token ใน Design.md:
- `Color/Primary` → #E8340A
- `Color/Secondary` → #F5A800
- `Color/Tertiary` → #00A878
- `Color/Accent` → #0057B8
- `Color/Purple` → #7B2FBE
- `Color/Bg` → #FFFDF5
- `Color/Surface` → #FFFFFF
- `Color/Ink` → #1A1207
- `Color/Border` → #E2D5B0

### 7. Text Styles
สร้าง Figma Text Style:
- `Text/Display` → Fahkwang 40/Bold
- `Text/H1` → Fahkwang 32/Bold
- `Text/H2` → Fahkwang 24/SemiBold
- `Text/H3` → Fahkwang 18/SemiBold
- `Text/Body-LG` → Sarabun 16/Regular
- `Text/Body` → Sarabun 14/Regular
- `Text/Body-SM` → Sarabun 13/Regular
- `Text/Label` → Fahkwang 12/SemiBold

---

## Screen Generation Guide

### Screen: Home / Splash
- Hero image area: คลองผดุงฯ ภาพกว้าง หรือ illustration Thai pop art
- Title: "Routtery" — Fahkwang Display, white on colored block
- Subtitle: "สำรวจคลองผดุงกรุงเกษม" — Sarabun Body-LG
- CTA button: "เริ่มสำรวจ" — Primary button style
- Language toggle: มุมบนขวา

### Screen: Select Origin/Destination
- Search bar แบบ pill (--radius-full)
- "ต้นทาง*" (required indicator สีแดง)
- "ปลายทาง" (optional — มี chip "ไม่ระบุ")
- Suggested locations list (checkpoint names)
- Map preview เล็ก ๆ ด้านล่าง
- CTA: "ถัดไป →"

### Screen: Select Mode
- Title: "เลือกวิธีสำรวจ" — H1 Fahkwang
- 3 Mode Cards แนวตั้ง (หรือ 3 cards แนวนอนบน landscape):
  - 🚶 เดิน → สีแดง (#E8340A)
  - 🚲 จักรยาน → สีม่วง (#7B2FBE)
  - ⛵ เรือคลอง → สีน้ำเงิน (#0057B8)
- แต่ละ card: icon ใหญ่, ชื่อ mode, เวลาโดยประมาณ, brief description
- Card ที่ select: thick border + shadow offset mode color

### Screen: Checkpoint (Walk)
- Top bar: ชื่อ checkpoint + progress dots
- Checkpoint image / illustration
- Story snippet (2-3 บรรทัด)
- Question box: "คุณเห็นอะไรรอบ ๆ ที่นี่?"
- Answer choices: 4 pills (multiple choice)
- หลัง answer: "ถูกต้อง! 🎉" animation + unlock next

### Screen: Checkpoint (Bike)
- QR Scanner area (กล้อง)
- Instruction: "แสกน QR ที่ป้ายจอดจักรยาน"
- Alternative: "พิมพ์รหัสสถานี" link

### Screen: Checkpoint (Boat)
- Checkpoint name + canal zone map thumbnail
- Quick question เกี่ยวกับสิ่งที่เห็นในคลอง
- เหมือน Walk แต่ context "ริมคลอง"

### Screen: Storytelling (Walk/Bike)
- Full-screen story card
- Image หรือ illustration ประจำ checkpoint
- Story text: Sarabun Body-LG, line-height 1.7
- Bottom: "ถัดไป" / "ดูเพิ่มเติม"
- Corner: emoji / icon ประจำ checkpoint

### Screen: Storytelling (Boat — Audio Guide)
- Audio player bar (floating bottom):
  - thumbnail, ชื่อ story, play/pause, scrubber, time
  - bg: white, shadow-lg
- Story text แบบ scroll ด้านหลัง (อ่านแทนเสียงได้)
- Toggle: "ฟัง" | "อ่าน"

### Screen: Lottery Hub
- Title: "ล็อตเตอรี่ท้าทาย" — H1
- Available lottery list (scroll)
- แต่ละ Lottery Card:
  - ชื่อ challenge (Fahkwang H3)
  - method badge (เดิน / จักรยาน / ทุก method)
  - brief task description
  - progress indicator (0/3, 0/6 ฯลฯ)
  - "รับความท้าทาย" button หรือ "กำลังทำ" badge

### Screen: Active Lottery
- กล้อง / camera input area
- ชื่อ Lottery challenge
- Task description
- Progress: "รูปที่ 1/3" — visual pill
- Captured thumbnails strip ด้านล่าง
- "หยุดความท้าทาย" text button (เล็ก, muted)

### Screen: Summary
- Confetti / celebration illustration
- Route summary:
  - ต้นทาง → ปลายทาง
  - Mode ที่ใช้ (อาจมีหลาย mode)
  - ระยะทาง / เวลา
- Checkpoint list (mini timeline)
- Lottery ที่ทำสำเร็จ (badge grid)
- "ดูสมุดสะสม" CTA

### Screen: Stamp Book
- Title: "สมุดสะสม" — H1
- Grid ของ Stamp hexagons (6 stamps = 6 checkpoints)
- Collected: สีเต็ม + ชื่อ checkpoint + วันที่
- Uncollected: grayscale + dashed border + "?"
- Tap stamp → detail modal (story snippet + รูปที่ถ่าย)

---

## Component Specs

### ModeCard
```
Width: fill (minus 32px margin)
Height: auto (min 96px)
Padding: 16px 20px
Radius: 20px
Border: 2px solid --color-ink
Shadow: 4px 4px 0 --color-ink (default)
        4px 4px 0 [mode-color] (selected)

Contents (left-right):
  [Icon 48px] | [Title H3 + Description Body-SM] | [Time badge]
```

### CheckpointCard
```
Width: fill
Padding: 16px
Radius: 16px
Border-top: 4px solid [mode-color]
Border: 1.5px solid --color-border-strong
Shadow: 3px 3px 0 --color-border-strong

Contents:
  [Zone number pill] [Checkpoint name H3]
  [Zone range Body-SM, muted]
  [Thumbnail 80px × 80px, radius 12px, right]
```

### LotteryCard
```
Width: fill
Padding: 16px
Radius: 16px
Border: 2px solid --color-secondary
Shadow: 4px 4px 0 --color-secondary
bg: --color-surface-alt

Contents:
  [Header row: name H3 + method badge]
  [Task description Body]
  [Progress bar + "x/y"]
  [CTA button, small]
```

### StampHex
```
Shape: hexagon (clip-path หรือ SVG)
Size: 80px × 88px (หรือ 96px × 106px ใน stamp book)
Border: 3px solid --color-ink
Shadow: --shadow-md

Collected:
  bg: checkpoint color
  center: icon / ภาพ checkpoint
  bottom label: ชื่อ checkpoint, Fahkwang 10px

Uncollected:
  bg: #E5E5E5
  border: 2px dashed #AAAAAA
  center: "?" — Fahkwang 24px, #AAAAAA
```

### AudioGuideBar (Boat mode)
```
Position: fixed bottom (above bottom nav)
Width: fill
Height: 72px
Padding: 12px 16px
Radius: 16px 16px 0 0
Border-top: 2px solid --color-accent
bg: white
Shadow: 0 -4px 16px rgba(0,0,0,0.1)

Contents:
  [Thumbnail 44px] | [Title Body + checkpoint name] | [Play/Pause 32px] | [Time]
  Scrubber bar ด้านล่างสุด (full width, height 3px)
```

### BottomNav
```
Height: 64px + safe area
4 tabs: แผนที่ | เส้นทาง | ล็อตเตอรี่ | สะสม
Active: --color-primary icon + underline bar 3px
Inactive: --color-ink opacity 40%
Font: Fahkwang Label (12px)
```

---

## Interaction Notes (สำหรับ Figma Prototype)

- **Mode selection:** tap card → thick border appear + scale 1.02 → next screen
- **Checkpoint check-in:** correct answer → green flash overlay → stamp animate in
- **Lottery accept:** card expand → camera screen slide up
- **Stamp collect:** hexagon fills in with color + bounce animation
- **Audio play:** scrubber animate, waveform pulse visual
- **Language toggle:** instant swap, ไม่มี loading

---

## Accessibility

- Contrast: ทุก text บน colored bg ต้องผ่าน WCAG AA (4.5:1)
- Touch target: minimum 44×44px ทุก interactive element
- Thai font: ต้องมี fallback (Sarabun) กรณี TEPC Kaniga ไม่โหลด
- Audio guide: ต้องมี transcript / read mode เสมอ (Boat mode)
