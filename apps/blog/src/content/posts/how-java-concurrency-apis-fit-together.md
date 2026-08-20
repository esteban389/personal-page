---
title: "How Java's Concurrency APIs Fit Together"
description: 'A beginner-friendly map of Java concurrency APIs organized by the problems they solve.'
pubDate: '2026-08-20'
category: 'Technical Articles'
lang: 'en'
translationKey: 'java-concurrency-map'
heroImage: '../../assets/posts/java-concurrency-map/responsibility-cabinet-v1.png'
draft: false
syndication:
  dev:
    tags:
      - java
      - concurrency
      - programming
      - beginners
  medium:
    topics:
      - Java
      - Concurrency
      - Software Development
      - Backend Development
---

A concurrency problem can begin with an ordinary requirement: let two independent
operations make progress without forcing one to wait for the other. The requirement
is easy to state. Choosing among `Thread`, `ExecutorService`, `Future`,
`CompletableFuture`, locks, atomics, queues, and synchronizers is harder when they
look like competing answers to the same question.

These APIs answer different questions. Some describe work, some decide how it
runs, some represent results, and others protect shared state or coordinate tasks.
Grouping them by responsibility turns the standard library from a list of names
into a map.

We will build that map around a small customer-dashboard example, then use shorter
examples for the problems the dashboard does not cover. The examples assume basic
Java, not prior concurrency knowledge. Start with the responsibility the program
needs; choose the class after that.

## Start with a program that waits twice

Suppose an endpoint builds a customer dashboard from a profile and a list of recent
orders:

```java
var profile = loadProfile();
var orders = loadOrders();

return new Dashboard(profile, orders);
```

The code fragments below omit imports and surrounding class definitions when those
details do not affect the concurrency mechanism.

The second call starts after the first one returns. If the operations are independent
and spend most of their time waiting for remote services, that order leaves an
obvious opportunity: start both, then assemble the dashboard when both results are
available.

That small change already involves three separate responsibilities: describe each
operation, decide how to execute it, and obtain its result. The full map uses seven
questions:

| Question                            | Representative APIs                                      |
| ----------------------------------- | -------------------------------------------------------- |
| What work should happen?            | `Runnable`, `Callable<V>`                                |
| Where and how should it run?        | `Thread`, `Executor`, `ExecutorService`, virtual threads |
| How do I obtain or combine results? | `Future<V>`, `CompletableFuture<T>`                      |
| How do I protect shared state?      | `synchronized`, `volatile`, `Lock`, atomic variables     |
| How do I share data safely?         | `ConcurrentHashMap`, `BlockingQueue`                     |
| How do tasks coordinate?            | `Semaphore`, `CountDownLatch`, `CyclicBarrier`           |
| How do I divide computation?        | `ForkJoinPool`, parallel streams                         |

These groups overlap. `CompletableFuture`, for example, represents a result and can
also arrange dependent execution. Treat the groups as questions for locating a
problem rather than rigid boxes for classifying every type.

On a first pass, focus on tasks, executors, futures, and the shared-state sections.
Learn queues and semaphores as named solutions for handoff and limits. Leave
`CyclicBarrier`, fork/join, and continuation-scheduling rules as landmarks until a
program gives you one of those problems.

One vocabulary distinction will help throughout the map. Concurrent tasks make
progress during overlapping periods; they do not have to execute at the same
instant. Parallel work does execute at the same instant. A single CPU core can
interleave concurrent tasks, while parallel execution requires hardware resources
that can run work simultaneously. We will use concurrency for the waiting-heavy
dashboard and reserve parallel computation for a separate data-processing example.

## Tasks describe work

A task describes work. A thread is one possible execution mechanism.

Java's basic task interfaces make that separation visible. `Runnable` represents
an operation with no result,[^runnable-api] while `Callable<V>` returns a value and
may throw an exception.[^callable-api] Neither interface chooses the thread that
will run it. Their contracts only describe the operation.

```java
Runnable refreshCache = () -> cache.refresh();

Callable<String> loadProfile =
        () -> profileClient.fetchProfile(customerId);
```

Creating either value does not start the work. A caller could invoke `run()` or
`call()` directly, or it could hand the task to an executor. That later choice
determines the execution policy.

