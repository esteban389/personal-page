# Source notes

## E — Final scope correction and acceptance, 2026-09-10

Exact shared macro types supplied: COURSE, TEACHER_SUBJECT_COURSE and TECHNICAL_PROGRAM_PERIOD. Public wording is “other broad recalculation types.” This extends D3 and supersedes earlier two-type lists.
User said “other than that, let's proceed with the next step,” accepting the revised package subject to this correction. Applied before recording five editorial approvals. Hero selection/asset approval and publication remain separate.

## D — Source-inspection feedback supplied on 2026-09-10 (supersedes A/B)

This is user-supplied review of production callers and commits, not source inspection independently performed by this editorial task.

D1: The only production caller the review found for the private 20-thread calculation was committee-report generation, which recalculated the course before creating the report. The manual section endpoint instead created a persistent COURSE job, sequential internally.
D2: Replacement was Spring ThreadPoolTaskExecutor, eight threads and queue capacity 500, with student batches of four. Its in-memory queue was bounded. Persistent recalculation jobs were separately queued in the database.
D3: Two macro jobs per instance already existed. Commit ada80b9b1 reduced note-level batch size, parallel jobs and executor threads from ten to two. Later a2673b108 added the report executor/batches and Hikari configuration.
D4: Deduplication, debounce, coalescing and dirty/requeue semantics already existed and were retained; neither emergency commit introduced them.
D5: Hikari became configurable with a default maximum of 24 connections. This is the application's configured default, not Hikari's library default or a universal recommendation.
D6: Production validation exercised persistent sequential course jobs, not the newly batched committee-report path. No per-change causal effect isolated.
D7: User requests a friendlier, lighter read; previous draft felt heavy even to the author. Keep real first-person perspective, use simpler explanations, reduce audit-style caveats, preserve scope.

Exact D1 anchor: “The only production caller I found was committee-report generation: it recalculated the course before creating the report.”
Exact D6 anchor: “Production validation exercised the sequential persistent course jobs, not the newly batched committee-report path.”

Earlier notes below are historical input, not the current contract where D corrects them.

Conversation summaries are Derived from supplied input. Only quoted anchors are verbatim. Numbered source locators below refer to the user's two answer sets. Later details supersede initial generalizations. No production logs or code inspected here.

## A — Initial answers 1–10

A1: Colombian SIS recalculates category and overall averages for a term after grades change. Student, section, manual section, and school-wide periodic triggers; weekly frequency uncertain.
A2: Independent tenant deployments motivate keeping infrastructure small; do not repeat “exponentially” as a measured growth claim.
A3: Initial account described uncontrolled jobs and per-student concurrency; B1 supersedes its exact mechanics.
A4: Slow averages prompted manual retriggers; shared pool exhaustion caused endpoint failures.
A5: Logs showed acquisition failures, metrics implicated jobs, restart restored service until jobs resumed, fixes then monitored. “We” sometimes meant Codex assistance, not teammates.
A6: Legitimate work, excessive concurrency; no demonstrated leak.
A7: First job limit helped partially; more grading exposed remaining issues. MySQL process count, Max_used_connections and max_connections checked; pool configuration, algorithm and execution limits adjusted.
A8: Worker isolation and prefetch/grouping with virtual-thread calculation considered, not implemented. Weekend grading needs favored faster useful fix.
A9: Author did not build original job; investigated and implemented fix, still reassessing weeks later.
A10: Java/Spring Boot/MySQL/Hikari may be named. Anonymous schools and illustrative code accepted; diagram skills requested.

Exact A9 anchor: “i know that i probably would have commited similar mistakes since i was not very familiar with this type of parallel control problems”
Exact A8 anchor: “it was a sudden problem that surfaced a weekend and teachers needed to upload grades so i choose the faster yet useful enough solution”

## B1 — Detailed processing correction

Persistent COURSE job: students sequentially, every subject then overall course average per student.
Legacy/direct generation: private 20-thread pool replaced by batches of four via shared executor capped at eight; waits for batch completion.
Two macro jobs per Academic instance shared across course and teacher-subject-course jobs; two note-level jobs separately.
Production course tests exercised sequential persistent path.

Exact anchor: “There were two course-level paths, which should not be conflated:”
Exact anchor: “The persistent jobs exercised during the production test were sequential internally.”

## B2 — Trigger semantics

Different course jobs queue. Equivalent active course/period job returned, not duplicated. Note jobs coalesce; queued debounce refreshed; running job marked dirty then requeued. Active broader course job considered to cover note trigger; no separate job. These are reported semantics, not independent race-correctness verification.

Exact anchor: “persistent queueing with deduplication and coalescing”

## B3 — Pool sizing

Checked database-allowed capacity, increased usable pool capacity alongside execution limits; expected roughly two connections for those jobs. No exact settings given. Do not make a global connection ceiling from macro-job count.

## B4 — Reported monitoring after August 7 deployment

Roughly 15-minute comparison in two deployments: acquisition delays and Hikari timeouts disappeared; note reads responsive amid more traffic and hundreds of normal recalculations; no new save 500s or recalculation failures after stabilization.
School A: three confirmed course jobs, 135 students, 20 large reads; no connection waits/timeouts/5xx.
School B: stopped before completion because first course job slow; still progressing without failures or pool saturation.
Examined stale averages caught up; no evidence persisted grades deleted. Names intentionally omitted.

Exact anchor: “This confirmed that the immediate availability problem was mitigated. It did not prove every recalculation path was optimal.”

## B5 — Limits and reflection

No controlled equal-workload before/after benchmark. Possible legacy isolated-speed tradeoff is inference. Persistent loop was already sequential.
Still many granular reads/writes in nested loops; sometimes ambiguous terminal status; separate grade-sheet payloads around 10–11.5 MB.
Grouped reads/batch persistence need reproducible tests preserving transactional correctness. Workers considered with version alignment and global database pressure limits.

Exact anchor: “the fix restored stability by applying backpressure; it did not yet make recalculation intrinsically efficient.”

## C — Editorial decisions

Selected title: Our Background Jobs Exhausted the Database Pool. Then the API Stopped Working.
Catchier narrative accepted. 10 jobs/400 threads title abandoned without verified numbers.
Proceed to next quick-post step authorized; bundle approval and publication not authorized.

## Unanswered question

Was the private 20-thread pool constructed per invocation, and was that exact path confirmed active in the incident? Do not present either as established.
