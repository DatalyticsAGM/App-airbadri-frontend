/**
 * Avatar Upload Component
 * 
 * Componente para cambiar la foto de perfil del usuario.
 * Permite subir una imagen desde el dispositivo o usar una URL.
 * 
 * Por qué existe: Proporciona una interfaz accesible y fácil de usar
 * para que los usuarios puedan actualizar su foto de perfil mediante
 * carga de archivo o URL, con validación y preview en tiempo real.
 */

'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Camera, Upload, X, Loader2 } from 'lucide-react';
import { useAuth } from '@/lib/auth/auth-context';
import { mockAuth } from '@/lib/auth/mock-auth';
import { toast } from 'sonner';

type AvatarUploadProps = Record<string, never>;

export const AvatarUpload = (): JSX.Element | null => {
  const { user, refreshUser } = useAuth();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [avatarUrl, setAvatarUrl] = useState<string>(user?.avatar || '');
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!user) return null;

  // Obtener iniciales para el fallback del avatar
  // Por qué: Muestra las iniciales del usuario cuando no hay imagen,
  // mejorando la experiencia visual y la identificación del usuario
  const initials = user.fullName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  /**
   * Maneja la selección de archivo desde el dispositivo
   * Por qué: Valida el tipo y tamaño del archivo antes de procesarlo,
   * mostrando errores claros al usuario y creando un preview inmediato
   */
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar tipo de archivo
    if (!file.type.startsWith('image/')) {
      toast.error('Por favor selecciona un archivo de imagen');
      return;
    }

    // Validar tamaño (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('La imagen debe ser menor a 5MB');
      return;
    }

    // Crear preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
      setAvatarUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  /**
   * Maneja el cambio de URL de imagen
   * Por qué: Permite a los usuarios usar una URL externa como avatar,
   * actualizando el preview en tiempo real para que vean el resultado antes de guardar
   */
  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const url = e.target.value;
    setAvatarUrl(url);
    
    if (!url) {
      setPreview(null);
      return;
    }
    
    setPreview(url);
  };

  /**
   * Guarda el nuevo avatar en el perfil del usuario
   * Por qué: Actualiza el avatar del usuario en el sistema y refresca
   * el contexto de autenticación para que los cambios se reflejen inmediatamente
   */
  const handleSave = async (): Promise<void> => {
    if (!avatarUrl.trim()) {
      toast.error('Por favor proporciona una imagen o URL');
      return;
    }

    setIsUploading(true);
    try {
      // En un sistema real, aquí subirías la imagen a un servicio de almacenamiento
      // Por ahora, guardamos la URL/data URL en localStorage
      await mockAuth.updateProfile({ avatar: avatarUrl });
      
      // Refrescar el usuario en el contexto
      if (refreshUser) {
        await refreshUser();
      }

      toast.success('Foto de perfil actualizada correctamente');
      setIsOpen(false);
      setPreview(null);
    } catch (error) {
      console.error('Error al actualizar avatar:', error);
      toast.error('Error al actualizar la foto de perfil');
    } finally {
      setIsUploading(false);
    }
  };

  /**
   * Elimina el avatar actual del perfil del usuario
   * Por qué: Permite al usuario remover su foto de perfil y volver
   * al estado inicial con solo las iniciales mostradas
   */
  const handleRemove = async (): Promise<void> => {
    setIsUploading(true);
    try {
      await mockAuth.updateProfile({ avatar: '' });
      
      if (refreshUser) {
        await refreshUser();
      }

      setAvatarUrl('');
      setPreview(null);
      toast.success('Foto de perfil eliminada');
      setIsOpen(false);
    } catch (error) {
      console.error('Error al eliminar avatar:', error);
      toast.error('Error al eliminar la foto de perfil');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex items-center gap-4">
      {/* Avatar actual */}
      <Avatar className="w-20 h-20">
        <AvatarImage src={user.avatar} alt={user.fullName} />
        <AvatarFallback className="bg-airbnb-primary-100 text-white text-2xl">
          {initials}
        </AvatarFallback>
      </Avatar>

      {/* Botón para cambiar */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2">
            <Camera className="w-4 h-4" />
            Cambiar foto
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Cambiar foto de perfil</DialogTitle>
            <DialogDescription>
              Sube una nueva imagen o proporciona una URL. La imagen debe ser menor a 5MB.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Preview */}
            <div className="flex justify-center">
              <Avatar className="w-32 h-32">
                <AvatarImage src={preview || avatarUrl || user.avatar} alt="Preview" />
                <AvatarFallback className="bg-airbnb-primary-100 text-white text-4xl">
                  {initials}
                </AvatarFallback>
              </Avatar>
            </div>

            {/* Subir desde archivo */}
            <div className="space-y-2">
              <Label htmlFor="file-upload">Subir desde dispositivo</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="file-upload"
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                  className="hidden"
                />
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    fileInputRef.current?.click();
                  }
                }}
                className="w-full gap-2"
                aria-label="Seleccionar archivo de imagen"
                tabIndex={0}
              >
                <Upload className="w-4 h-4" />
                Seleccionar archivo
              </Button>
              </div>
            </div>

            {/* O usar URL */}
            <div className="space-y-2">
              <Label htmlFor="avatar-url">O usar URL de imagen</Label>
              <Input
                id="avatar-url"
                type="url"
                placeholder="https://ejemplo.com/imagen.jpg"
                value={avatarUrl}
                onChange={handleUrlChange}
              />
            </div>

            {/* Acciones */}
            <div className="flex gap-2 pt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setIsOpen(false);
                  setAvatarUrl(user.avatar || '');
                  setPreview(null);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setIsOpen(false);
                    setAvatarUrl(user.avatar || '');
                    setPreview(null);
                  }
                }}
                className="flex-1"
                disabled={isUploading}
                aria-label="Cancelar cambio de foto de perfil"
                tabIndex={0}
              >
                Cancelar
              </Button>
              {user.avatar && (
                <Button
                  variant="destructive"
                  onClick={handleRemove}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleRemove();
                    }
                  }}
                  disabled={isUploading}
                  className="gap-2"
                  aria-label="Eliminar foto de perfil actual"
                  tabIndex={0}
                >
                  {isUploading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <X className="w-4 h-4" />
                  )}
                  Eliminar
                </Button>
              )}
              <Button
                onClick={handleSave}
                onKeyDown={(e) => {
                  if ((e.key === 'Enter' || e.key === ' ') && !isUploading && avatarUrl.trim()) {
                    e.preventDefault();
                    handleSave();
                  }
                }}
                disabled={isUploading || !avatarUrl.trim()}
                className="flex-1 bg-airbnb-primary-100 hover:bg-airbnb-primary-100/90"
                aria-label="Guardar nueva foto de perfil"
                tabIndex={0}
              >
                {isUploading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Guardando...
                  </>
                ) : (
                  'Guardar'
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
