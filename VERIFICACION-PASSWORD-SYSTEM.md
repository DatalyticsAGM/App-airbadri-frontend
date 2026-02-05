# 🔐 Verificación del Sistema de Contraseñas

**Fecha**: 05/02/2026  
**Estado**: ✅ Frontend implementado y listo para pruebas

---

## 📋 Resumen del Sistema

El sistema de gestión de contraseñas incluye 3 flujos principales:

1. **Recuperación de contraseña (Forgot Password)**
   - Usuario olvidó su contraseña
   - Solicita enlace de recuperación por email
   - Ruta: `/auth/forgot-password`

2. **Reseteo de contraseña (Reset Password)**
   - Usuario hace click en enlace del email
   - Ingresa nueva contraseña con token
   - Ruta: `/auth/reset-password?token=...`

3. **Cambio de contraseña (Change Password)**
   - Usuario autenticado actualiza su contraseña
   - Requiere contraseña actual para validación
   - Ruta: `/auth/change-password`

---

## ✅ Estado de Implementación

### Frontend (100% Completo)

| Componente | Estado | Archivo |
|------------|--------|---------|
| Formulario Forgot Password | ✅ | `components/auth/forgot-password-form.tsx` |
| Formulario Reset Password | ✅ | `components/auth/reset-password-form.tsx` |
| Formulario Change Password | ✅ | `components/auth/change-password-form.tsx` |
| Página Forgot Password | ✅ | `app/auth/forgot-password/page.tsx` |
| Página Reset Password | ✅ | `app/auth/reset-password/page.tsx` |
| Página Change Password | ✅ | `app/auth/change-password/page.tsx` |
| AuthContext Methods | ✅ | `lib/auth/auth-context.tsx` |
| Auth Service | ✅ | `lib/api/services/auth-service.ts` |

### Backend (Requiere verificación)

| Endpoint | Estado | Descripción |
|----------|--------|-------------|
| `POST /api/auth/forgot-password` | ⚠️ Verificar | Solicitar recuperación |
| `GET /api/auth/reset-password/validate` | ⚠️ Verificar | Validar token |
| `POST /api/auth/reset-password` | ⚠️ Verificar | Resetear contraseña |
| `POST /api/auth/change-password` | ⚠️ Verificar | Cambiar contraseña |

---

## 🧪 Guía de Pruebas Manuales

### Prueba 1: Forgot Password (Solicitar recuperación)

```bash
# 1. Iniciar el servidor
npm run dev

# 2. Abrir navegador en:
http://localhost:3000/auth/forgot-password
```

**Pasos:**
1. Ingresar email: `administrador@example.com`
2. Click en "Enviar instrucciones"
3. **Verificar**: Mensaje de éxito aparece
4. **Verificar en DevTools**: Network tab muestra `POST /api/auth/forgot-password`
5. **Verificar en Backend**: Logs muestran request recibido

**Resultado esperado:**
```json
{
  "success": true,
  "message": "Email de recuperación enviado"
}
```

---

### Prueba 2: Reset Password (Con token)

**Prerrequisito**: Obtener un token del backend o logs

```bash
# URL de ejemplo:
http://localhost:3000/auth/reset-password?token=ABC123XYZ
```

**Pasos:**
1. Navegar a la URL con token
2. **Verificar**: El sistema valida el token automáticamente
3. Si válido: Muestra formulario
4. Si inválido: Muestra mensaje de error con link a forgot-password
5. Ingresar nueva contraseña: `nueva123`
6. Confirmar contraseña: `nueva123`
7. Click en "Actualizar contraseña"
8. **Verificar**: Mensaje de éxito y redirección a login
9. **Verificar en DevTools**: 
   - `GET /api/auth/reset-password/validate?token=...`
   - `POST /api/auth/reset-password`

**Resultado esperado:**
```json
{
  "success": true
}
```

**Prueba adicional:**
- Intentar login con la nueva contraseña
- Debe funcionar correctamente

---

