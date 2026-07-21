import { useRef } from "react";
import "./ComingSoonEvents.css";
import { FaRocket, FaLightbulb, FaHandshake, FaTrophy } from "react-icons/fa";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { SCROLL_BREAKPOINTS } from "../../utils/scrollBreakpoints";

gsap.registerPlugin(ScrollTrigger);

const ComingSoonEvents = () => {
  const sectionRef = useRef(null);

  useGSAP(
  () => {
    const cards = gsap.utils.toArray(".coming-card");

    // -----------------------------
    // Set initial state
    // -----------------------------
    gsap.set(".coming-events h2", {
      opacity: 0,
      y: 40,
    });

    gsap.set(".coming-description", {
      opacity: 0,
      y: 30,
    });

    gsap.set(cards, {
      opacity: 0,
      y: 50,
      scale: 0.96,
      clearProps: "x",
    });

    gsap.set(".coming-icon", {
      scale: 0,
      rotate: -180,
    });

    gsap.set(".coming-card h3", {
      opacity: 0,
      y: 20,
    });

    gsap.set(".coming-card p", {
      opacity: 0,
      y: 20,
    });

    gsap.set(".coming-badge", {
      opacity: 0,
      y: 30,
      scale: 0.9,
    });

    const mm = gsap.matchMedia();

    mm.add(SCROLL_BREAKPOINTS, (context) => {
      const { isMobile, isTablet } = context.conditions;

      // No scrub here (these are toggleActions-based reveal
      // animations), so the "finishes too quickly" scroll-distance bug
      // doesn't apply — we still route through matchMedia for a
      // consistent responsive pattern, just nudging trigger points a
      // little earlier on smaller screens.
      const headingStart = isMobile ? "top 85%" : isTablet ? "top 80%" : "top 75%";
      const cardStart = isMobile ? "top 90%" : isTablet ? "top 87%" : "top 85%";
      const badgeStart = isMobile ? "top 95%" : isTablet ? "top 92%" : "top 90%";

      // Same idea as Aboutevents: these reveals are duration-based, not
      // scroll-linked, so "slower on mobile" means stretching each
      // tween's own duration/stagger rather than the scroll distance.
      const durationScale = isMobile ? 1.6 : isTablet ? 1.25 : 1;
      const staggerScale = isMobile ? 1.4 : isTablet ? 1.15 : 1;

      // -----------------------------
      // Heading Animation
      // -----------------------------
      gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: headingStart,
          toggleActions: "play none none reverse",
        },
      })
        .to(".coming-events h2", {
          opacity: 1,
          y: 0,
          duration: 0.7 * durationScale,
          ease: "power3.out",
        })
        .to(
          ".coming-description",
          {
            opacity: 1,
            y: 0,
            duration: 0.55 * durationScale,
            ease: "power3.out",
          },
          "-=0.35"
        );

      // -----------------------------
      // Cards
      // -----------------------------
      cards.forEach((card, index) => {
        const icon = card.querySelector(".coming-icon");
        const title = card.querySelector("h3");
        const text = card.querySelector("p");

        const direction = index % 2 === 0 ? -70 : 70;

        gsap.timeline({
          scrollTrigger: {
            trigger: card,
            start: cardStart,
            end: "bottom 20%",
            toggleActions: "play none none reverse",
            invalidateOnRefresh: true,
          },
        })
          .fromTo(
            card,
            {
              opacity: 0,
              x: direction,
              y: 40,
              scale: 0.95,
            },
            {
              opacity: 1,
              x: 0,
              y: 0,
              scale: 1,
              duration: 0.65 * durationScale,
              ease: "power3.out",
              clearProps: "transform",
            }
          )
          .to(
            icon,
            {
              scale: 1,
              rotate: 0,
              duration: 0.45 * durationScale,
              ease: "back.out(2)",
            },
            "-=0.35"
          )
          .to(
            title,
            {
              opacity: 1,
              y: 0,
              duration: 0.35 * durationScale,
              ease: "power2.out",
            },
            "-=0.2"
          )
          .to(
            text,
            {
              opacity: 1,
              y: 0,
              duration: 0.35 * durationScale,
              ease: "power2.out",
            },
            "-=0.2"
          );
      });

      // -----------------------------
      // Badge
      // -----------------------------
      gsap.to(".coming-badge", {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.6 * durationScale,
        ease: "back.out(1.8)",
        scrollTrigger: {
          trigger: ".coming-badge",
          start: badgeStart,
          toggleActions: "play none none reverse",
        },
      });

      return () => {};
    });

    requestAnimationFrame(() => ScrollTrigger.refresh());

    return () => mm.revert();
  },
  {
    scope: sectionRef,
  }
);

  return (
    <section className="coming-events" ref={sectionRef}>
      <div className="coming-events-container">
        <h2>
          More <span>Exciting Events</span> Coming Soon
        </h2>

        <p className="coming-description">
          We are preparing a lineup of competitions, workshops,
          networking sessions, startup showcases, and innovation
          challenges. Stay tuned—registrations for more events
          will open soon.
        </p>

        <div className="coming-grid">
          <div className="coming-card">
            <div className="coming-icon"><FaRocket /></div>
            <h3>Startup Challenges</h3>
            <p>New startup competitions are on the way.</p>
          </div>

          <div className="coming-card">
            <div className="coming-icon"><FaLightbulb /></div>
            <h3>Innovation Workshops</h3>
            <p>Hands-on sessions with industry experts.</p>
          </div>

          <div className="coming-card">
            <div className="coming-icon"><FaHandshake /></div>
            <h3>Networking</h3>
            <p>Meet founders, investors and innovators.</p>
          </div>

          <div className="coming-card">
            <div className="coming-icon"><FaTrophy /></div>
            <h3>Competitions</h3>
            <p>Exciting contests with attractive prizes.</p>
          </div>
        </div>

        <div className="coming-badge">
          <span>STAY TUNED</span>
        </div>
      </div>
    </section>
  );
};

export default ComingSoonEvents;