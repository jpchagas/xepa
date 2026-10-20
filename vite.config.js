import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: [
        'favicon.png',
        'apple-touch-icon.png',
        'xepa_mark.png'
      ],
      workbox: {
        // Push and notification-click handlers (web push via FCM).
        importScripts: ['push-sw.js']
      },
      manifest: {
        name: 'Xepa - Lista de Compras',
        short_name: 'Xepa',
        description: 'Lista de compras colaborativa com preços do CEASA/RS.',
        lang: 'pt-BR',
        start_url: '/',
        theme_color: '#F5F4F0',
        background_color: '#FFD400', // brand yellow on the launch screen
        display: 'standalone',
        orientation: 'portrait',
        icons: [
          {
            src: '/icon-192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any maskable'
          },
          {
            src: '/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ]
})
