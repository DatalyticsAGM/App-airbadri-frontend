/**
 * Mock Authentication Service
 * 
 * Servicio de autenticación simulado que almacena datos en localStorage.
 * NO requiere backend ni base de datos real.
 * 
 * Funcionalidades implementadas:
 * - Registro de nuevos usuarios
 * - Inicio de sesión
 * - Cierre de sesión
 * - Verificación de sesión activa
 * - Obtención del usuario actual
 * 
 * Almacenamiento:
 * - Usuarios: localStorage key 'airbnb_mock_users'
 * - Sesiones: localStorage key 'airbnb_mock_sessions'
 * 
 * IMPORTANTE: Este es un MOCK solo para desarrollo.
 * En producción reemplazar con autenticación real.
 */

export interface User {
  id: string;
  email: string;
  fullName: string;
  avatar?: string;
  createdAt: string;
}

export interface UpdateProfileData {
  fullName?: string;
  avatar?: string;
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

// Constantes para keys de localStorage
const MOCK_USERS_KEY = 'airbnb_mock_users';
const MOCK_SESSIONS_KEY = 'airbnb_mock_sessions';
const MOCK_RESET_TOKENS_KEY = 'airbnb_mock_reset_tokens';

// Simulación de delay de red (500ms para hacer más realista)
const NETWORK_DELAY = 500;

/**
 * Tipo interno para almacenar usuarios con contraseña
 * (Solo en desarrollo - NUNCA en producción)
 */
type UserWithPassword = User & { password: string };

/**
 * Obtiene todos los usuarios del localStorage
 */
function getUsers(): UserWithPassword[] {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(MOCK_USERS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

/**
 * Guarda usuarios en localStorage
 */
function saveUsers(users: UserWithPassword[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(MOCK_USERS_KEY, JSON.stringify(users));
  } catch (error) {
    console.error('Error guardando usuarios:', error);
  }
}

/**
 * Obtiene la sesión actual del usuario
 */
function getSession(): { userId: string; token: string } | null {
  if (typeof window === 'undefined') return null;
  try {
    const stored = localStorage.getItem(MOCK_SESSIONS_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

/**
 * Guarda la sesión del usuario en localStorage
 */
function saveSession(userId: string, token: string): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(MOCK_SESSIONS_KEY, JSON.stringify({ userId, token }));
  } catch (error) {
    console.error('Error guardando sesión:', error);
  }
}

/**
 * Elimina la sesión actual
 */
function clearSession(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(MOCK_SESSIONS_KEY);
}

/**
 * Genera un token simulado (solo para desarrollo)
 */
function generateToken(): string {
  return `mock_token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Genera un token de reset de contraseña
 */
function generateResetToken(): string {
  return `reset_${Date.now()}_${Math.random().toString(36).substr(2, 15)}`;
}

/**
 * Obtiene los tokens de reset almacenados
 */
function getResetTokens(): Array<{ email: string; token: string; expiresAt: number }> {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(MOCK_RESET_TOKENS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

/**
 * Guarda un token de reset
 */
function saveResetToken(email: string, token: string): void {
  if (typeof window === 'undefined') return;
  try {
    const tokens = getResetTokens();
    // Expira en 1 hora
    const expiresAt = Date.now() + 60 * 60 * 1000;
    tokens.push({ email: email.toLowerCase().trim(), token, expiresAt });
    localStorage.setItem(MOCK_RESET_TOKENS_KEY, JSON.stringify(tokens));
  } catch (error) {
    console.error('Error guardando token de reset:', error);
  }
}

/**
 * Valida y elimina un token de reset
 */
function validateAndRemoveResetToken(token: string): string | null {
  if (typeof window === 'undefined') return null;
  try {
    const tokens = getResetTokens();
    const now = Date.now();
    const validToken = tokens.find(t => t.token === token && t.expiresAt > now);
    
    if (!validToken) return null;
    
    // Eliminar token usado
    const updatedTokens = tokens.filter(t => t.token !== token);
    localStorage.setItem(MOCK_RESET_TOKENS_KEY, JSON.stringify(updatedTokens));
    
    return validToken.email;
  } catch {
    return null;
  }
}

/**
 * Simula un delay de red (para hacer más realista la experiencia)
 */
function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Servicio de autenticación MOCK
 */
export const mockAuth = {
  /**
   * Registra un nuevo usuario
   * 
   * @param email - Email del usuario
   * @param password - Contraseña (almacenada en texto plano - SOLO MOCK)
   * @param fullName - Nombre completo del usuario
   * @returns Promise con la respuesta de autenticación
   */
  async signup(
    email: string,
    password: string,
    fullName: string
  ): Promise<AuthResponse> {
    await delay(NETWORK_DELAY);

    // Validaciones básicas
    if (!email || !password || !fullName) {
      return {
        success: false,
        error: 'Todos los campos son requeridos',
      };
    }

    if (password.length < 6) {
      return {
        success: false,
        error: 'La contraseña debe tener al menos 6 caracteres',
      };
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return {
        success: false,
        error: 'El email no es válido',
      };
    }

    const users = getUsers();

    // Verificar si el usuario ya existe
    const existingUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existingUser) {
      return {
        success: false,
        error: 'Este email ya está registrado',
      };
    }

    // Crear nuevo usuario
    const newUser: UserWithPassword = {
      id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      email: email.toLowerCase().trim(),
      fullName: fullName.trim(),
      password, // ⚠️ SOLO PARA DESARROLLO - NUNCA EN PRODUCCIÓN
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    saveUsers(users);

    // Crear sesión automáticamente después del registro
    const token = generateToken();
    const { password: _, ...userWithoutPassword } = newUser;
    saveSession(newUser.id, token);

    return {
      success: true,
      user: userWithoutPassword,
      token,
    };
  },

  /**
   * Inicia sesión con email y contraseña
   * 
   * @param email - Email del usuario
   * @param password - Contraseña del usuario
   * @returns Promise con la respuesta de autenticación
   */
  async login(email: string, password: string): Promise<AuthResponse> {
    await delay(NETWORK_DELAY);

    // Validaciones básicas
    if (!email || !password) {
      return {
        success: false,
        error: 'Email y contraseña son requeridos',
      };
    }

    const users = getUsers();
    const user = users.find(
      u => u.email.toLowerCase() === email.toLowerCase().trim() && u.password === password
    );

    if (!user) {
      return {
        success: false,
        error: 'Email o contraseña incorrectos',
      };
    }

    // Crear sesión
    const token = generateToken();
    const { password: _, ...userWithoutPassword } = user;
    saveSession(user.id, token);

    return {
      success: true,
      user: userWithoutPassword,
      token,
    };
  },

  /**
   * Cierra la sesión del usuario actual
   */
  async logout(): Promise<void> {
    await delay(200);
    clearSession();
  },

  /**
   * Obtiene el usuario actual de la sesión activa
   * 
   * @returns Promise con el usuario actual o null si no hay sesión
   */
  async getCurrentUser(): Promise<User | null> {
    await delay(100);

    const session = getSession();
    if (!session) return null;

    const users = getUsers();
    const user = users.find(u => u.id === session.userId);

    if (!user) {
      // Sesión inválida, limpiar
      clearSession();
      return null;
    }

    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  },

  /**
   * Verifica si hay una sesión activa
   * 
   * @returns true si hay sesión activa, false en caso contrario
   */
  isAuthenticated(): boolean {
    return getSession() !== null;
  },

  /**
   * Solicita un reset de contraseña (envía email simulado)
   * 
   * @param email - Email del usuario
   * @returns Promise con la respuesta
   */
  async forgotPassword(email: string): Promise<ResetPasswordResponse> {
    await delay(NETWORK_DELAY);

    if (!email) {
      return {
        success: false,
        error: 'El email es requerido',
      };
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return {
        success: false,
        error: 'El email no es válido',
      };
    }

    const users = getUsers();
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase().trim());

    // Por seguridad, siempre devolver éxito aunque el usuario no exista
    // (esto previene enumeración de usuarios)
    if (!user) {
      return {
        success: true,
        message: 'Si el email existe, recibirás instrucciones para resetear tu contraseña',
      };
    }

    // Generar token de reset
    const resetToken = generateResetToken();
    saveResetToken(user.email, resetToken);

    // En un entorno real, aquí se enviaría un email con el token
    // Para desarrollo, logueamos el token en consola
    console.log('🔑 Token de reset (SOLO PARA DESARROLLO):', resetToken);
    console.log('📧 URL de reset:', `/auth/reset-password?token=${resetToken}`);

    return {
      success: true,
      message: 'Si el email existe, recibirás instrucciones para resetear tu contraseña',
    };
  },

  /**
   * Resetea la contraseña usando un token válido
   * 
   * @param token - Token de reset
   * @param newPassword - Nueva contraseña
   * @returns Promise con la respuesta
   */
  async resetPassword(token: string, newPassword: string): Promise<ResetPasswordResponse> {
    await delay(NETWORK_DELAY);

    if (!token || !newPassword) {
      return {
        success: false,
        error: 'Token y nueva contraseña son requeridos',
      };
    }

    if (newPassword.length < 6) {
      return {
        success: false,
        error: 'La contraseña debe tener al menos 6 caracteres',
      };
    }

    // Validar token
    const email = validateAndRemoveResetToken(token);
    if (!email) {
      return {
        success: false,
        error: 'El token de reset es inválido o ha expirado',
      };
    }

    // Actualizar contraseña del usuario
    const users = getUsers();
    const userIndex = users.findIndex(u => u.email.toLowerCase() === email);
    
    if (userIndex === -1) {
      return {
        success: false,
        error: 'Usuario no encontrado',
      };
    }

    users[userIndex].password = newPassword;
    saveUsers(users);

    return {
      success: true,
      message: 'Contraseña actualizada correctamente',
    };
  },

  /**
   * Actualiza el perfil del usuario actual
   * 
   * @param data - Datos a actualizar (fullName, avatar)
   * @returns Promise con el usuario actualizado
   */
  async updateProfile(data: UpdateProfileData): Promise<User> {
    await delay(NETWORK_DELAY);

    const session = getSession();
    if (!session) {
      throw new Error('No hay sesión activa');
    }

    const users = getUsers();
    const userIndex = users.findIndex(u => u.id === session.userId);

    if (userIndex === -1) {
      throw new Error('Usuario no encontrado');
    }

    // Actualizar campos permitidos
    if (data.fullName !== undefined) {
      users[userIndex].fullName = data.fullName;
    }
    if (data.avatar !== undefined) {
      users[userIndex].avatar = data.avatar;
    }

    saveUsers(users);

    // Retornar usuario sin contraseña
    const { password, ...userWithoutPassword } = users[userIndex];
    return userWithoutPassword;
  },
};

