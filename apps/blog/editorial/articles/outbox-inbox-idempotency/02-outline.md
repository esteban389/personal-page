# Structural outline

## Approved thesis

A transactional outbox makes Student's intent durable, but that intent may still
reach Users more than once. One stable `idempotencyKey` and a receiver-side inbox
let Users recognize the same operation, apply it once, and return the stored result
on a repeat.

## Argument sequence

### 1. One operation crosses two services

- Purpose: Ground the architectural introduction in the real Student/Users
  requirement before entering the support incident.
- Central claim: One logical operation can span two local transactions and a network
  response, which is where outbox, idempotency, and inbox acquire separate jobs.
- Reader map: Name those three responsibilities and explain that the article will
  introduce each one only when the boundary needs it.
- Story setup: Creating a student record in Student also requires an application
  user in Users, so the original direct call looked proportionate to a small
  one-to-one interaction.
- Personal basis: Esteban first built this path as a junior. The design reflected the
  tradeoff and experience he had then.
- Incident: Repeated support work exposed inconsistent relationships; one login
  reached the application-user lookup and failed because three enabled records shared
  a document number.
- Evidence boundary: The historical cause remains unknown.
- Reader promise: Trace the direct call's ambiguous failure, then add the outbox,
  idempotency key, and inbox in that order.

### 2. The direct call still contains two transactions

- Purpose: Make the service boundary visible beneath the single business operation.
- Central claim: Student can make its own changes atomic, and Users can do the same
  for its state, but neither local transaction owns both services.
- Example: Users can finish while Student loses the result and cannot tell whether a
  retry will repeat the effect.
- Transition: Student needs to store the work it still expects Users to perform.

### 3. The outbox preserves Student's intent

- Purpose: Introduce durable intent before idempotency.
- Central claim: Student saves its own change and a create-user outbox row in one
  local transaction.
- Consequence: The intent survives the original call, but processing it later can
  deliver the same work more than once.
- Transition: Repeated delivery creates the need for one stable operation identity.

### 4. Repeated delivery introduces the idempotency key

- Purpose: Name idempotency at the point where the receiver needs it.
- Central claim: One logical operation carries one `idempotencyKey`, reused on every
  delivery attempt.
- Example: A short, invented Student-side Prisma transaction creates the student and
  outbox row together.
- Transition: Users needs a durable place to recognize that key and recover its
  earlier result.

### 5. The inbox stores the operation result

- Purpose: Show the receiver's responsibility with ordinary code.
- Central claim: Users checks the inbox, creates the user, and stores the
  `idempotencyKey` plus result in one Users-local transaction.
- Concurrency assumption: Inbox `idempotencyKey` is unique. A losing concurrent
  insert rolls back its local transaction, and the call can retry.
- Example: A short, invented Prisma transaction with `findUnique`, an `if`, user
  creation, and inbox creation.
- Transition: Request idempotency still does not decide conflicts between different
  operations.

### 6. Idempotency does not replace business rules

- Purpose: Bound what the inbox can decide without returning to incident data.
- Central claim: The inbox recognizes the same key. Different keys identify
  different operations, while domain validation and uniqueness rules govern
  conflicts between those operations.
- Evidence boundary: The article does not prescribe a particular domain rule or
  conflict outcome.
- Transition: State the guarantee in terms of business effect rather than delivery
  count.

### 7. Repeated delivery, one business effect

- Purpose: Close the opening tension without replaying every section.
- Central claim: Delivery may repeat, while the identified operation has one business
  effect and a replayable result.
- Conclusion closure: Return to the boundary that kept resurfacing in support, then
  lightly point toward a separate article about learning by revisiting earlier work.

## Concepts and prerequisites

- One student creation requires state in Student and Users.
- Each service owns its own local transaction.
- A lost response leaves the caller unsure whether the receiver applied a change.
- Outbox: durable sender-side intent stored with the sender's state.
- `idempotencyKey`: one stable identity for one logical operation.
- Inbox: receiver-side record of the key and result.
- Business uniqueness: a domain policy separate from idempotency.
- One business effect under repetition is not literal exactly-once delivery.

Relevant claim groups: E-01–E-03 for the support experience; A-01–A-08 for the
architecture; C-01–C-03 for the invented Prisma-style examples.

## Questions for Esteban

- None blocking.

## Approval checkpoint

- [ ] Esteban approved this outline.
