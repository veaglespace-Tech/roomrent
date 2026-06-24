"use client";
import { useEffect, useRef, useCallback } from "react";

/**
 * useGsapHeader
 *
 * Manages:
 * 1. Sticky header scroll-shrink (subtle box-shadow + slight scale).
 * 2. Nav-link hover micro-animation via delegation.
 *
 * Does NOT animate dropdowns here — dropdown open/close is handled
 * inside the DesktopTabs component so we have access to the state toggle.
 */
export function useGsapHeader(headerRef) {
  // Track previous scrollY for direction
  const scrollY = useRef(0);
  const ticking = useRef(false);
  const gsapRef = useRef(null);

  // Load GSAP once
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { gsap } = await import("gsap");
      if (!cancelled) gsapRef.current = gsap;
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Scroll-shrink: runs on scroll, throttled with rAF
  useEffect(() => {
    const header = headerRef?.current;
    if (!header) return;

    function onScroll() {
      scrollY.current = window.scrollY;
      if (ticking.current) return;
      ticking.current = true;
      requestAnimationFrame(() => {
        const gsap = gsapRef.current;
        const scrolled = scrollY.current > 30;
        if (gsap) {
          gsap.to(header, {
            "--header-shadow-opacity": scrolled ? 1 : 0,
            duration: 0.3,
            ease: "none",
            overwrite: true,
          });
        }
        // Toggle a CSS class for compact mode (pure CSS handles styles)
        header.classList.toggle("header-scrolled", scrolled);
        ticking.current = false;
      });
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [headerRef]);

  // Delegated nav-link hover pulse
  const attachNavDelegation = useCallback((containerEl) => {
    if (!containerEl) return () => {};

    async function onEnter(e) {
      const link = e.target.closest(".nav-link");
      if (!link) return;
      const gsap = gsapRef.current;
      if (!gsap) return;
      gsap.to(link, {
        scale: 1.05,
        duration: 0.16,
        ease: "power1.out",
        overwrite: true,
      });
    }

    async function onLeave(e) {
      const link = e.target.closest(".nav-link");
      if (!link) return;
      const gsap = gsapRef.current;
      if (!gsap) return;
      gsap.to(link, {
        scale: 1,
        duration: 0.14,
        ease: "power1.inOut",
        overwrite: true,
      });
    }

    containerEl.addEventListener("mouseenter", onEnter, true);
    containerEl.addEventListener("mouseleave", onLeave, true);
    return () => {
      containerEl.removeEventListener("mouseenter", onEnter, true);
      containerEl.removeEventListener("mouseleave", onLeave, true);
    };
  }, []);

  return { attachNavDelegation };
}
