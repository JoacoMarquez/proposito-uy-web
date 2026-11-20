-- Sección Cultivo (nov 2026).
-- ⚠️ Correr en la DB de PRODUCCIÓN (connection string desde el dashboard de Neon)
-- ANTES de mergear a main: el auto-deploy sube código que consulta estas columnas.
-- Es idempotente: se puede correr más de una vez sin romper nada.

ALTER TABLE categorias ADD COLUMN IF NOT EXISTS seccion text NOT NULL DEFAULT 'tienda';
ALTER TABLE categorias ADD COLUMN IF NOT EXISTS tipo text;

ALTER TABLE productos ADD COLUMN IF NOT EXISTS especificaciones jsonb NOT NULL DEFAULT '{}'::jsonb;
ALTER TABLE productos ADD COLUMN IF NOT EXISTS archivo_key text;
ALTER TABLE productos ADD COLUMN IF NOT EXISTS archivo_nombre text;
ALTER TABLE productos ADD COLUMN IF NOT EXISTS archivo_bytes integer;

-- Las tres categorías fijas de Cultivo (textos e imagen editables desde el panel).
INSERT INTO categorias (slug, nombre, descripcion, seccion, tipo, orden) VALUES
  ('plantines', 'Plantines', 'Plantas ornamentales, aromáticas y frutales.', 'cultivo', 'plantines', 0),
  ('insumos', 'Insumos', 'Productos prácticos para cultivar y cuidar tus plantas.', 'cultivo', 'insumos', 1),
  ('conocimiento', 'Conocimiento', 'Guías prácticas para aprender y cultivar.', 'cultivo', 'conocimiento', 2)
ON CONFLICT (slug) DO NOTHING;

-- PDFs de Cultivo (R2): envío por mail con links de descarga y topes de uso.
ALTER TABLE pedidos ADD COLUMN IF NOT EXISTS pdf_enviado_en timestamp;

CREATE TABLE IF NOT EXISTS descargas (
  id serial PRIMARY KEY,
  token_hash text NOT NULL UNIQUE,
  pedido_id integer NOT NULL REFERENCES pedidos(id) ON DELETE CASCADE,
  producto_id integer NOT NULL REFERENCES productos(id) ON DELETE CASCADE,
  usos integer NOT NULL DEFAULT 0,
  creado_en timestamp NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS uso_archivos (
  mes text PRIMARY KEY,
  escrituras integer NOT NULL DEFAULT 0,
  lecturas integer NOT NULL DEFAULT 0
);
