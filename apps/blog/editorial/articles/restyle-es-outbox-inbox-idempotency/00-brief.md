# Spanish translation brief

## Source contract

- Source post: `apps/blog/src/content/posts/outbox-inbox-idempotency.md`
- Earlier editorial workspace: `apps/blog/editorial/articles/outbox-inbox-idempotency`
- Earlier workspace status: immutable historical reference for this translation
- Proposed stable translation key: `outbox-inbox-idempotency`
- Target locale: Spanish (`es`)
- Proposed slug: `lo-que-los-usuarios-duplicados-me-ensenaron-sobre-outbox-e-idempotencia`

## Working title

`Lo que los errores por usuarios duplicados me enseñaron sobre outbox e idempotencia`

## Target reader

Junior backend developers and a broader technical audience reading in Spanish.

## Assumed knowledge

Basic service-to-service communication, HTTP requests, database transactions, and
TypeScript syntax. No implementation experience with outbox or inbox is required.

## Reader outcome

After reading this article, the reader should understand why durable intent and
duplicate-safe processing are separate responsibilities, and how outbox,
idempotency keys, and inbox combine across a two-service boundary.

## Central thesis

An outbox makes pending work recoverable, while an idempotency key and inbox let
the receiving service recognize a repeated operation and return its original
result. Together they provide recoverable, duplicate-safe processing without
pretending two local transactions are one distributed transaction.

## Primary article job

Reflect on a real support experience while building a practical architecture
mental model.

## Available material

- Personal experience or observation: preserve only the first-person support
  experience and judgments already published in the English source.
- Traced example or code: preserve the Student/Users example, two Prisma-style
  TypeScript snippets, and the text flow diagram.
- Measurements or sources: preserve all five source footnotes and their URLs.
- Explicitly hypothetical material: the timeout/retry sequences remain labeled as
  possible boundary behavior, not as the proven cause of the historical incident.
- Known causal boundary or alternative explanation: the exact operation that
  produced the three historical records remains unknown.

## Structural archetype

- Dominant structure: incident-driven technical case study.
- Secondary transition: progressive mental-model tutorial from direct call to
  outbox, idempotency key, and inbox.
- Why the available material supports it: the complete published source contains
  both the supplied incident and the architecture progression.

## Tone dimensions

- Formality — conversational; existing published source.
- Stance — reflective and instructional; existing published source.
- Personal distance — first-person; existing published source.
- Certainty — calibrated; existing published source.
- Emotional register — briefly frustrated, then pragmatic; existing published source.
- Humor — none; existing published source.
- Technical density — medium; commission and existing published source.
- Authorial judgment — central but bounded; existing published source.
- Rhythm — deliberately varied; existing published source.

## Opening kernel

Repeated support tickets about students who could not log in and staff operations
failing around the same service boundary.

## Conclusion contract

Return to the direct path built when Esteban was a junior, state the scoped
ownership rule for each service, and preserve the callback to a future article
about learning by revisiting earlier work.

## Why I care about this

Preserve the source's stated frustration at repeatedly repairing the consequences
of a service boundary Esteban knew could be controlled better.

## In scope

- Natural Latin American Spanish translation of every prose section and heading.
- Exact preservation of technical meaning, claim certainty, examples, code,
  footnotes, URLs, and publication date.
- A localized title, description, category, and slug.
- Reuse of the approved hero image.

## Out of scope

- New claims, anecdotes, fixes, implementation details, or evidence.
- Changes to the English body, earlier editorial workspace, or image asset.
- Spanish DEV or Medium syndication metadata.
- Reopening architecture questions deliberately excluded by the source.

## Open questions

None that materially block a faithful translation.

## Commission and execution constraints

- Target platform: Esteban's Astro blog.
- Approximate length: parity with the English source.
- Language and locale: natural Latin American Spanish (`es`).
- Required or excluded material: preserve code identifiers and service names;
  avoid translated-English syntax and invented Spanish-only commentary.
- External research authorization: not needed; source translation only.
- Code-execution authorization: repository validation is authorized by publication.
- Image direction: reuse the approved silver outbox/inbox handoff asset.
- Image-concept development authorized: no new concept needed.
- Asset generation authorized: no new generation needed.
- External asset acquisition authorized: no.

## Approval checkpoint

- [x] Esteban explicitly requested generation and publication of the Spanish translation.