The code that describes a cache refresh stays unchanged whether the application
runs it immediately, schedules it in a pool, or starts a virtual thread for it.

Use `Thread` directly when the program intentionally owns one thread's identity or
lifecycle, such as naming it, installing its uncaught-exception handler, or joining
that specific thread. An executor is the better fit when thread creation,
scheduling, and lifecycle belong to an execution policy rather than the task
itself.[^thread-api]

## Executors decide how work runs

An `Executor` receives a `Runnable` and applies an execution policy. Its interface
separates task submission from details such as thread creation, reuse, and
scheduling. The `Executor` contract does not promise asynchronous execution: a
minimal executor is allowed to call `command.run()` in the submitting thread, while
other implementations create threads or reuse them from a pool.[^executor-api]

`ExecutorService` adds lifecycle operations and methods such as `submit`, which
returns a `Future`.[^executor-service-api] An application should close or shut down
an executor service when it no longer needs it. In modern Java, the interface is
`AutoCloseable`, so a try-with-resources block can own that lifecycle.

The executable examples target Java 21 or newer because they use virtual threads;
the responsibility map and the older APIs apply more broadly. Here is the dashboard
using one virtual thread per submitted task:

```java
Dashboard loadDashboard() throws Exception {
    try (var executor = Executors.newVirtualThreadPerTaskExecutor()) {
        Future<String> profile =
                executor.submit(this::loadProfile);
        Future<List<String>> orders =
                executor.submit(this::loadOrders);

        return new Dashboard(profile.get(), orders.get());
    }
}
```

Both tasks are submitted before the code waits for either result. Their executions
can therefore overlap when the executor can run them concurrently. Submission
alone is not a guarantee of overlap; the executor owns that policy and may be
constrained by available resources.

The following order prevents the two dashboard operations from overlapping:

```java
var profile = executor.submit(this::loadProfile).get();
var orders = executor.submit(this::loadOrders).get();
```

The first `get()` may block before the second line can submit `loadOrders`. Keep
the handles first and the waits after both submissions when the operations are
independent.

Virtual threads became a final feature in Java 21. They are `Thread` instances
scheduled by the JDK rather than permanent one-to-one wrappers around operating
system threads. They suit thread-per-task code with many concurrent operations that
often wait, which describes calls to remote services. They do not make CPU-bound
code run faster or make timing-dependent access to shared mutable state safe. JEP
444 also advises against pooling virtual threads.[^jep-444] Create one per task; use
a separate mechanism when a scarce resource needs a concurrency limit.

## Results can be waited for or composed

A `Future<V>` is a handle to a result that may not exist yet. `get()` waits when
necessary and then returns the value or reports the computation's failure. A
`Future` also exposes completion status and cancellation. Under the `Future`
contract, `cancel(...)` attempts cancellation; already-running work may continue,
depending on timing and whether the task responds to interruption.[^future-api]

The dashboard example uses two plain futures because its control flow is short:
submit two operations, wait for both, and build one value. The blocking `get()`
calls do not erase the earlier concurrency because both submissions already
happened.

`CompletableFuture<T>` becomes useful when later work should depend on earlier
results. It implements both `Future<T>` and `CompletionStage<T>`, which adds
operations for transforming and combining completed stages.

Start with one result and one transformation:

```java
CompletableFuture<String> profile =
        CompletableFuture.supplyAsync(this::loadProfile, executor);

CompletableFuture<String> label =
        profile.thenApply(name -> "Customer: " + name);
```

After `profile` completes normally, `thenApply` passes its result to the function
and produces another stage containing the label. No `get()` separates the two
steps.[^completable-future-api]

If we translated the earlier two-input dashboard directly, `CompletableFuture`
would mostly look like a syntax swap around the same fixed fan-out. Add one real
dependency instead: recommendations can start only after the profile is available,
while orders can still load independently.

```text
profile + orders ----------> dashboard -------------\
profile -------------------> recommendations --------+--> personalized dashboard
```

The code mirrors that dependency graph:

