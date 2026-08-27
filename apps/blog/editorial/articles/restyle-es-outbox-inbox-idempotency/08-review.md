# Revisión editorial independiente

Esta revisión compara el borrador español con el artículo inglés publicado y con
el contrato registrado en el brief, el esquema, el registro de afirmaciones y las
semillas. No corrige el borrador.

## Contrato de tono y estructura

- Brief de referencia: `00-brief.md`.
- Esquema de referencia: `02-outline.md`.
- Fuente publicada: `apps/blog/src/content/posts/outbox-inbox-idempotency.md`.
- Desviaciones estructurales encontradas: ninguna.

| Ubicación              | Contrato                                                                                                                            | Evidencia                                                                                                                                                                                                | Acción requerida | Estado |
| ---------------------- | ----------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------- | ------ |
| Borrador completo      | Caso técnico impulsado por un incidente, seguido por un tutorial progresivo                                                         | Conserva la apertura con tickets, la decisión de llamada directa, la incertidumbre histórica y la progresión llamada directa -> outbox -> idempotencia -> inbox -> límite de negocio -> garantía acotada | Ninguna          | Pass   |
| Apertura, líneas 12-61 | Primera persona, frustración breve, certeza calibrada                                                                               | Mantiene los tickets, «esto es absurdo» y la afirmación explícita de que se desconoce qué operación creó los tres registros                                                                              | Ninguna          | Pass   |
| Cierre, líneas 247-264 | Volver al trabajo hecho como junior, delimitar responsabilidades y anticipar el artículo sobre aprender al revisar trabajo anterior | El cierre conserva las tres funciones sin convertir la experiencia en una regla universal                                                                                                                | Ninguna          | Pass   |
| Borrador completo      | Español latinoamericano natural y sin sintaxis trasladada mecánicamente del inglés                                                  | Los hallazgos lingüísticos N-01 a N-06 fueron corregidos sin alterar certeza, hechos ni estructura                                                                                                       | Ninguna          | Pass   |

## Auditoría exhaustiva de paridad

| Elemento               | Evidencia                                                                                                                                                                                       | Resultado                                                                                       |
| ---------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| Secciones              | Las seis secciones publicadas aparecen en el mismo orden y cumplen la misma transición argumental                                                                                               | Pass                                                                                            |
| Párrafos               | Cada bloque narrativo y técnico de la fuente tiene contraparte; no se omitieron el origen en las notificaciones, la frustración, la causa desconocida, la ventana eventual ni el callback final | Pass                                                                                            |
| Hechos e incertidumbre | C-01 a C-10 permanecen con el mismo alcance. Las líneas 58-61 mantienen que una solicitud repetida es solo una posibilidad y no la causa demostrada del incidente                               | Pass                                                                                            |
| Código TypeScript      | Los dos bloques `ts`, incluidos identificadores, literales y el comentario, coinciden con la fuente                                                                                             | Pass                                                                                            |
| Diagrama               | Conserva los dos flujos, su orden, las dos transacciones locales, la asociación del `userId` y la repetición con la misma `idempotencyKey`; solo se traducen las etiquetas explicativas         | Pass                                                                                            |
| Notas y URLs           | Conserva los cinco identificadores de nota y las once apariciones de URL sin cambios; solo localiza «section» y «Prisma Documentation»                                                          | Pass                                                                                            |
| Frontmatter            | Localiza título, descripción, categoría y `lang`; conserva fecha, estado publicado y el mismo asset mediante una ruta relativa válida; omite la sindicación por decisión explícita del brief    | Pass con requisito previo de publicación                                                        |
| Metadatos editoriales  | `Preguntas para Esteban` y `Afirmaciones nuevas` no pertenecen al artículo                                                                                                                      | Retirarlos al preparar el archivo Astro, tal como estaba previsto; no es una omisión de paridad |

## Auditoría obligatoria de patrones LLM

No se usó un detector ni una puntuación. Se revisaron directamente los patrones de
`STYLE.md`, `TONE_AND_STRUCTURE.md`, `no-ai-slop/SKILL.md` y `eval.md`.

| Ubicación                                                           | Patrón examinado                                                                                                                | Evidencia y decisión                                                                                                                                                                 | Acción requerida | Estado |
| ------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------- | ------ |
| Apertura, «Después de suficientes tickets…»                         | Apertura genérica o anuncio del artículo                                                                                        | Empieza con un problema observado, sus afectados y el límite concreto entre servicios                                                                                                | Ninguna          | Pass   |
| Líneas 33-36 y 256-259                                              | Contraste binario                                                                                                               | «No incluía mágicamente» y «no era una transacción mágica» separan la operación de negocio de las transacciones locales; el contraste es el punto técnico, no una fórmula decorativa | Ninguna          | Pass   |
| Líneas 54-56, «Mi reacción…: esto es absurdo»                       | Revelación con dos puntos o voz falsificada                                                                                     | Introduce una reacción personal ya publicada y atribuible, no una conclusión fabricada                                                                                               | Ninguna          | Pass   |
| Líneas 210-228                                                      | Metadiscurso y formato decorativo                                                                                               | «el cambio se ve con más claridad» introduce un diagrama que efectivamente compara los dos flujos; el bloque realiza trabajo técnico                                                 | Ninguna          | Pass   |
| Líneas 253-254, «La entrega ocurrió más de una vez. El efecto… no.» | Fragmentación dramática                                                                                                         | El cambio de ritmo formula con precisión la diferencia entre entrega repetida y efecto único; procede de la fuente publicada                                                         | Ninguna          | Pass   |
| Cierre, líneas 256-264                                              | Recapitulación o remate seudoprofundo                                                                                           | Cierra la responsabilidad de cada servicio y vuelve a la experiencia inicial sin resumir los encabezados ni añadir una moraleja universal                                            | Ninguna          | Pass   |
| Borrador completo                                                   | Simetría robótica, portabilidad, autoridad sin evidencia, importancia inflada, preguntas retóricas y guiones largos decorativos | La estructura está ganada por las responsabilidades técnicas sucesivas; no aparecen los demás patrones materiales                                                                    | Ninguna          | Pass   |

