/**
 * Types for Notifications System
 */

export type NotificationType =
  | 'booking_confirmed'
  | 'booking_cancelled'
  | 'booking_pending'
  | 'new_review'
  | 'property_approved'
  | 'property_rejected'
  | 'message_received'
  | 'system';

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  date: string; // ISO date string
  link?: string; // URL to related page
  metadata?: Record<string, any>; // Additional data
}

export interface CreateNotificationData {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  link?: string;
  metadata?: Record<string, any>;
}
