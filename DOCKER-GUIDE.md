# 🐳 Guía de Docker para Next.js

Guía completa para construir y ejecutar tu aplicación Next.js en Docker.

---

## 📋 Archivos Docker Creados

1. **`Dockerfile`** - Imagen optimizada con multi-stage build
2. **`.dockerignore`** - Archivos excluidos del contexto de build
3. **`docker-compose.yml`** - Orquestación de servicios
4. **`DOCKER-GUIDE.md`** - Esta guía

---

## 📦 Versiones del Proyecto

- **Node.js:** v22.22.0
- **npm:** 10.9.4
- **Next.js:** 13.5.1
- **React:** 18.2.0
- **Imagen Docker:** node:22-alpine

---

## 🚀 Inicio Rápido

### Opción 1: Docker solo (Frontend)

```bash
# 1. Construir imagen
docker build -t airbnb-frontend .

# 2. Ejecutar contenedor
docker run -p 3000:3000 airbnb-frontend

# 3. Abrir en navegador
http://localhost:3000
```

### Opción 2: Docker Compose (Recomendado)

```bash
# 1. Construir y ejecutar
docker-compose up --build

# 2. Ejecutar en background
docker-compose up -d

# 3. Ver logs
docker-compose logs -f frontend

# 4. Detener
docker-compose down
```

---

## 🏗️ Construcción de la Imagen

### Build básico
```bash
docker build -t airbnb-frontend:latest .
```

### Build con variables de entorno
```bash
docker build \
  --build-arg NEXT_PUBLIC_API_URL=http://localhost:3333/api \
  --build-arg NEXT_PUBLIC_APP_NAME="Adribnb" \
  -t airbnb-frontend:latest \
  .
```

### Build sin caché (si hay problemas)
```bash
docker build --no-cache -t airbnb-frontend:latest .
```

---

## 🎮 Ejecución del Contenedor

### Ejecutar en primer plano
```bash
docker run -p 3000:3000 airbnb-frontend
```

### Ejecutar en background
```bash
docker run -d -p 3000:3000 --name airbnb-frontend airbnb-frontend
```

### Ejecutar con variables de entorno
```bash
docker run \
  -p 3000:3000 \
  -e NEXT_PUBLIC_API_URL=http://backend:3333/api \
  -e NEXT_PUBLIC_APP_URL=http://localhost:3000 \
  --name airbnb-frontend \
  airbnb-frontend
```

### Conectar a red con backend
```bash
# Crear red
docker network create airbnb-network

# Ejecutar frontend
docker run \
  -p 3000:3000 \
  --network airbnb-network \
  --name airbnb-frontend \
  airbnb-frontend
```

---

## 🔍 Comandos Útiles

### Ver contenedores corriendo
```bash
docker ps
```

### Ver logs
```bash
# Logs en tiempo real
docker logs -f airbnb-frontend

# Últimas 100 líneas
docker logs --tail 100 airbnb-frontend
```

### Entrar al contenedor
```bash
# Abrir shell dentro del contenedor
docker exec -it airbnb-frontend sh

# Dentro del contenedor puedes:
ls -la           # Ver archivos
node -v          # Ver versión de Node
cat .next/BUILD_ID  # Ver ID del build
```

### Detener y eliminar
```bash
# Detener
docker stop airbnb-frontend

# Eliminar contenedor
docker rm airbnb-frontend

# Eliminar imagen
docker rmi airbnb-frontend
```

---

## 📊 Características del Dockerfile

### Multi-Stage Build
```
Stage 1: deps     → Instala solo dependencias de producción (más rápido)
Stage 2: builder  → Instala todo + hace build de Next.js
Stage 3: runner   → Imagen final pequeña solo con archivos necesarios
```

**Beneficios:**
- ✅ Imagen final más pequeña (~200-300 MB vs ~1 GB)
- ✅ Build más rápido con caché de capas
- ✅ Más seguro (sin devDependencies en producción)

### Standalone Output
```javascript
// next.config.js
output: 'standalone'
```

**Beneficios:**
- ✅ Next.js copia solo archivos necesarios
- ✅ Incluye servidor HTTP mínimo
- ✅ No requiere node_modules completo

### Seguridad
```dockerfile
# Usuario no-root
RUN adduser --system nextjs
USER nextjs
```

**Beneficios:**
- ✅ No ejecuta como root (best practice de seguridad)
- ✅ Reduce superficie de ataque

---

## 🔧 Configuración Avanzada

### Variables de Entorno

**Build-time (ARG):**
```dockerfile
# Solo disponibles durante docker build
ARG NEXT_PUBLIC_API_URL=http://localhost:3333/api
```

**Runtime (ENV):**
```dockerfile
# Disponibles cuando el contenedor está corriendo
ENV NODE_ENV=production
```

**Desde archivo .env:**
```bash
# Crear .env.docker
NEXT_PUBLIC_API_URL=http://backend:3333/api
NEXT_PUBLIC_APP_NAME=Adribnb

# Usar en docker run
docker run --env-file .env.docker -p 3000:3000 airbnb-frontend
```

---

### Optimizaciones

