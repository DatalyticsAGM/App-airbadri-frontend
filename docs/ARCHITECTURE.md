# 🏗️ Arquitectura del Proyecto

## 📋 Descripción General

Este proyecto es una aplicación de reservas vacacionales inspirada en Airbnb, construida con Next.js 13 (App Router), React 18, TypeScript y Tailwind CSS.

## 🎯 Principios de Diseño

1. **Separación de Concerns**: Lógica de negocio en `lib/`, UI en `components/`
2. **Modularidad**: Cada funcionalidad está organizada en su propio módulo
3. **Escalabilidad**: Estructura preparada para crecer
4. **Mantenibilidad**: Código organizado y documentado
5. **Flexibilidad**: Fácil cambio entre MOCK y API real

## 📁 Estructura de Carpetas

```
Fronted_airbnb/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Layout principal
│   ├── page.tsx           # Página home
│   ├── auth/              # Rutas de autenticación
│   ├── properties/        # Rutas de propiedades
│   ├── bookings/          # Rutas de reservas
│   ├── profile/           # Perfil de usuario
│   ├── host/              # Dashboard de host
│   └── ...
├── components/            # Componentes React
│   ├── auth/             # Componentes de autenticación
│   ├── properties/       # Componentes de propiedades
│   ├── bookings/         # Componentes de reservas
│   ├── reviews/          # Componentes de reviews
│   ├── favorites/        # Componentes de favoritos
│   ├── notifications/    # Componentes de notificaciones
│   ├── search/           # Componentes de búsqueda
│   ├── ui/               # Componentes UI base (shadcn/ui)
│   └── ...
├── lib/                  # Lógica de negocio y servicios
│   ├── api/              # Cliente API y abstracciones
│   │   ├── interfaces.ts # Interfaces de servicios
│   │   ├── client.ts     # Cliente HTTP
│   │   ├── service-factory.ts # Factory para servicios
│   │   └── services/     # Implementaciones de API real
│   ├── auth/             # Autenticación
│   ├── properties/       # Propiedades
│   ├── bookings/         # Reservas
│   ├── reviews/          # Reviews
│   ├── favorites/        # Favoritos
│   ├── notifications/    # Notificaciones
│   ├── seo/              # Utilidades SEO
│   ├── config.ts         # Configuración centralizada
│   └── utils.ts          # Utilidades compartidas
├── hooks/                # Custom React hooks
└── docs/                 # Documentación
```

## 🔄 Flujo de Datos

### Autenticación
```
Usuario → LoginForm → mockAuth.login() → localStorage → AuthContext → UI actualizada
```

### Propiedades
```
Usuario → PropertyCard → mockProperties.getPropertyById() → localStorage → Componente renderizado
```

### Reservas
```
Usuario → BookingForm → mockBookings.createBooking() → Validación → localStorage → Notificación
```

## 🏛️ Patrones Arquitectónicos

### 1. Service Layer Pattern
Todos los servicios están abstraídos mediante interfaces (`lib/api/interfaces.ts`), permitiendo cambiar entre MOCK y API real sin modificar componentes.

```typescript
// Uso en componentes
import { getPropertyService } from '@/lib/api/service-factory';
const propertyService = getPropertyService();
```

### 2. Context Pattern
Autenticación y otros estados globales se manejan mediante React Context:
- `AuthContext`: Estado de autenticación
- Futuros: `ThemeContext`, `NotificationContext`

### 3. Barrel Exports
Cada módulo tiene un `index.ts` para facilitar imports:
```typescript
import { PropertyCard, PropertyGrid } from '@/components/properties';
```

### 4. Factory Pattern
`service-factory.ts` crea instancias de servicios según configuración:
```typescript
export function getPropertyService(): IPropertyService {
  if (useMockServices()) {
    return mockProperties;
  }
  return propertyService; // API real
}
```

## 🔌 Integración con Backend

### Estado Actual: MOCK
- Todos los datos se almacenan en `localStorage`
- Servicios MOCK en `lib/*/mock-*.ts`
- Sin dependencia de backend

### Migración a API Real
1. Configurar `NEXT_PUBLIC_API_URL`
2. Establecer `NEXT_PUBLIC_USE_MOCK_SERVICES=false`
3. Implementar servicios en `lib/api/services/`
4. El factory automáticamente usará servicios reales

### Cliente API
`lib/api/client.ts` proporciona:
- Manejo de autenticación (tokens)
- Manejo de errores centralizado
- Tipos TypeScript para requests/responses

## 🎨 Sistema de Diseño

### Componentes UI
Basado en [shadcn/ui](https://ui.shadcn.com/):
- Componentes accesibles
- Personalizables con Tailwind
- TypeScript nativo

### Estilos
- **Tailwind CSS**: Utilidades y diseño responsive
- **CSS Variables**: Colores y temas
- **DM Sans**: Fuente principal (Google Fonts)

## 📦 Gestión de Estado

### Local State
- `useState` para estado local de componentes
- `useReducer` para estado complejo (si es necesario)

### Global State
- `AuthContext` para autenticación
- `localStorage` para persistencia (MOCK)

### Server State (Futuro)
Cuando se integre con API real:
- Considerar React Query o SWR
- Cache y sincronización automática

## 🔒 Seguridad

### Cliente
- Validación de inputs con Zod
- Sanitización de datos antes de mostrar
- Protección de rutas (redirección si no autenticado)

### Autenticación
- Tokens almacenados en `localStorage` (MOCK)
- En producción: tokens en httpOnly cookies
- Validación de permisos en rutas protegidas

## 🚀 Performance

### Optimizaciones Implementadas
- Next.js Image para imágenes optimizadas
- Code splitting automático (Next.js)
- Skeleton loaders para mejor UX
- Lazy loading de componentes pesados

### Futuras Optimizaciones
- React.memo para componentes pesados
- useMemo/useCallback donde sea necesario
- Bundle analysis y optimización

## 📝 Convenciones de Código

### Nombres de Archivos
- Componentes: `PascalCase.tsx`
- Utilidades: `camelCase.ts`
- Tests: `*.test.ts` o `__tests__/*.test.ts`

### Estructura de Componentes
```typescript
// 1. Imports
import { ... } from '...';

// 2. Types/Interfaces
interface Props { ... }

// 3. Component
export function Component({ ... }: Props) {
  // 4. Hooks
  // 5. Handlers
  // 6. Render
  return (...);
}
```

### Imports
- Orden: React → Next.js → Librerías → Internos
- Usar barrel exports cuando sea posible
- Evitar imports circulares

## 🧪 Testing

### Estructura
- Tests unitarios en `__tests__/` o `*.test.ts`
- Configuración en `jest.config.js`
- Setup en `jest.setup.js`

### Cobertura
- Objetivo: >80% de cobertura
- Enfoque en servicios y lógica de negocio
- Tests de componentes para funcionalidad crítica

## 📚 Recursos

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [shadcn/ui](https://ui.shadcn.com)

---

**Última actualización**: $(date)







