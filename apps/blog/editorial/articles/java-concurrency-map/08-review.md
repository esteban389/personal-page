# Editorial review

Article-text review result: **Reopened for approval**. Esteban found that the
approved version reached its first example before providing enough introductory
orientation. The revision now adds a short pre-heading introduction, keeps the
dashboard as the first concrete example, and removes the repeated API-catalog
setup from that section. The technical body remains unchanged. The current
verification harness and final image approval remain separate
publication-readiness blockers.

This review covers `00-brief.md` through `06-draft.md`, the verification harness
and README, the repository style and rubric, the image guide, and the `no-ai-slop`
detect criteria. Important technical claims were checked again on 2026-08-20
against the linked Java SE 25, JLS, and OpenJDK sources rather than accepted from
the claim register alone.

## Mandatory LLM-pattern audit

The table quotes only enough text to identify each passage. These are editing
findings, not claims about who wrote the draft.

| Location                                                                                                      | Pattern                                                          | Why it is generic here                                                                                                                                             | Required action                                                                                                                                                        | Status   |
| ------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| Tasks, paragraph after the declarations                                                                       | “This separation is useful”                                      | Interpretive metadiscourse tells the reader the distinction is useful; the next sentence already demonstrates how task code stays independent of execution policy. | Delete the setup and let the cache-refresh consequence carry the point.                                                                                                | Resolved |
| Executors, after the virtual-thread explanation                                                               | “That fact will matter”                                          | Generic foreshadowing delays the concrete resource-limit consequence until another section.                                                                        | Delete it, or attach the unbounded-executor fact directly to the later semaphore example.                                                                              | Resolved |
| Shared state, before the three-item list                                                                      | “It helps to ask”                                                | Reader guidance weakens a section whose three concrete concerns are already clear.                                                                                 | Introduce the list directly as the three concerns in shared-state safety.                                                                                              | Resolved |
| Shared state, atomic classes                                                                                  | “Their scope is also their limit”                                | This portable aphorism labels the point before explaining it.                                                                                                      | Start with the observable constraint: one atomic variable does not make a multi-value invariant atomic.                                                                | Resolved |
| Coordination, opening                                                                                         | “not ‘only one thread’ ... ‘at most two requests’”               | This is the `no-ai-slop` binary-contrast pattern. The distinction is relevant, but the setup spends two sentences staging it.                                      | State directly that a two-request dependency limit is a coordination policy represented by semaphore permits.                                                          | Resolved |
| Several source-link tails, especially Executors, Results, Shared state, Collections, and Parallel computation | “The ... documentation” / “See the ... contract”                 | Repeated documentation announcements give otherwise conversational sections the same reference-manual cadence.                                                     | Keep every source link, but attach it to the supported claim or move it to compact source notes; remove repeated announcements about documentation.                    | Resolved |
| Final section, after the decision table                                                                       | “The map narrows ... it does not” and “Those details are easier” | The first is another binary contrast; the second is portable interpretive commentary. Both restate the table rather than advancing the exercise.                   | Replace both with one direct instruction to evaluate lifecycle, failure policy, workload, contention, ordering, and resource limits after choosing the responsibility. | Resolved |

The revision replaces all seven identified passages with direct mechanisms or
instructions. The follow-up audit found no generic scene-setting opening,
faux-expert setup, importance puffery, weasel attribution, banned vocabulary,
decorative em-dash rhythm, motivational headings, invented anecdote, or
summary-recap ending. The opening now starts with the ordinary requirement to let
independent operations make progress, names the different responsibilities, and
sets the beginner scope before the dashboard. The ending asks the reader to apply
the map.

The new introduction passes the portability check because its promise is tied to
specific Java API families, the responsibility taxonomy, the dashboard teaching
example, and the no-prior-concurrency audience. It does not use generic
scene-setting, announce a tutorial, claim importance, invent experience, or add a
new technical claim. Moving the code-fragment disclaimer below the first snippet
also prevents a documentation note from interrupting the opening.

The new Results passages also pass the body-level audit. “mostly look like a
syntax swap” names the concrete weakness in the earlier example, and “Plain
`Future` remains adequate” preserves a scoped alternative instead of manufacturing
a winner. Neither passage uses generic significance claims, faux insight, or a
summary transition.

## Blockers

None for the editorial draft.

## Publication-readiness blockers

### Publication readiness: generated image still needs final approval and wiring

