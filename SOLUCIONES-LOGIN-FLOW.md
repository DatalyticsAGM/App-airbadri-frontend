# 🔧 Soluciones Específicas: Problemas del Flujo de Login

**Fecha**: 05/02/2026  
**Basado en**: Análisis de código y test E2E

---

## 🔴 Problema 1: Bucle de Redirección en /auth/login

### 📍 Ubicación del problema

**Archivo**: `lib/auth/auth-context.tsx`  
**Líneas**: 57-59 y 64-74

```typescript
// lib/auth/auth-context.tsx
useEffect(() => {
  loadUser(); // ⚠️ Se ejecuta en CADA página, incluyendo /auth/login
}, []);

const loadUser = async () => {
  try {
    const currentUser = await authService.getCurrentUser(); // ⚠️ Causa 401 en login
    setUser(currentUser);
  } catch (error) {
    console.error('Error cargando usuario:', error); // ❌ Genera errores en consola
    setUser(null);
  } finally {
    setLoading(false);
  }
};
```

**Archivo**: `components/auth/login-form.tsx`  
**Líneas**: 68-69

```typescript
// components/auth/login-form.tsx
if (result.success) {
  router.push('/host/dashboard');
  router.refresh(); // ⚠️ Causa re-render que activa loadUser() de nuevo
}
```

### ✅ Solución: Optimizar carga del usuario

#### Opción 1: Verificar token antes de llamar al API (RECOMENDADA)

```typescript
// lib/auth/auth-context.tsx - líneas 57-74
useEffect(() => {
  loadUser();
}, []);

const loadUser = async () => {
  try {
    // ✅ Solo llamar al API si hay un token almacenado
    const token = localStorage.getItem('auth_token') || 
                  sessionStorage.getItem('auth_token') ||
                  document.cookie.includes('auth_token');
    
    if (!token) {
      // No hay token, no intentar cargar usuario
      setLoading(false);
      return;
    }

    // Solo hacer el request si hay token
    const currentUser = await authService.getCurrentUser();
    setUser(currentUser);
  } catch (error) {
    // Si falla la verificación, limpiar el usuario pero NO mostrar error
    setUser(null);
  } finally {
    setLoading(false);
  }
};
```

#### Opción 2: Usar try-catch sin console.error

```typescript
// lib/auth/auth-context.tsx - líneas 64-74
const loadUser = async () => {
  try {
    const currentUser = await authService.getCurrentUser();
    setUser(currentUser);
  } catch (error) {
    // ✅ NO mostrar error en consola, es esperado en rutas públicas
    setUser(null);
  } finally {
    setLoading(false);
  }
};
```

#### Opción 3: Remover router.refresh() después del login

```typescript
// components/auth/login-form.tsx - líneas 66-73
if (result.success) {
  // ✅ Solo hacer push, el AuthContext se actualizará automáticamente
  router.push('/host/dashboard');
  // ❌ REMOVER: router.refresh();
}
```

### 📊 Impacto esperado:

- ✅ Elimina el bucle de redirección en /auth/login
- ✅ Reduce llamadas innecesarias al API
- ✅ Mejora la experiencia de usuario (redirección más rápida)
- ✅ Limpia la consola del navegador

---

## 🟡 Problema 2: Errores 401 en Página de Login

### 📍 Ubicación del problema

El `AuthProvider` se monta en todas las páginas (incluyendo rutas públicas como `/auth/login`), y siempre intenta cargar el usuario actual aunque no haya sesión activa.

**Archivo**: `lib/auth/auth-context.tsx`  
**Líneas**: 57-74

### ✅ Solución: Validar existencia de token antes de llamar al API

Ya cubierto en la Solución del Problema 1, Opción 1.

**Código adicional**: Crear helper para verificar si hay token

