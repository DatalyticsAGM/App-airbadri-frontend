# App-airbadri-frontend

Aplicación de reservas vacacionales utilizando Next.js y Tailwind CSS, inspirada en Airbnb.

## 🎨 Características de Diseño

- **Diseño Minimalista**: Interfaz limpia y fácil de navegar
- **Colores Pasteles**: Paleta de colores oficial de Airbnb
- **Responsive**: Diseño adaptable a todos los dispositivos
- **Fuente**: DM Sans de Google Fonts

## 🎨 Paleta de Colores

```css
--primary-100: #FF5A5F  /* Rosa principal de Airbnb */
--primary-200: #ff8e8c  /* Rosa claro */
--primary-300: #fff7ef  /* Rosa pastel muy claro */
--accent-100:  #00A699  /* Verde azulado (acento) */
--accent-200:  #004940  /* Verde azulado oscuro */
--text-100:    #333333  /* Texto principal */
--text-200:    #5c5c5c  /* Texto secundario */
--bg-100:      #FFFFFF  /* Fondo blanco */
--bg-200:      #f5f5f5  /* Fondo gris claro */
--bg-300:      #cccccc  /* Fondo gris medio */
```

## 📁 Estructura del Proyecto

```
project/
├── app/
│   ├── layout.tsx              # Layout principal con DM Sans
│   ├── page.tsx                # Página principal (Home)
│   ├── globals.css             # Estilos globales
│   ├── auth/                   # Páginas de autenticación
│   │   ├── login/
│   │   ├── signup/
│   │   ├── forgot-password/
│   │   └── reset-password/
│   ├── properties/             # Páginas de propiedades
│   │   ├── [id]/
│   │   ├── create/
│   │   └── my-properties/
│   ├── bookings/               # Páginas de reservas
│   │   └── [id]/
│   ├── profile/                # Página de perfil
│   └── about/                  # Página acerca de
├── components/
│   ├── index.ts                # Barrel export principal
│   ├── auth/                   # Componentes de autenticación
│   │   ├── index.ts            # Barrel export
│   │   ├── auth-button.tsx
│   │   ├── login-form.tsx
│   │   ├── signup-form.tsx
│   │   ├── forgot-password-form.tsx
│   │   └── reset-password-form.tsx
│   ├── properties/             # Componentes de propiedades
│   │   ├── index.ts            # Barrel export
│   │   ├── property-card.tsx
│   │   ├── property-grid.tsx
│   │   ├── property-filters.tsx
│   │   ├── property-detail.tsx
│   │   ├── create-property-form.tsx
│   │   └── edit-property-form.tsx
│   ├── bookings/               # Componentes de reservas
│   │   ├── index.ts            # Barrel export
│   │   └── booking-form.tsx
│   ├── shared/                 # Componentes compartidos (landing)
│   │   ├── index.ts            # Barrel export
│   │   ├── header.tsx
│   │   ├── footer.tsx
│   │   ├── hero-section.tsx
│   │   ├── features-section.tsx
│   │   ├── promotions-section.tsx
│   │   ├── cta-section.tsx
│   │   └── topbar-offers.tsx
│   └── ui/                     # Componentes de shadcn/ui
├── lib/
│   ├── auth/                   # Servicios y contexto de autenticación
│   │   ├── mock-auth.ts
│   │   ├── auth-context.tsx
│   │   └── mock-users-data.ts
│   ├── properties/             # Servicios y tipos de propiedades
│   │   ├── types.ts
│   │   ├── mock-properties.ts
│   │   └── mock-data.ts
│   ├── bookings/               # Servicios y tipos de reservas
│   │   ├── types.ts
│   │   ├── mock-bookings.ts
│   │   └── mock-data.ts
│   └── utils.ts                # Utilidades compartidas
└── hooks/                      # Custom hooks
    └── use-toast.ts
```

### Convenciones de Estructura

- **Componentes por módulo**: Cada módulo funcional tiene su propia carpeta en `components/`
- **Barrel exports**: Cada carpeta de componentes tiene un `index.ts` para facilitar imports
- **Imports centralizados**: Usar `@/components` para imports de componentes compartidos
- **Separación de concerns**: Servicios y lógica en `lib/`, componentes de UI en `components/`

## ✅ Estado del Proyecto

