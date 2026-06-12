const CACHE_NAME = 'albayan-studio-cache-v2.2.0';

// Core static assets to pre-cache on service worker installation
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/vite.svg',
  '/icon.svg',
  'https://cdn.tailwindcss.com',
  'https://cdnjs.cloudflare.com/ajax/libs/tone/14.8.49/Tone.js',
  'https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;600;800&family=Fira+Code:wght@400;500&display=swap'
];

// Installs service worker and caches the essential shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[Service Worker] Pre-caching core application shell');
        return cache.addAll(PRECACHE_ASSETS);
      })
      .then(() => self.skipWaiting())
  );
});

// Activates and sweeps away any outdated caches from previous versions
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[Service Worker] Purging stale cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Dynamic request interceptor with a hybrid strategy
self.addEventListener('fetch', (event) => {
  const requestUrl = new URL(event.request.url);

  // Is this a request for the page document or local app routing?
  const isDocumentRequest = event.request.mode === 'navigate' || 
                            requestUrl.origin === self.location.origin && 
                            (requestUrl.pathname === '/' || requestUrl.pathname.endsWith('.html'));

  if (isDocumentRequest) {
    // Strategy: Network-First
    // Ensures users receive the absolute latest version when connected online,
    // but falls back directly to the cached offline-ready shell if network is down.
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // Clone and update the cache with the live network version
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
          return response;
        })
        .catch(() => {
          console.log('[Service Worker] Offline fallback triggered for navigation');
          return caches.match('/') || caches.match('/index.html');
        })
    );
    return;
  }

  // Strategy: Cache-First with Network Fallback & Update
  // For static resources, CDN libraries, fonts, and hashed Vite JS/CSS assets.
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        // Return from cache, but asynchronously update the cache in the background (Stale-While-Revalidate)
        fetch(event.request)
          .then((networkResponse) => {
            if (networkResponse.status === 200) {
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(event.request, networkResponse);
              });
            }
          })
          .catch(() => {/* Ignore background sync failures when completely offline */});
        
        return cachedResponse;
      }

      // If not cached, fetch from network and dynamically store for future offline runs
      return fetch(event.request).then((networkResponse) => {
        // Cache safe responses from local domain or certified CDNs
        const isCacheable = networkResponse.status === 200 && 
                            (requestUrl.origin === self.location.origin || 
                             requestUrl.hostname.includes('googleapis') || 
                             requestUrl.hostname.includes('gstatic') || 
                             requestUrl.hostname.includes('tailwindcss') || 
                             requestUrl.hostname.includes('cdnjs'));

        if (isCacheable) {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
        }
        return networkResponse;
      });
    })
  );
});
