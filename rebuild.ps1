# PowerShell script to clean and rebuild the project
Write-Host "Cleaning node_modules..." -ForegroundColor Cyan
Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue

Write-Host "Removing package-lock.json..." -ForegroundColor Cyan
Remove-Item -Force package-lock.json -ErrorAction SilentlyContinue

Write-Host "Reinstalling dependencies..." -ForegroundColor Cyan
npm install

Write-Host "Starting development server..." -ForegroundColor Cyan
npm run dev
