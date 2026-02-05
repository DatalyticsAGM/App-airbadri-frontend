# Script de diagnóstico para Playwright MCP
# Verifica que el servidor MCP puede ejecutarse correctamente

Write-Host "🔍 Diagnóstico de Playwright MCP" -ForegroundColor Cyan
Write-Host ""

# Verificar que npx está disponible
Write-Host "1️⃣ Verificando que npx está disponible..." -ForegroundColor Yellow
try {
    $npxVersion = npx --version 2>&1
    Write-Host "   ✅ npx versión: $npxVersion" -ForegroundColor Green
} catch {
    Write-Host "   ❌ npx no está disponible" -ForegroundColor Red
    Write-Host "   Instala Node.js desde: https://nodejs.org/" -ForegroundColor Yellow
    exit 1
}

Write-Host ""

# Verificar que @playwright/mcp puede ejecutarse
Write-Host "2️⃣ Verificando que @playwright/mcp puede ejecutarse..." -ForegroundColor Yellow
Write-Host "   (Esto puede tardar unos segundos la primera vez)" -ForegroundColor Gray

$testProcess = Start-Process -FilePath "npx" -ArgumentList "-y","@playwright/mcp@latest","--help" -NoNewWindow -PassThru -Wait -RedirectStandardOutput "mcp-test-output.txt" -RedirectStandardError "mcp-test-error.txt"

if ($testProcess.ExitCode -eq 0) {
    Write-Host "   ✅ @playwright/mcp se ejecutó correctamente" -ForegroundColor Green
} else {
    Write-Host "   ❌ Error al ejecutar @playwright/mcp" -ForegroundColor Red
    if (Test-Path "mcp-test-error.txt") {
        Write-Host "   Error:" -ForegroundColor Red
        Get-Content "mcp-test-error.txt" | ForEach-Object { Write-Host "   $_" -ForegroundColor Red }
    }
}

# Limpiar archivos temporales
Remove-Item "mcp-test-output.txt" -ErrorAction SilentlyContinue
Remove-Item "mcp-test-error.txt" -ErrorAction SilentlyContinue

Write-Host ""

# Verificar configuración de Cursor MCP
Write-Host "3️⃣ Verificando configuración de Cursor..." -ForegroundColor Yellow
$mcpConfigPath = "$env:USERPROFILE\.cursor\mcp.json"

if (Test-Path $mcpConfigPath) {
    Write-Host "   ✅ Archivo mcp.json encontrado" -ForegroundColor Green
    Write-Host "   Ubicación: $mcpConfigPath" -ForegroundColor Gray
    
    $mcpConfig = Get-Content $mcpConfigPath -Raw | ConvertFrom-Json
    if ($mcpConfig.mcpServers.playwright) {
        Write-Host "   ✅ Servidor 'playwright' configurado correctamente" -ForegroundColor Green
        Write-Host "   Comando: $($mcpConfig.mcpServers.playwright.command)" -ForegroundColor Gray
        Write-Host "   Args: $($mcpConfig.mcpServers.playwright.args -join ' ')" -ForegroundColor Gray
    } else {
        Write-Host "   ❌ Servidor 'playwright' no encontrado en la configuración" -ForegroundColor Red
    }
} else {
    Write-Host "   ❌ Archivo mcp.json no encontrado" -ForegroundColor Red
    Write-Host "   Se esperaba en: $mcpConfigPath" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "📋 Resumen:" -ForegroundColor Cyan
Write-Host ""
Write-Host "Si todos los checks son ✅, entonces:" -ForegroundColor White
Write-Host "1. Cierra completamente Cursor (incluyendo procesos en segundo plano)" -ForegroundColor White
Write-Host "2. Abre Cursor de nuevo" -ForegroundColor White
Write-Host "3. El servidor MCP debería conectarse automáticamente" -ForegroundColor White
Write-Host ""
Write-Host "Si hay ❌, corrige los problemas indicados primero." -ForegroundColor White
Write-Host ""
Write-Host "Para verificar la conexión en Cursor:" -ForegroundColor Cyan
Write-Host "• Ctrl+, → busca 'MCP' → Features → Model Context Protocol" -ForegroundColor White
Write-Host "• Debería aparecer 'playwright' con estado Connected (verde)" -ForegroundColor White
Write-Host ""
