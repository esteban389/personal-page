# Acceptance and final correction — 2026-09-10

The user accepted the revised package subject to the plural macro-scope correction. Applied “other broad recalculation types” in the draft; claims and diagram now record COURSE, TEACHER_SUBJECT_COURSE and TECHNICAL_PROGRAM_PERIOD. This local correction preserves tone and introduces no new LLM-pattern finding. Brief, outline, claims, draft and review approvals are true; image remains false. Prior approval-state statements below are historical.

# Independent editorial review

## Current review — 2026-09-10

This review supersedes the 2026-09-09 assessment below. The previous review relied
on the earlier supplied account and did not establish correct caller identity,
the executor queue configuration, or the exact change chronology. Its finding
dispositions must not be treated as verification of the revised facts.

Reviewed current 06-draft.md against 00-brief.md, 01-raw-notes.md section D and
04-claims.md. Reapplied the previously read STYLE, TONE_AND_STRUCTURE, RUBRIC and
no-ai-slop skill/eval. No production/source audit, external research or code tests
were performed by this reviewer. D remains user-supplied source-inspection evidence.

### Factual review

No material factual findings remain within the supplied evidence boundary.

| Corrected issue                  | Current draft evidence                                                                                                                                             | Disposition |
| -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------- |
| Report versus manual execution   | Trigger table assigns private 20-thread calculation to committee-report generation and sequential persistent work to the manual section button.                    | Pass        |
| Executor versus persistent queue | Shared Spring executor has eight threads and queue capacity 500; database job queue is explicitly separate. No unbounded replacement claim remains.                | Pass        |
| First versus existing limits     | First fix reduces note batch size, parallel jobs and executor threads ten to two. The two-macro-job limit is expressly pre-existing.                               | Pass        |
| Existing coalescing              | Persistent duplicate-job reuse and dirty/requeue behavior are retained, not credited to emergency commits.                                                         | Pass        |
| Hikari default                   | Twenty-four is explicitly a maximum configured by the later application change, not the library default or universal sizing advice.                                | Pass        |
| Production validation            | Persistent sequential jobs were exercised; the draft explicitly says the committee-report batching was not validated and per-change effects were not isolated.     | Pass        |
| Other evidence boundaries        | Incomplete second test and absent comparable speed benchmark remain explicit. No thread multiplication, leak, global two-connection guarantee or measured speedup. | Pass        |

The snippets remain architecture sketches with stated omissions. The bounded
executor's rejection policy is not supplied or asserted. No extra policy or
transaction behavior should be inferred from the code examples.

### Current mandatory LLM-pattern audit

| Passage                                                                           | Pattern checked                           | Disposition                                                                                                                                       |
| --------------------------------------------------------------------------------- | ----------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| “Teachers were entering grades, but the averages were taking too long to update.” | Generic opening or fabricated scene       | Pass: supplied concrete symptoms; no invented dialogue or emotion.                                                                                |
| “Wait too long, and they failed.”                                                 | Decorative fragmentation                  | Preserve: short plain explanation immediately follows the full pool/wait condition. It introduces no new failure mechanism.                       |
| “They didn't all run the same code”                                               | Faux-insight setup or empty metadiscourse | Preserve: directly introduces the useful trigger/path table correcting prior conflation.                                                          |
| “Calling everything ‘the course job’ hid that difference.”                        | Interpretive metadiscourse                | Preserve: identifies the naming ambiguity that caused the earlier account to mislead; no claim that Esteban used that phrase during the incident. |
| “I could have made similar mistakes”                                              | Counterfeit humility/personality          | Pass: directly derived from A9.                                                                                                                   |
| “These weren't new features from the emergency fixes.”                            | Repetitive negative contrast              | Preserve: necessary chronology correction, stated once.                                                                                           |
| “That still leaves plenty to improve.”                                            | Empty significance/general transition     | Preserve: short transition immediately grounded in nested student/subject reads and writes; no rhetorical emphasis or unsupported result.         |
| “I want a repeatable workload”                                                    | Generic recap or invented next action     | Pass: supplied benchmark intention closes on measurable work and grade correctness.                                                               |

Full audit: no material generic stakes, inflated vocabulary, empty significance
claims, repeated binary formulas, faux authority, rhetorical questions, excessive
em dashes, superficial trailing analysis, robotic triads, decorative formatting,
or recap ending. The trigger table earns its symmetry through distinct runtime
paths. Sentence lengths and section density vary naturally; longer monitoring
sentences carry necessary measurements. The friendlier wording uses contractions
and familiar verbs without inventing jokes, feelings or expertise.

No-ai-slop eval: preservation of meaning and supported first-person perspective,
proportional simplification, concrete opening, direct verbs, useful detail,
cadence, vocabulary and pattern checks all pass for this revision. This is review
mode, so no independent draft rewrite is required. Whether the voice feels right
remains Esteban's decision; no detector score or authorship claim is used.

