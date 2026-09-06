const CACHE_NAME = "financas-marina-luca-v10";

const ARQUIVOS_CACHE = [
  "./",
  "./index.html",
  "./manifest.json",
  "./icon-192.png",
  "./icon-512.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ARQUIVOS_CACHE);
    })
  );

  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((chaves) => {
      return Promise.all(
        chaves
          .filter((chave) => chave !== CACHE_NAME)
          .map((chave) => caches.delete(chave))
      );
    })
  );

  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((resposta) => {
        const copia = resposta.clone();

        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, copia);
        });

        return resposta;
      })
      .catch(() => {
        return caches.match(event.request).then((respostaCache) => {
          return respostaCache || caches.match("./index.html");
        });
      })
  );
});