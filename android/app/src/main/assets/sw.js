const CACHE = "tigeglass-v4";
const ASSETS = [
  "./manifest.json",
  "./icon-192.png",
  "./icon-512.png",
  "./assets/textures/waternormals.jpg",
  "./assets/textures/water_foam.png",
  "./assets/textures/belfast_sunset_1k.hdr",
  "./assets/textures/boat_wood_diff.jpg",
  "./assets/textures/boat_wood_nor.jpg",
  "./assets/textures/boat_wood_rough.jpg",
  "./assets/textures/canvas_sail_diff.jpg",
  "./assets/textures/canvas_sail_nor.jpg",
  "./assets/textures/stone_diff.jpg",
  "./assets/textures/stone_nor.jpg",
  "./assets/textures/rune_glow.png",
  "./assets/audio/ocean_ambient.wav",
  "./assets/audio/bell_chime.wav",
  "./assets/audio/boat_creak.wav",
  "./assets/audio/water_spray.wav"
];

self.addEventListener("install", e => {
  e.waitUntil(
    caches.open(CACHE).then(c => {
      return Promise.allSettled(ASSETS.map(url => c.add(url)));
    })
  );
  self.skipWaiting();
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Network-first for HTML pages so updates are instantaneous; cache fallback for offline
self.addEventListener("fetch", e => {
  if (e.request.mode === 'navigate' || e.request.destination === 'document') {
    e.respondWith(
      fetch(e.request)
        .then(res => {
          const clone = res.clone();
          caches.open(CACHE).then(c => c.put(e.request, clone));
          return res;
        })
        .catch(() => caches.match(e.request))
    );
    return;
  }
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request))
  );
});
