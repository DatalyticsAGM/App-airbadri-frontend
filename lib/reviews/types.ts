/**
 * Types for Reviews and Ratings System
 */

export type RatingValue = 1 | 2 | 3 | 4 | 5;

export interface Rating {
  overall: RatingValue;
  cleanliness?: RatingValue;
  accuracy?: RatingValue;
  communication?: RatingValue;
  location?: RatingValue;
  checkin?: RatingValue;
  value?: RatingValue;
}

export interface Review {
  id: string;
  propertyId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: Rating;
  comment: string;
  date: string; // ISO date string
  helpful?: number; // Number of users who found this helpful
  verified?: boolean; // If the user actually stayed (based on booking)
}

export interface ReviewFilters {
  minRating?: RatingValue;
  sortBy?: 'newest' | 'oldest' | 'highest' | 'lowest' | 'most_helpful';
}

export interface CreateReviewData {
  propertyId: string;
  userId: string;
  rating: Rating;
  comment: string;
}

export interface UpdateReviewData {
  rating?: Rating;
  comment?: string;
}







