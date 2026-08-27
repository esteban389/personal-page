---
title: 'Lo que los errores por usuarios duplicados me enseñaron sobre outbox e idempotencia'
description: 'Un incidente de soporte en producción me llevó a separar el trabajo persistente del procesamiento sin duplicados mediante un outbox, un inbox y la idempotencia.'
pubDate: '2026-08-27T12:00:00-05:00'
category: 'Artículos técnicos'
lang: 'es'
translationKey: 'outbox-inbox-idempotency'
heroImage: '../../../assets/posts/outbox-inbox-idempotency/outbox-inbox-handoff.png'
draft: false
---

Después de suficientes tickets de soporte sobre estudiantes que no podían iniciar
sesión, dejé de ver cada caso como un problema aislado de datos. Las operaciones del
personal también fallaban, y yo siempre terminaba revisando el mismo límite entre
dos servicios.

Para este artículo, llamaré Student y Users a esos servicios. Los nombres están
simplificados, pero el requisito sí existía en mi trabajo: crear un estudiante en
Student también requería un registro de usuario de la aplicación en Users.

Sobre el papel, el flujo era corto. Student le pedía a Users que creara el usuario,
recibía un `userId` y luego guardaba el estudiante. Lo difícil era todo lo que la red
podía dejar sin respuesta entre esas dos transacciones locales. Student podía no
recibir una respuesta incluso si Users ya había hecho commit de su transacción. Reintentar
podía recuperar la operación o repetir un efecto que ya había ocurrido.

El outbox transaccional, la idempotencia y el inbox resuelven partes distintas de
ese problema. El outbox conserva el trabajo que Student todavía necesita completar.
Una clave de idempotencia da la misma identidad a los intentos repetidos. El inbox
recuerda lo que Users ya hizo y qué resultado devolvió. Los agregaré en ese orden,
pero primero quiero explicar por qué la llamada directa parecía razonable.

Trabajé por primera vez en este flujo cuando era junior. Sabíamos que la transacción
de un servicio no incluía mágicamente la del otro. La llamada directa fue una
decisión consciente con ese costo para una interacción uno a uno, no un intento de fingir que el
límite no existía.

Su atractivo era fácil de ver en el flujo ideal. Student llamaba a Users, tomaba el
ID de la respuesta y terminaba de guardar el estudiante. El código podía leerse casi
igual que el requisito.

Los casos de soporte hicieron que su límite fuera más difícil de ignorar. El inicio
de sesión de un estudiante llegó hasta la consulta del usuario de la aplicación y
falló allí. Cuando inspeccionamos los datos, encontramos tres registros de usuario
habilitados con el mismo número de documento. En otros casos, los estudiantes no
podían iniciar sesión o las operaciones del personal fallaban porque la relación
esperada entre estudiante y usuario no existía o era inconsistente.

Los síntomas cambiaban, pero yo seguía llegando al mismo límite. Student esperaba un
único registro utilizable en Users para el estudiante. Cuando esa relación faltaba o
era ambigua, una operación que parecía fallar en Student podía terminar fallando en
Users.

Mi reacción no fue especialmente sofisticada: esto es absurdo. Sabía que podía
controlar mejor las solicitudes a Users, pero seguía gastando tiempo en reparar las
consecuencias cuando algo salía mal en ese límite.

Todavía no sé qué operación histórica creó esos tres registros. Una solicitud
repetida es una posibilidad, pero también existen otras secuencias posibles. Puedo
explicar el fallo en el límite entre servicios sin fingir que eso demuestra la causa
del incidente.

## La llamada directa todavía contiene dos transacciones

En términos de negocio, crear un estudiante y su usuario de la aplicación suena
como una sola acción. El estado sigue dividido. Student es responsable del registro
del estudiante, mientras que Users es responsable del registro del usuario.

Crear el usuario forma parte de crear el estudiante. Student necesita el `userId`
devuelto para conectar los registros y completar su trabajo. Perder ese resultado
deja incompleta la operación de negocio desde la perspectiva de Student, aunque
Users ya haya hecho su parte.

Cada servicio puede hacer atómicos sus propios cambios. Lo que la llamada no puede
hacer es unir esas transacciones locales en un solo commit o rollback que abarque
ambos servicios.[^outbox] Una vez que Users hace commit de su transacción, Student no
puede deshacerla como si los dos cambios pertenecieran a una misma base de datos.

La solicitud directa también obliga a Student a esperar a Users. Un fallo antes de
que Users haga commit puede detener la creación del estudiante. Un fallo después es
más incómodo, porque el usuario puede existir aunque Student no haya terminado su
parte.

Supongamos que Users crea el usuario y devuelve un `userId`, pero la respuesta nunca
llega a Student. Student sabe que no recibió la respuesta. No sabe si Users completó
la solicitud. Enviarla de nuevo puede recuperar la operación o repetir el efecto, a
menos que Users pueda reconocer el intento.[^retries]

