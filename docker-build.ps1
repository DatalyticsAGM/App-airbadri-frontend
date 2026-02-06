# Script para construir y ejecutar la aplicación en Docker
# Uso: .\docker-build.ps1

param(
    [Parameter(Mandatory=$false)]
    [ValidateSet("build", "run", "stop", "logs", "clean", "all")]
    [string]$Action = "all"
)

$ImageName = "airbnb-frontend"
$ContainerName = "airbnb-frontend-app"
$Port = "3000:3000"

Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "🐳 Docker Manager - Airbnb Frontend" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""

function Build-Image {
    Write-Host "📦 Construyendo imagen Docker..." -ForegroundColor Yellow
    Write-Host ""
    
    docker build `
        --build-arg NEXT_PUBLIC_API_URL=http://localhost:3333/api `
        --build-arg NEXT_PUBLIC_APP_NAME="Adribnb" `
        -t ${ImageName}:latest `
        .
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "✅ Imagen construida exitosamente: ${ImageName}:latest" -ForegroundColor Green
        
        # Mostrar tamaño de la imagen
        $imageInfo = docker images $ImageName --format "{{.Size}}"
        Write-Host "📊 Tamaño de la imagen: $imageInfo" -ForegroundColor Cyan
    } else {
        Write-Host ""
        Write-Host "❌ Error al construir la imagen" -ForegroundColor Red
        exit 1
    }
}

function Run-Container {
    Write-Host "🚀 Ejecutando contenedor..." -ForegroundColor Yellow
    Write-Host ""
    
    # Detener contenedor existente si hay uno
    $existing = docker ps -a -q -f name=$ContainerName
    if ($existing) {
        Write-Host "⚠️  Deteniendo contenedor existente..." -ForegroundColor Yellow
        docker stop $ContainerName | Out-Null
        docker rm $ContainerName | Out-Null
    }
    
    # Ejecutar nuevo contenedor
    docker run `
        -d `
        -p $Port `
        --name $ContainerName `
        -e NEXT_PUBLIC_API_URL=http://host.docker.internal:3333/api `
        ${ImageName}:latest
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "✅ Contenedor iniciado: $ContainerName" -ForegroundColor Green
        Write-Host "🌐 Aplicación disponible en: http://localhost:3000" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "Ver logs: docker logs -f $ContainerName" -ForegroundColor Yellow
    } else {
        Write-Host ""
        Write-Host "❌ Error al ejecutar el contenedor" -ForegroundColor Red
        exit 1
    }
}

function Stop-Container {
    Write-Host "🛑 Deteniendo contenedor..." -ForegroundColor Yellow
    
    docker stop $ContainerName
    docker rm $ContainerName
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Contenedor detenido y eliminado" -ForegroundColor Green
    }
}

function Show-Logs {
    Write-Host "📋 Mostrando logs del contenedor..." -ForegroundColor Yellow
    Write-Host ""
    docker logs -f $ContainerName
}

function Clean-Docker {
    Write-Host "🧹 Limpiando recursos de Docker..." -ForegroundColor Yellow
    Write-Host ""
    
    Write-Host "Deteniendo contenedores..." -ForegroundColor Yellow
    docker stop $ContainerName 2>$null
    
    Write-Host "Eliminando contenedores..." -ForegroundColor Yellow
    docker rm $ContainerName 2>$null
    
    Write-Host "Eliminando imágenes..." -ForegroundColor Yellow
    docker rmi ${ImageName}:latest 2>$null
    
    Write-Host "Limpiando recursos no usados..." -ForegroundColor Yellow
    docker system prune -f
    
    Write-Host ""
    Write-Host "✅ Limpieza completada" -ForegroundColor Green
}

# Ejecutar acción
switch ($Action) {
    "build" {
        Build-Image
    }
    "run" {
        Run-Container
    }
    "stop" {
        Stop-Container
    }
    "logs" {
        Show-Logs
    }
    "clean" {
        Clean-Docker
    }
    "all" {
        Build-Image
        Write-Host ""
        Run-Container
    }
}

Write-Host ""
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "✅ Completado" -ForegroundColor Green
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Comandos disponibles:" -ForegroundColor Cyan
Write-Host "  .\docker-build.ps1 build   # Solo construir imagen" -ForegroundColor White
Write-Host "  .\docker-build.ps1 run     # Solo ejecutar contenedor" -ForegroundColor White
Write-Host "  .\docker-build.ps1 stop    # Detener contenedor" -ForegroundColor White
Write-Host "  .\docker-build.ps1 logs    # Ver logs" -ForegroundColor White
Write-Host "  .\docker-build.ps1 clean   # Limpiar todo" -ForegroundColor White
Write-Host "  .\docker-build.ps1 all     # Build + Run (default)" -ForegroundColor White
Write-Host ""
