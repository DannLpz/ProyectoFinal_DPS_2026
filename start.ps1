# ============================================
# LOOka - Script de inicialización
# ============================================

Set-Location $PSScriptRoot

Write-Host ""
Write-Host "=========================================" -ForegroundColor Magenta
Write-Host "   LOOka - Inicialización" -ForegroundColor Magenta
Write-Host "=========================================" -ForegroundColor Magenta
Write-Host ""

# 1. Docker
Write-Host "[1/5] Verificando Docker..." -ForegroundColor Cyan
docker info *> $null
if ($LASTEXITCODE -ne 0) {
    Write-Host "  ERROR: Docker Desktop no está corriendo." -ForegroundColor Red
    exit 1
}
Write-Host "  Docker OK" -ForegroundColor Green
Write-Host ""

# 2. Dependencias frontend
Write-Host "[2/5] Verificando dependencias..." -ForegroundColor Cyan
if (-not (Test-Path ".\ProyectoDPS_FrontEnd-main\node_modules")) {
    Write-Host "  Instalando (primera vez ~2 min)..." -ForegroundColor Yellow
    Push-Location ".\ProyectoDPS_FrontEnd-main"
    npm install
    Pop-Location
}
Write-Host "  Dependencias OK" -ForegroundColor Green
Write-Host ""

# 3. Levantar contenedores
Write-Host "[3/5] Levantando contenedores..." -ForegroundColor Cyan
docker compose up -d
Start-Sleep -Seconds 10

docker ps --filter "name=looka_" --format "  - {{.Names}} ({{.Status}})"
Write-Host ""

# 4. Sincronizar BD y ejecutar seed
Write-Host "[4/5] Sincronizando base de datos..." -ForegroundColor Cyan
docker exec looka_backend npx prisma db push *> $null

$seedCheck = docker exec looka_backend node -e "const {PrismaClient} = require('@prisma/client'); const p = new PrismaClient(); p.furniture.count().then(c => { console.log(c); process.exit(0); }).catch(() => process.exit(1));" 2>$null

if ($seedCheck -match "^[1-9]") {
    Write-Host "  BD lista ($seedCheck muebles)" -ForegroundColor Green
} else {
    Write-Host "  Ejecutando seed..." -ForegroundColor Yellow
    docker exec looka_backend node prisma/seed.js
}
Write-Host ""

# 5. Expo
Write-Host "[5/5] Iniciando Expo..." -ForegroundColor Cyan
Write-Host ""
Write-Host "=========================================" -ForegroundColor Green
Write-Host "   LOOka listo" -ForegroundColor Green
Write-Host "=========================================" -ForegroundColor Green
Write-Host "  Backend:  http://localhost:3000/api/health" -ForegroundColor White
Write-Host "  Frontend: http://localhost:8083" -ForegroundColor White
Write-Host "  Login:    demo / demo123" -ForegroundColor Yellow
Write-Host ""

Push-Location ".\ProyectoDPS_FrontEnd-main"
npx expo start