# ============================================
# LOOka - Script de inicio rapido
# ============================================

Write-Host ""
Write-Host "Iniciando LOOka..." -ForegroundColor Cyan
Write-Host ""

# Verificar que Docker este corriendo
Write-Host "Verificando Docker..." -ForegroundColor Yellow
$dockerRunning = docker info 2>$null
if (-not $?) {
    Write-Host "ERROR: Docker Desktop no esta corriendo." -ForegroundColor Red
    Write-Host "Abre Docker Desktop y vuelve a ejecutar este script." -ForegroundColor Red
    exit 1
}
Write-Host "Docker OK" -ForegroundColor Green

# Levantar contenedores
Write-Host ""
Write-Host "Levantando contenedores..." -ForegroundColor Yellow
docker-compose up -d

# Esperar un poco
Start-Sleep -Seconds 5

# Verificar que los 3 esten arriba
Write-Host ""
Write-Host "Estado de los contenedores:" -ForegroundColor Yellow
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

Write-Host ""
Write-Host "LOOka esta listo!" -ForegroundColor Green
Write-Host "  Backend: http://localhost:3000/api/health" -ForegroundColor White
Write-Host "  Frontend web: http://localhost:8083" -ForegroundColor White
Write-Host ""
Write-Host "Iniciando Expo..." -ForegroundColor Cyan
Write-Host ""

# Iniciar Expo (esto mantiene la terminal activa)
cd ProyectoDPS_FrontEnd-main
npx expo start