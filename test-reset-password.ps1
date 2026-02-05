# Script de Prueba: Reset Password con MongoDB
# Verifica la conexión entre Frontend (3000) y Backend (3333)

Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "🧪 TEST: Reset Password + MongoDB" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""

# Colores
$Green = "Green"
$Red = "Red"
$Yellow = "Yellow"
$Cyan = "Cyan"

# Paso 1: Verificar servicios
Write-Host "📋 PASO 1: Verificando servicios..." -ForegroundColor $Cyan
Write-Host ""

Write-Host "Verificando Frontend (puerto 3000)..." -ForegroundColor $Yellow
try {
    $frontendResponse = Invoke-WebRequest -Uri "http://localhost:3000" -UseBasicParsing -TimeoutSec 5
    Write-Host "✅ Frontend está corriendo" -ForegroundColor $Green
    $frontendOk = $true
} catch {
    Write-Host "❌ Frontend NO está corriendo" -ForegroundColor $Red
    Write-Host "   Ejecuta: npm run dev" -ForegroundColor $Yellow
    $frontendOk = $false
}

Write-Host ""
Write-Host "Verificando Backend (puerto 3333)..." -ForegroundColor $Yellow
try {
    $backendResponse = Invoke-WebRequest -Uri "http://localhost:3333/api" -UseBasicParsing -TimeoutSec 5
    Write-Host "✅ Backend está corriendo" -ForegroundColor $Green
    $backendOk = $true
} catch {
    Write-Host "❌ Backend NO está corriendo" -ForegroundColor $Red
    Write-Host "   Ejecuta tu servidor backend en puerto 3333" -ForegroundColor $Yellow
    $backendOk = $false
}

Write-Host ""
Write-Host "=========================================" -ForegroundColor Cyan

if (-not $frontendOk -or -not $backendOk) {
    Write-Host ""
    Write-Host "⚠️  SERVICIOS REQUERIDOS NO ESTÁN CORRIENDO" -ForegroundColor $Red
    Write-Host ""
    Write-Host "Para ejecutar este test necesitas:" -ForegroundColor $Yellow
    Write-Host "1. Terminal 1 - Backend:" -ForegroundColor $Yellow
    Write-Host "   cd backend" -ForegroundColor White
    Write-Host "   npm run dev  # o node server.js" -ForegroundColor White
    Write-Host ""
    Write-Host "2. Terminal 2 - Frontend:" -ForegroundColor $Yellow
    Write-Host "   cd Fronted_airbnb" -ForegroundColor White
    Write-Host "   npm run dev" -ForegroundColor White
    Write-Host ""
    Write-Host "Luego ejecuta este script nuevamente." -ForegroundColor $Yellow
    Write-Host ""
    exit 1
}

# Paso 2: Probar endpoint de validación
Write-Host ""
Write-Host "📋 PASO 2: Probando validación de token..." -ForegroundColor $Cyan
Write-Host ""

$testToken = "TEST_TOKEN_12345"
$validateUrl = "http://localhost:3333/api/auth/reset-password/validate?token=$testToken"

Write-Host "Probando: GET $validateUrl" -ForegroundColor $Yellow
try {
    $validateResponse = Invoke-RestMethod -Uri $validateUrl -Method Get -TimeoutSec 5
    Write-Host "✅ Endpoint de validación responde" -ForegroundColor $Green
    Write-Host "   Response:" -ForegroundColor $Cyan
    Write-Host ($validateResponse | ConvertTo-Json) -ForegroundColor White
    
    if ($validateResponse.valid -ne $null) {
        Write-Host "✅ Formato de respuesta correcto (tiene campo 'valid')" -ForegroundColor $Green
    } else {
        Write-Host "⚠️  Response no tiene campo 'valid'" -ForegroundColor $Yellow
    }
} catch {
    Write-Host "❌ Endpoint de validación NO funciona" -ForegroundColor $Red
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor $Red
    Write-Host ""
    Write-Host "   Este endpoint debe estar implementado en el backend:" -ForegroundColor $Yellow
    Write-Host "   GET /api/auth/reset-password/validate?token=..." -ForegroundColor White
}

# Paso 3: Probar endpoint de reset
Write-Host ""
Write-Host "📋 PASO 3: Probando reset de contraseña..." -ForegroundColor $Cyan
Write-Host ""

$resetUrl = "http://localhost:3333/api/auth/reset-password"
$resetBody = @{
    token = $testToken
    password = "nueva123"
} | ConvertTo-Json

