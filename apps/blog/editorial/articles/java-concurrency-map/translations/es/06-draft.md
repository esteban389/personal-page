---
title: 'Cómo encajan las API de concurrencia de Java'
description: 'Un mapa para principiantes de las API de concurrencia de Java, organizado según los problemas que resuelven.'
pubDate: '2026-08-20'
category: 'Artículos técnicos'
lang: 'es'
translationKey: 'java-concurrency-map'
heroImage: '../../../assets/posts/java-concurrency-map/responsibility-cabinet-v1.png'
draft: false
---

Un problema de concurrencia puede comenzar con un requisito común: permitir que
dos operaciones independientes progresen sin obligar a una a esperar a la otra.
El requisito es fácil de expresar. Elegir entre `Thread`, `ExecutorService`,
`Future`, `CompletableFuture`, locks, variables atómicas, colas y sincronizadores
es más difícil cuando parecen respuestas distintas a la misma pregunta.

Estas API responden preguntas diferentes. Algunas describen trabajo, otras
deciden cómo se ejecuta, otras representan resultados y otras protegen el estado
compartido o coordinan tareas. Agruparlas por responsabilidad convierte la
biblioteca estándar de una lista de nombres en un mapa.

Construiremos ese mapa alrededor de un pequeño ejemplo de un dashboard de cliente
y luego usaremos ejemplos más cortos para los problemas que el dashboard no
cubre. Los ejemplos suponen conocimientos básicos de Java, no experiencia previa
con concurrencia. Comienza por la responsabilidad que necesita el programa; elige
la clase después.

## Comienza con un programa que espera dos veces

Supongamos que un endpoint construye el dashboard de un cliente a partir de un
perfil y una lista de pedidos recientes:

```java
var profile = loadProfile();
var orders = loadOrders();

return new Dashboard(profile, orders);
```

Los fragmentos de código que aparecen a continuación omiten imports y
definiciones de clases circundantes cuando esos detalles no afectan el mecanismo
de concurrencia.

La segunda llamada comienza después de que la primera retorna. Si las operaciones
son independientes y pasan la mayor parte del tiempo esperando servicios remotos,
ese orden deja una oportunidad evidente: iniciar ambas y construir el dashboard
cuando los dos resultados estén disponibles.

Ese pequeño cambio ya involucra tres responsabilidades distintas: describir cada
operación, decidir cómo ejecutarla y obtener su resultado. El mapa completo usa
siete preguntas:

| Pregunta                              | API representativas                                      |
| ------------------------------------- | -------------------------------------------------------- |
| ¿Qué trabajo debe realizarse?         | `Runnable`, `Callable<V>`                                |
| ¿Dónde y cómo debe ejecutarse?        | `Thread`, `Executor`, `ExecutorService`, hilos virtuales |
| ¿Cómo obtengo o combino resultados?   | `Future<V>`, `CompletableFuture<T>`                      |
| ¿Cómo protejo el estado compartido?   | `synchronized`, `volatile`, `Lock`, variables atómicas   |
| ¿Cómo comparto datos de forma segura? | `ConcurrentHashMap`, `BlockingQueue`                     |
| ¿Cómo se coordinan las tareas?        | `Semaphore`, `CountDownLatch`, `CyclicBarrier`           |
| ¿Cómo divido un cálculo?              | `ForkJoinPool`, streams paralelos                        |

Estos grupos se superponen. `CompletableFuture`, por ejemplo, representa un
resultado y también puede organizar una ejecución dependiente. Trata los grupos
como preguntas para ubicar un problema, no como categorías rígidas para
clasificar cada tipo.

En una primera lectura, concéntrate en las tareas, los ejecutores, los futures y
las secciones sobre estado compartido. Aprende las colas y los semáforos como
soluciones con nombre para la transferencia de datos y los límites. Deja
`CyclicBarrier`, fork/join y las reglas de planificación de continuaciones como
puntos de referencia hasta que un programa te presente uno de esos problemas.

