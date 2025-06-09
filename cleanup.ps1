Write-Host "🧹 Starting comprehensive project cleanup..." -ForegroundColor Cyan

# Stop any running processes
Write-Host "Stopping any running processes..." -ForegroundColor Yellow
Get-Process -Name "node" -ErrorAction SilentlyContinue | Where-Object { $_.Path -like "*RuleOneInvestor*" } | Stop-Process -Force -ErrorAction SilentlyContinue

# Clean directories
Write-Host "Removing build artifacts and cache..." -ForegroundColor Yellow
Remove-Item -Path ".\.astro" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -Path ".\dist" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -Path ".\node_modules" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -Path ".\package-lock.json" -Force -ErrorAction SilentlyContinue

# Clean npm cache
Write-Host "Cleaning npm cache..." -ForegroundColor Yellow
npm cache clean --force

# Reinstall dependencies
Write-Host "Reinstalling dependencies..." -ForegroundColor Yellow
npm install

# Build the project
Write-Host "Attempting to build project..." -ForegroundColor Yellow
npm run build

Write-Host "🎉 Cleanup and rebuild process complete!" -ForegroundColor Green
