import React, { useRef } from "react";
import "./About.css";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import aboutImg from "./assets/aboutimg.JPG";
import { SCROLL_BREAKPOINTS, getResponsiveScrub } from "./utils/scrollBreakpoints";

gsap.registerPlugin(ScrollTrigger);

const About = () => {
  const aboutRef = useRef(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();

    mm.add(SCROLL_BREAKPOINTS, (context) => {
      const { isMobile, isTablet } = context.conditions;

      // Desktop keeps the exact original values. Tablet/mobile get a
      // longer, pixel-based scroll distance ("+=") so the timeline has
      // enough room to play out slowly on shorter viewports, plus a
      // gentler scrub so it doesn't snap through instantly.
      const scrollTriggerVars = isMobile
        ? { start: "top 90%", end: "+=620", scrub: getResponsiveScrub(2, context.conditions, { mobile: 1.4 }) }
        : isTablet
        ? { start: "top 85%", end: "+=780", scrub: getResponsiveScrub(2, context.conditions, { tablet: 1.4 }) }
        : { start: "top 75%", end: "top 10%", scrub: 2 };

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: ".about-section",
          scroller: "body",
          ...scrollTriggerVars,
        },
      });

      // Heading Tag
      tl.from(".about-heading p", {
        x: -50,
        opacity: 0,
        duration: 1,
        ease: "power2.out",
      });

      // Heading
      tl.from(
        ".about-heading h1",
        {
          y: 35,
          opacity: 0,
          duration: 1,
          ease: "power2.out",
        },
        "-=0.6",
      );

      // Image
      tl.from(
        ".about-image img",
        {
          x: -120,
          y: 20,
          scale: 0.88,
          rotate: -4,
          opacity: 0,
          duration: 1.3,
          ease: "power3.out",
        },
        "-=0.5",
      );

      // Cards
      tl.from(
        ".card-1",
        {
          x: 80,
          y: 20,
          opacity: 0,
          duration: 1.1,
          ease: "power3.out",
        },
        "-=0.8",
      );

      tl.from(
        ".card-2",
        {
          x: 80,
          y: 20,
          opacity: 0,
          duration: 1.1,
          ease: "power3.out",
        },
        "-=0.7",
      );

      tl.from(
        ".card-3",
        {
          x: 80,
          y: 20,
          opacity: 0,
          duration: 1.1,
          ease: "power3.out",
        },
        "-=0.6",
      );

      // gsap.matchMedia auto-reverts tweens/ScrollTriggers created here
      // whenever the media query stops matching or the parent context reverts.
      return () => {};
    });

    return () => mm.revert();
  }, []);

  return (
    <>
      <section id="about" className="about-section" ref={aboutRef}>
        <div className="about-container">
          <div className="about-heading">
            <p>Know About</p>
            <h1>E-Summit</h1>
          </div>
          <div className="about-content">
            <div className="about-image">
              <img src={aboutImg} alt="About Image" />
            </div>
            <div className="about-text">
              <div className="info-card card-1">
                <h3>What is E-Summit?</h3>
                <p>
                  E-Summit, the flagship event of GJUST &amp; Hisar, brings
                  together visionary entrepreneurs, innovators and aspiring
                  founders to celebrate entrepreneurship and innovation.
                </p>
              </div>
              <div className="info-card card-2">
                <h3>Our Mission</h3>
                <p>
                  We aim to be the ecosystem where we nurture entrepreneurial
                  culture and unite innovators, empowering them to transform
                  ideas into impactful realities.
                </p>
              </div>
              <div className="info-card card-3">
                <h3>Why Join Us</h3>
                <p>
                  Experience inspiring keynote sessions, networking
                  opportunities, startup showcases, competitions and workshops
                  under one roof.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default About;