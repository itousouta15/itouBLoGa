# itousouta15.github.io

個人部落格，使用 Hexo 框架構建。

## 倉庫結構

本倉庫分為兩個主要分支，各自承擔不同的職責：

### main 分支
- **內容**: Hexo 生成的靜態網站（`public/` 目錄內容）
- **用途**: GitHub Pages 直接部署
- **自動更新**: 否（手動部署）
- **包含**: HTML、CSS、JS、圖片等靜態文件

### source 分支
- **內容**: Hexo 源代碼和配置
- **用途**: 版本控制、文章備份、主題配置
- **自動更新**: 是
- **包含**: 
  - Markdown 文章 (`source/_posts/`)
  - Hexo 配置文件 (`_config.yml`, `_config.reimu.yml`)
  - 主題文件 (`themes/`)
  - 依賴配置 (`package.json`)

## 開發工作流

### 1. 編輯文章或配置
在本地編輯你的文章或配置文件（應該已在 source 分支）：
```bash
# 編輯文章
source/_posts/你的文章.md

# 編輯配置
_config.yml  # Hexo 通用配置
_config.reimu.yml  # Reimu 主題配置
```

### 2. 本地預覽
```bash
# 清理並重新生成
hexo clean
hexo g

# 本地伺服器預覽
hexo s
# 訪問 http://localhost:4000
```

### 3. 部署到 GitHub Pages
```bash
# 確保已切換到 source 分支
git checkout source

# 保存源代碼更改
git add .
git commit -m "Add/Update: 你的提交信息"
git push origin source

# 生成靜態文件
hexo clean
hexo g

# 切換到 main 分支
git checkout main

# 複製 public 目錄內容到根目錄
# (使用文件管理器或命令行依據你的系統)

# 提交靜態文件到 GitHub Pages
git add -A
git commit -m "Deploy: 更新網站内容 - 日期"
git push origin main --force
```

### 4. 切換回 source 分支
```bash
git checkout source
```

## 關鍵配置

### .gitignore (source 分支)
確保以下內容被忽略：
```
node_modules/
public/
.deploy*/
db.json
*.log
```

### .nojekyll (main 分支)
告訴 GitHub Pages 不要運行 Jekyll，直接使用靜態文件。

### .gitattributes
統一行尾符號為 LF（Unix 風格）：
```
* text=auto eol=lf
```

## 常用命令

| 命令 | 說明 |
|------|------|
| `hexo new "標題"` | 創建新文章 |
| `hexo clean` | 清理生成的文件 |
| `hexo g` | 生成靜態網站 |
| `hexo s` | 啟動本地伺服器 |
| `hexo d` | 更新主題（如果配置 deploy） |
| `git log --oneline` | 查看提交歷史 |
| `git branch -a` | 查看所有分支 |

## 故障排除

### 網站未更新
1. 檢查 main 分支是否包含最新的 public 文件
2. 訪問 GitHub 倉庫設定中的 **Pages** 確認部署狀態
3. 清除瀏覽器緩存

### 文章無法發布
1. 確認文章 Front-matter 中的 `published: true`
2. 檢查文件路徑是否正確（應在 `source/_posts/`）
3. 執行 `hexo clean && hexo g` 重新生成

### Git 合併衝突
```bash
# 放棄本地變更，使用遠程版本
git checkout --theirs .
git add .
git commit -m "Resolve conflicts"
```

## 主題相關

本站使用 [Reimu 主題](https://github.com/A-limon/hexo-theme-reimu)

主題配置位於：`themes/reimu/_config.yml` 和根目錄 `_config.reimu.yml`

## 許可證

見 LICENSE 檔案

---

最後更新: 2026-02-11
