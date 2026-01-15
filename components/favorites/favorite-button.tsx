/**
 * Favorite Button Component
 * 
 * Botón para agregar/quitar de favoritos
 */

'use client';

import { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { mockFavorites } from '@/lib/favorites/mock-favorites';
import { useAuth } from '@/lib/auth/auth-context';
import { useRouter } from 'next/navigation';

interface FavoriteButtonProps {
  propertyId: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'outline' | 'ghost';
}

export function FavoriteButton({
  propertyId,
  size = 'md',
  variant = 'ghost',
}: FavoriteButtonProps) {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated && user) {
      checkFavorite();
    } else {
      setIsLoading(false);
    }
  }, [isAuthenticated, user, propertyId]);

  const checkFavorite = async () => {
    if (!user) return;
    
    try {
      const favorite = await mockFavorites.isFavorite(user.id, propertyId);
      setIsFavorite(favorite);
    } catch (error) {
      console.error('Error checking favorite:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleFavorite = async () => {
    if (!isAuthenticated || !user) {
      router.push('/auth/login');
      return;
    }

    setIsLoading(true);
    try {
      if (isFavorite) {
        await mockFavorites.removeFavorite(user.id, propertyId);
        setIsFavorite(false);
      } else {
        await mockFavorites.addFavorite({
          userId: user.id,
          propertyId,
        });
        setIsFavorite(true);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  return (
    <Button
      variant={variant}
      size="icon"
      onClick={handleToggleFavorite}
      disabled={isLoading}
      className={`${sizeClasses[size]} ${isFavorite ? 'text-airbnb-primary-100' : 'text-airbnb-text-200'}`}
      aria-label={isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
    >
      <Heart
        className={`${iconSizes[size]} transition-all ${
          isFavorite ? 'fill-airbnb-primary-100' : 'fill-none'
        }`}
      />
    </Button>
  );
}

