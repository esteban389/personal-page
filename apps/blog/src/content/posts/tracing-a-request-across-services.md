---
title: 'Tracing One Request Across Several Services'
description: 'A repeatable way to correlate a failing request through gateways, APIs, queues, and workers.'
pubDate: '2026-08-09'
category: 'Technical Articles'
homeOrder: 3
---

A useful production investigation follows one request instead of searching for
every occurrence of an error message. Correlation narrows the timeline and keeps
similar failures from different users or tenants from being mixed together.

## Begin at the observed boundary

Capture what the caller actually saw:

- timestamp and timezone;
- route and HTTP method;
- response status;
- tenant or account identifier;
- request, trace, or correlation identifier;
- deployed environment.

Do not start by assuming which service failed. A gateway-generated timeout and
an application-generated `500` can look similar to the caller but require
different evidence.

## Follow exact identifiers

Search the narrowest identifier first. A trace might look like this:

```text
gateway  request_id=req-7f2  status=502
orders   trace_id=tr-a91     request_id=req-7f2
payments trace_id=tr-a91     payment_id=pay-184
worker   trace_id=tr-a91     event_id=evt-552
```

The transition from `request_id` to `trace_id`, then to domain identifiers,
creates a chain that can cross protocols.

## Build a small timeline

| Time         | Component | Evidence             |
| ------------ | --------- | -------------------- |
| 10:02:14.120 | Gateway   | Request accepted     |
| 10:02:14.168 | Orders    | Payment command sent |
| 10:02:14.421 | Payments  | Provider timeout     |
| 10:02:15.012 | Worker    | Retry scheduled      |

A timeline exposes impossible ordering, duplicate attempts, long gaps, and
clock-skew problems more clearly than a large unstructured log export.

## Verify the deployed code

The local branch is not production evidence. Record the deployed revision,
configuration, feature flags, and dependency endpoints for each participating
service. Two tenants or regions may be on different releases.

## Separate facts from hypotheses

Write findings in four buckets:

1. **Observed:** directly present in logs, traces, configuration, or responses.
2. **Inferred:** follows from several observations but is not directly recorded.
3. **Hypothesized:** a possible explanation that still needs a discriminating test.
4. **Unknown:** evidence that is unavailable or was not retained.

This keeps a plausible explanation from becoming an accidental conclusion.

## End with the next discriminating check

A useful investigation does not end with “it might be the network.” It identifies
the smallest next observation that would separate competing explanations, such
as checking whether the provider received `payment_id=pay-184` or whether the
worker retry used the same idempotency key.
