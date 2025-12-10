# Blog MDX - Tareas Pendientes

## Estado Actual: 95% Completado

El sistema de blog con MDX está implementado y funcional. Solo faltan las imágenes de los artículos.

---

## Pendiente: Imágenes de Artículos

Necesitas crear/agregar estas 5 imágenes en `public/img/blog/article/`:

| Archivo | Artículo | Dimensiones Recomendadas |
|---------|----------|-------------------------|
| `salud-mental-dev.webp` | Programar 14 horas no es de Hacker | 1920x1280 |
| `https-security.webp` | HTTPS no es opcional | 1920x1280 |
| `seo-react-angular.webp` | SEO en React y Angular | 1920x1280 |
| `sitemap-robots.webp` | Sitemap.xml y Robots.txt | 1920x1280 |
| `daily-scrum.webp` | Daily de 15 minutos | 1920x1280 |

### Opción A: Crear imágenes nuevas
- Usar Midjourney, DALL-E, o stock photos
- Formato: WebP
- Dimensiones: 1920x1280px (ratio 3:2)

### Opción B: Usar imágenes existentes temporalmente
Modificar el frontmatter `image:` en cada archivo MDX para usar una imagen existente:

```yaml
image: "/img/blog/article/1920x1280_img-01.webp"
```

Archivos MDX a modificar:
- `content/blog/programar-14-horas-no-es-de-hacker.mdx`
- `content/blog/https-no-es-opcional.mdx`
- `content/blog/seo-en-react-angular-pagina-blanco-google.mdx`
- `content/blog/sitemap-robots-txt-no-existes.mdx`
- `content/blog/daily-15-minutos-dura-hora-arruinar-scrum.mdx`

---

## Estructura Implementada

```
content/blog/                    ✅ 6 artículos MDX
components/mdx/                  ✅ 4 componentes (CodeBlock, CopyButton, Callout, MDXComponents)
components/blogs/                ✅ 2 componentes (BlogArticle, BlogList)
lib/blog.ts                      ✅ Procesador MDX
public/css/mdx.css               ✅ Estilos código y callouts
```

---

## Cómo Agregar Nuevos Artículos (Futuro)

1. Crear archivo en `content/blog/mi-articulo.mdx`
2. Agregar frontmatter:
```yaml
---
title: "Título"
description: "Descripción SEO"
date: "2025-12-15"
tags: ["Tag1", "Tag2"]
categories: ["Categoría"]
image: "/img/blog/article/mi-imagen.webp"
published: true
---
```
3. Escribir contenido en Markdown
4. Agregar imagen en `public/img/blog/article/`
5. `npm run build && npm run deploy`

---

## Verificación Final

Después de agregar las imágenes, ejecutar:

```bash
npm run build
npm run dev
```

Visitar:
- http://localhost:3000/blog-standard (lista de artículos)
- http://localhost:3000/blog-article/programar-14-horas-no-es-de-hacker
