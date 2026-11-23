-- Sección Cultivo (nov 2026).
-- ⚠️ Correr en la DB de PRODUCCIÓN (connection string desde el dashboard de Neon)
-- ANTES de mergear a main: el auto-deploy sube código que consulta estas columnas.
-- Es idempotente: se puede correr más de una vez sin romper nada.

ALTER TABLE categorias ADD COLUMN IF NOT EXISTS seccion text NOT NULL DEFAULT 'tienda';
ALTER TABLE categorias ADD COLUMN IF NOT EXISTS tipo text;

ALTER TABLE productos ADD COLUMN IF NOT EXISTS especificaciones jsonb NOT NULL DEFAULT '{}'::jsonb;

-- Las tres categorías fijas de Cultivo (textos e imagen editables desde el panel).
INSERT INTO categorias (slug, nombre, descripcion, seccion, tipo, orden) VALUES
  ('plantines', 'Plantines', 'Plantas ornamentales, aromáticas y frutales.', 'cultivo', 'plantines', 0),
  ('insumos', 'Insumos', 'Productos prácticos para cultivar y cuidar tus plantas.', 'cultivo', 'insumos', 1),
  ('cosechas', 'Cosechas', 'Verduras y hierbas frescas de nuestra huerta, según temporada y disponibilidad.', 'cultivo', 'cosechas', 2)
ON CONFLICT (slug) DO NOTHING;
