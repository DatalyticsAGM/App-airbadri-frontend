/**
 * Auth Service (API Real)
 * 
 * Implementación del servicio de autenticación usando API real.
 * TODO: Implementar cuando el backend esté listo.
 */

import { apiClient } from '../client';
import type { IAuthService } from '../interfaces';
import type { AuthResponse, ResetPasswordResponse, User } from '../../auth/mock-auth';

/**
 * Servicio de autenticación usando API real
 */
export const authService: IAuthService = {
  async signup(data) {
    const response = await apiClient.post<AuthResponse>('/auth/signup', data);
    if (response.token) {
      apiClient.setToken(response.token);
    }
    return response;
  },

  async login(email, password) {
    const response = await apiClient.post<AuthResponse>('/auth/login', {
      email,
      password,
    });
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
};

