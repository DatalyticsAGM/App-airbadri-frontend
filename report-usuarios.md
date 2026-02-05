# Usuarios — Reporte de Integración

## Resumen
- Se eliminó persistencia local (localStorage) para funcionalidades que simulaban backend (Favoritos e Historial de búsqueda).
- Se consolidó el acceso a datos del usuario autenticado vía `AuthContext → AuthService → apiClient`.
- Se robusteció el consumo de listas del backend (respuestas envueltas tipo `{ data: [...] }`) para evitar errores en UI.

## Endpoints usados (REST)

### Autenticación / Usuario actual
- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/logout`
- `GET /auth/me`
- `POST /auth/forgot-password`
- `POST /auth/reset-password`
- `POST /auth/change-password`

### Perfil (actualización simple)
- `PATCH /users/me` (preferido)
- `PATCH /auth/me` (fallback)

### Reservas (para estadísticas en Profile/Dashboard)
- `GET /bookings?userId=:userId`
- `GET /bookings?propertyId=:propertyId`
- `GET /bookings/:id`
- `POST /bookings`
- `PATCH /bookings/:id`
- `POST /bookings/:id/cancel`
- `GET /bookings/availability?...`

### Propiedades (para estadísticas y búsqueda)
- `GET /properties`
- `GET /properties?hostId=:hostId`
- `GET /properties/:id`
- `POST /properties`
- `PATCH /properties/:id`
- `DELETE /properties/:id`
- `GET /properties/search?...`

### Favoritos (antes: localStorage)
- `GET /favorites?userId=:userId` (query opcional)
- `POST /favorites`
- `DELETE /favorites?userId=:userId&propertyId=:propertyId`
- `DELETE /favorites/:propertyId` (fallback)

### Historial de búsqueda (antes: localStorage)
- `POST /search-history`
- `GET /search-history?userId=:userId&limit=10`
- `DELETE /search-history/:id?userId=:userId`
- `DELETE /search-history?userId=:userId`

## Cambios en Frontend (archivos)
- `lib/api/services/auth-service.ts`
  - Normaliza `User` tolerando variantes comunes (`_id`, `name`, `created_at`, etc.).
  - `updateProfile()` con fallback entre `/users/me` y `/auth/me`.
- `lib/auth/auth-context.tsx`
  - Expone `updateProfile()` para evitar llamadas HTTP directas en componentes.
- `components/profile/avatar-upload.tsx`
  - Dejó de llamar HTTP directo y usa `updateProfile()`.
- `lib/api/services/property-service.ts`
  - Normaliza listas y shape de `Property` (incluye `location` string → objeto).
- `lib/api/services/booking-service.ts`
  - Normaliza listas y shape de `Booking`.
- `lib/favorites/favorites-service.ts`
  - Migrado a API real (sin localStorage).
- `lib/search/search-history-service.ts`
  - Migrado a API real (sin localStorage).
- `lib/search/autocomplete-service.ts`
  - Eliminó datos hardcodeados; sugerencias basadas en `GET /properties`.

## Tipos/Validaciones
- Tipos TS existentes: `lib/auth/types.ts`, `lib/properties/types.ts`, `lib/bookings/types.ts`.
- Validación runtime (mínima y tolerante): `lib/auth/schemas.ts` para `User` y respuesta de auth.

## Estados y Errores (DoD)
- Se evita que UI reviente por respuestas envueltas (ej: `{ data: [...] }`).
- Errores se registran con `console.error` y la UI mantiene degradación controlada (listas vacías).
- Sesión expirada: en `GET /auth/me`, un `401` limpia token para evitar estados inconsistentes.

## Riesgos y Next Steps
- Confirmar en `Postman-back` los endpoints exactos de:
  - Favoritos (`/favorites`) y
  - Historial (`/search-history`)
  y ajustar paths/payloads si el backend usa nombres distintos.

