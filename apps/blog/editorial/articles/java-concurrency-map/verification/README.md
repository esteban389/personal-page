# Code verification

`ConcurrencyExamples.java` executes the two dashboard variants, the atomic
completion counter, the semaphore acquire/release pattern, and the parallel sum
of squares. The article may show smaller excerpts of those examples, but their
concurrency mechanisms must remain equivalent to this source.

It also executes a personalized-dashboard dependency graph. Profile and orders
start independently on an explicit virtual-thread executor. Recommendations
start only after the profile completes: `thenCompose` flattens the helper's
returned `CompletableFuture`, while `thenCombine` joins the independent profile
and orders results and later combines that dashboard with the recommendations.
The completed graph is awaited once, at the method boundary.

The `Runnable`/`Callable`, cache, and blocking-queue fragments are contextual
illustrations. They omit application-specific types and are not executed by this
harness.

## Environment

```text
java version "25.0.4" 2026-07-21 LTS
Java(TM) SE Runtime Environment (build 25.0.4+7-LTS-189)
Java HotSpot(TM) 64-Bit Server VM (build 25.0.4+7-LTS-189, mixed mode, sharing)
```

## Command

```sh
javac apps/blog/editorial/articles/java-concurrency-map/verification/ConcurrencyExamples.java
java -ea -cp apps/blog/editorial/articles/java-concurrency-map/verification ConcurrencyExamples
```

## Result

```text
All concurrency examples passed.
```

The exact commands were run again on 2026-08-20 after adding the
personalized-dashboard dependency graph. The then-current source, which imports
only JDK classes, compiled and completed with assertions enabled. This
supersedes the reviewer's earlier observation of a transient unavailable
third-party import.

The first compilation exposed a harness-only generic mismatch: the stream of
`submit(completed::incrementAndGet)` calls produces `List<Future<Integer>>`, not
`List<Future<?>>`. The declaration was corrected before the successful run.

Generated `.class` files were removed after the run.