```java
try (var executor = Executors.newVirtualThreadPerTaskExecutor()) {
    CompletableFuture<String> profile =
            CompletableFuture.supplyAsync(this::loadProfile, executor);
    CompletableFuture<List<String>> orders =
            CompletableFuture.supplyAsync(this::loadOrders, executor);

    CompletableFuture<List<String>> recommendations = profile.thenCompose(
            loadedProfile -> loadRecommendations(loadedProfile, executor));

    CompletableFuture<Dashboard> dashboard =
            profile.thenCombine(orders, Dashboard::new);

    return dashboard.thenCombine(
                    recommendations,
                    (loadedDashboard, loadedRecommendations) ->
                            new PersonalizedDashboard(
                                    loadedDashboard.profile(),
                                    loadedDashboard.orders(),
                                    loadedRecommendations))
            .join();
}
```

The asynchronous suppliers receive the executor explicitly because
`CompletableFuture` async methods without one normally use
`ForkJoinPool.commonPool()`.[^completable-future-api]

`profile` and `orders` start independently. After `profile` completes normally,
`thenCompose` invokes the recommendation function and flattens the
`CompletableFuture` it returns. The first `thenCombine` builds a dashboard after
both independent inputs arrive. The second combines that dashboard with the
recommendations, and `join()` waits once at the request boundary.

Plain `Future` and `CompletableFuture` overlap, but they encourage different control
flow. Plain `Future` remains adequate for a short, fixed set of independent tasks
when the caller can submit them together and wait at one clear boundary. Completion
stages help when one result starts later work or several branches must converge.
The example stops at composition. Production code still needs an explicit policy
for errors, cancellation, timeouts, and executor ownership.

## Shared state has three separate questions

Choosing an executor does not make shared mutation safe. Imagine adding a counter
that every completed dashboard task increments:

```java
volatile int completed;

void markCompleted() {
    completed++;
}
```

The `volatile` declaration gives reads and writes memory-consistency guarantees,
but `completed++` is a compound read-modify-write operation. Two threads can read
the same value and both write the same incremented value, losing one update. The
Java Language Specification separates these memory actions,[^jls-memory-actions]
and the atomic package supplies operations that perform the complete update
atomically.

Shared-state safety involves three separate questions:

- **Atomicity:** must other threads observe a group of operations as one
  indivisible action?
- **Visibility:** when one thread writes a value, what guarantees that another
  thread sees it?
- **Ordering:** what constrains the order in which actions become observable across
  threads?

Consider a one-time handoff in which one thread publishes a dashboard and another
reads it:

```java
Dashboard publishedDashboard;
volatile boolean dashboardReady;

void publish(Dashboard value) {
    publishedDashboard = value;
    dashboardReady = true;
}

Dashboard readIfReady() {
    return dashboardReady ? publishedDashboard : null;
}
```

The dashboard write occurs before the volatile flag write in the publishing
thread. If another thread later reads `dashboardReady` as `true`, the Java Memory
Model's volatile happens-before rule makes the earlier dashboard write visible to
that reader.[^jls-happens-before] The flag does not lock either method or make a
compound update atomic.

`synchronized` can provide mutual exclusion for a critical section and a
visibility relationship around the same monitor. When one thread unlocks a
monitor, that action happens-before a later lock of the same monitor, so writes
before the unlock become visible through that synchronization relationship. The
`java.util.concurrent` memory-consistency summary also documents similar guarantees
for task submission, successful `Future.get()`, concurrent collections, and
synchronizers.[^juc-memory-consistency]

`volatile` provides visibility and ordering for reads and writes of one field. It
does not provide mutual exclusion around a sequence such as an increment. The
`Lock` interfaces provide explicit locking plus options such as interruptible or
timed acquisition and multiple conditions.[^lock-api] That flexibility comes with
explicit acquire/release code and does not make `Lock` an automatic upgrade over
`synchronized`.

For one independent counter, `AtomicInteger` matches the operation directly:

```java
AtomicInteger completed = new AtomicInteger();

Future<Integer> task =
        executor.submit(completed::incrementAndGet);
```

The `java.util.concurrent.atomic` package provides thread-safe read-modify-write
operations on single variables, including increment and compare-and-set.[^atomic-package]
One atomic variable does not make a multi-value invariant atomic. If a rule spans a
balance and a ledger entry, or requires several objects to change together, a lock
around the invariant or a design that avoids shared mutation may fit better.

## Concurrent collections protect documented operations

