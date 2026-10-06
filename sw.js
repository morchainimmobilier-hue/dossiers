/* ===========================================================================
   Dossiers de vente — le gardien hors ligne
   ---------------------------------------------------------------------------
   Ce fichier est installé par le navigateur et sert l'application même sans
   réseau. Il ne contient aucune donnée : les dossiers restent dans l'appareil
   (localStorage) et, si une base en ligne est connectée, dans votre Drive.

   La règle est simple :
     · tout ce qui appartient à l'application est servi depuis le cache, donc
       instantanément et sans réseau ;
     · tout le reste — au premier chef les appels au script Google — passe par
       le réseau sans jamais être mis en cache, sinon on relirait des données
       périmées.

   La version change à chaque fabrication. Un dépôt plus récent produit donc un
   fichier différent, que le navigateur détecte, installe en arrière-plan, et
   que la page propose d'adopter par un bandeau. Rien n'est remplacé tant que
   l'on n'a pas répondu.
   ======================================================================== */

const VERSION = "20261006-1740";
const CACHE   = "dossiers-" + VERSION;

/* Ce qu'il faut avoir sous la main pour démarrer sans réseau. */
const COQUILLE = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./icone-192.png",
  "./icone-512.png",
  "./icone-maskable.png",
  "./icone-apple.png"
];

self.addEventListener("install", e => {
  e.waitUntil((async () => {
    const c = await caches.open(CACHE);
    /* un fichier absent ne doit pas faire échouer toute l'installation */
    await Promise.all(COQUILLE.map(u =>
      c.add(new Request(u, { cache: "reload" })).catch(() => {})
    ));
  })());
});

self.addEventListener("activate", e => {
  e.waitUntil((async () => {
    for (const nom of await caches.keys()) {
      if (nom !== CACHE && nom.startsWith("dossiers-")) await caches.delete(nom);
    }
    if (self.registration.navigationPreload) {
      try { await self.registration.navigationPreload.disable(); } catch (err) {}
    }
    await self.clients.claim();
  })());
});

/* La page a cliqué « Mettre à jour » : on prend la main tout de suite. */
self.addEventListener("message", e => {
  if (e.data === "maintenant") self.skipWaiting();
});

self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET") return;

  let u;
  try { u = new URL(req.url); } catch (err) { return; }
  /* le script Google, et tout autre domaine, ne passent jamais par le cache */
  if (u.origin !== self.location.origin) return;

  e.respondWith((async () => {
    const cache = await caches.open(CACHE);
    /* toute navigation dans l'application rend la page unique de celle-ci */
    const cle = req.mode === "navigate" ? "./index.html" : req;
    const garde = await cache.match(cle);
    if (garde) return garde;
    try {
      const r = await fetch(req);
      if (r && r.ok && r.type === "basic") cache.put(cle, r.clone());
      return r;
    } catch (err) {
      const secours = await cache.match("./index.html");
      if (req.mode === "navigate" && secours) return secours;
      return new Response("", { status: 504, statusText: "hors ligne" });
    }
  })());
});
