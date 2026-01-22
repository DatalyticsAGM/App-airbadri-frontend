/**
 * Share Button Component
 * 
 * Botón para compartir propiedades en redes sociales
 */

'use client';

import { useState } from 'react';
import { Share2, Copy, Check, Facebook, Twitter, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { Property } from '@/lib/properties/types';

interface ShareButtonProps {
  property: Property;
  size?: 'sm' | 'md' | 'lg';
}

export function ShareButton({ property, size = 'md' }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
  const propertyUrl = `${baseUrl}/properties/${property.id}`;
  const shareText = `Mira esta increíble propiedad: ${property.title} en ${property.location.city}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(propertyUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Error copying link:', error);
    }
  };

  const handleShare = async (platform: 'facebook' | 'twitter' | 'email') => {
    const encodedUrl = encodeURIComponent(propertyUrl);
    const encodedText = encodeURIComponent(shareText);

    switch (platform) {
      case 'facebook':
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
          '_blank',
          'width=600,height=400'
        );
        break;
      case 'twitter':
        window.open(
          `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`,
          '_blank',
          'width=600,height=400'
        );
        break;
      case 'email':
        window.location.href = `mailto:?subject=${encodeURIComponent(property.title)}&body=${encodedText}%20${encodedUrl}`;
        break;
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
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className={sizeClasses[size]}>
          <Share2 className={iconSizes[size]} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Compartir propiedad</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleCopyLink} className="cursor-pointer">
          {copied ? (
            <>
              <Check className="mr-2 h-4 w-4" />
              ¡Copiado!
            </>
          ) : (
            <>
              <Copy className="mr-2 h-4 w-4" />
              Copiar enlace
            </>
          )}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleShare('facebook')}
          className="cursor-pointer"
        >
          <Facebook className="mr-2 h-4 w-4" />
          Facebook
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleShare('twitter')}
          className="cursor-pointer"
        >
          <Twitter className="mr-2 h-4 w-4" />
          Twitter
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleShare('email')}
          className="cursor-pointer"
        >
          <Mail className="mr-2 h-4 w-4" />
          Email
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