Write-Host "Probando: POST $resetUrl" -ForegroundColor $Yellow
try {
    $resetResponse = Invoke-RestMethod -Uri $resetUrl -Method Post -Body $resetBody -ContentType "application/json" -TimeoutSec 5
    Write-Host "✅ Endpoint de reset responde" -ForegroundColor $Green
    Write-Host "   Response:" -ForegroundColor $Cyan
    Write-Host ($resetResponse | ConvertTo-Json) -ForegroundColor White
    
    if ($resetResponse.success -ne $null) {
        Write-Host "✅ Formato de respuesta correcto (tiene campo 'success')" -ForegroundColor $Green
    } else {
        Write-Host "⚠️  Response no tiene campo 'success'" -ForegroundColor $Yellow
    }
} catch {
    Write-Host "⚠️  Endpoint de reset NO funciona (esperado si token no existe)" -ForegroundColor $Yellow
    Write-Host "   Status: $($_.Exception.Response.StatusCode.Value__)" -ForegroundColor $Yellow
    
    if ($_.Exception.Response.StatusCode.Value__ -eq 400 -or $_.Exception.Response.StatusCode.Value__ -eq 404) {
        Write-Host "   ✅ El endpoint existe pero rechaza tokens inválidos (correcto)" -ForegroundColor $Green
    } else {
        Write-Host "   ❌ Error inesperado" -ForegroundColor $Red
    }
}

# Paso 4: Verificar configuración del frontend
Write-Host ""
Write-Host "📋 PASO 4: Verificando configuración del frontend..." -ForegroundColor $Cyan
Write-Host ""

Write-Host "Archivo de configuración: lib/config.ts" -ForegroundColor $Yellow
$configFile = "lib/config.ts"
if (Test-Path $configFile) {
    $configContent = Get-Content $configFile -Raw
    if ($configContent -match "localhost:3333") {
        Write-Host "✅ Config apunta a localhost:3333" -ForegroundColor $Green
    } else {
        Write-Host "⚠️  Config no contiene localhost:3333" -ForegroundColor $Yellow
    }
} else {
    Write-Host "⚠️  Archivo de config no encontrado" -ForegroundColor $Yellow
}

# Paso 5: Probar página de reset password
Write-Host ""
Write-Host "📋 PASO 5: Verificando página de reset password..." -ForegroundColor $Cyan
Write-Host ""

$testPageUrl = "http://localhost:3000/reset-password?token=$testToken"
Write-Host "Probando: GET $testPageUrl" -ForegroundColor $Yellow
try {
    $pageResponse = Invoke-WebRequest -Uri $testPageUrl -UseBasicParsing -TimeoutSec 5
    Write-Host "✅ Página de reset password carga correctamente" -ForegroundColor $Green
    
    if ($pageResponse.Content -match "Validando token") {
        Write-Host "✅ Página contiene texto de validación" -ForegroundColor $Green
    }
    if ($pageResponse.Content -match "MongoDB") {
        Write-Host "✅ Página menciona MongoDB" -ForegroundColor $Green
    }
} catch {
    Write-Host "❌ Página de reset password NO carga" -ForegroundColor $Red
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor $Red
}

# Resumen
Write-Host ""
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "📊 RESUMEN DEL TEST" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""

$results = @()
$results += @{ Name = "Frontend activo"; Status = $frontendOk }
$results += @{ Name = "Backend activo"; Status = $backendOk }

Write-Host "Servicios:" -ForegroundColor $Cyan
foreach ($result in $results) {
    $status = if ($result.Status) { "✅" } else { "❌" }
    $color = if ($result.Status) { $Green } else { $Red }
    Write-Host "  $status $($result.Name)" -ForegroundColor $color
}

Write-Host ""
Write-Host "Próximos pasos:" -ForegroundColor $Cyan
Write-Host "1. Asegúrate de que ambos servicios estén corriendo" -ForegroundColor $Yellow
Write-Host "2. Abre en el navegador:" -ForegroundColor $Yellow
Write-Host "   http://localhost:3000/reset-password?token=TOKEN_REAL" -ForegroundColor White
Write-Host "3. Revisa la guía completa en:" -ForegroundColor $Yellow
Write-Host "   VERIFICACION-RESET-PASSWORD-MONGODB.md" -ForegroundColor White
Write-Host ""

# Abrir documentación
Write-Host "¿Quieres abrir la documentación de verificación? (S/N)" -ForegroundColor $Yellow
$response = Read-Host
if ($response -eq "S" -or $response -eq "s") {
    Start-Process "VERIFICACION-RESET-PASSWORD-MONGODB.md"
}
