// vite.config.js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'

const localMode = (process.env.VITE_API_MODE || '').toLowerCase() === 'local' || process.env.VITE_API_DISABLE === 'true'
const defaultApiOrigin = 'http://localhost:7073'
const proxyTarget = process.env.VITE_API_PROXY_TARGET || process.env.VITE_API_BASE || defaultApiOrigin

export default defineConfig({
  base: '/',
  plugins: [vue(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'), // 👈 enables @ to point to /src
    },
  },
  server: localMode ? undefined : {
    proxy: {
      '/api': {
        target: proxyTarget,
        changeOrigin: true,
      },
    },
  },
})
