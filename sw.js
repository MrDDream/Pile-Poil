/*
  Service worker de Pile-poil : permet d'installer l'app et d'y jouer hors connexion
  (mode « un seul téléphone »).

  Stratégie « réseau d'abord » : en ligne, on sert toujours la dernière version du site
  et on la garde en cache ; hors ligne, on sert la copie en cache.
  Les requêtes vers d'autres sites (Firebase) ne passent pas par ici.
*/
const CACHE = "pile-poil-v1";
const SHELL = [
  "./",
  "index.html",
  "confidentialite.html",
  "style.css",
  "fonts.css",
  "fonts/fredoka-latin.woff2",
  "fonts/fredoka-latin-ext.woff2",
  "fonts/nunito-latin.woff2",
  "fonts/nunito-latin-ext.woff2",
  "firebase-config.js",
  "storage.js",
  "questions/1-complicite.js",
  "questions/2-souvenirs.js",
  "questions/3-seduction.js",
  "questions/4-coquin.js",
  "questions/5-brulant.js",
  "vendor/qrcode.js",
  "app.js",
  "manifest.webmanifest",
  "icon.svg",
  "icons/icon-192.png",
  "icons/icon-512.png",
  "icons/apple-touch-icon.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE)
      .then((cache) => cache.addAll(SHELL.map((url) => new Request(url, { cache: "reload" }))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return; // Firebase et autres : pas de cache

  event.respondWith((async () => {
    const cache = await caches.open(CACHE);
    try {
      const res = await fetch(req, { cache: "no-cache" });
      // Une page est rangée sans son ?code=…, pour la retrouver hors ligne.
      if (res.ok) cache.put(req.mode === "navigate" ? url.origin + url.pathname : req, res.clone());
      return res;
    } catch (e) {
      // Hors ligne : la page demandée (lien d'invitation ?code=… compris) ou l'accueil.
      const hit = await cache.match(req, { ignoreSearch: true });
      if (hit) return hit;
      if (req.mode === "navigate") return (await cache.match("index.html")) || Response.error();
      return Response.error();
    }
  })());
});