Un timeout dice que la respuesta no llegó. No dice si Users alcanzó a hacer commit
de su transacción.

## El outbox conserva la intención de Student

Pensé por primera vez en usar un outbox después de lidiar con notificaciones que no
se habían entregado. No me molestaba solamente que fallaran. Una vez que la solicitud
original desaparecía, teníamos poco estado persistente que nos ayudara a enviarlas de
nuevo.

Mientras diseñaba ese flujo, empecé a buscar otros límites entre servicios donde la
misma idea pudiera servir. Student y Users era uno de ellos.

Aquí el problema ya no era solamente que la llamada pudiera fallar. La necesidad de
Student de crear un usuario vivía dentro de esa única solicitud. Cuando la solicitud
desaparecía, Student no tenía un registro persistente al cual volver.

Un outbox le da ese registro. Student guarda su propio cambio y la intención de
crear el usuario en la misma transacción local. Si la transacción se confirma, ambos
quedan guardados. Si se revierte, ninguno queda guardado. Otro proceso puede enviar
la intención más adelante.[^outbox]

Eso era lo que me faltaba del lado de Student. La solicitud podía terminar, pero el
trabajo pendiente no desaparecía con ella. La fila del outbox todavía indicaría qué
operación debía ejecutarse y a qué estudiante pertenecía.

Sin embargo, conservar la intención también significa que el emisor puede entregarla
más de una vez. Supongamos que Users crea el usuario y devuelve el resultado, pero
Student no registra ese éxito. La fila del outbox todavía parece pendiente, así que
volver a enviarla es razonable desde el lado de Student. Mientras tanto, Users puede
haber terminado el trabajo.[^outbox]

Student ya puede recuperar la intención. Users necesita reconocer que la siguiente
entrega pertenece a la misma operación.

## La entrega repetida introduce la idempotencia

Aquí entra la idempotencia. Student asigna una `idempotencyKey` a la operación de
crear usuario y la reutiliza cada vez que el emisor del outbox entrega esa operación.
Usar una clave nueva en cada intento haría que Users los interpretara como
operaciones distintas.[^retries]

Student todavía puede reintentar. La clave le da a Users una identidad estable para
reconocer que esos intentos pertenecen a la misma operación.

La terminología puede hacer que esto suene más abstracto de lo que debe ser el
código del lado de Student. Los ejemplos de TypeScript de este artículo son
inventados e incompletos. Usan llamadas al estilo de Prisma solo para ilustrar las
dos transacciones locales. No son código de producción.[^prisma]

La transacción de Student crea el estudiante y su fila del outbox al mismo tiempo:

```ts
async function createStudent(studentData: StudentData, idempotencyKey: string) {
  return prisma.$transaction(async (tx) => {
    const student = await tx.student.create({ data: studentData });

    await tx.outbox.create({
      data: {
        idempotencyKey,
        studentId: student.id,
        operation: 'create-user',
      },
    });

    return student;
  });
}
```

La fila del outbox conserva la misma `idempotencyKey` cada vez que el emisor intenta
entregar de nuevo esta operación de crear usuario.

## El inbox conserva el resultado de Users

Una vez que Student puede reintentar, Users necesita algo más que una forma de
decir: «ya vi esto». Student todavía necesita el `userId` del primer intento.

Si Users solo guarda la clave, puede evitar crear otro usuario, pero no puede
completar la operación original. El inbox debe conservar tanto la
`idempotencyKey` como el resultado que le corresponde. Así, una solicitud repetida
puede recibir la misma respuesta en lugar de ejecutar el mismo cambio otra vez.[^inbox]

En este caso, el inbox es una tabla normal. Cuando la clave es nueva, Users crea el
usuario y la fila del inbox en una misma transacción local. Cuando la clave ya
existe, Users devuelve el resultado que guardó antes.

Guardar ambos cambios en la misma transacción hace que el registro sea confiable. Si
la creación del usuario falla, no debe existir una entrada en el inbox que afirme lo
contrario. Si falla la escritura en el inbox, la creación del usuario se revierte
con ella.

El código del lado de Users puede seguir siendo bastante pequeño:

```ts
async function createUser(userData: UserData, idempotencyKey: string) {
  return prisma.$transaction(async (tx) => {
    // Ensure it is processed once.
    const previous = await tx.inbox.findUnique({
      where: { idempotencyKey },
    });

    if (previous) return previous.result;

    const user = await tx.user.create({ data: userData });
    const result = { userId: user.id };

    await tx.inbox.create({
      data: { idempotencyKey, result },
    });

    return result;
  });
}
```

