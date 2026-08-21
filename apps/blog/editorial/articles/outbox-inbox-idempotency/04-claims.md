# Claim register

Important assertions should have an explicit basis. Phase 1 keeps this register
human-maintained; semantic validation is planned for Phase 2.

This file separates claims that may appear in the reader-facing article from
implementation evidence retained only to prevent accidental overstatement.

## Status vocabulary

- **Verified:** supported by the cited authoritative or canonical source.
- **Accepted input:** supplied by Esteban or by the repository inspection preserved
  in `01-raw-notes.md`; the claims researcher did not independently inspect the
  proprietary implementation.
- **Qualified:** defensible only with the limitation stated in the claim or source
  note.
- **Excluded:** useful internal context that must not appear in the article.
- **Unresolved:** evidence or a design decision is still missing.

## Reader-facing experience claims

These claims may appear using only the simplified service names `Student` and
`Users`.

| ID   | Claim                                                                                                                                                                   | Basis                | Source or reproduction                                                                      | Status                                  |
| ---- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------- | ------------------------------------------------------------------------------------------- | --------------------------------------- |
| E-01 | Repeated support cases involved students unable to log in and staff operations failing because the expected student/user relationship was missing or inconsistent.      | Personal observation | Esteban's support account in `01-raw-notes.md`.                                             | Accepted input; reader-facing           |
| E-02 | One investigation found three enabled user records sharing a document number, each associated with a different student record.                                          | Personal observation | Esteban's incident account in `01-raw-notes.md`. Do not name the production exception type. | Accepted input; reader-facing           |
| E-03 | The historical operation that produced each duplicate is unknown. The article must not claim that a timeout, retry, race, or specific legacy flow caused those records. | Personal observation | Explicit correction and uncertainty in `01-raw-notes.md`.                                   | Accepted input; reader-facing guardrail |

## Reader-facing architecture claims

Only the claims in this section are approved for the technical explanation.

| ID   | Claim                                                                                                                                                                                                                                                                                                                                                              | Basis                                                         | Source or reproduction                                                                                                                                                                                                                      | Status                                      |
| ---- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------- |
| A-01 | A transaction owned by one service can make that service's own state changes atomic, but it does not automatically include a separate service's state. The architecture therefore uses one local transaction in Student and another in Users.                                                                                                                      | Official documentation; Inference                             | The outbox pattern records business state and outbound intent in the sender's database transaction, then a separate consumer handles the intent.[^aws-outbox][^canonical-outbox]                                                            | Verified; reader-facing                     |
| A-02 | If a caller loses the response to a state-changing request, it can be uncertain whether the receiver completed the operation. Retrying without an idempotency contract can repeat the intended effect.                                                                                                                                                             | Official documentation                                        | RFC 9110 explains why idempotency matters after a communication failure, and AWS illustrates the ambiguity of a timeout with no response.[^rfc-idempotency][^aws-retries]                                                                   | Verified; reader-facing                     |
| A-03 | A transactional outbox makes the sender's intent durable by saving the business change and the intent in the same local transaction. Processing that intent happens later and is not part of a cross-service transaction.                                                                                                                                          | Official documentation; Canonical pattern description         | AWS Transactional Outbox guidance and Chris Richardson's canonical pattern description.[^aws-outbox][^canonical-outbox]                                                                                                                     | Verified; reader-facing                     |
| A-04 | An outbox does not guarantee that the receiver sees an intent only once. The same intent can be delivered again, including when delivery succeeds but the sender does not record that success.                                                                                                                                                                     | Official documentation; Canonical pattern description         | AWS warns that outbox processing can emit duplicates; the canonical pattern gives the example of a relay failing after delivery but before recording completion.[^aws-outbox][^canonical-outbox]                                            | Verified; reader-facing                     |
| A-05 | One logical operation needs one stable `idempotencyKey`, reused on every delivery attempt. Generating a new key for each attempt would make those attempts look like separate operations.                                                                                                                                                                          | Official architecture guidance; Inference                     | AWS recommends a caller-provided request identifier that lets the receiver recognize repeated requests.[^aws-retries]                                                                                                                       | Verified; reader-facing                     |
| A-06 | A receiver-side inbox addresses a different half of the problem: it records the `idempotencyKey` while applying the business change in the receiver's local transaction. Repeated delivery can then return the stored result without applying the change again.                                                                                                    | Official architecture guidance; Canonical pattern description | The canonical idempotent-consumer pattern records processed message IDs with the consumer's local work; AWS distinguishes suppressing repeated effects from returning a semantically equivalent result.[^idempotent-consumer][^aws-retries] | Verified; reader-facing                     |
| A-07 | Idempotency and business rules answer different questions. An inbox recognizes repetitions carrying the same `idempotencyKey`; different keys identify different operations, even when parts of their payloads match. Domain validation and uniqueness rules govern conflicts between those operations. The article does not prescribe a specific rule or outcome. | Official architecture guidance; Inference                     | AWS explains that caller-provided request IDs represent intent and that identical request data does not always mean the same intent.[^aws-retries]                                                                                          | Qualified; reader-facing and policy-neutral |
| A-08 | The outbox/inbox pair aims for one business effect despite repeated delivery, not literal exactly-once delivery. Delivery can repeat; the receiver makes those repetitions safe for the identified operation.                                                                                                                                                      | Official documentation; Inference                             | RFC 9110 defines idempotency by intended effect rather than request count, while outbox sources explicitly allow duplicate delivery.[^rfc-idempotency][^aws-outbox][^canonical-outbox]                                                      | Verified with stated scope; reader-facing   |