### Prueba 3: Change Password (Usuario autenticado)

**Prerrequisito**: Estar logueado

```bash
# 1. Login primero
http://localhost:3000/auth/login
# Email: administrador@example.com
# Password: 123456

# 2. Ir a cambiar contraseña
http://localhost:3000/auth/change-password
```

**Pasos:**
1. Ingresar contraseña actual: `123456`
2. Ingresar nueva contraseña: `nueva456`
3. Confirmar nueva contraseña: `nueva456`
4. Click en "Cambiar contraseña"
5. **Verificar**: Mensaje de éxito aparece
6. **Verificar en DevTools**: `POST /api/auth/change-password` con header `Authorization: Bearer TOKEN`
7. Cerrar sesión
8. Intentar login con nueva contraseña: `nueva456`
9. **Verificar**: Login exitoso

**Resultado esperado:**
```json
{
  "success": true
}
```

---

## 🐛 Casos de Error a Probar

### Error 1: Token inválido o expirado

```bash
http://localhost:3000/auth/reset-password?token=INVALIDO123
```

**Resultado esperado:**
- Mensaje: "Token no válido. Por favor, solicita un nuevo enlace de recuperación."
- Link visible a `/auth/forgot-password`

---

### Error 2: Email no existente (Forgot Password)

**Pasos:**
1. Ir a `/auth/forgot-password`
2. Ingresar email inexistente: `noexiste@example.com`
3. Click en "Enviar instrucciones"

**Resultado esperado:**
- Mensaje genérico: "Si el email existe, recibirás instrucciones..."
- *Nota*: Por seguridad, no debe revelar si el email existe o no

---

### Error 3: Contraseña actual incorrecta (Change Password)

**Pasos:**
1. Estar logueado
2. Ir a `/auth/change-password`
3. Ingresar contraseña actual incorrecta: `wrong123`
4. Ingresar nueva contraseña: `nueva789`
5. Click en "Cambiar contraseña"

**Resultado esperado:**
- Mensaje de error: "Contraseña actual incorrecta" o similar
- Contraseña NO debe cambiar en el backend

---

### Error 4: Contraseñas no coinciden

**Aplica a**: Reset Password y Change Password

**Pasos:**
1. Ingresar contraseña: `password1`
2. Confirmar contraseña: `password2` (diferente)
3. Intentar submit

**Resultado esperado:**
- Error de validación: "Las contraseñas no coinciden"
- Botón de submit deshabilitado o error visible

---

### Error 5: Contraseña muy corta

**Pasos:**
1. Ingresar contraseña: `123` (menos de 6 caracteres)
2. Intentar submit

**Resultado esperado:**
- Error de validación: "La contraseña debe tener al menos 6 caracteres"

---

## 🔍 Verificación en DevTools

### 1. Network Tab

**Forgot Password:**
```
POST http://localhost:3000/api/auth/forgot-password
Request: { email: "administrador@example.com" }
Response: { success: true }
```

**Reset Password:**
```
GET http://localhost:3000/api/auth/reset-password/validate?token=ABC123
Response: { valid: true }

POST http://localhost:3000/api/auth/reset-password
Request: { token: "ABC123", password: "nueva123" }
Response: { success: true }
```

**Change Password:**
```
POST http://localhost:3000/api/auth/change-password
Headers: { Authorization: "Bearer eyJhbGc..." }
Request: { currentPassword: "123456", password: "nueva456" }
Response: { success: true }
```

---

### 2. Console Tab

**Sin errores esperados:**
- No debe haber errores 401 (si hay, revisar token)
- No debe haber errores 500 (si hay, revisar backend)

**Errores aceptables:**
- 404 si algún endpoint no está implementado en el backend
- Se debe mostrar mensaje de error apropiado en la UI

---

## 📝 Checklist de Verificación Completa

