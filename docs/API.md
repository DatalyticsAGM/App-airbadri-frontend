# 📡 Documentación de API

Esta documentación describe los endpoints esperados del backend para integrar con la aplicación.

## 🔐 Autenticación

### POST /auth/signup
Registra un nuevo usuario.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "fullName": "John Doe"
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "user_123",
    "email": "user@example.com",
    "fullName": "John Doe",
    "createdAt": "2024-01-01T00:00:00Z"
  },
  "token": "jwt_token_here"
}
```

### POST /auth/login
Inicia sesión de usuario.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "user": { ... },
  "token": "jwt_token_here"
}
```

### POST /auth/logout
Cierra sesión.

**Headers:**
```
Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true
}
```

### GET /auth/me
Obtiene el usuario actual.

**Headers:**
```
Authorization: Bearer {token}
```

**Response:**
```json
{
  "id": "user_123",
  "email": "user@example.com",
  "fullName": "John Doe",
  "createdAt": "2024-01-01T00:00:00Z"
}
```

### POST /auth/forgot-password
Solicita reset de contraseña.

**Request:**
```json
{
  "email": "user@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Reset email sent"
}
```

### POST /auth/reset-password
Resetea la contraseña con token.

**Request:**
```json
{
  "token": "reset_token",
  "password": "newpassword123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Password reset successfully"
}
```

## 🏠 Propiedades

### GET /properties
Obtiene todas las propiedades.

**Query Parameters:**
- `hostId` (opcional): Filtrar por host
- `location` (opcional): Filtrar por ubicación
- `minPrice` (opcional): Precio mínimo
- `maxPrice` (opcional): Precio máximo

**Response:**
```json
[
  {
    "id": "prop_123",
    "title": "Beautiful Apartment",
    "description": "...",
    "location": "Barcelona, Spain",
    "pricePerNight": 100,
    "images": ["https://..."],
    "amenities": ["wifi", "parking"],
    "bedrooms": 2,
    "bathrooms": 1,
    "maxGuests": 4,
    "propertyType": "apartment",
    "hostId": "host_123",
    "hostName": "John Doe",
    "rating": 4.5,
    "reviewCount": 25,
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
  }
]
```

### GET /properties/:id
Obtiene una propiedad por ID.

**Response:**
```json
{
  "id": "prop_123",
  ...
}
```

### POST /properties
Crea una nueva propiedad.

**Headers:**
```
Authorization: Bearer {token}
```

**Request:**
```json
{
  "title": "Beautiful Apartment",
  "description": "...",
  "location": "Barcelona, Spain",
  "pricePerNight": 100,
  "images": ["https://..."],
  "amenities": ["wifi", "parking"],
  "bedrooms": 2,
  "bathrooms": 1,
  "maxGuests": 4,
  "propertyType": "apartment"
}
```

**Response:**
```json
{
  "id": "prop_123",
  ...
}
```

### PATCH /properties/:id
Actualiza una propiedad.

**Headers:**
```
Authorization: Bearer {token}
```

**Request:**
```json
{
  "title": "Updated Title",
  "pricePerNight": 120
}
```

**Response:**
```json
{
  "id": "prop_123",
  ...
}
```

### DELETE /properties/:id
Elimina una propiedad.

**Headers:**
```
Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true
}
```

### GET /properties/search
Búsqueda avanzada de propiedades.

**Query Parameters:**
- `location` (opcional)
- `minPrice` (opcional)
- `maxPrice` (opcional)
- `propertyType` (opcional)
- `minRating` (opcional)
- `amenities` (opcional, array)
- `checkIn` (opcional, ISO date)
- `checkOut` (opcional, ISO date)
- `guests` (opcional)

**Response:**
```json
[
  { ... }
]
```

## 📅 Reservas

### POST /bookings
Crea una nueva reserva.

**Headers:**
```
Authorization: Bearer {token}
```

**Request:**
```json
{
  "propertyId": "prop_123",
  "checkIn": "2024-02-01T00:00:00Z",
  "checkOut": "2024-02-05T00:00:00Z",
  "guests": 2
}
```

