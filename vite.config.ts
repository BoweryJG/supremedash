import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 8001,
    host: '0.0.0.0',
    hmr: true,
    force: true
  },
  optimizeDeps: {
    force: true
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: undefined
      }
    }
  }
})