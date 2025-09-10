const CACHE_NAME = 'pdp-movies-v1';
const STATIC_CACHE = 'pdp-movies-static-v1';
const API_CACHE = 'pdp-movies-api-v1';
const IMAGE_CACHE = 'pdp-movies-images-v1';

// Files to cache immediately
const STATIC_ASSETS = [
  '/',
  '/movies',
  '/tv',
  '/manifest.json',
  '/favicon.ico',
  '/android-chrome-192x192.png',
  '/android-chrome-512x512.png',
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (
            cacheName !== CACHE_NAME &&
            cacheName !== STATIC_CACHE &&
            cacheName !== API_CACHE &&
            cacheName !== IMAGE_CACHE
          ) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch event - implement caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Handle API requests with network-first strategy
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      caches.open(API_CACHE).then((cache) => {
        return fetch(request)
          .then((response) => {
            // Cache successful responses
            if (response.status === 200) {
              cache.put(request, response.clone());
            }
            return response;
          })
          .catch(() => {
            // Return cached version if network fails
            return cache.match(request);
          });
      })
    );
    return;
  }

  // Handle TMDB images with cache-first strategy
  if (url.hostname === 'image.tmdb.org') {
    event.respondWith(
      caches.open(IMAGE_CACHE).then((cache) => {
        return cache.match(request).then((response) => {
          if (response) {
            return response;
          }
          return fetch(request).then((response) => {
            if (response.status === 200) {
              cache.put(request, response.clone());
            }
            return response;
          });
        });
      })
    );
    return;
  }

  // Handle static assets with cache-first strategy
  if (
    url.pathname.startsWith('/_next/static/') ||
    url.pathname.startsWith('/static/') ||
    STATIC_ASSETS.includes(url.pathname)
  ) {
    event.respondWith(
      caches.open(STATIC_CACHE).then((cache) => {
        return cache.match(request).then((response) => {
          return response || fetch(request);
        });
      })
    );
    return;
  }

  // Handle navigation requests with network-first strategy
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          return response;
        })
        .catch(() => {
          return caches.match('/');
        })
    );
    return;
  }

  // Default: try network first, fallback to cache
  event.respondWith(
    fetch(request)
      .then((response) => {
        return response;
      })
      .catch(() => {
        return caches.match(request);
      })
  );
});

// Background sync for failed requests
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(
      // Retry failed API requests
      retryFailedRequests()
    );
  }
});

async function retryFailedRequests() {
  // Implementation for retrying failed requests
  // This would typically involve checking IndexedDB for failed requests
  // and retrying them when network is available
}

// Push notifications (for future use)
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: '/android-chrome-192x192.png',
      badge: '/android-chrome-192x192.png',
      data: data.data,
    };
    
    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  }
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  event.waitUntil(
    clients.openWindow(event.notification.data?.url || '/')
  );
});
