# Reporte: Flujo de Login (Playwright)

## Resumen

Se añadió un flujo E2E con **Playwright** para revisar el login en `http://localhost:3000/auth/login`, usando las credenciales indicadas y comprobando redirección y ausencia de bucles.

---

## Playwright MCP en Cursor (navegar / click / rellenar)

Se ha **actualizado el MCP** para usar el servidor oficial de Microsoft, que expone herramientas de automatización del navegador (navigate, click, type, snapshot, console).

### Qué se ha cambiado

- **Archivo:** `C:\Users\Usuario\.cursor\mcp.json`
- **Antes:** `@executeautomation/playwright-mcp-server` (solo recurso de consola).
- **Ahora:** `@playwright/mcp@latest` (herramientas: `browser_navigate`, `browser_click`, `browser_type`, `browser_snapshot`, `browser_fill_form`, `browser_console_messages`, etc.).

### Qué tienes que hacer para ver el flujo paso a paso

1. **Reiniciar Cursor** (o en **Settings → MCP** recargar/desconectar y volver a conectar el servidor "playwright"), para que se carguen las nuevas herramientas.
2. Asegurarte de que la app corre en **http://localhost:3000** y el backend en el puerto que uses (ej. 3333).
3. En un **nuevo chat**, pedir algo como:  
   *"Usa Playwright MCP para hacer el flujo de login: ir a http://localhost:3000/auth/login, rellenar administrador@example.com y 123456, hacer click en Iniciar sesión, y revisar redirección y consola."*

El agente podrá entonces usar en vivo:

| Paso | Herramienta MCP | Qué verás |
|------|-----------------|-----------|
| 1 | `browser_navigate` | Navegación a `/auth/login` |
| 2 | `browser_snapshot` | Árbol de accesibilidad de la página (formulario, campos, botón) |
| 3 | `browser_type` (o `browser_fill_form`) | Rellenar email y contraseña |
| 4 | `browser_click` | Click en "Iniciar sesión" |
| 5 | `browser_snapshot` | Página tras el login (home o dashboard) |
| 6 | `browser_console_messages` | Errores o avisos en consola |

Si el navegador no está instalado, el MCP puede pedir ejecutar `browser_install` (o `npx playwright install` en tu máquina) una vez.

---

## Alcance del flujo

| Paso | Descripción |
|------|-------------|
| 1 | Visitar `http://localhost:3000/auth/login` |
| 2 | Comprobar que se muestra la página de login (título "Bienvenido de vuelta", campo email, contraseña, botón "Iniciar sesión") |
| 3 | Rellenar email: `administrador@example.com` y password: `123456` |
| 4 | Enviar el formulario |
| 5 | **Login correcto**: verificar que la app redirige y no permanece en `/auth/login` en bucle |
| 6 | **Redirección**: actualmente la app redirige a **`/` (home)**. Si se desea redirigir a **dashboard** (`/host/dashboard`), hay que cambiar `router.push('/')` por `router.push('/host/dashboard')` en `components/auth/login-form.tsx` |
| 7 | **Bucles**: el test comprueba que no existan múltiples redirecciones de vuelta a `/auth/login` tras un login exitoso |

---

## Archivos creados/modificados

- **`playwright.config.ts`**  
  Configuración de Playwright: `baseURL: http://localhost:3000`, proyecto Chromium, timeouts 30s.

- **`tests/e2e/login-flow.spec.ts`**  
  Tres casos:
  1. **debe mostrar la página de login**: URL `/auth/login`, heading "Bienvenido de vuelta", placeholder email, botón "Iniciar sesión".
  2. **login correcto y redirección sin bucles**: rellena credenciales, envía, espera salir de `/auth/login`; comprueba que no hay bucle de redirecciones a login; si sale de login, verifica que la URL sea `/` o `/host/dashboard`.
  3. **tras login exitoso la app no debe redirigir de vuelta a login**: tras submit, espera navegación o mensaje de error; si la URL ya no es login, comprueba que tras `networkidle` no se vuelve a `/auth/login`.

- **`package.json`**  
  Scripts añadidos: `test:e2e` y `test:e2e:ui`.

---

## Cómo ejecutar los tests (en tu máquina)

1. **Instalar navegadores de Playwright (solo una vez)**  
   En la raíz del proyecto:
   ```bash
   npx playwright install
   ```

2. **Tener la app y el backend en marcha**  
   - Frontend: `http://localhost:3000` (por ejemplo `npm run dev`).
   - Backend: según tu API (ej. `http://localhost:3333`) para que el login sea exitoso con `administrador@example.com` / `123456`.

3. **Lanzar los tests E2E**  
   ```bash
   npm run test:e2e
   ```
   Solo login:
   ```bash
   npx playwright test tests/e2e/login-flow.spec.ts
   ```

4. **Modo UI (opcional)**  
   ```bash
   npm run test:e2e:ui
   ```

---

## Resultado de la ejecución en este entorno

Los tests **no se ejecutaron** en el entorno de Cursor porque los binarios de Playwright (Chromium) no están instalados aquí. El error fue:

```text
Executable doesn't exist at ...\playwright\chromium_headless_shell-1208\...
npx playwright install
```

Por tanto, **debes ejecutar los tests en tu equipo** después de `npx playwright install` y con la app y el backend levantados.

---

## Verificación manual / Playwright MCP

- Puedes revisar el mismo flujo a mano en `http://localhost:3000/auth/login` con las credenciales indicadas.
- Si usas **Playwright MCP** en Cursor, puedes abrir la URL, rellenar y enviar el formulario desde el agente y revisar en **Browser console logs** (recurso `console://logs`) si aparecen errores de consola (p. ej. 401, fallos de red o JavaScript).

---

## Posibles problemas y soluciones

| Problema | Revisar | Solución |
|----------|--------|----------|
| Login falla (error en pantalla) | Backend encendido y URL correcta (`NEXT_PUBLIC_API_URL`) | Verificar que `POST /auth/login` responda 200 con `token` y que el usuario exista con esa contraseña. |
| Redirección a login en bucle | Consola del navegador; llamada a `GET /auth/me` | Si `GET /auth/me` devuelve 401, el contexto puede limpiar el usuario y redirigir otra vez a login. Revisar que el token se envíe en `Authorization` y que el backend acepte el token. |
| Test falla por selectores | Cambios en textos o estructura del formulario | Ajustar en `tests/e2e/login-flow.spec.ts` los `getByPlaceholder`, `getByRole('button', { name: ... })` y `getByRole('heading', ...)` para que coincidan con la UI actual. |

---

## Redirección a dashboard

Hoy el login redirige a **`/`**. Para que redirija a **`/host/dashboard`**:

1. Abre `components/auth/login-form.tsx`.
2. Sustituye `router.push('/')` por `router.push('/host/dashboard')` dentro del `if (result.success)` (y opcionalmente `router.refresh()` después).

Los tests E2E ya consideran válido tanto `/` como `/host/dashboard` como destino tras login exitoso.

---

## Checklist de revisión

- [ ] Página de login carga en `http://localhost:3000/auth/login`.
- [ ] Credenciales `administrador@example.com` / `123456` permiten iniciar sesión (backend respondiendo).
- [ ] Tras login exitoso hay redirección (a `/` o a `/host/dashboard`).
- [ ] No hay bucle: la app no vuelve a `/auth/login` tras un login correcto.
- [ ] Consola del navegador sin errores críticos durante el flujo (revisar con Playwright MCP si se usa).
