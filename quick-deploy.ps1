# Hexo Blog Quick Deployment Script (Non-Interactive)
# Function: Quick deployment with auto-generated commit message
# Usage: Run .\quick-deploy.ps1 in PowerShell

Write-Host "⚡ Quick deployment starting..." -ForegroundColor Cyan

# Ensure on source branch
$currentBranch = git rev-parse --abbrev-ref HEAD
if ($currentBranch -ne "source") {
    Write-Host "❌ Must be on source branch" -ForegroundColor Red
    exit 1
}

# Commit source code
git add .
git commit -m "Update: $(Get-Date -Format 'yyyy-MM-dd HH:mm')" -q 2>$null

# Generate
hexo clean
hexo generate

# Deploy
git checkout main
git rm -r --cached * -q 2>$null
Get-ChildItem -Force | Where-Object { $_.Name -notin @('.git', '.gitignore', '.nojekyll', 'public', 'CNAME') } | Remove-Item -Recurse -Force 2>$null
Copy-Item -Path "public\*" -Destination "." -Recurse -Force

git add -A
git commit -m "Deploy: $(Get-Date -Format 'yyyy-MM-dd HH:mm')" -q
git push origin main --force

git checkout source

Write-Host "✅ Deployment complete!" -ForegroundColor Green
