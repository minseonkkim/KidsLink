/// <reference lib="webworker" />
/* eslint-disable no-restricted-globals */

import { clientsClaim } from 'workbox-core';
import { registerRoute } from 'workbox-routing';
import { precacheAndRoute,createHandlerBoundToURL } from 'workbox-precaching';

declare const self: ServiceWorkerGlobalScope;

clientsClaim();
precacheAndRoute(self.__WB_MANIFEST);

// Set up App Shell-style routing, so that all navigation requests
// are fulfilled with your index.html shell.
const fileExtensionRegexp = new RegExp('/[^/?]+\\.[^/]+$');
registerRoute(
  ({ request, url }: { request: Request; url: URL }) => {
    if (request.mode !== 'navigate') {
      return false;
    }
    if (url.pathname.startsWith('/_')) {
      return false;
    }
    if (url.pathname.match(fileExtensionRegexp)) {
      return false;
    }
    return true;
  },
  createHandlerBoundToURL(process.env.PUBLIC_URL + '/index.html')
);

// Skip waiting
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// const CACHE_NAME = "gih-cache-v2";
// const CACHED_URLS = [
//   "/index-offline.html",
//   "https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css",
//   "/css/gih-offline.css",
//   "/img/jumbo-background-sm.jpg",
//   "/img/logo-header.png",
// ];

// self.addEventListener("install", function (event) {
//   event.waitUntil(
//     caches.open(CACHE_NAME).then(function (cache) {
//       return cache.addAll(CACHED_URLS);
//     })
//   );
// });

self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request).catch((error) => {
      console.error('Fetching failed:', error);
      // Here you can handle the error, e.g., by returning a fallback response
      return new Response('Network error occurred', {
        status: 408,
        headers: { 'Content-Type': 'text/plain' },
      });
    })
  );
});