## Illustrative-code verification claims

These claims keep the simple Prisma-style examples technically coherent. The
article may state the uniqueness assumption briefly, but it does not need to explain
the conflict mechanics.

| ID   | Claim                                                                                                                                                                                                                                                                                                                                                                                                             | Basis                             | Source or reproduction                                                                                                                                                                                                                     | Status                                                                                   |
| ---- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------- |
| C-01 | `prisma.$transaction(async (tx) => { ... })` is current Prisma Client syntax for an interactive transaction. Calls made through `tx`, including model `create` and `findUnique` queries, execute inside that transaction.                                                                                                                                                                                         | Official documentation            | Prisma's current transactions reference documents the callback form and states that Prisma Client calls on `tx` are encapsulated in the transaction.[^prisma-transactions]                                                                 | Verified for illustrative syntax                                                         |
| C-02 | `findUnique({ where: { idempotencyKey } })` requires `idempotencyKey` to be declared unique in the invented Inbox model. `create({ data: ... })` is current Prisma Client syntax for inserting a model record.                                                                                                                                                                                                    | Official documentation            | Prisma Client documents `findUnique` by ID or unique attribute and the model `create` operation.[^prisma-client-api]                                                                                                                       | Verified for illustrative syntax                                                         |
| C-03 | Creating the user and the inbox row in the same interactive transaction means an error during the inbox insert rolls back the local user creation. If concurrent transactions both see no inbox row, the unique `idempotencyKey` allows only one inbox insert; the losing uniqueness conflict rolls back its transaction and the operation can retry, at which point it can find and replay the committed result. | Official documentation; Inference | Prisma documents automatic rollback when an interactive transaction throws, identifies unique-constraint errors, and recommends retrying after a concurrent uniqueness conflict.[^prisma-transactions][^prisma-client-api][^prisma-errors] | Verified with the unique-key and retry assumptions; mechanics need not appear in article |

## Internal-only evidence and exclusions

The following entries preserve useful provenance and negative constraints. They must
not be copied, paraphrased, footnoted, diagrammed, or encoded in reader-facing code.

| ID   | Internal evidence or topic                                                                                                                  | Why it is retained                                                                                                                            | Reader-facing disposition                                                                                                                                             |
| ---- | ------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| X-01 | The inspected repository uses specific language, framework, annotations, blocking HTTP client calls, and production exception types.        | Confirms that the article's generic transaction explanation came from a corrected repository inspection rather than the initial recollection. | Excluded: no production language, framework, annotation, client-library, or exception-class names. Prisma is permitted only in invented snippets.                     |
| X-02 | The production path includes a downstream identity-provider boundary and an existing outbox for that separate operation.                    | Explains how earlier implementation work led Esteban to consider outbox/inbox for student/user creation.                                      | Excluded: no provider name, provisioning sequence, or downstream-boundary discussion.                                                                                 |
| X-03 | The production outboxes have concrete worker, retry, status, history, and recovery mechanics.                                               | Prevents the article from confusing an architecture pattern with the complete production implementation.                                      | Excluded: no polling, locking, leases, backoff, attempt limits, status machines, history, or manual replay mechanics.                                                 |
| X-04 | Engine-specific uniqueness, isolation, and concurrent-insert behavior were examined during the first claims pass.                           | Supports the internal conclusion that business uniqueness is separate from idempotency.                                                       | Excluded: no database-engine names, isolation settings, or engine-specific conflict mechanics. The article may only state that `idempotencyKey` is unique.            |
| X-05 | Request fingerprints, changed-payload handling, key retention, and in-progress request policies were examined during the first claims pass. | These are valid implementation concerns but would pull the post away from its architecture lesson.                                            | Excluded: no request hashing or fingerprinting, expiry policy, HTTP conflict codes, or in-progress state mechanics.                                                   |
| X-06 | The repository did not document a historical decision about Kafka or a saga.                                                                | Prevents the article from inventing an architecture-decision record.                                                                          | Excluded from the technical argument: no broker comparison, saga definition, or claim that either option was rejected in production.                                  |
| X-07 | The missing-user legacy case had a distinct known cause, while the cause of the duplicate-user incident remains unknown.                    | Keeps two support stories from being collapsed into one invented causal chain.                                                                | Excluded at implementation level; reader-facing prose may only say that inconsistent relationships appeared in support cases and that the duplicate cause is unknown. |
| X-08 | `01-raw-notes.md` contains implementation-status evidence for the complete Student/Users design.                                            | Preserves provenance for internal review without making status part of the story.                                                             | Excluded: the article must not say that the complete design is unimplemented, deployed, or responsible for a measured outcome.                                        |

