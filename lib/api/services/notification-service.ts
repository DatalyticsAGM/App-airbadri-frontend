/**
 * Notification Service (API Real)
 *
 * Por qué existe: exponer una API simple para notificaciones sin depender
 * de datos en localStorage.
 */

import { apiClient } from '../client';
import type { INotificationService } from '../interfaces';
import type { Notification } from '../../notifications/types';

export const notificationService: INotificationService = {
  async getNotificationsByUser(userId: string) {
    // La documentación describe `GET /notifications` para el usuario actual.
    // Dejamos `userId` como query opcional por compatibilidad con la interfaz.
    const query = userId ? `?userId=${encodeURIComponent(userId)}` : '';
    return apiClient.get<Notification[]>(`/notifications${query}`);
  },

  async createNotification(data) {
    return apiClient.post<Notification>('/notifications', data);
  },

  async markAsRead(id: string) {
    await apiClient.post(`/notifications/${id}/read`);
    return true;
  },

  async markAllAsRead(userId: string) {
    // Implementación simple sin endpoint dedicado:
    // marca todas como leídas llamando al endpoint individual.
    const notifications = await this.getNotificationsByUser(userId);
    await Promise.all(
      notifications.filter((n) => !n.read).map((n) => this.markAsRead(n.id))
    );
    return true;
  },

  async getUnreadCount(userId: string) {
    const notifications = await this.getNotificationsByUser(userId);
    return notifications.filter((n) => !n.read).length;
  },
};

