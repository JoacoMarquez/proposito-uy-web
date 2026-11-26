-- Ajustes de Cultivo (consigna de Pedro del 25/11/2026).
-- ⚠️ Correr en la DB de PRODUCCIÓN (connection string desde Neon) ANTES de mergear.
-- Es idempotente: se puede correr más de una vez.

-- Imagen para celular de las tarjetas de categoría.
ALTER TABLE categorias ADD COLUMN IF NOT EXISTS imagen_movil text;

-- Asesoramiento por WhatsApp incluido (distintivo + recuadro en la ficha).
ALTER TABLE productos ADD COLUMN IF NOT EXISTS asesoramiento boolean NOT NULL DEFAULT false;
ALTER TABLE productos ADD COLUMN IF NOT EXISTS asesoramiento_texto text;

-- Se elimina la categoría Cosechas. Solo se borra si no tiene productos: si la
-- consulta de abajo devuelve algo, hay que mover o borrar esos productos desde
-- el panel y volver a correr este script.
SELECT slug, nombre FROM productos WHERE categoria_slug = 'cosechas';
DELETE FROM categorias
WHERE slug = 'cosechas'
  AND NOT EXISTS (SELECT 1 FROM productos WHERE categoria_slug = 'cosechas');
