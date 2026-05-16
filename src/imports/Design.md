# Routtery — Design System

## Brand Identity

**Routtery** เป็น web-based exploration platform สำหรับสำรวจคลองผดุงกรุงเกษม ผสมผสานกลิ่นอาย Thai Pop Art เข้ากับ UX ที่ใช้งานง่ายบนมือถือและ desktop

---

## Visual Vibe: Thai Pop Art

แรงบันดาลใจจาก:
- ป้ายโฆษณาไทยยุค 80-90 (สีจัด, typography เด่น)
- Pop art ระดับโลก (Warhol, Lichtenstein) ปรับให้มีความเป็นไทย
- งานกราฟิก street art ริมคลองกรุงเทพ
- ลวดลายไทยประยุกต์ (ลายกนก, เส้นขอบ geometric ไทย) ใช้เป็น accent เบา ๆ
- สีสันของตลาดน้ำ, เรือโดยสาร, และชุมชนริมคลอง

**Keyword ที่ต้องรู้สึกได้:** สดใส · ซน · มีพลัง · เป็นไทย · ไม่เชย · เข้าถึงได้

---

## Color Palette

### Primary Colors

| Token | Hex | ชื่อ | ใช้สำหรับ |
|---|---|---|---|
| `--color-primary` | `#E8340A` | คลองแดง | CTA, highlight, active state |
| `--color-secondary` | `#F5A800` | ทองคำ | Secondary action, badges, Lottery |
| `--color-tertiary` | `#00A878` | น้ำคลอง | Walk mode, success, checkmark |
| `--color-accent` | `#0057B8` | น้ำลึก | Boat mode, links, information |
| `--color-purple` | `#7B2FBE` | ม่วงไทย | Bike mode, stamp collection |

### Neutral Colors

| Token | Hex | ใช้สำหรับ |
|---|---|---|
| `--color-bg` | `#FFFDF5` | Background หลัก (ขาวอมเหลืองอ่อน) |
| `--color-surface` | `#FFFFFF` | Card, modal surface |
| `--color-surface-alt` | `#FFF3D6` | Tinted surface (warm) |
| `--color-ink` | `#1A1207` | Text หลัก |
| `--color-ink-soft` | `#5C4A2A` | Text รอง |
| `--color-border` | `#E2D5B0` | Border, divider |
| `--color-border-strong` | `#C4A96E` | Border เน้น |

### Mode Colors

| Mode | Color | Hex |
|---|---|---|
| 🚶 Walk | คลองแดง + น้ำคลอง | `#E8340A` / `#00A878` |
| 🚲 Bike | ม่วงไทย | `#7B2FBE` |
| ⛵ Boat | น้ำลึก | `#0057B8` |

### Semantic Colors

| Token | Hex | ใช้สำหรับ |
|---|---|---|
| `--color-success` | `#00A878` | สำเร็จ, check-in ผ่าน |
| `--color-warning` | `#F5A800` | เตือน, Lottery pending |
| `--color-danger` | `#E8340A` | Error, หยุด route |
| `--color-info` | `#0057B8` | ข้อมูล, hint |

---

## Typography

### Fonts

```css
/* Header, Topic — Thai Pop Art display font */
@import url('https://fonts.googleapis.com/css2?family=Fahkwang:wght@400;600;700&display=swap');

/* Body Text — อ่านง่าย ภาษาไทย */
/* TEPC Kaniga — ต้อง self-host หรือ embed จาก TEPC */
/* Fallback: Sarabun หรือ Noto Sans Thai */
@import url('https://fonts.googleapis.com/css2?family=Sarabun:wght@300;400;500;600&display=swap');
```

### Type Scale

| Token | Font | Size | Weight | Line Height | ใช้สำหรับ |
|---|---|---|---|---|---|
| `--text-display` | Fahkwang | 40px | 700 | 1.1 | Hero title |
| `--text-h1` | Fahkwang | 32px | 700 | 1.2 | Page title |
| `--text-h2` | Fahkwang | 24px | 600 | 1.3 | Section header |
| `--text-h3` | Fahkwang | 18px | 600 | 1.4 | Card title, checkpoint name |
| `--text-body-lg` | TEPC Kaniga / Sarabun | 16px | 400 | 1.7 | Storytelling, body copy |
| `--text-body` | TEPC Kaniga / Sarabun | 14px | 400 | 1.6 | UI label, description |
| `--text-body-sm` | TEPC Kaniga / Sarabun | 13px | 400 | 1.5 | Caption, meta |
| `--text-label` | Fahkwang | 12px | 600 | 1.0 | Badge, tag, chip |
| `--text-mono` | Fahkwang | 13px | 400 | 1.4 | QR hint, code |

