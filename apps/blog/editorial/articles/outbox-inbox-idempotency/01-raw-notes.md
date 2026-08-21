# Raw notes

Preserve the original language, uncertainty, contradictions, examples, and partial
ideas in this file. Do not turn these notes into polished article prose.

## Contextual dump

### Initial recollection supplied by Esteban

- For the article, call the services Student and Users.
- Creating a student also requires creating a corresponding user.
- The team preferred direct service-to-service communication over introducing a
  messaging abstraction such as Kafka.
- The motivating mental model had two failure classes: the remote call may fail or
  time out, and it may commit but lose the response, making a retry ambiguous.
- Esteban initially described a planned combination of eventual consistency,
  transactional outbox, an idempotency key, and a receiver-side inbox.
- Repeated support tickets made him think the situation was absurd because he now
  knew he could control the requests better. He first worked on the flow as a junior;
  after reading articles and watching talks, he knew more options.

### Necessary correction after inspecting fresh `origin/main`

- Academic currently calls Users synchronously with `WebClient.block()`.
- Academic does not enqueue user creation in its outbox. Its only registered outbox
  handler is `users.notification.create`.
- The outbox involved in the current student-creation path begins inside Users,
  after Academic's synchronous POST.
- Notification delivery was the first place Esteban implemented an outbox after
  seeing notifications go undelivered for a reason he no longer remembers precisely.
- While designing that flow, he considered other uses: Users-to-Keycloak provisioning
  and student/user creation. That is where inbox and idempotency entered the design.
- Academic notification delivery and Users-to-Keycloak provisioning through outboxes
  are in production. Academic-outbox plus Users-inbox student/user creation is pending.
- Esteban implemented the relevant original and later flows end to end.

## Examples and experiences

### Missing relationship support case

- A parent reported that a student could not log in and supplied the student's
  credentials, although credentials should not have been sent in a support ticket.
- Login logs said the user did not exist, and inspection confirmed that no matching
  Users row existed.
- Correction: this legacy student-without-user case came from accepting an unverified
  numeric `user_id`, not from a caught or retried Users failure during current student
  creation.

### Duplicate relationship support case

- A support ticket again reported that a student could not log in.
- Initial authentication went through Keycloak, but fetching application user data
  from Users failed at the second step.
- Inspection found three enabled Users rows sharing a document number. Each row was
  linked to a different Academic student row.
- A lookup expecting one result threw `IncorrectResultSizeDataAccessException`; it
  did not select an arbitrary row.
- The exact repeated request or historical operation responsible for each duplicate
  is unknown.
- Related data inconsistencies could also block staff actions, such as updating a
  student's image.
- Use the neutral phrase "one student." The example name "Juan" was invented and
  must not be presented as incident evidence.

### Current user-creation path

1. Academic checks Users by document.
2. If absent, Academic synchronously posts to `/v1/internal/user`.
3. A Users transaction inserts the local user, role, and a Keycloak outbox task.
4. Users commits and returns `user_id`.
5. Academic checks for an existing student using that `user_id`.
6. Academic inserts the student and history.
7. Users later provisions Keycloak from its outbox.

- Enrollment-based creation runs in an Academic `@Transactional` method.
- Academic calls Users before `studentService.save()`.
- If Users throws, Academic rethrows and the student is not committed.
- Users may commit and Academic may subsequently fail, leaving a local user without
  a student.
- Academic's read-before-create document check is not atomic and can race.
- There is no automatic retry around `UsersApi.createUser()` in current Academic
  main. A staff repetition, concurrent request, frontend retry, or older process
  could initiate duplicates, but none is proven for the diagnosed incident.
- Academic sends no idempotency key and Users has no inbox for this request.
- Current Users creates its local user and role plus the Keycloak outbox record in
  one local transaction.
- At the time of the historical incident, Users created Keycloak credentials first
  and then inserted its local row. There is no evidence identifying the precise
  repeated operation responsible for the duplicates.
- The deterministic `user:{userId}:keycloak:create:v1` key applies only to the later
  Users-to-Keycloak operation.
- The Keycloak worker searches for an existing identity before creating one. This
  protects provisioning retries but does not make Academic-to-Users idempotent.
- The Keycloak outbox has polling, backoff, attempt limits, `BLOCKED` status, history,
  and manual replay controls. Academic-to-Users currently has no durable retry.
- A local Users record exists before Academic returns a successfully created student,
  but Keycloak credentials may still be pending. There is no explicit pending state
  on the student or user entity.
- There is no verified evidence that the historical duplicate or linking cases have
  disappeared.

## Tentative claims

- An outbox and an inbox solve different halves of a retryable cross-service operation.
- The outbox makes the sender's intent durable by storing it in the same local
  transaction as the initiating data change.
- The receiver cannot assume the sender delivers once; the proposed request therefore
  carries an idempotency key and the receiver persists the processed key and result.
- The intended guarantee is an effectively-once business effect under repeated
  attempts, not exactly-once delivery.
- A direct HTTP relay can be sufficient for this small boundary; adopting an outbox
  does not inherently require Kafka.
