export function registerServiceWorker() {
  if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
    window.addEventListener('load', async () => {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js');
        
        console.log('Service Worker registered successfully:', registration);
        
        // Check for updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed') {
                if (navigator.serviceWorker.controller) {
                  // New version available
                  console.log('New version available! Please refresh.');
                  showUpdateNotification();
                } else {
                  // First time installation
                  console.log('App is ready for offline use.');
                }
              }
            });
          }
        });

        // Handle service worker messages
        navigator.serviceWorker.addEventListener('message', (event) => {
          if (event.data && event.data.type === 'CACHE_UPDATED') {
            console.log('Cache updated:', event.data.payload);
          }
        });

      } catch (error) {
        console.error('Service Worker registration failed:', error);
      }
    });
  }
}

function showUpdateNotification() {
  // You could show a toast or modal here
  if (confirm('A new version is available! Refresh to update?')) {
    window.location.reload();
  }
}

// Check if app is running as PWA
export function isPWA(): boolean {
  return window.matchMedia('(display-mode: standalone)').matches;
}

// Check if device is online
export function isOnline(): boolean {
  return navigator.onLine;
}

// Listen for online/offline events
export function setupNetworkListeners() {
  if (typeof window !== 'undefined') {
    window.addEventListener('online', () => {
      console.log('App is back online');
      // You could trigger cache sync here
    });

    window.addEventListener('offline', () => {
      console.log('App is offline');
      // You could show offline indicator here
    });
  }
}

// Preload critical resources
export async function preloadCriticalResources() {
  if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
    // Send message to service worker to preload critical resources
    navigator.serviceWorker.controller.postMessage({
      type: 'PRELOAD_CRITICAL',
      urls: [
        '/api/movies/popular?page=1',
        '/api/tv/popular?page=1',
        '/api/genres/movies',
        '/api/genres/tv',
      ]
    });
  }
}