```typescript
// lib/auth/auth-utils.ts (NUEVO ARCHIVO)
/**
 * Verifica si existe un token de autenticación almacenado
 * @returns true si existe un token, false en caso contrario
 */
export function hasAuthToken(): boolean {
  // Verificar en localStorage
  if (typeof window !== 'undefined' && localStorage.getItem('auth_token')) {
    return true;
  }
  
  // Verificar en cookies
  if (typeof document !== 'undefined' && document.cookie.includes('auth_token')) {
    return true;
  }
  
  return false;
}
```

Luego usarlo en `auth-context.tsx`:

```typescript
// lib/auth/auth-context.tsx
import { hasAuthToken } from './auth-utils';

const loadUser = async () => {
  try {
    // ✅ Solo llamar al API si hay token
    if (!hasAuthToken()) {
      setLoading(false);
      return;
    }

    const currentUser = await authService.getCurrentUser();
    setUser(currentUser);
  } catch (error) {
    setUser(null);
  } finally {
    setLoading(false);
  }
};
```

### 📊 Impacto esperado:

- ✅ Elimina errores 401 en rutas públicas
- ✅ Consola limpia sin errores innecesarios
- ✅ Mejor rendimiento (menos llamadas al API)

---

## 🔴 Problema 3: Dashboard sin Datos (Error 404)

### 📍 Ubicación del problema

**Archivo**: `app/host/dashboard/page.tsx`  
**Líneas**: 53, 65, 76

```typescript
// app/host/dashboard/page.tsx
const loadDashboardData = async () => {
  if (!user) return;

  setLoading(true);
  try {
    // ❌ Este endpoint probablemente no existe en el backend
    const hostPropertiesRaw = await propertyService.getPropertiesByHost(user.id);
    
    for (const property of hostProperties) {
      // ❌ Este endpoint probablemente no existe
      const bookings = await bookingService.getBookingsByProperty(property.id);
      
      // ❌ Este endpoint probablemente no existe  
      const reviews = await reviewService.getReviewsByProperty(property.id);
    }
  } catch (error) {
    console.error('Error loading dashboard data:', error);
  }
};
```

### ✅ Solución: Implementar endpoints en el backend O usar endpoints existentes

#### Paso 1: Verificar qué endpoints existen

Revisa tu documentación del backend o archivo de rutas para identificar qué endpoints están disponibles.

#### Paso 2: Si los endpoints NO existen, implementarlos en el backend

**Backend necesario** (Node.js + Express):

```javascript
// backend/routes/properties.js
router.get('/properties/host/:hostId', authenticateUser, async (req, res) => {
  try {
    const hostId = req.params.hostId;
    const properties = await Property.find({ hostId });
    res.json(properties);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener propiedades' });
  }
});

// backend/routes/bookings.js
router.get('/bookings/property/:propertyId', authenticateUser, async (req, res) => {
  try {
    const propertyId = req.params.propertyId;
    const bookings = await Booking.find({ propertyId });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener reservas' });
  }
});

// backend/routes/reviews.js
router.get('/reviews/property/:propertyId', async (req, res) => {
  try {
    const propertyId = req.params.propertyId;
    const reviews = await Review.find({ propertyId });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener reviews' });
  }
});
```

#### Paso 3: Si los endpoints existen pero con URLs diferentes

Actualiza los servicios en el frontend:

```typescript
// lib/api/services/property-service.ts
export class PropertyService {
  // ...
  
  /**
   * Obtiene las propiedades de un host específico
   */
  async getPropertiesByHost(hostId: string): Promise<Property[]> {
    // ✅ Ajustar la URL según tu backend
    const response = await this.client.get<Property[]>(`/properties/host/${hostId}`);
    return response;
  }
}

// lib/api/services/booking-service.ts
export class BookingService {
  // ...
  
  /**
   * Obtiene las reservas de una propiedad específica
   */
  async getBookingsByProperty(propertyId: string): Promise<Booking[]> {
    // ✅ Ajustar la URL según tu backend
    const response = await this.client.get<Booking[]>(`/bookings/property/${propertyId}`);
    return response;
  }
}

// lib/api/services/review-service.ts
export class ReviewService {
  // ...
  
  /**
   * Obtiene las reviews de una propiedad específica
   */
  async getReviewsByProperty(propertyId: string): Promise<Review[]> {
    // ✅ Ajustar la URL según tu backend
    const response = await this.client.get<Review[]>(`/reviews/property/${propertyId}`);
    return response;
  }
}
```

