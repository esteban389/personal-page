# Structural outline

## Approved thesis

Java concurrency becomes manageable when you first identify the problem you are
solving--executing work, obtaining results, protecting state, coordinating tasks,
or performing parallel computation--and only then choose an API.

## Argument sequence

### 1. Start with a program that waits twice

- Purpose: Begin with a short pre-heading orientation that names the ordinary
  problem, beginner scope, and responsibility-based promise. Then introduce an
  endpoint that loads a profile and recent orders one after the other.
- Central claim: The library becomes easier to navigate when its types are grouped
  by responsibility rather than memorized as a flat catalog.
- Example or evidence: Three concise introductory paragraphs, a sequential
  dashboard loader, and a compact seven-part map.
- Transition earned by this section: Before choosing a tool, separate the work from
  the mechanism that runs it.

### 2. Tasks describe work

- Purpose: Introduce the first prerequisite without assuming thread knowledge.
- Central claim: `Runnable` and `Callable<V>` describe tasks; they do not select or
  start a thread.
- Example or evidence: A cache refresh as `Runnable` and a profile request as
  `Callable<String>`.
- Transition earned by this section: Once work is represented, an execution policy
  can decide where it runs.

### 3. Executors decide how work runs

- Purpose: Place `Thread`, `Executor`, `ExecutorService`, and virtual threads in the
  execution group.
- Central claim: Executors separate task submission from thread creation,
  scheduling, and lifecycle, but the `Executor` contract does not promise
  asynchronous execution.
- Example or evidence: The dashboard tasks are submitted before either result is
  requested, using a virtual-thread-per-task executor.
- Transition earned by this section: Submission produces handles to work that may
  still be running, which introduces result handling.

### 4. Results can be waited for or composed

- Purpose: Distinguish the roles of `Future` and `CompletableFuture` without
  presenting either as universally preferable.
- Central claim: `Future` supports waiting, retrieval, status, and attempted
  cancellation; `CompletableFuture` also models a graph of dependent stages.
- Example or evidence: The dashboard is first assembled from two `Future` values.
  The composition example then adds recommendations that depend on profile while
  orders remain independent, combines profile and orders into a dashboard, and
  joins once after the dashboard and recommendations converge.
- Transition earned by this section: Choosing an executor or result abstraction
  does not make shared mutations safe.

### 5. Shared state has three separate questions

- Purpose: Give beginners enough vocabulary to recognize races without attempting
  a full Java Memory Model tutorial.
- Central claim: Atomicity, visibility, and ordering are different concerns.
  `synchronized`, `volatile`, locks, and atomics provide different guarantees.
- Example or evidence: A completion counter; `volatile int` is rejected because
  `counter++` is a compound update; the executable `AtomicInteger` version is shown.
- Transition earned by this section: Protecting one variable still does not answer
  how shared data structures or multi-step state transitions should work.

### 6. Concurrent collections protect documented operations

- Purpose: Place concurrent maps and blocking queues without implying that their
  existence removes the need to reason about compound actions.
- Central claim: Concurrent collections specify thread-safe operations, but an
  arbitrary sequence of client calls is not automatically atomic.
- Example or evidence: Replace `containsKey` plus `put` with `putIfAbsent` or
  `compute`; use a `BlockingQueue` for producer-consumer handoff while noting that
  capacity depends on the implementation.
- Transition earned by this section: Safe storage and task coordination answer
  different questions.

### 7. Coordination describes who may proceed

- Purpose: Group synchronizers by the policy they express.
- Central claim: Semaphores, latches, barriers, and blocking queues coordinate
  tasks; they are not general replacements for locks around shared invariants.
- Example or evidence: A two-permit semaphore limits concurrent calls to a scarce
  dependency; brief scenarios place `CountDownLatch` and barriers.
- Transition earned by this section: The previous groups fit task-oriented and
  shared-state problems; data-parallel computation needs a separate branch.

### 8. Parallel computation splits data or work

- Purpose: Keep CPU-oriented parallel work distinct from the dashboard's waiting
  operations.
- Central claim: Fork/join and parallel streams help divide suitable computation,
  but `parallelStream()` does not promise a speedup.
- Example or evidence: A verified parallel sum of squares plus the requirements for
  non-interfering, stateless operations and associative reduction.
- Transition earned by this section: With every group placed, the reader can choose
  a starting point from the problem statement.

### 9. Choose the responsibility before the class

- Purpose: Turn the taxonomy into a usable decision aid.
- Central claim: The first useful question is about the responsibility at hand;
  workload, lifecycle, failure policy, contention, ordering, and resource limits
  narrow the choice after that.
- Example or evidence: A compact problem-to-tool table with one common mistake per
  group.
- Transition earned by this section: End with a concrete practice exercise that
  applies the map without restating every section.

## Concepts and prerequisites

- A task is a representation of work; a thread is an execution mechanism.
- Concurrency allows multiple tasks to make progress during overlapping periods.
  Parallel execution means work is running at the same instant. The article needs
  this distinction only to separate I/O-oriented task concurrency from CPU-oriented
  data parallelism.
- A race occurs when an outcome depends on timing between unsafely coordinated
  accesses to shared mutable state.
- Atomicity asks whether an operation is observed as one indivisible action.
- Visibility asks whether one thread is guaranteed to observe another thread's
  writes.
- Ordering asks which actions another thread is allowed to observe first.
- A happens-before relationship is the Java Memory Model guarantee used to connect
  actions across threads; the article should introduce it through concrete library
  guarantees rather than a formal derivation.

## Alternatives still under consideration

- Final title selected during the consolidated review: "How Java's Concurrency
  APIs Fit Together." Earlier alternatives retained for decision history:
  - Java Concurrency by Responsibility
  - How Java's Concurrency APIs Fit Together
  - Tasks, Results, State, and Coordination in Java
  - Choosing Among Java's Concurrency Tools
  - Start With the Problem: A Guide to Java Concurrency APIs
- `CompletableFuture` receives one verified dependency-graph example. A longer
  treatment of error handling, timeouts, and executor selection would unbalance
  this article.
- Inline source links remain in the editorial draft for verification. Converting
  them to end footnotes is deferred until final publication preparation.
- Structured concurrency is omitted. In Java 25 it remains a preview API, and a
  preview sidebar would add version caveats before beginners have learned the
  stable groups.
- Hero-image structure, sourcing, and generation remain deferred until the final
  publication stage at Esteban's request.

## Resolved publication decisions

- The conversational title was selected after comparing the alternatives.
- The approved publication draft retains the small examples and both dashboard
  variants at the reviewed middle-ground length.

## Approval checkpoint

- [x] Esteban approved this outline.
