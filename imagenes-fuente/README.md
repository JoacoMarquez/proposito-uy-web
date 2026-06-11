# Imágenes fuente (originales)

Poné acá las **imágenes originales** (JPG/PNG/etc., del Drive o la cámara) y corré:

```bash
npm run img:optim
```

El script las redimensiona y convierte a **WebP optimizado** en `public/productos/`
(mismo nombre de archivo, extensión `.webp`). Así servimos imágenes ya livianas y
no dependemos de transformaciones en runtime (límite/costo en Cloudflare).

Opciones:

```bash
npm run img:optim -- <fuente> <destino> [anchoMax] [calidad]
# por defecto: imagenes-fuente public/productos 800 80
```

> Los archivos originales de esta carpeta no se publican (están ignorados por git);
> solo se versiona el WebP resultante en `public/`.