---

## Spacing & Layout

```css
--space-1: 4px
--space-2: 8px
--space-3: 12px
--space-4: 16px
--space-5: 24px
--space-6: 32px
--space-7: 48px
--space-8: 64px

--radius-sm: 6px
--radius-md: 12px
--radius-lg: 20px
--radius-xl: 32px
--radius-full: 9999px (pill)
```

---

## Iconography

- ชุด icon หลัก: **Phosphor Icons** (outline style)
- สำหรับ mode: ใช้ custom icon (เรือ / จักรยาน / รองเท้า) ออกแบบให้มี Thai Pop Art flavor
- ขนาด: 20px (inline), 24px (nav), 32px (feature), 48px (hero)
- Stroke: 1.5px consistent

---

## Border & Shadow

```css
/* Border */
--border-default: 1.5px solid var(--color-border)
--border-strong: 2px solid var(--color-border-strong)
--border-ink: 2px solid var(--color-ink)  /* Thai pop art outline style */

/* Shadow — flat + offset (Thai pop art feel) */
--shadow-flat: 3px 3px 0px var(--color-ink)       /* card hover */
--shadow-md: 4px 4px 0px var(--color-ink)          /* CTA button */
--shadow-lg: 6px 6px 0px var(--color-ink)          /* modal, feature card */
--shadow-color: 4px 4px 0px var(--color-primary)   /* highlight state */
```

> **Thai Pop Art Signature:** ใช้ flat offset shadow (ไม่มี blur) กับ thick border เพื่อให้ได้ feel แบบ screen print / risograph

---

## Component Patterns

### Buttons

```
Primary CTA:
  bg: --color-primary (#E8340A)
  text: white
  border: 2px solid --color-ink
  shadow: 4px 4px 0 --color-ink
  hover: translate(-2px, -2px), shadow 6px 6px
  active: translate(2px, 2px), shadow 2px 2px

Secondary:
  bg: white
  text: --color-ink
  border: 2px solid --color-ink
  shadow: 3px 3px 0 --color-ink

Mode Button (Walk/Bike/Boat):
  bg: mode-color
  icon: white
  text: white, Fahkwang 14px
  rounded: --radius-lg
```

### Cards

```
Checkpoint Card:
  bg: white
  border: 2px solid --color-border-strong
  shadow: --shadow-flat
  radius: --radius-lg
  header: Fahkwang h3, mode-color strip on top (4px)

Lottery Card:
  bg: --color-surface-alt
  border: 2px solid --color-secondary
  shadow: 4px 4px 0 --color-secondary
  radius: --radius-lg
  badge: pill, Fahkwang, --color-secondary bg

Stamp Card:
  shape: hexagon (ประทับตรา)
  bg: per-checkpoint color
  border: 3px solid --color-ink
  shadow: --shadow-md
  collected: full color + checkmark
  uncollected: grayscale + dashed border
```

### Navigation

```
Bottom Tab Bar (mobile):
  bg: white
  border-top: 2px solid --color-border
  tabs: Map, Route, Lottery, สะสม (Stamps)
  active: --color-primary underline + icon fill

Top App Bar:
  bg: --color-bg
  title: Fahkwang h2 center
  left: back / hamburger
  right: language toggle (TH | EN), settings
```

### Mode Selector

```
3 cards in a row or stacked:
  Walk 🚶 → icon + ชื่อ + เวลาโดยประมาณ
  Bike 🚲 → icon + ชื่อ + เวลาโดยประมาณ
  Boat ⛵ → icon + ชื่อ + เวลาโดยประมาณ

Selected state: thick border (mode color), shadow offset, slight scale(1.03)
```

---

## Illustrations & Decorative Elements

- **Pattern accent:** ลายเส้นไทยประยุกต์ (กนก simplified) ใช้เป็น background texture หรือ corner decoration — opacity 5-10%
- **Canal motif:** เส้นคลื่น/คลองแนวนอน ใช้เป็น section divider
- **Color blocks:** สี่เหลี่ยมสีจัด overlap กัน (Warhol-inspired) ใช้ใน hero section
- **Stamps:** hexagonal, มีลวดลายขอบแบบตราประทับไทย

---

## Responsive Breakpoints

```css
--bp-mobile: 390px   /* primary target */
--bp-tablet: 768px
--bp-desktop: 1280px
```

Platform หลักคือ **mobile web** — ออกแบบ mobile-first เสมอ

---

## Language

- Default: **ภาษาไทย**
- Toggle: TH | EN บน top bar
- Font: ทั้งสอง locale ใช้ font pair เดียวกัน (Fahkwang + TEPC Kaniga/Sarabun)
- String token ควรแยก `th` / `en` เป็น i18n object
