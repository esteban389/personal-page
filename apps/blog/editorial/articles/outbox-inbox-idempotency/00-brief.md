# Article brief

## Working title

What Duplicate Users Taught Me About Outbox and Idempotency

## Target reader

Junior developers and a broader technical audience who understand ordinary HTTP
requests and database transactions but may not have designed for ambiguous failures
across service boundaries.

## Assumed knowledge

- Basic system-design knowledge: services call each other, requests can fail, and a
  database transaction commits or rolls back its own changes.
- Readers may recognize ordinary TypeScript and Prisma-style CRUD calls, but no ORM,
  database-engine, messaging-platform, or infrastructure expertise is assumed.

## Reader outcome

After reading this article, the reader should:

- understand that a transactional outbox makes an intent durable but does not, by
  itself, make repeated delivery safe;
- understand why receiver-side idempotency or an inbox addresses a different half
  of the problem;
- recognize when a sender-side outbox plus a receiver-side inbox is a proportionate
  improvement for a simple service-to-service boundary;
- distinguish an effectively-once business effect from exactly-once delivery.

## Central thesis

A transactional outbox makes a cross-service intention durable, but it does not
make repeated delivery safe. Pairing a sender-side outbox with receiver-side
idempotency, represented here by an inbox, makes a simple two-service operation
retryable without requiring Kafka or a full saga.

## Primary job and structure

- Primary job: explain a technical decision through a real support experience.
- Dominant archetype: incident-driven technical case study.
- Secondary transition: after the incident exposes the boundary, use a progressive
  mental-model tutorial to add outbox, idempotency, and inbox one responsibility at
  a time.
- Preserve the current argument order and technical content during the restyle.

## Tone dimensions

- Formality: conversational.
- Stance: reflective first, then exploratory and instructional.
- Personal distance: first-person for the experience and judgment; concrete service
  actors for the architecture.
- Certainty: calibrated. State the observed support facts directly and keep the
  historical cause explicitly unknown.
- Emotional register: mildly frustrated and self-aware where supported by Esteban's
  notes; otherwise curious and pragmatic.
- Humor: occasional and situational only. Do not add jokes, memes, or playful
  metaphors.
- Technical density: medium for junior developers and a broader technical audience.
- Authorial judgment: central. The architecture exists because Esteban became tired
  of repairing a boundary he now knew how to control better.
- Rhythm: deliberately varied. Allow short, earned sentences around the incident and
  longer explanatory passages around the mechanism.

Tone provenance: the repeated support work, junior history, “this is absurd”
reaction, later learning, and uncertainty about the duplicate cause all come from
`01-raw-notes.md`. The supplied first-job DEV article is a tone reference only.

## Opening kernel

Start with the ordinary two-service requirement and the hidden ambiguity between
two local transactions. Orient the reader to the three responsibilities, then move
into the Student/Users support story. Preserve the introduction's current
intellectual structure while making its voice less detached.

## Conclusion contract

Close the exact support tension with the scoped guarantee: Student remembers the
work, Users remembers the identified operation and result, and delivery may still
repeat. Return briefly to revisiting a path first built as a junior and hint at the
separate iteration article. Do not recap every section or add a generic lesson.

## Why I care about this

Repeated support cases exposed inconsistent student and user data. They were
especially frustrating because Esteban had first worked on this boundary as a
junior and later recognized failure modes that he now knew how to control better.
The experience fits a broader recurring lesson in his work: previous decisions can
be revisited as experience grows. The conclusion may briefly hint at a future post
about learning by iterating on earlier work, without turning this article into that
broader essay.

## Personal experience or observation

- The reader-facing article uses the simplified service names `Student` and `Users`.
  Internal evidence may retain `Academic` when identifying the inspected repository
  boundary, but that name must not appear in the article draft.
- A real support investigation found three enabled Users rows with the same document
  number, each associated with a different Academic student row. A lookup expecting
  one result threw `IncorrectResultSizeDataAccessException`.
- Other support cases involved students who could not log in or staff operations,
  such as updating a student image, failing because the expected user relationship
  was absent or inconsistent.
- The exact request, retry, race, or legacy process that produced each historical
  duplicate is not proven and must not be reconstructed as fact.
