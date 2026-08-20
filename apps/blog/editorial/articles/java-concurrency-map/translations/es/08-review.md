# Revisión de la traducción al español

## Alcance y resultado

**Resultado general: Pass.** No encontré omisiones, afirmaciones técnicas nuevas,
cambios de certeza ni bloqueadores. Los dos ajustes de lenguaje registrados en la
primera revisión se aplicaron sin alterar el significado técnico. El borrador y la
entrada de Astro son idénticos byte por byte, y la validación de publicación pasó.

Esta revisión comparó:

- fuente canónica: `apps/blog/src/content/posts/how-java-concurrency-apis-fit-together.md`
  (`1589110b13482aeef857b9e95696c21668fb84c71ea366f332e9f46445e743d4`);
- borrador en español: `translations/es/06-draft.md`
  (`bb048c720294aefdf34b04ddfe36e0b1368d1186a201ee53148d28e9ac9e207d`).

El hash de la fuente incluye los metadatos de sindicación que están actualmente en
el árbol de trabajo. Su ausencia en la versión española es intencional y coincide
con `translations/es/00-brief.md`.

## Hallazgos

### Pass — vínculo entre hilos virtuales y del sistema

- **Ubicación:** `06-draft.md:163-165`.
- **Texto revisado:** “Son instancias de `Thread` que el JDK planifica, en lugar de
  estar vinculadas permanentemente, una a una, con hilos del sistema operativo.”
- **Resolución:** el anglicismo y la sintaxis inglesa desaparecieron. La formulación
  conserva el límite técnico de la fuente: evita afirmar que un hilo virtual mantenga
  una relación permanente uno a uno con un hilo del sistema.

### Pass — funciones proveedoras asíncronas

- **Ubicación:** `06-draft.md:242-244`.
- **Texto revisado:** “Las funciones proveedoras asíncronas reciben el ejecutor de
  forma explícita...”
- **Resolución:** la traducción elimina el término inglés innecesario y mantiene la
  referencia exacta a las funciones que se entregan a las operaciones asíncronas.

## Paridad con la fuente

### Contenido técnico — Pass

- Los nueve apartados aparecen en el mismo orden y cumplen la misma función.
- Cada párrafo técnico tiene un pasaje correspondiente. No se agregaron resultados,
  opiniones, experiencias, recomendaciones ni garantías.
- Se conservaron los límites importantes: `Executor` no garantiza asincronía;
  enviar tareas no garantiza solapamiento; cancelar un `Future` solo intenta
  cancelar; los hilos virtuales no aceleran trabajo limitado por CPU ni protegen
  estado compartido; `volatile` no hace atómico `completed++`; las operaciones de
  colecciones concurrentes no protegen invariantes mayores; un semáforo no protege
  los objetos que usan las tareas; `parallelStream()` no garantiza una mejora.
- La distinción entre `Future` y `CompletableFuture`, incluido el grafo de
  dependencias del dashboard personalizado, mantiene la misma complejidad y las
  mismas condiciones de la fuente.

### Código, diagrama, tablas y referencias — Pass

- Los 15 bloques cercados, sus lenguajes y su contenido son idénticos byte por
  byte entre las dos versiones. Esto incluye los literales ejecutables y el
  diagrama de texto.
- Las dos tablas tienen las mismas dimensiones: una tabla de siete responsabilidades
  y una tabla de nueve decisiones. Cada fila conserva su API, su problema y su
  comprobación previa.
- Se conservaron los 19 identificadores de notas al pie, las 19 definiciones y las
  20 URL en el mismo orden. No hay enlaces agregados ni eliminados.
- Los nombres de clases, métodos, paquetes, campos e identificadores de los ejemplos
  se conservaron. Las tres marcas de código adicionales en español (`join`, una
  repetición de `ExecutorService` y una de `java.util.concurrent.atomic`) solo hacen
  explícito el referente técnico; no cambian ninguna afirmación.

### Metadatos y publicación — Pass

- El título y la descripción son naturales, concretos y corresponden a la tesis de
  la fuente.
- `lang: 'es'`, `translationKey: 'java-concurrency-map'`, la categoría
  `Artículos técnicos` y `draft: false` cumplen el contrato documentado del blog.
- La ruta de imagen
  `../../../assets/posts/java-concurrency-map/responsibility-cabinet-v1.png`
  es correcta para un archivo situado en `src/content/posts/es/`, y el recurso
  existe.
- La entrada publicada vive en
  `src/content/posts/es/como-encajan-las-api-de-concurrencia-de-java.md` y es
  idéntica byte por byte al borrador revisado.
- El build generó `/es/posts/como-encajan-las-api-de-concurrencia-de-java/` con las
  19 notas al pie, el mismo hero en los metadatos y `es_CO` como locale de Open Graph.
