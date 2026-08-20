# Lista de publicación de la edición en español

## Contrato de traducción

- [x] La fuente canónica y el `translationKey` están registrados.
- [x] La traducción conserva la tesis, la estructura, las salvedades y el ejercicio
      final de la edición en inglés.
- [x] Los 15 bloques cercados, las 19 notas al pie y las 20 URL mantienen paridad.
- [x] No se añadieron experiencias, afirmaciones, ejemplos ni resultados.
- [x] La auditoría de patrones LLM y la revisión independiente están registradas.
- [x] Los dos hallazgos de redacción se corrigieron y la revisión editorial pasó.

## Contenido Astro

- [x] El archivo final está en
      `src/content/posts/es/como-encajan-las-api-de-concurrencia-de-java.md`.
- [x] El título, la descripción, la categoría, `lang: es`, la fecha y
      `draft: false` cumplen el esquema.
- [x] La edición comparte `translationKey: java-concurrency-map` con la fuente.
- [x] La ruta de la imagen reutiliza el recurso aprobado y existe.
- [x] La edición española no agrega sindicación a DEV ni Medium.

## Validación

- [x] Prettier pasó para la fuente inglesa, la traducción y sus artefactos.
- [x] `pnpm article:check java-concurrency-map` pasó con seis aprobaciones.
- [x] `pnpm --filter @esteban/blog check` pasó sin diagnósticos.
- [x] `pnpm --filter @esteban/blog build` generó
      `/es/posts/como-encajan-las-api-de-concurrencia-de-java/`.
- [x] Pagefind indexó cuatro páginas en inglés y español, y devolvió la traducción
      para la búsqueda `concurrencia`.
- [x] Las dos rutas generan enlaces `hreflang` recíprocos y el selector de idioma
      español apunta a la edición inglesa.
- [x] La ruta española genera 19 notas al pie, `og:locale` igual a `es_CO` y la
      imagen social aprobada.
- [x] La apertura y la lista de notas al pie se inspeccionaron en un viewport móvil
      de 390 por 844 píxeles.

## Autorización y entrega

- [x] Esteban solicitó escribir y publicar la edición en español con `draft: false`.
- [x] Esteban autorizó por separado un commit acotado y el push de la traducción y
      los metadatos de sindicación.
- La ruta pública debe verificarse después del push antes de reportar la entrega
  como terminada.