### Frontend
- [ ] Página `/auth/forgot-password` carga correctamente
- [ ] Página `/auth/reset-password` carga correctamente
- [ ] Página `/auth/change-password` requiere autenticación
- [ ] Formularios validan campos correctamente
- [ ] Mensajes de error son claros y útiles
- [ ] Mensajes de éxito aparecen al completar acciones
- [ ] Redirecciones funcionan después de éxito
- [ ] No hay errores en consola del navegador

### Backend (Verificar con equipo backend)
- [ ] Endpoint `POST /api/auth/forgot-password` implementado
- [ ] Endpoint `GET /api/auth/reset-password/validate` implementado
- [ ] Endpoint `POST /api/auth/reset-password` implementado
- [ ] Endpoint `POST /api/auth/change-password` implementado
- [ ] Tokens de recuperación tienen expiración (1 hora recomendado)
- [ ] Contraseñas se hashean antes de guardar en MongoDB
- [ ] Validación de contraseña actual funciona
- [ ] Sistema de emails configurado (o logs en desarrollo)

### Integración
- [ ] Frontend envía requests correctos al backend
- [ ] Backend responde con formato esperado por frontend
- [ ] Errores del backend se manejan gracefully en frontend
- [ ] Contraseñas cambian efectivamente en MongoDB
- [ ] Login funciona con contraseña actualizada

---

## 🚀 Scripts de Prueba Rápida

### Probar con curl (Backend)

```bash
# 1. Forgot Password
curl -X POST http://localhost:3333/api/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email":"administrador@example.com"}'

# 2. Validate Token
curl http://localhost:3333/api/auth/reset-password/validate?token=TOKEN_AQUI

# 3. Reset Password
curl -X POST http://localhost:3333/api/auth/reset-password \
  -H "Content-Type: application/json" \
  -d '{"token":"TOKEN_AQUI","password":"nueva123"}'

# 4. Change Password (requiere token de autenticación)
curl -X POST http://localhost:3333/api/auth/change-password \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN_DE_AUTH" \
  -d '{"currentPassword":"123456","password":"nueva456"}'
```

---

## 📧 Configuración de Emails (Desarrollo)

Para desarrollo, el backend puede usar una de estas estrategias:

### Opción 1: Logs en consola
```javascript
// backend/services/email.js
console.log('🔑 Token de recuperación:', token);
console.log('🔗 URL:', `http://localhost:3000/auth/reset-password?token=${token}`);
```

### Opción 2: MailHog (Servidor SMTP de prueba)
```bash
# Instalar MailHog
docker run -d -p 1025:1025 -p 8025:8025 mailhog/mailhog

# Ver emails en: http://localhost:8025
```

### Opción 3: Mailtrap (Servicio online gratuito)
```javascript
// backend/.env
SMTP_HOST=sandbox.smtp.mailtrap.io
SMTP_PORT=2525
SMTP_USER=tu_usuario
SMTP_PASS=tu_password
```

---

## 🎯 Criterios de Éxito

El sistema está **100% funcional** cuando:

1. ✅ Usuario puede solicitar recuperación y recibe confirmación
2. ✅ Token se valida antes de mostrar formulario de reset
3. ✅ Contraseña se actualiza en MongoDB correctamente
4. ✅ Login funciona con la nueva contraseña
5. ✅ Usuario autenticado puede cambiar su contraseña
6. ✅ Todos los casos de error muestran mensajes apropiados
7. ✅ No hay errores críticos en consola

---

## 📞 Soporte

Si encuentras problemas:

1. **Revisar**: `Milestone-8.md` para instrucciones detalladas
2. **Verificar**: Logs del backend para ver requests
3. **Inspeccionar**: DevTools > Network para ver respuestas
4. **Documentar**: Errores encontrados con screenshots y logs

---

## 🔗 Referencias

- **Milestone 8**: `Milestone-8.md`
- **Auth Service**: `lib/api/services/auth-service.ts`
- **Auth Context**: `lib/auth/auth-context.tsx`
- **Componentes**: `components/auth/*password*.tsx`
- **Páginas**: `app/auth/*/page.tsx`
