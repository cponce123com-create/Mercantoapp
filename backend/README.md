# Mercanto Backend API

Backend REST API para Mercanto construido con **Hono**, **Drizzle ORM** y **PostgreSQL**.

## 🎯 Características

- ✅ API REST con endpoints CRUD completos
- ✅ Validación de entrada con Zod
- ✅ Estructura modular por entidades
- ✅ Manejo global de errores
- ✅ CORS configurado
- ✅ Healthcheck endpoint
- ✅ Logging de requests
- ✅ Relaciones entre tablas con Drizzle ORM

## 📋 Requisitos

- Node.js >= 18.0.0
- PostgreSQL >= 12
- pnpm (recomendado) o npm

## 🚀 Instalación

1. **Clonar el repositorio**

```bash
cd backend
```

2. **Instalar dependencias**

```bash
pnpm install
# o
npm install
```

3. **Configurar variables de entorno**

```bash
cp .env.example .env
```

Editar `.env` con tus credenciales de PostgreSQL:

```env
NODE_ENV=development
PORT=3001
DATABASE_URL=postgresql://user:password@localhost:5432/mercanto
LOG_LEVEL=debug
CORS_ORIGIN=http://localhost:3000
```

4. **Crear base de datos**

```bash
# Generar migraciones
pnpm run db:generate

# Ejecutar migraciones
pnpm run db:migrate
```

5. **Iniciar servidor**

```bash
# Desarrollo con hot reload
pnpm run dev

# Producción
pnpm run build
pnpm run start
```

El servidor estará disponible en `http://localhost:3001`

## 📚 Endpoints

### Health Check

```
GET /api/healthz
GET /api/health
```

### Stores (Tiendas)

```
GET    /api/stores              # Listar tiendas
POST   /api/stores              # Crear tienda
GET    /api/stores/:id          # Obtener tienda por ID
PUT    /api/stores/:id          # Actualizar tienda
DELETE /api/stores/:id          # Eliminar tienda
```

**Crear tienda:**
```json
POST /api/stores
{
  "owner_id": 1,
  "name": "Mi Tienda",
  "description": "Descripción de la tienda",
  "email": "tienda@example.com",
  "phone": "+34123456789",
  "address": "Calle Principal 123",
  "city": "Madrid",
  "country": "España",
  "logo_url": "https://example.com/logo.png",
  "is_active": true
}
```

### Products (Productos)

```
GET    /api/products/store/:storeId  # Listar productos de una tienda
POST   /api/products                 # Crear producto
GET    /api/products/:id             # Obtener producto por ID
PUT    /api/products/:id             # Actualizar producto
DELETE /api/products/:id             # Eliminar producto
```

**Crear producto:**
```json
POST /api/products
{
  "store_id": 1,
  "name": "Producto Ejemplo",
  "description": "Descripción del producto",
  "price": "29.99",
  "stock": 100,
  "sku": "PROD-001",
  "category": "Electrónica",
  "image_url": "https://example.com/product.jpg",
  "is_active": true
}
```

### Orders (Pedidos)

```
GET    /api/orders              # Listar pedidos
POST   /api/orders              # Crear pedido
GET    /api/orders/:id          # Obtener pedido con items
PATCH  /api/orders/:id/status   # Actualizar estado del pedido
POST   /api/orders/:id/cancel   # Cancelar pedido
```

**Crear pedido:**
```json
POST /api/orders
{
  "user_id": 1,
  "store_id": 1,
  "shipping_address": "Calle Principal 456, Madrid, 28001",
  "notes": "Entregar entre 9 y 17 horas",
  "items": [
    {
      "product_id": 1,
      "quantity": 2
    },
    {
      "product_id": 2,
      "quantity": 1
    }
  ]
}
```

**Actualizar estado del pedido:**
```json
PATCH /api/orders/1/status
{
  "status": "confirmed"
}
```

Estados válidos: `pending`, `confirmed`, `shipped`, `delivered`, `cancelled`

## 📊 Estructura de Base de Datos

### Users (Usuarios)
- `id`: Identificador único
- `email`: Email único
- `name`: Nombre del usuario
- `password_hash`: Hash de contraseña
- `role`: Rol (admin, store_owner, customer)
- `created_at`: Fecha de creación
- `updated_at`: Fecha de actualización

### Stores (Tiendas)
- `id`: Identificador único
- `owner_id`: ID del propietario (FK)
- `name`: Nombre de la tienda
- `description`: Descripción
- `email`: Email de contacto
- `phone`: Teléfono
- `address`: Dirección
- `city`: Ciudad
- `country`: País
- `logo_url`: URL del logo
- `is_active`: Estado activo/inactivo
- `created_at`: Fecha de creación
- `updated_at`: Fecha de actualización

### Products (Productos)
- `id`: Identificador único
- `store_id`: ID de la tienda (FK)
- `name`: Nombre del producto
- `description`: Descripción
- `price`: Precio (decimal)
- `stock`: Stock disponible
- `sku`: Código SKU único
- `category`: Categoría
- `image_url`: URL de imagen
- `is_active`: Estado activo/inactivo
- `created_at`: Fecha de creación
- `updated_at`: Fecha de actualización

### Orders (Pedidos)
- `id`: Identificador único
- `user_id`: ID del usuario (FK)
- `store_id`: ID de la tienda (FK)
- `status`: Estado del pedido
- `total_amount`: Monto total (decimal)
- `shipping_address`: Dirección de envío
- `notes`: Notas adicionales
- `created_at`: Fecha de creación
- `updated_at`: Fecha de actualización

### OrderItems (Items del Pedido)
- `id`: Identificador único
- `order_id`: ID del pedido (FK)
- `product_id`: ID del producto (FK)
- `quantity`: Cantidad
- `unit_price`: Precio unitario
- `subtotal`: Subtotal del item
- `created_at`: Fecha de creación

## 🧪 Testing

```bash
# Ejecutar tests
pnpm run test

# Ejecutar tests en modo watch
pnpm run test:watch
```

## 📝 Validación

Todos los endpoints validan la entrada usando **Zod**. Los errores de validación retornan:

```json
{
  "success": false,
  "error": "Validación fallida",
  "errors": [
    {
      "field": "email",
      "message": "Email inválido"
    }
  ]
}
```

## 🔒 Manejo de Errores

La API retorna respuestas consistentes:

**Éxito:**
```json
{
  "success": true,
  "data": { /* datos */ }
}
```

**Error:**
```json
{
  "success": false,
  "error": "Descripción del error"
}
```

## 🛠️ Desarrollo

### Agregar una nueva entidad

1. **Definir esquema en `src/db/schema.ts`**
2. **Crear validadores en `src/validators/`**
3. **Crear controlador en `src/controllers/`**
4. **Crear rutas en `src/routes/`**
5. **Registrar rutas en `src/index.ts`**

### Generar migraciones después de cambios en schema

```bash
pnpm run db:generate
pnpm run db:migrate
```

## 📦 Dependencias principales

- **hono**: Framework web ligero
- **drizzle-orm**: ORM type-safe
- **pg**: Cliente PostgreSQL
- **zod**: Validación de esquemas
- **dotenv**: Gestión de variables de entorno

## 📄 Licencia

MIT

## 👤 Autor

Mercanto Team

---

**Última actualización:** Marzo 2026
