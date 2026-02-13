# Hexo Blog Automated Deployment Script
# Function: Auto-commit source code, generate website, deploy to GitHub Pages
# Usage: Run .\deploy.ps1 in PowerShell

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Hexo Blog Automated Deployment Tool" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

# Check if on source branch
$currentBranch = git rev-parse --abbrev-ref HEAD
if ($currentBranch -ne "source") {
    Write-Host "Error: Currently on $currentBranch branch. Must be on source branch to deploy!" -ForegroundColor Red
    exit 1
}

Write-Host "✓ Confirmed on source branch" -ForegroundColor Green

# Step 1: Commit source code to source branch
Write-Host ""
Write-Host "Step 1️: Committing source code to source branch..." -ForegroundColor Yellow

if (git status --porcelain) {
    Write-Host "Changes detected, committing..." -ForegroundColor Gray
    
    $message = Read-Host "Enter commit message (default: 'Update: $(Get-Date -Format 'yyyy-MM-dd HH:mm')')"
    if ([string]::IsNullOrWhiteSpace($message)) {
        $message = "Update: $(Get-Date -Format 'yyyy-MM-dd HH:mm')"
    }
    
    git add .
    git commit -m "$message"
    git push origin source
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ Source code committed to source branch" -ForegroundColor Green
    } else {
        Write-Host "Issue during commit, but continuing with generation..." -ForegroundColor Yellow
    }
} else {
    Write-Host "✓ No changes to commit" -ForegroundColor Green
}

# Step 2: Generate static website
Write-Host ""
Write-Host "Step 2️: Generating static website..." -ForegroundColor Yellow

hexo clean
if ($LASTEXITCODE -ne 0) {
    Write-Host "hexo clean failed" -ForegroundColor Red
    exit 1
}

hexo generate
if ($LASTEXITCODE -ne 0) {
    Write-Host "hexo generate failed" -ForegroundColor Red
    exit 1
}

Write-Host "✓ Static website generated" -ForegroundColor Green

# Step 3: Switch to main branch
Write-Host ""
Write-Host "Step 3️: Switching to main branch..." -ForegroundColor Yellow

git checkout main
if ($LASTEXITCODE -ne 0) {
    Write-Host "Failed to switch to main branch" -ForegroundColor Red
    exit 1
}

Write-Host "✓ Switched to main branch" -ForegroundColor Green

# Step 4: Clean and copy public directory content
Write-Host ""
Write-Host "Step 4️: Copying public directory content..." -ForegroundColor Yellow

# Remove tracked files from git index
git rm -r --cached * -q 2>$null

# Remove all old files except git directory and public folder
Get-ChildItem -Force | Where-Object { $_.Name -notin @('.git', '.gitignore', '.nojekyll', 'public', 'CNAME') } | Remove-Item -Recurse -Force 2>$null

# Copy all content from public directory to root
Copy-Item -Path "public\*" -Destination "." -Recurse -Force

Write-Host "✓ Public directory contents copied" -ForegroundColor Green

# Step 5: Commit and push to main branch
Write-Host ""
Write-Host "Step 5️: Committing and pushing to main branch..." -ForegroundColor Yellow

git add -A
$deployMessage = "Deploy: Update $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
git commit -m "$deployMessage"

git push origin main --force
if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Pushed to main branch (GitHub Pages)" -ForegroundColor Green
} else {
    Write-Host "Push failed" -ForegroundColor Red
    exit 1
}

# Step 6: Return to source branch
Write-Host ""
Write-Host "Step 6️: Returning to source branch..." -ForegroundColor Yellow

git checkout source
Write-Host "✓ Returned to source branch" -ForegroundColor Green

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Deployment Complete!" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Website should update in a few seconds at:" -ForegroundColor Gray
Write-Host "https://itousouta15.github.io" -ForegroundColor Cyan
Write-Host ""
