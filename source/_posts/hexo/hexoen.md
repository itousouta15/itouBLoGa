---
title: Using GitHub Pages + Hexo to Set Up a Personal Blog
date: 2025-08-27 14:32:32
tags:
  - Hexo
cover: /images/Hexo/hexo_github.webp
urlname: Hexo
lang: en
---
In today’s information-overloaded era, the term **“blog”** might seem outdated, but it remains a sanctuary for developers, researchers, and creators. Unlike the fragmented information found on social media platforms, blogs are better suited for systematic knowledge organization and technical sharing, allowing content to be searchable, preserved, and continuously read. Especially for learners in programming or cybersecurity, owning a personal technical blog not only documents growth but also helps build a personal brand for the future.

This article will guide you step by step, starting from zero (on a Windows system), to set up your own blog using **Hexo** (a fast and concise static blog framework) combined with **GitHub Pages** (GitHub’s free static website hosting service).

## Setting Up the Environment

Before we start, ensure your computer is equipped with the following:

* **Node.js** (LTS version recommended; Hexo requires Node.js 14+)
* **npm** (comes bundled with Node.js)
* **Git** (needed for GitHub version control and deployment)
* **GitHub account** (to store your project and host your Pages site)

### Installing Node.js

Go to the official website:
[https://nodejs.org/zh-tw/download](https://nodejs.org/zh-tw/download)
![hexo](/images/Hexo/hexo.webp)
If you already have Docker, copy the code above into your terminal; otherwise, download the MSI file below and run it.
It’s recommended to always install the latest (at least LTS) versions of both Hexo and Node.js to receive the best security patches and performance updates.

## Hexo Implementation

1. Open a terminal and run:

```bash
hexo init my-blog
```

This will create a folder named `my-blog` in your current directory, containing the basic Hexo project structure and files.

2. Move into this folder:

```bash
cd my-blog
```

3. Install Hexo dependencies:

```bash
npm install
```

Your Hexo project directory is now initialized.

### File Introduction

Here are some important files and folders worth noting:

#### package.json

Hexo uses template engines like **ejs** to render content into static HTML. You’ll see dependencies such as ejs, stylus, and markdown renderers in `package.json`:

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

This folder contains three files: **draft.md**, **page.md**, **post.md**.

When you run `$ hexo new <type> <name>`, Hexo uses these templates to create a new draft, page, or post.

#### source/

This folder stores all the website resources. Directories starting with an underscore are ignored by Hexo, except `_posts`, where your articles are stored. Static files (Markdown, HTML, etc.) are compiled into the `public` folder during the build.

#### theme/

This folder stores theme files. The default theme is **landscape**, but you can change themes by downloading them (e.g., from Hexo’s official theme repository) and placing them under `themes/`.

*(Choose themes that are actively maintained for better stability.)*

#### \_config.yml

This is the main configuration file. Here you can adjust the entire site’s settings and behavior.

### Using a Template

Next, choose a Hexo theme (e.g., NexT, Butterfly, Reimu). Themes are usually hosted on GitHub. Download or clone the theme into the `themes` directory of your Hexo project.

> If you prefer a quicker setup:
>
> ```bash
> git clone https://github.com/D-Sketon/reimu-template
> cd reimu-template
> npm install
> hexo server
> ```
>
> This repository already includes Hexo, **hexo-theme-reimu**, and other essential plugins. Simply clone, install, and modify the configurations to get a basic blog up and running.
> You can then skip directly to [Deploying to GitHub Pages](#部署到-github-pages).

For example, if using the **Reimu** theme:

```bash
cd themes
git clone https://github.com/D-Sketon/hexo-theme-reimu.git
```

Rename it to "reimu":

```bash
Rename-Item -Path .\hexo-theme-reimu -NewName test
```

> ⚠️ **Note! If you encounter errors while renaming the theme folder, such as:**
>
> ```
> Cannot remove C:\Users\...\.git item: You do not have sufficient permissions.
> ```
>
> Try this instead:
>
> ```bash
> robocopy .\hexo-theme-reimu .\reimu /E
> Remove-Item .\hexo-theme-reimu -Recurse -Force
> ```
>
> This copies the theme folder and forcefully deletes the original, often resolving Windows permission or locked file issues.

![reimu](/images/Hexo/themes.webp)

Then edit `_config.yml`:

```yaml
theme: reimu
```

---

Complete example flow:

```bash
hexo init my-blog
cd my-blog
npm install

cd themes
git clone https://github.com/D-Sketon/hexo-theme-reimu.git
Rename-Item -Path .\hexo-theme-reimu -NewName reimu

# Edit _config.yml to set theme: reimu

hexo clean
hexo g
hexo s
```

Open your browser to `http://localhost:4000` to preview the blog.
![run](/images/Hexo/run.webp)

## Deploying to GitHub Pages

Before deploying, complete SSH key setup to avoid permission issues:

### SSH Key Setup Steps

#### **Create `.ssh` directory**

In PowerShell:

```powershell
mkdir $env:USERPROFILE\.ssh
```

(Skip if it already exists.)

#### **Generate SSH key**

```powershell
ssh-keygen -t ed25519 -C "your_email@example.com"
```

Press Enter to accept defaults.

#### **Add public key to GitHub**

```powershell
cat $env:USERPROFILE\.ssh\id_ed25519.pub
```

Copy the output and go to **GitHub → Settings → SSH and GPG keys → New SSH key**, paste it, and save.
Link: [https://github.com/settings/keys](https://github.com/settings/keys)

#### **Test SSH connection**

```powershell
ssh -T git@github.com
```

If you see:

```
Hi <username>! You've successfully authenticated
```

It’s working.

#### **Back to deployment**

* Create a GitHub repository, typically named `username.github.io` (e.g., `itousouta15.github.io`).
  ![](/images/Hexo/創建repo.webp)

* Install the Hexo deployment plugin:

  ```bash
  npm install hexo-deployer-git --save
  ```

* Initialize Git:

  ```bash
  git init
  ```

* Edit `_config.yml` and add:

  ```yaml
  deploy:
    type: git
    repository: git@github.com:itousouta15/<your-repo>.git
    branch: main
  ```

![deploy](/images/Hexo/deploy.webp)

* Generate and deploy:

  ```bash
  hexo clean
  hexo generate
  hexo deploy
  ```

* Ensure GitHub Pages is enabled and visit `https://yourusername.github.io`.
  ![github](/images/Hexo/github.webp)

### Common Troubleshooting

> #### SSH Key or `.ssh` directory issues
>
> **Error:**
>
> * `git@github.com: Permission denied (publickey)`
> * `Could not create directory '/c/Users/\xxx/.ssh'`
>   **Cause:**
>   Windows username contains non-ASCII characters, causing path issues.
>   **Fix:**
>
> 1. Manually create `.ssh`:
>
>    ```powershell
>    mkdir $env:USERPROFILE\.ssh
>    ```
> 2. Generate SSH key and add to GitHub:
>
>    ```powershell
>    ssh-keygen -t ed25519 -C "your_email@example.com"
>    cat $env:USERPROFILE\.ssh\id_ed25519.pub
>    ```
> 3. Configure Git to use the absolute path:
>
>    ```powershell
>    git config --global core.sshCommand "ssh -i C:/Users/伊藤蒼太/.ssh/id_ed25519"
>    ```
> 4. Test connection:
>
>    ```powershell
>    ssh -T git@github.com
>    ```

> #### Git repository initialization error
>
> **Error:**
> `fatal: Not a git repository (or any of the parent directories): .git`
> **Fix:**
> Ensure you are in the Hexo project root. If not initialized:
>
> ```powershell
> git init
> git remote add origin git@github.com:itousouta15/<your-repo>.git
> ```

> #### Submodule warning
>
> If `themes/reimu` is a submodule, either manage it as a submodule or remove its `.git` folder to avoid warnings.

> #### LF/CRLF line-ending warnings
>
> Normal on Windows; safe to ignore.

> #### Successful deployment message
>
> Expect output like:
>
> ```
> Enumerating objects...
> Writing objects...
> To github.com:itousouta15/test.github.io.git
> INFO  Deploy done: git
> ```

### Daily Usage and Maintenance

* Use Hexo CLI to manage posts:

  ```bash
  hexo new post "Post Title"
  ```

  Then generate and deploy:

  ```bash
  hexo generate
  hexo deploy
  ```

* Regularly update Hexo, themes, and plugins to stay secure and functional.

* Customize the theme as needed (style, menus, comment system, etc.).

### Advanced Optimization

* Add a custom domain to replace the default GitHub Pages URL.
* Use a CDN or Cloudflare to improve global access speed and security.
* Enable HTTPS with SSL certificates.
* Integrate SEO and analytics tools.
* Use CI/CD tools for automated deployment.

![page](/images/Hexo/page.webp)

That’s it for this article! See you next time!