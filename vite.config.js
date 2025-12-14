import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'xepa_logo.png'],
      manifest: {
        name: 'Xepa - Lista de Compras',
        short_name: 'Xepa',
        theme_color: '#4CAF50',
        background_color: '#FFFFFF',
        display: 'standalone',
        orientation: 'portrait',
        icons: [
          {
            src: '/xepa_logo_192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/xepa_logo_512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ]
})
