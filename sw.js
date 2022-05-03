// Adapted from https://adactio.com/serviceworker.js
'use strict';

const version = '2022-05-03';
const cacheName = `cache-${version}`;

function updateCache() {
  return caches.open(cacheName)
  .then( cache => {
    // These items must be cached for the Service Worker to complete installation
    return cache.addAll([
      `/index.html`,
      `/styles.css?${version}`,
      `/index.js?${version}`,
      `/modules/checklist-object-converter.js?${version}`,
      `/modules/make-checkable.js?${version}`,
      `/modules/storage.js?${version}`,
      `/offline`
    ]);
  });
}

// Cache the page(s) that initiate the service worker
function cacheClients() {
  const pages = [];
  return clients.matchAll({
    includeUncontrolled: true
  })
  .then( allClients => {
    for (const client of allClients) {
      pages.push(client.url);
    }
  })
  .then ( () => {
    caches.open(pagesCacheName)
    .then( pagesCache => {
      return pagesCache.addAll(pages);
    });
  })
}

// Remove caches whose name is no longer valid
function clearOldCaches() {
  return caches.keys()
  .then( keys => {
    return Promise.all(keys
      .filter(key => cacheName !== key)
      .map(key => caches.delete(key))
    );
  });
}

addEventListener('install', event => {
  event.waitUntil(
    updateCache()
    .then( () => {
      cacheClients()
    })
    .then( () => {
      return skipWaiting();
    })
  );
});

addEventListener('activate', event => {
  event.waitUntil(
    clearOldCaches()
    .then( () => {
      return clients.claim();
    })
  );
});

if (registration.navigationPreload) {
  addEventListener('activate', event => {
    event.waitUntil(
      registration.navigationPreload.enable()
    );
  });
}

addEventListener('fetch', event => {
  const request = event.request;

  // Ignore non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  const retrieveFromCache = caches.match(request);

    // For HTML requests, try the cache first, fall back to the network, finally the offline page
  if (request.mode === 'navigate' || request.headers.get('Accept').includes('text/html')) {
    event.respondWith(
      retrieveFromCache
      .then(responseFromCache => {
        // CACHE
        return responseFromCache || fetch(request)
        .then( responseFromFetch => {
          // NETWORK
          return responseFromFetch;
        })
        .catch( fetchError => {
          console.error(fetchError, request);
          // CACHE or FALLBACK
          retrieveFromCache
          .then( responseFromCache => {
            resolveWithResponse(
              responseFromCache || caches.match('/offline')
            );
          });
        });
      })
    )
    return;
  }

    // For non-HTML requests, look in the cache first, fall back to the network
  event.respondWith(
    retrieveFromCache
    .then(responseFromCache => {
      // CACHE
      return responseFromCache || fetch(request)
      .then( responseFromFetch => {
        // NETWORK
        return responseFromFetch;
      })
      .catch( fetchError => {
        console.error(fetchError);
      });
    })
  );
});