Una distinción de vocabulario será útil en todo el mapa. Las tareas concurrentes
progresan durante periodos que se superponen; no tienen que ejecutarse en el mismo
instante. El trabajo paralelo sí se ejecuta al mismo tiempo. Un solo núcleo de CPU
puede intercalar tareas concurrentes, mientras que la ejecución paralela requiere
recursos de hardware capaces de ejecutar trabajo simultáneamente. Usaremos
concurrencia para el dashboard, que pasa mucho tiempo esperando, y reservaremos el
cálculo paralelo para otro ejemplo de procesamiento de datos.

## Las tareas describen el trabajo

Una tarea describe trabajo. Un hilo es uno de los posibles mecanismos de
ejecución.

Las interfaces básicas de tareas de Java hacen visible esa separación. `Runnable`
representa una operación sin resultado,[^runnable-api] mientras que `Callable<V>`
retorna un valor y puede lanzar una excepción.[^callable-api] Ninguna interfaz
elige el hilo que la ejecutará. Sus contratos solo describen la operación.

```java
Runnable refreshCache = () -> cache.refresh();

Callable<String> loadProfile =
        () -> profileClient.fetchProfile(customerId);
```

Crear cualquiera de estos valores no inicia el trabajo. El código que lo usa
podría invocar `run()` o `call()` directamente, o entregar la tarea a un ejecutor.
Esa decisión posterior determina la política de ejecución.

El código que describe la actualización de una caché no cambia si la aplicación
lo ejecuta de inmediato, lo programa en un pool o inicia un hilo virtual para él.

Usa `Thread` directamente cuando el programa sea responsable de la identidad o el
ciclo de vida de un hilo específico: por ejemplo, para asignarle un nombre,
instalar su manejador de excepciones no capturadas o hacer `join` sobre ese hilo.
Un ejecutor encaja mejor cuando la creación, planificación y ciclo de vida de los
hilos pertenecen a una política de ejecución y no a la tarea
misma.[^thread-api]

## Los ejecutores deciden cómo se ejecuta el trabajo

Un `Executor` recibe un `Runnable` y aplica una política de ejecución. Su interfaz
separa el envío de tareas de detalles como la creación, reutilización y
planificación de hilos. El contrato de `Executor` no promete una ejecución
asíncrona: un ejecutor mínimo puede llamar a `command.run()` en el hilo que envía
la tarea, mientras que otras implementaciones crean hilos o los reutilizan desde
un pool.[^executor-api]

`ExecutorService` agrega operaciones de ciclo de vida y métodos como `submit`, que
retorna un `Future`.[^executor-service-api] Una aplicación debe cerrar o apagar un
`ExecutorService` cuando ya no lo necesita. En Java moderno, la interfaz es
`AutoCloseable`, por lo que un bloque try-with-resources puede ser responsable de
ese ciclo de vida.

Los ejemplos ejecutables requieren Java 21 o posterior porque usan hilos
virtuales; el mapa de responsabilidades y las API más antiguas se aplican de forma
más amplia. Este es el dashboard con un hilo virtual por cada tarea enviada:

```java
Dashboard loadDashboard() throws Exception {
    try (var executor = Executors.newVirtualThreadPerTaskExecutor()) {
        Future<String> profile =
                executor.submit(this::loadProfile);
        Future<List<String>> orders =
                executor.submit(this::loadOrders);

        return new Dashboard(profile.get(), orders.get());
    }
}
```

Ambas tareas se envían antes de que el código espere alguno de los resultados.
Por lo tanto, sus ejecuciones pueden superponerse cuando el ejecutor puede
ejecutarlas de forma concurrente. Enviar las tareas no garantiza por sí solo que
se superpongan; el ejecutor controla esa política y puede estar limitado por los
recursos disponibles.

El siguiente orden impide que las dos operaciones del dashboard se superpongan:

