import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Proxy requests from /api to your backend server
      '/api': {
        // IMPORTANT: Replace this with the actual URL of your backend/proxy server
        target: 'http://localhost:4000', // Example: if your backend runs on port 400
        changeOrigin: true, // Recommended for virtual hosted sites
        secure: false,      // Can be useful if backend is on https with self-signed cert
      }
    }
  }
})