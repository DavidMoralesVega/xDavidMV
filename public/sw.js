/**
 * Service Worker kill-switch.
 *
 * The previous SW cached HTML responses with their Content-Encoding header,
 * causing browsers to render double-decoded (garbage/binary) responses.
 * This replacement unregisters itself and purges all caches on install/activate,
 * recovering any visitor that still has the old SW installed.
 */

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      try {
        const cacheNames = await caches.keys();
        await Promise.all(cacheNames.map((name) => caches.delete(name)));
      } catch (e) {}

      try {
        await self.registration.unregister();
      } catch (e) {}

      try {
        const clients = await self.clients.matchAll({ type: 'window' });
        for (const client of clients) {
          client.navigate(client.url);
        }
      } catch (e) {}
    })()
  );
});

self.addEventListener('fetch', () => {});