- The legacy student-without-user case came from accepting an unverified numeric
  `user_id`, not from Academic catching a failed Users request.
- The current Academic-to-Users user-creation path is synchronous. Academic checks
  Users by document, calls Users before saving the student, and has neither a
  user-creation outbox nor an idempotency key/inbox for that request.
- Esteban implemented Academic's notification outbox and the Users-to-Keycloak
  outbox flow end to end; both are in production. Those implementations led him to
  consider how outbox, inbox, and idempotency could improve student/user creation.
- The Academic-outbox plus Users-inbox design for student/user creation is still
  pending and must be presented as the next iteration, not a deployed result.

## In scope

- A story-led account of the support problem and the design reasoning it prompted.
- An introduction that frames one logical operation spanning two services, maps the
  roles of outbox, idempotency, and inbox, and tells the reader how the article will
  trace them. The Student/Users story follows that orientation.
- The difference between durable intent and safe repeated processing.
- A simplified current synchronous sequence and a proposed outbox/inbox sequence.
- Two simple, invented TypeScript examples using familiar Prisma-style transactions
  and direct `outbox`/`inbox` table queries. They are created for this post, not
  translated or adapted from production code.
- A small architecture-level failure analysis covering a lost response, a repeated
  delivery, and the separation between durable intent and safe processing.
- Primary-source research for claims that do not come from Esteban's experience,
  referenced in the article as footnotes.
- Approximately 1,500 to 2,000 words in English, using a story-led structure and a
  conversational technical tone.
- One simple sequence diagram comparing the synchronous and proposed boundaries.
- Development of a specific hero-image concept for the review package. Image
  generation is not authorized.

## Out of scope

- Claiming the whole production system is highly resilient or that all related
  support cases have disappeared.
- Proving the cause of the historical duplicate records.
- A complete treatment of the Users-to-Keycloak boundary, notification delivery,
  identity provisioning, reconciliation, observability, or every remaining system
  improvement.
- Production language or framework details, including Java, Spring, production
  exception types, and production code structure. Prisma is permitted only as the
  familiar illustrative API in the invented TypeScript snippets.
- Keycloak or any other downstream identity-provider boundary.
- Database-engine-specific concurrency mechanics, request hashing, polling, leases,
  backoff, task status machines, or manual replay implementation.
- A message-broker tutorial, saga implementation, or universal recommendation
  against either.
- Literal exactly-once delivery or a distributed ACID transaction across databases.
- Presenting the TypeScript examples as production code, translated Java, or code
  that has already been deployed.
- Saying that the complete Student/Users design has not been implemented. Keep the
  reader-facing article neutral about implementation status without claiming a
  deployment or measured outcome.
- Publishing, image generation, committing, pushing, or deployment.

## Open questions

- Final title and slug may change in the review package.
- The TypeScript examples need independent technical review and must state their
  architecture-level assumptions without expanding into infrastructure mechanics.
- Call the stable operation identifier an `idempotencyKey`, not an `intentId`.
- Introduce idempotency after durable outbox intent so the terminology arrives when
  the receiver needs to recognize a repeated request.
- Avoid invented lifecycle states such as `pending` when they are not necessary to
  demonstrate the pattern.
- Keep the business-rule boundary general. Do not use the support records or an
  unresolved document-uniqueness rule to carry that section.

## Tone reference

- Reference: https://dev.to/itsugo/my-first-engineering-job-is-teaching-me-something-i-didnt-expect-l96
- Use the reference for tone only, never for its content or wording.
- Target qualities: candid first-person reflection, conversational contractions,
  honest uncertainty, light self-deprecation, occasional earned asides, and short
  sentences used for emphasis.
- Keep the technical explanation approachable and let the personal discovery lead
  into it instead of lecturing from the first paragraph.
- Do not mechanically copy the reference's slang, capitalization, emojis, memes,
  rhetorical headings, sentence fragments, or deliberate imperfections.

## Restyle commission

- Esteban likes the current structure and intellectual content but finds the draft's
  tone too flat.
- Apply the updated quick-post and editorial tone guidance across the complete
  reader-facing draft.
- Use bounded section-level subagents, then integrate one coherent voice and run the
  no-ai-slop audit directly.

## Approval checkpoint

- [ ] Esteban approved this brief.