```java
var profile = executor.submit(this::loadProfile).get();
var orders = executor.submit(this::loadOrders).get();
```

El primer `get()` puede bloquear antes de que la segunda línea alcance a enviar
`loadOrders`. Conserva primero las referencias y espera después de enviar ambas
tareas cuando las operaciones sean independientes.

Los hilos virtuales se convirtieron en una característica definitiva en Java 21.
Son instancias de `Thread` que el JDK planifica, en lugar de estar vinculadas
permanentemente, una a una, con hilos del sistema operativo. Son adecuados para
código con un hilo por tarea y muchas operaciones concurrentes que suelen esperar,
como las llamadas a servicios remotos. No hacen que el código limitado por CPU se
ejecute más rápido ni vuelven seguro el acceso al estado mutable compartido cuando
depende del orden temporal de los hilos. JEP 444 también aconseja no agrupar los
hilos virtuales en pools.[^jep-444] Crea uno por tarea; usa un mecanismo diferente
cuando un recurso escaso necesite un límite de concurrencia.

## Los resultados se pueden esperar o componer

Un `Future<V>` es una referencia a un resultado que quizá todavía no exista.
`get()` espera cuando es necesario y luego retorna el valor o informa del fallo
del cálculo. Un `Future` también expone el estado de finalización y la cancelación.
Según el contrato de `Future`, `cancel(...)` intenta cancelar; el trabajo que ya
está en ejecución puede continuar según el momento y según si la tarea responde a
la interrupción.[^future-api]

El ejemplo del dashboard usa dos futures sencillos porque su flujo de control es
corto: enviar dos operaciones, esperar ambas y construir un valor. Las llamadas
bloqueantes a `get()` no eliminan la concurrencia anterior porque los dos envíos
ya ocurrieron.

`CompletableFuture<T>` resulta útil cuando un trabajo posterior debe depender de
resultados previos. Implementa tanto `Future<T>` como `CompletionStage<T>`, que
agrega operaciones para transformar y combinar etapas completadas.

Comienza con un resultado y una transformación:

```java
CompletableFuture<String> profile =
        CompletableFuture.supplyAsync(this::loadProfile, executor);

CompletableFuture<String> label =
        profile.thenApply(name -> "Customer: " + name);
```

Cuando `profile` termina normalmente, `thenApply` pasa su resultado a la función
y produce otra etapa que contiene la etiqueta. Ningún `get()` separa los dos
pasos.[^completable-future-api]

Si tradujéramos directamente el dashboard anterior de dos entradas,
`CompletableFuture` se vería en gran medida como un cambio de sintaxis alrededor
de la misma bifurcación fija. Agreguemos una dependencia real: las recomendaciones
solo pueden comenzar después de que el perfil esté disponible, mientras que los
pedidos pueden seguir cargándose de forma independiente.

```text
profile + orders ----------> dashboard -------------\
profile -------------------> recommendations --------+--> personalized dashboard
```

El código refleja ese grafo de dependencias:

```java
try (var executor = Executors.newVirtualThreadPerTaskExecutor()) {
    CompletableFuture<String> profile =
            CompletableFuture.supplyAsync(this::loadProfile, executor);
    CompletableFuture<List<String>> orders =
            CompletableFuture.supplyAsync(this::loadOrders, executor);

    CompletableFuture<List<String>> recommendations = profile.thenCompose(
            loadedProfile -> loadRecommendations(loadedProfile, executor));

    CompletableFuture<Dashboard> dashboard =
            profile.thenCombine(orders, Dashboard::new);

    return dashboard.thenCombine(
                    recommendations,
                    (loadedDashboard, loadedRecommendations) ->
                            new PersonalizedDashboard(
                                    loadedDashboard.profile(),
                                    loadedDashboard.orders(),
                                    loadedRecommendations))
            .join();
}
```

