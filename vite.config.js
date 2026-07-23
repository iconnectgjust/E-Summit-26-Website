import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        // Groups the heaviest third-party libraries into their own
        // cacheable chunks, separate from your own component code.
        // Without this, every dependency (GSAP, react-icons, swiper,
        // router) gets bundled in with app code, so changing a single
        // component invalidates the browser cache for all of it too.
        // Splitting them out means returning visitors re-download only
        // the small app chunk that actually changed.
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('gsap')) return 'vendor-gsap'
            if (id.includes('react-router')) return 'vendor-router'
            if (id.includes('react-icons')) return 'vendor-icons'
            if (id.includes('swiper')) return 'vendor-swiper'
            if (id.includes('react-youtube') || id.includes('youtube-embed')) {
              return 'vendor-youtube'
            }
            return 'vendor'
          }
        },
      },
    },
  },
})