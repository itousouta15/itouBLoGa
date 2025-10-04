---
title: 使用 GitHub Pages + Hexo 架設個人BLOG
date: 2025-08-27 14:32:32
tags:
  - Hexo
cover: /img/Hexo/hexo_github.webp
urlname: Hexo
---
在這個資訊爆炸的時代，「部落格」這一個看似已經過時的名詞，其實依然是屬於個人開發者、研究者與創作者的一塊淨土。與社群平台的碎片化資訊不同，部落格更適合進行系統性的知識整理與技術分享，讓內容能夠被搜尋、被保存、被持續閱讀。尤其對程式設計或網路安全領域的學習者來說，一個屬於自己的技術部落格，不僅能夠紀錄成長歷程，也有助於在未來建立個人品牌。

本篇將帶你從零開始(在windows系統上)，使用 Hexo（一個快速、簡潔的靜態部落格框架）搭配 GitHub Pages（GitHub 提供的免費靜態網頁託管服務），一步步完成屬於自己的部落格架設。

## 準備環境  
在正式開始之前，請先確保電腦具備以下環境：

- Node.js（建議安裝 LTS 版本，Hexo 需 Node.js 14+ 支援）  
- npm（Node.js 會一併安裝 npm 套件管理工具）  
- Git（操作 GitHub 版本控管及部署需要）  
- GitHub 帳號（用來存放專案與提供 Pages 網站）  

### 安裝 Node.js  
前往官網下載介面  
https://nodejs.org/zh-tw/download  
![hexo](/img/Hexo/hexo.webp)
如果有 Docker 就複製上面程式碼到終端機裡，沒有就按底下的下載 MSI 檔再執行即可。  
建議不管 Hexo 或 NodeJS 都能下載最新（至少 LTS）的版本，才能得到官方修補漏洞或優化後的最佳體驗。


## Hexo 實作

1. 打開終端機，輸入：  
```bash
hexo init my-blog
```
這會在目前路徑下建立一個名為 `my-blog` 的資料夾，裡面包含 Hexo 專案的所有基本架構資料夾和檔案。

2. 進入這個資料夾：  
```bash
cd my-blog
```

3. 安裝 Hexo 需要的依賴套件：  
```bash
npm install
```

這樣子你的 Hexo 專案資料夾就初始化完成了。

### 檔案介紹
檔案介紹
這邊有幾個比較重要的檔案/資料夾，稍微介紹一下：

#### package.json
Hexo 的文章內容是使用 ejs 等模板語言來撰寫，經解析後渲染成靜態的 HTML，所以可以在 package.json 的 dependencies 裡面看到 ejs, stylus, markdown 的 renderer-package
```
"dependencies": {
    "hexo": "^5.0.0",
    "hexo-generator-archive": "^1.0.0",
    "hexo-generator-category": "^1.0.0",
    "hexo-generator-index": "^2.0.0",
    "hexo-generator-tag": "^1.0.0",
    "hexo-renderer-ejs": "^2.0.0",
    "hexo-renderer-marked": "^4.0.0",
    "hexo-renderer-stylus": "^2.0.0",
    "hexo-server": "^2.0.0",
    "hexo-theme-landscape": "^0.0.3"
  }
```
#### scaffolds/
scaffolds 資料夾中有三個檔案： draft.md, page.md, post.md

這些是檔案模板，每使用 $ hexo new <type> <name> 創造一個新的貼文或頁面，Hexo 就會使用 scaffolds 中的模板為你建立檔案雛型。

#### source/
source 資料夾放著這個網站所有的資源。前綴詞帶有底線的資料夾會被 Hexo 忽略，_post 除外，因為這裡面放的是我們要上架的文章。這些靜態檔案（Markdown, HTML 等）在 build 完後會被放進 public 資料夾，而其他的檔案則是用複製的方式。

#### theme/
theme 資料夾用來放佈景主題相關的各種資料，官方預設的佈景主題是 landscape，如果想要換佈景，也可以到官方的 theme shop 去找你喜歡的主題，下載後整包放到 themes/ 下面來使用

(主題盡量挑選近期很多人穩定在維護的專案)

