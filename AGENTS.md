# Agent Memory & Project Architecture: Talk with Liam

## Project Context
Editorial monograph and professional psychotherapy practice website for **Liam Doran**, UKCP trainee psychotherapeutic counsellor based in Willerby, East Yorkshire and online.

## View Modes Architecture
The application supports three primary interactive views:
1. **`minimal`**: Minimalist landing view featuring display brand typography, the core epigraph (*"My past may have defined who I became, but my presence will liberate me"*), refined tactile toolbar buttons, and organic floating ambient words in negative space.
2. **`carousel` (or Focused Slides View)**:
   - **Active Implementation (Direct Index + Card Navigation)**:
     - 7 Chapter Cards (`01. HOW WE WORK`, `02. THE CAMERA AND THE FREE CHILD`, `03. HOW WE WORK TOGETHER`, `04. THEMES`, `05. FEES, SPACE & OUR MUTUAL AGREEMENT`, `06. GET IN TOUCH`, `07. PRACTICE GUIDE & FAQS`).
     - Focused single-card stage with native vertical scrolling (`overflow-y-auto`), completely free from wheel or swipe hijacking.
     - Smooth keyboard (`←` / `→` / `Esc`) and chapter index navigation.
3. **`portrait`**: Biographical essay and practice philosophy letter paired with Liam's editorial monochrome portrait.

---

## Restoration Blueprints (Snapshot & Rollback Reference)

If the user asks to revert any changes:

### 1. 3D Rolodex Carousel Restoration Blueprint
If the user prompts: *"Revert back to the 3D carousel"* or *"Restore the vertical rolodex carousel"*, implement the following:

#### Vertical Track Math & 3D Perspective
```tsx
const carouselTranslateY = -currentSlideIndex * (cardHeight + cardGap);

// 3D Rolodex stage container
<div
  id="main-stage-dynamic-area"
  ref={setStageRef}
  className="w-full flex-1 h-full flex items-center justify-center relative overflow-hidden min-h-0"
  style={{ perspective: '1300px', perspectiveOrigin: 'center center' }}
>
  <motion.div
    id="carousel-sliding-track"
    animate={{ y: carouselTranslateY }}
    transition={{ type: 'spring', stiffness: 300, damping: 34, mass: 0.8 }}
    className="flex flex-col items-center absolute left-1/2 top-1/2 -translate-x-1/2 transform-gpu will-change-transform"
    style={{ transformStyle: 'preserve-3d', gap: `${cardGap}px`, marginTop: `-${cardHeight / 2}px` }}
  >
    {SLIDES.map((slide, idx) => {
      const isActive = idx === currentSlideIndex;
      const distance = idx - currentSlideIndex;
      const rotateXDeg = distance === 0 ? 0 : distance < 0 ? Math.max(-13, -7.5 * Math.abs(distance)) : Math.min(13, 7.5 * Math.abs(distance));
      const scaleFactor = distance === 0 ? 1 : Math.max(0.90, 1 - 0.05 * Math.abs(distance));
      const translateZPx = distance === 0 ? 0 : -35 * Math.min(3, Math.abs(distance));
      const zIndexVal = distance === 0 ? 30 : Math.max(1, 20 - Math.abs(distance));
      // render slide card with style={{ transform: `rotateX(${rotateXDeg}deg) scale(${scaleFactor}) translateZ(${translateZPx}px)` }}
    })}
  </motion.div>
</div>
```
Wheel & touch handlers:
- `handleWheel`: Accumulated `deltaY` / `deltaX` threshold (>= 45), cooldown 500ms.
- `handleTouchStart` / `handleTouchEnd`: Vertical touch swipe detection with diff threshold (> 48px).

---

### 2. Previous Detailed Academic Copy Snapshot (Pre-Distillation)
If the user prompts: *"Restore the original longer academic text"* or *"Revert the copy to the previous detailed version"*:

- **Slide 01 (How We Work)**: Included multi-section breakdown on "Empowerment, Not Rescuing" (explaining TA rescue dynamics), "A Space for All of You", and "Radical Authenticity" with the Ellesmere training references.
- **Slide 02 (The Free Child)**: Included full academic breakdown of Eric Berne's (1961) Ego State Model with technical explanations of the Adapted Child vs. Natural Child vs. Critical Parent.
- **Slide 03 (The Grounded Approach)**: Included detailed 5 Relational Dimensions based on Petruska Clarkson's 5-Relational Model and full family kinship metaphors (Cousins, Step-Parent/Godparent, Parent/Child, Siblings, Marital Pair).
- **Slide 04 (Specialisms)**: Included extended paragraphs and 4 structured bullets (What we notice, How we work, Symptoms, Therapeutic focus) for all 6 specialisms.
- **Slide 07 (FAQ)**: Displayed all 14 questions with multi-paragraph clinical explanations and dynamic interaction counters.
- **Portrait View (`PhilosophyEssay.tsx`)**: Structured into 6 formal numbered sections ("Section 1: The Blueprint and The Comparison Barrier", "Section 2: Stepping Out from the Shield", "Section 3: Into the Room: Valued Minds and Shared Connection", "Section 4: The Approach Today", "Section 5: Peer Reflections", "Section 6: Professional Standards").

---

## Active Distillation Principles (Poetic & Grounded Stance)

1. **Option 1 (Poetic Distillation for Slides)**:
   - **Spacious & Human**: Keep each slide focused on 1–2 clear, unforgettable truths rather than textbook lectures.
   - **Slide 02 as Anchor**: Keep photography & video gallery prominent; keep the journal reflection visceral, relatable, and authentic.
   - **Slide 07 (SEO/AIEO + Clean Human Accordion)**: Full JSON-LD structured data in `index.html` for search engines and AI crawlers, paired with a clean, low-cognitive-load accordion for human visitors.

2. **Option 4 (Personal Stance for Portrait / Monograph View)**:
   - Woven from practitioner to client as an intimate, grounded editorial essay.
   - Retains working-class background, Ellesmere Centre training, Valued Minds placement, and peer reflections, but presented in a warm, unhurried literary rhythm.

## Ambient Negative Space Words Configuration
- Component: `/src/components/AmbientNegativeSpaceWords.tsx`
- Word Pool (30 core concepts): Free Child, Autonomy, Attunement, Unfolding, Self-Compassion, Stillness, Resonance, Sanctuary, Belonging, Presence, Depth, Boundaries, Vulnerability, Spontaneity, Clarity, Healing, Reflective Space, Safe Container, Authenticity, Inner Freedom, Connection, Empathy, Integration, Awareness, Relationship, Dialogue, Holding Space, Attentive Care, I'm OK, You're OK, Self-Discovery.
- Timing: Slower meditative pacing (10.5s spawn interval, 14–18s duration per word, max 2 simultaneous words).
