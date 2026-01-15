/**
 * Notifications Page
 * 
 * Página para ver todas las notificaciones
 */

'use client';

import { useRouter } from 'next/navigation';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { NotificationList } from '@/components/notifications/notification-list';
import { useAuth } from '@/lib/auth/auth-context';
import { Bell } from 'lucide-react';

export default function NotificationsPage() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();

  if (!authLoading && !isAuthenticated) {
    router.push('/auth/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-airbnb-bg-100 flex flex-col">
      <Header />

      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Bell className="w-8 h-8 text-airbnb-primary-100" />
              <h1 className="text-4xl font-bold text-airbnb-text-100">
                Notificaciones
              </h1>
            </div>
            <p className="text-lg text-airbnb-text-200">
              Mantente al día con todas tus actividades
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <NotificationList />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
