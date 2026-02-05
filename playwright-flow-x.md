# Reporte: Flujo de Login (Playwright) — playwright-flow-x.md

## Resumen Ejecutivo

Revisión del flujo de login en `http://localhost:3000/auth/login` con credenciales `administrador@example.com` / `123456`.

**Estado de Playwright MCP:** El servidor MCP no está conectado en esta sesión de Cursor. Los navegadores están instalados en tu sistema pero no son accesibles desde el sandbox de Cursor.

**Acción requerida:** Ejecutar la revisión manualmente desde tu terminal (PowerShell/CMD) o configurar Playwright MCP correctamente.

---

## Cambios realizados en esta revisión

1. **Redirección tras login**  
   En `components/auth/login-form.tsx` se cambió la redirección tras login exitoso de **`/`** a **`/host/dashboard`**, para que el usuario vaya al dashboard después de iniciar sesión.

2. **Tests E2E existentes**  
   Los tests en `tests/e2e/login-flow.spec.ts` ya cubren:
   - Mostrar la página de login (URL, título, campos, botón).
   - Login correcto y redirección sin bucles (acepta `/` o `/host/dashboard`).
   - Que tras login exitoso la app no redirija de vuelta a login.

---

## Flujo revisado (paso a paso)

| Paso | Acción | Verificación |
|------|--------|--------------|
| 1 | Visitar `http://localhost:3000/auth/login` | URL contiene `/auth/login`, se ve el formulario |
| 2 | Comprobar página de login | Heading "Bienvenido de vuelta", placeholder email, campo contraseña, botón "Iniciar sesión" |
| 3 | Rellenar email: `administrador@example.com` | Campo email rellenado |
| 4 | Rellenar password: `123456` | Campo contraseña rellenado |
| 5 | Click en "Iniciar sesión" | Formulario enviado, sin errores de consola |
| 6 | Login correcto | Respuesta 200 del backend, token guardado, usuario en contexto |
| 7 | Redirección al dashboard | Navegación a `/host/dashboard` (ya implementada en el código) |
| 8 | Sin bucles | No hay redirecciones repetidas a `/auth/login` tras el éxito |

---

## Cómo ejecutar la revisión

### ⚠️ IMPORTANTE: Problema detectado con el sandbox de Cursor

Los navegadores de Playwright están instalados en tu sistema, pero **Cursor ejecuta comandos en un sandbox** que busca los navegadores en una ubicación temporal diferente:

```
C:\Users\Usuario\AppData\Local\Temp\cursor-sandbox-cache\...\playwright\chromium_headless_shell-1208\
```

**Solución:** Ejecuta los tests **directamente desde tu terminal** (PowerShell/CMD), NO desde Cursor.

### Opción A: Tests E2E (Playwright) - RECOMENDADO ✅

**Desde PowerShell o CMD (NO desde Cursor):**

1. **Navegar al proyecto**  
   ```powershell
   cd "c:\Users\Usuario\Downloads\PROYECTOS\project-bolt-sb1-ciesfkjc\Fronted_airbnb"
   ```

2. **Verificar que los navegadores están instalados**  
   ```powershell
   npx playwright install --dry-run
   ```
   Si dice que faltan navegadores:
   ```powershell
   npx playwright install
   ```

3. **Levantar frontend y backend**  
   - Frontend: `http://localhost:3000` (ej. `npm run dev` en otra terminal).  
   - Backend: URL configurada en `NEXT_PUBLIC_API_URL` (ej. `http://localhost:3333`), con usuario `administrador@example.com` y contraseña `123456`.

4. **Ejecutar el flujo de login**  
   ```powershell
   npx playwright test tests/e2e/login-flow.spec.ts
   ```

5. **Ver resultado detallado**  
   ```powershell
   npx playwright show-report
   ```

**Resultado esperado:**
```
✓ debe mostrar la página de login
✓ login correcto y redirección sin bucles
✓ tras login exitoso la app no debe redirigir de vuelta a login

3 passed (X.Xs)
```

### Opción B: Playwright MCP en Cursor (Configuración pendiente)

**Estado actual:** El servidor Playwright MCP no está conectado en esta sesión.

