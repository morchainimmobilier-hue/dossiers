/* =====================================================================
   DOSSIERS DE VENTE — le gardien hors ligne
   ---------------------------------------------------------------------
   Ce petit fichier est ce qui permet à l'application de s'ouvrir sans
   réseau : il garde une copie de la page dans l'appareil et la sert
   lui-même quand le réseau manque.

   Il est aussi ce qui déclenche les mises à jour. Le navigateur compare
   ce fichier-ci, octet par octet, à celui qu'il connaît déjà : s'il a
   changé, il installe la nouveauté en arrière-plan, et l'application
   affiche son bandeau « une nouvelle version est prête ». Tant que
   personne ne clique, c'est l'ancienne qui tourne — on ne recharge pas
   la page de quelqu'un au milieu d'une saisie.

   C'est pourquoi une livraison comporte TOUJOURS ce fichier en plus de
   index.html : le nom du cache ci-dessous porte la date de fabrication,
   donc déposer les deux suffit à faire apparaître le bandeau.
   ===================================================================== */

const CACHE = "dossiers-20261026-1725";

/* On ne pré-charge que le strict nécessaire : la page et son adresse de
   base. Les icônes et la carte d'identité se mettront en cache d'elles
   mêmes à la première visite. Si l'une d'elles manquait, l'installation
   échouerait toute entière — et l'application deviendrait injoignable
   hors ligne pour une icône absente. */
const ESSENTIEL = ["./", "index.html"];

self.addEventListener("install", e=>{
  e.waitUntil(
    caches.open(CACHE).then(c=> c.addAll(ESSENTIEL)).catch(()=>{})
  );
  /* pas de skipWaiting ici : on attend que l'utilisateur accepte */
});

/* En s'activant on fait le ménage des caches des versions précédentes.

   On ne réclame surtout pas les pages déjà ouvertes (clients.claim) :
   à la toute première visite, cela ferait se recharger la page sous les
   yeux de quelqu'un qui vient d'arriver. L'application prendra la main
   d'elle même au lancement suivant. Lors d'une mise à jour acceptée,
   c'est skipWaiting qui transfère les pages, et l'application recharge
   alors de son propre chef. */
self.addEventListener("activate", e=>{
  e.waitUntil((async ()=>{
    const noms = await caches.keys();
    await Promise.all(noms.map(n=> n === CACHE ? null : caches.delete(n)));
  })());
});

/* L'application nous parle quand l'utilisateur clique « Mettre à jour ». */
self.addEventListener("message", e=>{
  if(e.data === "maintenant") self.skipWaiting();
});

/* ---------------------------------------------------------------------
   Les requêtes.

   Tout ce qui ne vient pas de notre propre adresse — le script Google,
   les fonds de carte, la recherche d'adresses — passe droit au réseau
   et n'est jamais mis en cache : ce sont des données vivantes, et une
   réponse périmée serait pire que pas de réponse.

   Pour nos propres fichiers : on répond tout de suite avec la copie
   gardée (l'application s'ouvre instantanément, réseau ou pas), et on
   rafraîchit la copie en arrière-plan. La nouveauté ne s'affiche donc
   qu'au lancement suivant, jamais sous les doigts de quelqu'un.
   --------------------------------------------------------------------- */
self.addEventListener("fetch", e=>{
  const r = e.request;
  if(r.method !== "GET") return;

  let u;
  try{ u = new URL(r.url); }catch(err){ return; }
  if(u.origin !== self.location.origin) return;

  e.respondWith((async ()=>{
    const cache = await caches.open(CACHE);
    const garde = await cache.match(r, { ignoreSearch: true });

    const reseau = fetch(r).then(rep=>{
      if(rep && rep.ok && rep.type !== "opaque"){
        cache.put(r, rep.clone()).catch(()=>{});
      }
      return rep;
    });

    if(garde){
      reseau.catch(()=>{});          /* en arrière-plan, sans bruit */
      return garde;
    }

    try{
      return await reseau;
    }catch(err){
      /* hors ligne et rien en cache : si c'est une navigation, on sert
         la page d'accueil, qui est, elle, toujours gardée */
      if(r.mode === "navigate"){
        const acc = await cache.match("index.html") || await cache.match("./");
        if(acc) return acc;
      }
      return new Response("", { status: 504, statusText: "Hors ligne" });
    }
  })());
});
