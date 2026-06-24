/**
 * animations.js
 * Central GSAP utility layer for RoomRent Maharashtra.
 *
 * Rules:
 * - Only called on the CLIENT (dynamic import / useEffect).
 * - Never animate layout props (width/height) — only transforms & opacity.
 * - Keep durations short: 0.22 – 0.44 s.
 * - Respect prefers-reduced-motion.
 */

let _gsap = null;
let _ScrollTrigger = null;
let _registered = false;

/** Lazy-load GSAP and register ScrollTrigger once. */
async function getGsap() {
  if (_gsap) return _gsap;
  const { gsap } = await import("gsap");
  const { ScrollTrigger } = await import("gsap/ScrollTrigger");
  if (!_registered) {
    gsap.registerPlugin(ScrollTrigger);
    _registered = true;
  }
  _gsap = gsap;
  _ScrollTrigger = ScrollTrigger;
  return _gsap;
}

/** Returns true when the user prefers reduced motion. */
function prefersReducedMotion() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** Returns true on a viewport narrower than 768 px (mobile). */
function isMobile() {
  if (typeof window === "undefined") return false;
  return window.innerWidth < 768;
}

// ---------------------------------------------------------------------------
// Drawer / panel slide-in (mobile sidebar, mobile header menu)
// ---------------------------------------------------------------------------

/**
 * Animate a drawer panel sliding in from the left.
 * @param {HTMLElement} el
 */
export async function animateDrawerIn(el) {
  if (!el) return;
  const gsap = await getGsap();
  gsap.fromTo(
    el,
    { x: "-100%", opacity: 0 },
    {
      x: "0%",
      opacity: 1,
      duration: prefersReducedMotion() ? 0 : 0.32,
      ease: "power3.out",
    }
  );
}

/**
 * Animate a drawer panel sliding out to the left, then call onComplete.
 * @param {HTMLElement} el
 * @param {() => void} onComplete
 */
export async function animateDrawerOut(el, onComplete) {
  if (!el) return;
  const gsap = await getGsap();
  gsap.to(el, {
    x: "-100%",
    opacity: 0,
    duration: prefersReducedMotion() ? 0 : 0.22,
    ease: "power2.in",
    onComplete,
  });
}

// ---------------------------------------------------------------------------
// Overlay fade
// ---------------------------------------------------------------------------

export async function animateOverlayIn(el) {
  if (!el) return;
  const gsap = await getGsap();
  gsap.fromTo(el, { opacity: 0 }, { opacity: 1, duration: 0.2, ease: "none" });
}

// ---------------------------------------------------------------------------
// Nav dropdown
// ---------------------------------------------------------------------------

/**
 * Open a desktop nav dropdown.
 * @param {HTMLElement} el
 */
export async function animateDropdownOpen(el) {
  if (!el || prefersReducedMotion()) {
    if (el) {
      el.style.opacity = "1";
      el.style.pointerEvents = "auto";
      el.style.transform = "";
    }
    return;
  }
  const gsap = await getGsap();
  gsap.fromTo(
    el,
    { opacity: 0, y: 8, scale: 0.97 },
    {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.2,
      ease: "power2.out",
      overwrite: true,
    }
  );
  el.style.pointerEvents = "auto";
}

/**
 * Close a desktop nav dropdown.
 * @param {HTMLElement} el
 */
export async function animateDropdownClose(el) {
  if (!el) return;
  if (prefersReducedMotion()) {
    el.style.opacity = "0";
    el.style.pointerEvents = "none";
    return;
  }
  const gsap = await getGsap();
  gsap.to(el, {
    opacity: 0,
    y: 6,
    scale: 0.97,
    duration: 0.15,
    ease: "power1.in",
    overwrite: true,
    onComplete: () => {
      el.style.pointerEvents = "none";
    },
  });
}

// ---------------------------------------------------------------------------
// Page transition (fade + slight upward reveal)
// ---------------------------------------------------------------------------

