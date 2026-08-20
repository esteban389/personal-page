# Structural objections

## Skeptical, well-informed reader

| Objection or question                                                                                                 | Affected section                     | Proposed response                                                                                                                                                                       | Decision             |
| --------------------------------------------------------------------------------------------------------------------- | ------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------- |
| The categories overlap. `CompletableFuture`, for example, can arrange execution and represent a result.               | Results; decision map                | Present the groups as questions that guide the first choice, not as mutually exclusive type families. State the overlap directly.                                                       | Addressed in draft   |
| A two-input `CompletableFuture` example looks like a syntax swap for the `Future` example.                            | Results                              | Add a real dependency graph: recommendations wait for profile, orders remain independent, and the branches combine once at the boundary. Explain when plain `Future` is still adequate. | Addressed in draft   |
| Submitting two tasks does not prove that they overlap.                                                                | Executors                            | Say that overlap is possible only when the executor's policy and available resources permit it. Link the `Executor` contract.                                                           | Addressed in draft   |
| `Future.cancel(true)` does not guarantee that running work stops.                                                     | Results                              | Describe cancellation as an attempt and avoid a cancellation example whose behavior would depend on task cooperation.                                                                   | Addressed in draft   |
| Virtual threads may read like a universal replacement for pools or `CompletableFuture`.                               | Executors; results                   | Limit the claim to high-concurrency, thread-per-task workloads that often wait. State that virtual threads do not speed up CPU work, remove races, or belong in pools.                  | Addressed in draft   |
| `volatile` is often taught as "thread-safe," which would make the counter advice misleading.                          | Shared state                         | Separate visibility from atomicity and show why `volatile int completed; completed++;` still performs a compound update.                                                                | Addressed in draft   |
| Atomics and concurrent collections can encourage readers to compose individually safe calls into an unsafe invariant. | Shared state; concurrent collections | State their documented scope. Recommend atomic map operations when they match the transition and a lock when an invariant spans multiple values or steps.                               | Addressed in draft   |
| `BlockingQueue` is not necessarily bounded.                                                                           | Concurrent collections               | Say that waiting behavior and capacity depend on the chosen operation and implementation. Use `ArrayBlockingQueue` only as a bounded example.                                           | Addressed in draft   |
| Parallel streams are presented too casually in many introductions.                                                    | Parallel computation                 | Use a pure reduction, list the suitability conditions, and state that `parallelStream()` does not promise faster execution.                                                             | Addressed in draft   |
| Structured concurrency is increasingly relevant to concurrent request handling.                                       | Scope                                | Omit it from the main draft because Java 25 ships its fifth preview and its API has changed across previews. Reconsider in a version-specific follow-up.                                | Deliberately omitted |

## Less-experienced reader

| Point of confusion                                                                             | Missing prerequisite                        | Proposed response                                                                                                                                                      | Decision           |
| ---------------------------------------------------------------------------------------------- | ------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------ |
| "Concurrency" and "parallelism" sound interchangeable.                                         | A minimal execution model                   | Explain overlapping progress versus simultaneous execution briefly, then use that distinction to separate waiting-heavy dashboard work from data-parallel computation. | Addressed in draft |
| A lambda may look as if it starts a thread.                                                    | Task versus execution mechanism             | Show the same task shape before introducing an executor and state that `Runnable` or `Callable` alone does not select a thread.                                        | Addressed in draft |
| Calling `get()` looks sequential even after two submissions.                                   | Submission order and waiting                | Point out that both tasks are submitted before either `get()`, so an executor capable of concurrent execution can let both make progress.                              | Addressed in draft |
| `synchronized`, `volatile`, `Lock`, and atomics may seem like interchangeable safety switches. | Atomicity, visibility, ordering             | Define the three questions first and attach each tool to the guarantee it provides.                                                                                    | Addressed in draft |
| A semaphore resembles a lock because both expose acquire/release operations.                   | Shared-state invariant versus permit policy | Explain that the example semaphore limits the number of calls; it does not make the dependency client or unrelated state safe.                                         | Addressed in draft |
| The large map may recreate the catalog problem.                                                | A learning order                            | Keep representative APIs under seven responsibility questions and end with a problem-to-tool table rather than additional type inventories.                            | Addressed in draft |
| The article reaches code before explaining who the map is for or what problem it solves.       | Introductory orientation                    | Add a compact pre-heading introduction that names the ordinary requirement, beginner scope, organizing thesis, and practical outcome before the dashboard example.     | Addressed in draft |

## Rejected objections

Record why an objection does not belong in this article rather than silently deleting it.

- A complete survey should cover every executor factory, synchronizer, queue, and
  lock implementation. Rejected because the article promises a beginner map, not
  an API reference. The official package documentation serves readers who need the
  full inventory.
- The article should benchmark platform threads, virtual threads,
  `CompletableFuture`, and parallel streams. Rejected because no representative
  workload was supplied. A synthetic comparison would invite conclusions that do
  not follow from the reader's workload or the documented contracts.
- The article should teach the full Java Memory Model before showing concurrency
  utilities. Rejected because the required ideas can be introduced through
  atomicity, visibility, ordering, and concrete happens-before guarantees. A formal
  treatment belongs in a separate article.