Las funciones proveedoras asíncronas reciben el ejecutor de forma explícita porque
los métodos asíncronos de `CompletableFuture` sin uno normalmente usan
`ForkJoinPool.commonPool()`.[^completable-future-api]

`profile` y `orders` comienzan de forma independiente. Cuando `profile` termina
normalmente, `thenCompose` invoca la función de recomendaciones y aplana el
`CompletableFuture` que esta retorna. El primer `thenCombine` construye un
dashboard cuando llegan ambas entradas independientes. El segundo combina ese
dashboard con las recomendaciones, y `join()` espera una vez en el límite de la
solicitud.

`Future` y `CompletableFuture` se superponen, pero favorecen flujos de control
distintos. Un `Future` sencillo sigue siendo suficiente para un conjunto corto y
fijo de tareas independientes cuando el código que las solicita puede enviarlas
juntas y esperar en un límite claro. Las etapas de finalización ayudan cuando un
resultado inicia trabajo posterior o cuando varias ramas deben converger. El
ejemplo se detiene en la composición. El código de producción todavía necesita
una política explícita para errores, cancelación, timeouts y propiedad del
ejecutor.

## El estado compartido plantea tres preguntas distintas

Elegir un ejecutor no vuelve segura la mutación compartida. Imagina que agregamos
un contador que cada tarea completada del dashboard incrementa:

```java
volatile int completed;

void markCompleted() {
    completed++;
}
```

La declaración `volatile` proporciona garantías de consistencia de memoria para
las lecturas y escrituras, pero `completed++` es una operación compuesta de
lectura, modificación y escritura. Dos hilos pueden leer el mismo valor y escribir
el mismo valor incrementado, de modo que se pierde una actualización. La
Especificación del Lenguaje Java separa estas acciones de
memoria,[^jls-memory-actions] y el paquete `java.util.concurrent.atomic`
proporciona operaciones que realizan la actualización completa de forma atómica.

La seguridad del estado compartido involucra tres preguntas distintas:

- **Atomicidad:** ¿otros hilos deben observar un grupo de operaciones como una
  sola acción indivisible?
- **Visibilidad:** cuando un hilo escribe un valor, ¿qué garantiza que otro hilo
  lo vea?
- **Orden:** ¿qué limita el orden en que las acciones se vuelven observables entre
  distintos hilos?

Considera una transferencia única en la que un hilo publica un dashboard y otro
lo lee:

```java
Dashboard publishedDashboard;
volatile boolean dashboardReady;

void publish(Dashboard value) {
    publishedDashboard = value;
    dashboardReady = true;
}

Dashboard readIfReady() {
    return dashboardReady ? publishedDashboard : null;
}
```

La escritura del dashboard ocurre antes que la escritura del indicador volatile
en el hilo que publica. Si otro hilo lee después `dashboardReady` como `true`, la
regla happens-before para variables volatile del Modelo de Memoria de Java hace
visible para ese lector la escritura anterior del dashboard.[^jls-happens-before]
El indicador no bloquea ninguno de los métodos ni vuelve atómica una actualización
compuesta.

`synchronized` puede proporcionar exclusión mutua para una sección crítica y una
relación de visibilidad alrededor del mismo monitor. Cuando un hilo libera un
monitor, esa acción happens-before una adquisición posterior del mismo monitor,
por lo que las escrituras anteriores a la liberación se vuelven visibles mediante
esa relación de sincronización. El resumen de consistencia de memoria de
`java.util.concurrent` también documenta garantías similares para el envío de
tareas, un `Future.get()` exitoso, las colecciones concurrentes y los
sincronizadores.[^juc-memory-consistency]

`volatile` proporciona visibilidad y orden para las lecturas y escrituras de un
campo. No proporciona exclusión mutua alrededor de una secuencia como un
incremento. Las interfaces `Lock` ofrecen bloqueo explícito y opciones como una
adquisición interrumpible o con tiempo límite, además de múltiples
condiciones.[^lock-api] Esa flexibilidad exige código explícito de adquisición y
liberación, y no convierte a `Lock` en una mejora automática frente a
`synchronized`.

