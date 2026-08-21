# Section seeds

Each anchor records its provenance. Expansion must preserve the claim and remain
inside the listed boundaries.

## One operation crosses two services

### Seed sentences

- **AI proposal** — Source: synthesis of A-01–A-02 and the approved opening
  structure. One logical operation can cross two local transactions and a network
  response, so outbox, idempotency, and inbox each receive a separate responsibility.
- **Derived from supplied input** — Source: `01-raw-notes.md`, “Initial recollection
  supplied by Esteban.” Creating a student also requires an application user; a
  direct call looked reasonable for that one-to-one requirement, and I first built
  the path as a junior.
- **Derived from supplied input** — Source: `01-raw-notes.md`, “Duplicate relationship
  support case.” Repeated support work returned to this boundary; one investigation
  found three enabled user records sharing a document number, although the operation
  that created them remains unknown.

### Expansion boundaries

- Include: the requirement-to-difficulty introduction, why the direct call looked
  proportionate, the blunt “this is absurd” frustration, and the evidence boundary.
- Exclude: a reconstructed cause, named person, production error type, or downstream
  authentication detail.
- Relevant claim IDs: E-01–E-03, A-01–A-02.

## The direct call still contains two transactions

### Seed sentences

- **AI proposal** — Source: A-01. The business operation looks like one action, but
  Student and Users still own separate state and separate local transactions.
- **Derived from supplied input** — Source: `01-raw-notes.md`, “Initial recollection
  supplied by Esteban.” If Users finishes and Student loses the result, Student
  cannot tell whether sending the request again will recover or repeat the effect.

### Expansion boundaries

- Include: local transaction ownership and a hypothetical lost result.
- Exclude: claims that the hypothetical explains the historical duplicate records.
- Relevant claim IDs: A-01, A-02.

## The outbox preserves Student's intent

### Seed sentences

- **Derived from supplied input** — Source: `01-raw-notes.md`, “Tentative claims.”
  Student stores the student change and a create-user intent in the same local
  transaction.
- **Derived from supplied input** — Source: `01-raw-notes.md`, “Initial recollection
  supplied by Esteban.” Later outbox work changed how I saw this boundary: the
  intent survives the request, which also means the same work may reach Users again.

### Expansion boundaries

- Include: earlier outbox work as the reason Esteban revisited this boundary and the
  request-versus-durable-record distinction.
- Exclude: production workflow details, implementation status, or outcome claims.
- Relevant claim IDs: A-03, A-04; personal observation from raw notes.

## Repeated delivery introduces the idempotency key

### Seed sentences

- **Derived from supplied input** — Source: `01-raw-notes.md`, “Tentative claims.”
  Idempotency enters when Student needs to send the same operation again.
- **Derived from supplied input** — Source: `01-raw-notes.md`, “Correction after the
  architecture-first rewrite.” Every attempt carries the same `idempotencyKey`; a
  new key describes a new operation.

### Expansion boundaries

- Include: the first invented Prisma-style transaction, its incomplete status, and
  the observation that the terminology is more abstract than the example code.
- Exclude: an invented lifecycle state or abstract `intentId` terminology.
- Relevant claim IDs: A-04, A-05, C-01.

## The inbox stores the operation result

### Seed sentences

- **Derived from supplied input** — Source: `01-raw-notes.md`, “Tentative claims.”
  Users first looks for the `idempotencyKey` in Inbox.
- **Derived from supplied input** — Source: `01-raw-notes.md`, “Correction after the
  architecture-first rewrite.” If the key exists, Users returns the stored result;
  otherwise it creates the user and inbox row in one local transaction.

### Expansion boundaries

- Include: the required `// Ensure it is processed once.` comment, unique Inbox key,
  concurrent loser rollback, retry, and the observation that the code is smaller
  than the pattern name suggests.
- Exclude: engine-specific behavior or a complete recovery design.
- Relevant claim IDs: A-06, C-01–C-03.

## Idempotency does not replace business rules

### Seed sentences

- **AI proposal** — Source: A-07. The same `idempotencyKey` identifies a repeated
  operation, while different keys identify different operations.
- **AI proposal** — Source: A-07. Separate domain validation and uniqueness rules
  govern conflicts between different operations; the inbox should not silently
  merge them because their payloads look similar.

### Expansion boundaries

- Include: the conceptual distinction without returning to the support records or
  an unresolved document rule.
- Exclude: an asserted production invariant or chosen conflict policy.
- Relevant claim IDs: A-07.

## Repeated delivery, one business effect

### Seed sentences

- **Derived from supplied input** — Source: `01-raw-notes.md`, “Tentative claims.”
  Delivery may repeat without repeating the create-user effect for the same key.
- **Derived from supplied input** — Source: `01-raw-notes.md`, “Initial recollection
  supplied by Esteban” and “Tentative claims.” I wanted each service to know what it
  owned once the easy request path stopped being easy.
- **Derived from supplied input** — Source: `01-raw-notes.md`, “Links, code, and
  source material.” Returning to a path I first built as a junior hints at a
  separate article about learning by revisiting earlier work.

### Expansion boundaries

- Include: the scoped one-effect guarantee, closure of the support tension, and a
  light future-post hint.
- Exclude: implementation status, outcome claims, generic recap, or a motivational
  kicker.
- Relevant claim IDs: A-08; personal observation from raw notes.