## Draft-safe synthesis

The strongest source-backed formulation for the article is:

> The outbox makes Student's intent durable in Student's local transaction, but
> that intent may still reach Users more than once. One stable `idempotencyKey`
> and a receiver-side inbox let Users recognize the same operation, apply it once,
> and return the stored result on a repeat.

That formulation does **not** establish any of the following:

- that a timeout or retry caused the historical duplicate records;
- any implementation status or production outcome for the complete design;
- that every request containing the same document number represents the same
  operation;
- that the system has exactly-once delivery;
- that an inbox decides how to resolve a separate business conflict;
- that the article describes production code.

## Illustrative TypeScript shape

The examples must be labeled simple, invented Prisma-style pseudocode created for
the article. This shape is supported by the current Prisma Client API, assuming the
invented models and fields exist.

```ts
await prisma.$transaction(async (tx) => {
  const student = await tx.student.create({ data: studentData });

  await tx.outbox.create({
    data: {
      idempotencyKey,
      studentId: student.id,
      operation: 'create-user',
    },
  });
});
```

```ts
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
```

Architecture-level assumptions:

1. Student saves its own state and the outbox record in one local transaction.
2. Every delivery attempt reuses the same `idempotencyKey`.
3. The invented Inbox model declares `idempotencyKey` unique.
4. Users creates the user and stores the inbox result in one local transaction.
5. A repeat carrying the same key returns the stored result.
6. Business conflicts belong to a separate, unspecified domain policy.
7. Storage schemas, transport details, and recovery mechanics are intentionally
   omitted.

No lifecycle state is invented for Student. The snippets do not resemble translated
production code and make no claim about deployment or outcomes.

## Unresolved evidence questions

1. **Business uniqueness:** Is “one enabled user per document number” an actual
   invariant, and what is its business scope? Until Esteban confirms it, the article
   can explain the conceptual distinction but cannot present that precise rule as
   production fact or prescribe a conflict outcome.
2. **Stored result:** The example uses `{ userId }` only as an invented explanatory
   result shape, not as production evidence.
3. **Historical cause:** No evidence identifies the operation that created the three
   duplicate records. This remains intentionally unresolved.

## Footnote-ready sources

[^rfc-idempotency]:
    IETF, _RFC 9110: HTTP Semantics_, section 9.2.2, “Idempotent
    Methods.”
    https://www.rfc-editor.org/rfc/rfc9110.html#section-9.2.2

[^aws-retries]:
    Malcolm Featonby, AWS Builders' Library, “Making retries safe with
    idempotent APIs.”
    https://aws.amazon.com/builders-library/making-retries-safe-with-idempotent-APIs/

[^aws-outbox]:
    AWS Prescriptive Guidance, “Transactional outbox pattern.”
    https://docs.aws.amazon.com/prescriptive-guidance/latest/cloud-design-patterns/transactional-outbox.html

[^canonical-outbox]:
    Chris Richardson, Microservices.io, “Pattern: Transactional
    outbox.”
    https://microservices.io/patterns/data/transactional-outbox.html

[^idempotent-consumer]:
    Chris Richardson, Microservices.io, “Pattern: Idempotent
    Consumer.”
    https://microservices.io/patterns/communication-style/idempotent-consumer.html

[^prisma-transactions]:
    Prisma Documentation, “Transactions and batch queries.” This is the current
    Prisma Client reference for interactive `$transaction` callbacks and rollback
    behavior.
    https://www.prisma.io/docs/orm/prisma-client/queries/transactions

[^prisma-client-api]:
    Prisma Documentation, “Prisma Client API.” This reference documents `findUnique`
    and `create` model queries.
    https://www.prisma.io/docs/orm/reference/prisma-client-reference

[^prisma-errors]:
    Prisma Documentation, “Error Reference.” The `P2002` entry identifies a unique
    constraint failure.
    https://www.prisma.io/docs/orm/reference/error-reference

## Approval checkpoint

- [ ] Esteban approved the claims and their stated basis.
