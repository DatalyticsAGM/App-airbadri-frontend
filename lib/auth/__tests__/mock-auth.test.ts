/**
 * Tests for Mock Authentication Service
 */

import { mockAuth } from '../mock-auth';

// Mock localStorage con persistencia entre tests
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => {
      return store[key] || null;
    },
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
    get length() {
      return Object.keys(store).length;
    },
    key: (index: number) => {
      const keys = Object.keys(store);
      return keys[index] || null;
    },
  };
})();

// Asegurar que window.localStorage existe
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  writable: true,
});

describe('Mock Auth Service', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('signup', () => {
    it('should create a new user successfully', async () => {
      const result = await mockAuth.signup(
        'test@example.com',
        'password123',
        'Test User'
      );

      expect(result.success).toBe(true);
      expect(result.user).toBeDefined();
      expect(result.user?.email).toBe('test@example.com');
      expect(result.user?.fullName).toBe('Test User');
    });

    it('should fail if email already exists', async () => {
      await mockAuth.signup(
        'test@example.com',
        'password123',
        'Test User'
      );

      const result = await mockAuth.signup(
        'test@example.com',
        'password456',
        'Another User'
      );

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
  });

  describe('login', () => {
    beforeEach(async () => {
      await mockAuth.signup(
        'test@example.com',
        'password123',
        'Test User'
      );
    });

    it('should login with correct credentials', async () => {
      const result = await mockAuth.login('test@example.com', 'password123');

      expect(result.success).toBe(true);
      expect(result.user).toBeDefined();
      expect(result.token).toBeDefined();
    });

    it('should fail with incorrect password', async () => {
      const result = await mockAuth.login('test@example.com', 'wrongpassword');

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('should fail with non-existent email', async () => {
      const result = await mockAuth.login('nonexistent@example.com', 'password123');

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
  });

  describe('logout', () => {
    it('should clear session', async () => {
      await mockAuth.signup(
        'test@example.com',
        'password123',
        'Test User'
      );

      await mockAuth.login('test@example.com', 'password123');
      await mockAuth.logout();

      const currentUser = await mockAuth.getCurrentUser();
      expect(currentUser).toBeNull();
    });
  });

  describe('getCurrentUser', () => {
    it('should return null when not logged in', async () => {
      const user = await mockAuth.getCurrentUser();
      expect(user).toBeNull();
    });

    it('should return user when logged in', async () => {
      await mockAuth.signup(
        'test@example.com',
        'password123',
        'Test User'
      );

      await mockAuth.login('test@example.com', 'password123');
      const user = await mockAuth.getCurrentUser();

      expect(user).toBeDefined();
      expect(user?.email).toBe('test@example.com');
    });
  });

  describe('isAuthenticated', () => {
    it('should return false when not logged in', () => {
      expect(mockAuth.isAuthenticated()).toBe(false);
    });

    it('should return true when logged in', async () => {
      await mockAuth.signup(
        'test@example.com',
        'password123',
        'Test User'
      );

      await mockAuth.login('test@example.com', 'password123');
      expect(mockAuth.isAuthenticated()).toBe(true);
    });
  });
});