Para un contador independiente, `AtomicInteger` coincide directamente con la
operación:

```java
AtomicInteger completed = new AtomicInteger();

Future<Integer> task =
        executor.submit(completed::incrementAndGet);
```

El paquete `java.util.concurrent.atomic` proporciona operaciones seguras entre
hilos de lectura, modificación y escritura sobre variables individuales, entre
ellas incremento y compare-and-set.[^atomic-package] Una variable atómica no
vuelve atómica una invariante con varios valores. Si una regla abarca un saldo y
una entrada contable, o requiere que varios objetos cambien juntos, puede encajar
mejor un lock alrededor de la invariante o un diseño que evite la mutación
compartida.

## Las colecciones concurrentes protegen operaciones documentadas

Los datos compartidos suelen necesitar más estructura que un contador. Java
ofrece mapas, colas de doble extremo y otras colecciones concurrentes con
garantías documentadas de seguridad y consistencia. Esa protección se aplica a
sus operaciones. No convierte en atómica cualquier secuencia escrita por el
código que usa la colección.

Considera un registro de caché respaldado por un `ConcurrentHashMap`:

```java
if (!cache.containsKey(customerId)) {
    cache.put(customerId, loadCustomer(customerId));
}
```

Incluso con un mapa concurrente, otro hilo puede cambiar el mapa entre la
comprobación y el `put`. `ConcurrentMap` proporciona operaciones compuestas como
`putIfAbsent`, `compute` y `merge` para las transiciones cubiertas por sus
contratos:[^concurrent-map-api]

```java
cache.computeIfAbsent(customerId, this::loadCustomer);
```

Usa una de esas operaciones cuando su semántica documentada coincida con el cambio
de estado. Una invariante que abarque varias entradas del mapa o efectos externos
todavía necesita un diseño más amplio. `ConcurrentHashMap` documenta las garantías
y restricciones de su implementación de
`computeIfAbsent`.[^concurrent-hash-map-api]

`BlockingQueue` resuelve otro problema de datos compartidos: entregar elementos
de productores a consumidores.[^blocking-queue-api] Sus operaciones permiten que
un productor falle de inmediato, espere a que haya espacio o espere hasta un
tiempo límite; un consumidor tiene opciones equivalentes cuando la cola está
vacía. La capacidad depende de la implementación. `ArrayBlockingQueue` tiene una
capacidad limitada, mientras que otras implementaciones pueden no tener límite o
usar una semántica de transferencia diferente.

```java
BlockingQueue<Job> jobs = new ArrayBlockingQueue<>(100);

jobs.put(new Job(customerId)); // waits when this bounded queue is full
Job next = jobs.take();        // waits when it is empty
```

La cola controla la transferencia segura de cada elemento. El objeto `Job`
todavía puede necesitar su propio diseño seguro si los productores y consumidores
lo modifican después de la transferencia.

## La coordinación describe quién puede continuar

Un límite de dos solicitudes a una dependencia es una política de coordinación.
Un semáforo representa esa política mediante permisos:

```java
String fetchWithLimit(Semaphore permits, String requestId)
        throws InterruptedException {
    permits.acquire();
    try {
        return dependency.fetch(requestId);
    } finally {
        permits.release();
    }
}
```

Construir `new Semaphore(2)` permite que, como máximo, dos adquisiciones exitosas
continúen al mismo tiempo. El bloque `finally` devuelve el permiso cuando la
llamada termina o falla. El ejecutor de hilos virtuales usado antes crea un nuevo
hilo virtual por tarea y no impone un límite de cantidad de hilos. JEP 444
recomienda conservar ese modelo y usar un semáforo para representar el límite real
de un servicio escaso.[^jep-444]

