import React, { useRef, useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Footer.css";
import {
  FaWhatsapp,
  FaLinkedinIn,
  FaInstagram,
  FaYoutube,
} from "react-icons/fa";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import logo from "./assets/footerlogo.png";

gsap.registerPlugin(ScrollTrigger);

const Footer = () => {
  const location = useLocation();
  const footerRef = useRef(null);

  const scrollToSection = (id, offset = -80) => {
  const el = document.getElementById(id);
  if (!el) return;

  const y = el.getBoundingClientRect().top + window.pageYOffset + offset;
  window.scrollTo({ top: y, behavior: "auto" });
};

  const handleScrollLink = (e, targetId) => {
    e.preventDefault();

    if (location.pathname === "/") {
      scrollToSection(targetId);
    } else {
      window.location.href = `/#${targetId}`;
    }
  };


  useGSAP(() => {
    const ctx = gsap.context(() => {
      gsap.from(".footer-column", {
        y: 40,
        opacity: 0,
        stagger: 0.15,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: footerRef.current,
          start: "top 85%",
        },
      });

      gsap.from(".footer-socials", {
        y: 20,
        opacity: 0,
        stagger: 0.3,
        duration: 0.6,
        ease: "power2.out",
        scrollTrigger: {
          trigger: footerRef.current,
          start: "top 92%",
        },
      });

      gsap.from(".footer-bottom p", {
        y:20,
        opacity: 0,
        duration: 0.6,
        ease: "power2.out",
        scrollTrigger: {
          trigger: footerRef.current,
          start: "top 92%",
        },
      });

      gsap.from(".footer-logo-big", {
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: footerRef.current,
          start: "top 85%",
        },
      });
    }, footerRef);

    return () => ctx.revert();
  }, []);

  return (
    <footer className="footer" ref={footerRef}>

      <div className="footer-top">

        {/* Address */}

        <div className="footer-column">
          <h4>ADDRESS</h4>

          <p>
            Ground Floor, PDUIIC, GJUST,
            <br />
            Hisar, Haryana - 125001
          </p>
        </div>

        {/* About */}

        <div className="footer-column footer-about">
          <h4>ABOUT E-SUMMIT</h4>

          <p>
            E-Summit GJUST is Haryana's largest entrepreneurial festival,
            organized by Team iConnect, PDUIIC to inspire, connect and
            empower future innovators, entrepreneurs and startup founders
            through competitions, workshops and networking opportunities.
          </p>
        </div>

        {/* Contact */}

        <div className="footer-column">
          <h4>CONTACT US</h4>

          <ul>
            <a href="https://wa.me/+919467905906" target="_blank"><li>+91 9467905906</li></a>
            <li>iconnectgjust@gmail.com</li>
          </ul>
        </div>

        {/* Quick Links */}

        <div className="footer-column">
          <h4>QUICK</h4>

          <ul className="footer-links">
            <li>
            <a href="#home" onClick={(e) => handleScrollLink(e, "home")}>
              Home
            </a>
          </li>

          <li>
            <a href="#about" onClick={(e) => handleScrollLink(e, "about")}>
              About
            </a>
          </li>

          <li>
            <a href="#events" onClick={(e) => handleScrollLink(e, "events")}>
              Events
            </a>
          </li>

          <li>
            <a href="#gallery" onClick={(e) => handleScrollLink(e, "gallery")}>
              Gallery
            </a>
          </li>

          <li>
            <a
              href="#contactus" onClick={(e) => handleScrollLink(e, "contactus")}>
              Contact Us
            </a>
          </li>

          <li>
            <a href="#faqs" onClick={(e) => handleScrollLink(e, "faqs")}>
              FAQ's
            </a>
          </li>
          </ul>
        </div>

      </div>

      {/* Bottom */}

      <div className="footer-bottom">

        <div className="footer-socials">

          <a href="https://www.whatsapp.com/channel/0029VaELUPEGU3BNfgEAmU0h" target="_blank"> <FaWhatsapp /> </a>
          <a href="https://www.linkedin.com/company/iconnect-gjust/" target="_blank"> <FaLinkedinIn /> </a>
          <a href="https://www.instagram.com/iconnectgjust/" target="_blank"> <FaInstagram /> </a>
          <a href="https://www.youtube.com/@iConnectGJUST" target="_blank"> <FaYoutube /> </a>

        </div>

        <p>Made with &lt;3 by Team iConnect</p>

      </div>

      <div className="footer-brand">
        <img src={logo} className="footer-logo-big" alt="E-Summit'26" loading="lazy" decoding="async" />
      </div>

    </footer>
  );
};

export default Footer;