- A full saga appears disproportionate for a one-way, two-service operation without
  a larger compensating workflow. This is Esteban's bounded design judgment, not a
  universal rule or a repository-documented historical decision.

## Counterarguments

- A unique database constraint on document number may prevent the diagnosed duplicate
  rows more directly. The article should acknowledge that this remains necessary,
  while explaining that a constraint alone does not preserve the response to a
  repeated request or make the sender's intent durable.
- A read-before-create check is insufficient under concurrency unless backed by an
  atomic uniqueness mechanism.
- An inbox record can itself race. The illustrative design must rely on an atomic
  insert or unique constraint and define what happens while the first request is
  still processing.
- Outbox/inbox does not make every downstream side effect idempotent or remove the
  need for monitoring and recovery.
- The proposed design adds eventual consistency: a student may not be immediately
  ready for operations that require the user.

## Questions and uncertainties

- The trigger for the historical duplicate attempts is unknown.
- The reason the original notification was not delivered is no longer remembered.
- Kafka and saga were not rejected through a documented architecture decision. The
  proportionality argument is a present design judgment.
- The student/user outbox-inbox design is pending, so invented TypeScript examples
  must be presented as one defensible implementation rather than the production design.
- The whole system has other resilience gaps. Esteban intentionally scopes this post
  to transactional outbox, inbox, and idempotency rather than claiming a complete fix.

### Correction after the first review package

- Do not mention Keycloak anywhere in the reader-facing article.
- Do not mention Java, Spring, framework annotations, or production exception class
  names in the reader-facing article.
- The post is about architecture and assumes only basic system-design knowledge.
- Avoid code-level and infrastructure-level implementation details.
- TypeScript examples should remain, but they must be simple, invented specifically
  for the article, and clearly unrelated to the production implementation.
- The examples exist to make outbox, inbox, and idempotency easier to understand;
  they are not the article's center.
- Use Esteban's supplied DEV article as a reference for tone only. Preserve its candid,
  conversational, reflective quality without copying phrases, content, memes, or
  surface quirks.

### Correction after the architecture-first rewrite

- The opening does not feel introductory enough. Establish the two-service setup,
  why one student creation needs one user creation, and why the original direct call
  looked reasonable before beginning the support incident.
- Run the complete draft through the repository's `no-ai-slop` editing skill.
- Remove reader-facing commentary that the complete design has not been implemented.
  Esteban accepts the implications. Do not replace that disclaimer with a false
  deployment or outcome claim.
- Replace `intentId` with the ordinary term `idempotencyKey`. Idempotency is an
  explicit supporting topic in the post, not a novel name for Esteban's design.
- Replace abstract helpers such as `processOnce` with approachable TypeScript a
  common developer might recognize: Prisma- or Drizzle-style transactions, direct
  reads from the inbox table, an ordinary conditional, user creation, and inbox
  persistence.
- A comment such as `// Ensure it is processed once` may identify the purpose of the
  direct inbox logic. The code should show that the pattern is easier to understand
  than the terminology makes it sound.
- The examples remain invented for the post and must not resemble or claim to be
  production code.

### Final introduction and business-rule correction

- The previous opening still did not feel like an introduction. Use the opening of
  Esteban's Java concurrency article as the structural reference: establish the
  ordinary requirement, name the underlying difficulty, map the concepts, and tell
  the reader how the article will proceed before entering the story.
- Keep the support incident in the story, but do not use it to raise or expose an
  unresolved document-uniqueness question in the later architecture section.
- The distinction between request idempotency and business rules may remain if it
  stands on its own. Otherwise, remove the section.

### Full-draft tone restyle

- Esteban likes the current structure and intellectual content.
- The draft lost the intended tone and reads too much like a detached technical
  explainer.
- Reload the updated `blog-quick-post` skill and related editorial documentation,
  then write the publishable article with the intended style.
- Use subagents on smaller section groups to reduce generic LLM cadence while keeping
  a good balance between the personal story and the technical explanation.
- Preserve the factual, privacy, code, platform, and implementation-status boundaries
  already recorded in this workspace.

### Introduction restoration after Astro preparation

- The first tone-restyled Astro post accidentally removed the agreed three-paragraph
  introduction instead of adapting it.
- Restore the requirement → hidden difficulty → responsibility map → reader path
  introduction in both the editorial draft and Astro post.
- Adapt its cadence to the candid conversational tone, then remove only the
  duplicated setup that follows it.

## Links, code, and source material

- Esteban authorized external research using primary technical sources for claims
  that are not grounded in his supplied experience.
- References in the draft and final article should use footnotes.
- Code examples should use TypeScript for accessibility even though the production
  system and Esteban's preference are Java.
- Include a simple sequence diagram comparing the current synchronous boundary with
  the proposed outbox/inbox boundary.
- Target length: approximately 1,500 to 2,000 words.
- Structural style: story-led explanation.
- Writing tone: conversational technical.
- Language: English.
- Develop a hero-image concept; do not generate an image without later authorization.
- The conclusion may lightly hint at a future article about learning by iterating on
  earlier work.
