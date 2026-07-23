import React, { useRef, useState, useEffect } from "react";
import "./ContactUs.css";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

gsap.registerPlugin(ScrollTrigger);

const ACCESS_KEY = "f53813a9-c4d1-427f-89ac-4cb103818945";

const ContactUs = () => {
  const sectionRef = useRef(null);

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({
    type: "",
    message: "",
  });

  useGSAP(() => {
    const ctx = gsap.context(() => {
      gsap.from(".contact-left span", {
        x: -40,
        opacity: 0,
        duration: 0.5,
        ease: "power2.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
          toggleActions: "play reverse play reverse",
        },
      });

      gsap.from(".contact-left h2", {
        y: 30,
        opacity: 0,
        duration: 0.6,
        ease: "power2.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 72%",
          toggleActions: "play reverse play reverse",
        },
      });

      gsap.from(".contact-map", {
        x: -80,
        opacity: 0,
        scale: 0.95,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".contact-map",
          start: "top 80%",
          toggleActions: "play reverse play reverse",
        },
      });

      gsap.from(".contact-form", {
        x: 80,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".contact-form",
          start: "top 80%",
          toggleActions: "play reverse play reverse",
        },
      });

      gsap.from(".input-group", {
        y: 20,
        opacity: 0,
        stagger: 0.12,
        duration: 0.5,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".contact-form",
          start: "top 75%",
          toggleActions: "play reverse play reverse",
        },
      });

      gsap.from(".contact-btn", {
        y: 20,
        opacity: 0,
        scale: 0.9,
        duration: 0.6,
        ease: "back.out(1.7)",
        scrollTrigger: {
          trigger: ".contact-btn",
          start: "top 95%",
          toggleActions: "play reverse play reverse",
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Auto-hide status message
  useEffect(() => {
    if (!status.message) return;

    const timer = setTimeout(() => {
      setStatus({
        type: "",
        message: "",
      });
    }, 3000);

    return () => clearTimeout(timer);
  }, [status.message]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setStatus({
      type: "",
      message: "",
    });

    const form = e.target;
    const formData = new FormData(form);

    // Honeypot spam protection
    if (formData.get("botcheck")) {
      setLoading(false);
      return;
    }

    formData.append("access_key", ACCESS_KEY);

    formData.append("subject", `${formData.get("user_subject")}`);

    formData.append("from_name", "E-Summit'26 Contact Form");

    formData.append("replyto", formData.get("email"));

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        setStatus({
          type: "success",
          message: "Thanks! Your message has been sent successfully.",
        });

        form.reset();
      } else {
        setStatus({
          type: "error",
          message: result.message || "Something went wrong. Please try again.",
        });
      }
    } catch (error) {
      setStatus({
        type: "error",
        message: "Unable to send message. Please try again later.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contactus" className="contact-section" ref={sectionRef}>
      <div className="contact-container">
        <div className="contact-left">
          <span>LET'S CONNECT</span>
          <h2>CONNECT WITH US</h2>

          <div className="contact-map">
            <iframe
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
              src="https://www.google.com/maps/embed/v1/place?key=AIzaSyAwhosDyC78wZzD3UrnGzhkTgpITeQjjrw&q=Guru+Jambheshwar+University+of+Science+and+Technology,Hisar"
            />
          </div>
        </div>

        <div className="contact-form">
          <form onSubmit={handleSubmit} autoComplete="off">
            <input
              type="checkbox"
              name="botcheck"
              style={{ display: "none" }}
              tabIndex={-1}
              autoComplete="off"
            />

            <div className="input-group">
              <label htmlFor="contact-name">NAME</label>
              <input
                type="text"
                name="name"
                id="contact-name"
                placeholder="Enter your name"
                autoComplete="name"
                required
                minLength={2}
                maxLength={40}
              />
            </div>

            <div className="input-group">
              <label htmlFor="contact-email">E-MAIL ADDRESS</label>
              <input
                type="email"
                name="email"
                id="contact-email"
                placeholder="Enter your email address"
                autoComplete="email"
                required
              />
            </div>

            <div className="input-group">
              <label htmlFor="contact-subject">SUBJECT</label>
              <input
                type="text"
                name="user_subject"
                id="contact-subject"
                placeholder="What is this regarding?"
                autoComplete="off"
                required
                maxLength={80}
              />
            </div>

            <div className="input-group">
              <label htmlFor="contact-message">MESSAGE</label>
              <textarea
                name="message"
                id="contact-message"
                placeholder="Type your message here..."
                autoComplete="off"
                required
                maxLength={500}
              />
            </div>

            <button
              type="submit"
              className="contact-btn"
              disabled={loading}
            >
              {loading ? "SENDING..." : "CONTACT NOW →"}
            </button>

            {status.message && (
              <p className={`form-status ${status.type}`}>
                {status.message}
              </p>
            )}
          </form>
        </div>
      </div>
    </section>
  );
};

export default ContactUs;