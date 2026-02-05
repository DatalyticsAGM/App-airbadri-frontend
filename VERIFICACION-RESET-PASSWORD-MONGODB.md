# 🔐 Verificación: Reset Password con MongoDB

**Ruta**: `http://localhost:3000/reset-password?token=...`  
**Backend**: `http://localhost:3333/api`  
**Base de datos**: MongoDB en puerto 3333

---

## 🎯 Objetivo

Verificar que el flujo de reset password funciona correctamente y que la contraseña se actualiza en MongoDB cuando un usuario restablece su contraseña usando el token de recuperación.

---

## ✅ Requisitos Previos

### 1. Backend en ejecución
```bash
# El backend debe estar corriendo en puerto 3333
# Verifica con:
curl http://localhost:3333/api/health
# O abre en navegador: http://localhost:3333/api
```

### 2. MongoDB conectado
```bash
# El backend debe tener conexión a MongoDB
# Verifica en logs del backend que aparezca:
# "MongoDB connected successfully" o similar
```

### 3. Frontend en ejecución
```bash
# Terminal 1: Backend (puerto 3333)
npm run dev  # o node server.js

# Terminal 2: Frontend (puerto 3000)
npm run dev
```

---

## 🧪 Prueba Paso a Paso

### Paso 1: Solicitar recuperación de contraseña

```bash
# 1. Ir a la página de forgot password
http://localhost:3000/auth/forgot-password

# 2. Ingresar email de prueba
Email: administrador@example.com

# 3. Click en "Enviar instrucciones"
```

**Verificar:**
- ✅ Aparece mensaje de éxito
- ✅ DevTools > Network muestra: `POST http://localhost:3333/api/auth/forgot-password`
- ✅ Response: `{ success: true }`

**Obtener token:**
```bash
# Opción 1: Revisar logs del backend
# El backend debe mostrar algo como:
# "Reset token generated: 9adc272038f4d6c43a5ee97222e3f0bd0487c3685c3f5de119718f337905736f"

# Opción 2: Revisar email (si está configurado)
# Copiar el token del enlace del email

# Opción 3: Consultar MongoDB directamente
# db.users.findOne({ email: "administrador@example.com" })
# Buscar campo: resetPasswordToken
```

---

### Paso 2: Abrir página de reset password con token

```bash
# Usar el token obtenido en Paso 1
http://localhost:3000/reset-password?token=9adc272038f4d6c43a5ee97222e3f0bd0487c3685c3f5de119718f337905736f
```

**Verificar (inmediatamente al cargar):**

1. **Mensaje de validación aparece**:
   ```
   "Validando token con el servidor..."
   ```

2. **Request de validación en DevTools > Network**:
   ```
   GET http://localhost:3333/api/auth/reset-password/validate?token=9adc...
   
   Response esperada:
   { "valid": true }
   
   O si el token expiró:
   { "valid": false, "message": "Token expirado" }
   ```

3. **Si token válido**:
   - ✅ Muestra formulario con 2 campos de contraseña
   - ✅ Muestra mensaje azul: "🔒 Conexión segura - Tu contraseña será encriptada y guardada en MongoDB (puerto 3333)"
   - ✅ Botón "Restablecer contraseña" está habilitado

4. **Si token inválido o expirado**:
   - ❌ Muestra error rojo: "Token inválido o expirado"
   - ❌ Muestra link: "Solicitar nuevo enlace de recuperación"
   - ❌ NO muestra formulario

---

### Paso 3: Ingresar nueva contraseña

**En el formulario:**
```
Nueva contraseña: nueva123
Confirmar nueva contraseña: nueva123
```

**Click en "Restablecer contraseña"**

---

### Paso 4: Verificar request al backend

**Abrir DevTools > Network:**

```http
POST http://localhost:3333/api/auth/reset-password

Request Headers:
Content-Type: application/json

Request Body:
{
  "token": "9adc272038f4d6c43a5ee97222e3f0bd0487c3685c3f5de119718f337905736f",
  "password": "nueva123"
}

Response esperada (éxito):
{
  "success": true
}

Response esperada (error):
{
  "success": false,
  "error": "Token inválido o expirado"
}
```

---

### Paso 5: Verificar mensaje de éxito

**Después de request exitoso:**

1. ✅ Aparece mensaje verde:
   ```
   ¡Contraseña actualizada correctamente!
   Tu contraseña ha sido guardada en la base de datos.
   Redirigiendo al login...
   ```