**Pasos para configurar Playwright MCP:**

1. **Verificar configuración en `C:\Users\Usuario\.cursor\mcp.json`:**
   ```json
   {
     "mcpServers": {
       "playwright": {
         "command": "npx",
         "args": ["-y", "@playwright/mcp@latest"]
       }
     }
   }
   ```
   ✅ **Configuración correcta detectada.**

2. **Reconectar el servidor MCP:**
   - Ve a **Settings → Features → Model Context Protocol** en Cursor
   - Busca el servidor "playwright" en la lista
   - Si aparece con error o desconectado, haz click en "Disconnect" y luego en "Connect"
   - Si no aparece, verifica que `mcp.json` esté guardado y reinicia Cursor completamente

3. **Verificar que las herramientas están disponibles:**
   - En un nuevo chat, escribe: "Lista las herramientas MCP disponibles"
   - Deberías ver: `browser_navigate`, `browser_click`, `browser_type`, `browser_snapshot`, `browser_console_messages`

4. **Usar Playwright MCP para revisar el flujo:**
   - Con la app en `http://localhost:3000`, pide:  
   *"Usa Playwright MCP para hacer el flujo de login en http://localhost:3000/auth/login con administrador@example.com y 123456, revisar redirección al dashboard y consola."*

**Nota:** Si Playwright MCP sigue sin conectarse, es posible que necesites:
- Instalar Node.js globalmente (no solo en el proyecto)
- Verificar que `npx` funciona desde cualquier ubicación en tu terminal
- Revisar los logs de MCP en **Settings → Features → Model Context Protocol → View Logs**

### Opción C: Revisión manual con DevTools del navegador

Si prefieres revisar el flujo manualmente (sin tests automatizados):

1. **Abrir DevTools**
   - Abre Chrome/Edge y navega a `http://localhost:3000/auth/login`
   - Presiona `F12` para abrir DevTools
   - Ve a la pestaña **Network** y marca "Preserve log"
   - Ve a la pestaña **Console** (deja ambas pestañas visibles)

2. **Revisar el flujo paso a paso**
   
   | Paso | Acción | Qué verificar |
   |------|--------|---------------|
   | 1 | URL en barra de direcciones | Debe ser `http://localhost:3000/auth/login` |
   | 2 | Página cargada | Título "Bienvenido de vuelta", formulario visible |
   | 3 | Rellenar email | `administrador@example.com` |
   | 4 | Rellenar password | `123456` |
   | 5 | Click en "Iniciar sesión" | En Network: `POST /auth/login` → 200 OK, respuesta con `token` |
   | 6 | Redirección | URL cambia a `http://localhost:3000/host/dashboard` |
   | 7 | Sin bucles | No vuelves a `/auth/login` automáticamente |
   | 8 | Console limpia | Sin errores rojos (401, 500, etc.) |

3. **Verificar en Network (pestaña Network de DevTools)**
   - `POST http://localhost:XXXX/auth/login` → Status 200
   - Respuesta JSON con `token` y `user`
   - `GET http://localhost:XXXX/auth/me` → Status 200 (tras login)
   - Si ves 401 en `/auth/me`, el token no se está enviando correctamente

4. **Verificar en Console (pestaña Console de DevTools)**
   - No debe haber errores como:
     - `Failed to fetch`
     - `401 Unauthorized`
     - `NetworkError`
     - `Cannot read property ... of undefined`

---

## Verificación de bucles

- El test **"login correcto y redirección sin bucles"** registra las navegaciones (`framenavigated`) y comprueba que no haya más de 2 visitas a `/auth/login` en el flujo (evita bucles de redirección).
- En código: tras `router.push('/host/dashboard')` y `router.refresh()`, no debe existir lógica que, para usuarios autenticados, redirija de nuevo a `/auth/login` salvo en logout o error 401 explícito (p. ej. en `auth-context` o middleware).

Si detectas bucle en manual o en MCP:
- Revisar **consola del navegador** (errores JS o 401 en `GET /auth/me`).
- Revisar que el token se envíe en `Authorization` y que el backend acepte el token tras el login.

---

## Posibles problemas y soluciones

