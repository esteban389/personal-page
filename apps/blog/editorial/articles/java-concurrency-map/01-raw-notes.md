# Raw notes

Preserve the original language, uncertainty, contradictions, examples, and partial
ideas in this file. Do not turn these notes into polished article prose.

## Contextual dump

User request, preserved as direction rather than polished copy:

- Write a new Java concurrency article.
- Use the attached text as a reference, not as a base.
- Preserve the useful organization and grouping of Java standard-library
  concurrency classes and elements.
- Target readers who are not necessarily familiar with concurrency concepts.
- Chosen structure: option A, the guided map.
- Chosen tone: conversational.
- Add tiny examples, including semi-realistic scenarios and code snippets.
- Language: English. Translate only after the English article is finished.
- Version scope: broadly modern Java.
- Length: a middle ground between a compact overview and a comprehensive guide.
- Always verify technical claims against current sources and execute important
  code; do not rely on recorded knowledge.
- Image work is deferred until the final publication stage because the article's
  structure was not yet settled when that decision was made.

Review-package corrections requested by Esteban:

- Explore more interesting title options instead of settling on the current title.
- Keep the parallel-computation section at its current scope.
- Replace the first `CompletableFuture` example because it reads like different
  syntax for the same two-result operation as the `Future` example. Add enough
  dashboard complexity to demonstrate dependent and independent stages.
- Preserve the many official resources, but present them as footnotes collected at
  the end in the final publication.

Publication-draft correction requested by Esteban after rereading the article:

- The opening begins with the first example but does not feel sufficiently
  introductory. Add a short orientation before the first section: establish the
  ordinary problem, explain why the APIs look confusing as a flat list, state the
  responsibility-based thesis, and make the beginner scope explicit. Keep the
  dashboard as the first concrete example.

Junior-reader review supplied after the introductory revision:

- The responsibility map, sequential dashboard opening, task-versus-thread
  distinction, qualified virtual-thread guidance, shared-state examples, and final
  decision table worked well.
- The main problem is density after the first sections. The `CompletableFuture`
  graph and Java Memory Model explanation move from beginner to intermediate
  material too quickly.
- Add one `thenApply` transformation before the dependency graph.
- Add a concrete two-thread example before the abstract happens-before explanation.
- Show the executor/Future mistake where each task is awaited immediately after
  submission, which prevents the two dashboard calls from overlapping.
- Give the reader an explicit learning order: understand some concepts now,
  recognize others, and return to advanced details when needed.
- Keep cancellation, error handling, timeouts, and executor ownership in view, but
  do not expand this article into a full treatment of them.
- Esteban approved the bounded revision plan based on this review. The source
  review is preserved at
  `/Users/esteban389/.codex/attachments/f11da076-0550-456f-9371-9c589f104abf/pasted-text.txt`.

Final publication review supplied by Esteban:

- `Thread` appears in the responsibility map but the article does not explain when
  application code would use it directly.
- Keep the executor-first architecture and do not add a manual-thread tutorial.
- Resolve the beginner's question in one or two sentences: direct `Thread` use fits
  code that intentionally owns one thread's identity or lifecycle; executors fit
  application tasks whose creation, scheduling, and lifecycle belong to an
  execution policy.
- After this correction, Esteban considers the article finished and explicitly
  authorized changing `draft` to `false`, committing, and pushing it.

Approved thesis from the commission:

> Java concurrency becomes manageable when you first identify the problem you are
> solving--executing work, obtaining results, protecting state, coordinating tasks,
> or performing parallel computation--and only then choose an API.

## Examples and experiences

- No personal experience or production story was supplied.
- Preferred teaching device: small fictional but plausible backend situations,
  clearly presented as examples rather than Esteban's experience.
- Candidate running example: an endpoint loads a customer profile and recent
  orders independently, then combines the results.
- Candidate shared-state example: multiple tasks increment a completion counter,
  exposing why execution and state safety are separate concerns.
- Candidate coordination example: limit calls to a dependency or pass work from
  producers to consumers.

## Tentative claims

- Grouping concurrency APIs by responsibility is more useful to a beginner than
  treating the library as a flat list.
- A task and a thread are different concepts.
- Execution, result handling, shared-state safety, coordination, and data
  parallelism require different abstractions.
- Virtual threads change the cost model for thread-per-task I/O workloads but do
  not remove races or other shared-state problems.
- `Future`, `CompletableFuture`, locks, atomics, concurrent collections,
  synchronizers, fork/join, and parallel streams should be placed in the map
  without turning the article into API documentation.

## Counterarguments

- A taxonomy can still become an overwhelming catalog if every class receives a
  section. Keep the number of top-level groups small and use representative types.
- One backend I/O example cannot honestly demonstrate fork/join or data
  parallelism. Use a separate tiny example rather than forcing it into the main
  scenario.
- "Use higher-level APIs" is too broad to be a rule. The appropriate abstraction
  depends on the problem and runtime constraints.
- Virtual threads and asynchronous pipelines solve overlapping but non-identical
  problems; avoid declaring one universally better.

## Resolved publication decisions

- The selected title is `How Java's Concurrency APIs Fit Together`; the final
  description, category, and slug are recorded in the Astro post and status file.
- The article includes an executable `CompletableFuture` graph in which
  recommendations depend on the profile while orders load independently.
- Preview structured concurrency remains outside the article's beginner scope.
- Esteban selected and approved image concept A, the responsibility cabinet, and
  its generated asset.
- Official sources appear as end footnotes. The final production build and mobile
  inspection confirmed the semantic footnote list, numbering, wrapping, and
  backlinks.

## Links, code, and source material

- User-supplied reference attachment:
  `/Users/esteban389/.codex/attachments/d05d9a8b-044b-45a2-bedb-ad2334683a77/pasted-text.txt`
- Reference use boundary: taxonomy and grouping only; not a prose base.
- Oracle Java SE 25 `java.util.concurrent` package documentation:
  <https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/util/concurrent/package-summary.html>
- Java Language Specification, Chapter 17:
  <https://docs.oracle.com/javase/specs/jls/se25/html/jls-17.html>
- OpenJDK JEP 444, Virtual Threads:
  <https://openjdk.org/jeps/444>
- Requested editing skill source:
  <https://github.com/petergyang/no-ai-slop>
