/**
 * Auth Types
 *
 * Por qué existe: Centraliza los tipos compartidos entre el frontend y el backend
 * para evitar depender de implementaciones locales en tiempo de ejecución.
 */

export interface User {
  id: string;
  email: string;
  fullName: string;
  avatar?: string;
  createdAt: string;
}

export interface AuthResponse {
  success: boolean;
  user?: User;
  token?: string;
  error?: string;
}

export interface ResetPasswordResponse {
  success: boolean;
  message?: string;
  error?: string;
}

export interface ValidateResetTokenResponse {
  valid: boolean;
  message?: string;
}

