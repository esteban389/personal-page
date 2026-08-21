# Structural objections

## Skeptical, well-informed reader

| Objection or question                                               | Affected section                 | Proposed response                                                                                                                 | Decision |
| ------------------------------------------------------------------- | -------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- | -------- |
| Are you claiming that a retry created the three historical records? | Opening                          | No. The cause is unknown. The incident motivates the boundary analysis but does not prove a failure sequence.                     | Include  |
| Why not keep the direct call?                                       | Opening and transaction boundary | Explain why it looked reasonable, then trace the lost-result window created by two service-owned transactions.                    | Include  |
| Why can't one transaction cover both services?                      | Transaction boundary             | Each service can make its own changes atomic; the call does not merge their state ownership.                                      | Include  |
| Isn't an outbox enough?                                             | Repeated delivery                | It preserves Student's intent, but the same intent may reach Users again.                                                         | Include  |
| Why use one `idempotencyKey`?                                       | Idempotency                      | The key identifies one logical operation across repeated delivery attempts. A fresh key would look like a new operation.          | Include  |
| What happens when the same key reaches Users again?                 | Inbox                            | Users returns the result stored with that key instead of applying the change again.                                               | Include  |
| Can the simple inbox check race?                                    | Inbox code                       | State that Inbox `idempotencyKey` is unique. A losing concurrent insert rolls back the local transaction, and the call can retry. | Include  |
| Does idempotency prevent every duplicate or conflict?               | Business rules                   | No. It recognizes the same operation by key; separate domain rules govern conflicts between different operations.                 | Include  |
| Is this exactly-once delivery?                                      | Guarantee                        | No. Delivery may repeat; the identified operation has one business effect.                                                        | Include  |
| Do the snippets describe production code?                           | Code examples                    | No. They are invented, incomplete Prisma-style pseudocode created to expose the two local transactions.                           | Include  |
| Does the article claim a deployment or measured result?             | Evidence boundary                | No. Keep implementation status and outcomes out of the reader-facing narrative.                                                   | Include  |

## Less-experienced reader

| Point of confusion                       | Missing prerequisite     | Proposed response                                                                                         | Decision |
| ---------------------------------------- | ------------------------ | --------------------------------------------------------------------------------------------------------- | -------- |
| Why does Student need Users?             | Domain setup             | State the one-student/one-application-user requirement before the incident.                               | Include  |
| What does a local transaction protect?   | State ownership          | Trace Student's state plus outbox separately from Users' user plus inbox.                                 | Include  |
| Why would successful work arrive again?  | Lost result              | Show Users applying the request while Student never receives the result.                                  | Include  |
| How are outbox and inbox different?      | Pattern responsibilities | The outbox remembers what Student must send; the inbox remembers what Users already applied and returned. | Include  |
| Why store the result as well as the key? | Response replay          | Student still needs the `userId`, so a repeated request must recover the earlier result.                  | Include  |
| Why is the code so short?                | Example scope            | The code shows the architecture contract and leaves unrelated implementation details out.                 | Include  |

## Rejected objections

- Choosing a historical duplicate cause is rejected because the evidence does not
  establish one.
- Choosing a specific domain-conflict outcome is rejected because it is unnecessary
  for explaining the idempotency boundary.
- Expanding the examples into a complete implementation is rejected because the
  article is explaining the division of responsibility across the boundary.