#### Paso 4: Agregar manejo de errores en el frontend

```typescript
// app/host/dashboard/page.tsx - líneas 47-100
const loadDashboardData = async () => {
  if (!user) return;

  setLoading(true);
  try {
    // ✅ Agregar try-catch específico para cada llamada
    let hostProperties: Property[] = [];
    try {
      const hostPropertiesRaw = await propertyService.getPropertiesByHost(user.id);
      hostProperties = Array.isArray(hostPropertiesRaw) ? hostPropertiesRaw : [];
      setProperties(hostProperties);
    } catch (error) {
      console.warn('No se pudieron cargar las propiedades:', error);
      // ✅ Continuar aunque falle, mostrar dashboard vacío
    }

    // ✅ Solo intentar cargar bookings y reviews si hay propiedades
    if (hostProperties.length > 0) {
      let totalBookings = 0;
      let totalRevenue = 0;
      let totalRating = 0;
      let ratingCount = 0;
      let upcomingCount = 0;

      for (const property of hostProperties) {
        // ✅ Try-catch para cada propiedad
        try {
          const bookings = await bookingService.getBookingsByProperty(property.id);
          totalBookings += bookings.length;

          bookings.forEach((booking) => {
            totalRevenue += booking.totalPrice;
            const checkIn = new Date(booking.checkIn);
            if (checkIn > new Date()) {
              upcomingCount++;
            }
          });
        } catch (error) {
          console.warn(`No se pudieron cargar reservas de propiedad ${property.id}:`, error);
        }

        try {
          const reviews = await reviewService.getReviewsByProperty(property.id);
          const count = reviews.length;
          const average = count
            ? reviews.reduce((acc, r) => acc + (r.rating?.overall || 0), 0) / count
            : 0;

          if (count > 0) {
            totalRating += average;
            ratingCount++;
          }
        } catch (error) {
          console.warn(`No se pudieron cargar reviews de propiedad ${property.id}:`, error);
        }
      }

      setStats({
        totalProperties: hostProperties.length,
        totalBookings,
        totalRevenue,
        averageRating: ratingCount > 0 ? totalRating / ratingCount : 0,
        upcomingBookings: upcomingCount,
      });
    } else {
      // ✅ Dashboard vacío pero sin errores
      setStats({
        totalProperties: 0,
        totalBookings: 0,
        totalRevenue: 0,
        averageRating: 0,
        upcomingBookings: 0,
      });
    }
  } catch (error) {
    console.error('Error loading dashboard data:', error);
    // ✅ Mostrar mensaje al usuario
    // TODO: Agregar state para mostrar error en UI
  } finally {
    setLoading(false);
  }
};
```

### 📊 Impacto esperado:

- ✅ Dashboard carga correctamente con datos (si backend está implementado)
- ✅ Dashboard muestra vacío gracefully (si no hay datos)
- ✅ No más errores 404 en la consola
- ✅ Mejor experiencia de usuario post-login

---

## 📋 Plan de Implementación (Orden Sugerido)

### Sprint 1: Arreglos Críticos (1-2 horas)

#### Tarea 1.1: Eliminar bucle de redirección ⚡ CRÍTICO
- [ ] Modificar `lib/auth/auth-context.tsx` para verificar token antes de llamar al API
- [ ] Crear archivo `lib/auth/auth-utils.ts` con helper `hasAuthToken()`
- [ ] Remover `router.refresh()` de `components/auth/login-form.tsx`
- [ ] Probar flujo de login manualmente
- [ ] Ejecutar test de Playwright: `npx playwright test tests/e2e/login-flow-detailed.spec.ts`

