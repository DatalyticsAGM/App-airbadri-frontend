# 🎯 Milestone 2: Módulo de Propiedades y Reservas (MOCK)

## 📋 Descripción
Implementación completa del módulo de gestión de propiedades (listings) y sistema de reservas usando servicios MOCK (sin backend real). Los datos se almacenarán en localStorage del navegador, integrado con el sistema de autenticación del Milestone 1.

## ✅ To-Do List

### Fase 1: Infraestructura Base
- [ ] **1.1** Crear estructura de carpetas necesarias
  - [ ] `lib/properties/` - Servicios y tipos de propiedades
  - [ ] `lib/bookings/` - Servicios y tipos de reservas
  - [ ] `components/properties/` - Componentes relacionados con propiedades
  - [ ] `components/bookings/` - Componentes relacionados con reservas
  - [ ] `app/properties/` - Páginas de propiedades
  - [ ] `app/bookings/` - Páginas de reservas
  - [ ] `app/profile/` - Página de perfil de usuario

- [ ] **1.2** Crear tipos TypeScript
  - [ ] Archivo: `lib/properties/types.ts`
  - [ ] Tipo `Property` (id, title, description, location, price, images, amenities, hostId, etc.)
  - [ ] Tipo `PropertyFilters` (location, priceRange, amenities, etc.)
  - [ ] Archivo: `lib/bookings/types.ts`
  - [ ] Tipo `Booking` (id, propertyId, userId, checkIn, checkOut, guests, totalPrice, status, etc.)
  - [ ] Tipo `BookingStatus` (pending, confirmed, cancelled, completed)

- [ ] **1.3** Crear servicio MOCK de propiedades
  - [ ] Archivo: `lib/properties/mock-properties.ts`
  - [ ] Implementar función `getAllProperties()`
  - [ ] Implementar función `getPropertyById(id)`
  - [ ] Implementar función `getPropertiesByHost(hostId)`
  - [ ] Implementar función `createProperty(propertyData)`
  - [ ] Implementar función `updateProperty(id, propertyData)`
  - [ ] Implementar función `deleteProperty(id)`
  - [ ] Implementar función `searchProperties(filters)`
  - [ ] Almacenamiento en localStorage
  - [ ] Datos de ejemplo pre-cargados

- [ ] **1.4** Crear servicio MOCK de reservas
  - [ ] Archivo: `lib/bookings/mock-bookings.ts`
  - [ ] Implementar función `createBooking(bookingData)`
  - [ ] Implementar función `getBookingById(id)`
  - [ ] Implementar función `getBookingsByUser(userId)`
  - [ ] Implementar función `getBookingsByProperty(propertyId)`
  - [ ] Implementar función `updateBookingStatus(id, status)`
  - [ ] Implementar función `cancelBooking(id)`
  - [ ] Implementar función `checkAvailability(propertyId, checkIn, checkOut)`
  - [ ] Almacenamiento en localStorage
  - [ ] Validación de disponibilidad

### Fase 2: Componentes de Propiedades
- [ ] **2.1** Crear Componente PropertyCard
  - [ ] Archivo: `components/properties/property-card.tsx`
  - [ ] Mostrar imagen principal
  - [ ] Mostrar título, ubicación y precio
  - [ ] Mostrar rating y número de reviews
  - [ ] Botón "Ver detalles"
  - [ ] Diseño responsive
  - [ ] Hover effects

- [ ] **2.2** Crear Componente PropertyGrid
  - [ ] Archivo: `components/properties/property-grid.tsx`
  - [ ] Grid responsive (1-4 columnas según breakpoint)
  - [ ] Integrar PropertyCard
  - [ ] Manejo de estado vacío
  - [ ] Loading states

- [ ] **2.3** Crear Componente PropertyFilters
  - [ ] Archivo: `components/properties/property-filters.tsx`
  - [ ] Filtro por ubicación (input de búsqueda)
  - [ ] Filtro por rango de precio (slider)
  - [ ] Filtro por amenities (checkboxes)
  - [ ] Botón de limpiar filtros
  - [ ] Diseño responsive (sidebar en desktop, modal en mobile)

