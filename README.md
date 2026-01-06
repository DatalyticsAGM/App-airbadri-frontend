# Airbnb Promotional Landing Page

Landing page minimalista inspirada en Airbnb, diseñada para promocionar propiedades y experiencias únicas.

## 🎨 Características de Diseño

- **Diseño Minimalista**: Interfaz limpia y fácil de navegar
- **Colores Pasteles**: Paleta de colores oficial de Airbnb
- **Responsive**: Diseño adaptable a todos los dispositivos
- **Fuente**: DM Sans de Google Fonts
- **Sin Buscadores**: Enfocado solo en promoción y conversión

## 🎨 Paleta de Colores

```css
--primary-100: #FF5A5F  /* Rosa principal de Airbnb */
--primary-200: #ff8e8c  /* Rosa claro */
--primary-300: #fff7ef  /* Rosa pastel muy claro */
--accent-100:  #00A699  /* Verde azulado (acento) */
--accent-200:  #004940  /* Verde azulado oscuro */
--text-100:    #333333  /* Texto principal */
--text-200:    #5c5c5c  /* Texto secundario */
--bg-100:      #FFFFFF  /* Fondo blanco */
--bg-200:      #f5f5f5  /* Fondo gris claro */
--bg-300:      #cccccc  /* Fondo gris medio */
```

## 📁 Estructura del Proyecto

```
project/
├── app/
│   ├── layout.tsx       # Layout principal con DM Sans
│   ├── page.tsx         # Página principal (Home)
│   └── globals.css      # Estilos globales
├── components/
│   ├── header.tsx              # Navegación superior
│   ├── hero-section.tsx        # Sección hero principal
│   ├── features-section.tsx    # Características del servicio
│   ├── promotions-section.tsx  # Tarjetas de promociones
│   ├── cta-section.tsx         # Call-to-action final
│   └── footer.tsx              # Footer con enlaces
└── components/ui/              # Componentes de shadcn/ui
```

## 🧩 Componentes

### Header
- Logo de Airbnb
- Enlaces de navegación: Become a host, Help, Sign up, Log in
- Responsive con menú hamburguesa para móvil

### Hero Section
- Headline principal: "Book unique homes and experience"
- Descripción del servicio
- CTA: "Explore destinations"
- Background con imagen de destino único

### Features Section
- 4 características principales con iconos
- Diseño en grid responsive
- Tarjetas con hover effect

### Promotions Section
- 3 promociones destacadas
- Tarjetas con imágenes de Pexels
- Badges con descuentos
- Botones de "Book now"

### CTA Section
- Llamada a la acción final
- Dos botones: "Browse homes" y "Become a host"
- Estadísticas de confianza (4M+ hosts, 220+ países, etc.)

### Footer
- Enlaces organizados en 4 columnas
- Redes sociales
- Copyright y enlaces legales

## 🔍 Comentarios Importantes

### TODO Comments (Tareas Pendientes)
- `header.tsx:25` - Conectar enlaces con rutas reales
- `hero-section.tsx:17` - Reemplazar con imagen real de destino
- `hero-section.tsx:41` - Conectar con página de exploración
- `hero-section.tsx:49` - Agregar enlace al programa de hosts
- `features-section.tsx:45` - Considerar animaciones al hacer scroll
- `promotions-section.tsx:57` - Integrar con base de datos
- `cta-section.tsx:39` - Reemplazar con datos reales de DB
- `footer.tsx:47` - Actualizar enlaces cuando las páginas estén creadas
- `page.tsx:26` - Agregar smooth scroll entre secciones

### FIXME Comments (Requieren Atención)
- `header.tsx:44` - Implementar menú hamburguesa para mobile
- `hero-section.tsx:36` - Conectar botón con sistema de propiedades
- `promotions-section.tsx:81` - Conectar con sistema de reservas real
- `cta-section.tsx:28` - Conectar botones con rutas correspondientes
- `footer.tsx:79` - Agregar enlaces reales a redes sociales
- `globals.css:97` - Verificar accesibilidad de animaciones

## 🚀 Stack Tecnológico

- **Framework**: Next.js 13 (App Router)
- **UI**: React 18
- **Estilos**: Tailwind CSS
- **Componentes**: shadcn/ui
- **Iconos**: Lucide React
- **Fuente**: DM Sans (Google Fonts)
- **Imágenes**: Pexels (stock photos)

## 📦 Instalación y Uso

```bash
# Instalar dependencias
npm install

# Modo desarrollo
npm run dev

# Build de producción
npm run build

# Iniciar producción
npm start
```

## 🔗 Próximos Pasos

1. **Conectar con Base de Datos**: Integrar Supabase para cargar promociones dinámicamente
2. **Sistema de Autenticación**: Implementar login y registro de usuarios
3. **Página de Propiedades**: Crear catálogo de propiedades disponibles
4. **Sistema de Reservas**: Desarrollar flujo completo de reservación
5. **Panel de Host**: Área para que los hosts gestionen sus propiedades
6. **Optimización SEO**: Metatags, Open Graph, sitemap
7. **Analytics**: Implementar seguimiento de conversiones

## 📝 Notas Adicionales

- **Sin buscadores**: Por especificación, no se incluye funcionalidad de búsqueda
- **Imágenes**: Todas las imágenes son de Pexels (uso permitido)
- **Responsive**: Diseño optimizado para mobile, tablet y desktop
- **Accesibilidad**: Se respetan las preferencias de movimiento reducido
- **Performance**: Build optimizado con Next.js
- **Convenciones**: Se usan nombres comunes en español e inglés según contexto

## 🎯 Enfoque

Esta landing page está diseñada para:
- Captar la atención del visitante
- Mostrar las promociones actuales
- Generar confianza con estadísticas y reviews
- Convertir visitantes en usuarios registrados o hosts

---

**Desarrollado para**: Promociones de Airbnb
**Tipo**: Landing Page
**Estado**: Listo para producción (requiere conexión a base de datos)
