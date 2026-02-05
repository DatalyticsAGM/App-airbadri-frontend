/**
 * Edit Property Form Component
 * 
 * Formulario para editar una propiedad existente
 */

'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { getPropertyService } from '@/lib/api/service-factory';
import type { Property } from '@/lib/properties/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

const availableAmenities = [
  'WiFi',
  'Aire acondicionado',
  'Cocina equipada',
  'TV',
  'Lavadora',
  'Piscina',
  'Parking',
  'Jardín',
  'Chimenea',
  'Balcón',
  'Terraza',
];

const propertySchema = z.object({
  title: z.string().min(5, 'El título debe tener al menos 5 caracteres'),
  description: z.string().min(20, 'La descripción debe tener al menos 20 caracteres'),
  city: z.string().min(1, 'La ciudad es requerida'),
  country: z.string().min(1, 'El país es requerido'),
  address: z.string().min(1, 'La dirección es requerida'),
  pricePerNight: z.number().min(1, 'El precio debe ser mayor a 0'),
  images: z.string().url('Debe ser una URL válida').array().min(1, 'Al menos una imagen es requerida'),
  amenities: z.string().array().min(1, 'Al menos un amenity es requerido'),
  bedrooms: z.number().min(0, 'El número de habitaciones no puede ser negativo'),
  bathrooms: z.number().min(1, 'Debe tener al menos un baño'),
  maxGuests: z.number().min(1, 'Debe aceptar al menos un huésped'),
});

type PropertyFormValues = z.infer<typeof propertySchema>;

interface EditPropertyFormProps {
  property: Property;
}

export function EditPropertyForm({ property }: EditPropertyFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState('');
  const router = useRouter();
  const propertyService = getPropertyService();

  const form = useForm<PropertyFormValues>({
    resolver: zodResolver(propertySchema),
    defaultValues: {
      title: property.title,
      description: property.description,
      city: property.location.city,
      country: property.location.country,
      address: property.location.address,
      pricePerNight: property.pricePerNight,
      images: property.images,
      amenities: property.amenities,
      bedrooms: property.bedrooms,
      bathrooms: property.bathrooms,
      maxGuests: property.maxGuests,
    },
  });

  const addImage = () => {
    if (imageUrl && imageUrl.trim()) {
      const currentImages = form.getValues('images');
      form.setValue('images', [...currentImages, imageUrl.trim()]);
      setImageUrl('');
    }
  };

  const removeImage = (index: number) => {
    const currentImages = form.getValues('images');
    form.setValue('images', currentImages.filter((_, i) => i !== index));
  };

  const toggleAmenity = (amenity: string) => {
    const currentAmenities = form.getValues('amenities');
    if (currentAmenities.includes(amenity)) {
      form.setValue('amenities', currentAmenities.filter(a => a !== amenity));
    } else {
      form.setValue('amenities', [...currentAmenities, amenity]);
    }
  };

  const onSubmit = async (values: PropertyFormValues) => {
    setIsLoading(true);
    setError(null);

    try {
      const updatedProperty = await propertyService.updateProperty(property.id, {
        ...values,
        location: {
          city: values.city,
          country: values.country,
          address: values.address,
        },
      });

      if (updatedProperty) {
        router.push(`/properties/${updatedProperty.id}`);
      } else {
        setError('No se pudo actualizar la propiedad');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar la propiedad');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Título</FormLabel>
              <FormControl>
                <Input placeholder="Ej: Casa moderna con vista al mar" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descripción</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe tu propiedad..."
                  className="min-h-[120px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ciudad</FormLabel>
                <FormControl>
                  <Input placeholder="Barcelona" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="country"
            render={({ field }) => (
              <FormItem>
                <FormLabel>País</FormLabel>
                <FormControl>
                  <Input placeholder="España" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Dirección</FormLabel>
                <FormControl>
                  <Input placeholder="Calle Principal, 123" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="pricePerNight"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Precio por noche (€)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="100"
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="bedrooms"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Habitaciones</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="2"
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="bathrooms"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Baños</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="1"
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="maxGuests"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Capacidad máxima de huéspedes</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="4"
                  {...field}
                  onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div>
          <FormLabel>Imágenes (URLs)</FormLabel>
          <div className="space-y-2">
            <div className="flex gap-2">
              <Input
                placeholder="https://ejemplo.com/imagen.jpg"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addImage();
                  }
                }}
              />
              <Button type="button" onClick={addImage} variant="outline">
                Agregar
              </Button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {form.watch('images').map((img, index) => (
                <div key={index} className="relative group">
                  <img src={img} alt={`Imagen ${index + 1}`} className="w-full h-24 object-cover rounded" />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
          {form.formState.errors.images && (
            <p className="text-sm text-red-500 mt-1">{form.formState.errors.images.message}</p>
          )}
        </div>

        <div>
          <FormLabel>Amenities</FormLabel>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
            {availableAmenities.map((amenity) => (
              <div key={amenity} className="flex items-center space-x-2">
                <Checkbox
                  id={`amenity-${amenity}`}
                  checked={form.watch('amenities').includes(amenity)}
                  onCheckedChange={() => toggleAmenity(amenity)}
                />
                <label
                  htmlFor={`amenity-${amenity}`}
                  className="text-sm cursor-pointer"
                >
                  {amenity}
                </label>
              </div>
            ))}
          </div>
          {form.formState.errors.amenities && (
            <p className="text-sm text-red-500 mt-1">{form.formState.errors.amenities.message}</p>
          )}
        </div>

        <Button
          type="submit"
          className="w-full bg-airbnb-primary-100 hover:bg-airbnb-primary-100/90 text-white"
          disabled={isLoading}
        >
          {isLoading ? 'Guardando...' : 'Guardar Cambios'}
        </Button>
      </form>
    </Form>
  );
}

