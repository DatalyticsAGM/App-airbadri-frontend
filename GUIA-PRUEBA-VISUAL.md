# 📸 Guía de Prueba Visual: Reset Password + MongoDB

**Estado actual**: ⚠️ Servicios no están corriendo  
**Para probar**: Necesitas iniciar Frontend (3000) y Backend (3333)

---

## 🚀 Inicio Rápido

### Terminal 1: Backend (Puerto 3333)
```bash
cd tu-proyecto-backend
npm run dev
# O: node server.js

# Deberías ver algo como:
# ✓ Server running on port 3333
# ✓ MongoDB connected successfully
```

### Terminal 2: Frontend (Puerto 3000)
```bash
cd Fronted_airbnb
npm run dev

# Deberías ver:
# ✓ Ready on http://localhost:3000
```

### Terminal 3: Ejecutar Test
```bash
cd Fronted_airbnb
powershell -ExecutionPolicy Bypass -File test-reset-password.ps1
```

---

## 📋 Qué Verás en Cada Paso

### Paso 1: Página de Reset Password

**URL de prueba:**
```
http://localhost:3000/reset-password?token=9adc272038f4d6c43a5ee97222e3f0bd0487c3685c3f5de119718f337905736f
```

**Pantalla esperada (Token válido):**

```
┌─────────────────────────────────────────────────┐
│  🏠 Adribnb                                     │
├─────────────────────────────────────────────────┤
│                                                 │
│  Restablecer contraseña                         │
│  Ingresa tu nueva contraseña.                   │
│  Será guardada de forma segura en la BD.        │
│                                                 │
│  ┌───────────────────────────────────────────┐ │
│  │ 🔒 Conexión segura                        │ │
│  │ Tu contraseña será encriptada y guardada  │ │
│  │ en MongoDB (puerto 3333)                  │ │
│  └───────────────────────────────────────────┘ │
│                                                 │
│  Nueva contraseña                               │
│  ┌───────────────────────────────────────────┐ │
│  │ Mínimo 6 caracteres                       │ │
│  └───────────────────────────────────────────┘ │
│                                                 │
│  Confirmar nueva contraseña                     │
│  ┌───────────────────────────────────────────┐ │
│  │ Repite tu contraseña                      │ │
│  └───────────────────────────────────────────┘ │
│                                                 │
│  ┌───────────────────────────────────────────┐ │
│  │      Restablecer contraseña               │ │
│  └───────────────────────────────────────────┘ │
│                                                 │
│  Volver al inicio de sesión                     │
└─────────────────────────────────────────────────┘
```

**Pantalla esperada (Validando):**

```
┌─────────────────────────────────────────────────┐
│                                                 │
│  Restablecer contraseña                         │
│                                                 │
│  ┌───────────────────────────────────────────┐ │
│  │ ⟳ Validando token con el servidor...     │ │
│  └───────────────────────────────────────────┘ │
│                                                 │
└─────────────────────────────────────────────────┘
```

**Pantalla esperada (Token inválido):**

```
┌─────────────────────────────────────────────────┐
│                                                 │
│  Restablecer contraseña                         │
│                                                 │
│  ┌───────────────────────────────────────────┐ │
│  │ ❌ Token inválido o expirado              │ │
│  │                                           │ │
│  │ El enlace de recuperación no es válido    │ │
│  │ o ya expiró. Por favor, solicita un       │ │
│  │ nuevo enlace.                              │ │
│  └───────────────────────────────────────────┘ │
│                                                 │
│  Solicitar nuevo enlace de recuperación        │
│                                                 │
└─────────────────────────────────────────────────┘
```

---

### Paso 2: Llenar Formulario

**Acciones:**
1. Nueva contraseña: `nueva123`
2. Confirmar: `nueva123`
3. Click en "Restablecer contraseña"

**Pantalla durante procesamiento:**

