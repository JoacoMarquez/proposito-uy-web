// Esquema de la base de datos (Drizzle + Postgres).
// Refleja la estructura de contenido del sitio. Es la fuente de verdad editable
// desde el panel /admin.

import {
  pgTable,
  serial,
  text,
  integer,
  boolean,
  timestamp,
  jsonb,
} from "drizzle-orm/pg-core";

// ── Contenido de tienda ───────────────────────────────────

export const categorias = pgTable("categorias", {
  slug: text("slug").primaryKey(), // "secos" | "humedos" | "barras"
  nombre: text("nombre").notNull(),
  descripcion: text("descripcion").notNull(),
  descripcionGeneral: text("descripcion_general").notNull().default(""),
  caracteristicas: jsonb("caracteristicas").$type<string[]>().notNull().default([]),
  notasCreador: jsonb("notas_creador").$type<string[]>().notNull().default([]),
  imagen: text("imagen"),
  orden: integer("orden").notNull().default(0),
});

export const productos = pgTable("productos", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  nombre: text("nombre").notNull(),
  variante: text("variante").notNull(),
  categoriaSlug: text("categoria_slug")
    .notNull()
    .references(() => categorias.slug),
  descripcion: text("descripcion").notNull(),
  textoInformativo: text("texto_informativo"),
  ingredientes: text("ingredientes").notNull(),
  packaging: text("packaging").notNull(),
  conservacion: text("conservacion").notNull(),
  uso: text("uso"),
  vencimiento: text("vencimiento").notNull(),
  tamanoUnitario: text("tamano_unitario"),
  contenido: text("contenido"),
  nota: text("nota"),
  productoAliadoSlug: text("producto_aliado_slug"),
  destacado: boolean("destacado").notNull().default(false),
  disponible: boolean("disponible").notNull().default(true),
  imagen: text("imagen"),
  imagen2: text("imagen2"), // segunda foto opcional (packaging / complementaria)
  orden: integer("orden").notNull().default(0),
  creadoEn: timestamp("creado_en").notNull().defaultNow(),
});

export const presentaciones = pgTable("presentaciones", {
  id: serial("id").primaryKey(),
  productoId: integer("producto_id")
    .notNull()
    .references(() => productos.id, { onDelete: "cascade" }),
  label: text("label").notNull(),
  precio: integer("precio").notNull(), // pesos uruguayos
  orden: integer("orden").notNull().default(0),
});

export const recetas = pgTable("recetas", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  titulo: text("titulo").notNull(),
  descripcion: text("descripcion").notNull(),
  productosAliados: jsonb("productos_aliados").$type<string[]>().notNull().default([]),
  almacenamientoEnvase: text("almacenamiento_envase"),
  almacenamientoVidaUtil: text("almacenamiento_vida_util"),
  rendimiento: jsonb("rendimiento").$type<Record<string, string>>(),
  ingredientes: jsonb("ingredientes").$type<string[]>().notNull().default([]),
  procedimiento: jsonb("procedimiento").$type<string[]>().notNull().default([]),
  materiales: jsonb("materiales").$type<string[]>().notNull().default([]), // utensilios necesarios
  notas: jsonb("notas").$type<string[]>().notNull().default([]),
  imagen: text("imagen"),
  imagen2: text("imagen2"), // segunda foto opcional (complementaria)
  orden: integer("orden").notNull().default(0),
});

export const preguntas = pgTable("preguntas", {
  id: serial("id").primaryKey(),
  tema: text("tema").notNull(), // "pedidos" | "elaboracion" | "nutricional"
  pregunta: text("pregunta").notNull(),
  microResumen: text("micro_resumen").notNull(),
  desarrollo: jsonb("desarrollo").$type<string[]>().notNull().default([]),
  orden: integer("orden").notNull().default(0),
});

// ── Pedidos ───────────────────────────────────────────────

export const pedidos = pgTable("pedidos", {
  id: serial("id").primaryKey(),
  numero: text("numero").notNull().unique(), // número de pedido visible
  // datos del cliente
  nombre: text("nombre").notNull(),
  celular: text("celular").notNull(),
  email: text("email").notNull(),
  direccion: text("direccion"),
  notas: text("notas"),
  // logística
  modalidad: text("modalidad").notNull(), // "entrega" | "retiro"
  agenda: text("agenda").notNull(), // "miercoles" | "viernes" | "coordinacion"
  fechaAgenda: text("fecha_agenda"), // ISO YYYY-MM-DD del día elegido; null si es coordinación
  metodoPago: text("metodo_pago").notNull(), // "transferencia" | "efectivo"
  // montos
  subtotal: integer("subtotal").notNull(),
  costoEnvio: integer("costo_envio").notNull().default(0),
  total: integer("total").notNull(),
  estado: text("estado").notNull().default("pendiente"), // pendiente | confirmado | entregado | cancelado
  estadoPago: text("estado_pago").notNull().default("pendiente"), // pendiente | pagado (separado del estado del pedido)
  clienteId: integer("cliente_id"), // cuenta del cliente, si compró logueado (null si invitado)
  creadoEn: timestamp("creado_en").notNull().defaultNow(),
});