- La pareja comparte el mismo `translationKey`. Se verificaron los `hreflang`
  recíprocos y el cambio de idioma en ambas direcciones.
- Pagefind en español devuelve un resultado para `concurrencia`. También se
  inspeccionaron en viewport móvil la apertura y las notas al pie.
- Pasaron Prettier del paquete, `pnpm article:check java-concurrency-map`, Astro
  check y el build de producción.

## Voz y español latinoamericano

### Tono y estructura — Pass

La traducción conserva el tono conversacional y pragmático de la fuente. Explica
los mecanismos antes de recomendar una clase, mantiene las reservas técnicas y
usa el ejemplo del dashboard como hilo conductor. Los encabezados describen su
contenido y no recurren a motivación genérica ni a promesas exageradas.

Se revisaron las oraciones de más de 28 palabras en los pasajes
`45-48`, `104-112`, `116-121`, `163-180`, `253-260`, `309-349`, `382-388`,
`445-474` y `493-501`. Sus enumeraciones y salvedades técnicas siguen siendo
legibles; no requieren una división mecánica. Los dos casos que sonaban traducidos
se corrigieron y quedaron registrados como hallazgos resueltos arriba.

### Experiencia y autoría — Pass

El borrador no atribuye a Esteban experiencias, resultados, mediciones, opiniones
o anécdotas. La síntesis, los ejemplos y el ejercicio final corresponden a la
fuente canónica.

## Auditoría obligatoria de patrones LLM

**Resultado: Pass.** No encontré un patrón genérico material que deba bloquear la
traducción.

- **Apertura (`12-27`):** comienza con el requisito concreto de permitir que dos
  operaciones independientes progresen y nombra la dificultad exacta: elegir entre
  API que parecen responder la misma pregunta. No anuncia “un artículo” ni usa una
  escena genérica trasladable a otra tecnología.
- **Tesis (`18-27`):** “Agruparlas por responsabilidad convierte la biblioteca
  estándar de una lista de nombres en un mapa” está respaldada de inmediato por el
  dashboard y las siete preguntas. La metáfora no sustituye un mecanismo.
- **Contrastes técnicos (`163-171`, `253-260`, `325-331`, `433-437`):** las
  negaciones conservan límites concretos de las API; no forman una cadencia binaria
  decorativa de “no X, sino Y”.
- **Preguntas y listas (`54-62`, `283-290`, `481-491`):** las preguntas funcionan
  como mapa de responsabilidades o lista de verificación. No son preguntas
  retóricas con respuesta prefabricada.
- **Encabezados:** los nueve son descriptivos. No hay encabezados cinematográficos,
  motivacionales, emoticonos ni revelaciones con dos puntos.
- **Ritmo y formato:** no aparecen rayas largas, fragmentos dramáticos, negrita
  decorativa ni términos inflados de las listas de advertencia. Las enumeraciones
  paralelas provienen de responsabilidades técnicas reales, no de simetría ornamental.
- **Cierre (`493-501`):** no resume los nueve apartados. Termina con un ejercicio
  verificable de cinco oraciones que conecta cada respuesta con documentación o
  pruebas posteriores.

## Criterios de la rúbrica

| Criterio                         | Resultado | Evidencia                                                                    |
| -------------------------------- | --------- | ---------------------------------------------------------------------------- |
| Tesis y resultado para el lector | Pass      | La selección por responsabilidad aparece en la apertura y guía el cierre.    |
| Contribución original            | Pass      | Conserva la síntesis por responsabilidades y el dashboard trazado.           |
| Fundamento técnico               | Pass      | Mantiene afirmaciones, salvedades, código y fuentes sin ampliarlas.          |
| Estructura                       | Pass      | Nueve apartados en el mismo orden de aprendizaje.                            |
| Fundamentación concreta          | Pass      | El dashboard, el contador, la cola, el semáforo y la suma respaldan el mapa. |
| Voz                              | Pass      | Los dos anglicismos detectados se corrigieron sin cambiar el significado.    |
| Autoría y patrones LLM           | Pass      | Auditoría por pasajes registrada; no hay personalidad ni certeza inventadas. |
| Integridad factual y de fuentes  | Pass      | 15 bloques exactos, 19 notas y 20 URL preservadas.                           |
| Preparación para publicación     | Pass      | Astro, build, ruta, búsqueda, i18n, metadata y vista móvil verificados.      |

## Autorización humana y límite Git

La solicitud vigente de Esteban autoriza expresamente publicar la versión española
con `draft: false`. Las acciones Git quedan fuera de esta revisión; Esteban entregó
su autorización separada en la instrucción posterior de publicación.
