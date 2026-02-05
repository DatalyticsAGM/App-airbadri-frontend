/**
 * Auth Schemas (Zod)
 *
 * Por qué existe: valida en runtime los contratos críticos del módulo Usuarios
 * (ej: /auth/me) para evitar que la UI se rompa silenciosamente cuando el backend
 * cambia la forma del response.
 *
 * Nota: usamos `.passthrough()` para permitir campos extra sin bloquear la app.
 */
import { z } from 'zod';

export const userSchema = z
  .object({
    id: z.string(),
    email: z.string(),
    fullName: z.string(),
    avatar: z.string().optional(),
    createdAt: z.string(),
  })
  .passthrough();

export const authResponseSchema = z
  .object({
    success: z.boolean().optional(),
    user: userSchema.optional(),
    token: z.string().optional(),
    error: z.string().optional(),
  })
  .passthrough();

