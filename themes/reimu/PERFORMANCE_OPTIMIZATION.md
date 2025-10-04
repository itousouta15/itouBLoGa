# 效能優化說明

## 問題分析

根據效能分析報告，主要問題是 FontAwesome CSS 檔案從 JSDelivr CDN 載入時造成延遲：
- `regular.min.css` (0.4 KiB) - 450 毫秒延遲
- `solid.min.css` (0.3 KiB) - 100 毫秒延遲

## 優化方案

### 1. 資源提示優化
- **DNS 預解析**: 預先解析 CDN 域名
- **預連接**: 預先建立到 CDN 的連接
- **關鍵資源預載入**: 優先載入重要資源

### 2. CSS 載入策略優化
- **關鍵 CSS 載入**: 使用 `preload` 和 `media="print"` 策略
- **非同步載入**: 延遲載入非關鍵 CSS
- **備用方案**: 為 JavaScript 禁用時提供備用載入

### 3. 服務工作者快取
- **關鍵資源快取**: 快取重要的 CSS 和 JS 檔案
- **背景預載入**: 在背景預載入非關鍵資源
- **智慧快取策略**: 優先使用快取，網路作為備用

### 4. 動態資源載入
- **延遲載入**: 頁面載入完成後載入非關鍵資源
- **效能監控**: 監控頁面載入時間
- **載入指示器**: 提供視覺回饋

## 配置選項

在 `_config.yml` 中可以調整效能優化設定：

```yaml
performance:
  enable: true
  preload_critical: true
  dns_prefetch: true
  preconnect: true
  inline_critical_css: false
  defer_non_critical: true
  resource_hints_domains:
    - //cdn.jsdelivr.net
    - //fastly.jsdelivr.net
    - //unpkg.com
    - //npm.webcache.cn
```

## 預期效果

1. **減少首次內容繪製 (FCP) 時間**: 透過關鍵資源預載入
2. **減少最大內容繪製 (LCP) 時間**: 透過服務工作者快取
3. **減少累積佈局偏移 (CLS)**: 透過 CSS 載入策略優化
4. **提升整體載入速度**: 預期可減少 60-100 毫秒的載入時間

## 技術細節

### 關鍵 CSS 載入策略
```html
<link rel="preload" href="css-file.css" as="style" onload="this.onload=null;this.rel='stylesheet'" media="print" onload="this.media='all'">
```

### 服務工作者快取策略
- 安裝時快取關鍵資源
- 啟用時清理舊快取
- 攔截請求時優先使用快取

### 資源提示
```html
<link rel="dns-prefetch" href="//cdn.jsdelivr.net">
<link rel="preconnect" href="//cdn.jsdelivr.net" crossorigin="anonymous">
```

## 監控與除錯

- 瀏覽器開發者工具的 Network 標籤可以查看資源載入情況
- Console 中會顯示效能監控資訊
- Service Worker 狀態可以在 Application 標籤中查看

## 注意事項

1. 服務工作者需要 HTTPS 環境才能正常運作
2. 某些舊版瀏覽器可能不支援所有優化功能
3. 建議在生產環境中測試效能改善效果 