### Milestone 1: Módulo de Autenticación (Auth) - MOCK ✅
- Sistema completo de autenticación con localStorage
- Login, registro, recuperación y reset de contraseña
- Integración con header y navegación

### Milestone 2: Módulo de Propiedades y Reservas (MOCK) ✅
- CRUD completo de propiedades
- Sistema de reservas con validación de disponibilidad
- Filtros y búsqueda de propiedades
- Perfil de usuario con estadísticas

### Milestone 2.1: Refactorización de Estructura de Componentes ✅
- Organización por módulos funcionales
- Barrel exports para imports limpios
- Estructura consistente y escalable

### Milestone 3: Mejoras de UX/UI, SEO y Features Adicionales ✅
- Sistema de reviews y ratings
- Búsqueda avanzada
- Optimización SEO (metadata, sitemap, robots.txt)
- Skeleton loaders
- Sistema de notificaciones
- Dashboard de host
- Sistema de favoritos
- Compartir propiedades

### Milestone 4: Testing, Optimización y Preparación para Producción ✅
- Configuración de testing (Jest, Testing Library)
- Tests unitarios para servicios MOCK
- Preparación para backend real (abstracciones e interfaces)
- Variables de entorno y configuración
- Documentación completa

## 🚀 Stack Tecnológico

- **Framework**: Next.js 13 (App Router)
- **UI**: React 18
- **Estilos**: Tailwind CSS
- **Componentes**: shadcn/ui
- **Iconos**: Lucide React
- **Fuente**: DM Sans (Google Fonts)
- **Imágenes**: Pexels (stock photos)

## 📦 Instalación y Uso

```bash
# Instalar dependencias
npm install

# Modo desarrollo
npm run dev

# Build de producción
npm run build

# Iniciar producción
npm start

# Testing
npm test              # Ejecutar tests
npm run test:watch    # Tests en modo watch
npm run test:coverage # Tests con cobertura

# Type checking
npm run typecheck     # Verificar tipos TypeScript

# Linting
npm run lint          # Ejecutar ESLint
```

## 🔧 Configuración

### Variables de Entorno

Copia `.env.example` a `.env.local` y configura las variables necesarias:

```bash
cp .env.example .env.local
```

Variables principales:
- `NEXT_PUBLIC_API_URL`: URL del backend (opcional, por defecto usa MOCK)
- `NEXT_PUBLIC_USE_MOCK_SERVICES`: `true` para usar servicios MOCK (por defecto)
- `NEXT_PUBLIC_APP_NAME`: Nombre de la aplicación
- `NEXT_PUBLIC_APP_URL`: URL pública de la aplicación

Ver `.env.example` para todas las opciones disponibles.

## 📚 Documentación

- [Arquitectura](./docs/ARCHITECTURE.md) - Estructura y decisiones de diseño
- [API](./docs/API.md) - Documentación de API esperada
- [Desarrollo](./docs/DEVELOPMENT.md) - Guía para desarrolladores

## 🧪 Testing

El proyecto incluye tests unitarios usando Jest y React Testing Library:

```bash
npm test              # Ejecutar todos los tests
npm run test:watch    # Modo watch
npm run test:coverage # Con cobertura
```

Los tests cubren:
- Servicios MOCK (auth, properties, bookings)
- Utilidades
- Componentes (en desarrollo)

## 🔄 Migración a Backend Real

El proyecto está preparado para migrar fácilmente de servicios MOCK a API real:

1. Configura `NEXT_PUBLIC_API_URL` en `.env.local`
2. Establece `NEXT_PUBLIC_USE_MOCK_SERVICES=false`
3. Implementa los servicios en `lib/api/services/` según las interfaces definidas

Ver [docs/API.md](./docs/API.md) para la documentación de endpoints esperados.

## 📝 Notas Adicionales

- **Sistema MOCK**: Actualmente usa localStorage para almacenamiento (solo desarrollo)
- **Imágenes**: Todas las imágenes son de Pexels (uso permitido)
- **Responsive**: Diseño optimizado para mobile, tablet y desktop
- **Accesibilidad**: Se respetan las preferencias de movimiento reducido
- **Performance**: Build optimizado con Next.js

---

**Desarrollado para**: App-airbadri-frontend
**Tipo**: Aplicación de Reservas Vacacionales
**Estado**: En desarrollo activo
