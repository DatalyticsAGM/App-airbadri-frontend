/**
 * Auth Service (API Real)
 * 
 * Implementación del servicio de autenticación usando API real.
 * Nota: Este servicio asume que `NEXT_PUBLIC_API_URL` incluye el prefijo `/api`.
 * Ej: NEXT_PUBLIC_API_URL="http://localhost:3333/api"
 */

import { apiClient } from '../client';
import { ApiClientError } from '../client';
import type { IAuthService } from '../interfaces';
import type { AuthResponse, ResetPasswordResponse, User, ValidateResetTokenResponse } from '../../auth/types';
import { authResponseSchema, userSchema } from '../../auth/schemas';

function coerceString(value: unknown): string | undefined {
  if (typeof value === 'string') return value;
  if (typeof value === 'number') return String(value);
  return undefined;
}

/**
 * Normaliza la forma del usuario que venga del backend a la forma esperada por la UI.
 * Por qué: algunos backends devuelven `_id`, `name`, `created_at`, etc.
 */
function normalizeUser(raw: any): User | undefined {
  if (!raw) return undefined;

  const id =
    coerceString(raw.id) ??
    coerceString(raw._id) ??
    coerceString(raw.userId) ??
    coerceString(raw.uid);

  const email = coerceString(raw.email) ?? coerceString(raw.mail);

  const fullName =
    coerceString(raw.fullName) ??
    coerceString(raw.name) ??
    coerceString(raw.username) ??
    (email ? email.split('@')[0] : undefined) ??
    'Usuario';

  const createdAt =
    coerceString(raw.createdAt) ??
    coerceString(raw.created_at) ??
    coerceString(raw.created) ??
    new Date().toISOString();

  const avatar =
    coerceString(raw.avatar) ??
    coerceString(raw.photoUrl) ??
    coerceString(raw.photoURL) ??
    coerceString(raw.picture);

  if (!id || !email) return undefined;

  return {
    id,
    email,
    fullName,
    avatar,
    createdAt,
  };
}

function normalizeAuthResponse(raw: any): AuthResponse {
  const token =
    raw?.token ??
    raw?.accessToken ??
    raw?.data?.token ??
    raw?.data?.accessToken;

  const user =
    raw?.user ??
    raw?.data?.user ??
    raw?.profile ??
    raw?.data?.profile;

  const success =
    typeof raw?.success === 'boolean'
      ? raw.success
      : Boolean(token || user);

  const error =
    raw?.error ??
    raw?.message ??
    raw?.error?.message ??
    raw?.data?.error?.message;

  const normalizedUser = normalizeUser(user);
  const parsedUser = normalizedUser ? userSchema.safeParse(normalizedUser) : null;
  const normalized: AuthResponse = {
    success,
    user: parsedUser && parsedUser.success ? (parsedUser.data as User) : undefined,
    token,
    error:
      error ||
      (parsedUser && !parsedUser.success ? 'Contrato de usuario inválido en respuesta de auth' : undefined),
  };

  // Validación suave del wrapper. Si falla, devolvemos el normalized igualmente.
  const parsedWrapper = authResponseSchema.safeParse(normalized);
  return parsedWrapper.success ? (parsedWrapper.data as AuthResponse) : normalized;
}

/**
 * Servicio de autenticación usando API real
 */
export const authService: IAuthService = {
  async signup(data) {
    // Backend real (según cURL compartido):
    // POST http://localhost:3333/api/auth/register
    const raw = await apiClient.post<any>('/auth/register', data);
    const response = normalizeAuthResponse(raw);
    if (response.token) {
      apiClient.setToken(response.token);
    }
    return response;
  },

  async login(email, password) {
    const raw = await apiClient.post<any>('/auth/login', {
      email,
      password,
    });
    const response = normalizeAuthResponse(raw);
    if (response.token) {
      apiClient.setToken(response.token);
    }
    return response;
  },

  async logout() {
    await apiClient.post('/auth/logout');
    apiClient.setToken(null);
  },

  async getCurrentUser() {
    try {
      const raw = await apiClient.get<any>('/auth/me');
      if (raw == null) return null;

      // Soportar respuestas tipo { user: {...} } o directamente el objeto usuario
      const candidate =
        raw?.user ??
        raw?.data?.user ??
        raw?.profile ??
        raw?.data?.profile ??
        raw;

      const normalizedUser = normalizeUser(candidate);
      if (!normalizedUser) return null;

      const parsed = userSchema.safeParse(normalizedUser);
      return parsed.success ? (parsed.data as User) : null;
    } catch (error) {
      // Si el backend responde 401, limpiamos el token para evitar estados "atascados".
      if (error instanceof ApiClientError && error.status === 401) {
        apiClient.setToken(null);
      }
      return null;
    }
  },

  async updateProfile(data) {
    /**
     * Nota: en este proyecto el perfil actual está acoplado al módulo Auth (`/auth/me`).
     * Algunos backends separan esto como `/users/me`. Probamos primero `/users/me`
     * y si no existe (404) usamos `/auth/me`.
     */
    try {
      try {
        await apiClient.patch('/users/me', data);
      } catch (error) {
        if (error instanceof ApiClientError && error.status === 404) {
          await apiClient.patch('/auth/me', data);
        } else {
          throw error;
        }
      }

      return await authService.getCurrentUser();
    } catch (error) {
      throw error;
    }
  },

  isAuthenticated() {
    // Si el backend usa cookies httpOnly, el token puede no estar disponible en el cliente.
    // La fuente de verdad para la UI es `AuthContext.user` (cargado desde /auth/me).
    return apiClient.getToken() !== null;
  },

  async forgotPassword(email) {
    return apiClient.post<ResetPasswordResponse>('/auth/forgot-password', {
      email,
    });
  },

  async resetPassword(token, password) {
    return apiClient.post<ResetPasswordResponse>('/auth/reset-password', {
      token,
      password,
    });
  },

  async validateResetToken(token) {
    try {
      const raw = await apiClient.get<any>(
        `/auth/reset-password/validate?token=${encodeURIComponent(token)}`
      );

      const valid =
        typeof raw?.valid === 'boolean'
          ? raw.valid
          : typeof raw?.success === 'boolean'
            ? raw.success
            : true; // si el backend responde 200 sin body estándar, asumimos válido

      const message = raw?.message ?? raw?.error?.message;

      return { valid, message } satisfies ValidateResetTokenResponse;
    } catch (error) {
      return {
        valid: false,
        message: error instanceof Error ? error.message : 'Token inválido',
      };
    }
  },

  async changePassword(currentPassword, newPassword) {
    return apiClient.post<ResetPasswordResponse>('/auth/change-password', {
      currentPassword,
      password: newPassword,
    });
  },
};

