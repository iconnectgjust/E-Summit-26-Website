import { Suspense, lazy, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";

// Hero stays a normal (eager) import: it's the first thing painted on
// "/" and above the fold, so it should ship in the main entry chunk
// rather than adding a network round-trip before the user sees anything.
import Hero from "./Hero.jsx";

// Everything below the fold, plus the entire /all-events route, is
// code-split into its own chunk via React.lazy. Previously every
// section for both routes was bundled together and shipped on every
// page load; a visitor on "/" downloaded /all-events's code too, and
// vice versa. This was one of the biggest contributors to the low
// Lighthouse score.
const About = lazy(() => import("./About.jsx"));
const Events = lazy(() => import("./Events.jsx"));
const Sponsors = lazy(() => import("./Sponsors.jsx"));
const Journey = lazy(() => import("./Journey.jsx"));
const Gallery = lazy(() => import("./Gallery.jsx"));
const ContactUs = lazy(() => import("./ContactUs.jsx"));
const Faqs = lazy(() => import("./Faqs.jsx"));
const Footer = lazy(() => import("./Footer.jsx"));
const AllEventsPage = lazy(() => import("./pages/AllEvents.jsx"));

function App() {
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === "/all-events") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else if (location.pathname === "/" && location.hash) {
      const el = document.getElementById(location.hash.replace("#", ""));
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }
    }
  }, [location]);

  return (
    // fallback={null} rather than a spinner: every lazy section here is
    // either below the fold (so the user hasn't scrolled to it yet by
    // the time its chunk arrives) or the whole point of a fresh route
    // load, so there's nothing meaningful to show in the gap.
    <Suspense fallback={null}>
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Hero />
              <About />
              <Events />
              <Journey />
              <Sponsors />
              <Gallery />
              <ContactUs />
              <Faqs />
              <Footer />
            </>
          }
        />
        <Route
          path="/all-events"
          element={
            <>
              <AllEventsPage />
              <Footer />
            </>
          }
        />
      </Routes>
    </Suspense>
  );
}

export default App;