### Current rubric

| Criterion                           | Result  | Basis                                                                                             |
| ----------------------------------- | ------- | ------------------------------------------------------------------------------------------------- |
| Thesis and reader outcome           | Pass    | Shared capacity and separate stability/efficiency questions remain clear.                         |
| Original contribution               | Pass    | Personal partial fix, deployment constraint and bounded observations.                             |
| Technical grounding                 | Pass    | Corrected path/configuration mapping, explicit test and snippet limits.                           |
| Structure                           | Pass    | Symptoms, limited first fix, path map, later change, verification, remaining work.                |
| Tone contract                       | Pass    | Friendlier plain reflective prose, traceable first person and calibrated certainty.               |
| Concrete grounding                  | Pass    | Runtime paths and supplied counts explain the decisions.                                          |
| Voice                               | Pass    | Lighter without manufactured personality or excessive defensive asides.                           |
| Authorship and generic LLM patterns | Pass    | Current mandatory audit complete; no material findings.                                           |
| Factual and source integrity        | Pass    | Based on corrected user-supplied account; no independent production verification implied.         |
| Publication readiness               | Blocker | Human approval, final hero asset/crop/alt and later Astro/route/search validation remain pending. |

### Current approval status

- [x] Revised factual boundaries independently reviewed against supplied notes.
- [x] Current mandatory LLM-pattern audit complete.
- [x] No unresolved material draft findings.
- [ ] Esteban approved the revised brief, outline, claims, draft, image and review.
- [ ] Publication gates complete.

All artifact approvals remain false. No additional automatic revision requested.

## Superseded review — 2026-09-09

Reviewed 2026-09-09 against source notes, brief, outline, objections, claims, seeds,
draft, diagram opportunity brief, STYLE, RUBRIC, TONE_AND_STRUCTURE, and the
no-ai-slop skill and eval. Operational evidence is author-supplied. Public API
links were checked by the coordinating writer. This reviewer did not independently
audit those sources, production code or telemetry, or run the incomplete Java samples.

## Tone and structure contract

Working references: 00-brief.md and 02-outline.md. Both remain proposed, not
approved. The incident-driven conversational retrospective fits the supplied
experience: first-person investigation, calibrated certainty, neutral emotion,
medium technical density, no manufactured humor.

| Location                 | Contract                                                 | Evidence                                                                 | Required action                                                                    | Status                        |
| ------------------------ | -------------------------------------------------------- | ------------------------------------------------------------------------ | ---------------------------------------------------------------------------------- | ----------------------------- |
| Investigation transition | Do not establish exact legacy-path incident contribution | C16 and final raw-notes question remain unresolved                       | R1: distinguish a path bounded during the fix from an independently isolated cause | Resolved in targeted revision |
| Pool-sizing paragraph    | Historical reasoning needs provenance                    | B3 supplies capacity checks, not an explicit capacity-reservation policy | R2: remove attributed sizing intention or state a general technical limitation     | Resolved in targeted revision |

## Resolved draft findings

**R1 — Factual boundary, investigation transition.** “The remaining concurrency
problem surfaced” followed by “There was also concurrency inside a separate
calculation path to account for” and the legacy-pool description makes that path
read as the established explanation for the recurrence. The record leaves its
exact involvement unanswered. Name it as another path bounded during the fix and
state that the results cover combined changes, without isolating its contribution.
Narrower wording can resolve this without another interview.

**R2 — Historical intent, pool sizing.** “The database ceiling constrained that
decision; it was not a target for every application pool to consume” attributes a
specific sizing policy that B3 does not establish. Keep the observed capacity
checks and adjustment; remove the historical-policy clause or explicitly frame
a general limitation. Preserve the separate rejection of a global two-connection
guarantee.

Targeted verification: R1 is resolved by “The legacy path's exact contribution to
the incident remains uncertain” and the explicit distinction between changes made
and persistent-path checks. Investigation now says the legacy concurrency was
bounded during the fix rather than identifying its contribution as established.
R2 is resolved by removing the attributed sizing policy and retaining observed
checks plus the limited meaning of macro-job slots. No new material pattern arose
in these revisions. No further revision requested.

## Remaining publication blocker

**Publication gate.** Hero asset/crop/alt, human artifact approvals, Astro checks,
build and route/search verification remain incomplete. These are workflow gates,
not draft defects, and are outside this review's validation scope.

## Needs attention

No additional material issues. Do not expand this into a scheduler implementation
guide to answer hypothetical race questions. Hero and diagram remain proposals;
the diagram brief correctly excludes unsupported before-state multiplication.

## Mandatory LLM-pattern audit

