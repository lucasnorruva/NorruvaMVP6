// --- File: src/utils/registerServiceWorker.ts ---
// Description: Utility function to register the service worker.

export function registerServiceWorker() {
  if (typeof window !== 'undefined' && 'serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js')
        .then(registration => {
          console.log('[Norruva PWA] Service Worker registered with scope:', registration.scope);
        })
        .catch(error => {
          console.error('[Norruva PWA] Service Worker registration failed:', error);
        });
    });
  } else if (typeof window !== 'undefined' && 'serviceWorker' in navigator && process.env.NODE_ENV !== 'production') {
    // In development, unregister any existing service workers to avoid caching issues
    // that might interfere with HMR or displaying the latest changes.
    navigator.serviceWorker.getRegistrations().then(registrations => {
      for (const registration of registrations) {
        registration.unregister();
        console.log('[Norruva PWA Dev] Unregistered existing service worker.', registration);
      }
    });
  }
}
