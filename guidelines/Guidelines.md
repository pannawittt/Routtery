# Routtery — Thai Pop Art Design System

## Stance: Thai Pop Art
Full commitment to Thai Pop Art: flat offset shadows, bold ink borders, vibrant primary palette, Fahkwang for all headings.

## Typography
- **Headings/Labels**: Fahkwang (400, 500, 600, 700) — assertive Thai-influenced geometric
- **Body**: Sarabun (300, 400, 500, 600, 700) — optimized for Thai + Latin legibility

## Color Tokens
- Primary (Red): `#E8340A`
- Secondary (Yellow): `#F5A800`
- Walk (Green): `#00A878`
- Bike (Purple): `#7B2FBE`
- Boat (Blue): `#0057B8`
- Background: `#FFFDF5` (warm cream)
- Ink: `#1A1207`
- Border: `#E2D5B0`

## Pop Art Rules
- **Shadow**: `box-shadow: 4px 4px 0 #1A1207` (no blur, flat offset)
- **Border**: `2px solid #1A1207` on all cards, buttons, inputs
- **Radius**: `20px` on cards, `9999px` on buttons/pills
- **Texture**: Subtle kanok pattern at 8% opacity on backgrounds

## Components
- `Card`: white bg, 2px #1A1207 border, 4px 4px 0 shadow, radius 20px
- `PrimaryButton`: #E8340A bg, white Fahkwang text, 2px border, 4px shadow
- `SecondaryButton`: white bg, 2px border, 3px shadow
- `TopNav`: full-width, bg #FFFDF5, 1px border-bottom #E2D5B0
- `BottomNav`: mobile only, 4 tabs with #E8340A active underline
