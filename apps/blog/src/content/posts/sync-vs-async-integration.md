---
title: 'Choosing Between Synchronous and Asynchronous Integration'
description: 'A comparison based on user latency, consistency, failure handling, and operational cost.'
pubDate: '2026-08-08'
category: 'Technical Articles'
---

“Use events” and “keep it synchronous” are both incomplete architectural rules.
The integration style should follow the business contract and the failure model.

## Compare the default tradeoffs

| Concern             | Synchronous call                  | Asynchronous message                    |
| ------------------- | --------------------------------- | --------------------------------------- |
| Caller feedback     | Immediate success or failure      | Usually accepted, then completed later  |
| Temporal coupling   | Both services must be available   | Consumer can recover independently      |
| Consistency model   | Easier request-time coordination  | Usually eventual consistency            |
| Duplicate handling  | Retries still require idempotency | At-least-once delivery makes it central |
| Operational surface | Timeouts, pools, circuit breakers | Brokers, lag, dead letters, replay      |

## Prefer synchronous when the answer is required now

A synchronous call fits when the user cannot continue without the result, the
dependency can meet the latency budget, and failure can be presented immediately.
Examples include validating a one-time code or retrieving information needed to
render the current response.

## Prefer asynchronous when time is part of the workflow

Messaging fits when work may take longer than the request budget, temporary
consumer unavailability should not block the producer, or several independent
consumers need the same fact.

An event should describe something that happened:

```json
{
  "eventId": "evt-552",
  "type": "EnrollmentSubmitted",
  "occurredAt": "2026-08-08T15:20:00Z",
  "enrollmentId": "enr-204"
}
```

## Account for the hidden work

Asynchronous integration requires idempotent consumers, ordering policy,
observability, retry limits, poison-message handling, schema evolution, and
reconciliation. Synchronous integration requires timeout budgets, bounded
retries, connection management, and protection against cascading failures.

The better choice is not the one with fewer boxes in an architecture diagram.
It is the one whose failure behavior matches what the product promises.