#### _config.yml
_config.yml 是我們最重要的設定檔，這個檔案中可以針對我們的全站呈現方式做設定

### 直接套模板

接下來找一個你想使用的 Hexo 主題（例如常見的 NexT、Butterfly、Reimu 等），通常主題會放在 GitHub 上，下載或使用 Git clone 複製主題進入你的 Hexo 專案的 `themes` 目錄內。

> 如果你不想那麼麻煩可以直接
> ```bash
> git clone https://github.com/D-Sketon/reimu-template
> cd reimu-template
> npm install
> hexo server
> ```
> 已預先安裝 hexo、hexo-theme-reimu 及其他相關功能套件，只需要按照以下步驟操作：複製倉庫、安裝依賴、修改配置，即可取得一個基本的部落格！
> 完成這步可以直接跳到 [部署到 GitHub Pages](#部署到-github-pages)



例如以我這blog用的 reimu  為例，執行：  
  ```bash
  cd themes
  git clone https://github.com/D-Sketon/hexo-theme-reimu.git
  ```
並且重命名為"reimu":
  ```bash
  Rename-Item -Path .\hexo-theme-reimu -NewName test 
  ```

> ⚠️ **注意！如果執行主題資料夾重命名指令時，遇到類似以下錯誤：**  
> 
> ```
> 無法移除 C:\Users\...\.git 項目: 您沒有足夠的存取權限來執行此操作。
> ```
>
> 
>
> 請使用下方指令嘗試解決此問題：  
> ```bash
> robocopy .\hexo-theme-reimu .\reimu /E
> Remove-Item .\hexo-theme-reimu -Recurse -Force
> ```
> 這組指令會複製主題資料夾並強制刪除原資料夾的 `.git` 等被鎖定檔案，常見於 Windows 權限或鎖定導致的無法移除問題。

![reimu](/img/Hexo/themes.webp)

然後在 `_config.yml` 裡面設定：  

```yaml
theme: reimu
```

***

完整流程範例如下：  
```bash
hexo init my-blog
cd my-blog
npm install

cd themes
git clone https://github.com/D-Sketon/hexo-theme-reimu.git
Rename-Item -Path .\hexo-theme-reimu -NewName reimu

# 修改 _config.yml 裡的 theme: reimu

hexo clean
hexo g
hexo s
```

完成後就可以在本地瀏覽器打開 http://localhost:4000 預覽新主題部落格樣貌。
![run](/img/Hexo/run.webp)

## 部署到 GitHub Pages

在開始部署之前，請先完成 SSH 金鑰設定，以避免常見的權限問題：

### SSH 金鑰設定步驟

#### **建立 `.ssh` 目錄**  
   在 PowerShell 執行：  
   ```powershell
   mkdir $env:USERPROFILE\.ssh
   ```
   （如已有此目錄可略過）

#### **產生 SSH 金鑰**  
   ```powershell
   ssh-keygen -t ed25519 -C "your_email@example.com"
   ```
   按 Enter 使用預設路徑及參數。

#### **將公鑰加入 GitHub**  
   執行：  
   ```powershell
   cat $env:USERPROFILE\.ssh\id_ed25519.pub
   ```
   複製顯示內容，前往 GitHub → Settings → SSH and GPG keys → New SSH key，貼上內容並儲存。  
   註：連結 → https://github.com/settings/keys

#### **測試 SSH 連線**  
   ```powershell
   ssh -T git@github.com
   ```
   若出現  
   ```
   Hi <username>! You've successfully authenticated
   ```
   表示設定成功。

#### **回主題目，開始部署**

完成 SSH 設定後，開始進行 Hexo 部署：

- 建立 GitHub 倉庫，通常命名為 `你的帳號.github.io`，如 `itousouta15.github.io`。  
![](/img/Hexo/創建repo.webp)
- 在 Hexo 專案根目錄安裝部署外掛：  
  ```bash
  npm install hexo-deployer-git --save
  ```

- 先初始化 git
  ```bash
  git init
  ```

- 修改 `_config.yml`，增加部署設定：  
  ```yaml
  deploy:
    type: git
    repository: git@github.com:itousouta15/<你的-repo>.git
    branch: main
  ```
![deploy](/img/Hexo/deploy.webp)

- 生成靜態檔並部署：  
  ```bash
  hexo clean
  hexo generate
  hexo deploy
  ```

- 確認 GitHub Pages 功能已開啟，等候片刻後瀏覽 `https://你的帳號.github.io` 即完成線上部署。
![github](/img/Hexo/github.webp)
### 常見疑難排解
> #### SSH 金鑰權限錯誤及 `.ssh` 目錄無法建立
> - **錯誤訊息：**  
>   - `git@github.com: Permission denied (publickey)`  
>   - `Could not create directory '/c/Users/\xxx/.ssh'`（亂碼路徑）  
> - **原因：**  
>   Windows 使用者名稱含有中文或特殊符號，系統或 Git 解析路徑時產生亂碼，導致無法建立 `.ssh` 目錄。  
> - **解決方法：**  
>   1. 手動建立正確的 `.ssh` 目錄：  
>      ```powershell
>      mkdir $env:USERPROFILE\.ssh
>      ```
>   2. 產生 SSH 金鑰並加入 GitHub：  
>      ```powershell
>      ssh-keygen -t ed25519 -C "your_email@example.com"
>      cat $env:USERPROFILE\.ssh\id_ed25519.pub
>      ```
>      將公鑰內容複製貼至 GitHub SSH Keys 頁面。  
>   3. 將 Git 指令設定使用絕對路徑載入金鑰，注意路徑要有反斜線：  
>      ```powershell
>      git config --global core.sshCommand "ssh -i C:/Users/伊藤蒼太/.ssh/id_ed25519"
>      ```
>   4. 測試 SSH 連線：  
>      ```powershell
>      ssh -T git@github.com
>      ```
>      正常應顯示「Hi <username>! You've successfully authenticated」。  
>   5. 再試 `git push` 與 `hexo deploy`。
> 
> #### Git 倉庫初始化錯誤
> - **錯誤訊息：**  
>   `fatal: Not a git repository (or any of the parent directories): .git`  
> - **原因：**  
>   執行 Git 指令的資料夾非 Hexo 專案根目錄，或該資料夾尚未初始化 Git。  
> - **解決方法：**  
>   1. 切換至 Hexo 專案根目錄（含 `.git`）。  
>   2. 若尚未初始化，執行：  
>      ```powershell
>      git init
>      git remote add origin git@github.com:itousouta15/<你的-repo>.git
>      ```
>   3. 再執行 `hexo deploy`。  
> 
> #### Submodule 警告
> - **內容：**  
>   `themes/reimu` 資料夾為獨立 git 倉庫，Git 會警告此為 submodule。  
> - **建議：**  
>   使用 Git submodule 管理或刪除 `themes/reimu` 的 `.git` 資料夾，避免 clone 不完整。  
> 
> #### LF 與 CRLF 行尾格式警告
> - **說明：**  
>   Git 在 Windows 環境會提示行尾碼轉換，為正常情況。  
> 
> #### 成功部署訊息
> - 你會看到類似以下內容：  
>   ```
>   Enumerating objects... 
>   Writing objects... 
>   To github.com:itousouta15/test.github.io.git
>   INFO  Deploy done: git
>   ```
> - 如果出現部分 `known_hosts` 警告，不影響 Git 操作與 Hexo 部署。  

### 日常使用與維護  
- 使用 Hexo CLI 管理文章：  
  新增文章  
  ```bash
  hexo new post "文章標題"
  ```
  編輯完成後產生並部署：  
  ```bash
  hexo generate
  hexo deploy
  ```
- 定期更新 Hexo、主題與外掛，保持安全與功能正常。  
- 依需要自訂主題配置，如風格、選單、評論系統等。


### 進階優化  
- 加入自訂網域，替代預設 GitHub Pages 的網址。  
- 使用 CDN 或 Cloudflare 提升全球訪問速度與安全。  
- 配置 SSL 證書支援 HTTPS。  
- 整合 SEO、網站分析工具。  
- 使用 CI/CD 工具自動化部署流程。  

![page](/img/Hexo/page.webp)

這篇文章就到此為止!我們下次見!