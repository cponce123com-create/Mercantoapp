import {
  pgTable,
  serial,
  varchar,
  text,
  timestamp,
  decimal,
  integer,
  boolean,
  foreignKey,
  index,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// ============================================================================
// USERS TABLE
// ============================================================================
export const users = pgTable(
  'users',
  {
    id: serial('id').primaryKey(),
    email: varchar('email', { length: 255 }).notNull().unique(),
    name: varchar('name', { length: 255 }).notNull(),
    password_hash: varchar('password_hash', { length: 255 }).notNull(),
    role: varchar('role', { length: 50 }).default('customer').notNull(), // 'admin', 'store_owner', 'customer'
    created_at: timestamp('created_at').defaultNow().notNull(),
    updated_at: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => ({
    emailIdx: index('users_email_idx').on(table.email),
  })
);

export const usersRelations = relations(users, ({ many }) => ({
  stores: many(stores),
  orders: many(orders),
}));

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

// ============================================================================
// STORES TABLE
// ============================================================================
export const stores = pgTable(
  'stores',
  {
    id: serial('id').primaryKey(),
    owner_id: integer('owner_id').notNull(),
    name: varchar('name', { length: 255 }).notNull(),
    description: text('description'),
    email: varchar('email', { length: 255 }).notNull(),
    phone: varchar('phone', { length: 20 }),
    address: text('address'),
    city: varchar('city', { length: 100 }),
    country: varchar('country', { length: 100 }),
    logo_url: varchar('logo_url', { length: 500 }),
    status: varchar('status', { length: 50 }).default('pending').notNull(), // 'pending', 'approved', 'rejected'
    is_active: boolean('is_active').default(true).notNull(),
    created_at: timestamp('created_at').defaultNow().notNull(),
    updated_at: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => ({
    ownerIdFk: foreignKey({
      columns: [table.owner_id],
      foreignColumns: [users.id],
    }),
    ownerIdIdx: index('stores_owner_id_idx').on(table.owner_id),
    nameIdx: index('stores_name_idx').on(table.name),
  })
);

export const storesRelations = relations(stores, ({ one, many }) => ({
  owner: one(users, {
    fields: [stores.owner_id],
    references: [users.id],
  }),
  products: many(products),
  orders: many(orders),
}));

export type Store = typeof stores.$inferSelect;
export type NewStore = typeof stores.$inferInsert;

// ============================================================================
// PRODUCTS TABLE
// ============================================================================
export const products = pgTable(
  'products',
  {
    id: serial('id').primaryKey(),
    store_id: integer('store_id').notNull(),
    name: varchar('name', { length: 255 }).notNull(),
    description: text('description'),
    price: decimal('price', { precision: 10, scale: 2 }).notNull(),
    stock: integer('stock').default(0).notNull(),
    sku: varchar('sku', { length: 100 }).unique(),
    category: varchar('category', { length: 100 }),
    image_url: varchar('image_url', { length: 500 }),
    is_active: boolean('is_active').default(true).notNull(),
    created_at: timestamp('created_at').defaultNow().notNull(),
    updated_at: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => ({
    storeIdFk: foreignKey({
      columns: [table.store_id],
      foreignColumns: [stores.id],
    }),
    storeIdIdx: index('products_store_id_idx').on(table.store_id),
    categoryIdx: index('products_category_idx').on(table.category),
    skuIdx: index('products_sku_idx').on(table.sku),
  })
);

export const productsRelations = relations(products, ({ one, many }) => ({
  store: one(stores, {
    fields: [products.store_id],
    references: [stores.id],
  }),
  order_items: many(order_items),
}));

export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;

// ============================================================================
// ORDERS TABLE
// ============================================================================
export const orders = pgTable(
  'orders',
  {
    id: serial('id').primaryKey(),
    user_id: integer('user_id').notNull(),
    store_id: integer('store_id').notNull(),
    status: varchar('status', { length: 50 }).default('pending').notNull(), // 'pending', 'confirmed', 'shipped', 'delivered', 'cancelled'
    total_amount: decimal('total_amount', { precision: 10, scale: 2 }).notNull(),
    shipping_address: text('shipping_address').notNull(),
    notes: text('notes'),
    created_at: timestamp('created_at').defaultNow().notNull(),
    updated_at: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => ({
    userIdFk: foreignKey({
      columns: [table.user_id],
      foreignColumns: [users.id],
    }),
    storeIdFk: foreignKey({
      columns: [table.store_id],
      foreignColumns: [stores.id],
    }),
    userIdIdx: index('orders_user_id_idx').on(table.user_id),
    storeIdIdx: index('orders_store_id_idx').on(table.store_id),
    statusIdx: index('orders_status_idx').on(table.status),
  })
);

export const ordersRelations = relations(orders, ({ one, many }) => ({
  user: one(users, {
    fields: [orders.user_id],
    references: [users.id],
  }),
  store: one(stores, {
    fields: [orders.store_id],
    references: [stores.id],
  }),
  items: many(order_items),
}));

export type Order = typeof orders.$inferSelect;
export type NewOrder = typeof orders.$inferInsert;

// ============================================================================
// ORDER_ITEMS TABLE
// ============================================================================
export const order_items = pgTable(
  'order_items',
  {
    id: serial('id').primaryKey(),
    order_id: integer('order_id').notNull(),
    product_id: integer('product_id').notNull(),
    quantity: integer('quantity').notNull(),
    unit_price: decimal('unit_price', { precision: 10, scale: 2 }).notNull(),
    subtotal: decimal('subtotal', { precision: 10, scale: 2 }).notNull(),
    created_at: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => ({
    orderIdFk: foreignKey({
      columns: [table.order_id],
      foreignColumns: [orders.id],
    }),
    productIdFk: foreignKey({
      columns: [table.product_id],
      foreignColumns: [products.id],
    }),
    orderIdIdx: index('order_items_order_id_idx').on(table.order_id),
    productIdIdx: index('order_items_product_id_idx').on(table.product_id),
  })
);

export const order_itemsRelations = relations(order_items, ({ one }) => ({
  order: one(orders, {
    fields: [order_items.order_id],
    references: [orders.id],
  }),
  product: one(products, {
    fields: [order_items.product_id],
    references: [products.id],
  }),
}));

export type OrderItem = typeof order_items.$inferSelect;
export type NewOrderItem = typeof order_items.$inferInsert;
