import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import App from './App.jsx'
import './App.css'

gsap.registerPlugin(ScrollTrigger)
ScrollTrigger.config({ ignoreMobileResize: true })

// Single, app-wide call. This normalizes touch scroll (address-bar
// resize jank, momentum scrolling, etc.) on phones/tablets only —
// desktop mouse/trackpad scrolling is left untouched. Intentionally
// called exactly once here, never inside a component.
const isTouchDevice =
  window.matchMedia("(pointer: coarse)").matches || "ontouchstart" in window
const isSmallViewport = window.matchMedia("(max-width: 992px)").matches

if (isTouchDevice || isSmallViewport) {
  // momentum controls how far/fast a touch flick carries the scroll.
  // GSAP's default (~3) reads as fast on most phones; dropping it
  // gives noticeably slower, heavier-feeling mobile scrolling while
  // still fixing the address-bar resize jank normalizeScroll exists for.
  ScrollTrigger.normalizeScroll({ momentum: 1.2 })
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)