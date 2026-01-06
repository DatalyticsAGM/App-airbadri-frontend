/**
 * Mock Users Data
 * 
 * Datos de ejemplo para inicializar el sistema con usuarios de prueba
 */

// Constante para key de localStorage
const MOCK_USERS_KEY = 'airbnb_mock_users';

/**
 * Usuarios de ejemplo para pruebas
 */
export const mockUsersData = [
  {
    id: 'user_demo_host', // ID fijo para poder asociar propiedades y reservas
    email: 'host@example.com',
    password: 'host123',
    fullName: 'María García - Anfitrión',
  },
  {
    id: 'user_demo_guest', // ID fijo para poder asociar reservas
    email: 'guest@example.com',
    password: 'guest123',
    fullName: 'Carlos Rodríguez - Huésped',
  },
  {
    email: 'test@example.com',
    password: 'test123',
    fullName: 'Usuario de Prueba',
  },
];

/**
 * Inicializa usuarios de ejemplo en localStorage si no existen
 */
export function initializeMockUsers(): void {
  if (typeof window === 'undefined') return;

  try {
    const existing = localStorage.getItem(MOCK_USERS_KEY);
    let users: any[] = existing ? JSON.parse(existing) : [];

    // Verificar si ya existen los usuarios de ejemplo con los IDs correctos
    const exampleEmails = mockUsersData.map(u => u.email.toLowerCase());
    const exampleIds = mockUsersData.map(u => (u as any).id).filter(Boolean);
    
    // Verificar usuarios existentes
    const existingExampleUsers = users.filter((u: any) => 
      exampleEmails.includes(u.email.toLowerCase()) || exampleIds.includes(u.id)
    );

    // Si ya existen todos los usuarios de ejemplo con los IDs correctos, no hacer nada
    if (existingExampleUsers.length >= mockUsersData.length) {
      // Verificar que tengan los IDs correctos
      let needsUpdate = false;
      mockUsersData.forEach((userData) => {
        if ((userData as any).id) {
          const existingUser = users.find((u: any) => 
            u.email.toLowerCase() === userData.email.toLowerCase()
          );
          if (existingUser && existingUser.id !== (userData as any).id) {
            existingUser.id = (userData as any).id;
            needsUpdate = true;
          }
        }
      });
      
      if (needsUpdate) {
        localStorage.setItem(MOCK_USERS_KEY, JSON.stringify(users));
        console.log('✅ IDs de usuarios actualizados');
      }
      return;
    }

    // Crear usuarios de ejemplo directamente en localStorage
    mockUsersData.forEach((userData) => {
      const emailLower = userData.email.toLowerCase().trim();
      const userId = (userData as any).id;
      
      // Buscar por email o por ID
      let existingUser = users.find((u: any) => 
        u.email.toLowerCase() === emailLower || (userId && u.id === userId)
      );
      
      if (!existingUser) {
        // Crear nuevo usuario
        const newUser = {
          id: userId || `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          email: emailLower,
          fullName: userData.fullName.trim(),
          password: userData.password, // ⚠️ SOLO PARA DESARROLLO
          createdAt: new Date().toISOString(),
        };
        users.push(newUser);
        console.log(`✅ Usuario creado: ${userData.email}`);
      } else {
        // Actualizar usuario existente si es necesario
        if (userId && existingUser.id !== userId) {
          existingUser.id = userId;
          console.log(`✅ ID actualizado para: ${userData.email}`);
        }
        if (existingUser.fullName !== userData.fullName.trim()) {
          existingUser.fullName = userData.fullName.trim();
        }
      }
    });

    // Guardar usuarios actualizados
    localStorage.setItem(MOCK_USERS_KEY, JSON.stringify(users));
    console.log('✅ Usuarios de ejemplo inicializados correctamente');
    console.log('Usuarios disponibles:', users.map(u => ({ email: u.email, id: u.id })));
  } catch (error) {
    console.error('Error inicializando usuarios de ejemplo:', error);
  }
}