Otros sincronizadores codifican otras políticas. Un `CountDownLatch` permite que
las tareas esperen hasta que un contador llegue a cero, lo que encaja con una
compuerta de inicio que se usa una sola vez. Un `CyclicBarrier` coordina un grupo
cuyos integrantes deben alcanzar la misma fase antes de continuar. Un
`BlockingQueue` coordina mediante la disponibilidad de datos y la capacidad. La
descripción general de sincronizadores de `java.util.concurrent` agrupa estas API
por política.[^juc-synchronizers]

Estas políticas no protegen cada objeto que tocan las tareas participantes. El
semáforo limita las llamadas del ejemplo; no dice nada sobre la seguridad entre
hilos de `dependency` ni de otro estado compartido. Usa un sincronizador cuando la
regla determine quién puede continuar y analiza las invariantes compartidas por
separado.

## El cálculo paralelo divide los datos o el trabajo

El dashboard pasa tiempo esperando. Una suma sobre una colección grande presenta
un problema diferente: dividir el cálculo entre los datos y combinar los
resultados parciales.

`ForkJoinPool` es un `ExecutorService` construido alrededor del robo de trabajo y
de tareas que pueden dividirse en tareas más pequeñas. Su contrato no garantiza
hilos de compensación para operaciones de entrada/salida bloqueantes o
sincronización no administrada.[^fork-join-pool-api] No trates un fork/join pool
como el ejecutor predeterminado para muchas llamadas de red bloqueantes. Es más
adecuado conceptualmente para cálculos divisibles que para reemplazar el ejecutor
del dashboard, orientado a la espera.

Los streams paralelos exponen la ejecución paralela de datos mediante la API de
streams:

```java
long sum = values.parallelStream()
        .mapToLong(value -> (long) value * value)
        .sum();
```

Esta reducción cumple los requisitos de `java.util.stream` porque el mapeo no
tiene estado, no modifica la fuente y la suma es asociativa.[^stream-package] Esas
propiedades permiten que la implementación del stream divida el trabajo y combine
los resultados parciales de forma segura. Las operaciones con estado, los
requisitos de orden de encuentro, el costo de coordinación, las entradas pequeñas
y los procesadores disponibles pueden cambiar el balance. Llamar a
`parallelStream()` no promete una mejora de rendimiento.

Mide una carga de trabajo representativa antes de elegir la ejecución paralela
para mejorar el rendimiento. La comparación adecuada incluye el tamaño real de
los datos, el costo de la operación, los requisitos de orden y el entorno. Un
ejemplo pequeño puede demostrar el comportamiento; no puede establecer que el
código de producción se ejecutará más rápido.

## Elige la responsabilidad antes que la clase

Comienza con la oración que describe el problema. Deja el nombre de la API para
después.

| Enunciado del problema                                      | Punto de partida útil                                                  | Qué debes comprobar antes de elegirlo                                     |
| ----------------------------------------------------------- | ---------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| «Necesito representar trabajo con o sin resultado».         | `Runnable`, `Callable<V>`                                              | ¿Quién controla la ejecución y el manejo de fallos?                       |
| «Necesito ejecutar operaciones independientes que esperan». | `ExecutorService`; a menudo, un hilo virtual por tarea en Java moderno | ¿Quién controla el ejecutor y qué limita las dependencias escasas?        |
| «Necesito recuperar un resultado más adelante».             | `Future<V>`                                                            | ¿Dónde ocurrirá la espera y qué hace realmente la cancelación?            |
| «Necesito transformar o combinar resultados dependientes».  | `CompletableFuture<T>`                                                 | ¿Qué ejecutor y política de errores usa cada etapa?                       |
| «Varias tareas actualizan un contador».                     | `AtomicInteger` o un lock                                              | ¿La invariante se extiende más allá de esa variable?                      |
| «Varias tareas comparten estado indexado por claves».       | `ConcurrentHashMap` y sus operaciones compuestas                       | ¿Una operación documentada cubre toda la transición de estado?            |
| «Los productores entregan trabajo a los consumidores».      | Un `BlockingQueue` adecuado                                            | ¿La capacidad debe aplicar backpressure y qué operaciones pueden esperar? |
| «Solo N tareas pueden usar una dependencia».                | `Semaphore`                                                            | ¿Los permisos siempre se liberan, incluso ante un fallo?                  |
| «Necesito dividir un cálculo orientado a CPU».              | Fork/join o un stream paralelo                                         | ¿El trabajo es grande, independiente, sin interferencias y medido?        |