export const pedidoItems = pgTable("pedido_items", {
  id: serial("id").primaryKey(),
  pedidoId: integer("pedido_id")
    .notNull()
    .references(() => pedidos.id, { onDelete: "cascade" }),
  productoSlug: text("producto_slug").notNull(),
  nombre: text("nombre").notNull(), // snapshot del nombre al momento del pedido
  presentacion: text("presentacion").notNull(),
  precioUnitario: integer("precio_unitario").notNull(),
  cantidad: integer("cantidad").notNull(),
});

// ── Administración / auth ─────────────────────────────────

export const adminUsers = pgTable("admin_users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  creadoEn: timestamp("creado_en").notNull().defaultNow(),
});

export const adminSessions = pgTable("admin_sessions", {
  id: text("id").primaryKey(), // hash del token de sesión
  userId: integer("user_id")
    .notNull()
    .references(() => adminUsers.id, { onDelete: "cascade" }),
  expiraEn: timestamp("expira_en").notNull(),
});

// ── Cuentas de cliente ────────────────────────────────────

export const clientes = pgTable("clientes", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  nombre: text("nombre").notNull(),
  celular: text("celular"),
  direcciones: jsonb("direcciones").$type<string[]>().notNull().default([]),
  creadoEn: timestamp("creado_en").notNull().defaultNow(),
});

export const clienteSessions = pgTable("cliente_sessions", {
  id: text("id").primaryKey(), // hash del token de sesión
  clienteId: integer("cliente_id")
    .notNull()
    .references(() => clientes.id, { onDelete: "cascade" }),
  expiraEn: timestamp("expira_en").notNull(),
});

// Imágenes subidas desde el panel, guardadas en la propia base (Neon) para no
// depender de un blob store externo. `data` es el binario en base64; se sirven
// desde /api/img/[id]. El campo `imagen` de productos/recetas guarda esa URL.
export const imagenes = pgTable("imagenes", {
  id: serial("id").primaryKey(),
  data: text("data").notNull(), // contenido del archivo en base64
  mime: text("mime").notNull(), // ej. "image/webp"
  creadoEn: timestamp("creado_en").notNull().defaultNow(),
});

// Suscriptores al newsletter (formulario del footer).
export const suscriptores = pgTable("suscriptores", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  creadoEn: timestamp("creado_en").notNull().defaultNow(),
});

// Tabla genérica de configuración clave/valor. Reservada para flags de sistema.
// (Los horarios de retiro/entrega ahora viven en el contenido de la página
// "tienda", tabla `paginas`.) Se mantiene para no forzar un DROP en la base.
export const configuracion = pgTable("configuracion", {
  clave: text("clave").primaryKey(),
  valor: text("valor").notNull(),
});

// Contenido editable de las páginas estáticas (textos, links, imágenes, listas).
// Un row por página; `bloques` guarda el objeto JSON de esa página. La FORMA de
// cada página y sus defaults (= los literales hoy hardcodeados) viven en el
// esquema en código src/db/paginas-esquema.ts, no en la DB. Por eso esta tabla
// NO se seedea: arranca vacía (getContenido cae a los defaults) y la primera
// fila se crea al primer "Guardar" del panel — re-seedear nunca pisa ediciones.
export const paginas = pgTable("paginas", {
  slug: text("slug").primaryKey(), // "inicio" | "contacto" | "nosotros" | "ajustes" ...
  bloques: jsonb("bloques").$type<Record<string, unknown>>().notNull().default({}),
  actualizadoEn: timestamp("actualizado_en").notNull().defaultNow(),
});

// Tipos inferidos para usar en la app
export type Producto = typeof productos.$inferSelect;
export type Presentacion = typeof presentaciones.$inferSelect;
export type Categoria = typeof categorias.$inferSelect;
export type Receta = typeof recetas.$inferSelect;
export type Pregunta = typeof preguntas.$inferSelect;
export type Pedido = typeof pedidos.$inferSelect;
export type PedidoItem = typeof pedidoItems.$inferSelect;
export type Cliente = typeof clientes.$inferSelect;
export type Suscriptor = typeof suscriptores.$inferSelect;
export type Imagen = typeof imagenes.$inferSelect;
export type Pagina = typeof paginas.$inferSelect;
