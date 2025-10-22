import { registerSW } from 'virtual:pwa-register';

export const registerPWA = registerSW({
    immediate: true, // register service worker as soon as possible
    onRegisteredSW() {
        // Optional: can log or track registration status
    },
    onNeedRefresh() {
        // Automatically refresh when a new SW is waiting
        updateServiceWorker();
    },
    onOfflineReady() {
        console.log('PWA ready to work offline');
    },
});

function updateServiceWorker() {
    const registration = (navigator as any).serviceWorker?.controller;
    if (registration) {
        (registration as any).postMessage({ type: 'SKIP_WAITING' });
    }
}