2. ✅ Botón cambia a: "✓ Contraseña actualizada" (deshabilitado)

3. ✅ Después de 2 segundos, redirige a: `http://localhost:3000/auth/login`

---

### Paso 6: Verificar en MongoDB

**Opción 1: Usando MongoDB Compass**
```
1. Conectar a: mongodb://localhost:27017
2. Seleccionar base de datos del proyecto
3. Colección: users
4. Buscar usuario: { email: "administrador@example.com" }
5. Ver campo "password"
6. ✅ Debe ser un hash diferente al anterior (bcrypt)
   Ejemplo: "$2b$10$xYz..."
```

**Opción 2: Usando mongo shell**
```bash
mongo

use tu_base_de_datos

db.users.findOne(
  { email: "administrador@example.com" },
  { password: 1, email: 1 }
)

# Output esperado:
{
  "_id": ObjectId("..."),
  "email": "administrador@example.com",
  "password": "$2b$10$NUEVO_HASH_DIFERENTE_AL_ANTERIOR"
}
```

**Opción 3: Desde backend logs**
```bash
# El backend debe mostrar en logs algo como:
# "Password updated for user: administrador@example.com"
# "New password hash: $2b$10$..."
```

---

### Paso 7: Probar login con nueva contraseña

```bash
# 1. Ir a login
http://localhost:3000/auth/login

# 2. Ingresar credenciales
Email: administrador@example.com
Password: nueva123  # <-- La nueva contraseña

# 3. Click en "Iniciar sesión"
```

**Verificar:**
- ✅ Login exitoso
- ✅ Redirige a `/host/dashboard` o página principal
- ✅ Usuario está autenticado

**Si el login falla:**
- ❌ La contraseña NO se actualizó en MongoDB
- ❌ Revisar logs del backend
- ❌ Verificar que el backend está hasheando la contraseña con bcrypt

---

## 🐛 Casos de Error a Probar

### Error 1: Token no proporcionado

```bash
# URL sin token
http://localhost:3000/reset-password
```

**Resultado esperado:**
- ❌ Mensaje: "Token inválido o expirado"
- ❌ Link a forgot-password visible
- ❌ NO muestra formulario

---

### Error 2: Token inválido

```bash
# Token inventado
http://localhost:3000/reset-password?token=INVALIDO123
```

**Verificar:**
1. Request de validación:
   ```
   GET http://localhost:3333/api/auth/reset-password/validate?token=INVALIDO123
   Response: { "valid": false }
   ```

2. Mensaje de error aparece
3. NO muestra formulario

---

### Error 3: Token expirado

```bash
# Usar un token que ya expiró (más de 1 hora)
http://localhost:3000/reset-password?token=TOKEN_EXPIRADO
```

**Resultado esperado:**
- ❌ Mensaje: "Token inválido o expirado"
- ❌ Backend response: `{ "valid": false, "message": "Token expirado" }`

---

### Error 4: Contraseñas no coinciden

**En el formulario:**
```
Nueva contraseña: password1
Confirmar: password2  # <-- Diferente
```

**Resultado esperado:**
- ❌ Error de validación: "Las contraseñas no coinciden"
- ❌ Botón de submit deshabilitado

---

### Error 5: Contraseña muy corta

**En el formulario:**
```
Nueva contraseña: 123  # <-- Menos de 6 caracteres
```

**Resultado esperado:**
- ❌ Error: "La contraseña debe tener al menos 6 caracteres"

---

### Error 6: Backend no disponible

**Simular:**
```bash
# Detener el backend (puerto 3333)
# Intentar resetear contraseña
```

**Resultado esperado:**
- ❌ Error de red en DevTools
- ❌ Mensaje: "Error al resetear contraseña. Intenta nuevamente."

---

## 📊 Checklist de Verificación Completa

### Frontend
- [ ] Página carga en `/reset-password?token=...`
- [ ] Token se valida automáticamente al cargar
- [ ] Muestra spinner mientras valida
- [ ] Muestra formulario si token válido
- [ ] Muestra error si token inválido
- [ ] Info de MongoDB visible ("puerto 3333")
- [ ] Validación de contraseñas funciona
- [ ] Submit envía request a backend correcto
- [ ] Mensaje de éxito aparece
- [ ] Redirige a login después de éxito