Shared data often needs more structure than one counter. Java supplies concurrent
maps, queues, deques, and other collections with documented safety and consistency
guarantees. That protection applies to their operations. It does not turn any
sequence written by the caller into one atomic action.

Consider a cache registration backed by a `ConcurrentHashMap`:

```java
if (!cache.containsKey(customerId)) {
    cache.put(customerId, loadCustomer(customerId));
}
```

Even with a concurrent map, another thread can change the map between the check and
the `put`. `ConcurrentMap` supplies compound operations such as `putIfAbsent`,
`compute`, and `merge` for transitions covered by their
contracts:[^concurrent-map-api]

```java
cache.computeIfAbsent(customerId, this::loadCustomer);
```

Use one of those operations when its documented semantics match the state change.
An invariant that spans several map entries or external side effects still needs a
larger design. `ConcurrentHashMap` documents the guarantees and restrictions of its
`computeIfAbsent` implementation.[^concurrent-hash-map-api]

`BlockingQueue` solves another shared-data problem: handing items from producers to
consumers.[^blocking-queue-api] Its operations let a producer fail immediately,
wait for space, or wait up to a timeout; a consumer has corresponding choices when
the queue is empty. Capacity depends on the implementation. `ArrayBlockingQueue` is
bounded, while other implementations may be unbounded or have different handoff
semantics.

```java
BlockingQueue<Job> jobs = new ArrayBlockingQueue<>(100);

jobs.put(new Job(customerId)); // waits when this bounded queue is full
Job next = jobs.take();        // waits when it is empty
```

The queue owns safe transfer of each element. The `Job` object may still need its
own safe design if producers and consumers mutate it after handoff.

## Coordination describes who may proceed

A two-request dependency limit is a coordination policy. A semaphore represents
that policy with permits:

```java
String fetchWithLimit(Semaphore permits, String requestId)
        throws InterruptedException {
    permits.acquire();
    try {
        return dependency.fetch(requestId);
    } finally {
        permits.release();
    }
}
```

Constructing `new Semaphore(2)` lets at most two successful acquisitions proceed
at once. The `finally` block returns the permit when the call completes or fails.
The virtual-thread executor used earlier creates a new virtual thread per task and
does not impose a thread-count bound. JEP 444 recommends keeping that model and
using a semaphore to represent the actual limit on a scarce service.[^jep-444]

Other synchronizers encode other policies. A `CountDownLatch` lets tasks wait until
a count reaches zero, which fits a one-time startup gate. A `CyclicBarrier`
coordinates a group that must all reach the same phase before continuing. A
`BlockingQueue` coordinates through data availability and capacity. The
`java.util.concurrent` synchronizer overview groups these APIs by
policy.[^juc-synchronizers]

These policies do not protect every object touched by the participating tasks. The
semaphore limits calls in the example; it says nothing about the thread safety of
`dependency` or other shared state. Use a synchronizer when the rule concerns who
may proceed, and analyze shared invariants separately.

## Parallel computation splits data or work

The dashboard spends time waiting. A sum over a large collection presents a
different problem: divide computation over data and combine the partial results.

`ForkJoinPool` is an `ExecutorService` built around work-stealing and tasks that can
split into smaller tasks. Its contract does not guarantee compensating threads for
blocked I/O or unmanaged synchronization.[^fork-join-pool-api] Do not treat a
fork/join pool as the default executor for many blocking network calls. It is a
better conceptual fit for decomposable computation than for replacing the
waiting-oriented dashboard executor.

Parallel streams expose data-parallel execution through the stream API:

```java
long sum = values.parallelStream()
        .mapToLong(value -> (long) value * value)
        .sum();
```

This reduction follows the `java.util.stream` requirements because the mapping is
stateless, it does not modify the source, and addition is
associative.[^stream-package] Those properties allow the stream implementation to
partition work and combine partial results safely. Stateful operations,
encounter-order requirements, coordination overhead, small inputs, and the
available processors can change the tradeoff. Calling `parallelStream()` does not
promise a speedup.

Measure a representative workload before choosing parallel execution for
performance. The appropriate comparison includes the real data size, operation
cost, ordering requirements, and environment. A tiny example can prove behavior;
it cannot establish that production code will run faster.

## Choose the responsibility before the class

Start with the sentence that describes the problem. Let the API name come second.

