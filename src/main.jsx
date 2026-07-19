import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import App from './App.jsx'
import './App.css'

gsap.registerPlugin(ScrollTrigger)

// Prevents mobile browsers' address-bar show/hide from triggering a
// ScrollTrigger refresh mid-scroll, which was corrupting pin spacer
// heights and leaving blank space after pinned sections (Hero, Gallery).
ScrollTrigger.config({ ignoreMobileResize: true })

// normalizeScroll locks the effective viewport height used for all
// scroll/pin math to a stable value, so Chrome/Safari's address bar
// hiding mid-scroll no longer leaves a gap between the pinned Hero
// and the About section that follows it. This is GSAP's documented
// fix for pin-related white-gap issues on mobile.
if (window.matchMedia("(max-width: 1024px)").matches) {
  ScrollTrigger.normalizeScroll(true)
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)