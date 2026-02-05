/**
 * Notification Bell Component
 * 
 * Componente de campana de notificaciones con badge
 */

'use client';

import { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/lib/auth/auth-context';
import { getNotificationService } from '@/lib/api/service-factory';
import { NotificationList } from './notification-list';
import Link from 'next/link';
import type { Notification } from '@/lib/notifications/types';

export function NotificationBell() {
  const { user, isAuthenticated } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const notificationService = getNotificationService();

  useEffect(() => {
    if (isAuthenticated && user) {
      loadNotifications();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated, user]);

  const loadNotifications = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const [allNotifications, count] = await Promise.all([
        notificationService.getNotificationsByUser(user.id),
        notificationService.getUnreadCount(user.id),
      ]);
      setNotifications(allNotifications.slice(0, 5)); // Mostrar solo las 5 más recientes
      setUnreadCount(count);
    } catch (error) {
      console.error('Error loading notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id: string) => {
    if (!user) return;

    try {
      await notificationService.markAsRead(id);
      loadNotifications();
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-airbnb-primary-100 text-white text-xs">
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>Notificaciones</span>
          {unreadCount > 0 && (
            <Badge variant="secondary" className="ml-2">
              {unreadCount} nuevas
            </Badge>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {loading ? (
          <div className="p-4 text-center text-sm text-airbnb-text-200">
            Cargando...
          </div>
        ) : notifications.length === 0 ? (
          <div className="p-4 text-center text-sm text-airbnb-text-200">
            No hay notificaciones
          </div>
        ) : (
          <>
            <div className="max-h-96 overflow-y-auto">
              {notifications.map((notification) => (
                <DropdownMenuItem
                  key={notification.id}
                  className="flex flex-col items-start p-3 cursor-pointer"
                  onClick={() => handleMarkAsRead(notification.id)}
                  asChild
                >
                  <Link
                    href={notification.link || '#'}
                    className="w-full"
                  >
                    <div className="flex items-start justify-between w-full">
                      <div className="flex-1">
                        <p
                          className={`text-sm font-medium ${
                            !notification.read
                              ? 'text-airbnb-text-100'
                              : 'text-airbnb-text-200'
                          }`}
                        >
                          {notification.title}
                        </p>
                        <p className="text-xs text-airbnb-text-200 mt-1">
                          {notification.message}
                        </p>
                        <p className="text-xs text-airbnb-text-200 mt-1">
                          {new Date(notification.date).toLocaleDateString('es-ES', {
                            day: 'numeric',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                      {!notification.read && (
                        <div className="w-2 h-2 bg-airbnb-primary-100 rounded-full ml-2 flex-shrink-0 mt-1" />
                      )}
                    </div>
                  </Link>
                </DropdownMenuItem>
              ))}
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link
                href="/notifications"
                className="w-full text-center text-sm text-airbnb-primary-100 font-medium"
              >
                Ver todas las notificaciones
              </Link>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