| Problema | Síntoma | Dónde revisar | Solución |
|----------|---------|--------------|----------|
| **Login falla con mensaje de error en pantalla** | "Error al iniciar sesión" visible | DevTools → Network: `POST /auth/login` | • Verificar que el backend está corriendo<br>• Comprobar `NEXT_PUBLIC_API_URL` en `.env.local`<br>• Verificar que las credenciales existen en la BD<br>• Revisar respuesta del POST (debería ser 200 con `token`) |
| **Bucle a `/auth/login` tras login exitoso** | URL cambia a dashboard pero vuelve a login | DevTools → Console + Network: `GET /auth/me` | • Si `/auth/me` devuelve 401, el token no se está enviando<br>• Verificar que el header `Authorization: Bearer <token>` se envía<br>• Revisar que `lib/api/client.ts` incluye el token en todas las peticiones<br>• Verificar que el token no expira inmediatamente |
| **No redirige a dashboard** | Se queda en `/auth/login` tras submit | Código: `components/auth/login-form.tsx` | • Verificar que usa `router.push('/host/dashboard')` en `if (result.success)`<br>• Comprobar que `result.success === true` en el login |
| **Test E2E falla por selectores** | Error "element not found" | Código: `tests/e2e/login-flow.spec.ts` | • Ajustar selectores según la UI actual:<br>  - `getByPlaceholder('tu@email.com')`<br>  - `getByRole('button', { name: /iniciar sesión/i })`<br>  - `getByRole('heading', { name: /bienvenido/i })` |
| **401 Unauthorized en console** | Error rojo en Console | DevTools → Console + Network | • Token no válido o expirado<br>• Backend no acepta el token<br>• Header `Authorization` mal formado |
| **CORS error** | "blocked by CORS policy" | DevTools → Console | • Backend debe permitir origen `http://localhost:3000`<br>• Verificar configuración de CORS en backend |
| **Red error / Failed to fetch** | "NetworkError" o "fetch failed" | DevTools → Console + Network | • Backend no está corriendo<br>• URL incorrecta en `NEXT_PUBLIC_API_URL`<br>• Firewall bloqueando la conexión |

---

## Archivos relevantes

- **`components/auth/login-form.tsx`** — Formulario de login; redirección a `/host/dashboard` tras éxito.
- **`tests/e2e/login-flow.spec.ts`** — Tests E2E del flujo de login (página, login + redirección, no bucles).
- **`playwright.config.ts`** — Configuración de Playwright (`baseURL: http://localhost:3000`).

---

## Script de ejecución rápida

Creé un script de PowerShell que ejecuta todos los pasos automáticamente:

**Uso:**

1. Abre PowerShell en la raíz del proyecto
2. Ejecuta:
   ```powershell
   .\test-login-flow.ps1
   ```

El script:
- ✅ Verifica que la app esté corriendo en `http://localhost:3000`
- 🧪 Ejecuta los 3 tests del flujo de login
- 📊 Muestra un resumen con los resultados
- 🔍 Sugiere causas si algo falla

## Checklist de revisión

- [x] Redirección tras login configurada a `/host/dashboard`.
- [ ] Página de login carga en `http://localhost:3000/auth/login`.
- [ ] Credenciales `administrador@example.com` / `123456` permiten iniciar sesión (backend respondiendo).
- [ ] Tras login exitoso hay redirección a `/host/dashboard`.
- [ ] No hay bucle: la app no vuelve a `/auth/login` tras un login correcto.
- [ ] Consola del navegador sin errores críticos durante el flujo.

**Para completar el checklist:**

1. Ejecuta `.\test-login-flow.ps1` desde PowerShell
2. O ejecuta `npx playwright test tests/e2e/login-flow.spec.ts` desde tu terminal
3. Si todos los tests pasan (✅ 3 passed), marca todos los ítems como completados

---

## Interpretación de resultados

### ✅ Si todos los tests pasan (3 passed)

```
✓ debe mostrar la página de login
✓ login correcto y redirección sin bucles
✓ tras login exitoso la app no debe redirigir de vuelta a login

3 passed (X.Xs)
```

