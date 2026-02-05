# Reporte - Auth Module (Integración Backend)

## Checklist de integración

- [ ] **Backend reachable**: el backend responde en `http://localhost:3333`
- [ ] **Base URL configurada**: `NEXT_PUBLIC_API_URL="http://localhost:3333/api"`
- [ ] **Registro (Register)**
  - [ ] Endpoint: `POST /auth/register` (baseURL incluye `/api`)
  - [ ] Request body: `{ fullName, email, password }`
  - [ ] Response incluye `success`
  - [ ] Response incluye `user` (mínimo: `id`, `email`, `fullName`, `createdAt`)
  - [ ] Response incluye `token` (si existe, se guarda en `localStorage` como `auth_token`)
- [ ] **Sesión (Me)**
  - [ ] Endpoint: `GET /auth/me`
  - [ ] Header: `Authorization: Bearer {token}`
  - [ ] Si el token es inválido, se retorna error y la UI debe tratarlo como sesión expirada
- [ ] **Login**
  - [ ] Endpoint: `POST /auth/login`
  - [ ] Response incluye `token` (si existe, se guarda como `auth_token`)
- [ ] **Logout**
  - [ ] Endpoint: `POST /auth/logout`
  - [ ] Al finalizar, el frontend limpia `auth_token`

## Decisiones técnicas tomadas (mínimas)

- **Fuente de verdad del endpoint de registro**: el cURL compartido usa `POST /api/auth/register`, por lo tanto el frontend quedó alineado a `POST /auth/register` con `NEXT_PUBLIC_API_URL="http://localhost:3333/api"`.
- **Punto único de integración**: `lib/auth/auth-context.tsx` consume `getAuthService()` para evitar integrar API directamente en páginas o componentes.
- **Fuente de configuración**: `NEXT_PUBLIC_API_URL` define el backend a consumir.

## Archivos tocados / puntos clave

- `lib/api/client.ts`: cliente HTTP base (headers, token, errores).
- `lib/api/services/auth-service.ts`: integración real de Auth (incluye `register` vía `signup()`).
- `lib/api/service-factory.ts`: activa `authService` cuando hay API real configurada.
- `lib/auth/auth-context.tsx`: ahora usa el service vía factory.

## Prueba rápida (manual) con cURL

```bash
curl --location 'http://localhost:3333/api/auth/register' \
--header 'Content-Type: application/json' \
--data-raw '{
  "fullName": "María García",
  "email": "maria@example.com",
  "password": "secret123"
}'
```

