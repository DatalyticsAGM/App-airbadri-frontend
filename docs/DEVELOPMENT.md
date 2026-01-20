# 👨‍💻 Guía de Desarrollo

## 🚀 Setup del Proyecto

### Requisitos Previos
- Node.js 18+ 
- npm o yarn
- Git

### Instalación

```bash
# Clonar repositorio
git clone <repository-url>
cd Fronted_airbnb

# Instalar dependencias
npm install

# Copiar variables de entorno
cp .env.example .env.local

# Iniciar servidor de desarrollo
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`

## 📝 Convenciones de Código

### TypeScript
- Usar TypeScript estricto
- Definir tipos explícitamente
- Evitar `any` cuando sea posible
- Usar interfaces para props de componentes

### Componentes React
- Usar functional components
- Props tipadas con interfaces
- Hooks al inicio del componente
- Handlers después de hooks
- JSX al final

**Ejemplo:**
```typescript
interface ButtonProps {
  label: string;
  onClick: () => void;
}

export function Button({ label, onClick }: ButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleClick = () => {
    setLoading(true);
    onClick();
  };

  return <button onClick={handleClick}>{label}</button>;
}
```

### Nombres de Archivos
- Componentes: `PascalCase.tsx`
- Utilidades: `camelCase.ts`
- Tests: `*.test.ts` o `__tests__/*.test.ts`
- Tipos: `types.ts` dentro del módulo

### Imports
Orden recomendado:
1. React y Next.js
2. Librerías externas
3. Componentes internos
4. Utilidades y tipos
5. Estilos (si es necesario)

```typescript
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { mockProperties } from '@/lib/properties/mock-properties';
import type { Property } from '@/lib/properties/types';
```

## 🏗️ Agregar Nueva Funcionalidad

### 1. Crear un Nuevo Módulo

**Estructura:**
```
lib/
  └── new-module/
      ├── types.ts           # Tipos TypeScript
      ├── mock-new-module.ts # Servicio MOCK
      ├── mock-data.ts       # Datos de ejemplo
      └── __tests__/         # Tests
          └── mock-new-module.test.ts
```

**Pasos:**
1. Crear tipos en `types.ts`
2. Implementar servicio MOCK
3. Crear datos de ejemplo
4. Agregar tests
5. Implementar interface en `lib/api/interfaces.ts`
6. Agregar al factory en `lib/api/service-factory.ts`

### 2. Crear Componentes

**Estructura:**
```
components/
  └── new-module/
      ├── index.ts              # Barrel export
      ├── new-module-card.tsx   # Componente principal
      └── new-module-form.tsx   # Formulario (si aplica)
```

**Pasos:**
1. Crear componentes
2. Agregar barrel export en `index.ts`
3. Usar tipos de `lib/new-module/types.ts`
4. Integrar con servicios mediante factory

### 3. Crear Páginas

**Estructura:**
```
app/
  └── new-module/
      ├── page.tsx              # Lista/catálogo
      └── [id]/
          └── page.tsx          # Detalle
```

**Pasos:**
1. Crear página en `app/`
2. Usar componentes del módulo
3. Integrar con servicios
4. Agregar protección de ruta si es necesario

## 🧪 Testing

### Escribir Tests

**Estructura de test:**
```typescript
describe('ServiceName', () => {
  beforeEach(() => {
    // Setup
  });

  describe('methodName', () => {
    it('should do something', async () => {
      // Arrange
      // Act
      // Assert
    });
  });
});
```

### Ejecutar Tests

```bash
npm test              # Todos los tests
npm run test:watch    # Modo watch
npm run test:coverage # Con cobertura
```

### Cobertura Objetivo
- Servicios: >90%
- Componentes críticos: >80%
- General: >80%

## 🔄 Migración de MOCK a API Real

### Paso 1: Configurar Variables de Entorno
```bash
NEXT_PUBLIC_API_URL=https://api.example.com
NEXT_PUBLIC_USE_MOCK_SERVICES=false
```

### Paso 2: Implementar Servicio Real
En `lib/api/services/new-module-service.ts`:

```typescript
import { apiClient } from '../client';
import type { INewModuleService } from '../interfaces';

export const newModuleService: INewModuleService = {
  async getAll() {
    return apiClient.get('/new-module');
  },
  // ... más métodos
};
```

### Paso 3: Actualizar Factory
En `lib/api/service-factory.ts`:

```typescript
export function getNewModuleService(): INewModuleService {
  if (useMockServices()) {
    return mockNewModule;
  }
  return newModuleService; // API real
}
```

## 🐛 Debugging

### Errores Comunes

**"Module not found"**
- Verificar imports
- Verificar barrel exports
- Limpiar `.next` y `node_modules`

**"Hydration error"**
- Verificar diferencias entre server y client
- Usar `'use client'` cuando sea necesario
- Evitar usar `window` en Server Components

**"Cannot read property of undefined"**
- Verificar que datos estén cargados
- Usar optional chaining (`?.`)
- Agregar validaciones

### Herramientas
- React DevTools
- Next.js DevTools
- Browser DevTools
- TypeScript compiler (`npm run typecheck`)

## 📦 Build y Deploy

### Build de Producción

```bash
npm run build
```

Verificar que no haya errores ni warnings.

### Verificar Build

```bash
npm start
```

Probar todas las rutas principales.

### Deploy

El proyecto está configurado para:
- Vercel (recomendado para Next.js)
- Netlify
- Cualquier plataforma que soporte Next.js

**Variables de entorno en producción:**
- Configurar todas las variables necesarias
- No usar servicios MOCK en producción (a menos que sea intencional)

## 🔍 Code Review Checklist

Antes de hacer PR:
- [ ] Código sigue convenciones
- [ ] Tests pasan
- [ ] No hay errores de TypeScript
- [ ] No hay warnings de ESLint
- [ ] Documentación actualizada
- [ ] Funciona en desarrollo
- [ ] Build de producción funciona

## 📚 Recursos

- [Next.js Docs](https://nextjs.org/docs)
- [React Docs](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)

---

**Última actualización**: $(date)





