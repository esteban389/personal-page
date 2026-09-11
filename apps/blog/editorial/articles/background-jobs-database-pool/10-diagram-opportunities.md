# Revised diagram opportunity

Uses blog-diagram-opportunities; source contract is 01-raw-notes D and revised draft. Prior legacy-path/unbounded-queue framing superseded.

## Selected: different triggers sharing database connections

- Decision: proposed D2 map, not rendered.
- Reader question: Which work uses each queue and execution limit before reaching the shared database pool?
- Claims: C02,C04–C09,C15,C22.
- Insertion: after paragraph ending “These weren't new features from the emergency fixes.” in “Giving the report calculation a shared limit.”
- Form: one application-instance boundary with three labeled branches. External MySQL.
- Elements: manual section trigger -> database-backed persistent job queue -> existing two shared macro slots -> sequential course calculation; grade changes -> database-backed note jobs -> concurrency reduced ten to two; committee report -> recalculate before report -> batches4 -> shared Spring executor with eight threads and bounded in-memory task queue500. All calculations plus ordinary HTTP database work use Hikari -> MySQL.
- Grouping: database queue storage distinct from report executor memory; diagram does not imply two physical persistent tables. Two macro slots shared across COURSE, TEACHER_SUBJECT_COURSE and TECHNICAL_PROGRAM_PERIOD. Show report generation as report-driven, not a persistent macro job.
- Evidence: user source review D1–D5; test scope D6.
- Change labels: existing macro limit and queue dedup/coalescing retained; first fix note limits; later fix report executor and Hikari configured application default max24.
- Non-goals: no implied specific incident causality, unlimited replacement queue, production-tested report path, queue-full rejection behavior or universal connection sizing.
- Accessibility: labels distinguish existing vs changed without color dependence. Alt intent: manual section, grade-change and report calculations use different queues and limits but share the database connection pool with HTTP requests.
- Caption intent: simplified resulting arrangement; production checks covered persistent course jobs, not report recalculation.
- Locale: English only; execution-paths.en.d2 if later authorized.
- Open decision: trigger table may already make the full map unnecessary. Favor a simpler shared-capacity visual if full map repeats too much detail.

## Rejected

Thread-multiplication before/after (no counts), performance chart (no benchmark), full debounce state machine (too detailed), diagram as hero (different purpose).

## Next action

Completed September 11 after explicit authorization to render, integrate and publish.
Selected the simpler shared-capacity visual to avoid repeating the trigger table.
The reader question is now: why does background execution affect API availability?
Background calculations and web requests both reach MySQL through one shared Hikari pool.
No queue topology, per-path test coverage or numerical connection reservation is implied.

Source: `apps/blog/diagrams/background-jobs-database-pool/execution-paths.en.d2`.
Asset: `apps/blog/public/images/posts/background-jobs-database-pool/execution-paths.en.svg`.
Rendered with D2 0.9.0, ELK, theme 0 / dark theme 200 through the pinned helper.
Embedded at the proposed insertion point in both the editorial draft and Astro post,
with descriptive alt text and a caption explaining competition for connections.
Shortened labels after mobile inspection so the shared-pool relationship stays legible.
