import "./Sponsors.css";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

import { SCROLL_BREAKPOINTS } from "./utils/scrollBreakpoints";

import sponsor1 from "./assets/sponsor1.jpeg";
import sponsor2 from "./assets/sponsor2.jpeg";
import sponsor3 from "./assets/sponsor3.jpeg";
import sponsor4 from "./assets/sponsor4.jpeg";
import sponsor5 from "./assets/sponsor5.jpeg";
import sponsor6 from "./assets/sponsor6.jpeg";
import sponsor7 from "./assets/sponsor7.jpeg";
import sponsor8 from "./assets/sponsor8.png";
import sponsor9 from "./assets/sponsor9.png";
import sponsor10 from "./assets/sponsor10.png";
import sponsor11 from "./assets/sponsor11.png";
import sponsor12 from "./assets/sponsor12.png";
import sponsor13 from "./assets/sponsor13.png";
import sponsor14 from "./assets/sponsor14.png";
import sponsor15 from "./assets/sponsor15.png";
import sponsor16 from "./assets/sponsor16.png";

const SPONSORS = [
  { src: sponsor1, alt: "Sponsor" },
  { src: sponsor2, alt: "Sponsor" },
  { src: sponsor3, alt: "Sponsor" },
  { src: sponsor4, alt: "Sponsor" },
  { src: sponsor5, alt: "Sponsor" },
  { src: sponsor6, alt: "Sponsor" },
  { src: sponsor7, alt: "Sponsor" },
  { src: sponsor8, alt: "Sponsor" },
  { src: sponsor9, alt: "Sponsor" },
  { src: sponsor10, alt: "Sponsor" },
  { src: sponsor11, alt: "Sponsor" },
  { src: sponsor12, alt: "Sponsor" },
  { src: sponsor13, alt: "Sponsor" },
  { src: sponsor14, alt: "Sponsor" },
  { src: sponsor15, alt: "Sponsor" },
  { src: sponsor16, alt: "Sponsor" },
];

const Sponsors = () => {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);

  useGSAP(() => {
    const track = trackRef.current;
    if (!track) return;

    const mm = gsap.matchMedia();

    mm.add(SCROLL_BREAKPOINTS, (context) => {
      const { isMobile, isTablet } = context.conditions;

      const speed = isMobile ? 20 : isTablet ? 40 : 65;

      // Track holds the sponsor list twice, so half its scrollWidth
      // equals the width of ONE full set of logos (incl. gaps).
      const halfWidth = track.scrollWidth / 2;
      const duration = halfWidth / speed;

      const tween = gsap.to(track, {
        xPercent: -50,
        ease: "none",
        duration,
        repeat: -1,
      });

      return () => {
        tween.kill();
      };
    });

    return () => mm.revert();
  }, { scope: sectionRef, dependencies: [SPONSORS.length] });

  // Render the list twice back-to-back for a seamless loop.
  const loopedSponsors = [...SPONSORS, ...SPONSORS];

  return (
    <section className="sponsors-section" ref={sectionRef}>
      <div className="sponsors-pattern"></div>

      <div className="sponsors-container">
        {/* Left Side */}
        <div className="sponsors-heading">
          <span>SPONSORS</span>
          <h2>VALUED PARTNERS</h2>
        </div>

        <div className="sponsors-slider">
          <div className="sponsors-track" ref={trackRef}>
            {loopedSponsors.map((item, i) => (
              <div className="sponsor-card" key={`${item.alt}-${i}`}>
                <img src={item.src} alt={item.alt} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Sponsors;