- [ ] **2.4** Crear Componente PropertyDetail
  - [ ] Archivo: `components/properties/property-detail.tsx`
  - [ ] Galería de imágenes (carousel)
  - [ ] Información completa de la propiedad
  - [ ] Amenities list
  - [ ] Información del host
  - [ ] Mapa de ubicación (opcional, puede ser estático)
  - [ ] Sección de reviews (mock)

- [ ] **2.5** Crear Componente BookingForm
  - [ ] Archivo: `components/bookings/booking-form.tsx`
  - [ ] Selector de fechas (check-in, check-out)
  - [ ] Selector de número de huéspedes
  - [ ] Cálculo automático de precio total
  - [ ] Resumen de reserva
  - [ ] Botón de confirmar reserva
  - [ ] Validación de fechas
  - [ ] Validación de disponibilidad
  - [ ] Estados de carga

### Fase 3: Formularios de Gestión de Propiedades
- [ ] **3.1** Crear Formulario de Crear Propiedad
  - [ ] Archivo: `components/properties/create-property-form.tsx`
  - [ ] Validación con react-hook-form + zod
  - [ ] Campos: título, descripción, ubicación, precio por noche
  - [ ] Selector de imágenes (múltiples URLs)
  - [ ] Selector de amenities (checkboxes)
  - [ ] Campos: número de habitaciones, baños, capacidad
  - [ ] Manejo de errores
  - [ ] Estados de carga
  - [ ] Redirección después de crear

- [ ] **3.2** Crear Formulario de Editar Propiedad
  - [ ] Archivo: `components/properties/edit-property-form.tsx`
  - [ ] Validación con react-hook-form + zod
  - [ ] Pre-llenar campos con datos existentes
  - [ ] Mismos campos que formulario de crear
  - [ ] Manejo de errores
  - [ ] Estados de carga
  - [ ] Redirección después de editar

### Fase 4: Páginas de Propiedades
- [ ] **4.1** Crear Página de Catálogo de Propiedades
  - [ ] Archivo: `app/properties/page.tsx`
  - [ ] Layout con Header y Footer
  - [ ] Integrar PropertyFilters (sidebar o modal)
  - [ ] Integrar PropertyGrid
  - [ ] Paginación o scroll infinito
  - [ ] Integración con búsqueda y filtros

- [ ] **4.2** Crear Página de Detalle de Propiedad
  - [ ] Archivo: `app/properties/[id]/page.tsx`
  - [ ] Layout con Header y Footer
  - [ ] Integrar PropertyDetail
  - [ ] Integrar BookingForm (solo si está autenticado)
  - [ ] Manejo de propiedad no encontrada
  - [ ] Loading states

- [ ] **4.3** Crear Página de Crear Propiedad
  - [ ] Archivo: `app/properties/create/page.tsx`
  - [ ] Layout con Header y Footer
  - [ ] Integrar CreatePropertyForm
  - [ ] Protección de ruta (solo usuarios autenticados)
  - [ ] Redirección si no está autenticado

- [ ] **4.4** Crear Página de Editar Propiedad
  - [ ] Archivo: `app/properties/[id]/edit/page.tsx`
  - [ ] Layout con Header y Footer
  - [ ] Integrar EditPropertyForm
  - [ ] Protección de ruta (solo propietario)
  - [ ] Validación de propiedad no encontrada
  - [ ] Validación de permisos

- [ ] **4.5** Crear Página de Mis Propiedades (Host Dashboard)
  - [ ] Archivo: `app/properties/my-properties/page.tsx`
  - [ ] Layout con Header y Footer
  - [ ] Lista de propiedades del usuario actual
  - [ ] Botones de editar/eliminar por propiedad
  - [ ] Botón "Crear nueva propiedad"
  - [ ] Estado vacío si no tiene propiedades
  - [ ] Protección de ruta (solo usuarios autenticados)

