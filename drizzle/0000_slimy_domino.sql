CREATE TABLE "categorias" (
	"slug" text PRIMARY KEY NOT NULL,
	"nombre" text NOT NULL,
	"descripcion" text NOT NULL,
	"descripcion_general" text DEFAULT '' NOT NULL,
	"caracteristicas" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"notas_creador" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"orden" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "pedido_items" (
	"id" serial PRIMARY KEY NOT NULL,
	"pedido_id" integer NOT NULL,
	"producto_slug" text NOT NULL,
	"nombre" text NOT NULL,
	"presentacion" text NOT NULL,
	"precio_unitario" integer NOT NULL,
	"cantidad" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "pedidos" (
	"id" serial PRIMARY KEY NOT NULL,
	"numero" text NOT NULL,
	"nombre" text NOT NULL,
	"celular" text NOT NULL,
	"email" text NOT NULL,
	"direccion" text,
	"notas" text,
	"modalidad" text NOT NULL,
	"agenda" text NOT NULL,
	"metodo_pago" text NOT NULL,
	"subtotal" integer NOT NULL,
	"costo_envio" integer DEFAULT 0 NOT NULL,
	"total" integer NOT NULL,
	"estado" text DEFAULT 'pendiente' NOT NULL,
	"creado_en" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "pedidos_numero_unique" UNIQUE("numero")
);
--> statement-breakpoint
CREATE TABLE "preguntas" (
	"id" serial PRIMARY KEY NOT NULL,
	"tema" text NOT NULL,
	"pregunta" text NOT NULL,
	"micro_resumen" text NOT NULL,
	"desarrollo" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"orden" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "presentaciones" (
	"id" serial PRIMARY KEY NOT NULL,
	"producto_id" integer NOT NULL,
	"label" text NOT NULL,
	"precio" integer NOT NULL,
	"orden" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "productos" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"nombre" text NOT NULL,
	"variante" text NOT NULL,
	"categoria_slug" text NOT NULL,
	"descripcion" text NOT NULL,
	"texto_informativo" text,
	"ingredientes" text NOT NULL,
	"packaging" text NOT NULL,
	"conservacion" text NOT NULL,
	"uso" text,
	"vencimiento" text NOT NULL,
	"tamano_unitario" text,
	"contenido" text,
	"nota" text,
	"producto_aliado_slug" text,
	"destacado" boolean DEFAULT false NOT NULL,
	"disponible" boolean DEFAULT true NOT NULL,
	"imagen" text,
	"orden" integer DEFAULT 0 NOT NULL,
	"creado_en" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "productos_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "recetas" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"titulo" text NOT NULL,
	"descripcion" text NOT NULL,
	"productos_aliados" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"almacenamiento_envase" text,
	"almacenamiento_vida_util" text,
	"rendimiento" jsonb,
	"ingredientes" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"procedimiento" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"imagen" text,
	"orden" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "recetas_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
ALTER TABLE "pedido_items" ADD CONSTRAINT "pedido_items_pedido_id_pedidos_id_fk" FOREIGN KEY ("pedido_id") REFERENCES "public"."pedidos"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "presentaciones" ADD CONSTRAINT "presentaciones_producto_id_productos_id_fk" FOREIGN KEY ("producto_id") REFERENCES "public"."productos"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "productos" ADD CONSTRAINT "productos_categoria_slug_categorias_slug_fk" FOREIGN KEY ("categoria_slug") REFERENCES "public"."categorias"("slug") ON DELETE no action ON UPDATE no action;