```
┌─────────────────────────────────────────────────┐
│  Nueva contraseña                               │
│  ┌───────────────────────────────────────────┐ │
│  │ ••••••••                                  │ │
│  └───────────────────────────────────────────┘ │
│                                                 │
│  Confirmar nueva contraseña                     │
│  ┌───────────────────────────────────────────┐ │
│  │ ••••••••                                  │ │
│  └───────────────────────────────────────────┘ │
│                                                 │
│  ┌───────────────────────────────────────────┐ │
│  │ ⟳ Actualizando en MongoDB...             │ │
│  └───────────────────────────────────────────┘ │
└─────────────────────────────────────────────────┘
```

---

### Paso 3: Éxito

**Pantalla de éxito:**

```
┌─────────────────────────────────────────────────┐
│  ┌───────────────────────────────────────────┐ │
│  │ ✅ ¡Contraseña actualizada correctamente! │ │
│  │                                           │ │
│  │ Tu contraseña ha sido guardada en la      │ │
│  │ base de datos. Redirigiendo al login...   │ │
│  └───────────────────────────────────────────┘ │
│                                                 │
│  ┌───────────────────────────────────────────┐ │
│  │ ✓ Contraseña actualizada                  │ │
│  └───────────────────────────────────────────┘ │
└─────────────────────────────────────────────────┘

(Después de 2 segundos, redirige a /auth/login)
```

---

### Paso 4: DevTools (Network Tab)

**Requests que deberías ver:**

#### Request 1: Validar Token
```
GET http://localhost:3333/api/auth/reset-password/validate?token=9adc272...

Request Headers:
  Content-Type: application/json

Response (200 OK):
{
  "valid": true
}

O si es inválido:
{
  "valid": false,
  "message": "Token no válido o expirado"
}
```

#### Request 2: Reset Password
```
POST http://localhost:3333/api/auth/reset-password

Request Headers:
  Content-Type: application/json

Request Body:
{
  "token": "9adc272038f4d6c43a5ee97222e3f0bd0487c3685c3f5de119718f337905736f",
  "password": "nueva123"
}

Response (200 OK):
{
  "success": true
}

O si hay error:
{
  "success": false,
  "error": "Token inválido o expirado"
}
```

---

### Paso 5: Verificar en MongoDB

**Opción 1: MongoDB Compass**
```
1. Conectar a: mongodb://localhost:27017
2. Base de datos: tu_base_de_datos
3. Colección: users
4. Buscar:
   Filter: { "email": "administrador@example.com" }
5. Ver campo "password":
   Antes:  $2b$10$OLD_HASH_HERE...
   Después: $2b$10$NEW_HASH_HERE... ✅ CAMBIÓ
```

**Opción 2: Mongo Shell**
```javascript
mongo
use tu_base_de_datos

// Buscar usuario
db.users.findOne(
  { email: "administrador@example.com" },
  { email: 1, password: 1 }
)

// Output:
{
  "_id": ObjectId("..."),
  "email": "administrador@example.com",
  "password": "$2b$10$NUEVO_HASH_DIFERENTE"  // ✅ Hash nuevo
}
```

**Opción 3: Logs del Backend**
```
Backend debería mostrar:
✓ Token validated for user: administrador@example.com
✓ Password hashed: $2b$10$...
✓ Password updated in MongoDB
✓ User saved successfully
```

---

### Paso 6: Probar Login

**Ir a:**
```
http://localhost:3000/auth/login
```

**Credenciales:**
```
Email: administrador@example.com
Password: nueva123  ← LA NUEVA CONTRASEÑA
```

**Resultado esperado:**
```
✅ Login exitoso
✅ Redirige a /host/dashboard
✅ Usuario está autenticado
```

---

## 🔍 Casos de Error - Qué Verás

### Error 1: Backend no está corriendo

**En DevTools > Console:**
```javascript
❌ Failed to fetch
❌ net::ERR_CONNECTION_REFUSED
```

**En la página:**
```
❌ Error al validar el token
```

**Solución:**
```bash
# Iniciar backend en puerto 3333
cd backend
npm run dev
```

---

### Error 2: Token expirado

**En DevTools > Network:**
```
GET /api/auth/reset-password/validate?token=...
Response: { "valid": false, "message": "Token expirado" }
```

