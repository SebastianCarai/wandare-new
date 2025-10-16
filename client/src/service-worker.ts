/// <reference lib="webworker" />
export default null // 👈 prevents Vite from treating this as a normal module

// --- Workbox imports ---
import { clientsClaim } from 'workbox-core'
import { precacheAndRoute } from 'workbox-precaching'

// --- Bind correct types ---
declare const self: ServiceWorkerGlobalScope

// --- Activate immediately ---
self.skipWaiting()
clientsClaim()

// --- Precache assets injected by VitePWA ---
precacheAndRoute(self.__WB_MANIFEST)

// --- Custom guard: ignore /api/* requests entirely ---
self.addEventListener('fetch', (event: FetchEvent) => {
  const url = new URL(event.request.url)

  // Don’t intercept any API calls, including /api/callback
  if (url.pathname.startsWith('/api/')) return
})
