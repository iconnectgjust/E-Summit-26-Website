import "./Sponsors.css";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);
import sponsor from "./assets/heroImage.jpeg";

const Sponsors = () => {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);

  useGSAP(() => {
  const section = sectionRef.current;
  const track = trackRef.current;

  if (!section || !track) return;

  const slider = section.querySelector(".sponsors-slider");
  const padding = 40;

  let distance = 0;

  const calculateDistance = () => {
    const lastCard = track.lastElementChild;

    if (!lastCard) return 0;

    distance = Math.max(
      0,
      lastCard.offsetLeft +
        lastCard.offsetWidth -
        slider.clientWidth +
        padding
    );

    return distance;
  };

  calculateDistance();

  gsap.to(track, {
    x: () => -calculateDistance(),
    ease: "none",
    scrollTrigger: {
      trigger: section,
      start: "top top",
      end: () => `+=${distance}`,
      pin: true,
      scrub: 1,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      onRefreshInit: calculateDistance,
    },
  });
}, { scope: sectionRef });

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
            <div className="sponsor-card">
              {/* <img src={sponsor} alt="sponsor" /> */}
            </div>
            <div className="sponsor-card">
              {/* <img src={sponsor} alt="sponsor" /> */}
            </div>
            <div className="sponsor-card">
              {/* <img src={sponsor} alt="sponsor" /> */}
            </div>
            <div className="sponsor-card">
              {/* <img src={sponsor} alt="sponsor" /> */}
            </div>
            <div className="sponsor-card">
              {/* <img src={sponsor} alt="sponsor" /> */}
            </div>
            <div className="sponsor-card">
              {/* <img src={sponsor} alt="sponsor" /> */}
            </div>
            <div className="sponsor-card">
              {/* <img src={sponsor} alt="sponsor" /> */}
            </div>
            <div className="sponsor-card">
              {/* <img src={sponsor} alt="sponsor" /> */}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Sponsors;