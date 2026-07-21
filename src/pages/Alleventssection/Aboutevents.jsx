import { useRef } from "react";
import "./Aboutevents.css";
import image from "../../assets/heroImage.jpeg";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

import spotlight from "../../assets/startup spotlight.png";
import space from "../../assets/startup space.png";
import pitch from "../../assets/pitch tank.png";
import auction from "../../assets/startup auction.jpeg";
import { SCROLL_BREAKPOINTS } from "../../utils/scrollBreakpoints";

gsap.registerPlugin(ScrollTrigger);

const Aboutevents = () => {
  const sectionRef = useRef(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();

    mm.add(SCROLL_BREAKPOINTS, (context) => {
      const { isMobile, isTablet } = context.conditions;

      // These animations use toggleActions rather than scrub, so they
      // aren't affected by the "finishes too quickly" scroll-distance
      // bug — they just fire once when crossing the trigger line. We
      // still route them through matchMedia for architectural
      // consistency, nudging the trigger point a little earlier on
      // smaller screens where sections/cards sit closer together.
      const headingStart = isMobile
        ? "top 85%"
        : isTablet
          ? "top 80%"
          : "top 75%";
      const rowStart = isMobile ? "top 88%" : isTablet ? "top 82%" : "top 78%";

      // Toggle-actions animations aren't scroll-linked, so making them
      // "slower" means stretching each tween's own duration (and the
      // stagger between elements) rather than the scroll distance.
      // Mobile gets the biggest bump since these reveals otherwise felt
      // rushed on phones; tablet a smaller one; desktop is untouched.
      const durationScale = isMobile ? 1.6 : isTablet ? 1.25 : 1;
      const staggerScale = isMobile ? 1.5 : isTablet ? 1.2 : 1;

      // Heading
      gsap
        .timeline({
          scrollTrigger: {
            trigger: ".allevents-heading",
            start: headingStart,
            toggleActions: "play none none reverse",
          },
        })
        .from(".allevents-heading span", {
          y: 20,
          opacity: 0,
          duration: 0.5 * durationScale,
          ease: "power3.out",
        })
        .from(
          ".allevents-heading h2",
          {
            y: 30,
            opacity: 0,
            duration: 0.6 * durationScale,
            ease: "power3.out",
          },
          "-=0.25",
        )
        .from(
          ".alldivider",
          {
            scaleX: 0,
            transformOrigin: "left center",
            duration: 0.5 * durationScale,
            ease: "power3.out",
          },
          "-=0.2",
        );

      // Event Cards
      gsap.utils.toArray(".allevent-row").forEach((row) => {
        const reverse = row.classList.contains("allreverse");

        const image = row.querySelector(".allevent-image");
        const title = row.querySelector("h3");
        const para = row.querySelector("p");
        const buttons = row.querySelectorAll("button");

        gsap
          .timeline({
            scrollTrigger: {
              trigger: row,
              start: rowStart,
              toggleActions: "play none none reverse",
            },
          })
          .from(image, {
            x: reverse ? 80 : -80,
            opacity: 0,
            scale: 0.95,
            duration: 0.7 * durationScale,
            ease: "power3.out",
          })
          .from(
            title,
            {
              y: 25,
              opacity: 0,
              duration: 0.45 * durationScale,
              ease: "power3.out",
            },
            "-=0.45",
          )
          .from(
            row.querySelector(".event-tag"),
            {
              y: 18,
              opacity: 0,
              scale: 0.85,
              duration: 0.5 * durationScale,
              ease: "back.out(1.8)",
            },
            "-=0.55",
          )
          .from(
            para,
            {
              y: 20,
              opacity: 0,
              duration: 0.45 * durationScale,
              ease: "power3.out",
            },
            "-=0.25",
          )
          .from(
            buttons,
            {
              y: 25,
              opacity: 0,
              scale: 0.9,
              duration: 0.45 * durationScale,
              stagger: 0.3 * staggerScale,
              ease: "back.out(1.7)",
              clearProps: "transform",
            },
            "-=0.15",
          );
      });

      ScrollTrigger.refresh();

      return () => {};
    });

    return () => mm.revert();
  }, []);

  return (
    <section id="events" className="allevents" ref={sectionRef}>
      <div className="allevents-container">
        <div className="allevents-heading">
          <span>YOUR GATEWAY TO INNOVATION</span>
          <h2>EVENTS THAT INSPIRE</h2>
        </div>

        <div className="alldivider"></div>

        <div className="allevent-row">
          <div className="allevent-image">
            <img src={spotlight} alt="Startup Spotlight" />
          </div>

          <div className="allevent-content">
            <h3>STARTUP SPOTLIGHT</h3>
            <div className="event-tag">
              <span className="status-dot"></span>
              <span>INTER UNIVERSITY EVENT</span>
            </div>

            <p>
              Startup Spotlight is a premier startup idea pitching competition
              that empowers university and college students to transform
              innovative ideas into impactful ventures. Participants will pitch
              their startup ideas before an expert jury, gain valuable feedback,
              and compete for recognition, exciting prizes, and entrepreneurial
              opportunities.
            </p>
            <div className="allbuttons">
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

        <div className="allevent-row allreverse">
          <div className="allevent-image">
            <img src={space} alt="Startup Space" />
          </div>

          <div className="allevent-content">
            <h3>STARTUP SPACE</h3>
            <div className="event-tag">
              <span className="status-dot"></span>
              <span>INTER UNIVERSITY EVENT</span>
            </div>
            <p>
              Startup Space is a platform for students to visually showcase
              their startup ideas, research innovations, or prototypes at
              E-Summit'26, hosted by Team iConnect under PDUIIC, GJUS&T Hisar.
              Whether it's a bold concept or a working solution, this is your
              opportunity to inspire.
            </p>
            <div className="allbuttons">
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

        <div className="allevent-row">
          <div className="allevent-image">
            <img src={pitch} alt="Pitch Tank" />
          </div>

          <div className="allevent-content">
            <h3>PITCH TANK</h3>
            <div className="event-tag">
              <span className="status-dot"></span>
              <span>INTER UNIVERSITY EVENT</span>
            </div>
            <p>
              Pitch Tank is a high-intensity business strategy competition at
              E-Summit '26, organized by Team iConnect, PDUIIC, GJUS&T, Hisar.
              Participants are assigned a failed or struggling company and are
              challenged to develop a comprehensive revival strategy, including
              product innovation, marketing, budgeting, growth planning, crisis
              management, and an investor pitch.
            </p>
            <div className="allbuttons">
              <a
                href="https://drive.google.com/drive/folders/1750E1RBeWIo4c4bvhob46lhLuOUiRggA?usp=drive_link"
                target="_blank"
              >
                {" "}
                <button>RULE BOOK</button>{" "}
              </a>
              <a
                href="https://unstop.com/o/FCoNbXA?lb=pDOmfx5U&utm_medium=Share&utm_source=iconnectgjust&utm_campaign=Competitions"
                target="_blank"
              >
                <button> REGISTER NOW </button>
              </a>
            </div>
          </div>
        </div>

        <div className="allevent-row allreverse">
          <div className="allevent-image">
            <img src={auction} alt="startup auction" />
          </div>
          <div className="allevent-content">
            <h3>STARTUP AUCTION</h3>
            <div className="event-tag">
              <span className="status-dot"></span>
              <span>INTER UNIVERSITY EVENT</span>
            </div>
            <p>
              Startup Auction is a strategic business simulation where
              participants bid for companies, acquire Expert Partners, and build
              a diversified portfolio through competitive bidding. The event is
              designed to enhance entrepreneurial thinking, strategic planning,
              negotiation skills, and real-world business decision-making in a
              dynamic auction environment.
            </p>
            <div className="allbuttons">
              <a
                href="https://drive.google.com/drive/folders/14l-SJb4TA1IXbDV-OF9mv0tzuQoGGTe9?usp=sharing"
                target="_blank"
              >
                {" "}
                <button>RULE BOOK</button>{" "}
              </a>
              <a
                href="https://unstop.com/o/9Wew6Zt?lb=pDOmfx5U&utm_medium=Share&utm_source=iconnectgjust&utm_campaign=Competitions"
                target="_blank"
              >
                <button> REGISTER NOW </button>
              </a>
            </div>
          </div>
        </div>

        
      </div>
    </section>
  );
};

export default Aboutevents;