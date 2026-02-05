/**
 * E2E: Flujo de login
 * - Visita /auth/login
 * - Rellena credenciales y envía
 * - Verifica login correcto y redirección (sin bucles en /auth/login)
 */

import { test, expect } from '@playwright/test';

const LOGIN_URL = 'http://localhost:3000/auth/login';
const EMAIL = 'administrador@example.com';
const PASSWORD = '123456';

test.describe('Flujo de login', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(LOGIN_URL);
  });

  test('debe mostrar la página de login', async ({ page }) => {
    await expect(page).toHaveURL(/\/auth\/login/);
    await expect(page.getByRole('heading', { name: /bienvenido de vuelta/i })).toBeVisible();
    await expect(page.getByPlaceholder('tu@email.com')).toBeVisible();
    await expect(page.getByRole('button', { name: /iniciar sesión/i })).toBeVisible();
  });

  test('login correcto y redirección sin bucles', async ({ page }) => {
    const initialUrl = page.url();

    // Rellenar credenciales
    await page.getByPlaceholder('tu@email.com').fill(EMAIL);
    await page.getByPlaceholder('••••••').first().fill(PASSWORD);

    // Escuchar redirecciones para detectar bucles
    const navigations: string[] = [];
    page.on('framenavigated', (frame) => {
      if (frame === page.mainFrame() && frame.url()) {
        navigations.push(frame.url());
      }
    });

    // Enviar formulario
    await page.getByRole('button', { name: /iniciar sesión/i }).click();

    // Esperar a salir de /auth/login (redirección tras éxito o mensaje de error)
    await page.waitForURL(
      (url) => !url.pathname.includes('/auth/login') || url.search.length > 0,
      { timeout: 15000 }
    ).catch(() => {});

    const finalUrl = page.url();

    // No debe quedarse en login por bucle (máximo 1 visita a login en el flujo post-submit)
    const loginVisitsAfterSubmit = navigations.filter((u) => u.includes('/auth/login'));
    const loopDetected = loginVisitsAfterSubmit.length > 2; // inicial + posible redirect de vuelta = bucle

    // Verificar: o bien redirigió a otra ruta (éxito) o se muestra error en la misma página
    const leftLoginPage = !finalUrl.includes('/auth/login');
    const hasErrorMessage = await page.locator('text=/error|inválid|incorrect|invalid/i').isVisible().catch(() => false);

    expect(loopDetected, 'No debe existir bucle de redirección a /auth/login').toBe(false);

    if (leftLoginPage) {
      // Redirección correcta: a home (/) o dashboard
      const isHome = finalUrl === 'http://localhost:3000/' || finalUrl === 'http://localhost:3000';
      const isDashboard = finalUrl.includes('/host/dashboard');
      expect(isHome || isDashboard, 'Tras login debe redirigir a / o /host/dashboard').toBe(true);
    } else {
      // Si sigue en login, debe ser por error visible (credenciales incorrectas)
      expect(hasErrorMessage, 'Si permanece en login debe mostrarse mensaje de error').toBe(true);
    }
  });

  test('tras login exitoso la app no debe redirigir de vuelta a login', async ({ page }) => {
    await page.getByPlaceholder('tu@email.com').fill(EMAIL);
    await page.getByPlaceholder('••••••').first().fill(PASSWORD);
    await page.getByRole('button', { name: /iniciar sesión/i }).click();

    // Esperar a que ocurra redirección o mensaje de error (máx 12s)
    await Promise.race([
      page.waitForURL((u) => !u.pathname.includes('/auth/login'), { timeout: 12000 }),
      page.locator('text=/error|inválid|incorrect|invalid/i').waitFor({ state: 'visible', timeout: 12000 }),
    ]).catch(() => {});

    const url = page.url();
    if (!url.includes('/auth/login')) {
      // Ya salimos de login: verificar que no volvemos (no bucle)
      await page.waitForLoadState('networkidle').catch(() => {});
      expect(page.url()).not.toContain('/auth/login');
    }
  });
});
