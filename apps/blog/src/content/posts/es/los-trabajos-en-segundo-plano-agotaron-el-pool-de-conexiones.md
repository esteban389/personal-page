---
title: 'Nuestros trabajos en segundo plano agotaron el pool de conexiones. Entonces la API dejó de funcionar.'
description: 'Cómo el recálculo de promedios terminó afectando a toda la API al compartir las conexiones a la base de datos, y qué resolvimos al limitar la ejecución.'
pubDate: '2026-09-11T12:00:00-05:00'
category: 'Artículos técnicos'
lang: 'es'
translationKey: 'background-jobs-database-pool'
heroImage: '../../../assets/posts/background-jobs-database-pool/borrowed-keys.png'
heroImageAlt: 'Varias llaves de latón descansan sobre carpetas azules apiladas, debajo de un portallaves vacío y junto a una carpeta de color crema.'
draft: false
---

Los profesores estaban ingresando notas, pero los promedios tardaban demasiado en actualizarse. Algunos presionaban el botón para volver a calcularlos. Después, otras partes de la aplicación empezaron a fallar.

Ocurrió un fin de semana, mientras los profesores necesitaban subir notas. Empecé a revisar los logs. Las peticiones agotaban el tiempo de espera para obtener una conexión a la base de datos.

Los cálculos se ejecutaban en segundo plano, dentro de la misma aplicación Java que atendía esas peticiones. También usaban el mismo pool de conexiones.

## Por qué mantuvimos los trabajos dentro de la aplicación

La aplicación era un sistema de información escolar construido con Java, Spring Boot y MySQL. Ingresar una nota activaba un trabajo para actualizar los promedios de un estudiante durante el período. Otros cálculos abarcaban un curso completo, entendido como un grupo de estudiantes.

Cada colegio tenía su propio despliegue. Mantener una infraestructura pequeña era importante: un worker separado sería otro servicio que desplegar y mantener para cada colegio. Ejecutar los trabajos dentro de la aplicación web era una decisión práctica.

