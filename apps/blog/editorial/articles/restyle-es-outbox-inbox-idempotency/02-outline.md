# Esquema estructural

## Tesis aprobada

Un outbox conserva el trabajo pendiente para que pueda recuperarse. Una clave de
idempotencia y un inbox permiten que el servicio receptor reconozca una operación
repetida y devuelva el resultado original. Juntos permiten recuperar el proceso sin
duplicar su efecto, sin fingir que dos transacciones locales son una sola transacción
distribuida.

## Promesa de apertura

- Situación concreta: varios tickets de soporte sobre estudiantes que no podían
  iniciar sesión y operaciones del personal que fallaban alrededor del mismo límite
  entre servicios.
- Beneficio para el lector: entender qué problema resuelve cada pieza —outbox, clave
  de idempotencia e inbox— y por qué hacen falta las tres.
- Contexto demorado necesario: antes de presentar los patrones, el artículo explica
  por qué la llamada directa era una decisión razonable y qué incertidumbre deja la
  red entre dos transacciones locales.

## Arquetipo estructural y progresión

- Arquetipo dominante: caso técnico impulsado por un incidente real.
- Transición secundaria: tutorial progresivo del modelo mental, desde la llamada
  directa hasta el outbox, la idempotencia y el inbox.
- Progresión en una frase: el lector pasa de los síntomas observados, por el límite
  de las dos transacciones y la recuperación de la intención, hasta la prevención de
  efectos duplicados, porque cada sección establece la responsabilidad que la
  siguiente pieza debe cubrir.

## Secuencia argumental

### 1. Los tickets dejan de parecer casos aislados

- Propósito: abrir con la experiencia real y delimitar el problema.
- Afirmación central: distintos síntomas conducían al mismo límite entre Student y
  Users.
- Apoyo concreto: estudiantes sin acceso, operaciones del personal fallidas y tres
  registros habilitados con el mismo número de documento.
- Consecuencia para el lector: el problema deja de parecer un error aislado de datos
  y pasa a leerse como un límite de coordinación.
- Límite: se desconoce qué operación histórica produjo los tres registros; una
  solicitud repetida es solo una posibilidad.
- Transición: para entender el fallo hay que separar la acción de negocio de las dos
  transacciones que la ejecutan.

### 2. La llamada directa todavía contiene dos transacciones

- Propósito: mostrar por qué una operación de negocio no equivale a una sola
  transacción técnica.
- Afirmación central: cada servicio puede hacer atómicos sus cambios locales, pero la
  llamada HTTP no une ambos commits o rollbacks.
- Apoyo concreto: el escenario en el que Users confirma el usuario y la respuesta
  con `userId` no llega a Student.
- Consecuencia para el lector: un timeout no revela qué confirmó el otro servicio y
  un reintento puede recuperar o repetir el efecto.
- Límite: la llamada directa fue un tradeoff consciente para una interacción uno a
  uno, no la suposición de una transacción distribuida.
- Transición: Student necesita conservar el trabajo más allá de la solicitud.

### 3. El outbox conserva la intención de Student

- Propósito: introducir el estado durable del trabajo pendiente.
- Afirmación central: guardar el cambio de Student y la fila del outbox en la misma
  transacción local hace recuperable la intención de crear el usuario.
- Apoyo concreto: la experiencia previa con notificaciones no entregadas y el
  escenario de una fila de outbox aún pendiente después de que Users haya actuado.
- Consecuencia para el lector: la solicitud puede terminar sin llevarse consigo el
  trabajo que falta.
- Límite: conservar la intención permite entregas repetidas; no resuelve por sí solo
  la duplicación.
- Transición: Users necesita identificar que la siguiente entrega pertenece a la
  misma operación.

### 4. La entrega repetida introduce la idempotencia

- Propósito: separar identidad de la operación y número de intentos.
- Afirmación central: Student asigna una sola `idempotencyKey` a la operación y la
  reutiliza en cada entrega.
- Apoyo concreto: snippet TypeScript inventado e incompleto con una transacción local
  de estilo Prisma.
- Consecuencia para el lector: Student puede reintentar sin presentar cada intento
  como una operación distinta.
- Límite: la clave solo identifica la operación; todavía hace falta conservar el
  resultado que Student necesita.
- Transición: el inbox debe recordar tanto la clave como la respuesta original.

### 5. El inbox conserva el resultado de Users

- Propósito: explicar cómo Users evita repetir el efecto y devuelve el mismo
  `userId`.
- Afirmación central: Users guarda el usuario y el resultado del inbox en una sola
  transacción local.
- Apoyo concreto: snippet TypeScript con `findUnique`, creación del usuario y fila
  de inbox; además, el diagrama de ambos flujos.
- Consecuencia para el lector: un reintento puede recibir el resultado almacenado en
  lugar de crear otro usuario.
- Límite: `idempotencyKey` debe ser única para arbitrar solicitudes concurrentes; el
  sistema acepta una ventana de consistencia eventual cuya presentación al usuario
  es una decisión de producto.
- Transición: reconocer la misma operación no decide si dos operaciones diferentes
  con datos parecidos son válidas.

### 6. La idempotencia no reemplaza las reglas de negocio

- Propósito: separar deduplicación técnica de unicidad de dominio.
- Afirmación central: una clave distinta representa otra operación aunque algunos
  campos coincidan.
- Apoyo concreto: contraste entre comparar la clave y comparar el payload.
- Consecuencia para el lector: el inbox no debe fusionar silenciosamente solicitudes
  distintas.
- Límite: permitir o rechazar esas operaciones corresponde a validaciones y reglas
  de unicidad del dominio.
- Transición: con esa frontera clara puede formularse la garantía exacta del diseño.

### 7. Entrega repetida, un solo efecto de negocio

- Propósito: cerrar el alcance técnico y volver al aprendizaje personal.
- Afirmación central: la entrega puede ocurrir más de una vez, pero para una
  `idempotencyKey` el efecto de crear usuario ocurre una sola vez.
- Apoyo concreto: responsabilidades finales de Student y Users, y la revisión del
  camino directo construido cuando Esteban era junior.
- Consecuencia para el lector: el objetivo no es una transacción mágica entre dos
  servicios, sino que cada servicio conserve el estado que le corresponde.
- Límite: la garantía no es una entrega literal `exactly-once`.
- Transición: abre, sin desarrollar, el futuro artículo sobre aprender al revisar
  trabajo anterior.

## Cierre de la conclusión

- Tensión de apertura resuelta: los síntomas distintos apuntaban a responsabilidades
  que se perdían al depender solo de la solicitud síncrona.
- Conclusión calificada: outbox, idempotencia e inbox cubren responsabilidades
  diferentes y producen un solo efecto de negocio por clave, no una entrega única.
- Siguiente idea: volver sobre trabajo anterior con mejores preguntas también forma
  parte del aprendizaje; ese tema queda para otro artículo.

## Conceptos y prerrequisitos

- Comunicación HTTP entre servicios.
- Transacciones locales y atomicidad.
- Reintentos y respuestas que pueden perderse.
- Consistencia eventual.
- Restricción de unicidad sobre `idempotencyKey`.

## Alternativas todavía bajo consideración

Ninguna. La traducción conserva la estructura del artículo publicado.

## Preguntas para Esteban

Ninguna.

## Punto de aprobación

- [ ] Esteban aprobó este esquema traducido.