| Location                        | Identifying passage                                                             | Finding and action                                                                                    | Status   |
| ------------------------------- | ------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- | -------- |
| Opening                         | “Teachers were waiting for averages to update.”                                 | Concrete supplied symptom and escalation; no generic scene-setting or article announcement. Preserve. | Pass     |
| Investigation, original wording | “the remaining concurrency problem surfaced”                                    | Polished causal certainty obscured C16's boundary. R1 now explicitly preserves uncertainty.           | Resolved |
| Pool sizing, original wording   | “it was not a target for every application pool to consume”                     | Unsupported historical judgment removed in R2.                                                        | Resolved |
| Path distinction                | “Treating both as ‘the course job’ would misrepresent the fix.”                 | Necessary interpretation of the author's later correction, not empty metadiscourse. Preserve.         | Pass     |
| Code explanation                | “Neither statement establishes a global backlog limit.”                         | Necessary active/pending-work distinction, not decorative contrast. Preserve.                         | Pass     |
| Result boundary                 | “I cannot claim that an individual course calculation became faster or slower.” | Preserves supplied absence of a controlled benchmark. Preserve.                                       | Pass     |
| Ending                          | “The next step is a reproducible benchmark”                                     | Concrete supplied action and correctness boundary; no recap or mic-drop. Preserve.                    | Pass     |

The full passage-level and structural audits found no material generic stakes,
empty significance claims, faux insight, weasel attribution, colon reveals,
superficial trailing analysis, fake-strong verbs, synonym cycling, negative lists,
decorative fragments, rhetorical questions, clustered em dashes, motivational
headings, repetitive triads, robotic section symmetry, or decorative formatting.
Paragraphs advance the incident or explain a specific control rather than portable
boilerplate. Necessary repeated terms preserve technical identities.

Long sentences were reviewed for readability rather than mechanically shortened.
Domain-context and monitoring sentences carry related specifics clearly.
First-person investigation, partial fix, humility, weekend tradeoff and benchmark
intent trace to A5/A7–A9 and B5. No emotion, team member, joke, quote or expertise
was invented. R1/R2 are the material certainty/provenance findings.

### No-ai-slop eval disposition

- Editing principles: Pass for preservation, cadence, proportionality, concrete
  opening, active voice, structure and factual preservation after R1/R2.
- Vocabulary audit: Pass; no unsupported inflated vocabulary.
- Pattern audit: Pass after resolving the two certainty/provenance findings. Useful
  caveats and execution distinctions are preserved.
- Final read: Checked directly against eval; technical colleague register with
  no artificial personality or detector scoring. Author recognition remains for
  Esteban to judge. Detect/review mode does not require rewriting the draft here.

## Rubric

| Criterion                           | Result  | Basis and next action                                                              |
| ----------------------------------- | ------- | ---------------------------------------------------------------------------------- |
| Thesis and reader outcome           | Pass    | Shared capacity, distinct controls and unmeasured efficiency are clear.            |
| Original contribution               | Pass    | Partial diagnosis, deployment constraint and bounded observations are specific.    |
| Technical grounding                 | Pass    | R1/R2 resolved; execution shapes and incomplete-code labels sound.                 |
| Structure                           | Pass    | Symptoms, mechanism, controls, measured scope and remaining work advance in order. |
| Tone contract                       | Pass    | R2 resolved; first-person judgments are traceable to supplied material.            |
| Concrete grounding                  | Pass    | Counts, execution shapes and limits carry the explanation.                         |
| Voice                               | Pass    | Direct, calibrated, source-derived; title does not force invented drama.           |
| Authorship and generic LLM patterns | Pass    | Audit complete; R1/R2 resolved without fabricated personality.                     |
| Factual and source integrity        | Pass    | R1/R2 resolved; no invented metrics, thread totals, leak or speedup.               |
| Publication readiness               | Blocker | Hero, approvals and later content validation remain pending.                       |

## Rejected findings and rationale

- Eight threads are not claimed to bound the whole queue. The draft distinguishes
  workers from pending work; the coordinator runs outside the shared executor.
- Error handling, cancellation, transactions and lifecycle are explicitly omitted.
  The snippets illustrate architecture and make no compilation or production claim.
- Persistent sequential processing, legacy batches and macro/note limits remain
  distinct. Tested paths and the unfinished second test are identified.
- Coalescing describes reported transitions without claiming all races safe, a
  finite queue or that every control shipped together. Omitting broader-course
  coverage avoids expanding into unverified race analysis.
- The user-selected title describes the supplied outage. No unsupported
  10-job/400-thread arithmetic remains.
- The ending separates availability from query cost and claims neither measured
  slowdown/speedup nor a deployed worker redesign.

## Approval checkpoint

- [ ] The tone and structure contract is satisfied, or every deviation was explicitly accepted by Esteban.
- [x] The mandatory LLM-pattern audit is complete.
- [x] Material LLM-pattern findings are resolved or explicitly accepted by Esteban.
- [ ] All blockers are resolved.
- [ ] Esteban approved the reviewed draft.

All full-artifact approvals remain false. One targeted revision was used for
R1/R2; resolving them does not grant approval. Draft findings are closed; the
unchecked blocker item refers to remaining publication gates.
