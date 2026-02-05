/**
 * Authentication Context
 * 
 * Provee el estado de autenticación a toda la aplicación React.
 * 
 * Funcionalidades:
 * - Mantiene el estado del usuario actual
 * - Proporciona funciones de login, signup y logout
 * - Carga automáticamente el usuario al iniciar la app
 * - Expone el estado de autenticación a componentes hijos
 * 
 * Uso:
 * 1. Envolver la app con <AuthProvider>
 * 2. Usar el hook useAuth() en componentes para acceder al estado
 */

'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import type { User, ResetPasswordResponse, ValidateResetTokenResponse } from './types';
import { getAuthService } from '@/lib/api/service-factory';
import { hasAuthToken, clearAuthToken } from './auth-utils';

/**
 * Tipo del contexto de autenticación
 */
interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (email: string, password: string, fullName: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  forgotPassword: (email: string) => Promise<ResetPasswordResponse>;
  resetPassword: (token: string, newPassword: string) => Promise<ResetPasswordResponse>;
  validateResetToken: (token: string) => Promise<ValidateResetTokenResponse>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<{ success: boolean; error?: string }>;
  updateProfile: (data: Partial<Pick<User, 'avatar' | 'fullName'>>) => Promise<{ success: boolean; error?: string }>;
  refreshUser: () => Promise<void>;
}

// Crear el contexto
const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Provider de autenticación
 * 
 * Envuelve la aplicación y provee el estado de autenticación
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const authService = getAuthService();

  /**
   * Carga el usuario actual al montar el componente
   */
  useEffect(() => {
    loadUser();
  }, []);

  /**
   * Carga el usuario actual de la sesión
   * 
   * Solo hace la llamada al API si hay un token almacenado.
   * Esto evita errores 401 innecesarios en rutas públicas.
   */
  const loadUser = async () => {
    try {
      // ✅ Verificar si hay token antes de llamar al API
      if (!hasAuthToken()) {
        setUser(null);
        setLoading(false);
        return;
      }

      // Solo hacer la llamada si hay token
      const currentUser = await authService.getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      // Si falla (ej: token expirado), limpiar usuario
      // No mostrar error en consola porque es esperado en algunas situaciones
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Inicia sesión con email y contraseña
   * 
   * Asegura que el usuario esté completamente cargado antes de retornar éxito.
   */
  const login = async (email: string, password: string) => {
    try {
      const response = await authService.login(email, password);
      if (response.success) {
        // Algunos backends autentican por cookie y no devuelven `user` en el login.
        if (response.user) {
          setUser(response.user);
        } else {
          // Esperar a que el usuario se cargue completamente
          await refreshUser();
        }
        
        // Pequeña espera para asegurar que el estado se actualizó
        // Esto evita race conditions en la redirección
        await new Promise(resolve => setTimeout(resolve, 100));
        
        return { success: true };
      }
      return { success: false, error: response.error || 'Credenciales inválidas' };
    } catch (error) {
      console.error('Error en login:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Error al iniciar sesión' };
    }
  };

  /**
   * Registra un nuevo usuario
   */
  const signup = async (email: string, password: string, fullName: string) => {
    try {
      const response = await authService.signup({ email, password, fullName });
      if (response.success) {
        if (response.user) {
          setUser(response.user);
        } else {
          await refreshUser();
        }
        return { success: true };
      }
      return { success: false, error: response.error || 'Error al registrar usuario' };
    } catch (error) {
      console.error('Error en signup:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Error al registrar usuario' };
    }
  };

  /**
   * Cierra la sesión del usuario
   */
  const logout = async () => {
    try {
      await authService.logout();
      clearAuthToken(); // Limpiar token de todos los storages
      setUser(null);
    } catch (error) {
      console.error('Error en logout:', error);
      // Aunque falle, limpiar token localmente
      clearAuthToken();
      setUser(null);
    }
  };

  /**
   * Solicita reset de contraseña
   */
  const forgotPassword = async (email: string) => {
    try {
      return await authService.forgotPassword(email);
    } catch (error) {
      console.error('Error en forgotPassword:', error);
      return { success: false, error: 'Error al solicitar reset de contraseña' };
    }
  };

  /**
   * Resetea la contraseña con un token
   */
  const resetPassword = async (token: string, newPassword: string) => {
    try {
      return await authService.resetPassword(token, newPassword);
    } catch (error) {
      console.error('Error en resetPassword:', error);
      return { success: false, error: 'Error al resetear contraseña' };
    }
  };

  /**
   * Valida que el token de reset sea válido antes de mostrar el formulario
   */
  const validateResetToken = async (token: string) => {
    return authService.validateResetToken(token);
  };

  /**
   * Cambia la contraseña del usuario autenticado
   */
  const changePassword = async (currentPassword: string, newPassword: string) => {
    try {
      const result = await authService.changePassword(currentPassword, newPassword);
      if (result.success) {
        return { success: true as const };
      }
      return { success: false as const, error: result.error || 'Error al cambiar la contraseña' };
    } catch (error) {
      console.error('Error en changePassword:', error);
      return {
        success: false as const,
        error: error instanceof Error ? error.message : 'Error al cambiar la contraseña',
      };
    }
  };

  /**
   * Actualiza datos de perfil del usuario actual (ej: avatar)
   */
  const updateProfile = async (data: Partial<Pick<User, 'avatar' | 'fullName'>>) => {
    try {
      const updatedUser = await authService.updateProfile(data);
      if (updatedUser) {
        setUser(updatedUser);
      } else {
        await refreshUser();
      }
      return { success: true as const };
    } catch (error) {
      console.error('Error en updateProfile:', error);
      return {
        success: false as const,
        error: error instanceof Error ? error.message : 'Error al actualizar el perfil',
      };
    }
  };

  /**
   * Refresca los datos del usuario actual
   */
  const refreshUser = async () => {
    try {
      const currentUser = await authService.getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      console.error('Error refrescando usuario:', error);
    }
  };

  // Valor del contexto
  const value: AuthContextType = {
    user,
    loading,
    login,
    signup,
    logout,
    isAuthenticated: !!user,
    forgotPassword,
    resetPassword,
    validateResetToken,
    changePassword,
    updateProfile,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Hook para usar el contexto de autenticación
 * 
 * @returns El contexto de autenticación
 * @throws Error si se usa fuera del AuthProvider
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

