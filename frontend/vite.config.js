import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    // Using 127.0.0.1 instead of localhost ensures compatibility with the backends
    proxy: {
      '/api/users': {
        target: 'http://127.0.0.1:5000',
        changeOrigin: true,
      },
      '/api/dashboard': {
        target: 'http://127.0.0.1:18080',
        changeOrigin: true,
      },
      '/api/grades': {
        target: 'http://127.0.0.1:18080',
        changeOrigin: true,
      },
      '/api/reports': {
        target: 'http://127.0.0.1:18080',
        changeOrigin: true,
      },
      '/api/students': {
        target: 'http://127.0.0.1:18080',
        changeOrigin: true,
      },
      '/api/subjects': {
        target: 'http://127.0.0.1:18080',
        changeOrigin: true,
      },
      '/api/classes': {
        target: 'http://127.0.0.1:18080',
        changeOrigin: true,
      }
    }
  },
})