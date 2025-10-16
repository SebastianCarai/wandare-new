import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import { VitePWA } from 'vite-plugin-pwa'


export default defineConfig({
  plugins: [
    vue(),
    VitePWA({
      registerType: 'autoUpdate',
      strategies: 'injectManifest',
      srcDir: 'src',
      filename: 'service-worker.js',
      injectRegister: 'auto',
      manifest: {
        start_url: '/',
        scope: '/',
        name: 'Wandare',
        short_name: 'Wandare',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#4DBA87',
        icons: [
          { src: '/icons/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icons/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' }
        ]
      },
      workbox: {
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/wandare\.io\/.*$/,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              expiration: { maxEntries: 50, maxAgeSeconds: 300 }
            }
          }
        ]
      }
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src') // client/src
    }
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true
      }
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: '@use "@/style/variables.scss" as *;'
      }
    }
  },
})