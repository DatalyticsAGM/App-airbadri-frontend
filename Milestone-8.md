# Milestone 8: Sistema de Recuperación y Cambio de Contraseña

## Objetivo
Asegurar que el sistema completo de gestión de contraseñas funcione correctamente, incluyendo recuperación (forgot/reset) y cambio de contraseña para usuarios autenticados, con sincronización completa con el backend.

---

## Tareas

### ✅ Tarea 1: Verificar flujo de solicitud de recuperación de contraseña
**¿Qué hace?**
Prueba que un usuario pueda solicitar un enlace de recuperación desde `/auth/forgot-password` y que el backend reciba la petición correctamente.

**Pasos a verificar:**
- [ ] Navegar a `http://localhost:3000/auth/forgot-password`
- [ ] Ingresar un email válido (ejemplo: `administrador@example.com`)
- [ ] Verificar que aparece mensaje de éxito
- [ ] Verificar en consola del navegador o logs del backend que se recibió el request a `POST /api/auth/forgot-password`

**¿Por qué existe?**
Para asegurar que el usuario puede iniciar el proceso de recuperación y que el frontend se comunica correctamente con el backend.

---

### ✅ Tarea 2: Verificar validación y reseteo de contraseña con token (Ruta principal)
**¿Qué hace?**
Prueba que el sistema valida el token de recuperación y permite establecer una nueva contraseña que se guarda en MongoDB (puerto 3333).

**Pasos a verificar:**
- [ ] Obtener un token de recuperación (desde el backend o email de prueba)
- [ ] Navegar a `http://localhost:3000/reset-password?token=TOKEN_AQUI` (ruta principal)
- [ ] Verificar que aparece "Validando token con el servidor..." mientras se valida
- [ ] Verificar en DevTools > Network: `GET http://localhost:3333/api/auth/reset-password/validate?token=...`
- [ ] Si token válido: muestra el formulario con mensaje "Conexión segura" + info de MongoDB
- [ ] Si token inválido: muestra error con link a forgot-password
- [ ] Ingresar nueva contraseña: `nueva123` (dos veces)
- [ ] Click en "Restablecer contraseña"
- [ ] Verificar en DevTools > Network: `POST http://localhost:3333/api/auth/reset-password`
- [ ] Verificar mensaje de éxito: "Contraseña actualizada correctamente"
- [ ] Verificar en MongoDB (puerto 3333) que la contraseña cambió (debe estar hasheada)
- [ ] Intentar login con la nueva contraseña: debe funcionar ✅

**¿Por qué existe?**
Para asegurar que el token se valida con el backend en MongoDB (puerto 3333) y que la contraseña se actualiza correctamente en la base de datos.

---

### ✅ Tarea 3: Verificar cambio de contraseña para usuarios autenticados
**¿Qué hace?**
Prueba que un usuario logueado puede cambiar su contraseña desde su perfil y que el cambio se sincroniza con el backend.

**Pasos a verificar:**
- [ ] Iniciar sesión con `administrador@example.com` / `123456`
- [ ] Navegar a `http://localhost:3000/auth/change-password`
- [ ] Ingresar contraseña actual: `123456`
- [ ] Ingresar nueva contraseña: `nueva123` (dos veces)
- [ ] Verificar que se envía `POST /api/auth/change-password` al backend
- [ ] Cerrar sesión y hacer login con la nueva contraseña para confirmar
- [ ] Restaurar contraseña original si es necesario

**¿Por qué existe?**
Para que usuarios autenticados puedan actualizar su contraseña de forma segura desde su cuenta, sin necesitar el flujo de recuperación.

---

### ✅ Tarea 4: Verificar manejo de errores en todos los flujos
**¿Qué hace?**
Prueba que el sistema muestra mensajes de error apropiados cuando algo falla (token inválido, contraseña actual incorrecta, etc.).

**Casos a probar:**
- [ ] Token inválido o expirado en `/auth/reset-password?token=INVALIDO`
- [ ] Email no existente en forgot-password (debe mostrar mensaje genérico por seguridad)
- [ ] Contraseña actual incorrecta en change-password
- [ ] Contraseñas no coinciden en confirmación (reset y change)
- [ ] Contraseña muy corta (menos de 6 caracteres)

**¿Por qué existe?**
Para que el usuario reciba feedback claro cuando algo no funciona, mejorando la experiencia y evitando confusión.

---

### ✅ Tarea 5: Documentar endpoints requeridos del backend
**¿Qué hace?**
Documenta claramente qué endpoints del backend necesitan estar implementados y qué respuestas deben dar.

**Endpoints requeridos:**

```typescript
// 1. Solicitar recuperación de contraseña
POST /api/auth/forgot-password
Body: { email: string }
Response: { success: boolean, message?: string }

// 2. Validar token de recuperación
GET /api/auth/reset-password/validate?token=TOKEN
Response: { valid: boolean, message?: string }

// 3. Resetear contraseña con token
POST /api/auth/reset-password
Body: { token: string, password: string }
Response: { success: boolean, error?: string }

// 4. Cambiar contraseña (usuario autenticado)
POST /api/auth/change-password
Headers: { Authorization: "Bearer TOKEN" }
Body: { currentPassword: string, password: string }
Response: { success: boolean, error?: string }
```

**¿Por qué existe?**
Para que el equipo de backend sepa exactamente qué implementar y el frontend sepa qué esperar, asegurando compatibilidad.

---

## Criterios de Aceptación

El milestone está completo cuando:

1. ✅ Usuario puede solicitar recuperación y recibe confirmación
2. ✅ Token de recuperación se valida correctamente antes de mostrar formulario
3. ✅ Nueva contraseña se guarda en MongoDB y funciona para login
4. ✅ Usuario autenticado puede cambiar su contraseña desde perfil
5. ✅ Todos los casos de error muestran mensajes apropiados
6. ✅ Backend tiene endpoints documentados e implementados

---

## Notas de Implementación

### Frontend (Ya implementado)
- ✅ Componente `ForgotPasswordForm` en `components/auth/forgot-password-form.tsx`
- ✅ Componente `ResetPasswordForm` en `components/auth/reset-password-form.tsx`
- ✅ Componente `ChangePasswordForm` en `components/auth/change-password-form.tsx`
- ✅ Páginas en `app/auth/forgot-password/`, `app/auth/reset-password/`, `app/auth/change-password/`
- ✅ **NUEVA**: Página principal en `app/reset-password/page.tsx` (con validación integrada)
- ✅ Métodos en `AuthContext`: `forgotPassword()`, `resetPassword()`, `validateResetToken()`, `changePassword()`
- ✅ Servicios en `lib/api/services/auth-service.ts` conectados al backend
- ✅ API Client configurado con `baseURL: http://localhost:3333/api`

### Backend (Requerido)
- Implementar endpoints listados en Tarea 5
- Generar tokens seguros con expiración (recomendado: 1 hora)
- Enviar emails con enlaces de recuperación (o mostrar token en logs para desarrollo)
- Hashear contraseñas antes de guardar en MongoDB
- Validar contraseña actual antes de permitir cambio

---

## Testing Recomendado

```bash
# Test E2E manual
1. Abrir http://localhost:3000/auth/forgot-password
2. Seguir flujo completo de recuperación
3. Intentar login con nueva contraseña

# Test E2E con Playwright (futuro)
npx playwright test tests/e2e/password-recovery.spec.ts
```

---

## Dependencias
- Milestone 1-7 completados (sistema de autenticación base)
- Backend con MongoDB configurado
- Servicio de emails configurado (opcional para desarrollo)
