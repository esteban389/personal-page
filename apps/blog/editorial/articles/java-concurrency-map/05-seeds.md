# Section seeds

Use one to three human-authored anchor sentences per planned section. Expansion
must preserve their claim and remain inside the listed boundaries.

These seeds preserve sentences or close paraphrases that Esteban explicitly approved
during style selection and commission. They are not additional personal testimony.

## Start with a program that waits twice

### Seed sentences

- The concurrency package feels crowded when every type looks like another tool to
  memorize. It becomes smaller once you group those tools by the job they perform.
- Java concurrency becomes manageable when you first identify the problem you are
  solving and only then choose an API.

### Expansion boundaries

- Include: the sequential dashboard example, the responsibility map, and the
  concurrency-versus-parallelism distinction only to the depth needed later. Add a
  brief pre-heading orientation before the example without inventing personal
  experience or announcing a generic tutorial. Give the first-time reader a
  concrete learning order after the map.
- Exclude: generic history of Java concurrency, dramatic claims about difficulty,
  and any claim that the categories never overlap.
- Relevant claim IDs: C-01.

### Questions for Esteban

- None. Esteban selected `How Java's Concurrency APIs Fit Together` during the
  review package.

## Tasks describe work

### Seed sentences

- A task describes work. A thread is one possible execution mechanism.

### Expansion boundaries

- Include: `Runnable`, `Callable<V>`, two tiny scenario-based declarations, and two
  sentences placing direct `Thread` ownership.
- Exclude: a direct `Thread` lifecycle tutorial and claims that a task is always
  run asynchronously.
- Relevant claim IDs: C-02.

### Questions for Esteban

- None.

## Executors decide how work runs

### Seed sentences

- An executor receives a task and applies an execution policy.
- We submit both dashboard operations before waiting for either result.

### Expansion boundaries

- Include: `Executor`, `ExecutorService`, lifecycle, a verified dashboard excerpt,
  a contrasting immediate-`get()` fragment, and a narrow virtual-thread
  explanation.
- Exclude: executor factory catalog, tuning rules, throughput measurements, and any
  suggestion that virtual threads are faster CPU threads.
- Relevant claim IDs: C-03, C-04, C-05, C-20, C-21, C-22.

### Questions for Esteban

- None.

## Results can be waited for or composed

### Seed sentences

- A `Future` is a handle to a result that may not exist yet.
- `CompletableFuture` is useful when later work should depend on earlier results.
- A direct two-input rewrite makes composition look like a syntax swap; a
  dependency graph shows what the abstraction contributes.

### Expansion boundaries

- Include: `get()`, attempted cancellation, the case where plain `Future` remains
  adequate, a small `thenApply` transformation, and the verified
  personalized-dashboard graph. Profile and orders start independently,
  recommendations depend on profile through `thenCompose`, the dashboard depends
  on profile and orders through `thenCombine`, and one boundary `join()` awaits the
  final combination. Keep continuation scheduling in a source note rather than the
  beginner explanation.
- Exclude: a full error-handling guide, timeout matrix, or a universal preference
  between direct waiting and asynchronous composition.
- Relevant claim IDs: C-06, C-07, C-08.

### Questions for Esteban

- None. The verified dependency-graph example replaces the earlier direct
  two-input comparison.

## Shared state has three separate questions

### Seed sentences

- Choosing an executor does not make shared mutation safe.
- Atomicity, visibility, and ordering are separate questions.

### Expansion boundaries

- Include: a `volatile` increment counterexample, `synchronized`, `Lock`,
  `AtomicInteger`, a one-time volatile publication example, and concrete
  happens-before guarantees.
- Exclude: a formal Java Memory Model derivation, lock-free algorithm internals,
  and claims that atomics can protect multi-field invariants.
- Relevant claim IDs: C-09, C-10, C-11, C-12, C-13, C-17.

### Questions for Esteban

- None.

## Concurrent collections protect documented operations

### Seed sentences

- A thread-safe collection protects the operations its contract documents. Your
  larger sequence of calls still needs its own correctness argument.

### Expansion boundaries

- Include: `putIfAbsent` or `compute`, producer-consumer handoff, and the variation
  in `BlockingQueue` capacity.
- Exclude: implementation internals and a survey of every concurrent collection.
- Relevant claim IDs: C-14, C-15, C-17.

### Questions for Esteban

- None.

## Coordination describes who may proceed

### Seed sentences

- Sometimes the shared rule is not "only one thread may mutate this value." The
  rule might be "at most two requests may use this dependency."

### Expansion boundaries

- Include: the verified semaphore pattern and one-sentence placements for latches
  and barriers.
- Exclude: treating synchronizers as generic protection for arbitrary invariants.
- Relevant claim IDs: C-16, C-17, C-21.

### Questions for Esteban

- None.

## Parallel computation splits data or work

### Seed sentences

- The dashboard spends time waiting. A sum over a large collection presents a
  different problem: divide computation over data and combine the partial results.

### Expansion boundaries

- Include: fork/join's work-stealing role, a verified parallel reduction, and
  suitability conditions.
- Exclude: promises of speedup, I/O advice based on parallel streams, and benchmark
  numbers.
- Relevant claim IDs: C-18, C-19.

### Questions for Esteban

- None.

## Choose the responsibility before the class

### Seed sentences

- Start with the sentence that describes the problem. Let the API name come second.

### Expansion boundaries

- Include: a decision table and a small reader exercise grounded in the dashboard.
- Exclude: a recap of every section and a motivational conclusion.
- Relevant claim IDs: C-01 through C-22, excluding preview-only C-23 and C-24.

### Questions for Esteban

- None.
