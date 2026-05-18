# Routtery — Thai Pop Art Design System

## Stance: Thai Pop Art
Full commitment to Thai Pop Art: flat offset shadows, bold ink borders, vibrant primary palette, Fahkwang for all headings.

## Typography
- **Headings/Labels**: Fahkwang (400, 500, 600, 700) — assertive Thai-influenced geometric
- **Body**: Sarabun (300, 400, 500, 600, 700) — optimized for Thai + Latin legibility

## Color Tokens
- Primary (Green): `#00754b`
- Secondary (Lime): `#67a33b`
- Forest (Dark Green): `#205a41`
- Teal (Walk): `#00c08b`
- Amber (Accent): `#feb449`
- Sun (Yellow): `#f8df52`
- Pink (Destructive/Highlight): `#ec3faa`
- Violet (Bike): `#480086`
- Ocean (Boat/Blue): `#0071ce`
- Background: `#F0F8F4` (light green-tinted)
- Ink: `#12201a`
- Border: `#C5D9CC`

## Pop Art Rules
- **Shadow**: `box-shadow: 4px 4px 0 #12201a` (no blur, flat offset)
- **Border**: `2px solid #12201a` on all cards, buttons, inputs
- **Radius**: `20px` on cards, `9999px` on buttons/pills
- **Texture**: Subtle kanok pattern at 8% opacity on backgrounds

## Components
- `Card`: white bg, 2px #12201a border, 4px 4px 0 shadow, radius 20px
- `PrimaryButton`: #00754b bg, white Fahkwang text, 2px border, 4px shadow
- `SecondaryButton`: white bg, 2px border, 3px shadow
- `TopNav`: full-width, bg #F0F8F4, 1px border-bottom #C5D9CC
- `BottomNav`: mobile only, 4 tabs with #00754b active underline

## Extended Palette (for transport modes, charts, lottery)
| Token | Hex | Use |
|---|---|---|
| `--color-teal` | `#00c08b` | Walk mode |
| `--color-violet` | `#480086` | Bike mode |
| `--color-ocean` | `#0071ce` | Boat/transit mode |
| `--color-amber` | `#feb449` | Lottery, highlights |
| `--color-pink` | `#ec3faa` | Alerts, special events |
| `--color-sun` | `#f8df52` | Rewards, sunshine |
| `--color-lime` | `#67a33b` | Secondary actions |
| `--color-forest` | `#205a41` | Sidebar, deep accents |

 Some of the base components you are using may have styling(eg. gap/typography) baked in as defaults.
So make sure you explicitly set any styling information from the guidelines in the generated react to override the defaults.
