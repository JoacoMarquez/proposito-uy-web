// Seed: vuelca el contenido de los archivos src/data/* a la base de datos.
// Ejecutar con: npm run db:seed (requiere DATABASE_URL en .env).

import "dotenv/config";
import { db } from "./index";
import { categorias, productos, presentaciones, recetas, preguntas } from "./schema";
import { categorias as dataCategorias, productos as dataProductos } from "../data/productos";
import { recetas as dataRecetas } from "../data/recetas";
import { preguntas as dataPreguntas } from "../data/preguntas";

async function seed() {
  console.log("🌱 Seed iniciado…");

  // Limpiar (orden por dependencias)
  await db.delete(presentaciones);
  await db.delete(productos);
  await db.delete(categorias);
  await db.delete(recetas);
  await db.delete(preguntas);

  // Categorías
  const ordenCat = ["secos", "humedos", "barras"] as const;
  for (let i = 0; i < ordenCat.length; i++) {
    const slug = ordenCat[i];
    const c = dataCategorias[slug];
    await db.insert(categorias).values({
      slug,
      nombre: c.nombre,
      descripcion: c.descripcion,
      descripcionGeneral: c.editorial.descripcionGeneral,
      caracteristicas: c.editorial.caracteristicas,
      notasCreador: c.editorial.notasCreador,
      imagen: c.imagen ?? null,
      orden: i,
    });
  }
  console.log(`  ✓ ${ordenCat.length} categorías`);

  // Retornabilidad: frascos a devolver para 1 gratis, por slug + label de la
  // presentación. Solo participan los frascos de vidrio de la categoría Húmedos.
  const RETORNABLES: Record<string, Record<string, number>> = {
    "hummus-garbanzo": { "280 g": 5 },
    "hummus-lentejon": { "280 g": 5 },
    "crema-caju": { "180 g": 6, "330 g": 9 },
    "crema-mani": { "390 g": 6, "1 kg": 6 },
  };

  // Productos + presentaciones
  const ordenPorCategoria: Record<string, number> = {};
  for (let i = 0; i < dataProductos.length; i++) {
    const p = dataProductos[i];
    const ordenCategoria = ordenPorCategoria[p.categoria] ?? 0;
    ordenPorCategoria[p.categoria] = ordenCategoria + 1;
    const [row] = await db
      .insert(productos)
      .values({
        slug: p.slug,
        nombre: p.nombre,
        variante: p.variante,
        categoriaSlug: p.categoria,
        descripcion: p.descripcion,
        textoInformativo: p.textoInformativo ?? null,
        ingredientes: p.ingredientes,
        packaging: p.packaging,
        conservacion: p.conservacion,
        uso: p.uso ?? null,
        vencimiento: p.vencimiento,
        tamanoUnitario: p.tamanoUnitario ?? null,
        contenido: p.contenido ?? null,
        nota: p.nota ?? null,
        productoAliadoSlug: p.productoAliado ?? null,
        destacado: p.destacado ?? false,
        imagen: p.imagen ?? null,
        orden: i,
        ordenCategoria,
      })
      .returning({ id: productos.id });

    await db.insert(presentaciones).values(
      p.presentaciones.map((pr, j) => ({
        productoId: row.id,
        label: pr.label,
        precio: pr.precio,
        frascosGratis: RETORNABLES[p.slug]?.[pr.label] ?? null,
        orden: j,
      })),
    );
  }
  console.log(`  ✓ ${dataProductos.length} productos`);

  // Recetas
  for (let i = 0; i < dataRecetas.length; i++) {
    const r = dataRecetas[i];
    await db.insert(recetas).values({
      slug: r.slug,
      titulo: r.titulo,
      descripcion: r.descripcion,
      productosAliados: r.productosAliados,
      almacenamientoEnvase: r.almacenamiento?.envase ?? null,
      almacenamientoVidaUtil: r.almacenamiento?.vidaUtil ?? null,
      rendimiento: r.rendimiento ?? null,
      ingredientes: r.ingredientes,
      procedimiento: r.procedimiento,
      orden: i,
    });
  }
  console.log(`  ✓ ${dataRecetas.length} recetas`);

  // Preguntas
  for (let i = 0; i < dataPreguntas.length; i++) {
    const q = dataPreguntas[i];
    await db.insert(preguntas).values({
      tema: q.tema,
      pregunta: q.pregunta,
      microResumen: q.microResumen,
      desarrollo: q.desarrollo,
      orden: i,
    });
  }
  console.log(`  ✓ ${dataPreguntas.length} preguntas`);

  console.log("✅ Seed completado.");
}

seed()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Error en seed:", err);
    process.exit(1);
  });
