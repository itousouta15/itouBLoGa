# Hexo Blog Local Preview Script
# Function: Generate website and preview on local server
# Usage: Run .\preview.ps1 in PowerShell

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Hexo Blog Local Preview Tool" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

# Check if on source branch
$currentBranch = git rev-parse --abbrev-ref HEAD
if ($currentBranch -ne "source") {
    Write-Host "Warning: Currently on $currentBranch branch. Recommended to preview on source branch!" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Cleaning and regenerating website..." -ForegroundColor Yellow
hexo clean
hexo generate

if ($LASTEXITCODE -ne 0) {
    Write-Host "Generation failed" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "✓ Website generated" -ForegroundColor Green
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Starting local server..." -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "📍 Access address: http://localhost:4000" -ForegroundColor Cyan
Write-Host "Press Ctrl+C to stop server" -ForegroundColor Yellow
Write-Host ""

hexo server