## Blockers

### B-01 — Falta completar el emparejamiento entre traducciones

- Estado: **Resuelto**.
- Verificación: ambas entradas Astro contienen
  `translationKey: 'outbox-inbox-idempotency'`. El build genera enlaces
  `hreflang` recíprocos entre la ruta inglesa y la española.

## Needs attention

### N-01 — `durable` es un calco evitable y se repite

- Estado: **Resuelto**.
- Verificación: la descripción y las líneas 96 y 104 usan «persistente» de manera
  consistente y conservan el sentido de estado almacenado después de terminar la
  solicitud.

### N-02 — Falta la subordinación natural después de `pedir`

- Estado: **Resuelto**.
- Verificación: las líneas 21-22 ahora dicen «Student le pedía a Users que creara
  el usuario» y conservan la secuencia original.

### N-03 — El vocabulario de commit pierde precisión en varios puntos

- Estado: **Resuelto**.
- Verificación: las líneas 23-24, 74-80, 89-90, 106-108 y 231-234 distinguen ahora
  entre Users o Student haciendo commit y la transacción que se confirma. La
  incertidumbre sobre la respuesta no recibida permanece intacta.

### N-04 — Hay anglicismos no necesarios para explicar el mecanismo

- Estado: **Resuelto**.
- Verificación: «payloads» fue reemplazado correctamente por «datos de la
  solicitud» en las líneas 244-247, y las líneas 34-36 usan «una decisión
  consciente con ese costo». Ambas correcciones conservan el sentido original.

### N-05 — Cinco construcciones conservan demasiado la sintaxis inglesa

- Estado: **Resuelto**.
- Verificación: las líneas 111-113, 131-132, 167-170, 205-209 y 231-236 expresan
  directamente los cinco mecanismos. «Aunque ambos servicios no estén de acuerdo
  de inmediato» conserva el límite de la fuente y no introduce una garantía más
  fuerte de consistencia.

### N-06 — El callback final omite un artículo

- Estado: **Resuelto**.
- Verificación: las líneas 265-266 dicen «cómo volver sobre el trabajo anterior» y
  mantienen el futuro artículo como una intención.

## Passes

- **Tesis y resultado para el lector — Pass.** Las tres responsabilidades quedan
  separadas y la garantía termina acotada a un efecto por clave, no a entrega
  `exactly-once`.
- **Contribución original — Pass.** La experiencia de soporte, la reacción personal
  y el regreso al diseño construido como junior permanecen sin material inventado.
- **Fundamento técnico — Pass.** Los claims, los dos ejemplos incompletos, el
  escenario de respuesta perdida y sus límites conservan el soporte de la fuente.
- **Estructura — Pass.** Cada sección prepara la responsabilidad siguiente y la
  conclusión resuelve la tensión de apertura.
- **Contrato de tono — Pass.** Se mantiene una voz conversacional, reflexiva,
  instructiva y calibrada; no se inventan emoción, humor, experiencia ni certeza.
- **Concreción — Pass.** Tickets, tres registros, `userId`, filas de outbox/inbox y
  dos transacciones locales sostienen las afirmaciones abstractas.
- **Integridad factual y de fuentes — Pass.** No hay claims nuevos, resultados
  inventados, enlaces modificados ni causalidad ampliada.
- **Preparación para publicación — Pass.** B-01 quedó resuelto, los metadatos
  editoriales no se copiaron al post Astro, Prettier y Astro check pasaron, y el
  build generó la ruta, RSS, sitemap, imagen social, `hreflang` y los índices de
  Pagefind en español e inglés.

## Hallazgos rechazados y motivo

- No se marca como repetición defectuosa la oposición entre entrega múltiple y un
  solo efecto: es la garantía exacta que el artículo necesita distinguir.
- No se marca como dramatización artificial «esto es absurdo»: es una reacción
  personal ya presente en la fuente publicada.
- No se marca como fragmentación decorativa «La entrega ocurrió más de una vez. El
  efecto de crear usuario no.»: el ritmo hace visible la distinción técnica central.
- No se exige traducir nombres propios de patrones, identificadores ni títulos de
  fuentes. Hacerlo reduciría precisión o alteraría material citado.
- La ausencia de metadatos de DEV y Medium en español no es pérdida de paridad: el
  brief los deja explícitamente fuera de alcance.

## Punto de aprobación

- [x] El contrato de tono y estructura está satisfecho o Esteban aceptó las
      desviaciones pendientes.
- [x] La auditoría obligatoria de patrones LLM está completa.
- [x] Los hallazgos materiales están resueltos o Esteban los aceptó explícitamente.
- [x] Todos los blockers están resueltos.
- [x] Esteban aprobó el borrador revisado, incluido el título final solicitado.
