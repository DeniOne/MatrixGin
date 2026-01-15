import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    proxy: {
      // System Registry Service (v2.x) - порт 3002
      '/api/v1/registry': {
        target: 'http://localhost:3002',
        changeOrigin: true,
      },
      // Main Backend API - порт 3000
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
})