### Fase 5: Páginas de Reservas
- [ ] **5.1** Crear Página de Mis Reservas
  - [ ] Archivo: `app/bookings/page.tsx`
  - [ ] Layout con Header y Footer
  - [ ] Lista de reservas del usuario actual
  - [ ] Filtros por estado (todas, confirmadas, canceladas, completadas)
  - [ ] Información de cada reserva (propiedad, fechas, precio)
  - [ ] Botón de cancelar reserva (si está permitido)
  - [ ] Estado vacío si no tiene reservas
  - [ ] Protección de ruta (solo usuarios autenticados)

- [ ] **5.2** Crear Página de Detalle de Reserva
  - [ ] Archivo: `app/bookings/[id]/page.tsx`
  - [ ] Layout con Header y Footer
  - [ ] Información completa de la reserva
  - [ ] Información de la propiedad reservada
  - [ ] Botón de cancelar (si aplica)
  - [ ] Protección de ruta (solo usuario propietario de la reserva)

### Fase 6: Página de Perfil de Usuario
- [ ] **6.1** Crear Página de Perfil
  - [ ] Archivo: `app/profile/page.tsx`
  - [ ] Layout con Header y Footer
  - [ ] Información del usuario (nombre, email, avatar)
  - [ ] Formulario de edición de perfil
  - [ ] Sección de estadísticas (reservas realizadas, propiedades creadas)
  - [ ] Enlaces a "Mis Reservas" y "Mis Propiedades"
  - [ ] Protección de ruta (solo usuarios autenticados)

### Fase 7: Integración con Navegación
- [ ] **7.1** Actualizar Header con Nuevos Enlaces
  - [ ] Modificar `components/header.tsx`
  - [ ] Agregar enlace "Explorar" (catálogo de propiedades)
  - [ ] En menú de usuario autenticado: "Mi Perfil", "Mis Reservas", "Mis Propiedades", "Crear Propiedad"
  - [ ] Verificar responsividad

- [ ] **7.2** Actualizar Footer
  - [ ] Modificar `components/footer.tsx`
  - [ ] Conectar enlaces relevantes con nuevas páginas
  - [ ] Agregar enlace a catálogo de propiedades

- [ ] **7.3** Actualizar Home Page
  - [ ] Modificar `app/page.tsx` o componentes relacionados
  - [ ] Conectar botones "Explore destinations" y "Browse homes" con catálogo
  - [ ] Conectar botón "Become a host" con página de crear propiedad
  - [ ] Actualizar PromotionsSection para usar datos reales de propiedades

### Fase 8: Datos de Ejemplo
- [ ] **8.1** Crear Datos Mock Iniciales
  - [ ] Archivo: `lib/properties/mock-data.ts`
  - [ ] Crear 10-15 propiedades de ejemplo
  - [ ] Variedad de ubicaciones, precios y amenities
  - [ ] Imágenes de ejemplo (URLs de Pexels o placeholders)
  - [ ] Cargar datos iniciales en localStorage si está vacío

- [ ] **8.2** Crear Reservas de Ejemplo
  - [ ] Archivo: `lib/bookings/mock-data.ts`
  - [ ] Crear algunas reservas de ejemplo
  - [ ] Diferentes estados (confirmadas, pendientes, canceladas)
  - [ ] Asociadas a propiedades y usuarios existentes

### Fase 9: Testing y Validación
- [ ] **9.1** Probar CRUD de Propiedades
  - [ ] Crear nueva propiedad
  - [ ] Verificar almacenamiento en localStorage
  - [ ] Editar propiedad existente
  - [ ] Eliminar propiedad
  - [ ] Verificar que solo el propietario puede editar/eliminar

- [ ] **9.2** Probar Sistema de Reservas
  - [ ] Crear nueva reserva
  - [ ] Verificar validación de disponibilidad
  - [ ] Verificar cálculo de precio
  - [ ] Cancelar reserva
  - [ ] Verificar que solo el usuario puede ver sus reservas

- [ ] **9.3** Probar Filtros y Búsqueda
  - [ ] Filtrar por ubicación
  - [ ] Filtrar por rango de precio
  - [ ] Filtrar por amenities
  - [ ] Combinar múltiples filtros
  - [ ] Limpiar filtros

