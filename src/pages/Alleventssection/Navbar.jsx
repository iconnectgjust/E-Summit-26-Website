import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import "./Navbar.css";
import logo from "../../assets/ESlogo.png";

gsap.registerPlugin(ScrollTrigger);

const scrollToSection = (id, offset = -80) => {
  const el = document.getElementById(id);
  if (!el) return;

  const y = el.getBoundingClientRect().top + window.pageYOffset + offset;
  window.scrollTo({ top: y, behavior: "auto" });
};

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("events");
  const location = useLocation();

  const pressClick = () => {
    setMenuOpen(!menuOpen);
  };

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
    const sections = ["home", "about", "gallery", "faqs", "contactus"];

    const handleActiveSection = () => {
      if (window.scrollY < 100) {
        setActiveSection("events");
        return;
      }

      let current = "events";
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

    window.addEventListener("scroll", handleActiveSection);
    return () => window.removeEventListener("scroll", handleActiveSection);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  useGSAP(() => {

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
          { opacity: 1, x: 0, stagger: 0.08, duration: 0.35, ease: "power3.out" },
        );
      };

      window.animateMobileMenu = animateMenu;
    }
  });

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
    <section className="allnavbar-section">

      <nav className="allnavbar">
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
            <a
              href="#home"
              onClick={(e) => handleScrollLink(e, "home")}
              className={activeSection === "home" ? "active" : ""}
            >
              Home
            </a>
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

    </section>
  );
};

export default Navbar;