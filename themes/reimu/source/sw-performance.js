// 效能優化服務工作者
const CACHE_NAME = 'reimu-performance-v1';
const CRITICAL_RESOURCES = [
  '/css/style.css',
  'https://npm.webcache.cn/@fortawesome/fontawesome-free@6.5.1/css/regular.min.css',
  'https://npm.webcache.cn/@fortawesome/fontawesome-free@6.5.1/css/solid.min.css'
];

// 安裝事件 - 快取關鍵資源
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('快取關鍵資源');
        return cache.addAll(CRITICAL_RESOURCES);
      })
      .catch(error => {
        console.log('快取失敗:', error);
      })
  );
});

// 啟用事件 - 清理舊快取
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('刪除舊快取:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// 攔截請求 - 優先使用快取
self.addEventListener('fetch', event => {
  // 只處理 GET 請求
  if (event.request.method !== 'GET') return;

  // 檢查是否為關鍵資源
  const isCriticalResource = CRITICAL_RESOURCES.some(url => 
    event.request.url.includes(url)
  );

  if (isCriticalResource) {
    event.respondWith(
      caches.match(event.request)
        .then(response => {
          // 如果快取中有資源，立即返回
          if (response) {
            return response;
          }

          // 否則從網路載入並快取
          return fetch(event.request)
            .then(response => {
              // 檢查回應是否有效
              if (!response || response.status !== 200 || response.type !== 'basic') {
                return response;
              }

              // 複製回應並快取
              const responseToCache = response.clone();
              caches.open(CACHE_NAME)
                .then(cache => {
                  cache.put(event.request, responseToCache);
                });

              return response;
            });
        })
    );
  }
});

// 背景同步 - 預載入資源
self.addEventListener('sync', event => {
  if (event.tag === 'preload-resources') {
    event.waitUntil(preloadResources());
  }
});

// 預載入資源函數
function preloadResources() {
  return caches.open(CACHE_NAME)
    .then(cache => {
      const resourcesToPreload = [
        'https://npm.webcache.cn/@fortawesome/fontawesome-free@6.5.1/css/brands.min.css',
        'https://npm.webcache.cn/@fortawesome/fontawesome-free@6.5.1/css/v5-font-face.min.css'
      ];

      return Promise.all(
        resourcesToPreload.map(url => 
          fetch(url)
            .then(response => cache.put(url, response))
            .catch(error => console.log('預載入失敗:', url, error))
        )
      );
    });
} 