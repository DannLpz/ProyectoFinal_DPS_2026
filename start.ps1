# ============================================
# LOOka - Script de inicializacion completa
# Un solo comando para arrancar todo el sistema
# ============================================

Write-Host ""
Write-Host "=========================================" -ForegroundColor Magenta
Write-Host "   LOOka - Inicializacion del sistema" -ForegroundColor Magenta
Write-Host "=========================================" -ForegroundColor Magenta
Write-Host ""

# ---------- 1. Verificar Docker ----------
Write-Host "[1/5] Verificando Docker..." -ForegroundColor Cyan
$dockerCheck = docker info 2>$null
if (-not $?) {
    Write-Host "  ERROR: Docker Desktop no esta corriendo." -ForegroundColor Red
    Write-Host "  Abre Docker Desktop y vuelve a ejecutar este script." -ForegroundColor Red
    exit 1
}
Write-Host "  Docker OK" -ForegroundColor Green
Write-Host ""

# ---------- 2. Instalar dependencias del frontend (si faltan) ----------
Write-Host "[2/5] Verificando dependencias del frontend..." -ForegroundColor Cyan
if (-not (Test-Path ".\ProyectoDPS_FrontEnd-main\node_modules")) {
    Write-Host "  Instalando dependencias (primera vez, tarda 1-2 min)..." -ForegroundColor Yellow
    Push-Location ".\ProyectoDPS_FrontEnd-main"
    npm install
    Pop-Location
    Write-Host "  Dependencias instaladas" -ForegroundColor Green
} else {
    Write-Host "  Dependencias ya instaladas" -ForegroundColor Green
}
Write-Host ""

# ---------- 3. Levantar contenedores Docker ----------
Write-Host "[3/5] Levantando contenedores Docker..." -ForegroundColor Cyan
docker-compose up -d
Start-Sleep -Seconds 8

# Verificar que los 3 esten arriba
$running = docker ps --filter "name=looka_" --format "{{.Names}}" | Measure-Object -Line
if ($running.Lines -lt 3) {
    Write-Host "  Esperando que los contenedores arranquen..." -ForegroundColor Yellow
    Start-Sleep -Seconds 8
}
Write-Host "  Contenedores activos:" -ForegroundColor Green
docker ps --filter "name=looka_" --format "  - {{.Names}} ({{.Status}})"
Write-Host ""

# ---------- 4. Ejecutar seed (verifica si ya hay datos) ----------
Write-Host "[4/5] Verificando datos de la base de datos..." -ForegroundColor Cyan
$seedCheck = docker exec looka_backend node -e "const {PrismaClient} = require('@prisma/client'); const p = new PrismaClient(); p.furniture.count().then(c => { console.log(c); process.exit(0); }).catch(() => process.exit(1));" 2>$null

if ($seedCheck -match "^[1-9]") {
    Write-Host "  Base de datos ya tiene $seedCheck muebles" -ForegroundColor Green
} else {
    Write-Host "  Base de datos vacia. Ejecutando seed..." -ForegroundColor Yellow
    docker exec -it looka_backend node prisma/seed.js
    Write-Host "  Seed ejecutado" -ForegroundColor Green
}
Write-Host ""

# ---------- 5. Iniciar Expo ----------
Write-Host "[5/5] Iniciando Expo..." -ForegroundColor Cyan
Write-Host ""
Write-Host "=========================================" -ForegroundColor Green
Write-Host "   LOOka listo para usar" -ForegroundColor Green
Write-Host "=========================================" -ForegroundColor Green
Write-Host ""
Write-Host "  Backend:     http://localhost:3000/api/health" -ForegroundColor White
Write-Host "  Frontend Web: http://localhost:8083" -ForegroundColor White
Write-Host ""
Write-Host "  Escanea el QR con Expo Go en tu celular." -ForegroundColor Yellow
Write-Host "  Usuario demo: demo / demo123" -ForegroundColor Yellow
Write-Host ""

Push-Location ".\ProyectoDPS_FrontEnd-main"
npx expo start