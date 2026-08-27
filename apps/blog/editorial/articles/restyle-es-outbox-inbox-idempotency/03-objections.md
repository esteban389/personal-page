# Objeciones estructurales

## Lector escéptico y bien informado

| Objeción o pregunta                                                                      | Sección afectada  | Respuesta propuesta                                                                                                                                               | Decisión                |
| ---------------------------------------------------------------------------------------- | ----------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------- |
| El incidente no demuestra que un reintento haya creado los registros duplicados.         | Apertura          | Conservar explícitamente que se desconoce la operación histórica y que una solicitud repetida es solo una posibilidad.                                            | Resuelta en el borrador |
| Un outbox por sí solo no garantiza idempotencia ni una entrega `exactly-once`.           | Outbox; cierre    | Mostrar que el outbox conserva la intención, mientras que la clave y el inbox controlan el efecto repetido; limitar la garantía a un efecto de negocio por clave. | Resuelta en el borrador |
| Un `findUnique` seguido de un `create` puede sufrir una carrera.                         | Inbox             | Mantener la restricción única sobre `idempotencyKey` y explicar que una transacción pierde la carrera, revierte y puede reintentar para leer el resultado.        | Resuelta en el borrador |
| Crear Student antes que Users deja una ventana inconsistente.                            | Inbox y diagrama  | Reconocer la consistencia eventual y dejar explícito que el estado visible durante esa ventana es una decisión de producto separada.                              | Resuelta en el borrador |
| La misma información personal en dos solicitudes no implica que sean la misma operación. | Reglas de negocio | Separar identidad idempotente de validación y unicidad de dominio.                                                                                                | Resuelta en el borrador |

## Lector con menos experiencia

| Punto de confusión                                        | Prerrequisito faltante                     | Respuesta propuesta                                                                                       | Decisión                |
| --------------------------------------------------------- | ------------------------------------------ | --------------------------------------------------------------------------------------------------------- | ----------------------- |
| Por qué una acción de negocio contiene dos transacciones. | Propiedad de datos por servicio            | Explicar que Student y Users confirman cambios en bases separadas.                                        | Resuelta en el borrador |
| Qué significa que un timeout sea ambiguo.                 | Diferencia entre respuesta y commit remoto | Usar el escenario donde Users crea el usuario, pero Student nunca recibe el `userId`.                     | Resuelta en el borrador |
| Qué guarda realmente el outbox.                           | Estado durable del trabajo pendiente       | Describir la fila como la intención de crear el usuario, guardada junto al cambio local.                  | Resuelta en el borrador |
| Por qué no basta con guardar la clave.                    | Necesidad de completar la conversación     | Explicar que Student todavía necesita el `userId` original, por lo que el inbox guarda clave y resultado. | Resuelta en el borrador |
| Si “una vez” se refiere al mensaje o al efecto.           | Diferencia entre entrega y efecto          | Cerrar con “entrega repetida, un solo efecto de negocio”.                                                 | Resuelta en el borrador |

## Objeciones rechazadas

- Exigir una reconstrucción causal del incidente histórico: el artículo no cuenta
  con evidencia para atribuir los duplicados a una secuencia concreta y conserva
  esa incertidumbre.
- Expandir la comparación hacia sagas, Kafka u otras alternativas: cambiaría el
  alcance del artículo, que se concentra en outbox, inbox e idempotencia.
- Definir qué estado debe mostrar el producto durante la consistencia eventual: es
  una decisión válida, pero distinta del mecanismo arquitectónico explicado aquí.
