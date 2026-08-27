# Lista de publicación de la traducción española

## Editorial

- [x] Esteban aprobó explícitamente brief, outline, claims, draft y review.
- [x] El borrador final conserva la tesis, la procedencia de las semillas y los
      juicios ya publicados de Esteban.
- [x] La auditoría obligatoria de patrones LLM está registrada y resuelta.
- [x] B-01 y N-01 a N-06 están resueltos.
- [x] C-01 a C-10 conservan una base explícita y el mismo alcance de la fuente.
- [x] Código TypeScript, diagrama, notas al pie y URLs mantienen paridad.

## Astro content

- [x] Título final solicitado, descripción, fecha, categoría, `lang: es` y
      `draft: false` cumplen el esquema.
- [x] El slug aprobado es
      `lo-que-los-usuarios-duplicados-me-ensenaron-sobre-outbox-e-idempotencia`.
- [x] Ambas ediciones comparten `translationKey: outbox-inbox-idempotency`.
- [x] La imagen aprobada existe y se reutiliza con una ruta relativa válida.
- [x] El asset, sus crops y el alt text fueron aprobados antes de la traducción.
- [x] Los seis encabezados `##` conservan la estructura aprobada.
- [x] Los bloques `Preguntas para Esteban` y `Afirmaciones nuevas` no se copiaron.
- [x] Los bloques cercados usan `ts` y `text` como en la fuente.
- [x] La edición española no agrega sindicación a DEV o Medium.

## Verification

- [x] Prettier pasó para el post, la fuente inglesa y el workspace de traducción.
- [x] `pnpm article:check restyle-es-outbox-inbox-idempotency` pasó con 6/6
      aprobaciones.
- [x] `pnpm --filter @esteban/blog check` pasó con cero diagnósticos.
- [x] `pnpm --filter @esteban/blog build` generó 16 páginas y Pagefind indexó seis
      páginas en español e inglés.
- [x] La ruta española genera canonical propio, `og:locale: es_CO`, la imagen
      social aprobada y enlaces `hreflang` recíprocos.
- [x] RSS español, sitemap, homepage, archivo y datos de búsqueda incluyen el post.

## Publication authorization

- [x] Esteban autorizó generar y publicar la traducción con `draft: false`.
- [x] Esteban aprobó el paquete final y reiteró la publicación después del cambio
      de título.
