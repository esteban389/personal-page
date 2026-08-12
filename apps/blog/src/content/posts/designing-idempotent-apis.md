---
title: 'Designing Idempotent APIs That Survive Retries'
description: 'A practical model for idempotency keys, request fingerprints, stored outcomes, and safe retry behavior.'
pubDate: '2026-08-11'
category: 'Technical Articles'
homeHeroOrder: 1
homeOrder: 1
---

Retries are unavoidable in distributed systems. A client can lose the response
after the server commits a change, a proxy can time out, or a worker can restart
between processing and acknowledgment. The difficult question is not whether a
request will be repeated, but what the system should do when it is.

This article builds a small design for an idempotent write endpoint. Its many
sections also make it useful for checking this blog's table of contents on a
desktop viewport.

## Start with the contract

An operation is idempotent when repeating the same logical request has the same
effect as processing it once. That does not mean every response must be produced
from scratch. It means the server needs a stable way to recognize the logical
request and return its established outcome.

For a payment-like command, the client can provide an idempotency key:

```http
POST /transfers HTTP/1.1
Idempotency-Key: 4b76d8b0-387c-4f17-8810-054f4acebd78
Content-Type: application/json

{
  "sourceAccount": "A-100",
  "targetAccount": "A-200",
  "amount": "25.00",
  "currency": "USD"
}
```

The key identifies one intended operation. It must not silently turn two
different payloads into the same transfer.

### Define the scope

The same raw key can be safe for one customer and ambiguous globally. A useful
database key normally includes at least:

- the authenticated principal or tenant;
- the operation name;
- the client-provided idempotency key.

The resulting uniqueness boundary might be
`(tenant_id, operation, idempotency_key)`.

### Define the retention period

Keys cannot necessarily live forever. The API contract should say how long a
stored outcome remains replayable. Expiration is a product decision as much as a
storage decision: after expiry, the same key may describe a new operation.

## Fingerprint the request

Storing only the key leaves a dangerous gap. A client could reuse it with a
different amount and receive the first response, hiding a caller defect.

Create a deterministic fingerprint from the request fields that define its
meaning:

```java
record TransferFingerprint(
    UUID tenantId,
    String sourceAccount,
    String targetAccount,
    BigDecimal amount,
    Currency currency
) {}
```

Serialize a canonical representation and hash it. If a repeated key arrives
with another fingerprint, reject it with a conflict instead of replaying an
unrelated outcome.

### Canonicalization matters

Semantically equal inputs can have different textual forms. Decide whether
`25.0` and `25.00` are identical for the operation before hashing. The same
applies to field ordering, casing, whitespace, and optional defaults.

## Persist the state machine

An idempotency record is more than a cache entry. It represents the processing
state of a command.

| State        | Meaning                                       | Retry behavior                   |
| ------------ | --------------------------------------------- | -------------------------------- |
| `PROCESSING` | One request owns execution                    | Wait, poll, or return `409`      |
| `SUCCEEDED`  | The business operation committed              | Replay the stored success        |
| `FAILED`     | A stable, non-retryable result was determined | Replay the stored client failure |

Transient infrastructure failures usually should not become permanent stored
outcomes. Otherwise a brief database outage can poison the key for its entire
retention period.

### Claim execution atomically

Use a uniqueness constraint, not an in-memory check, to decide which request
owns execution. Two application instances can observe absence at the same time;
only the database can serialize the claim reliably.

```sql
insert into idempotency_record (
  tenant_id,
  operation,
  idempotency_key,
  request_hash,
  status
) values (?, ?, ?, ?, 'PROCESSING')
on conflict do nothing;
```

The request that inserts the row proceeds. A request that loses the race reads
the existing record and follows its state.

## Store the outcome deliberately

Replaying the outcome usually requires the original status code and response
body. Store only the headers that are part of the public contract; hop-by-hop or
request-specific headers should not be replayed blindly.

Good candidates include:

- HTTP status;
- serialized response body;
- resource identifier;
- completion timestamp;
- a schema or representation version.

## Coordinate business data and idempotency

The strongest design updates the business aggregate and idempotency outcome in
the same database transaction. If that is impossible, an outbox or recoverable
workflow must close the gap between the two writes.

The dangerous sequence is:

1. Commit the transfer.
2. Crash before marking the idempotency record as succeeded.
3. Receive a retry that sees `PROCESSING` forever.

A recovery process needs enough evidence to determine whether the business
operation committed and finalize the record safely.

## Decide how concurrent retries behave

There is no universally correct response while the first request is still
running.

| Strategy     | Advantage                        | Tradeoff                           |
| ------------ | -------------------------------- | ---------------------------------- |
| Return `409` | Simple and bounded               | Client must retry later            |
| Return `202` | Clear asynchronous model         | Requires a status resource         |
| Wait briefly | Often returns the final response | Consumes a connection and capacity |

Whichever strategy is selected must be documented and tested under concurrency,
not only with sequential duplicate requests.

## Test the failure windows

The happy path proves very little. Useful tests interrupt execution around each
durability boundary:

1. Before the idempotency claim.
2. After the claim but before the business write.
3. After the business write but before storing the response.
4. After completion but before the client receives the response.
5. During two simultaneous requests with the same key.

Also verify that the same key with a different fingerprint is rejected and that
expired keys follow the documented reuse policy.

## Operational signals

Track at least:

- new keys versus replayed keys;
- conflicting fingerprints;
- records stuck in `PROCESSING`;
- completion latency;
- cleanup volume and age.

Idempotency is part of correctness, but it also needs an operational story. A
record that remains `PROCESSING` for hours is not merely untidy data—it is a
request whose final outcome is unknown to the caller.

## A compact checklist

Before calling the endpoint idempotent, confirm:

- the key is scoped to the correct caller and operation;
- request equality has an explicit definition;
- ownership is claimed atomically;
- business state and stored outcome cannot diverge silently;
- concurrent duplicates have documented behavior;
- stable outcomes can be replayed without recomputation;
- expiry, recovery, and monitoring exist.

Retries turn uncertain delivery into normal control flow. A durable idempotency
contract turns that control flow into predictable behavior.