| Problem statement                                    | Useful starting point                                               | Check before committing to it                                      |
| ---------------------------------------------------- | ------------------------------------------------------------------- | ------------------------------------------------------------------ |
| "I need to represent work with or without a result." | `Runnable`, `Callable<V>`                                           | Who owns execution and failure handling?                           |
| "I need to run independent waiting operations."      | `ExecutorService`; often one virtual thread per task in modern Java | What owns the executor, and what limits scarce dependencies?       |
| "I need to retrieve one result later."               | `Future<V>`                                                         | Where will waiting happen, and what does cancellation really do?   |
| "I need to transform or combine dependent results."  | `CompletableFuture<T>`                                              | Which executor and error policy does each stage use?               |
| "Several tasks update one counter."                  | `AtomicInteger` or a lock                                           | Does the invariant extend beyond that variable?                    |
| "Several tasks share keyed state."                   | `ConcurrentHashMap` and its compound operations                     | Is the whole state transition covered by one documented operation? |
| "Producers hand work to consumers."                  | A suitable `BlockingQueue`                                          | Should capacity apply backpressure, and which operations may wait? |
| "Only N tasks may use a dependency."                 | `Semaphore`                                                         | Are permits always released, including on failure?                 |
| "I need to divide CPU-oriented computation."         | Fork/join or a parallel stream                                      | Is the work large, independent, non-interfering, and measured?     |

After choosing the responsibility, evaluate lifecycle, failure policy, workload,
contention, ordering, and resource limits before selecting the concrete API.

As a practice exercise, return to the dashboard and write five sentences before
changing its code: which operations are independent, what results they produce,
where waiting is acceptable, what state they share, and which dependency limits
must survive higher concurrency. Each answer points to one part of the map and to
the next piece of documentation or testing the program needs.

[^runnable-api]: [`Runnable` API documentation](https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/lang/Runnable.html)

[^callable-api]: [`Callable<V>` API documentation](https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/util/concurrent/Callable.html)

[^thread-api]: [`Thread` API documentation](https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/lang/Thread.html)

[^executor-api]: [`Executor` API documentation](https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/util/concurrent/Executor.html)

[^executor-service-api]: [`ExecutorService` API documentation](https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/util/concurrent/ExecutorService.html)

[^jep-444]: [JEP 444: Virtual Threads](https://openjdk.org/jeps/444)

[^future-api]: [`Future<V>` API documentation](https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/util/concurrent/Future.html)

[^completable-future-api]: [`CompletableFuture<T>` API documentation](https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/util/concurrent/CompletableFuture.html) and [`CompletionStage<T>` API documentation](https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/util/concurrent/CompletionStage.html). The `CompletableFuture` policy section also explains that non-async dependent actions may run in the thread that completes the current stage or another caller of a completion method.

[^jls-memory-actions]: [Java Language Specification, §17.4.2: Actions](https://docs.oracle.com/javase/specs/jls/se25/html/jls-17.html#jls-17.4.2)

[^jls-happens-before]: [Java Language Specification, §17.4.5: Happens-before Order](https://docs.oracle.com/javase/specs/jls/se25/html/jls-17.html#jls-17.4.5)

[^juc-memory-consistency]: [`java.util.concurrent` memory-consistency properties](https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/util/concurrent/package-summary.html#MemoryConsistency)

[^lock-api]: [`Lock` API documentation](https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/util/concurrent/locks/Lock.html)

[^atomic-package]: [`java.util.concurrent.atomic` package documentation](https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/util/concurrent/atomic/package-summary.html)

[^concurrent-map-api]: [`ConcurrentMap` API documentation](https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/util/concurrent/ConcurrentMap.html)

[^concurrent-hash-map-api]: [`ConcurrentHashMap` API documentation](https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/util/concurrent/ConcurrentHashMap.html)

[^blocking-queue-api]: [`BlockingQueue` API documentation](https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/util/concurrent/BlockingQueue.html)

[^juc-synchronizers]: [`java.util.concurrent` synchronizer overview](https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/util/concurrent/package-summary.html#Synchronizers)

[^fork-join-pool-api]: [`ForkJoinPool` API documentation](https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/util/concurrent/ForkJoinPool.html)

[^stream-package]: [`java.util.stream` package documentation](https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/util/stream/package-summary.html)
