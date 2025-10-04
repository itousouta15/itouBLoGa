// 效能優化器
(function() {
  'use strict';

  // 延遲載入非關鍵資源
  function loadDeferredResources() {
    // 延遲載入 FontAwesome 低優先級資源
    const deferredFontAwesome = [
      'https://npm.webcache.cn/@fortawesome/fontawesome-free@6.5.1/css/brands.min.css',
      'https://npm.webcache.cn/@fortawesome/fontawesome-free@6.5.1/css/v5-font-face.min.css',
      'https://npm.webcache.cn/@fortawesome/fontawesome-free@6.5.1/css/v4-font-face.min.css'
    ];

    deferredFontAwesome.forEach(href => {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = href;
      link.crossOrigin = 'anonymous';
      document.head.appendChild(link);
    });
  }

  // 資源載入完成後的回調
  function onResourceLoad() {
    // 移除載入指示器
    const loader = document.querySelector('.loader');
    if (loader) {
      loader.style.opacity = '0';
      setTimeout(() => {
        loader.style.display = 'none';
      }, 300);
    }
  }

  // 檢查頁面是否已載入完成
  function checkPageLoad() {
    if (document.readyState === 'complete') {
      loadDeferredResources();
      onResourceLoad();
    } else {
      window.addEventListener('load', function() {
        loadDeferredResources();
        onResourceLoad();
      });
    }
  }

  // 初始化
  checkPageLoad();

  // 效能監控
  if ('performance' in window) {
    window.addEventListener('load', function() {
      setTimeout(function() {
        const perfData = performance.getEntriesByType('navigation')[0];
        console.log('頁面載入時間:', perfData.loadEventEnd - perfData.loadEventStart, 'ms');
        console.log('DOM 內容載入時間:', perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart, 'ms');
      }, 0);
    });
  }
})(); 