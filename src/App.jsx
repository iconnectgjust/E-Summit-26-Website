import { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Hero from "./Hero.jsx";
import About from "./About.jsx";
import Events from "./Events.jsx";
import Sponsors from "./Sponsors.jsx";
import Journey from "./Journey.jsx";
import Gallery from "./Gallery.jsx";
import Faqs from "./Faqs.jsx";
import ContactUs from "./ContactUs.jsx";
import Footer from "./Footer.jsx";
import AllEventsPage from './pages/AllEvents.jsx';

function App() {
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === "/all-events") {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } 
    else if (location.pathname === "/" && location.hash) {
      const el = document.getElementById(location.hash.replace("#", ""));
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }
    }
  }, [location]);

  return (
    <Routes>
      <Route path="/" element={
        <>
          <Hero/>
          <About/>
          <Events/>
          <Journey/>
          {/* <Sponsors/> */}
          <Gallery/>
          <ContactUs/>
          <Faqs/>
          <Footer/>
        </>
      } />
      <Route path="/all-events" element={
        <AllEventsPage/>
      } />
    </Routes>
  );
}

export default App;