Eso también significaba que los profesores que navegaban por la aplicación y los cálculos que actualizaban promedios necesitaban conexiones del mismo pool de Hikari. Cuando no quedaban conexiones disponibles y el pool había alcanzado su límite, las peticiones tenían que esperar. Si esperaban demasiado, fallaban. Ese es el comportamiento que describe la [documentación de configuración de Hikari](https://github.com/brettwooldridge/HikariCP#configuration-knobs-baby), y coincidía con los errores de los logs.

Reiniciar el servidor hacía que la aplicación volviera a funcionar. Cuando se reanudaban los trabajos, regresaban los problemas. Junto con las métricas, eso me dio motivos para centrarme en los recálculos.

## Mi primera corrección solo ayudó en parte

Al principio me concentré en cuántos trabajos se ejecutaban al mismo tiempo.

El primer cambio redujo la concurrencia de los trabajos que se activaban al cambiar las notas. El tamaño de sus lotes, el límite de trabajos en paralelo y la cantidad de hilos del executor pasaron de diez a dos. Ayudó, pero cuando aumentó la actividad de los profesores, las fallas volvieron.

Había varias formas de pedirle a la aplicación que recalculara los promedios. No todas ejecutaban el mismo código:

| Qué lo activaba                                      | Cómo se ejecutaba                                                                                             |
| ---------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| Un profesor cambiaba notas                           | Un trabajo persistente a nivel de nota, cuya concurrencia se redujo con la primera corrección.                |
| Alguien presionaba el botón para recalcular un curso | Un trabajo persistente de curso que procesaba a los estudiantes uno por uno.                                  |
| Alguien generaba un reporte de comité                | Una ruta separada que recalculaba el curso antes de construir el reporte, usando un pool privado de 20 hilos. |

El trabajo manual de curso ya compartía un límite de dos macrotrabajos simultáneos con otros tipos de recálculo de mayor alcance. Ese límite no lo introduje durante esta corrección.

Su bucle de estudiantes ya era secuencial. En una versión simplificada de Java, se veía así:

```java
// Ejemplo: el trabajo persistente de curso.
for (Student student : section.students()) {
    recalculateSubjects(student, period);
    recalculateOverallAverage(student, period);
}
```

El cálculo del reporte de comité tenía su propia concurrencia que revisar. Llamar a todo «el trabajo de curso» ocultaba esa diferencia.

Yo no había escrito el trabajo original, pero podría haber cometido errores similares. No conocía muy bien este tipo de control de concurrencia antes de tener que resolver el problema.

## Un límite compartido para el cálculo del reporte

El cambio posterior reemplazó el pool privado de la ruta de reportes por un `ThreadPoolTaskExecutor` compartido de Spring. Tenía ocho hilos y una cola en memoria con capacidad para 500 tareas.

Los estudiantes se enviaban en lotes de cuatro. El código que los enviaba esperaba a que terminara un lote antes de enviar el siguiente:

```java
// Ejemplo: recálculo previo a un reporte de comité.
// sharedReportExecutor se inyecta; quien envía las tareas se ejecuta fuera de él.
for (List<Student> batch : batchesOf(students, 4)) {
    List<Future<?>> pending = new ArrayList<>();
    for (Student student : batch) {
        pending.add(sharedReportExecutor.submit(
            () -> recalculate(student, period)));
    }
    for (Future<?> task : pending) {
        task.get();
    }
}
```

Ambos fragmentos omiten las transacciones, el manejo de errores y el código del ciclo de vida. Son ejemplos de cómo estaba organizado el trabajo.

El executor de reportes ahora tenía límites tanto para sus hilos como para las tareas en espera. Spring los expone como [opciones de configuración separadas](https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/scheduling/concurrent/ThreadPoolTaskExecutor.html). Su cola en memoria era distinta de la cola en base de datos que usaban los trabajos persistentes de recálculo.

Esos trabajos persistentes ya tenían comportamientos útiles que se conservaron. Pedir un recálculo de curso que ya estaba activo devolvía el trabajo existente. Los cambios repetidos de notas se agrupaban en trabajos a nivel de nota. Si una nota cambiaba mientras su trabajo se estaba ejecutando, este quedaba marcado para otra pasada al terminar. Ninguna de esas funciones se añadió durante las correcciones de emergencia.

![Los cálculos en segundo plano y las peticiones web obtienen conexiones del mismo pool de Hikari para acceder a MySQL.](/images/posts/background-jobs-database-pool/execution-paths.es.svg)

_Distintas rutas de ejecución, el mismo pool. Limitar el trabajo en segundo plano ayuda a dejar conexiones disponibles para los profesores que usan la aplicación._

También revisé el uso de conexiones de MySQL y su límite configurado, y luego ajusté la configuración de Hikari. La segunda corrección permitió configurar el pool, con un máximo predeterminado de 24 conexiones. Eso fue parte de nuestra mitigación, no una recomendación de tamaño para cualquier aplicación.

## Comprobar que los profesores podían volver a usar la aplicación

Cuando se estabilizó el despliegue del 7 de agosto, comparé unos 15 minutos de actividad en los despliegues de dos colegios. Desaparecieron las esperas por conexiones y los timeouts de Hikari. Los endpoints de lectura de notas siguieron respondiendo con más tráfico y cientos de recálculos habituales. En esa ventana no aparecieron nuevos errores `500` al guardar notas ni fallas de recálculo.

Después hicimos una prueba controlada: recálculos de cursos junto con lecturas de reportes grandes. Un colegio completó tres trabajos de curso que abarcaban 135 estudiantes, además de 20 lecturas grandes, sin esperas por conexiones, timeouts ni respuestas `5xx`.

El primer trabajo de curso del otro colegio tardó bastante más. Detuvimos esa prueba antes de que terminara, aunque el trabajo seguía avanzando sin fallas ni saturación del pool.

Estas pruebas ejercitaron los trabajos persistentes de curso, que eran secuenciales. No validaron el recálculo de reportes de comité con los nuevos lotes. Las observaciones respaldaban que la aplicación se había recuperado después de los cambios, pero no permitían aislar cuánto había contribuido cada uno.

Los promedios desactualizados que habíamos revisado durante la auditoría también se habían puesto al día. No había ejecutado trabajos idénticos antes y después de la corrección, así que no podía decir si un cálculo individual se había vuelto más rápido o más lento.

## Lo que sigo revisando

Consideré mover el trabajo a un worker dedicado y hacer un cambio más grande para consultar los datos de forma agrupada antes de calcular. Con los profesores esperando para ingresar notas, elegí los cambios más pequeños que permitieron recuperar la disponibilidad.

Todavía queda bastante por mejorar. El cálculo lee y escribe datos dentro de bucles anidados de estudiantes y asignaturas. Limitar cuántos cálculos se ejecutan al mismo tiempo no elimina esas consultas.

Un worker podría ayudar a aislar la aplicación, pero aun así tendría que coordinar las versiones de la API y del worker, y controlar el uso de la base de datos entre ambos.

Semanas después, estoy revisando de nuevo el recálculo, esta vez con más espacio para métricas y pruebas. Quiero una carga de trabajo repetible para comparar lecturas agrupadas y escrituras por lotes, verificando que las notas sigan siendo correctas y midiendo cuánto trabajo hace la base de datos.
