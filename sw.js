var CACHE_NAME = 'static-v7';

self.addEventListener('install', function (event) {
	console.log(event);
  //event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      return cache.addAll([
		'./index.html',
		'./main.css',
		'./main.js',
		'./material.min.css',
		'./material.min.js',
		'./icon-192x192.png',
		'./icon-144x144.png',
		'./favicon.ico',
		'./addtohomescreen.css',
		'./addtohomescreen.min.js',
		'./offline.manifest',
		'./manifest.json',
		'./chart.js',
		'./DecoderWorker.js',
		'./qrcodelib.js',
		'./webcodecamjs.js',
		'./Blob.js',
		'./FileSaver.min.js'
      ]);
    })
  //)
});

self.addEventListener('activate', function activator(event) {
	console.log(event);
  //event.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys
        .filter(function (key) {
          return key.indexOf(CACHE_NAME) !== 0;
        })
        .map(function (key) {
          return caches.delete(key);
        })
      );
    })
  //);
});

self.addEventListener('fetch', function (event) {
  event.respondWith(
    caches.match(event.request).then(function (cachedResponse) {
      return cachedResponse || fetch(event.request);
    })
  );
});
