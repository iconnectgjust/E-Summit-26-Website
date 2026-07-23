import { useRef } from "react";
import { Link } from "react-router-dom";
import "./Events.css";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { SCROLL_BREAKPOINTS, getResponsiveScrub } from "./utils/scrollBreakpoints";

import spotlight from "./assets/startup spotlight.png";
import space from "./assets/startup space.png";

gsap.registerPlugin(ScrollTrigger);

const Events = () => {
  const sectionRef = useRef(null);

  useGSAP(() => {
    gsap.set(".event-content button", {
      opacity: 1,
    });

    gsap.set(".view-btn button", {
      opacity: 1,
    });

    const mm = gsap.matchMedia();

    mm.add(SCROLL_BREAKPOINTS, (context) => {
      const { isMobile, isTablet } = context.conditions;

      // Heading timeline. Mobile uses a one-shot play/reverse instead of a
      // scrubbed range - a continuously-recalculated scrub trigger is
      // needless overhead for a heading that only ever needs to fade in
      // once, and dropping it removes one more per-frame listener from
      // the busiest part of the scroll.
      const headingRange = isMobile
        ? { start: "top 88%", toggleActions: "play none none reverse" }
        : isTablet
        ? { start: "top 82%", end: "+=700", scrub: getResponsiveScrub(1.5, context.conditions, { tablet: 1.25 }) }
        : { start: "top 78%", end: "top 30%", scrub: 1.5 };

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: ".events",
          fastScrollEnd: true,
          ...headingRange,
        },
      });

      tl.from(".events-heading span", {
        x: -50,
        opacity: 0,
        duration: 1,
        ease: "power2.out",
      });

      tl.from(
        ".events-heading h2",
        { y: 35, opacity: 0, duration: 1, ease: "power2.out" },
        "-=0.6",
      );

      tl.from(
        ".divider",
        {
          scaleX: 0,
          transformOrigin: "left center",
          duration: 0.8,
          ease: "power2.out",
        },
        "-=0.4",
      );

      // Each event row gets its own timeline so it animates in/out as it
      // individually enters/leaves the viewport. Desktop/tablet keep the
      // scrubbed feel; mobile plays once on entry instead of scrubbing.
      const rowRange = isMobile
        ? { start: "top 92%", toggleActions: "play none none reverse" }
        : isTablet
        ? { start: "top 88%", end: "+=620", scrub: getResponsiveScrub(1.5, context.conditions, { tablet: 1.25 }) }
        : { start: "top 85%", end: "top 35%", scrub: 1.5 };

      gsap.utils.toArray(".event-row").forEach((row) => {
        const isReverse = row.classList.contains("reverse");

        const rowTl = gsap.timeline({
          scrollTrigger: {
            trigger: row,
            fastScrollEnd: true,
            ...rowRange,
          },
        });

        rowTl.from(row.querySelector(".event-image img"), {
          x: isReverse ? 100 : -100,
          scale: 0.9,
          opacity: 0,
          duration: 1,
          ease: "power3.out",
        });

        rowTl.from(
          row.querySelector(".event-content h3"),
          {
            x: isReverse ? -60 : 60,
            opacity: 0,
            duration: 0.9,
            ease: "power3.out",
          },
          "-=0.7",
        );

        rowTl.from(
          row.querySelector(".event-tag"),
          {
            y: 18,
            opacity: 0,
            scale: 0.85,
            duration: 0.5,
            ease: "back.out(1.8)",
          },
          "-=0.55",
        );

        rowTl.from(
          row.querySelector(".event-content p"),
          { y: 25, opacity: 0, duration: 0.9, ease: "power3.out" },
          "-=0.6",
        );

        rowTl.from(
          row.querySelectorAll(".buttons button"),
          {
            y: 35,
            opacity: 0,
            scale: 0.9,
            ease: "power3.out",
            stagger: 0.3,
          },
          "-=0.4",
        );
      });

      // View-all button
      const viewBtnRange = isMobile
        ? { start: "top 95%", toggleActions: "play none none reverse" }
        : isTablet
        ? { start: "top 92%", end: "+=380", scrub: getResponsiveScrub(1.3, context.conditions, { tablet: 1.1 }) }
        : { start: "top 90%", end: "top 55%", scrub: 1.3 };

      gsap.from(".view-btn button", {
        y: 40,
        opacity: 0,
        scale: 0.9,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".view-btn",
          fastScrollEnd: true,
          ...viewBtnRange,
        },
      });

      return () => {};
    });

    return () => mm.revert();
  }, []);

  return (
    <section id="events" className="events" ref={sectionRef}>
      <div className="events-container">
        <div className="events-heading">
          <span>YOUR GATEWAY TO INNOVATION</span>
          <h2>EVENTS THAT INSPIRE</h2>
        </div>

        <div className="divider"></div>

        <div className="event-row">
          <div className="event-image">
            <img src={spotlight} alt="Startup Spotlight" loading="lazy" decoding="async" />
          </div>

          <div className="event-content">
            <h3>STARTUP SPOTLIGHT</h3>
            <div className="event-tag">
              <span className="status-dot"></span>
              <span>Inter University Event</span>
            </div>
            <p>
              Startup Spotlight is a premier startup idea pitching competition
              that empowers university and college students to transform
              innovative ideas into impactful ventures. Participants will pitch
              their startup ideas before an expert jury, gain valuable feedback,
              and compete for recognition, exciting prizes, and entrepreneurial
              opportunities.
            </p>
            <div className="buttons">
              <a
                href="https://drive.google.com/drive/folders/1XT4r0nhp89O7Lq2Fuz7ZtJ8UItctM5dN?usp=sharing"
                target="_blank"
              >
                {" "}
                <button>RULE BOOK</button>{" "}
              </a>
              <a
                href="https://unstop.com/o/usMRt9d?utm_medium=Share&utm_source=iconnectgjust&utm_campaign=Competitions"
                target="_blank"
              >
                {" "}
                <button>REGISTER NOW</button>{" "}
              </a>
            </div>
          </div>
        </div>

        <div className="divider"></div>

        <div className="event-row reverse">
          <div className="event-image">
            <img src={space} alt="Startup Space" loading="lazy" decoding="async" />
          </div>

          <div className="event-content">
            <h3>STARTUP SPACE</h3>
            <div className="event-tag">
              <span className="status-dot"></span>
              <span>Inter University Event</span>
            </div>
            <p>
              Startup Space is a platform for students to visually showcase
              their startup ideas, research innovations, or prototypes at
              E-Summit'26, hosted by Team iConnect under PDUIIC, GJUS&T Hisar.
              Whether it's a bold concept or a working solution, this is your
              opportunity to inspire.
            </p>
            <div className="buttons">
              <a
                href="https://drive.google.com/drive/folders/1hKDKwnytOlosdTNJ6f101EuGYjvZmWzF?usp=drive_link"
                target="_blank"
              >
                {" "}
                <button>RULE BOOK</button>{" "}
              </a>
              <a
                href="https://unstop.com/o/rAst7jM?utm_medium=Share&utm_source=iconnectgjust&utm_campaign=Competitions"
                target="_blank"
              >
                {" "}
                <button>REGISTER NOW</button>{" "}
              </a>
            </div>
          </div>
        </div>

        <div className="divider"></div>

        <div className="view-btn">
          <Link to="/all-events">
            <button>
              VIEW ALL
              <span>➜</span>
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Events;