# Design System: High-Tech Obsidian (PlacePrep Refactor)

## 1. Vision: "The Digital Alchemist"
A core blend of high-end IDE precision and luxury editorial aesthetics. Atmospheric, dimensional, and sophisticated.

## 2. Color Palette (Obsidian & Neon)

| Token | Value | Role |
| :--- | :--- | :--- |
| **Background** | `#080808` | The void-like canvas |
| **Surface** | `#131313` | Base layer for containers |
| **Surface Low** | `#1C1B1B` | Section containers |
| **Surface High** | `#2A2A2A` | Floating interactive cards |
| **Primary (Neon Indigo)** | `#6366F1` | Brand pulse, kinetics |
| **Secondary (Neon Cyan)** | `#06B6D4` | Accents, focus states |
| **Tertiary (Purple)** | `#A855F7` | Specialty chips / highlights |
| **On Surface** | `#E5E2E1` | Main text (Avoid 100% white) |
| **On Surface Variant**| `#C7C4D8` | Secondary text / Body |

### The "No-Line" Rule
Traditional borders are replaced by **Tonal Shifting**. Separation is achieved through contrast between surface levels (e.g., `surface` vs `surface_container_low`).

## 3. Layout & Structure: Bento Box
*   **Modular Grid**: Content is organized into distinct, spacious cards with rounded corners (`0.75rem` or `12px`).
*   **Glassmorphism**: Use `backdrop-blur: 20px` with `surface_variant` at 40% opacity for overlays.
*   **Mesh Gradients**: Subtle background "auroras" using blurred Primary/Secondary colors.

## 4. Typography (Inter)
*   **Display**: Monolithic, negative tracking (-0.04em).
*   **Label**: Uppercase, tracked (+0.1em) to mimic terminal output.
*   **Body**: High line-height (1.4 - 1.5) to allow obsidian background to breathe.

## 5. Components & Kinetics
*   **Buttons**: `primary_container` background with inner-glow top stroke.
*   **Progress Scroller**: Masked gradients for smooth fading into the background.
*   **Ambient Glow**: Use colored glow effects (`box-shadow` with tint) instead of muddy black shadows.