El ejemplo supone que `idempotencyKey` es única. Dos llamadas concurrentes podrían
consultar el inbox antes de que alguna inserte la fila, pero solo una transacción
puede insertar esa clave. La otra se revierte y puede reintentar. En el siguiente
intento, `findUnique` devuelve el resultado que ya estaba guardado para la
operación.[^prisma]

Al poner las dos transacciones locales una al lado de la otra, el cambio se ve con
más claridad:

```text
Flujo síncrono actual
Student -> Users: crear usuario
Users -> estado de Users: guardar usuario
Users --> Student: userId
Student -> estado de Student: guardar estudiante

Flujo con outbox e inbox
Student -> estado de Student: guardar estudiante + outbox (transacción local)
Emisor del outbox -> Users: crear usuario [idempotencyKey]
Users -> estado de Users: guardar usuario + resultado del inbox (transacción local)
Users --> Emisor del outbox: userId
Emisor del outbox -> estado de Student: asociar userId
Emisor del outbox -> Users: repetir creación de usuario [misma idempotencyKey]
Users --> Emisor del outbox: userId guardado
```

Este flujo permite recuperarse aunque ambos servicios no estén de acuerdo de
inmediato. Student puede hacer commit de la transacción que guarda su registro y la
entrada del outbox antes de que Users cree el usuario,
por lo que la relación puede quedar incompleta durante un tiempo. El outbox no
decide qué debe mostrar la aplicación durante ese intervalo. Esa es otra decisión
de producto.

## La idempotencia no reemplaza las reglas de negocio

La misma `idempotencyKey` le indica a Users que se trata de otro intento de la misma
operación. Una clave diferente identifica una operación diferente, incluso si
algunos campos de las dos solicitudes coinciden.[^retries]

Eso es todo lo que debe decidir el inbox. No debería comparar solicitudes distintas
y combinarlas en silencio porque los datos de la solicitud se parecen. Decidir si dos operaciones
separadas son válidas corresponde a las validaciones y reglas de unicidad del
dominio, no al inbox.

## Entrega repetida, un solo efecto de negocio

El outbox puede enviar la misma operación más de una vez. Para una
`idempotencyKey`, Users puede reconocer la repetición, omitir la segunda creación
del usuario y devolver el `userId` que guardó la primera vez.

La entrega ocurrió más de una vez. El efecto de crear usuario no. Esa es la garantía
acotada de este diseño, no una entrega literal `exactly-once`.[^idempotency]

Lo que quería de este diseño no era una transacción mágica entre dos servicios.
Quería que cada servicio supiera qué le correspondía cuando el camino fácil dejara
de ser fácil. Student conserva el trabajo que todavía necesita completar. Users
conserva el resultado de la operación que ya procesó.

Construí por primera vez el camino directo cuando era junior. El trabajo posterior
con outbox me dio una mejor forma de razonar sobre él, así que volví al mismo límite
con preguntas distintas. Ese es otro artículo que quiero escribir: cómo volver
sobre el trabajo anterior se ha convertido en parte de mi manera de aprender.

[^outbox]: AWS Prescriptive Guidance, [“Transactional outbox pattern”](https://docs.aws.amazon.com/prescriptive-guidance/latest/cloud-design-patterns/transactional-outbox.html); Chris Richardson, Microservices.io, [“Pattern: Transactional outbox”](https://microservices.io/patterns/data/transactional-outbox.html).

[^retries]: IETF, [_RFC 9110: HTTP Semantics_, sección 9.2.2](https://www.rfc-editor.org/rfc/rfc9110.html#section-9.2.2); Malcolm Featonby, AWS Builders' Library, [“Making retries safe with idempotent APIs”](https://aws.amazon.com/builders-library/making-retries-safe-with-idempotent-APIs/).

[^inbox]: Chris Richardson, Microservices.io, [“Pattern: Idempotent Consumer”](https://microservices.io/patterns/communication-style/idempotent-consumer.html); Malcolm Featonby, AWS Builders' Library, [“Making retries safe with idempotent APIs”](https://aws.amazon.com/builders-library/making-retries-safe-with-idempotent-APIs/).

[^idempotency]: IETF, [_RFC 9110: HTTP Semantics_, sección 9.2.2](https://www.rfc-editor.org/rfc/rfc9110.html#section-9.2.2); AWS Prescriptive Guidance, [“Transactional outbox pattern”](https://docs.aws.amazon.com/prescriptive-guidance/latest/cloud-design-patterns/transactional-outbox.html).

[^prisma]: Documentación de Prisma, [“Transactions and batch queries”](https://www.prisma.io/docs/orm/prisma-client/queries/transactions), [“Prisma Client API”](https://www.prisma.io/docs/orm/reference/prisma-client-reference) y [“Error Reference”](https://www.prisma.io/docs/orm/reference/error-reference).

## Preguntas para Esteban

Ninguna.

## Afirmaciones nuevas

Ninguna. La traducción conserva las afirmaciones y límites del artículo publicado.
