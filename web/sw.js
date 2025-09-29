   // Simple service worker for caching (precache app shell, cache API calls)
   const CACHE_NAME = 'stickersmash-v1';
   const urlsToCache = [
     '/',  // Main page
     '/static/js/bundle.js',  // Adjust based on your build (Expo bundles)
     '/static/css/bundle.css',  // If using styles
     '/apple-touch-icon.png',  // Icons
     // Add sticker images: '/assets/stickers/*.png'
   ];
   self.addEventListener('install', (event) => {
     event.waitUntil(
       caches.open(CACHE_NAME)
         .then((cache) => cache.addAll(urlsToCache))
     );
   });
   self.addEventListener('fetch', (event) => {
     event.respondWith(
       caches.match(event.request)
         .then((response) => {
           // Return cached version or fetch from network
           return response || fetch(event.request);
         })
     );
   });