- **Location:** `07-image-brief.md` and the publication-readiness rubric.
- **Evidence:** Esteban selected the responsibility-cabinet direction and authorized
  generation. A refined `1672 × 941` candidate and proposed alt text now exist,
  but Esteban has not approved the final asset or alt text. Actual homepage/card
  and social crops remain unchecked because the asset is not wired.
- **Action:** Obtain final asset and alt-text approval, wire the image into
  frontmatter, then inspect the actual homepage/card and social crops.

This is a publication blocker, not a blocker to revising or approving the text as
an editorial draft.

### Restore the standalone Java verification harness

- **Location:** `verification/ConcurrencyExamples.java`, its missing
  `ImportExample` dependency, and `verification/README.md`.
- **Evidence:** `ImportExample.java` is absent, but `ConcurrencyExamples.java`
  still imports `verification.ImportExample` and calls `new ImportExample()`.
  An isolated compile on 2026-08-20 fails with two `cannot find symbol` errors at
  those references. The README's passing result and command therefore do not
  reproduce the current harness state.
- **Action:** Remove the unrelated helper import/call or restore the required
  source, then run and record a command that matches the packaged source layout.
  Do not treat the previous passing run as current evidence.

This blocker concerns the verification artifact. It does not reopen the approved
article claims, dependency graph, or displayed code excerpt, which were reviewed
separately against C-07a through C-07c and the official Java contracts.

## Publication-preparation checks

- **Astro draft — Pass.** The prepared post is intentionally `draft: true`; its
  metadata and body match the revised editorial artifact. Human approval of the
  new introduction is pending.
- **Sources — Pass.** All 17 inline citations were converted to rendered footnotes.
  The local render check confirmed semantic footnote output and backlinks.
- **Text and formatting — Pass.** The publication copy passed the passage-level
  no-ai-slop audit and the relevant Prettier check.
- **Application validation — Pass.** Astro check and the production build passed
  with the post still marked as a draft.
- **Deferred checks.** Generated-route inspection, Pagefind inclusion, and mobile
  visual inspection remain deferred until publication preparation advances beyond
  `draft: true`. Footnote spacing and backlink behavior should be included in the
  mobile visual check.

## Resolved follow-up findings

### Describe `thenCompose` as dependency triggering, not waiting — Resolved

- **Location:** Results, “After `profile` completes normally, `thenCompose` invokes
  the recommendation function.”
- **Evidence:** This now matches C-07a and the `CompletionStage` contract: it names
  the triggering condition and flattening behavior without implying that
  `thenCompose` blocks a thread.
- **Action:** Resolved. Preserve the distinction between a stage dependency and an
  explicit blocking wait.

### Bound the explicit-executor explanation to the async suppliers — Resolved

- **Location:** Results, “passes the executor explicitly to each asynchronous
  supplier” and “do not independently schedule their continuation bodies on that
  executor.”
- **Evidence:** The explanation now scopes the explicit executor to the three
  `supplyAsync` operations and separately identifies the non-async behavior of
  `thenCompose` and `thenCombine`. It no longer implies that every continuation is
  scheduled on the virtual-thread executor.
- **Action:** Resolved. Keep this wording aligned if the example later changes to
  an `Async` continuation variant.

### Label illustrative fragments and tighten harness equivalence — Resolved

- **Location:** All code fences, especially Tasks, Concurrent collections, and
  `verification/README.md`.
- **Evidence:** The draft labels the fences as fragments that may omit imports and
  surrounding classes. The README now lists the dashboard variants, completion
  counter, semaphore, and parallel reduction as executed, and separately labels
  the task, cache, and queue fragments as contextual and unexecuted.
- **Action:** Resolved. Preserve this distinction if code changes during the
  publication pass.

## User-directed revision checks

### `CompletableFuture` dependency graph — Pass

- The diagram and code agree: profile and orders start independently; profile also
  triggers recommendations; profile plus orders produce `Dashboard`; dashboard
  plus recommendations produce `PersonalizedDashboard`.
- `thenCompose` is the correct operator because `loadRecommendations` returns a
  `CompletableFuture<List<String>>`; composition flattens that returned stage.
- Both `thenCombine` calls are correct joins between branches that already exist.
  The final `.join()` is the single explicit wait at the request boundary.
- The article excerpt implements the reviewed graph. The current harness still
  contains the equivalent assertions, but its unrelated missing-helper reference
  prevents a fresh execution; that publication-readiness blocker is recorded
  above without reopening the excerpt review.

### Comparison with plain `Future` — Pass

The revision does not present composition as universally better. It keeps plain
`Future` for a short, fixed fan-out whose tasks can be submitted together, then
uses `CompletableFuture` for a branch that cannot start until another result
exists. The final caveat preserves separate decisions for errors, cancellation,
timeouts, and executor ownership.