**Response:**
```json
{
  "id": "booking_123",
  "propertyId": "prop_123",
  "userId": "user_123",
  "checkIn": "2024-02-01T00:00:00Z",
  "checkOut": "2024-02-05T00:00:00Z",
  "guests": 2,
  "totalPrice": 400,
  "status": "confirmed",
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-01T00:00:00Z"
}
```

### GET /bookings
Obtiene reservas del usuario actual.

**Headers:**
```
Authorization: Bearer {token}
```

**Query Parameters:**
- `userId` (opcional): Filtrar por usuario
- `propertyId` (opcional): Filtrar por propiedad

**Response:**
```json
[
  {
    "id": "booking_123",
    ...
  }
]
```

### GET /bookings/:id
Obtiene una reserva por ID.

**Headers:**
```
Authorization: Bearer {token}
```

**Response:**
```json
{
  "id": "booking_123",
  ...
}
```

### PATCH /bookings/:id
Actualiza el estado de una reserva.

**Headers:**
```
Authorization: Bearer {token}
```

**Request:**
```json
{
  "status": "cancelled"
}
```

**Response:**
```json
{
  "id": "booking_123",
  "status": "cancelled",
  ...
}
```

### POST /bookings/:id/cancel
Cancela una reserva.

**Headers:**
```
Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true
}
```

### GET /bookings/availability
Verifica disponibilidad de una propiedad.

**Query Parameters:**
- `propertyId`: ID de la propiedad
- `checkIn`: Fecha de entrada (ISO)
- `checkOut`: Fecha de salida (ISO)

**Response:**
```json
{
  "available": true,
  "conflictingBookings": []
}
```

## ⭐ Reviews

### GET /reviews
Obtiene reviews de una propiedad.

**Query Parameters:**
- `propertyId`: ID de la propiedad

**Response:**
```json
[
  {
    "id": "review_123",
    "propertyId": "prop_123",
    "userId": "user_123",
    "userName": "John Doe",
    "userAvatar": "https://...",
    "rating": 5,
    "comment": "Great place!",
    "date": "2024-01-01T00:00:00Z"
  }
]
```

### POST /reviews
Crea una review.

**Headers:**
```
Authorization: Bearer {token}
```

**Request:**
```json
{
  "propertyId": "prop_123",
  "rating": 5,
  "comment": "Great place!"
}
```

**Response:**
```json
{
  "id": "review_123",
  ...
}
```

## 🔔 Notificaciones

### GET /notifications
Obtiene notificaciones del usuario actual.

**Headers:**
```
Authorization: Bearer {token}
```

**Response:**
```json
[
  {
    "id": "notif_123",
    "userId": "user_123",
    "type": "booking_confirmed",
    "title": "Reserva confirmada",
    "message": "Tu reserva ha sido confirmada",
    "read": false,
    "date": "2024-01-01T00:00:00Z",
    "link": "/bookings/123"
  }
]
```

### POST /notifications/:id/read
Marca una notificación como leída.

**Headers:**
```
Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true
}
```

## ❌ Manejo de Errores

Todos los endpoints pueden retornar errores con el siguiente formato:

**Error Response:**
```json
{
  "error": {
    "message": "Error description",
    "code": "ERROR_CODE",
    "status": 400
  }
}
```

### Códigos de Estado HTTP
- `200`: Éxito
- `201`: Creado
- `400`: Bad Request (validación)
- `401`: Unauthorized (no autenticado)
- `403`: Forbidden (sin permisos)
- `404`: Not Found
- `500`: Internal Server Error

### Códigos de Error Comunes
- `VALIDATION_ERROR`: Error de validación
- `UNAUTHORIZED`: No autenticado
- `FORBIDDEN`: Sin permisos
- `NOT_FOUND`: Recurso no encontrado
- `CONFLICT`: Conflicto (ej: email ya existe)
- `NETWORK_ERROR`: Error de red

---

**Nota**: Esta documentación describe los endpoints esperados. La implementación real puede variar según el backend específico.

