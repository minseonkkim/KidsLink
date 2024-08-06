import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 5173,
    host : "0.0.0.0",
  },
  css: {
    modules: {
      localsConvention: 'camelCase',
    },
  },
  plugins: [
    react(),
    VitePWA({ 
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
      manifest: {
        name: 'Vite PWA Project',
        short_name: 'Vite PWA Project',
        theme_color: '#ffffff',
        icons: [
          {
            src: 'pwa-64x64.png',
            sizes: '64x64',
            type: 'image/png'
          },
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: 'maskable-icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable'
          }
        ],
      },
      workbox: {
        runtimeCaching: [], // 런타임 캐싱 비활성화
        navigateFallback: null, // 네비게이션 요청에 대해 index.html을 반환하지 않도록 설정
      },
      // 직접 작성한 service-worker.ts 파일을 사용하도록 설정
      srcDir: 'src',
      filename: 'service-worker.ts',
      strategies: 'injectManifest',
    })
  ],
})