### Backend (puerto 3333)
- [ ] Endpoint `GET /api/auth/reset-password/validate` implementado
- [ ] Endpoint `POST /api/auth/reset-password` implementado
- [ ] Valida tokens correctamente
- [ ] Verifica expiración de tokens (1 hora recomendado)
- [ ] Hashea contraseña con bcrypt antes de guardar
- [ ] Actualiza en MongoDB correctamente
- [ ] Invalida token después de usarse (un solo uso)
- [ ] Responde con formato correcto: `{ success: boolean }`

### MongoDB
- [ ] Backend conectado a MongoDB correctamente
- [ ] Colección `users` existe
- [ ] Campo `password` se actualiza con nuevo hash
- [ ] Hash es diferente al anterior (bcrypt)
- [ ] Campo `resetPasswordToken` se limpia después de usar
- [ ] Campo `resetPasswordExpires` se limpia después de usar

### Integración
- [ ] Frontend envía requests a `http://localhost:3333/api`
- [ ] Backend recibe y procesa requests correctamente
- [ ] Contraseña se actualiza en MongoDB
- [ ] Login funciona con la nueva contraseña
- [ ] No hay errores en consola del navegador
- [ ] No hay errores en logs del backend

---

## 🔍 Debugging

### Si el token no se valida:

```bash
# 1. Verificar URL del backend en config
# Archivo: lib/config.ts
# Debe ser: http://localhost:3333/api

# 2. Verificar backend está corriendo
curl http://localhost:3333/api/auth/reset-password/validate?token=TEST

# 3. Revisar logs del backend
# Debe mostrar: "GET /api/auth/reset-password/validate?token=..."

# 4. Verificar token en MongoDB
db.users.findOne({ resetPasswordToken: "TOKEN_AQUI" })
```

---

### Si la contraseña no se actualiza:

```bash
# 1. Verificar request se envía
# DevTools > Network > POST /api/auth/reset-password
# Status debe ser 200

# 2. Verificar response del backend
# { "success": true } <- Debe ser true

# 3. Verificar logs del backend
# Debe mostrar: "Password updated for user: ..."

# 4. Verificar en MongoDB
db.users.findOne(
  { email: "administrador@example.com" },
  { password: 1 }
)
# El hash debe ser diferente

# 5. Verificar que backend usa bcrypt
# En código del backend debe haber:
const bcrypt = require('bcrypt');
const hashedPassword = await bcrypt.hash(password, 10);
```

---

### Si el login falla con nueva contraseña:

```bash
# Problema: La contraseña no se hasheó correctamente

# 1. Verificar que backend hashea al actualizar
# NO hacer: user.password = newPassword
# SÍ hacer: user.password = await bcrypt.hash(newPassword, 10)

# 2. Verificar que el login compara correctamente
# Debe usar: await bcrypt.compare(password, user.password)

# 3. Verificar en MongoDB que el hash cambió
# Hash antiguo: $2b$10$ABC...
# Hash nuevo: $2b$10$XYZ... <- DEBE SER DIFERENTE
```

---

## 📝 Endpoints del Backend Requeridos

### 1. Validar Token
```typescript
GET http://localhost:3333/api/auth/reset-password/validate?token=TOKEN

Response:
{
  "valid": true | false,
  "message"?: string
}
```

### 2. Resetear Contraseña
```typescript
POST http://localhost:3333/api/auth/reset-password

Body:
{
  "token": "9adc272038f4d6c43a5ee97222e3f0bd0487c3685c3f5de119718f337905736f",
  "password": "nueva123"
}

Response (éxito):
{
  "success": true
}

Response (error):
{
  "success": false,
  "error": "Token inválido o expirado"
}
```

---

## 🎯 Criterios de Éxito

La funcionalidad está **100% operativa** cuando:

1. ✅ Página carga correctamente con token en URL
2. ✅ Token se valida con backend (MongoDB puerto 3333)
3. ✅ Formulario aparece solo si token es válido
4. ✅ Nueva contraseña se envía al backend
5. ✅ Backend actualiza contraseña en MongoDB con bcrypt
6. ✅ Login funciona con la nueva contraseña
7. ✅ Mensajes de error apropiados en casos de fallo
8. ✅ No hay errores en consola ni en logs

---

## 📞 Soporte

**Archivos de referencia:**
- Página: `app/reset-password/page.tsx`
- Config: `lib/config.ts` (puerto 3333)
- Auth Service: `lib/api/services/auth-service.ts`
- Milestone: `Milestone-8.md`

**Documentación adicional:**
- `VERIFICACION-PASSWORD-SYSTEM.md` - Guía completa del sistema
- `RESUMEN-MILESTONE-8.md` - Resumen ejecutivo