#### Tarea 1.2: Eliminar errores 401 en login ⚡ CRÍTICO
- [ ] Ya cubierto en Tarea 1.1 (misma solución)

### Sprint 2: Implementar Endpoints del Dashboard (2-4 horas)

#### Tarea 2.1: Verificar endpoints existentes
- [ ] Revisar documentación del backend (si existe)
- [ ] Usar Postman/Thunder Client para probar endpoints
- [ ] Documentar qué endpoints existen y cuáles faltan

#### Tarea 2.2: Implementar endpoints faltantes en el backend
- [ ] Crear ruta `GET /api/properties/host/:hostId`
- [ ] Crear ruta `GET /api/bookings/property/:propertyId`
- [ ] Crear ruta `GET /api/reviews/property/:propertyId`
- [ ] Probar cada endpoint con Postman

#### Tarea 2.3: Actualizar servicios en el frontend
- [ ] Actualizar `lib/api/services/property-service.ts`
- [ ] Actualizar `lib/api/services/booking-service.ts`
- [ ] Actualizar `lib/api/services/review-service.ts`
- [ ] Agregar manejo de errores robusto en `app/host/dashboard/page.tsx`

#### Tarea 2.4: Probar dashboard completo
- [ ] Login manual y verificar que el dashboard cargue sin errores
- [ ] Verificar consola del navegador (sin errores 404)
- [ ] Verificar que las estadísticas se calculen correctamente

---

## 🧪 Verificación Final

Una vez implementadas todas las soluciones, ejecutar:

```bash
# 1. Test de login detallado
npx playwright test tests/e2e/login-flow-detailed.spec.ts --headed

# 2. Verificar que pase sin errores
# Esperar: ✅ Test completado exitosamente
```

### Checklist de verificación:

- [ ] ✅ Login redirige a dashboard sin bucles
- [ ] ✅ No hay errores 401 en /auth/login
- [ ] ✅ Dashboard carga con datos (o vacío sin errores)
- [ ] ✅ Consola del navegador limpia (sin errores)
- [ ] ✅ Test de Playwright pasa exitosamente
- [ ] ✅ Experiencia de usuario fluida (< 2 segundos de login a dashboard)

---

## 📝 Notas Adicionales

### Configuración de Playwright para CI/CD

Si quieres ejecutar estos tests en tu pipeline de CI/CD:

```yaml
# .github/workflows/e2e-tests.yml
name: E2E Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npm run dev & # Inicia el servidor en background
      - run: npx playwright test
```

### Logging para debugging

Si necesitas más información durante el debugging:

```typescript
// lib/auth/auth-context.tsx
const loadUser = async () => {
  console.log('[AuthContext] Iniciando loadUser...');
  console.log('[AuthContext] ¿Hay token?', hasAuthToken());
  
  try {
    if (!hasAuthToken()) {
      console.log('[AuthContext] No hay token, saltando carga de usuario');
      setLoading(false);
      return;
    }

    console.log('[AuthContext] Llamando a getCurrentUser...');
    const currentUser = await authService.getCurrentUser();
    console.log('[AuthContext] Usuario cargado:', currentUser);
    setUser(currentUser);
  } catch (error) {
    console.log('[AuthContext] Error al cargar usuario (esperado en rutas públicas)');
    setUser(null);
  } finally {
    setLoading(false);
  }
};
```

**Recuerda remover estos logs en producción.**

---

## ✅ Conclusión

Con estas soluciones implementadas:

1. ✅ El flujo de login será más rápido y sin bucles
2. ✅ La consola estará limpia sin errores innecesarios
3. ✅ El dashboard mostrará datos correctamente
4. ✅ La experiencia de usuario será profesional y fluida

**Tiempo estimado total de implementación**: 4-7 horas

**Prioridad de implementación**:
1. 🔴 ALTA: Tarea 1.1 y 1.2 (bucle y errores 401)
2. 🔴 ALTA: Tarea 2.2 y 2.3 (endpoints del dashboard)
3. 🟡 MEDIA: Tarea 2.4 (pruebas exhaustivas)