/**
 * Fade/reveal a page's main content wrapper on mount.
 * @param {HTMLElement} el
 */
export async function animatePageIn(el) {
  if (!el || prefersReducedMotion()) return;
  const gsap = await getGsap();
  gsap.fromTo(
    el,
    { opacity: 0, y: 18 },
    { opacity: 1, y: 0, duration: 0.38, ease: "power2.out", clearProps: "all" }
  );
}

// ---------------------------------------------------------------------------
// Card hover — called via JS delegation (not per-card hooks)
// ---------------------------------------------------------------------------

export async function animateCardHoverIn(el) {
  if (!el || prefersReducedMotion() || isMobile()) return;
  const gsap = await getGsap();
  gsap.to(el, {
    y: -5,
    scale: 1.012,
    duration: 0.22,
    ease: "power2.out",
    overwrite: true,
  });
}

export async function animateCardHoverOut(el) {
  if (!el) return;
  const gsap = await getGsap();
  gsap.to(el, {
    y: 0,
    scale: 1,
    duration: 0.18,
    ease: "power1.inOut",
    overwrite: true,
  });
}

// ---------------------------------------------------------------------------
// Button press feedback
// ---------------------------------------------------------------------------

export async function animateButtonPress(el) {
  if (!el || prefersReducedMotion()) return;
  const gsap = await getGsap();
  gsap.fromTo(
    el,
    { scale: 0.96 },
    { scale: 1, duration: 0.22, ease: "elastic.out(1.2, 0.5)" }
  );
}

// ---------------------------------------------------------------------------
// Scroll-reveal: attach once per section/element
// ---------------------------------------------------------------------------

/**
 * Attach a ScrollTrigger reveal to a batch of elements.
 * Safe to call multiple times — uses a WeakSet to skip already-registered els.
 * @param {NodeList | HTMLElement[]} elements
 */
const _revealedEls = typeof WeakSet !== "undefined" ? new WeakSet() : null;

export async function attachScrollReveal(elements) {
  if (!elements || elements.length === 0) return;
  if (prefersReducedMotion()) return;

  const gsap = await getGsap();

  Array.from(elements).forEach((el) => {
    if (_revealedEls?.has(el)) return;
    _revealedEls?.add(el);

    gsap.fromTo(
      el,
      { opacity: 0, y: 22 },
      {
        opacity: 1,
        y: 0,
        duration: 0.44,
        ease: "power2.out",
        scrollTrigger: {
          trigger: el,
          start: "top 88%",
          toggleActions: "play none none none",
          once: true,
        },
      }
    );
  });
}

// ---------------------------------------------------------------------------
// Input focus ring pulse (subtle, performance-safe)
// ---------------------------------------------------------------------------

export async function animateInputFocus(el) {
  if (!el || prefersReducedMotion()) return;
  const gsap = await getGsap();
  gsap.fromTo(
    el,
    { scale: 1 },
    {
      scale: 1.008,
      duration: 0.14,
      ease: "power1.out",
      yoyo: true,
      repeat: 1,
    }
  );
}

// ---------------------------------------------------------------------------
// Sidebar link stagger on open (desktop)
// ---------------------------------------------------------------------------

export async function animateSidebarLinks(els) {
  if (!els || els.length === 0 || prefersReducedMotion()) return;
  const gsap = await getGsap();
  gsap.fromTo(
    Array.from(els),
    { opacity: 0, x: -15, scale: 0.95 },
    {
      opacity: 1,
      x: 0,
      scale: 1,
      duration: 0.45,
      stagger: 0.08,
      ease: "back.out(1.4)",
    }
  );
}

// ---------------------------------------------------------------------------
// Kill all ScrollTriggers (call on route change to avoid leaks)
// ---------------------------------------------------------------------------

export async function cleanupScrollTriggers() {
  if (!_ScrollTrigger) return;
  _ScrollTrigger.getAll().forEach((t) => t.kill());
}