#### 1. Cache de npm
```dockerfile
# Copiar package*.json primero para aprovechar caché de Docker
COPY package.json package-lock.json ./
RUN npm ci
COPY . .  # Copiar código después
```

**Beneficio:** Si el código cambia pero package.json no, npm ci usa caché.

#### 2. Menos capas
```dockerfile
# Combinar comandos relacionados
RUN apk add --no-cache libc6-compat && \
    addgroup --system nodejs && \
    adduser --system nextjs
```

**Beneficio:** Reduce tamaño de imagen.

---

## 🌐 Integración con Backend

### Escenario 1: Backend en contenedor Docker

```yaml
# docker-compose.yml
services:
  frontend:
    environment:
      - NEXT_PUBLIC_API_URL=http://backend:3333/api  # Usar nombre del servicio
  
  backend:
    ports:
      - "3333:3333"
```

**Red interna:** Los contenedores se comunican por nombre de servicio.

---

### Escenario 2: Backend en host (fuera de Docker)

```bash
# Windows/Mac: Usar host.docker.internal
docker run \
  -p 3000:3000 \
  -e NEXT_PUBLIC_API_URL=http://host.docker.internal:3333/api \
  airbnb-frontend

# Linux: Usar IP del host
docker run \
  -p 3000:3000 \
  -e NEXT_PUBLIC_API_URL=http://172.17.0.1:3333/api \
  airbnb-frontend
```

---

## 🐛 Solución de Problemas

### Error: Cannot find module 'next'
```bash
# Limpiar y reconstruir
docker build --no-cache -t airbnb-frontend .
```

### Error: EACCES permission denied
```bash
# Verificar permisos en next.config.js
chmod 644 next.config.js

# O construir sin usuario no-root (menos seguro)
# Modificar Dockerfile: comentar línea USER nextjs
```

### Build muy lento
```bash
# Usar BuildKit (más rápido)
DOCKER_BUILDKIT=1 docker build -t airbnb-frontend .
```

### Contenedor se detiene inmediatamente
```bash
# Ver logs para identificar el error
docker logs airbnb-frontend

# Ejecutar en modo interactivo
docker run -it airbnb-frontend sh
```

### No puede conectar al backend
```bash
# Desde dentro del contenedor
docker exec -it airbnb-frontend sh
wget -O- http://backend:3333/api  # O curl si está disponible

# Verificar red
docker network inspect airbnb-network
```

---

## 📦 Tamaño de la Imagen

### Ver tamaño
```bash
docker images airbnb-frontend
```

**Tamaños esperados:**
- Con multi-stage: ~200-300 MB ✅
- Sin multi-stage: ~1 GB ❌
- Alpine base: ~150 MB (base)

### Reducir tamaño adicional
```bash
# Comprimir imagen (experimental)
docker image prune -a

# O usar Alpine Linux (ya implementado)
FROM node:20-alpine  # ~150 MB base
# vs
FROM node:20         # ~900 MB base
```

---

## 🚀 Deploy a Producción

### Docker Hub
```bash
# 1. Login
docker login

# 2. Tag
docker tag airbnb-frontend:latest tu-usuario/airbnb-frontend:v1.0.0

# 3. Push
docker push tu-usuario/airbnb-frontend:v1.0.0
```

### Servidor de Producción
```bash
# En el servidor
docker pull tu-usuario/airbnb-frontend:v1.0.0
docker run -d -p 3000:3000 \
  --restart always \
  --name airbnb-frontend \
  tu-usuario/airbnb-frontend:v1.0.0
```

---

## 🧪 Testing en Docker

### Ejecutar tests dentro del contenedor
```bash
# Crear imagen de desarrollo
docker build --target builder -t airbnb-frontend:dev .

# Ejecutar tests
docker run airbnb-frontend:dev npm test

# Ejecutar tests E2E
docker run -v $(pwd)/tests:/app/tests airbnb-frontend:dev npm run test:e2e
```

---

## 📝 Checklist Pre-Deploy

Antes de deployar a producción:

- [ ] Build funciona sin errores: `docker build -t airbnb-frontend .`
- [ ] Contenedor inicia correctamente: `docker run -p 3000:3000 airbnb-frontend`
- [ ] Aplicación carga en navegador: `http://localhost:3000`
- [ ] Variables de entorno configuradas correctamente
- [ ] Conexión con backend funciona (si aplica)
- [ ] Tamaño de imagen es razonable (<500 MB)
- [ ] No hay warnings críticos en logs
- [ ] Health check funciona (si está configurado)

---

## 🎯 Comandos de Referencia Rápida

```bash
# Build
docker build -t airbnb-frontend .

# Run
docker run -d -p 3000:3000 --name frontend airbnb-frontend

# Logs
docker logs -f frontend

# Stop
docker stop frontend

# Remove
docker rm frontend

# Clean all
docker-compose down
docker system prune -a
```

---

## 🔗 Recursos

- [Next.js Docker Guide](https://nextjs.org/docs/deployment#docker-image)
- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)
- [Multi-Stage Builds](https://docs.docker.com/build/building/multi-stage/)
