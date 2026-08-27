# Semillas por sección

Todas las semillas son traducciones derivadas del artículo publicado. El localizador
base es `apps/blog/src/content/posts/outbox-inbox-idempotency.md`.

## Apertura

| Semilla                                                                                                                                            | Procedencia                            | Localizador de origen |
| -------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------- | --------------------- |
| Después de suficientes tickets de soporte sobre estudiantes que no podían iniciar sesión, dejé de ver cada caso como un problema aislado de datos. | Derived from existing published source | Párrafo inicial 1     |
| Sobre el papel, el flujo era corto; lo difícil era todo lo que la red podía dejar sin respuesta entre las dos transacciones locales.               | Derived from existing published source | Párrafo inicial 3     |
| Todavía no sé qué operación histórica creó esos tres registros.                                                                                    | Derived from existing published source | Párrafo inicial 11    |

### Límites de expansión

- Incluir: tickets, Student/Users, registros duplicados, frustración y causa desconocida.
- Excluir: atribuir los duplicados a reintentos o añadir detalles del sistema real.
- Claims relevantes: C-01, C-02.

## La llamada directa todavía contiene dos transacciones

| Semilla                                                                                                                         | Procedencia                            | Localizador de origen                                           |
| ------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------- | --------------------------------------------------------------- |
| En términos de negocio, crear un estudiante y su usuario de la aplicación suena como una sola acción. El estado sigue dividido. | Derived from existing published source | `## The direct call still contains two transactions`, párrafo 1 |
| Un timeout dice que la respuesta no llegó. No dice qué confirmó Users.                                                          | Derived from existing published source | Misma sección, párrafo final                                    |

### Límites de expansión

- Incluir: propiedad de datos, dos transacciones locales y respuesta perdida.
- Excluir: afirmar que el flujo directo intentaba implementar una transacción distribuida.
- Claims relevantes: C-03, C-04.

## El outbox conserva la intención de Student

| Semilla                                                                                                                                   | Procedencia                            | Localizador de origen                                 |
| ----------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------- | ----------------------------------------------------- |
| Un outbox le da a Student un registro durable: Student guarda su cambio y la intención de crear el usuario en la misma transacción local. | Derived from existing published source | `## The outbox preserves Student's intent`, párrafo 4 |
| Student ya puede recuperar la intención. Users necesita reconocer que la siguiente entrega pertenece a la misma operación.                | Derived from existing published source | Misma sección, párrafo final                          |

### Límites de expansión

- Incluir: notificaciones como origen del razonamiento, atomicidad local y entregas repetidas.
- Excluir: presentar la solución Student/Users como ya desplegada o el outbox como idempotente por sí mismo.
- Claims relevantes: C-05.

## La entrega repetida introduce la idempotencia

| Semilla                                                                                                                                      | Procedencia                            | Localizador de origen                                    |
| -------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------- | -------------------------------------------------------- |
| Student asigna una `idempotencyKey` a la operación de crear usuario y la reutiliza cada vez que el emisor del outbox entrega esa operación.  | Derived from existing published source | `## Repeated delivery introduces idempotency`, párrafo 1 |
| Los ejemplos de TypeScript son inventados, incompletos y usan llamadas al estilo de Prisma solo para ilustrar las dos transacciones locales. | Derived from existing published source | Misma sección, párrafo 3                                 |

### Límites de expansión

- Incluir: una clave estable y el snippet sin alterar identificadores.
- Excluir: presentar el código como ejecutable, verificado o de producción.
- Claims relevantes: C-06.

## El inbox conserva el resultado de Users

| Semilla                                                                                 | Procedencia                            | Localizador de origen                            |
| --------------------------------------------------------------------------------------- | -------------------------------------- | ------------------------------------------------ |
| El inbox debe conservar tanto la `idempotencyKey` como el resultado que le corresponde. | Derived from existing published source | `## The inbox keeps the Users result`, párrafo 2 |
| Si la clave ya existe, Users devuelve el resultado que guardó antes.                    | Derived from existing published source | Misma sección, párrafo 3                         |
| El flujo cambia acuerdo inmediato por capacidad de recuperación.                        | Derived from existing published source | Misma sección, párrafo posterior al diagrama     |

### Límites de expansión

- Incluir: transacción de Users, unicidad, concurrencia, reintento y ventana eventual.
- Excluir: prometer ausencia global de duplicados o decidir la experiencia de producto.
- Claims relevantes: C-07, C-08.

## La idempotencia no reemplaza las reglas de negocio

| Semilla                                                                                                          | Procedencia                            | Localizador de origen                                       |
| ---------------------------------------------------------------------------------------------------------------- | -------------------------------------- | ----------------------------------------------------------- |
| Una clave diferente identifica una operación diferente, incluso si algunos campos coinciden.                     | Derived from existing published source | `## Idempotency does not replace business rules`, párrafo 1 |
| Permitir dos operaciones distintas corresponde a las validaciones y reglas de unicidad del dominio, no al inbox. | Derived from existing published source | Misma sección, párrafo 2                                    |

### Límites de expansión

- Incluir: distinción entre identidad de operación y unicidad de negocio.
- Excluir: proponer una regla concreta de unicidad para documentos o usuarios.
- Claims relevantes: C-10.

## Entrega repetida, un solo efecto de negocio

| Semilla                                                                                                                                                | Procedencia                            | Localizador de origen                                  |
| ------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------- | ------------------------------------------------------ |
| La entrega ocurrió más de una vez. El efecto de crear usuario no.                                                                                      | Derived from existing published source | `## Repeated delivery, one business effect`, párrafo 2 |
| No quería una transacción mágica entre dos servicios; quería que cada servicio supiera qué le correspondía cuando el camino fácil dejara de ser fácil. | Derived from existing published source | Misma sección, párrafo 3                               |
| Volví al mismo límite con preguntas distintas.                                                                                                         | Derived from existing published source | Misma sección, párrafo final                           |

### Límites de expansión

- Incluir: garantía acotada, propiedad del estado y callback al aprendizaje.
- Excluir: afirmar entrega `exactly-once` o resultados medidos del diseño propuesto.
- Claims relevantes: C-09.

## Preguntas para Esteban

Ninguna.
