# Script para probar el flujo de login con Playwright
# Uso: .\test-login-flow.ps1

Write-Host "🎭 Iniciando prueba de flujo de login con Playwright..." -ForegroundColor Cyan
Write-Host ""

# Verificar que estamos en el directorio correcto
if (-not (Test-Path "playwright.config.ts")) {
    Write-Host "❌ Error: No se encuentra playwright.config.ts" -ForegroundColor Red
    Write-Host "   Asegúrate de ejecutar este script desde la raíz del proyecto." -ForegroundColor Yellow
    exit 1
}

# Verificar que la app está corriendo
Write-Host "📡 Verificando que la app está corriendo en http://localhost:3000..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000" -TimeoutSec 5 -UseBasicParsing
    Write-Host "✅ App detectada en http://localhost:3000" -ForegroundColor Green
} catch {
    Write-Host "❌ Error: La app no está corriendo en http://localhost:3000" -ForegroundColor Red
    Write-Host "   Ejecuta 'npm run dev' en otra terminal antes de ejecutar este script." -ForegroundColor Yellow
    exit 1
}

Write-Host ""
Write-Host "🧪 Ejecutando tests E2E del flujo de login..." -ForegroundColor Cyan
Write-Host ""

# Ejecutar los tests
npx playwright test tests/e2e/login-flow.spec.ts --reporter=list

$exitCode = $LASTEXITCODE

Write-Host ""
if ($exitCode -eq 0) {
    Write-Host "✅ Todos los tests pasaron correctamente!" -ForegroundColor Green
    Write-Host ""
    Write-Host "📊 Resumen del flujo:" -ForegroundColor Cyan
    Write-Host "  ✓ Página de login cargada correctamente" -ForegroundColor Green
    Write-Host "  ✓ Login exitoso con credenciales administrador@example.com" -ForegroundColor Green
    Write-Host "  ✓ Redirección a /host/dashboard correcta" -ForegroundColor Green
    Write-Host "  ✓ No se detectaron bucles de redirección" -ForegroundColor Green
} else {
    Write-Host "❌ Algunos tests fallaron" -ForegroundColor Red
    Write-Host ""
    Write-Host "📊 Ver reporte detallado con:" -ForegroundColor Yellow
    Write-Host "   npx playwright show-report" -ForegroundColor White
    Write-Host ""
    Write-Host "🔍 Posibles causas:" -ForegroundColor Yellow
    Write-Host "  • Backend no está corriendo o las credenciales son incorrectas" -ForegroundColor White
    Write-Host "  • NEXT_PUBLIC_API_URL no está configurada correctamente" -ForegroundColor White
    Write-Host "  • Error en la lógica de redirección tras login" -ForegroundColor White
    Write-Host "  • Bucle de redirección detectado" -ForegroundColor White
}

Write-Host ""
Write-Host "📝 Revisa el reporte completo en:" -ForegroundColor Cyan
Write-Host "   playwright-flow-x.md" -ForegroundColor White
Write-Host ""

exit $exitCode
