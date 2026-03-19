# Mercanto 🛍️

Plataforma de marketplace que conecta compradores con múltiples tiendas locales. Permite explorar productos por categoría, visualizar tiendas en un mapa interactivo y gestionar un carrito de compras unificado.

## ✨ Funcionalidades

- 🛒 Carrito de compras con regla anti-mezcla entre tiendas
- 🗂️ Filtrado de categorías compartido en toda la app
- 🗺️ Mapa interactivo con OpenStreetMap
- 🏪 20 tiendas con productos reales
- 💳 Flujo de checkout con estado de éxito (`/pedido`)

## 🛠️ Stack tecnológico

| Capa | Tecnología |
|------|-----------|
| Monorepo | pnpm workspaces |
| Frontend | React + Vite + TypeScript 5.9 |
| Backend | Express 5 |
| Base de datos | PostgreSQL + Drizzle ORM |
| Validación | Zod v4 + drizzle-zod |
| API | OpenAPI 3.1 + Orval codegen |
| Build | esbuild (CJS) + Vite |

## 📁 Estructura del proyecto

```
Mercantoapp/
├── artifacts/
│   └── mercanto/          # Aplicación frontend (Vite + React)
├── lib/
│   ├── api-spec/          # Spec OpenAPI + config Orval
│   ├── api-client-react/  # React Query hooks generados
│   ├── api-zod/           # Schemas Zod generados
│   └── db/                # Drizzle ORM schema + conexión DB
├── scripts/               # Scripts utilitarios TypeScript
├── pnpm-workspace.yaml
├── tsconfig.base.json
└── package.json
```

## 🚀 Instalación y desarrollo local

### Requisitos previos

- Node.js 24+
- pnpm
- PostgreSQL

### Pasos

```bash
# 1. Clonar el repositorio
git clone https://github.com/cponce123com-create/Mercantoapp.git
cd Mercantoapp

# 2. Instalar dependencias
pnpm install

# 3. Configurar variables de entorno
cp .env.example .env
# Edita .env con tus valores

# 4. Aplicar migraciones de base de datos
pnpm --filter @workspace/db run push

# 5. Iniciar en modo desarrollo
pnpm --filter mercanto run dev
```

La app estará disponible en `http://localhost:5173`

## ⚙️ Variables de entorno

Crea un archivo `.env` en la raíz con las siguientes variables:

```env
BASE_PATH=/
PORT=10000
DATABASE_URL=postgresql://usuario:contraseña@localhost:5432/mercanto
```

## 📦 Scripts disponibles

```bash
# Desarrollo
pnpm --filter mercanto run dev

# Build de producción
pnpm --filter mercanto run build

# Servidor de preview
pnpm --filter mercanto run serve

# Verificación de tipos TypeScript
pnpm run typecheck

# Regenerar código desde OpenAPI spec
pnpm --filter @workspace/api-spec run codegen
```

## 🌐 Deploy en Render

Este proyecto está configurado para desplegarse en [Render](https://render.com).

| Configuración | Valor |
|--------------|-------|
| Build Command | `pnpm install && pnpm --filter mercanto build` |
| Start Command | `pnpm --filter mercanto serve` |
| Node Version | 24 |

Variables de entorno requeridas en Render: `BASE_PATH`, `PORT`, `DATABASE_URL`

## 📄 Licencia

Proyecto privado — todos los derechos reservados © 2026 Carlos Ponce.
