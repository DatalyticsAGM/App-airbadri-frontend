/**
 * Notification List Component
 * 
 * Lista completa de notificaciones
 */

'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/lib/auth/auth-context';
import { mockNotifications } from '@/lib/notifications/mock-notifications';
import Link from 'next/link';
import type { Notification } from '@/lib/notifications/types';
import { CheckCheck } from 'lucide-react';

export function NotificationList() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadNotifications();
    }
  }, [user, filter]);

  const loadNotifications = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const allNotifications = await mockNotifications.getNotificationsByUser(user.id);
      
      if (filter === 'unread') {
        setNotifications(allNotifications.filter(n => !n.read));
      } else {
        setNotifications(allNotifications);
      }
    } catch (error) {
      console.error('Error loading notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id: string) => {
    if (!user) return;

    try {
      await mockNotifications.markAsRead(id, user.id);
      loadNotifications();
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    if (!user) return;

    try {
      await mockNotifications.markAllAsRead(user.id);
      loadNotifications();
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="h-20 bg-airbnb-bg-300 rounded-lg" />
          </div>
        ))}
      </div>
    );
  }

  if (notifications.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-airbnb-text-200">
          {filter === 'unread'
            ? 'No hay notificaciones no leídas'
            : 'No hay notificaciones'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filters and Actions */}
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('all')}
          >
            Todas
          </Button>
          <Button
            variant={filter === 'unread' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('unread')}
          >
            No leídas
          </Button>
        </div>
        {filter === 'all' && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleMarkAllAsRead}
            className="flex items-center gap-2"
          >
            <CheckCheck className="w-4 h-4" />
            Marcar todas como leídas
          </Button>
        )}
      </div>

      {/* Notifications */}
      <div className="space-y-3">
        {notifications.map((notification) => (
          <Link
            key={notification.id}
            href={notification.link || '#'}
            onClick={() => handleMarkAsRead(notification.id)}
            className="block p-4 bg-white rounded-lg border border-airbnb-bg-300 hover:border-airbnb-primary-100 transition-colors"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4
                    className={`font-semibold ${
                      !notification.read
                        ? 'text-airbnb-text-100'
                        : 'text-airbnb-text-200'
                    }`}
                  >
                    {notification.title}
                  </h4>
                  {!notification.read && (
                    <Badge variant="secondary" className="text-xs">
                      Nueva
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-airbnb-text-200 mb-2">
                  {notification.message}
                </p>
                <p className="text-xs text-airbnb-text-200">
                  {new Date(notification.date).toLocaleDateString('es-ES', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

