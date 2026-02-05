# Script para ejecutar el test detallado del flujo de login
# Captura errores de consola, redirecciones y verificaciones completas

Write-Host "=================================" -ForegroundColor Cyan
Write-Host "🧪 EJECUTANDO TEST DE LOGIN" -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Cyan
Write-Host ""

# Crear directorio para screenshots si no existe
$screenshotDir = "tests/e2e/screenshots"
if (!(Test-Path $screenshotDir)) {
    New-Item -ItemType Directory -Path $screenshotDir -Force | Out-Null
    Write-Host "📁 Directorio de screenshots creado: $screenshotDir" -ForegroundColor Green
}

Write-Host "📋 Verificando que el servidor esté corriendo en http://localhost:3000..." -ForegroundColor Yellow

try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000" -TimeoutSec 5 -UseBasicParsing
    Write-Host "✅ Servidor está corriendo correctamente" -ForegroundColor Green
} catch {
    Write-Host "❌ Error: El servidor no está corriendo en http://localhost:3000" -ForegroundColor Red
    Write-Host "   Por favor ejecuta 'npm run dev' en otra terminal antes de ejecutar este test" -ForegroundColor Yellow
    exit 1
}

Write-Host ""
Write-Host "🚀 Ejecutando test de Playwright..." -ForegroundColor Cyan
Write-Host ""

# Ejecutar el test con Playwright
npx playwright test tests/e2e/login-flow-detailed.spec.ts --reporter=list

$exitCode = $LASTEXITCODE

Write-Host ""
Write-Host "=================================" -ForegroundColor Cyan
Write-Host "📊 RESULTADO DEL TEST" -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Cyan

if ($exitCode -eq 0) {
    Write-Host "✅ Test completado exitosamente" -ForegroundColor Green
    Write-Host ""
    Write-Host "📸 Revisa el screenshot en: tests/e2e/screenshots/login-success-dashboard.png" -ForegroundColor Cyan
} else {
    Write-Host "❌ El test falló. Revisa los errores arriba" -ForegroundColor Red
    Write-Host ""
    Write-Host "💡 Para más detalles, puedes ejecutar:" -ForegroundColor Yellow
    Write-Host "   npx playwright test tests/e2e/login-flow-detailed.spec.ts --headed --debug" -ForegroundColor White
}

Write-Host ""
Write-Host '📝 Para ver el reporte completo HTML:' -ForegroundColor Cyan
Write-Host '   npx playwright show-report' -ForegroundColor White
Write-Host ''

exit $exitCode
