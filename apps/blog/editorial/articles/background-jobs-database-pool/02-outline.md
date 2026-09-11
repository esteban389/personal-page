# Revised outline

## Job and progression

Explain a real shared-resource failure and its mitigation through a friendlier first-person account. Source correction D overrides earlier mappings.

1. Opening: delayed averages and failed requests during weekend grading. Concrete stakes, no invented scene.
2. Why jobs stayed in the app: per-school deployment simplicity; explain shared Hikari connections once.
3. Partial first fix: note-level limits ten to two. A small table distinguishes grade changes, manual persistent section jobs and committee reports. Existing macro limit and sequential sketch prevent conflation.
4. Later report-path fix: shared eight-thread Spring executor, bounded in-memory queue500, batches4. Second sketch illustrates batch waiting. Existing database queue/dedup policies clearly retained. Configurable Hikari max24 is application-specific.
5. Recovery evidence: 15-minute observations, completed 135-student test, incomplete second test. Persistent course tests do not validate report recalculation; effects of individual changes not isolated.
6. Remaining work: modest emergency intervention, possible worker, grouped reads/batch writes to benchmark with correctness tests.

## Tone and boundaries

Friendlier reflective prose, fewer abstract labels and repeated disclaimers; preserve material caveats at the relevant decision. No dramatic filler or invented feelings.
Code sketches explain execution shape, not drop-in implementation.
No global two-connection guarantee, unbounded-final-executor implication or newly invented queue semantics.

## Conclusion closure

Return to next measurable work after restored availability: query work and correctness. Do not recap every heading or claim optimized performance.

- [x] Esteban approved this revised outline.
