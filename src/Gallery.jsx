import { useRef } from "react";
import "./Gallery.css";
import img1 from "./assets/EGallery1.jpg";
import img2 from "./assets/EGallery2.JPG";
import img3 from "./assets/EGallery3.jpg";
import img4 from "./assets/EGallery4.JPG";
import img5 from "./assets/EGallery5.JPG";
import img6 from "./assets/EGallery6.JPG";

import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

gsap.registerPlugin(ScrollTrigger);

const galleryImages = [img1, img2, img3, img4, img5, img6];

// Group images into rows of 2 so the track scrolls row by row
const galleryRows = [];
for (let i = 0; i < galleryImages.length; i += 2) {
  galleryRows.push(galleryImages.slice(i, i + 2));
}

const Gallery = () => {
  const sectionRef = useRef(null);
  const sliderRef = useRef(null);
  const trackRef = useRef(null);

 useGSAP(() => {
  const section = sectionRef.current;
  const slider = sliderRef.current;
  const track = trackRef.current;

  if (!section || !slider || !track) return;

  const ctx = gsap.context(() => {
    // ---------------- Heading ----------------

    gsap
      .timeline({
        scrollTrigger: {
          trigger: section,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      })
      .from(".gallery-header span", {
        x: -40,
        opacity: 0,
        duration: 0.5,
      })
      .from(
        ".gallery-header h2",
        {
          y: 35,
          opacity: 0,
          duration: 0.6,
        },
        "-=0.3"
      )
      .from(
        ".gallery-divider",
        {
          scaleX: 0,
          transformOrigin: "left center",
          duration: 0.5,
        },
        "-=0.3"
      );

    // ---------------- Gallery Scroll ----------------

    let distance = 0;

    const calculateDistance = () => {
      const lastRow = track.lastElementChild;

      if (!lastRow) return 0;

      const sliderCenter = slider.clientHeight / 2;
      const lastRowCenter =
        lastRow.offsetTop + lastRow.offsetHeight / 2;

      distance = Math.max(0, lastRowCenter - sliderCenter);

      return distance;
    };

    calculateDistance();

    const imgs = section.querySelectorAll("img");
    let loaded = 0;
    imgs.forEach((img) => {
      if (img.complete) {
        loaded++;
      } else {
        img.addEventListener("load", () => {
          loaded++;
          if (loaded === imgs.length) ScrollTrigger.refresh();
        });
      }
    });
    if (loaded === imgs.length) ScrollTrigger.refresh();

    gsap.to(track, {
      y: () => -calculateDistance(),
      ease: "none",

      scrollTrigger: {
        id: "gallery-scroll",

        trigger: section,

        start: "top top",

        end: () => "+=" + (distance + window.innerHeight * 0.4),

        pin: true,

        scrub: 1,

        anticipatePin: 1,

        invalidateOnRefresh: true,

        onRefreshInit: calculateDistance,
      },
    });
  }, section);

  return () => ctx.revert();
}, []);

  return (
    <section id="gallery" className="gallery-section" ref={sectionRef}>
      <div className="gallery-header">
        <span>PREVIOUSLY</span>
        <h2>CAPTURED MOMENTS</h2>
      </div>

      <div className="gallery-divider"></div>

      <div className="gallery-slider" ref={sliderRef}>
        <div className="gallery-track" ref={trackRef}>
          {galleryRows.map((row, rowIndex) => (
            <div className="gallery-row" key={rowIndex}>
              {row.map((image, imgIndex) => (
                <div
                  className={`gallery-card gallery-card-${rowIndex * 2 + imgIndex + 1}`}
                  key={`${rowIndex}-${imgIndex}`}
                >
                  <img
                    src={image}
                    alt={`Gallery ${rowIndex * 2 + imgIndex + 1}`}
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Gallery;