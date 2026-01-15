/**
 * Mock Notifications Service
 * 
 * Servicio MOCK para gestión de notificaciones
 * Almacena datos en localStorage
 */

import type { Notification, CreateNotificationData } from './types';

const STORAGE_KEY = 'airbnb_notifications';

/**
 * Obtener todas las notificaciones del localStorage
 */
function getStoredNotifications(): Notification[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error reading notifications from localStorage:', error);
    return [];
  }
}

/**
 * Guardar notificaciones en localStorage
 */
function saveNotifications(notifications: Notification[]): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
  } catch (error) {
    console.error('Error saving notifications to localStorage:', error);
  }
}

/**
 * Generar ID único para notificación
 */
function generateNotificationId(): string {
  return `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export const mockNotifications = {
  /**
   * Obtener todas las notificaciones de un usuario
   */
  async getNotificationsByUser(userId: string): Promise<Notification[]> {
    const notifications = getStoredNotifications();
    return notifications
      .filter(notif => notif.userId === userId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  },

  /**
   * Obtener notificaciones no leídas de un usuario
   */
  async getUnreadNotifications(userId: string): Promise<Notification[]> {
    const notifications = await this.getNotificationsByUser(userId);
    return notifications.filter(notif => !notif.read);
  },

  /**
   * Obtener contador de notificaciones no leídas
   */
  async getUnreadCount(userId: string): Promise<number> {
    const unread = await this.getUnreadNotifications(userId);
    return unread.length;
  },

  /**
   * Crear una nueva notificación
   */
  async createNotification(data: CreateNotificationData): Promise<Notification> {
    const notifications = getStoredNotifications();

    const newNotification: Notification = {
      id: generateNotificationId(),
      userId: data.userId,
      type: data.type,
      title: data.title,
      message: data.message,
      read: false,
      date: new Date().toISOString(),
      link: data.link,
      metadata: data.metadata,
    };

    notifications.push(newNotification);
    saveNotifications(notifications);

    return newNotification;
  },

  /**
   * Marcar notificación como leída
   */
  async markAsRead(id: string, userId: string): Promise<void> {
    const notifications = getStoredNotifications();
    const notification = notifications.find(n => n.id === id && n.userId === userId);

    if (notification) {
      notification.read = true;
      saveNotifications(notifications);
    }
  },

  /**
   * Marcar todas las notificaciones como leídas
   */
  async markAllAsRead(userId: string): Promise<void> {
    const notifications = getStoredNotifications();
    notifications.forEach(notif => {
      if (notif.userId === userId && !notif.read) {
        notif.read = true;
      }
    });
    saveNotifications(notifications);
  },

  /**
   * Eliminar notificación
   */
  async deleteNotification(id: string, userId: string): Promise<void> {
    const notifications = getStoredNotifications();
    const filtered = notifications.filter(
      n => !(n.id === id && n.userId === userId)
    );
    saveNotifications(filtered);
  },
};

