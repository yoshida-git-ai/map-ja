// 古いキャッシュ
var CACHE_OLD = ['cache-v001', 'cache-v002'];
// キャッシュ名とキャッシュファイルの指定
var CACHE_NAME = 'cache-v003';
var urlsToCache = [
  '/',
  '/styles.css',
  '/images/favicon.ico'
];
// インストール処理
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then(function(cache) {
        return cache.addAll(urlsToCache);
      })
  );
});
// 古いキャッシュの削除
self.addEventListener('activate', function(event) {
  var cacheWhitelist = [CACHE_OLD, CACHE_NAME];
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// リソースフェッチ時のキャッシュロード処理
self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches
      .match(event.request)
      .then(function(response) {
        return response ? response : fetch(event.request);
      })
  );
});
// 動的リクエストをクローンし、キャッシュ
function requestBackend(event){
  var url = event.request.clone();
  return fetch(url).then(function(res){
    if(!res || res.status !== 200 || res.type !== 'basic'){
      return res;
    }
    var response = res.clone();
    caches.open(CACHE_NAME).then(function(cache){
      cache.put(event.request, response);
    });
    return res;
  })
}
