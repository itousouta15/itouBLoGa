// 簡化效能優化器
(function() {
  'use strict';

  // 效能監控
  function monitorPerformance() {
    if ('performance' in window) {
      window.addEventListener('load', function() {
        setTimeout(function() {
          const perfData = performance.getEntriesByType('navigation')[0];
          if (perfData) {
            console.log('🚀 效能監控:');
            console.log('  頁面載入時間:', perfData.loadEventEnd - perfData.loadEventStart, 'ms');
            console.log('  DOM 內容載入時間:', perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart, 'ms');
            console.log('  首次內容繪製:', performance.getEntriesByName('first-contentful-paint')[0]?.startTime || 'N/A', 'ms');
          }
        }, 0);
      });
    }
  }

  // 資源載入優化
  function optimizeResourceLoading() {
    // 檢查是否已載入關鍵 FontAwesome 資源
    const criticalFontAwesome = [
      'https://npm.webcache.cn/@fortawesome/fontawesome-free@6.5.1/css/regular.min.css',
      'https://npm.webcache.cn/@fortawesome/fontawesome-free@6.5.1/css/solid.min.css'
    ];

    criticalFontAwesome.forEach(href => {
      const link = document.querySelector(`link[href="${href}"]`);
      if (link) {
        link.addEventListener('load', function() {
          console.log('✅ 關鍵資源載入完成:', href);
        });
        link.addEventListener('error', function() {
          console.warn('❌ 關鍵資源載入失敗:', href);
        });
      }
    });
  }

  // 初始化
  function init() {
    monitorPerformance();
    optimizeResourceLoading();
    
    // 頁面載入完成後執行
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', function() {
        console.log('📄 DOM 內容載入完成');
      });
    }
    
    window.addEventListener('load', function() {
      console.log('🎉 頁面完全載入完成');
    });
  }

  // 啟動優化器
  init();
})(); 