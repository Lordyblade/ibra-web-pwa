const CACHE_NAME = "ibra-cache-v6";
const urlsToCache = [
  "/",
  "/index.html",
  "/about.html",
  "/contact.html",
  "/offline.html",
  "/styleAbout.css",
  "/styleIndex.css",
  "/styleContact.css",
  "/styleOffline.css",
  "/script.js",
  "/manifest.json",
  "/icons/icon-192.png",
  "/icons/icon-512.png"
];

// Saat instalasi, cache semua file penting
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log("📦 Menyimpan file ke cache...");
      return cache.addAll(urlsToCache);
    }).catch(err => console.error("❌ Gagal cache:", err))
  );
  self.skipWaiting(); // langsung aktif tanpa reload ulang
});

// Saat fetch — tangani semua permintaan
self.addEventListener("fetch", event => {
  // Jika permintaan adalah halaman (navigasi)
  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          // Jika berhasil fetch online, kembalikan hasil
          return response;
        })
        .catch(() => {
          // Jika offline, tampilkan halaman offline
          console.warn("⚠️ Offline - Menampilkan offline.html");
          return caches.match("/offline.html");
        })
    );
  } else {
    // Jika permintaan adalah file (CSS, JS, gambar)
    event.respondWith(
      caches.match(event.request).then(response => {
        // Jika ditemukan di cache → pakai cache
        return response || fetch(event.request);
      })
    );
  }
});

// Saat aktivasi — hapus cache lama
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(name => {
          if (name !== CACHE_NAME) {
            console.log("🧹 Menghapus cache lama:", name);
            return caches.delete(name);
          }
        })
      );
    })
  );
  self.clients.claim();
});