**En la página:**
```
┌───────────────────────────────────────────┐
│ ❌ Token inválido o expirado              │
│                                           │
│ El enlace de recuperación no es válido    │
│ o ya expiró. Por favor, solicita un       │
│ nuevo enlace.                              │
└───────────────────────────────────────────┘

Solicitar nuevo enlace de recuperación
```

**Solución:**
```
1. Ir a: http://localhost:3000/auth/forgot-password
2. Solicitar nuevo enlace
3. Usar el nuevo token
```

---

### Error 3: Contraseñas no coinciden

**En la página:**
```
Nueva contraseña: password1
Confirmar: password2  ← Diferente

❌ Las contraseñas no coinciden
```

**Botón "Restablecer" está deshabilitado**

---

### Error 4: Contraseña muy corta

**En la página:**
```
Nueva contraseña: 123  ← Solo 3 caracteres

❌ La contraseña debe tener al menos 6 caracteres
```

---

## 📊 Checklist de Verificación

Marca cada ítem cuando lo verifiques:

### Antes de Probar
- [ ] Backend corriendo en puerto 3333
- [ ] Frontend corriendo en puerto 3000
- [ ] MongoDB conectado al backend
- [ ] Tienes un token válido para probar

### Durante la Prueba
- [ ] Página carga en `/reset-password?token=...`
- [ ] Aparece "Validando token con el servidor..."
- [ ] DevTools muestra request a `/validate?token=...`
- [ ] Si token válido: muestra formulario
- [ ] Si token inválido: muestra error
- [ ] Mensaje "MongoDB (puerto 3333)" visible
- [ ] Campos de contraseña funcionan
- [ ] Validación de contraseñas funciona
- [ ] Submit envía request a `/reset-password`
- [ ] DevTools muestra request POST con token y password
- [ ] Mensaje de éxito aparece
- [ ] Botón cambia a "✓ Contraseña actualizada"
- [ ] Redirige a login después de 2 segundos

### Después de la Prueba
- [ ] Verificado en MongoDB que hash cambió
- [ ] Login funciona con nueva contraseña
- [ ] Usuario puede acceder a su cuenta
- [ ] Token se invalidó (no se puede usar de nuevo)

---

## 🎯 Resultado Esperado Final

Si todo funciona correctamente:

1. ✅ **Validación**: Token se valida con MongoDB (puerto 3333)
2. ✅ **Formulario**: Se muestra solo si token es válido
3. ✅ **Seguridad**: Info de MongoDB visible para el usuario
4. ✅ **Procesamiento**: Request POST a backend con token y password
5. ✅ **MongoDB**: Contraseña actualizada con bcrypt hash
6. ✅ **Confirmación**: Mensaje de éxito + redirección
7. ✅ **Login**: Funciona con la nueva contraseña

---

## 🚀 Script de Prueba Automatizado

Ya tienes un script PowerShell para automatizar las pruebas:

```bash
powershell -ExecutionPolicy Bypass -File test-reset-password.ps1
```

Este script verifica:
- ✅ Servicios están corriendo
- ✅ Endpoints responden correctamente
- ✅ Configuración es correcta
- ✅ Página carga correctamente

---

## 📞 Si Algo No Funciona

### Backend no responde:
```bash
# Verificar puerto
netstat -ano | findstr :3333

# Iniciar backend
cd backend
npm run dev
```

### Frontend no carga página:
```bash
# Verificar que el archivo existe
ls app/reset-password/page.tsx

# Si no existe, fue creado en esta sesión
```

### MongoDB no conecta:
```bash
# Verificar MongoDB está corriendo
mongo --version

# Verificar conexión en logs del backend
# Debe mostrar: "MongoDB connected"
```

---

## 📝 Documentación Adicional

- **Guía completa**: `VERIFICACION-RESET-PASSWORD-MONGODB.md`
- **Milestone**: `Milestone-8.md`
- **Código fuente**: `app/reset-password/page.tsx`
- **Configuración**: `lib/config.ts`
