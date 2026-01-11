# Legacy Blog Archive

這是我的舊版部落格存檔，使用 Hexo 靜態網站生成器和 Reimu 主題建立。此專案保存了我早期的學習記錄和技術文章，作為個人成長軌跡的重要檔案。

## 部署網址

- **存檔**: https://itousouta15.github.io/legacy-blog/
- **新版**: https://itousouta15.tw
- **轉送頁面**: [redirect.html](./redirect.html) (可用於從舊連結自動跳轉到新網站)

## 存檔內容

此存檔包含了從 **2025年4月** 到 **2025年10月** 期間的部落格文章：

### 主要文章
-  **AIS3 Pre-exam 挑戰經驗分享** - 資安競賽的學習心得與解題過程
-  **Hexo 部落格架設教學** - 從零開始建立 Hexo 靜態部落格的完整指南
-  **程式作品集展示** - 包含 ZeroJudge 線上解題等程式專案
-  **個人學習記錄** - 程式設計、網站開發的學習筆記

### 語言支援
-  繁體中文 (主要)
-  English (部分文章)

## 技術棧

- **靜態網站生成器**: Hexo 7.3.0
- **主題**: [Reimu](https://github.com/D-Sketon/hexo-theme-reimu) 1.9.2
- **部署平台**: GitHub Pages
- **自動化部署**: GitHub Actions
- **評論系統**: Waline
- **數學公式**: MathJax
- **圖表支援**: Mermaid

##  本地開發

```bash
# 克隆專案
git clone https://github.com/itousouta15/legacy-blog.git
cd legacy-blog

# 安裝依賴
npm install

# 啟動開發服務器
npm run server
# 或
npx hexo server

# 生成靜態檔案
npm run build
# 或
npx hexo generate

# 清理生成檔案
npm run clean
# 或
npx hexo clean
```

本地服務器會在 `http://localhost:4000` 啟動。

##  專案結構

```
legacy-blog/
├── source/                 # 源文件目錄
│   ├── _posts/            # 文章檔案
│   ├── _data/             # 數據檔案
│   ├── about/             # 關於頁面
│   ├── portfolio/         # 作品集頁面
│   ├── friend/            # 友情連結頁面
│   └── archive-info/      # 存檔說明頁面
├── themes/reimu/          # Reimu 主題檔案
├── .github/workflows/     # GitHub Actions 工作流程
├── _config.yml            # Hexo 主配置
├── _config.reimu.yml      # Reimu 主題配置
├── redirect.html          # 網站轉送頁面
└── package.json           # 專案依賴配置
```

##  自動部署

此專案使用 GitHub Actions 進行自動部署：

- 當推送到 `main` 或 `master` 分支時自動觸發
- 自動安裝依賴、生成靜態檔案
- 部署到 GitHub Pages

查看 [.github/workflows/pages.yml](./.github/workflows/pages.yml) 了解詳細配置。

##  聯絡方式

- **新版部落格**: [https://itousouta15.tw](https://itousouta15.tw)
- **GitHub**: [@itousouta15](https://github.com/itousouta15)
- **Instagram**: [@itou.souta15](https://www.instagram.com/itou.souta15)
- **Email**: [kuoray333@gmail.com](mailto:kuoray333@gmail.com)

*最後更新：2025年10月5日*