- [ ] **9.4** Probar Integración con Autenticación
  - [ ] Verificar protección de rutas
  - [ ] Verificar que usuarios no autenticados no pueden crear propiedades
  - [ ] Verificar que usuarios no autenticados no pueden reservar
  - [ ] Verificar persistencia de datos después de logout/login

## 📊 Estado General
- **Total de tareas**: 58
- **Completadas**: 0
- **En progreso**: 0
- **Pendientes**: 58

## 🎯 Objetivo
Tener un sistema completo de gestión de propiedades y reservas usando MOCK que permita:
- Visualizar catálogo de propiedades con filtros
- Ver detalles de propiedades
- Crear, editar y eliminar propiedades (para hosts)
- Realizar reservas de propiedades
- Gestionar reservas (ver, cancelar)
- Ver y editar perfil de usuario
- Integración completa con sistema de autenticación
- Protección de rutas según roles

## 📝 Notas
- No se requiere instalar dependencias adicionales (usar las existentes)
- Todo funciona con localStorage (solo en el navegador actual)
- Los datos se mantienen separados por usuario cuando aplica
- Para producción, reemplazar servicios MOCK con API real
- Considerar usar una librería de fechas como `date-fns` para manejo de fechas
- Las imágenes pueden ser URLs de Pexels o placeholders

## 🔗 Dependencias del Milestone 1
Este milestone requiere que el Milestone 1 esté completado, específicamente:
- Sistema de autenticación funcional
- Context de autenticación (`useAuth`)
- Identificación de usuario autenticado

## 📝 Archivos a Crear/Modificar

### Nuevos Archivos (Estimado):
1. `lib/properties/types.ts` - Tipos TypeScript para propiedades
2. `lib/properties/mock-properties.ts` - Servicio MOCK de propiedades
3. `lib/properties/mock-data.ts` - Datos de ejemplo de propiedades
4. `lib/bookings/types.ts` - Tipos TypeScript para reservas
5. `lib/bookings/mock-bookings.ts` - Servicio MOCK de reservas
6. `lib/bookings/mock-data.ts` - Datos de ejemplo de reservas
7. `components/properties/property-card.tsx` - Tarjeta de propiedad
8. `components/properties/property-grid.tsx` - Grid de propiedades
9. `components/properties/property-filters.tsx` - Filtros de búsqueda
10. `components/properties/property-detail.tsx` - Detalle de propiedad
11. `components/properties/create-property-form.tsx` - Formulario crear propiedad
12. `components/properties/edit-property-form.tsx` - Formulario editar propiedad
13. `components/bookings/booking-form.tsx` - Formulario de reserva
14. `app/properties/page.tsx` - Catálogo de propiedades
15. `app/properties/[id]/page.tsx` - Detalle de propiedad
16. `app/properties/create/page.tsx` - Crear propiedad
17. `app/properties/[id]/edit/page.tsx` - Editar propiedad
18. `app/properties/my-properties/page.tsx` - Mis propiedades
19. `app/bookings/page.tsx` - Mis reservas
20. `app/bookings/[id]/page.tsx` - Detalle de reserva
21. `app/profile/page.tsx` - Perfil de usuario

### Archivos a Modificar:
1. `components/header.tsx` - Agregar enlaces de navegación
2. `components/footer.tsx` - Actualizar enlaces
3. `app/page.tsx` - Conectar botones con nuevas rutas
4. `components/promotions-section.tsx` - Integrar con datos reales (opcional)

## ✅ Criterios de Aceptación
- [ ] Usuarios pueden ver catálogo de propiedades sin autenticación
- [ ] Usuarios autenticados pueden crear propiedades
- [ ] Solo el propietario puede editar/eliminar sus propiedades
- [ ] Usuarios autenticados pueden realizar reservas
- [ ] Sistema valida disponibilidad antes de permitir reserva
- [ ] Usuarios pueden ver y gestionar sus reservas
- [ ] Filtros funcionan correctamente
- [ ] Todas las rutas protegidas requieren autenticación
- [ ] Datos persisten en localStorage
- [ ] Diseño responsive en todas las páginas

---
**Estado**: 🚧 EN PLANIFICACIÓN
**Última actualización**: $(date)

