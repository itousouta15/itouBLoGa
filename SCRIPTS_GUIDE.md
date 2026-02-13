# 🚀 Hexo Automated Deployment Scripts Guide

This directory contains three PowerShell scripts to simplify the Hexo blog development and deployment workflow.

---

## Prerequisites

- Windows PowerShell 5.1+
- Git installed and accessible from PowerShell
- Hexo dependencies installed (run `npm install`)
- Currently on the `source` branch

---

## 🔧 Script List

### 1. **`deploy.ps1`** - Full Deployment Process (Recommended)
The most complete and safest deployment script with all checks and prompts.

**Features:**
1. Verify you're on source branch
2. Commit source code changes (supports custom commit message)
3. Generate static website
4. Switch to main branch
5. Copy public directory content
6. Push to GitHub Pages
7. Return to source branch

**Usage:**
```powershell
.\deploy.ps1
```

**Execution Flow:**
1. Run the script
2. Enter a commit message when prompted (or press Enter to use default timestamp)
3. Wait for deployment to complete
4. Check GitHub Pages to confirm update

**Best For:**
- First-time deployment
- Important updates
- When custom commit message is needed

---

### 2. **`preview.ps1`** - Local Preview
Test the website locally before deployment.

**Features:**
1. Generate static website
2. Start local server
3. Automatically open http://localhost:4000

**Usage:**
```powershell
.\preview.ps1
```

**Execution Flow:**
1. Run the script
2. Server starts and browser opens automatically (usually)
3. Preview at http://localhost:4000
4. Press `Ctrl+C` to stop server

**Best For:**
- Checking articles after editing
- Testing layout or style changes before publishing
- Testing new features

---

### 3. **`quick-deploy.ps1`** - Fast Deployment (Non-Interactive)
Simplest deployment script - auto-uses timestamp as commit message with no prompts.

**Features:**
- Auto commit, generate, and deploy with no interaction
- Commit message auto-generated (format: `Update: YYYY-MM-DD HH:MM`)

**Usage:**
```powershell
.\quick-deploy.ps1
```

**Execution Time:**
Usually 20-30 seconds

**Best For:**
- Frequent updates (multiple times per day)
- Quick fixes and immediate deployment
- When custom commit message isn't important

---

## 📝 Standard Workflow

### Workflow Diagram

```
1️⃣  Edit articles or config (source branch)
        ↓
2️⃣  Local preview (run preview.ps1)
        ↓
3️⃣  After confirming, execute deployment
        ├─→ For custom message: .\deploy.ps1
        └─→ For quick deploy: .\quick-deploy.ps1
        ↓
4️⃣  Visit website to confirm update
```

### Example Workflows

**Scenario 1: Adding new article**
```powershell
# 1. Edit source/_posts/new-article.md in VS Code
# 2. After saving, preview to check
.\preview.ps1

# 3. Press Ctrl+C to stop preview, then deploy after confirming no issues
.\deploy.ps1
# Enter commit message, e.g.: "Add: My awesome article"
```

**Scenario 2: Modifying configuration**
```powershell
# 1. Edit _config.yml or _config.reimu.yml
# 2. Local preview to check
.\preview.ps1

# 3. After confirming, quick deploy
.\quick-deploy.ps1
```

---

## ⚙️ Advanced Usage

### Customize Commit Message Format

To change the default commit message format in `deploy.ps1`, edit line 31:
```powershell
# Default format
$message = "Update: $(Get-Date -Format 'yyyy-MM-dd HH:mm')"

# Can be changed to, for example
$message = "Update: Article on $(Get-Date -Format 'yyyy-MM-dd')"
```

### Customize Deploy Message

Edit `deploy.ps1` line 87:
```powershell
# Default format
$deployMessage = "Deploy: Update $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
```

---

## 🆘 Troubleshooting

### Issue 1: Execution Policy Restricted
**Error:** `cannot be loaded because running scripts is disabled`

**Solution:**
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```
Then re-run the script.

### Issue 2: Git Command Not Found
**Solution:**
Ensure Git is installed and restart PowerShell, or add Git to system PATH.

### Issue 3: hexo Command Not Found
**Solution:**
```powershell
npm install
```

### Issue 4: Merge Conflict When Pushing to Main Branch
**Solution:**
```powershell
# On main branch, force use local version
git checkout --theirs .
git add .
git commit -m "Resolve conflict"
git push origin main --force
git checkout source
```

---

## 📌 Important Notes

1. **Always Keep source Branch as Working Branch**
   - Edit articles and configs on source branch
   - main branch should only contain generated static files

2. **Check Article Front-Matter Before Deployment**
   - Ensure `published: true` or `draft: false`
   - Ensure `date` field is correct

3. **Regular Backups**
   - Confirm important updates are pushed to GitHub
   - Remote repository is your best backup

4. **Clear Browser Cache**
   - After deployment, if changes don't appear, try clearing browser cache
   - Or use incognito/private mode to access the website

---

## 🔗 Common Command Reference

| Command | Description |
|---------|-------------|
| `hexo new "Article Title"` | Create new article |
| `hexo clean` | Clean generated files |
| `hexo generate` or `hexo g` | Generate static website |
| `hexo server` or `hexo s` | Start local server |
| `git status` | Check change status |
| `git log --oneline` | View commit history |

---

## ✅ Pre-Deployment Checklist

Before deploying, verify:
- [ ] On source branch
- [ ] Articles saved
- [ ] Front-matter correct (published: true)
- [ ] Local preview looks good
- [ ] Network connection is working

---

## 🎯 Quick Start

**First time setup:**
```powershell
# Make sure you're on source branch
git checkout source

# Install dependencies
npm install

# Try preview first
.\preview.ps1
```

**Regular deployment:**
```powershell
# For important updates
.\deploy.ps1

# For quick updates
.\quick-deploy.ps1
```

---

**Last Updated: 2026-02-13**

For issues or questions, check the GitHub repository or try running `npm install` and clearing `node_modules` again.
