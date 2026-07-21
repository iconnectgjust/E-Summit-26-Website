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
  ScrollTrigger.normalizeScroll(true)
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)