/**
 * Auth Service (API Real)
 * 
 * Implementación del servicio de autenticación usando API real.
 * Nota: Este servicio asume que `NEXT_PUBLIC_API_URL` incluye el prefijo `/api`.
 * Ej: NEXT_PUBLIC_API_URL="http://localhost:3333/api"
 */

import { apiClient } from '../client';
import type { IAuthService } from '../interfaces';
import type { AuthResponse, ResetPasswordResponse, User, ValidateResetTokenResponse } from '../../auth/types';

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

  return {
    success,
    user,
    token,
    error,
  };
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
    // TODO: Implementar obtención de usuario desde API
    // Por ahora retornar null, se debe obtener desde el token o endpoint /auth/me
    try {
      return await apiClient.get<User | null>('/auth/me');
    } catch {
      return null;
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

