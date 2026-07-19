import { useRef } from "react";
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

gsap.registerPlugin(ScrollTrigger);

const galleryImages = [img1, img2, img3, img4, img5, img6];

// Group images into rows of 2 so each row can stack on top of the last
const galleryRows = [];
for (let i = 0; i < galleryImages.length; i += 2) {
  galleryRows.push(galleryImages.slice(i, i + 2));
}

const Gallery = () => {
  const sectionRef = useRef(null);
  const sliderRef = useRef(null);
  const trackRef = useRef(null);

  useGSAP(() => {
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
      // gsap.matchMedia keeps the effect tuned per breakpoint: a full,
      // slower stack on desktop, and a shorter, lighter version on
      // tablets/phones so the pinned scroll doesn't feel too long.

      const rows = gsap.utils.toArray(".gallery-row", track);

      if (rows.length > 1) {
        const mm = gsap.matchMedia();

        mm.add(
          {
            isDesktop: "(min-width: 993px)",
            isTablet: "(min-width: 769px) and (max-width: 992px)",
            isMobile: "(max-width: 768px)",
          },
          (context) => {
            const { isMobile, isTablet } = context.conditions;

            // Scroll distance per row-change and how much the covered
            // row dims/shrinks, scaled down for smaller screens.
            const scrollPerRow = isMobile ? 0.55 : isTablet ? 0.65 : 0.85;
            const restScale = isMobile ? 0.97 : 0.94;
            const restBrightness = isMobile ? 0.85 : 0.75;

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
                  "+=" + (rows.length - 1) * window.innerHeight * scrollPerRow,
                pin: true,
                scrub: 1,
                anticipatePin: 1,
                invalidateOnRefresh: true,
              },
            });

            rows.forEach((row, i) => {
              if (i === 0) return;
              const prevRow = rows[i - 1];
              const position = i - 1;

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
          }
        );
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
  }, []);

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
            <div className="gallery-row" key={rowIndex}>
              {row.map((image, imgIndex) => (
                <div
                  className={`gallery-card gallery-card-${rowIndex * 2 + imgIndex + 1}`}
                  key={`${rowIndex}-${imgIndex}`}
                >
                  <img
                    src={image}
                    alt={`Gallery ${rowIndex * 2 + imgIndex + 1}`}
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