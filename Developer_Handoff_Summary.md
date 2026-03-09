# FocusFlow - Developer Handoff Summary

## 🎨 Token & Aesthetics System

**Typography**
- **Headings**: `Poppins`, `Inter`, `system-ui` (Weights: 600, 700)
- **Body**: `Inter`, `system-ui`, `-apple-system` (Weights: 400, 500, 600)
- **Base Size**: 16px (scalable to 18px via Accessibility toggle)

**Color Palette (Light Mode)**
- **Primary**: `#0FB3A0` (Teal) / Hover: `#0D9988`
- **Primary Light**: `rgba(15, 179, 160, 0.1)` (Used for badges, highlights)
- **Background**: `#F8F9FA` (Soft neutral)
- **Card Background**: `#FFFFFF`
- **Text Main**: `#1A1A1D`
- **Text Muted**: `#6C757D`
- **Accents**: Success `#10B981`, Warning `#F59E0B`, Danger `#EF4444`

**Dark Mode Adaptations**
- **Background**: `#121212`
- **Card Background**: `#1E1E1E`
- **Text Main**: `#F3F4F6`
- **Text Muted**: `#9CA3AF`
- Primary color retains `#0FB3A0` for vibrant contrast on dark.

**Spacing & Radii Grid**
- **Spacing**: 4px, 8px, 12px, 16px, 20px, 24px, 32px
- **Border Radii**: 8px (sm), 12px (md), 16px (lg: Cards), 24px (xl), 9999px (full: Buttons, Pills)

---

## ⚡ Animation & Interaction Specifications

**Micro-Interactions (CSS Transitions)**
- **Button Hover/Active**: `scale(0.95)` on active, `120ms ease` transition.
- **Card/Input Hover**: `250ms ease` for subtle shadow/border-color shifts.
- **Focus Rings**: `0 0 0 3px rgba(15, 179, 160, 0.3)` applied on `:focus-visible` with `120ms` transition.

**Component Animations**
1. **Pomodoro Timer Ring**: 
   - SVG `stroke-dashoffset` driven by React state.
   - Transition: `1s linear` for smooth 60fps continuous draining.
2. **Progress Bars**: 
   - Width transitions at `700ms ease`.
3. **Streak Confetti / Pulse**: 
   - Flame icon uses a `2s infinite pulse` keyframe scaling `1.0` to `1.1` with a `drop-shadow` blur filter.
4. **Modal Intros**: 
   - Overlay Fade: `200ms ease-out`
   - Content SlideUp: `300ms cubic-bezier(0.175, 0.885, 0.32, 1.275)` dropping slightly from below and scaling in from `0.95`.

---

## 🧩 Architectural Notes
- **State Persistence**: Uses `localStorage` API synced via React hooks (`focusflow_theme`, `focusflow_tasks`, `focusflow_quicknote`, `focusflow_focus_time`).
- **Icons**: `lucide-react` library. Outline SVGs with responsive `currentColor` fills.
- **Drag & Drop**: Powered by `@dnd-kit/core` and `sortable`. Dragging gives a temporary `opacity: 0.8` and `box-shadow` elevation `var(--shadow-md)`.
- **CSS Strategy**: Vanilla CSS with customized variable scoping in `:root`. No preprocessors required. Easy to port to Tailwind if needed later.