**Significa que:**
- ✅ La página de login carga correctamente
- ✅ El login con `administrador@example.com` / `123456` funciona
- ✅ Redirección a `/host/dashboard` exitosa
- ✅ No hay bucles de redirección
- ✅ Flujo de login está funcionando correctamente

**Próximos pasos:**
- El flujo de login está completamente funcional
- Puedes proceder con otros flujos (crear propiedad, hacer booking, etc.)
- Opcional: Añadir más tests E2E para otros flujos críticos

### ❌ Si algún test falla

```
✓ debe mostrar la página de login
✗ login correcto y redirección sin bucles
✗ tras login exitoso la app no debe redirigir de vuelta a login

1 passed, 2 failed (X.Xs)
```

**Pasos a seguir:**

1. **Ver el reporte detallado**
   ```powershell
   npx playwright show-report
   ```

2. **Revisar la tabla de problemas** (arriba en este documento)

3. **Revisar manualmente con DevTools** (Opción C)
   - Abre `http://localhost:3000/auth/login` con F12
   - Sigue el flujo paso a paso
   - Anota los errores en Console y Network

4. **Reportar el problema**
   - Captura de pantalla del error
   - Screenshot de DevTools (Console + Network)
   - Mensaje de error exacto

---

## Uso de Playwright MCP (una vez configurado)

Cuando Playwright MCP esté conectado correctamente, podrás pedirme:

**Ejemplo de prompt:**

> "Usa Playwright MCP para revisar el flujo de login:
> 1. Navega a http://localhost:3000/auth/login
> 2. Rellena administrador@example.com y 123456
> 3. Haz click en Iniciar sesión
> 4. Verifica que redirige a /host/dashboard
> 5. Muéstrame los mensajes de console"

**Qué podrás ver:**
- Capturas del árbol de accesibilidad de cada página
- Cada acción (click, type, navigate) en tiempo real
- Mensajes de la consola del navegador
- Errores de red o JavaScript
- Estado de la página tras cada acción

**Ventajas sobre tests automatizados:**
- Interactivo: puedes pedirme que pruebe cosas específicas
- Visual: ves snapshots del estado de la página
- Flexible: no necesitas escribir tests, solo describes lo que quieres probar
- Depuración: puedo revisar la consola y red en cualquier paso

---

## Archivos generados/modificados en esta revisión

| Archivo | Tipo | Descripción |
|---------|------|-------------|
| `playwright-flow-x.md` | 📄 Reporte | Este documento con instrucciones y resultados |
| `test-login-flow.ps1` | 🔧 Script | Script de PowerShell para ejecutar el test fácilmente |
| `components/auth/login-form.tsx` | ✏️ Modificado | Redirección cambiada de `/` a `/host/dashboard` |
| `tests/e2e/login-flow.spec.ts` | 🧪 Test E2E | Tests del flujo de login (creado previamente) |
| `playwright.config.ts` | ⚙️ Config | Configuración de Playwright (creado previamente) |

---

## Resumen final

**Estado actual:**
- ✅ Código de redirección actualizado a `/host/dashboard`
- ✅ Tests E2E creados y listos para ejecutar
- ✅ Script de PowerShell para ejecución rápida
- ⚠️ Playwright MCP no conectado (requiere configuración manual)
- ⚠️ Tests no ejecutados desde Cursor (problema de sandbox)

**Acción requerida:**
1. **Ejecutar el test desde tu terminal** (PowerShell/CMD):
   ```powershell
   cd "c:\Users\Usuario\Downloads\PROYECTOS\project-bolt-sb1-ciesfkjc\Fronted_airbnb"
   .\test-login-flow.ps1
   ```

2. **O ejecutar manualmente:**
   ```powershell
   npx playwright test tests/e2e/login-flow.spec.ts
   ```

3. **Reportar los resultados:**
   - Si pasan todos: ✅ Flujo funcionando
   - Si fallan: enviar captura del error y logs de consola

**Para usar Playwright MCP:**
- Verificar configuración en Settings → Features → Model Context Protocol
- Reconectar el servidor "playwright" si está desconectado
- En un nuevo chat, pedir revisar el flujo con MCP
