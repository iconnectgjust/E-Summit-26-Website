import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import "./Hero.css";

import logo from "./assets/ESlogo.png";
import logoMobile from "./assets/ESlogoMobile.png";
import heroVideo from "./assets/animated video mountain.mp4";
import { SCROLL_BREAKPOINTS, getResponsiveScrub } from "./utils/scrollBreakpoints";

gsap.registerPlugin(ScrollTrigger);

// Smooth-scrolls to a section by id, offsetting for the fixed navbar
const scrollToSection = (id, offset = -80) => {
  const el = document.getElementById(id);
  if (!el) return;

  const y = el.getBoundingClientRect().top + window.pageYOffset + offset;
  window.scrollTo({ top: y, behavior: "auto" });
};

const Hero = () => {
  // UI state
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [videoLoaded, setVideoLoaded] = useState(false);
  const location = useLocation();
  const videoRef = useRef(null);
  const heroRef = useRef(null);

  // Plays the hero background video forward on scroll-down and
  // manually reverses it frame-by-frame on scroll-up
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const markLoaded = () => setVideoLoaded(true);
    video.addEventListener("loadeddata", markLoaded);

    let reverseRAF = null;
    let lastFrameTime = null;
    let lastScrollY = window.pageYOffset;
    let direction = null;

    // Cancels the manual reverse-playback loop, if running
    const stopReverse = () => {
      if (reverseRAF) {
        cancelAnimationFrame(reverseRAF);
        reverseRAF = null;
      }
      lastFrameTime = null;
    };

    // requestAnimationFrame loop that steps currentTime backward
    const reverseStep = (timestamp) => {
      if (lastFrameTime === null) lastFrameTime = timestamp;
      const deltaSec = (timestamp - lastFrameTime) / 1000;
      lastFrameTime = timestamp;

      if (video.currentTime <= 0.05) {
        video.currentTime = 0;
        stopReverse();
        direction = null;
        return;
      }

      video.currentTime = Math.max(0, video.currentTime - deltaSec);
      reverseRAF = requestAnimationFrame(reverseStep);
    };

    const handleVideoEnded = () => {
      direction = null;
    };
    video.addEventListener("ended", handleVideoEnded);

    // Detects scroll direction and switches between forward play / reverse
    const handleScroll = () => {
      const currentY = window.pageYOffset;
      const scrollingDown = currentY > lastScrollY;
      lastScrollY = currentY;

      if (scrollingDown && direction !== "forward") {
        stopReverse();
        direction = "forward";
        const playPromise = video.play();
        if (playPromise !== undefined) {
          playPromise.catch(() => {});
        }
      } else if (!scrollingDown && direction !== "backward") {
        video.pause();
        direction = "backward";
        if (!reverseRAF) {
          reverseRAF = requestAnimationFrame(reverseStep);
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      video.removeEventListener("loadeddata", markLoaded);
      video.removeEventListener("ended", handleVideoEnded);
      window.removeEventListener("scroll", handleScroll);
      stopReverse();
    };
  }, []);

  // Toggles the mobile hamburger menu
  const pressClick = () => {
    setMenuOpen(!menuOpen);
  };

  // Marks the navbar as "scrolled" once the hero section leaves view
  useEffect(() => {
    const heroEl = heroRef.current;
    if (!heroEl) return;

    const navH = 108;

    const observer = new IntersectionObserver(
      ([entry]) => setScrolled(!entry.isIntersecting),
      { threshold: 0, rootMargin: `-${navH}px 0px 0px 0px` },
    );

    observer.observe(heroEl);
    return () => observer.disconnect();
  }, []);

  // Handles nav link clicks: scrolls in place on "/", otherwise navigates home first
  const handleScrollLink = (e, targetId) => {
    e.preventDefault();

    if (location.pathname === "/") {
      scrollToSection(targetId);
    } else {
      window.location.href = `/#${targetId}`;
    }

    setMenuOpen(false);
  };

  // Active link
  useEffect(() => {
    const sections = ["about", "events", "gallery", "faqs", "contactus"];

    const measureActiveSection = () => {
      if (window.scrollY < 100) {
        setActiveSection("home");
        return;
      }

      let current = "home";
      let maxTop = -Infinity;

      sections.forEach((id) => {
        const el = document.getElementById(id);
        if (!el) return;

        const top = el.getBoundingClientRect().top + window.scrollY - 120;

        if (window.scrollY >= top && top > maxTop) {
          maxTop = top;
          current = id;
        }
      });

      setActiveSection(current);
    };

    // Coalesce to one DOM read/measurement per animation frame instead
    // of once per scroll event — scroll can fire far more often than
    // the screen repaints, and each run here reads layout (getBoundingClientRect)
    // for every section, which is expensive to do that frequently.
    let ticking = false;
    const handleScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        measureActiveSection();
        ticking = false;
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Closes the mobile menu whenever the route changes
  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  // Entrance animation timeline for the navbar and hero content
  useGSAP(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReducedMotion) {
      // Skip the choreography entirely — show everything in its
      // final, settled state right away.
      gsap.set(
        [
          ".hero-logo",
          ".hero-info > p:first-child",
          ".dates",
          ".cta-btn",
          ".arrow-box",
          ".left",
          ".right",
          "nav ul li",
          ".logo",
          ".hamburger",
        ],
        { clearProps: "all", opacity: 1, scale: 1, x: 0, y: 0 },
      );
      return;
    }

    // Initial state
    gsap.set([".hero-logo", ".hero-info > p:first-child", ".dates"], {
      opacity: 0,
    });

    gsap.set(".hero-logo", { opacity: 0, scale: 0.75, y: 20 });
    gsap.set(".hero-info > p:first-child", { opacity: 0, y: 25 });
    gsap.set(".dates", { opacity: 0, y: 18 });
    gsap.set(".cta-btn", { opacity: 0, y: 40, scale: 0.88 });
    gsap.set(".arrow-box", { opacity: 0, x: -10 });

    gsap.set(".left", {
      x: 35,
      scaleX: 0,
      transformOrigin: "right center",
    });

    gsap.set(".right", {
      x: -35,
      scaleX: 0,
      transformOrigin: "left center",
    });

    // Navbar + hero
    const tl = gsap.timeline({
      defaults: { ease: "power3.out" },
    });

    // Logo
    tl.from(".logo", { y: -45, opacity: 0, duration: 0.65 });

    // Nav links
    tl.from(
      "nav ul li",
      { y: -20, opacity: 0, stagger: 0.08, duration: 0.4 },
      "-=0.3",
    );

    // Hamburger
    if (window.innerWidth <= 1024) {
      tl.from(
        ".hamburger",
        {
          opacity: 0,
          scale: 0.6,
          rotate: -90,
          duration: 0.45,
          ease: "back.out(2)",
        },
        "-=0.35",
      );
    }

    // Delay
    tl.to({}, { duration: 0.15 });

    // Lines grow
    tl.to([".left", ".right"], {
      scaleX: 1,
      duration: 0.25,
      ease: "power2.out",
    });

    // Lines split
    tl.to(".left", { x: 0, duration: 0.45, ease: "power2.inOut" }, "<");
    tl.to(".right", { x: 0, duration: 0.45, ease: "power2.inOut" }, "<");

    // Hero logo
    tl.to(".hero-logo", {
      opacity: 1,
      scale: 1,
      y: 0,
      duration: 0.55,
      ease: "back.out(1.8)",
    });

    // Description
    tl.to(".hero-info > p:first-child", { opacity: 1, y: 0, duration: 0.35 });

    // Dates
    tl.to(".dates", { opacity: 1, y: 0, duration: 0.3 });

    // CTA
    tl.call(() => {
      const btn = document.querySelector(".cta-btn");
      const isVisible =
        btn.getBoundingClientRect().top < window.innerHeight - 40;

      const playCta = () => {
        gsap
          .timeline()
          .to(".cta-btn", {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.55,
            ease: "back.out(1.8)",
          })
          .to(".arrow-box", { opacity: 1, x: 0, duration: 0.25 }, "-=.25")
          .call(() => {
            if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
              return;
            }

            gsap.to(".cta-btn", {
              y: -4,
              repeat: -1,
              yoyo: true,
              duration: 1.5,
              ease: "sine.inOut",
            });

            gsap.to(".arrow-box", {
              x: 6,
              repeat: -1,
              yoyo: true,
              duration: 0.7,
              ease: "power1.inOut",
            });
          });
      };

      if (isVisible) {
        playCta();
      } else {
        gsap
          .timeline({
            scrollTrigger: {
              trigger: ".cta-btn",
              start: "top 90%",
              once: true,
            },
          })
          .add(playCta());
      }
    });

    // Mobile menu
    if (window.innerWidth <= 1024) {
      const animateMenu = () => {
        gsap.fromTo(
          ".links",
          { opacity: 0, y: -20 },
          { opacity: 1, y: 0, duration: 0.3, ease: "power3.out" },
        );

        gsap.fromTo(
          ".links li",
          { opacity: 0, x: 25 },
          {
            opacity: 1,
            x: 0,
            stagger: 0.08,
            duration: 0.35,
            ease: "power3.out",
          },
        );
      };

      window.animateMobileMenu = animateMenu;
    }
  });

  // Pins the hero section and zooms/darkens the background video on scroll
  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        return;
      }

      const mm = gsap.matchMedia();

      mm.add(SCROLL_BREAKPOINTS, (context) => {
          const { isDesktop, isTablet } = context.conditions;
          const vh = window.innerHeight;
          // Shortened across the board so the hero pin resolves within
          // roughly a scroll or two instead of eating up several full
          // screens of scrolling before the rest of the page appears.
          const distance = isDesktop ? vh * 1.4 : isTablet ? vh * 1.2 : vh * 1.3;
          const scrub = getResponsiveScrub(0.8, context.conditions, {
            tablet: 0.9,
            mobile: 0.9,
          });

          const scrubTl = gsap.timeline({
            scrollTrigger: {
              id: "hero-pin",
              trigger: heroRef.current,
              start: "top top",
              end: `+=${distance}`,
              scrub,
              pin: true,
              pinSpacing: true,
              anticipatePin: 1,
              fastScrollEnd: true,
              invalidateOnRefresh: true,
            },
          });

          scrubTl
            .to(
              ".hero-bg-video",
              { scale: 1.08, duration: 0.7, ease: "power1.out" },
              0,
            )
            .to(
              ".hero-overlay-dark",
              { opacity: 0.72, duration: 0.7, ease: "power1.out" },
              0,
            )
            .to({}, { duration: 0.3 });

          return () => scrubTl.kill(true);
        },
      );

      const refresh = () => ScrollTrigger.refresh();
      const video = videoRef.current;
      video?.addEventListener("loadedmetadata", refresh);
      window.addEventListener("load", refresh);

      return () => {
        mm.revert();
        video?.removeEventListener("loadedmetadata", refresh);
        window.removeEventListener("load", refresh);
      };
    },
    { scope: heroRef },
  );

  // Hamburger animation
  useEffect(() => {
    if (window.innerWidth > 1024) return;

    gsap.to(".hamburger span:nth-child(1)", {
      rotate: menuOpen ? 45 : 0,
      y: menuOpen ? 8 : 0,
      duration: 0.3,
      transformOrigin: "center center",
      ease: "power2.out",
    });

    gsap.to(".hamburger span:nth-child(2)", {
      opacity: menuOpen ? 0 : 1,
      duration: 0.2,
      ease: "power2.out",
    });

    gsap.to(".hamburger span:nth-child(3)", {
      rotate: menuOpen ? -45 : 0,
      y: menuOpen ? -8 : 0,
      duration: 0.3,
      transformOrigin: "center center",
      ease: "power2.out",
    });
  }, [menuOpen]);

  // Mobile menu animation
  useEffect(() => {
    if (!menuOpen || window.innerWidth > 1024) return;

    const tl = gsap.timeline();

    tl.fromTo(
      ".links",
      { opacity: 0, y: -20 },
      { opacity: 1, y: 0, duration: 0.3, ease: "power3.out" },
    );

    tl.fromTo(
      ".links li",
      { opacity: 0, x: 30 },
      { opacity: 1, x: 0, stagger: 0.08, duration: 0.35, ease: "power3.out" },
      "-=0.15",
    );
  }, [menuOpen]);

  return (
    <>
      {/* Fixed navbar: logo, hamburger toggle, nav links */}
      <nav
        className={`navbar ${scrolled ? "scrolled" : ""}`}
        aria-label="Primary"
      >
        <div className="logo">
          <Link
            to="/"
            onClick={(e) => {
              e.preventDefault();

              if (location.pathname === "/") {
                window.scrollTo({ top: 0, behavior: "smooth" });
              } else {
                window.location.href = "/";
              }

              setMenuOpen(false);
            }}
          >
            <img src={logo} alt="E-Summit'26 Logo" />
          </Link>
        </div>

        <button
          className={`hamburger ${menuOpen ? "open" : ""}`}
          onClick={pressClick}
          aria-label="Toggle Navigation"
          aria-expanded={menuOpen}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <ul className={`links ${menuOpen ? "active" : ""}`}>
          <li>
            <Link to="/" className={activeSection === "home" ? "active" : ""}
            onClick={(e) => {
              e.preventDefault();

              if (location.pathname === "/") {
                window.scrollTo({ top: 0, behavior: "smooth" });
              } else {
                window.location.href = "/";
              }

              setMenuOpen(false);
            }}>
              Home
            </Link>
          </li>

          <li>
            <a
              href="#about"
              onClick={(e) => handleScrollLink(e, "about")}
              className={activeSection === "about" ? "active" : ""}
            >
              About
            </a>
          </li>

          <li>
            <a
              href="#events"
              onClick={(e) => handleScrollLink(e, "events")}
              className={activeSection === "events" ? "active" : ""}
            >
              Events
            </a>
          </li>

          <li>
            <a
              href="#gallery"
              onClick={(e) => handleScrollLink(e, "gallery")}
              className={activeSection === "gallery" ? "active" : ""}
            >
              Gallery
            </a>
          </li>

          <li>
            <a
              href="#contactus"
              onClick={(e) => handleScrollLink(e, "contactus")}
              className={activeSection === "contactus" ? "active" : ""}
            >
              Contact Us
            </a>
          </li>

          <li>
            <a
              href="#faqs"
              onClick={(e) => handleScrollLink(e, "faqs")}
              className={activeSection === "faqs" ? "active" : ""}
            >
              FAQ's
            </a>
          </li>
        </ul>
      </nav>

      <section className="hero-section" ref={heroRef}>
        <div className="hero-bg-wrapper" aria-hidden="true">
          <video
            ref={videoRef}
            className={`hero-bg-video ${videoLoaded ? "is-loaded" : ""}`}
            src={heroVideo}
            muted
            playsInline
            preload="metadata"
          />
        </div>

        <div className="hero-overlay-dark" aria-hidden="true"></div>
        <div className="hero-noise" aria-hidden="true"></div>
        <div id="home" className="hero-content">
          <div className="hero-logo-info">
            <div className="hero-logo">
              <img src={logo} className="hero-logo-desktop" alt="E-Summit'26" />
              <img
                src={logoMobile}
                className="hero-logo-mobile"
                alt="E-Summit'26"
              />
            </div>

            <div className="hero-info">
              <p>
                A celebration of innovation, entrepreneurship,
                <br />
                and the people shaping tomorrow's world.
              </p>

              <p className="dates">19th - 21st August 2026</p>

              <Link to="/all-events">
                <button className="cta-btn">
                  Be Part of the Journey
                  <span className="arrow-box">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 640 640"
                      fill="#14B8A6"
                    >
                      <path d="M598.6 342.6C611.1 330.1 611.1 309.8 598.6 297.3L470.6 169.3C458.1 156.8 437.8 156.8 425.3 169.3C412.8 181.8 412.8 202.1 425.3 214.6L498.7 288L64 288C46.3 288 32 302.3 32 320C32 337.7 46.3 352 64 352L498.7 352L425.3 425.4C412.8 437.9 412.8 458.2 425.3 470.7C437.8 483.2 458.1 483.2 470.6 470.7L598.6 342.7z" />
                    </svg>
                  </span>
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Hero;