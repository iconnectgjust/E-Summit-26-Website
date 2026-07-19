import "./Faqs.css";
import { useState, useRef } from "react";
import {
  FaPlusCircle,
  FaMinusCircle,
  FaEnvelope,
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaWhatsapp,
  FaLinkedinIn,
  FaInstagram,
  FaYoutube,
} from "react-icons/fa";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

gsap.registerPlugin(ScrollTrigger);

const faqs = [
  {
    question: "Who can participate in E-Summit 2026?",
    answer:
      "E-Summit 2026 is open to all university and college students across India. While some events are exclusive to GJUS&T students, the majority are inter-university and welcome participants from any institution or academic background. Each event will clearly specify its eligibility criteria.",
  },
  {
    question: "Is there any registration fee?",
    answer:
      "No, there is no registration fee for participating in any event under E-Summit 2026. All competitions, workshops, and sessions are free. Just bring your energy, ideas, and the will to learn.",
  }, 
  {
    question: "What are the participation formats for different events?",
    answer:
      "Participation format varies from event to event. Some events, like the Business Quiz, are designed for individual participants, while others such as Startup Auction, Brand-storm 60, and Case Clash require teams ranging from two to four members. Startup Spotlight allows both individual and team participation. Speaker sessions and workshops are also open to solo attendees. The format and team size will be mentioned clearly on the event registration page.",
  },
  {
    question: "Can I register for more than one event?",
    answer:
      "Yes, participants are allowed and encouraged to register for multiple events, as long as the schedule allows it. Be sure to check the event dates and timings to avoid clashes between sessions.",
  },
  {
    question: "Are all the events offline?",
    answer: "While most of the flagship events are scheduled to be conducted offline at Guru Jambheshwar University of Science & Technology (GJUS&T), Hisar, some events may be planned as online sessions. Details about the event mode-whether online or offline-will be specified in the event descriptions and updated on the website accordingly.",
  },
  {
    question: "How will I recieve event updates and important information?",
    answer: "After registering, participants will receive updates through email and WhatsApp. It is important to provide accurate contact details during registration. All essential announcements such as event timings, venue updates, guidelines, and results will also be shared via official social media handles and the website.",
  },
  {
    question: "What do participants and winners receive?",
    answer: "After registering, participants will receive updates through email and WhatsApp. It is important to provide accurate contact details during registration. All essential announcements such as event timings, venue updates, guidelines, and results will also be shared via official social media handles and the website.",
  },
];

export default function Faqs() {
  const [active, setActive] = useState(null);

  const sectionRef = useRef(null);

  useGSAP(() => {
    const ctx = gsap.context(() => {
      // Left subtitle
      gsap.from(".faq-left p", {
        x: -50,
        opacity: 0,
        duration: 0.6,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
          toggleActions: "play none none reverse",
        },
      });

      // Heading
      gsap.from(".faq-left h2", {
        y: 40,
        opacity: 0,
        duration: 0.7,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 72%",
          toggleActions: "play none none reverse",
        },
      });

      // Contact Card
      gsap.from(".contact-card", {
        y: 50,
        opacity: 0,
        scale: 0.95,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".contact-card",
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      });

      // FAQ Items
      gsap.utils.toArray(".faq-item").forEach((item, i) => {
        gsap.from(item, {
          x: 70,
          opacity: 0,
          duration: 0.65,
          delay: i * 0.08,
          ease: "power3.out",
          scrollTrigger: {
            trigger: item,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="faq-section" id="faqs" ref={sectionRef}>
      <div className="faq-container">
        <div className="faq-left">
          <p>FREQUENTLY ASKED QUESTIONS</p>

          <h2>COMMON QUERIES</h2>

          <div className="contact-card">
            <div className="contact-row">
              <FaEnvelope />
              <span>iconnectgjust@gmail.com</span>
            </div>

            <div className="contact-row">
              <FaPhoneAlt />
              <a href="https://wa.me/+919467905906" target="_blank">
                <span>+91 9467905906</span>
              </a>
            </div>

            <div className="contact-row">
              <FaMapMarkerAlt />
              <span>GJUST, Hisar, Haryana</span>
            </div>

            <div className="social-icons">
              <a
                href="https://www.whatsapp.com/channel/0029VaELUPEGU3BNfgEAmU0h"
                target="_blank"
              >
                <FaWhatsapp />
              </a>
              <a
                href="https://www.linkedin.com/company/iconnect-gjust/"
                target="_blank"
              >
                <FaLinkedinIn />
              </a>
              <a
                href="https://www.instagram.com/iconnectgjust/"
                target="_blank"
              >
                <FaInstagram />
              </a>
              <a href="https://www.youtube.com/@iConnectGJUST" target="_blank">
                <FaYoutube />
              </a>
            </div>
          </div>
        </div>

        <div className="faq-right">
          {faqs.map((faq, index) => (
            <div
              className={`faq-item ${active === index ? "active" : ""}`}
              key={index}
            >
              <button
                className="faq-question"
                onClick={() => setActive(active === index ? null : index)}
              >
                <span>{faq.question}</span>

                {active === index ? <FaMinusCircle /> : <FaPlusCircle />}
              </button>

              <div className={`faq-answer ${active === index ? "show" : ""}`}>
                <p>{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
