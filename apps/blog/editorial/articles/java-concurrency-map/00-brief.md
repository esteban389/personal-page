# Article brief

## Working title

How Java's Concurrency APIs Fit Together

## Target reader

Java developers who are new to concurrency or who have encountered concurrency
APIs without yet developing a coherent mental model for how they relate.

## Assumed knowledge

- Basic Java syntax, methods, lambdas, and generic types.
- No prior knowledge of threads, synchronization, asynchronous programming, or
  the Java Memory Model.

## Reader outcome

After reading this article, the reader should:

- classify the main Java concurrency APIs by the responsibility they serve;
- distinguish a task from the mechanism that executes it;
- recognize when a problem concerns execution, results, shared-state safety,
  coordination, or parallel computation;
- use the map to choose what to learn or investigate next instead of memorizing
  a flat list of classes.

## Central thesis

Java concurrency becomes manageable when you first identify the problem you are
solving--executing work, obtaining results, protecting state, coordinating tasks,
or performing parallel computation--and only then choose an API.

## Why I care about this

Esteban likes the supplied reference's organization: it groups Java standard-library
types by the role they play. The article should preserve that organizing insight
without using the reference as a prose or section-by-section base.

## Personal experience or observation

No personal story, measured result, or production incident was supplied. Do not
invent one or imply that Esteban personally learned these lessons through a named
project. The article's original contribution should be its beginner-oriented
synthesis, distinctions, and examples.

## In scope

- English first; translation will happen only after the English article is finished.
- A conversational guided-map structure.
- A middle-ground length: more developed than a reference sheet, less exhaustive
  than a comprehensive concurrency handbook.
- Small semi-realistic scenarios and executable Java snippets.
- Broadly modern Java, favoring stable APIs and clearly labeling any preview API.
- The main groups: tasks, execution, results/composition, shared-state safety,
  coordination, concurrent collections, and parallel computation.
- Foundational concepts only where they explain the map: concurrency versus
  parallelism, races, atomicity, visibility, ordering, and happens-before.
- Technical verification against current official Java, OpenJDK, or JLS sources.
- Execution of important code examples in the available Java environment.
- Keep the research depth, but convert inline source links to rendered footnotes
  with the collected list at the end when preparing the final Astro post.
- A final edit and self-evaluation using the repository-local `no-ai-slop` skill,
  in addition to the mandatory blog LLM-pattern audit.

## Out of scope

- Treating the supplied reference as a base draft or copying its wording and order.
- An exhaustive inventory of every type in `java.util.concurrent`.
- A deep treatment of lock-free algorithms, the full Java Memory Model, reactive
  streams, framework-specific concurrency, or performance tuning.
- Presenting preview APIs as stable recommendations.
- Invented personal experience, benchmarks, or universal tool recommendations.
- Spanish translation during this review cycle.
- Hero-image generation or sourcing before Esteban selects a concept. Image
  ideation reopened during final publication preparation.

## Open questions

- Final title selected: "How Java's Concurrency APIs Fit Together."
- The revised `CompletableFuture` example now shows the approved dependency graph:
  profile and orders start independently, recommendations begin after profile
  completes, and the branches combine into the final dashboard.
- Whether structured concurrency merits a clearly labeled preview sidebar or
  should be omitted from this version.
- Hero concepts are now in development. Direction, final asset, crop checks, and
  alt text still require Esteban's approval before `publish-ready`.

## Approval checkpoint

- [x] Esteban approved this brief.
