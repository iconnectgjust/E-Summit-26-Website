import { useRef, useState, useEffect, useMemo } from "react";
import "./Gallery.css";
import img1 from "./assets/EGallery1.jpg";
import img2 from "./assets/EGallery2.JPG";
import img3 from "./assets/EGallery3.jpg";
import img4 from "./assets/EGallery4.JPG";
import img5 from "./assets/EGallery5.JPG";
import img6 from "./assets/EGallery6.JPG";

import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { SCROLL_BREAKPOINTS, getResponsiveScrub } from "./utils/scrollBreakpoints";

gsap.registerPlugin(ScrollTrigger);

const galleryImages = [img1, img2, img3, img4, img5, img6];

// Below this width, only one image is shown/stacked at a time.
// Above it (desktop), images stack two-at-a-time, side by side.
const SINGLE_STACK_QUERY = "(max-width: 992px)";

const Gallery = () => {
  const sectionRef = useRef(null);
  const sliderRef = useRef(null);
  const trackRef = useRef(null);

  // Tracks whether we're at a tablet/mobile width, so we can regroup
  // the images (1-per-row) vs desktop (2-per-row) and rebuild the
  // stacking animation to match.
  const [isSingleStack, setIsSingleStack] = useState(
    () => typeof window !== "undefined" && window.matchMedia(SINGLE_STACK_QUERY).matches
  );

  useEffect(() => {
    const mql = window.matchMedia(SINGLE_STACK_QUERY);
    const handleChange = (e) => setIsSingleStack(e.matches);

    // Safari < 14 fallback
    if (mql.addEventListener) {
      mql.addEventListener("change", handleChange);
      return () => mql.removeEventListener("change", handleChange);
    } else {
      mql.addListener(handleChange);
      return () => mql.removeListener(handleChange);
    }
  }, []);

  const imagesPerGroup = isSingleStack ? 1 : 2;

  // Desktop: pairs of images per "row" (shown side by side, rows stack).
  // Tablet/Mobile: one image per "row" (shown full-width, one at a
  // time, each new image overlapping the previous one on scroll).
  const galleryRows = useMemo(() => {
    const rows = [];
    for (let i = 0; i < galleryImages.length; i += imagesPerGroup) {
      rows.push(galleryImages.slice(i, i + imagesPerGroup));
    }
    return rows;
  }, [imagesPerGroup]);

  useGSAP(
    () => {
      const section = sectionRef.current;
      const slider = sliderRef.current;
      const track = trackRef.current;

      if (!section || !slider || !track) return;

      const ctx = gsap.context(() => {
        // ---------------- Heading ----------------

        gsap
          .timeline({
            scrollTrigger: {
              trigger: section,
              start: "top 80%",
              toggleActions: "play none none reverse",
            },
          })
          .from(".gallery-header span", {
            x: -40,
            opacity: 0,
            duration: 0.5,
          })
          .from(
            ".gallery-header h2",
            {
              y: 35,
              opacity: 0,
              duration: 0.6,
            },
            "-=0.3"
          )
          .from(
            ".gallery-divider",
            {
              scaleX: 0,
              transformOrigin: "left center",
              duration: 0.5,
            },
            "-=0.3"
          );

        // ---------------- Gallery Stack ----------------
        // Each row starts stacked directly below the previous one. As the
        // user scrolls, a row slides up and covers whichever row came
        // before it, so images visually land on top of the previous ones.
        // On desktop a "row" is a pair of images (side by side); on
        // tablet/mobile a "row" is a single image, so the effect becomes
        // one image at a time, each new one overlapping the last.
        // gsap.matchMedia keeps the scrub feel tuned per breakpoint.

        const rows = gsap.utils.toArray(".gallery-row", track);

        if (rows.length > 1) {
          const mm = gsap.matchMedia();

          mm.add(SCROLL_BREAKPOINTS, (context) => {
            const { isMobile, isTablet } = context.conditions;

            // Scroll distance per row-change and how much the covered
            // row dims/shrinks. Mobile and tablet now get noticeably MORE
            // scroll distance per row than before (was 0.55 / 0.65), so
            // the stack transition reads as a slower, deliberate motion
            // instead of a quick flick.
            const scrollPerRow = isMobile ? 0.95 : isTablet ? 0.95 : 0.85;
            const restScale = isMobile ? 0.97 : 0.94;
            const restBrightness = isMobile ? 0.85 : 0.75;

            // Extra scroll distance (in the same "row units" as
            // scrollPerRow) reserved at the very start, before any row
            // transition begins. This is what makes the section pin and
            // just sit still on the first image(s) for a bit, giving the
            // user time to actually look at them before the stack starts
            // moving. Expressed as a fraction of a row so it scales with
            // scrollPerRow automatically.
            const initialHold = isMobile ? 0.55 : isTablet ? 0.55 : 0.5;

            // Desktop keeps the original scrub feel. Tablet/mobile get a
            // MUCH smaller scrub than before (was 2 / 3.5). A large scrub
            // number tells GSAP to smooth/lag the animation behind the
            // actual scroll position by that many seconds - on mobile,
            // combined with momentum/inertial scrolling, that lag is what
            // made the next image keep sliding up and covering the first
            // one even after you'd already stopped scrolling (the "peeks
            // in and overlaps without scrolling" bug). A small scrub keeps
            // things smooth without that runaway catch-up drift.
            const scrub = getResponsiveScrub(1, context.conditions, {
              tablet: 1,
              mobile: 1,
            });

            // Reset rows to their stacked starting position whenever the
            // breakpoint changes.
            rows.forEach((row, i) => {
              gsap.set(row, {
                zIndex: i + 1,
                yPercent: i === 0 ? 0 : 100,
                scale: 1,
                filter: "brightness(1)",
              });
            });

            const stackTl = gsap.timeline({
              scrollTrigger: {
                id: "gallery-stack",
                trigger: section,
                start: "top top",
                end: () =>
                  "+=" +
                  (rows.length - 1 + initialHold) *
                    window.innerHeight *
                    scrollPerRow,
                pin: true,
                scrub,
                anticipatePin: 1,
                invalidateOnRefresh: true,
              },
            });

            rows.forEach((row, i) => {
              if (i === 0) return;
              const prevRow = rows[i - 1];
              // Offsetting by initialHold pushes every transition back on
              // the shared timeline, leaving a plain gap from 0 to
              // initialHold where nothing animates - that gap is the
              // pause on the first row(s) before the stack starts moving.
              const position = i - 1 + initialHold;

              stackTl
                .to(
                  prevRow,
                  {
                    scale: restScale,
                    filter: `brightness(${restBrightness})`,
                    duration: 1,
                  },
                  position
                )
                .to(
                  row,
                  { yPercent: 0, duration: 1, ease: "power2.out" },
                  position
                );
            });

            // Cleanup for this breakpoint (called automatically by
            // matchMedia when the media query stops matching).
            return () => {
              stackTl.scrollTrigger && stackTl.scrollTrigger.kill();
              stackTl.kill();
            };
          });
        }

        const imgs = section.querySelectorAll("img");
        let loaded = 0;
        imgs.forEach((img) => {
          if (img.complete) {
            loaded++;
          } else {
            img.addEventListener("load", () => {
              loaded++;
              if (loaded === imgs.length) ScrollTrigger.refresh();
            });
          }
        });
        if (loaded === imgs.length) ScrollTrigger.refresh();
      }, section);

      return () => ctx.revert();
    },
    { dependencies: [imagesPerGroup], scope: sectionRef }
  );

  return (
    <section id="gallery" className="gallery-section" ref={sectionRef}>
      <div className="gallery-header">
        <span>PREVIOUSLY</span>
        <h2>CAPTURED MOMENTS</h2>
      </div>

      <div className="gallery-divider"></div>

      <div className="gallery-slider" ref={sliderRef}>
        <div className="gallery-track" ref={trackRef}>
          {galleryRows.map((row, rowIndex) => (
            <div className="gallery-row" key={`${imagesPerGroup}-${rowIndex}`}>
              {row.map((image, imgIndex) => (
                <div
                  className={`gallery-card gallery-card-${rowIndex * imagesPerGroup + imgIndex + 1}`}
                  key={`${imagesPerGroup}-${rowIndex}-${imgIndex}`}
                >
                  <img
                    src={image}
                    alt={`Gallery ${rowIndex * imagesPerGroup + imgIndex + 1}`}
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Gallery;