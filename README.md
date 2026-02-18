
<div align="center">

![網站圖片](https://raw.githubusercontent.com/itousouta15/itousouta15.github.io/main/source/img/Newweb.webp)

# itousouta15.github.io

![伊藤蒼太](https://img.shields.io/badge/Author-伊藤蒼太-blue?style=for-the-badge)
![Hexo](https://img.shields.io/badge/Hexo-7.3.0-0e83cd?style=for-the-badge&logo=hexo)
![AnZhiYu Theme](https://img.shields.io/badge/Theme-AnZhiYu-ff69b4?style=for-the-badge)
![Status](https://img.shields.io/website?down_color=red&down_message=offline&style=for-the-badge&up_color=green&up_message=online&url=https%3A//itousouta15.tw)

[🏠 訪問網站](https://itousouta15.tw) • [📖 閱讀文章](https://itousouta15.tw/archives/) • [👥 友鏈申請](https://itousouta15.tw/link/) • [💬 留言板](https://itousouta15.tw/comments/)

</div>

##  技術棧

<div align="center">

![Hexo](https://img.shields.io/badge/Hexo-0e83cd?style=flat-square&logo=hexo&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=node.js&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black)
![Stylus](https://img.shields.io/badge/Stylus-333333?style=flat-square&logo=stylus&logoColor=white)
![Pug](https://img.shields.io/badge/Pug-A86454?style=flat-square&logo=pug&logoColor=white)
![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-222222?style=flat-square&logo=github&logoColor=white)

</div>

### 核心依賴

- **Hexo**: 7.3.0 - 靜態網站生成器
- **AnZhiYu Theme**: 1.6.14 - 主題框架
- **hexo-wordcount**: 6.0.1 - 字數統計
- **hexo-deployer-git**: 4.0.0 - Git 部署
- **hexo-generator-searchdb**: 1.5.0 - 搜索功能

##  專案結構

```
my-blog/
├──  source/          # 源文件目錄
│   ├──  _posts/      # 文章文件
│   ├──  _data/       # 數據文件（友鏈、關於頁面等）
│   ├──  img/         # 圖片資源
│   └──  CNAME        # 自定義域名設定
├──  themes/          # 主題目錄
│   └──  anzhiyu/     # AnZhiYu 主題
├──  public/          # 生成的靜態文件
├──  _config.yml      # Hexo 主配置文件
├──  _config.anzhiyu.yml # 主題配置文件
└──  package.json     # 專案依賴配置
```

## 快速開始

### 環境要求

- Node.js >= 16.0.0
- npm 或 yarn

### 本地開發

```bash
# 克隆專案
git clone https://github.com/itousouta15/itousouta15.github.io.git
cd itousouta15.github.io

# 安裝依賴
npm install

# 清理緩存
hexo clean

# 生成靜態文件
hexo generate

# 啟動本地服務器
hexo server
# 訪問 http://localhost:4000
```

### 常用命令

```bash
# 創建新文章
hexo new post "文章標題"

# 創建新頁面
hexo new page "頁面名稱"

# 清理並重新生成
hexo clean && hexo generate

# 部署到 GitHub Pages
hexo deploy

# 啟動本地預覽服務器
hexo server
```