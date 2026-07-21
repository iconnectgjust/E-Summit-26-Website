// src/utils/scrollBreakpoints.js
//
// Single source of truth for the responsive breakpoints used by every
// GSAP ScrollTrigger animation in the project. Import this into any
// component that needs gsap.matchMedia() so desktop / tablet / mobile
// behave consistently everywhere, instead of re-declaring the same
// media-query strings (and re-inventing scrub numbers) in each file.
//
// Usage inside a component:
//
//   import { SCROLL_BREAKPOINTS } from "./utils/scrollBreakpoints";
//
//   useGSAP(() => {
//     const mm = gsap.matchMedia();
//     mm.add(SCROLL_BREAKPOINTS, (context) => {
//       const { isMobile, isTablet } = context.conditions;
//       // ...build your timeline using isMobile / isTablet to pick
//       // start/end/scrub values...
//       return () => {}; // gsap.matchMedia auto-cleans tweens/triggers
//     });
//   }, []);
//
// NOTE: gsap.matchMedia() calls made inside a useGSAP()/gsap.context()
// scope are automatically reverted when that context reverts, so you
// do not need to manually call mm.revert() unless you created the
// matchMedia instance outside of a context.

export const SCROLL_BREAKPOINTS = {
  isDesktop: "(min-width: 993px)",
  isTablet: "(min-width: 769px) and (max-width: 992px)",
  isMobile: "(max-width: 768px)",
};

/**
 * Picks a scrub value for the current breakpoint.
 * Desktop keeps whatever value the animation already used.
 * Tablet gets a small bump so the scrub doesn't feel twitchy.
 * Mobile gets a larger scrub (3-5) so short mobile viewports don't
 * cause the scroll-linked animation to snap through in an instant.
 *
 * @param {number} desktopScrub - the existing/desktop scrub value
 * @param {{isMobile:boolean, isTablet:boolean, isDesktop:boolean}} conditions
 * @param {{tablet:number, mobile:number}} [overrides] - optional explicit values
 */
export const getResponsiveScrub = (desktopScrub, conditions, overrides = {}) => {
  const { isMobile, isTablet } = conditions;

  if (isMobile) return overrides.mobile ?? Math.min(5, desktopScrub + 2.5);
  if (isTablet) return overrides.tablet ?? Math.min(3.5, desktopScrub + 1);
  return desktopScrub;
};