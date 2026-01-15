/**
 * Share Button Component
 * 
 * Botón para compartir propiedades en redes sociales
 */

'use client';

import { useState } from 'react';
import { Share2, Copy, Check, Facebook, Twitter, MessageCircle } from 'lucide-react';
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
}

export function ShareButton({ property }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
  const shareUrl = `${baseUrl}/properties/${property.id}`;
  const shareText = `Mira esta increíble propiedad: ${property.title} en ${property.location.city}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Error copying link:', error);
    }
  };

  const handleShare = (platform: string) => {
    const encodedUrl = encodeURIComponent(shareUrl);
    const encodedText = encodeURIComponent(shareText);

    const urls: Record<string, string> = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`,
      whatsapp: `https://wa.me/?text=${encodedText}%20${encodedUrl}`,
    };

    const url = urls[platform];
    if (url) {
      window.open(url, '_blank', 'width=600,height=400');
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <Share2 className="w-4 h-4" />
          Compartir
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Compartir en</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleCopyLink} className="cursor-pointer">
          {copied ? (
            <>
              <Check className="mr-2 h-4 w-4 text-green-600" />
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
          <Facebook className="mr-2 h-4 w-4 text-blue-600" />
          Facebook
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleShare('twitter')}
          className="cursor-pointer"
        >
          <Twitter className="mr-2 h-4 w-4 text-blue-400" />
          Twitter
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleShare('whatsapp')}
          className="cursor-pointer"
        >
          <MessageCircle className="mr-2 h-4 w-4 text-green-600" />
          WhatsApp
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
