# Mobile-Only Accordion Drawer Architecture for Practice Chapters

## Executive Summary
This plan details the design, behavior, and technical implementation of an editorial **accordion-style drawer system for mobile devices only** (`< lg` breakpoint). On desktop and tablet screens, the existing focused stage and navigation remain 100% untouched.

On mobile, rather than rendering all 6 chapters as a continuous long vertical feed, the chapters will be presented as clean, tactile accordion drawers.

---

## User Specifications & Decisions
1. **Initial Arrival State**: Chapter 01 (`[01 / 06] • HOW WE WORK`) opens automatically on initial arrival; Chapters 02 through 06 start collapsed.
2. **Interaction Behavior**: Single-open accordion mode — tapping any drawer expands that chapter, closes any previously open drawer, and smoothly scrolls the active drawer header into view.
3. **Typography & Framing**:
   - Closed Drawer Header: Displays chapter badge and title, e.g. `[01 / 06] • HOW WE WORK`, with an editorial state indicator (`+` / `−` or minimal directional caret).
   - Expanded Drawer Header: Features a clean separator and the user-specified `Top ↑` action allowing visitors to instantly return to the top of the mobile stream.
   - Expanded Content: Unfolds into Liam's full chapter content (e.g. `TWO HUMANS IN A ROOM.`, therapeutic modalities, fee breakdown, contact form, FAQs).
4. **No Photography**: Exclusively structures the current 6 clinical and relational chapters without any photography slides.
5. **Strict Scope**: Mobile-only implementation; desktop view (`lg` and above) remains unchanged.

---

## Architectural Breakdown

### 1. State Management (`src/App.tsx`)
- **Active Drawer State**:
  ```tsx
  const [activeMobileDrawer, setActiveMobileDrawer] = useState<number | null>(0);
  ```
  - Defaults to `0` (Chapter 01 open on mount).
  - Toggling logic:
    ```tsx
    const handleToggleMobileDrawer = (index: number) => {
      if (activeMobileDrawer === index) {
        // Option to collapse if tapped again, or retain open
        setActiveMobileDrawer(null);
      } else {
        setActiveMobileDrawer(index);
        // Smoothly auto-scroll the drawer into view after opening
        setTimeout(() => {
          const drawerEl = document.getElementById(`mobile-drawer-${SLIDES[index]?.id}`);
          if (drawerEl) {
            drawerEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 150);
      }
    };
    ```
- **Sync with Header Navigation & Chapter Pills**:
  - When the visitor taps a chapter pill in the horizontal mobile scrollbar (`goToSlide(idx)`), `activeMobileDrawer` is automatically set to `idx`, ensuring seamless synergy between the top pill bar and the accordion drawer stream.

### 2. Accordion Drawer UI & Motion Architecture
- **Container Structure**:
  - Located within `#carousel-mobile-scroll-container`.
  - Replaces the static array of cards with an animated, accessible accordion list.
- **Drawer Header (`<button>`)**:
  - Semantic `<button type="button" aria-expanded={isOpen} ...>` with high touch target (min 52px).
  - Left side: Editorial monospace chapter tag: `[01 / 06] • HOW WE WORK`.
  - Right side: Minimalist indicator (`+` / `−` or subtle rotatable arrow) in warm stone styling.
  - Active styling: Subtle warm parchment border highlight (`border-stone-300`, `bg-[#FCFBF7]`) to distinguish the active chapter.
- **Drawer Body (`<motion.div>`)**:
  - Driven by Framer Motion `<AnimatePresence initial={false}>`.
  - Smooth height and opacity transitions:
    ```tsx
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: 'auto', opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="overflow-hidden"
    >
      <div className="pt-3 pb-5 px-4 border-t border-stone-100">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-stone-100">
          <span className="font-serif italic text-xs text-stone-500">Chapter Content</span>
          <button
            onClick={() => {
              document.getElementById('carousel-mobile-scroll-container')?.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="text-[11px] font-mono uppercase tracking-wider text-stone-500 hover:text-stone-900 cursor-pointer flex items-center gap-1"
            aria-label="Scroll to top"
          >
            Top ↑
          </button>
        </div>
        {renderSlideContent(idx)}
      </div>
    </motion.div>
    ```

### 3. Preserving Desktop Architecture
- The mobile stream wrapper maintains the `lg:hidden` responsive constraint.
- The desktop stage (`hidden lg:flex`, containing the desktop 3D/focused card carousel, left brand block, and heroicons toolbar) remains untouched and fully preserved.

---

## Verification & Testing Steps
1. **Initial Mount Test**: Verify Chapter 01 is open by default on mobile viewport (`< 1024px`), and Chapters 02–06 are closed.
2. **Accordion Behavior Test**:
   - Tap Chapter 02: Verify Chapter 01 collapses smoothly, Chapter 02 expands, and the window smoothly auto-scrolls to the top of Chapter 02.
   - Tap `Top ↑`: Verify page smoothly scrolls to the top of the mobile container.
3. **Pill Bar Integration Test**: Tap a pill in the horizontal slide index at the top of mobile view; verify it expands the corresponding drawer and scrolls to it.
4. **Desktop Preservation Test**: Verify desktop viewport (`>= 1024px`) renders the desktop stage with no accordion regressions.
5. **Compilation & Linting**: Run `compile_applet` and `lint_applet` to ensure zero type or syntax errors.
