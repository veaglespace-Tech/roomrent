"use client";
import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

/**
 * PageTransitionWrapper
 *
 * - Fades/slides the page content in on every route change.
 * - Delegates card hover and button press animations (no per-card hooks).
 * - Auto-attaches scroll-reveal to elements with [data-reveal].
 * - Cleans up all ScrollTriggers on unmount to prevent leaks.
 */
export function PageTransitionWrapper({ children }) {
  const ref = useRef(null);
  const pathname = usePathname();

  // Page-in animation on every route change
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { animatePageIn, cleanupScrollTriggers } = await import(
        "@/lib/animations"
      );
      // Kill stale triggers from the previous page first
      await cleanupScrollTriggers();
      if (!cancelled && ref.current) {
        await animatePageIn(ref.current);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [pathname]);

  // Scroll reveal: watch for new [data-reveal] elements via MutationObserver
  useEffect(() => {
    const root = ref.current;
    if (!root) return;

    let rafId;

    async function revealVisible() {
      const { attachScrollReveal } = await import("@/lib/animations");
      const els = root.querySelectorAll("[data-reveal]:not([data-revealed])");
      if (els.length === 0) return;
      els.forEach((el) => el.setAttribute("data-revealed", "1"));
      await attachScrollReveal(els);
    }

    // Initial scan
    rafId = requestAnimationFrame(() => revealVisible());

    const observer = new MutationObserver(() => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => revealVisible());
    });
    observer.observe(root, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      cancelAnimationFrame(rafId);
    };
  }, [pathname]);

  // Delegated hover animations for cards and buttons
  useEffect(() => {
    const root = ref.current;
    if (!root) return;

    const CARD_SEL =
      ".surface-card, .soft-card, .landing-card, .light-bento-card";
    const BTN_SEL =
      ".landing-primary-button, .landing-secondary-button, .action-button";

    function closest(el, sel) {
      return el?.closest(sel);
    }

    async function onMouseEnter(e) {
      const card = closest(e.target, CARD_SEL);
      if (card) {
        const { animateCardHoverIn } = await import("@/lib/animations");
        animateCardHoverIn(card);
        return;
      }
    }

    async function onMouseLeave(e) {
      const card = closest(e.target, CARD_SEL);
      if (card) {
        const { animateCardHoverOut } = await import("@/lib/animations");
        animateCardHoverOut(card);
        return;
      }
    }

    async function onPointerDown(e) {
      const btn = closest(e.target, BTN_SEL);
      if (btn) {
        const { animateButtonPress } = await import("@/lib/animations");
        animateButtonPress(btn);
      }
    }

    root.addEventListener("mouseenter", onMouseEnter, true);
    root.addEventListener("mouseleave", onMouseLeave, true);
    root.addEventListener("pointerdown", onPointerDown, true);

    return () => {
      root.removeEventListener("mouseenter", onMouseEnter, true);
      root.removeEventListener("mouseleave", onMouseLeave, true);
      root.removeEventListener("pointerdown", onPointerDown, true);
    };
  }, [pathname]);

  return (
    <div ref={ref} style={{ opacity: 1 }}>
      {children}
    </div>
  );
}
