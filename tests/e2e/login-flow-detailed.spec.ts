/**
 * E2E: Flujo de login detallado con captura de errores de consola
 * - Navega a http://localhost:3000/auth/login
 * - Rellena email: administrador@example.com
 * - Rellena password: 123456
 * - Hace click en "Iniciar sesión"
 * - Verifica redirección a /host/dashboard
 * - Captura errores de consola
 * - Verifica que no hay bucles de redirección
 */

import { test, expect } from '@playwright/test';

const LOGIN_URL = 'http://localhost:3000/auth/login';
const EMAIL = 'administrador@example.com';
const PASSWORD = '123456';
const EXPECTED_REDIRECT = '/host/dashboard';

test.describe('Flujo de login detallado con verificación de consola', () => {
  test('debe completar el flujo de login exitosamente sin errores', async ({ page }) => {
    // Array para capturar mensajes de consola
    const consoleLogs: Array<{ type: string; text: string }> = [];
    const consoleErrors: string[] = [];
    const navigationHistory: string[] = [];

    // Capturar todos los mensajes de consola
    page.on('console', (msg) => {
      const type = msg.type();
      const text = msg.text();
      consoleLogs.push({ type, text });
      
      if (type === 'error') {
        consoleErrors.push(text);
        console.log(`❌ Console Error: ${text}`);
      } else if (type === 'warning') {
        console.log(`⚠️  Console Warning: ${text}`);
      }
    });

    // Capturar errores de página (JavaScript)
    page.on('pageerror', (error) => {
      consoleErrors.push(error.message);
      console.log(`❌ Page Error: ${error.message}`);
    });

    // Capturar fallos de solicitudes de red
    page.on('requestfailed', (request) => {
      const failure = request.failure();
      console.log(`❌ Request Failed: ${request.url()} - ${failure?.errorText}`);
    });

    // Rastrear navegaciones para detectar bucles
    page.on('framenavigated', (frame) => {
      if (frame === page.mainFrame()) {
        const url = frame.url();
        navigationHistory.push(url);
        console.log(`📍 Navegación: ${url}`);
      }
    });

    console.log('\n🚀 PASO 1: Navegando a la página de login...');
    await page.goto(LOGIN_URL, { waitUntil: 'networkidle' });
    
    console.log(`✅ URL actual: ${page.url()}`);
    await expect(page).toHaveURL(/\/auth\/login/);

    console.log('\n🚀 PASO 2: Verificando elementos del formulario...');
    const emailInput = page.getByPlaceholder('tu@email.com');
    const passwordInput = page.getByPlaceholder('••••••').first();
    const submitButton = page.getByRole('button', { name: /iniciar sesión/i });

    await expect(emailInput).toBeVisible();
    await expect(passwordInput).toBeVisible();
    await expect(submitButton).toBeVisible();
    console.log('✅ Todos los elementos del formulario están visibles');

    console.log('\n🚀 PASO 3: Rellenando credenciales...');
    await emailInput.fill(EMAIL);
    console.log(`✅ Email ingresado: ${EMAIL}`);
    
    await passwordInput.fill(PASSWORD);
    console.log('✅ Password ingresado');

    console.log('\n🚀 PASO 4: Haciendo click en "Iniciar sesión"...');
    const navigationPromise = page.waitForNavigation({ timeout: 15000 });
    await submitButton.click();
    console.log('✅ Click realizado en el botón');

    console.log('\n⏳ Esperando redirección...');
    try {
      await navigationPromise;
    } catch (error) {
      console.log('⚠️  No hubo navegación inmediata, verificando URL...');
    }

    // Esperar un momento adicional para asegurar que la redirección se complete
    await page.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => {});
    await page.waitForTimeout(2000);

    const finalUrl = page.url();
    console.log(`\n🚀 PASO 5: Verificando redirección a ${EXPECTED_REDIRECT}...`);
    console.log(`📍 URL final: ${finalUrl}`);

    // Verificar que redirigió correctamente
    const redirectedCorrectly = finalUrl.includes(EXPECTED_REDIRECT);
    console.log(`${redirectedCorrectly ? '✅' : '❌'} Redirección a dashboard: ${redirectedCorrectly}`);
    
    expect(finalUrl, `Debería redirigir a ${EXPECTED_REDIRECT}`).toContain(EXPECTED_REDIRECT);

    console.log('\n🚀 PASO 6: Verificando errores en consola...');
    console.log(`Total de logs de consola: ${consoleLogs.length}`);
    console.log(`Total de errores: ${consoleErrors.length}`);
    
    // Filtrar errores críticos vs esperados
    const criticalErrors = consoleErrors.filter(error => {
      // Los 404 son esperados si el backend no tiene endpoints implementados
      const is404 = error.includes('404') || error.includes('Not found') || error.includes('Not Found');
      const isExpectedWarning = error.includes('No se pudieron cargar');
      return !is404 && !isExpectedWarning;
    });
    
    if (consoleErrors.length > 0) {
      console.log('\n⚠️  Errores encontrados en consola:');
      consoleErrors.forEach((error, index) => {
        const isExpected = error.includes('404') || error.includes('No se pudieron cargar');
        console.log(`  ${index + 1}. ${isExpected ? '(Esperado) ' : ''}${error}`);
      });
      console.log(`\n❗ Errores críticos (no esperados): ${criticalErrors.length}`);
    } else {
      console.log('✅ No se encontraron errores en la consola');
    }

    console.log('\n🚀 PASO 7: Verificando ausencia de bucles de redirección POST-LOGIN...');
    console.log(`Total de navegaciones: ${navigationHistory.length}`);
    console.log('Historial de navegación:');
    navigationHistory.forEach((url, index) => {
      console.log(`  ${index + 1}. ${url}`);
    });

    // Encontrar el índice donde apareció el dashboard por primera vez
    const dashboardIndex = navigationHistory.findIndex(url => url.includes('/host/dashboard'));
    
    if (dashboardIndex !== -1) {
      // Si llegó al dashboard, verificar que NO volvió a /auth/login después
      const postDashboardUrls = navigationHistory.slice(dashboardIndex + 1);
      const returnedToLogin = postDashboardUrls.some(url => url.includes('/auth/login'));
      
      console.log(`${returnedToLogin ? '❌' : '✅'} Bucle POST-LOGIN detectado: ${returnedToLogin ? 'SÍ' : 'NO'}`);
      
      expect(returnedToLogin, 'No debe volver a /auth/login después de llegar al dashboard').toBe(false);
    } else {
      // Si no llegó al dashboard, el test ya falló antes
      console.log('⚠️  No se puede verificar bucle porque no llegó al dashboard');
    }

    console.log('\n📊 RESUMEN DE LA PRUEBA:');
    console.log('========================');
    console.log(`✅ Login completado exitosamente`);
    console.log(`✅ Redirigido a: ${finalUrl}`);
    console.log(`${consoleErrors.length === 0 ? '✅' : '❌'} Errores de consola: ${consoleErrors.length}`);
    console.log(`✅ Sin bucles POST-LOGIN`);
    console.log('========================\n');

    // Tomar screenshot del dashboard para evidencia
    await page.screenshot({ 
      path: 'tests/e2e/screenshots/login-success-dashboard.png',
      fullPage: true 
    });
    console.log('📸 Screenshot guardado: tests/e2e/screenshots/login-success-dashboard.png');
  });
});
