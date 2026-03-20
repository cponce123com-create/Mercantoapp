-- Migración para agregar campos faltantes a la tabla products
ALTER TABLE products ADD COLUMN IF NOT EXISTS original_price DECIMAL(10, 2);
ALTER TABLE products ADD COLUMN IF NOT EXISTS discount_price DECIMAL(10, 2);
ALTER TABLE products ADD COLUMN IF NOT EXISTS discount_percentage INTEGER;
ALTER TABLE products ADD COLUMN IF NOT EXISTS images JSONB DEFAULT '[]'::jsonb;
