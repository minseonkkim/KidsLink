/// <reference lib="webworker" />
/* eslint-disable no-restricted-globals */

import { clientsClaim } from 'workbox-core';
import { precacheAndRoute,createHandlerBoundToURL } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';


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
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  console.log('Fetch request for:', url.pathname);

  // Check if the request is for the OAuth2 path and skip caching
  if (
    url.pathname.startsWith('/login/oauth2') ||
    url.pathname.startsWith('/oauth2') ||
    url.pathname.startsWith('/oauth2/authorization/kakao')
  ) {
    console.log('Skipping caching for:', url.pathname);
    event.respondWith(fetch(event.request));
    return;
  }

  console.log('Handling request for:', url.pathname);

  // Handle other requests
  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) {
        console.log('Found in cache:', url.pathname);
      } else {
        console.log('Not found in cache, fetching from network:', url.pathname);
      }
      return response || fetch(event.request).then((fetchResponse) => {
        return caches.open('dynamic-cache').then((cache) => {
          console.log('Caching response for:', url.pathname);
          cache.put(event.request, fetchResponse.clone());
          return fetchResponse;
        });
      });
    })
  );
});