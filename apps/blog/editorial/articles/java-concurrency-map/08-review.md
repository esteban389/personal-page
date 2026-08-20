# Editorial review

Article-text review result: **Approved for publication**. A junior-reader review of
the introductory revision praised the responsibility map and technical caveats but
found that the `CompletableFuture` graph and Java Memory Model material raised the
difficulty too quickly. Esteban approved a bounded revision: add a learning order,
an immediate-`get()` failure case, a one-stage `thenApply` example, and a concrete
volatile-publication example without expanding the article into a handbook. The
new claims were verified. Esteban then accepted one last review about direct
`Thread` use, approved the finished article and existing image, and authorized
publication, commit, and push.

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

The junior-reader revision also passes the audit. “On a first pass” names a
specific learning order instead of offering generic encouragement. The
immediate-`get()` passage explains the blocking program order directly. The
`thenApply` and volatile-publication passages introduce one mechanism each before
returning to the existing advanced examples. Moving non-async continuation
scheduling to the API footnote removes an intermediate detail from the main flow
without dropping its source or caveat. No new banned vocabulary, binary-contrast
cadence, faux-insight setup, importance puffery, or summary ending was introduced.

## Blockers

None for the editorial draft.

## Publication-readiness blockers

None. Final rendered route, search, card crop, and social metadata checks are
recorded during the publication pass.

## Publication-preparation checks

- **Astro publication state — Pass.** The post is `draft: false`; its metadata and
  body match the approved editorial artifact.
- **Sources — Pass.** All 19 inline citations render as end footnotes. Mobile
  inspection confirmed readable wrapping, numbered anchors, and backlinks.
- **Text and formatting — Pass.** The publication copy passed the passage-level
  no-ai-slop audit and the relevant Prettier check.
- **Code verification — Pass.** On Java 25.0.4, the packaged harness compiled into
  an isolated temporary directory and completed with assertions enabled. It now
  executes the immediate-`get()`, `thenApply`, dependency-graph, and volatile
  publication examples and imports only JDK classes.
- **Application validation — Pass.** Astro check, ESLint, Stylelint, and the
  production build passed with `draft: false`.
- **Rendered publication checks — Pass.** The generated route renders at
  `/posts/how-java-concurrency-apis-fit-together/`; Pagefind returns it for
  `concurrency`; the desktop feature-card crop preserves the cabinet and central
  drawer; and mobile article and footnote layouts remain readable. Open Graph,
  Twitter, and Article JSON-LD metadata point to the generated hero image.

## Resolved follow-up findings

### Restore the standalone Java verification harness — Resolved

- **Location:** `verification/ConcurrencyExamples.java` and `verification/README.md`.
- **Evidence:** The stale `ImportExample` dependency and call were removed. The
  documented packaged compile and run commands completed on Java 25.0.4 with the
  output `All concurrency examples passed.`
- **Action:** Resolved. Keep the README's coverage list aligned with displayed
  examples when snippets change.

### Add beginner stepping stones before advanced mechanisms — Resolved

- **Location:** The responsibility map, Executors, Results, and Shared state.
- **Evidence:** The revision adds a first-pass learning order, contrasts immediate
  waiting with submit-both-first, introduces `thenApply` before composition, and
  derives the volatile publication guarantee from program order plus the volatile
  happens-before edge.
- **Action:** Resolved in the draft. Esteban approved the final claim register.

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

### Direct `Thread` placement — Pass

- The final two-sentence addition answers when direct ownership is appropriate
  without adding a `new Thread(...).start()` tutorial.
- The first sentence ties direct use to a concrete thread's identity and lifecycle.
  The second keeps executor selection aligned with the article's execution-policy
  model.
- Java SE 25 documents the cited `Thread` lifecycle controls and `Executor`'s
  separation of task submission from execution mechanics. The addition maps to
  C-02a and introduces no unsupported prevalence or performance claim.
- The passage-level audit found no generic setup, faux insight, binary-contrast
  formula, importance language, or extra section scaffolding.

### `CompletableFuture` dependency graph — Pass

- The diagram and code agree: profile and orders start independently; profile also
  triggers recommendations; profile plus orders produce `Dashboard`; dashboard
  plus recommendations produce `PersonalizedDashboard`.
- `thenCompose` is the correct operator because `loadRecommendations` returns a
  `CompletableFuture<List<String>>`; composition flattens that returned stage.
- Both `thenCombine` calls are correct joins between branches that already exist.
  The final `.join()` is the single explicit wait at the request boundary.
- The article excerpt implements the reviewed graph, and the restored harness
  executes the equivalent assertions successfully.

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
- **Structure and length — Pass.** At roughly 2,980 words, the draft sits between
  a reference sheet and a handbook. The dashboard traces tasks, execution, and
  results; smaller publication, counter, cache, queue, semaphore, and reduction
  examples cover the branches that the dashboard cannot honestly demonstrate.
- **Claim coverage — Pass.** Claims C-01 through C-22, including C-07a through
  C-07d and C-10a, are represented with their
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
  C-07d, and the official `CompletionStage` contracts agree. The restored harness
  compiles and passes with assertions enabled.
- **Beginner corrections — Pass.** The revision places the Java 21+ baseline before
  the first virtual-thread example, replaces the unexplained “races” wording with
  observable shared-state behavior, names `CyclicBarrier` in both the map and
  coordination section, and adds the four junior-reader stepping stones without
  expanding the parallel-computation scope.

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
- [x] Esteban approved the final claim register.
- [x] Esteban approved the final reviewed draft and authorized publication.
