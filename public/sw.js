const CACHE_PREFIX = 'adala-contracts-';
const CACHE_NAME = `${CACHE_PREFIX}v3`;
const CORE_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icons/icon-192.svg',
  '/icons/icon-512.svg',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(CORE_ASSETS))
      .catch((error) => console.warn('[SW] Could not cache core assets:', error))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys
        .filter((key) => key.startsWith(CACHE_PREFIX) && key !== CACHE_NAME)
        .map((key) => caches.delete(key))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  if (request.method !== 'GET' || url.origin !== self.location.origin) return;

  if (url.pathname.startsWith('/api/')) {
    event.respondWith(fetch(request).catch(() => new Response(JSON.stringify({
      error: 'OFFLINE_MODE',
      isOffline: true,
      message: 'الجهاز في وضع عدم الاتصال. القوالب والعقود والملفات المحفوظة محلياً ما زالت متاحة.',
    }), { status: 503, headers: { 'Content-Type': 'application/json; charset=utf-8' } })));
    return;
  }

  if (request.mode === 'navigate') {
    event.respondWith((async () => {
      const cache = await caches.open(CACHE_NAME);
      try {
        const response = await fetch(request);
        if (response.ok) {
          const html = response.clone();
          const text = await response.clone().text();
          const assets = [...text.matchAll(/(?:src|href)="(\/assets\/[^\"]+)"/g)].map((match) => match[1]);
          const downloaded = await Promise.all(assets.map(async (asset) => {
            try {
              const assetResponse = await fetch(asset);
              return assetResponse.ok ? [asset, assetResponse] : null;
            } catch {
              return null;
            }
          }));

          // Replace the cached document only after its referenced build assets are available.
          if (downloaded.every(Boolean)) {
            await Promise.all(downloaded.map(([asset, responseAsset]) => cache.put(asset, responseAsset)));
            await cache.put('/index.html', html);
          }
        }
        return response;
      } catch {
        return (await cache.match('/index.html')) || Response.error();
      }
    })());
    return;
  }

  event.respondWith(caches.match(request).then((cached) => {
    if (cached) return cached;
    return fetch(request).then((response) => {
      if (response.ok && (url.pathname.startsWith('/assets/') || CORE_ASSETS.includes(url.pathname))) {
        const copy = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
      }
      return response;
    });
  }));
});