### Title alternatives

| Candidate                                                  | Review          | Reason and action                                                                                                                                                                                             |
| ---------------------------------------------------------- | --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Java Concurrency by Responsibility`                       | Pass            | Compact and aligned with the taxonomy, though more formal than the body. No generic or inflated language.                                                                                                     |
| `How Java's Concurrency APIs Fit Together`                 | Selected — Pass | The clearest conversational option for a beginner; specific to the article and free of hype.                                                                                                                  |
| `Tasks, Results, State, and Coordination in Java`          | Needs attention | Concrete, but the four-item inventory omits execution and parallel computation, so it understates the actual map. Use it only if the scope is narrowed or the title names the missing branches.               |
| `Choosing Among Java's Concurrency Tools`                  | Pass            | Clear and specific, but “tools” leans toward the flat catalog the thesis is correcting. Prefer one of the first two if the title should carry the organizing judgment.                                        |
| `Start With the Problem: A Guide to Java Concurrency APIs` | Needs attention | “Start With the Problem” passes the portability test poorly and “A Guide to” is generic title framing. Replace the portable setup with the actual criterion, such as choosing APIs by the problem they solve. |

No title uses hype, faux expertise, importance puffery, or an unsupported promise.
Esteban selected `How Java's Concurrency APIs Fit Together`; it is the strongest
of the five for the conversational tone. `Java Concurrency by Responsibility`
remains the option closest to the thesis, but it is not the publication title.

### Parallel-computation scope — Pass

The section was not expanded. It retains the same boundary explanation for
fork/join, one verified sum-of-squares example, the stateless/non-interfering and
associative conditions, and the warning that parallel execution requires a
representative measurement.

## Passes

- **Thesis and reader outcome — Pass.** The seven responsibility questions make
  the approved thesis visible near the start, and the decision table turns it into
  a usable first step.
- **Original contribution — Pass.** The responsibility map, the separation of the
  waiting-oriented dashboard from data-parallel work, and the mistake checks in
  the final table form a beginner-oriented synthesis rather than a flat rewrite of
  API documentation.
- **Structure and length — Pass.** At roughly 2,680 words, the draft sits between
  a reference sheet and a handbook. The dashboard traces tasks, execution, and
  results; smaller counter, cache, queue, semaphore, and reduction examples cover
  the branches that the dashboard cannot honestly demonstrate.
- **Claim coverage — Pass.** Claims C-01 through C-22, including C-07a through
  C-07c, are represented with their
  opinion/inference boundaries intact. Live checks of the official sources support
  the executor policy, `Future` cancellation, `CompletableFuture` composition and
  default executor, Java Memory Model, concurrent collection, synchronizer,
  fork/join, stream, and virtual-thread statements. Structured concurrency remains
  correctly omitted from the body.
- **Caveats — Pass.** The draft does not promise overlap from submission alone,
  faster execution from virtual threads or parallel streams, atomic multi-field
  invariants from atomics, or bounded capacity from every `BlockingQueue`.
- **Ending — Pass.** The practice exercise applies the map without recapping every
  section or ending on a motivational slogan.
- **Article graph review — Pass.** The diagram, displayed code, C-07a through
  C-07c, and the official `CompletionStage` contracts agree. Current harness
  execution is blocked separately by the missing `ImportExample` dependency and is
  not reported as a passing check.
- **Beginner corrections — Pass.** The revision places the Java 21+ baseline before
  the first virtual-thread example, replaces the unexplained “races” wording with
  observable shared-state behavior, and names `CyclicBarrier` in both the map and
  coordination section.

## Rejected findings and rationale

- The introduction's “The requirement is easy to state” sentence is retained
  because the following sentence names the exact Java APIs that make selection
  difficult. It is one local contrast grounded in the article rather than a
  repeated cadence formula.
- “A task describes work. A thread is one possible execution mechanism.” consists
  of short parallel sentences, but it is the approved conceptual hinge and is more
  precise than a smoothed transition.
- The plain-`Future` dashboard and personalized `CompletableFuture` graph both earn
  their space: the second now demonstrates a true dependency and convergence
  instead of restating the first with different syntax.

## Approval checkpoint

- [x] The mandatory LLM-pattern audit is complete.
- [x] Material LLM-pattern findings are resolved or explicitly accepted by Esteban.
- [x] All editorial-draft blockers are resolved.
- [ ] Esteban approved the revised reviewed draft.