Después de elegir la responsabilidad, evalúa el ciclo de vida, la política de
fallos, la carga de trabajo, la contención, el orden y los límites de recursos
antes de seleccionar la API concreta.

Como ejercicio, vuelve al dashboard y escribe cinco oraciones antes de cambiar el
código: qué operaciones son independientes, qué resultados producen, dónde es
aceptable esperar, qué estado comparten y qué límites de las dependencias deben
mantenerse ante una concurrencia mayor. Cada respuesta apunta a una parte del mapa
y al siguiente fragmento de documentación o prueba que necesita el programa.

[^runnable-api]: [Documentación de la API `Runnable`](https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/lang/Runnable.html)

[^callable-api]: [Documentación de la API `Callable<V>`](https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/util/concurrent/Callable.html)

[^thread-api]: [Documentación de la API `Thread`](https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/lang/Thread.html)

[^executor-api]: [Documentación de la API `Executor`](https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/util/concurrent/Executor.html)

[^executor-service-api]: [Documentación de la API `ExecutorService`](https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/util/concurrent/ExecutorService.html)

[^jep-444]: [JEP 444: Hilos virtuales](https://openjdk.org/jeps/444)

[^future-api]: [Documentación de la API `Future<V>`](https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/util/concurrent/Future.html)

[^completable-future-api]: [Documentación de la API `CompletableFuture<T>`](https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/util/concurrent/CompletableFuture.html) y [documentación de la API `CompletionStage<T>`](https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/util/concurrent/CompletionStage.html). La sección de políticas de `CompletableFuture` también explica que las acciones dependientes que no son asíncronas pueden ejecutarse en el hilo que completa la etapa actual o en otro código que invoque un método de finalización.

[^jls-memory-actions]: [Especificación del Lenguaje Java, §17.4.2: Acciones](https://docs.oracle.com/javase/specs/jls/se25/html/jls-17.html#jls-17.4.2)

[^jls-happens-before]: [Especificación del Lenguaje Java, §17.4.5: Orden happens-before](https://docs.oracle.com/javase/specs/jls/se25/html/jls-17.html#jls-17.4.5)

[^juc-memory-consistency]: [Propiedades de consistencia de memoria de `java.util.concurrent`](https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/util/concurrent/package-summary.html#MemoryConsistency)

[^lock-api]: [Documentación de la API `Lock`](https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/util/concurrent/locks/Lock.html)

[^atomic-package]: [Documentación del paquete `java.util.concurrent.atomic`](https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/util/concurrent/atomic/package-summary.html)

[^concurrent-map-api]: [Documentación de la API `ConcurrentMap`](https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/util/concurrent/ConcurrentMap.html)

[^concurrent-hash-map-api]: [Documentación de la API `ConcurrentHashMap`](https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/util/concurrent/ConcurrentHashMap.html)

[^blocking-queue-api]: [Documentación de la API `BlockingQueue`](https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/util/concurrent/BlockingQueue.html)

[^juc-synchronizers]: [Descripción general de los sincronizadores de `java.util.concurrent`](https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/util/concurrent/package-summary.html#Synchronizers)

[^fork-join-pool-api]: [Documentación de la API `ForkJoinPool`](https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/util/concurrent/ForkJoinPool.html)

[^stream-package]: [Documentación del paquete `java.util.stream`](https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/util/stream/package-summary.html)
