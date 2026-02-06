# Dockerfile para Next.js App
# Multi-stage build para optimizar tamaño de imagen final
# Node.js v22.22 | npm v10.9

# ============================================
# Stage 1: Dependencias
# ============================================
FROM node:22-alpine AS deps

# Instalar libc6-compat para compatibilidad
RUN apk add --no-cache libc6-compat

WORKDIR /app

# Copiar archivos de dependencias
COPY package.json package-lock.json ./

# Instalar dependencias (solo producción)
# npm ci es más rápido y confiable que npm install en CI/CD
RUN npm ci --only=production

# ============================================
# Stage 2: Builder
# ============================================
FROM node:22-alpine AS builder

WORKDIR /app

# Copiar archivos de dependencias
COPY package.json package-lock.json ./

# Instalar TODAS las dependencias (incluyendo devDependencies para el build)
RUN npm ci

# Copiar código fuente
COPY . .

# Variables de entorno para build
# Nota: Usa ARG para variables de build-time
ARG NEXT_PUBLIC_API_URL=http://localhost:3333/api
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

ARG NEXT_PUBLIC_APP_NAME="Airbnb Clone"
ENV NEXT_PUBLIC_APP_NAME=$NEXT_PUBLIC_APP_NAME

# Deshabilitar telemetría de Next.js
ENV NEXT_TELEMETRY_DISABLED=1

# Build de Next.js
# Next.js genera archivos optimizados en .next/
RUN npm run build

# ============================================
# Stage 3: Producción (imagen final)
# ============================================
FROM node:22-alpine AS runner

WORKDIR /app

# Variables de entorno de producción
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Crear usuario no-root por seguridad
# ¿Por qué? No ejecutar aplicaciones como root es una best practice de seguridad
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copiar archivos de build de Next.js
# Next.js genera archivos standalone optimizados
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Nota: La carpeta public/ es opcional en Next.js
# Si tu proyecto tiene assets estáticos, créala y descomenta la siguiente línea:
# COPY --from=builder --chown=nextjs:nodejs /app/public ./public

# Cambiar a usuario no-root
USER nextjs

# Exponer puerto 3000
EXPOSE 3000

# Variable de entorno para el puerto
ENV PORT=3000

# Comando para iniciar la aplicación
# Next.js standalone incluye un servidor HTTP mínimo
CMD ["node", "server.js"]
