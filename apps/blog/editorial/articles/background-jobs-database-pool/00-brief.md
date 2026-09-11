# Article brief

## Commission

Selected title: **Our Background Jobs Exhausted the Database Pool. Then the API Stopped Working.**
English architectural experience post for Java backend developers. Approximately 1000–1200 words, two incomplete illustrative Java sketches, anonymous schools. Java/Spring Boot/MySQL/Hikari may be named. Keep implementation specifics brief.

## Thesis and reader outcome

In-process background work shares database capacity with HTTP requests. Reducing note-job concurrency and bounding committee-report recalculation, alongside pool configuration, mitigated availability problems. Existing persistent queue policies were retained. Availability and query efficiency need separate evidence.

## Structure and tone

Incident-driven retrospective, now friendlier and less dense at the user's explicit request on 2026-09-10. Conversational, reflective, first-person, calibrated certainty, medium-to-low technical density; familiar verbs, contractions, a compact trigger table and fewer defensive asides. No invented humor, feelings, dialogue or lessons.
Opening: teachers waiting for averages, manual retries, other failures during weekend grading.
Ending: author revisits grouped reads/batch writes with a repeatable workload and correctness tests.

## Evidence contract

01-raw-notes.md D supersedes earlier A/B for caller identity and timeline. Source review is supplied by user, not independently conducted here.
Manual section job: persistent COURSE, sequential students, existing two macro slots shared across COURSE, TEACHER_SUBJECT_COURSE and TECHNICAL_PROGRAM_PERIOD.
First fix ada80b9b1: note-level batch size, parallel jobs and executor threads ten to two.
Later a2673b108: committee-report calculation private20 -> shared Spring executor eight threads, queue500, batches4; Hikari configurable default max24.
Persistent database queue and existing dedup/coalescing retained. Executor queue is bounded and in memory.
Production checks exercised persistent course path, not new committee-report path. No isolated contribution or speed comparison claimed.

## Scope and approval

Only editorial artifacts. Primary documentation may verify public APIs; incident claims retain supplied provenance. Java sketches are incomplete and not run.
Explanatory diagram brief retained and corrected, rendering deferred. Hero pending. No publishing, commits, pushes, deployment or Astro preparation.
This is a user-requested correction/restyle after the first package. The user accepted the revised package on 2026-09-10 subject to the final plural correction, now applied. Five editorial approvals are true; stage image, image approval false.

- [x] Esteban approved this revised brief, with the final macro-scope correction.
