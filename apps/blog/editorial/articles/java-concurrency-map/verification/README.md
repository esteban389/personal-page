# Code verification

`ConcurrencyExamples.java` executes the dashboard with two submissions before
waiting and the contrasting immediate-`get()` version. It also executes the
one-stage `thenApply` transformation, the personalized-dashboard dependency graph,
the volatile dashboard publication, the atomic completion counter, the semaphore
acquire/release pattern, and the parallel sum of squares. The article may show
smaller excerpts, but their concurrency mechanisms must remain equivalent to this
source.

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
verification_dir="$(mktemp -d)"
javac -d "$verification_dir" apps/blog/editorial/articles/java-concurrency-map/verification/ConcurrencyExamples.java
java -ea -cp "$verification_dir" verification.ConcurrencyExamples
```

## Result

```text
All concurrency examples passed.
```

The exact compile and run commands were executed on 2026-08-20 after the
junior-reader revision. The source imports only JDK classes, compiles into an
isolated temporary directory, and completes with assertions enabled.

The first compilation exposed a harness-only generic mismatch: the stream of
`submit(completed::incrementAndGet)` calls produces `List<Future<Integer>>`, not
`List<Future<?>>`. The declaration was corrected before the successful run.

Generated `.class` files were removed after the run.
