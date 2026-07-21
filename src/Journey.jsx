import { useRef } from "react";
import "./Journey.css";
import {
  FaUsers,
  FaLightbulb,
  FaSeedling,
  FaHandshake,
  FaNetworkWired,
} from "react-icons/fa";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { SCROLL_BREAKPOINTS, getResponsiveScrub } from "./utils/scrollBreakpoints";

gsap.registerPlugin(ScrollTrigger);

const steps = [
  {
    number: "01",
    icon: <FaUsers />,
    title: "NETWORK",
    text: "Build valuable connections with industry leaders, startup founders, investors and like-minded innovators.",
  },
  {
    number: "02",
    icon: <FaLightbulb />,
    title: "LEARN",
    text: "Gain insights from accomplished founders, investors and experts through inspiring talks and workshops.",
  },
  {
    number: "03",
    icon: <FaSeedling />,
    title: "GROW",
    text: "Develop your entrepreneurial mindset, discover opportunities and take your startup ideas further.",
  },
  {
    number: "04",
    icon: <FaHandshake />,
    title: "COLLABORATE",
    text: "Connect with talented peers, mentors and creators to build impactful collaborations.",
  },
  {
    number: "05",
    icon: <FaNetworkWired />,
    title: "NETWORK",
    text: "Expand your network through meaningful conversations that continue beyond the event.",
  },
];

const Journey = () => {
  const sectionRef = useRef(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();

    mm.add(SCROLL_BREAKPOINTS, (context) => {
      const { isMobile, isTablet } = context.conditions;

      // Heading
      const headingRange = isMobile
        ? { start: "top 88%", end: "+=380", scrub: getResponsiveScrub(2, context.conditions) }
        : isTablet
        ? { start: "top 82%", end: "+=500", scrub: getResponsiveScrub(2, context.conditions) }
        : { start: "top 75%", end: "top 20%", scrub: 2 };

      const headTl = gsap.timeline({
        scrollTrigger: {
          trigger: ".journey",
          scroller: "body",
          ...headingRange,
        },
      });

      headTl.from(".journey-heading span", {
        x: -50,
        opacity: 0,
        duration: 1,
        ease: "power2.out",
      });

      headTl.from(
        ".journey-heading h2",
        { y: 35, opacity: 0, duration: 1, ease: "power2.out" },
        "-=0.6",
      );

      // Timeline line grows top-to-bottom as the whole section scrolls.
      // This range already tracks the timeline's own (content-driven)
      // height via "bottom 60%", so only the scrub is bumped for
      // smaller screens rather than the start/end points.
      gsap.from(".timeline-line", {
        scaleY: 0,
        transformOrigin: "top center",
        ease: "none",
        scrollTrigger: {
          trigger: ".timeline",
          scroller: "body",
          start: "top 70%",
          end: "bottom 60%",
          scrub: getResponsiveScrub(2, context.conditions),
        },
      });

      // Each timeline item animates in from its side as it enters view
      const itemRange = isMobile
        ? { start: "top 92%", end: "+=320", scrub: getResponsiveScrub(2, context.conditions) }
        : isTablet
        ? { start: "top 88%", end: "+=420", scrub: getResponsiveScrub(2, context.conditions) }
        : { start: "top 85%", end: "top 45%", scrub: 2 };

      gsap.utils.toArray(".timeline-item").forEach((item) => {
        const isRight = item.classList.contains("right");

        const itemTl = gsap.timeline({
          scrollTrigger: {
            trigger: item,
            scroller: "body",
            ...itemRange,
          },
        });

        itemTl.from(item.querySelector(".timeline-content"), {
          x: isRight ? 80 : -80,
          opacity: 0,
          duration: 1,
          ease: "power3.out",
        });

        itemTl.from(
          item.querySelector(".timeline-circle"),
          { scale: 0, opacity: 0, duration: 0.7, ease: "back.out(2)" },
          "-=0.7",
        );
      });

      const arrowRange = isMobile
        ? { start: "top 95%", end: "+=200", scrub: getResponsiveScrub(2, context.conditions) }
        : isTablet
        ? { start: "top 92%", end: "+=260", scrub: getResponsiveScrub(2, context.conditions) }
        : { start: "top 90%", end: "top 60%", scrub: 2 };

      gsap.from(".timeline-arrow", {
        scale: 0,
        opacity: 0,
        duration: 0.7,
        ease: "back.out(2)",
        scrollTrigger: {
          trigger: ".timeline-arrow",
          scroller: "body",
          ...arrowRange,
        },
      });

      return () => {};
    });

    return () => mm.revert();
  }, []);

  return (
    <section className="journey" ref={sectionRef}>

      <div className="journey-container">
        <div className="journey-heading">
          <span>BUILD YOUR FUTURE</span>
          <h2>MORE THAN AN EVENT</h2>
        </div>

        <div className="timeline">
          <div className="timeline-line"></div>

          {steps.map((step, index) => (
            <div
              key={index}
              className={`timeline-item ${
                index % 2 === 0 ? "left" : "right"
              }`}
            >
              <div className="timeline-content">
                <div className="timeline-icon">{step.icon}</div>

                <h3>{step.title}</h3>

                <p>{step.text}</p>
              </div>

              <div className="timeline-circle">
                {step.number}
              </div>
            </div>
          ))}

          <div className="timeline-arrow"></div>
        </div>
      </div>
    </section>
  );
};

export default Journey;