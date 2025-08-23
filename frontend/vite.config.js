import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig(({ mode }) => ({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@components': resolve(__dirname, 'src/components'),
      '@pages': resolve(__dirname, 'src/pages'),
      '@services': resolve(__dirname, 'src/services'),
      '@hooks': resolve(__dirname, 'src/hooks'),
      '@utils': resolve(__dirname, 'src/utils'),
      '@contexts': resolve(__dirname, 'src/contexts'),
      '@assets': resolve(__dirname, 'src/assets'),
    },
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8000', // ✅ Django backend for local dev
        changeOrigin: true,
        secure: false,
      },
    },
  },
  define: {
    __API_BASE__: JSON.stringify(
      mode === 'development'
        ? 'http://127.0.0.1:8000/api' // ✅ Local dev
        : 'https://exam-portal-2-hrgv.onrender.com/api' // ✅ Render backend in production
    ),
  },
}))
