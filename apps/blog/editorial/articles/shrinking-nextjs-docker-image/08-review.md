# Editorial review

This is the independent quick-post review of the first draft, verification of the
writer's single revision pass, and a bounded re-review after Esteban supplied the
rollout results and scope decision. Findings use the current proposed brief and
outline as the contract.

## Tone and structure contract

- Brief reference: `00-brief.md`, especially the revised central thesis, supplied
  decision and deployed results, evidence boundary, and conclusion contract at
  lines 25-33, 58-70, and 109-125.
- Outline reference: `02-outline.md`, especially the revised progression, chosen
  boundary, rollout-results section, and conclusion closure at lines 23-47,
  129-171.
- Structural fit: the incident-driven case study with a bounded
  problem-and-solution transition fits the supplied experience. The personal
  narrative is supported by `01-raw-notes.md`; it is not decorative or invented as
  a prerequisite for the technical material.

| Location                                           | Contract                                                                                                                      | Evidence                                                                                                                                                                                                                                                                                                                                                                    | Required action                                                                                  | Status |
| -------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ | ------ |
| Draft title, line 5                                | User-directed framing, calibrated evidence, and anonymization                                                                 | Esteban explicitly replaced the title with “Why Our Next.js Deployments Took 30 Minutes” on 2026-08-28. “Our” now has direct authorial provenance, and 30 minutes is the supplied upper bound of the observed 18–30 minute range. The article still names other possible contributors and treats the image as the largest identified bottleneck rather than the sole cause. | Preserve the exact user-supplied title and the causal boundaries in the body.                    | Pass   |
| Opening, lines 7-24                                | Concrete incident, supplied first-person experience, then investigation                                                       | The duration, dread, batching behavior, junior context, and direct Node.js workflow all trace to `01-raw-notes.md`. The opening establishes the reader promise before Docker details.                                                                                                                                                                                       | Preserve the concrete opening during revision.                                                   | Pass   |
| Full-image mechanism, lines 26-52                  | Scope the SSH transfer to the inspected incident rather than current or universal Jenkins behavior                            | “The inspected deployment job” and “In this incident” correctly attribute the supplied `docker save ... \| ssh ... docker load` mechanism. Lines 44-52 explicitly retain other bottlenecks and distinguish registry-based pipelines.                                                                                                                                        | Preserve this scope. Do not rewrite it as the repository's current general deployment mechanism. | Pass   |
| Backend comparison, lines 37-41                    | Use backends as an investigative clue, not an equivalence claim                                                               | The revision states impersonally that different runtime stacks need not produce equal image sizes and limits the comparison to an investigative clue.                                                                                                                                                                                                                       | None.                                                                                            | Pass   |
| Old-image diagnosis, lines 53-90                   | Explain the broad final-stage copy with a simplified, non-proprietary skeleton                                                | The skeleton remains explicitly simplified, the broad copies match C-05, and the size breakdown matches C-06. The unsourced collective mental state was replaced with the direct conclusion that the build workspace had become the runtime contract.                                                                                                                       | None.                                                                                            | Pass   |
| Standalone explanation, lines 92-135               | Show the verified structural change without turning an unverified explanation into fact                                       | The revision now states only the observed `.next/standalone` output used by the final stage. It no longer expands the commit evidence into an unsourced explanation of tracing internals.                                                                                                                                                                                   | None.                                                                                            | Pass   |
| Replacement skeleton and explanation, lines 97-131 | Simplified code must remain faithful to the verified production structure and must not be presented as tested executable code | The configuration now uses the evidenced CommonJS shape. The skeleton copies the three verified runtime paths without invented `--chown` behavior, retains `USER node`, and remains explicitly labeled as simplified and not the production file.                                                                                                                           | None.                                                                                            | Pass   |
| Validation, lines 137-160                          | Distinguish successful runtime-path validation from exhaustive validation and later operational results                       | The draft names the exercised login/navigation path, observed error classes, and explicit limits. It does not confuse this local correctness check with the later tenant deployment observations.                                                                                                                                                                           | None.                                                                                            | Pass   |
| Scope decision, lines 162-171                      | Preserve Esteban's supplied decision without turning it into a universal recommendation                                       | “I chose not to start there” follows Esteban's post-review correction. The draft explains the tenant-specific organizational boundary and largest identified bottleneck as the reasons for this case; it does not recommend that other teams avoid workflow changes.                                                                                                        | None.                                                                                            | Pass   |
| Rollout results, lines 173-181                     | Treat C-13, C-14, and C-18 as approximate operational observations across different workflows                                 | Both ranges use “roughly,” “approximately,” or “a few seconds.” The next paragraph explicitly says they are not controlled benchmarks, that workflows and conditions differ, and that only one variable must not be assumed. “A material cost” does not claim image size was the only bottleneck.                                                                           | None.                                                                                            | Pass   |
| Scope and causality, lines 164-181                 | Preserve C-19/C-20 as supplied judgment and retain alternative contributors                                                   | The selected boundary and “largest bottleneck we had identified” trace to Esteban's correction. Earlier lines 43-51 still list other contributors and registry behavior; the rollout paragraph does not erase those boundaries.                                                                                                                                             | None.                                                                                            | Pass   |
| Conclusion, lines 183-202                          | Close the batching tension with deployed but qualified results and the inspect/minimize/test rule                             | The conclusion reports both approximate workflow ranges, does not normalize tenant conditions, and ends with the concrete possibility that another pipeline stage becomes dominant.                                                                                                                                                                                         | None.                                                                                            | Pass   |
| `03-objections.md`, line 9                         | Review-package artifacts must remain readable and reconstructable                                                             | The command's literal pipe is now escaped as `\|`, so the Markdown table remains structurally valid.                                                                                                                                                                                                                                                                        | None.                                                                                            | Pass   |
| `04-claims.md`, C-03 and C-13/C-14/C-18/C-19/C-20  | Claim register integrity and Markdown validity                                                                                | C-03's literal pipe is escaped as `\|`, leaving the six-column table valid. C-13 records deployment, C-14/C-18 record separate observed ranges, C-19 records Esteban's decision, and C-20 records his largest-identified-bottleneck judgment. The unresolved-evidence notes retain the benchmark and sole-cause limits.                                                     | None.                                                                                            | Pass   |
| `09-publish-checklist.md`, proposed description    | First-person judgments and decisions require supplied provenance                                                              | The description now says “why the shared image was optimized without redesigning tenant workflows.” This neutral construction preserves the supplied scope decision without assigning it to an unsupported collective.                                                                                                                                                      | None.                                                                                            | Pass   |

## Mandatory LLM-pattern audit

| Location            | Pattern                                                         | Why it is generic here                                                                                                                                                                                                                                                                                 | Required action | Status |
| ------------------- | --------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------- | ------ |
| Opening, lines 7-24 | Generic stakes / throat clearing                                | The draft begins with the observed duration and behavior rather than announcing Docker optimization as an important topic.                                                                                                                                                                             | None.           | Pass   |
| Lines 21-23         | Former binary contrast and mild reveal                          | The revision directly connects inspection of the deployment path to measuring the shipped artifact. The dramatic contrast and premature complete-answer implication are gone.                                                                                                                          | None.           | Pass   |
| Line 90             | Former repeated negative contrast                               | The revision states the mechanism directly: “the build workspace had become the runtime contract.” It no longer assigns an unsourced collective thought.                                                                                                                                               | None.           | Pass   |
| Lines 137-160       | Necessary technical contrasts                                   | “Size alone was not enough” and the two questions answered by size versus an authenticated flow distinguish separate validation boundaries. They perform reasoning and should not be removed merely because they are symmetrical. The unsupported “easily” qualifier is gone.                          | None.           | Pass   |
| Lines 162-181       | Binary contrast, counterfeit voice, and evidence-free authority | “Changing the deployment workflow was technically possible. I chose not to start there” states a real supplied decision and its case-specific constraints. It is not a generic “not X, but Y” insight or universal prescription. The largest-bottleneck judgment has explicit Esteban provenance.      | None.           | Pass   |
| Lines 173-181       | Symmetrical numbers and certainty                               | The two before/after pairs are repeated structure because two distinct tenant workflows were observed. Approximate wording and the controlled-benchmark caveat prevent the symmetry from implying equivalent conditions.                                                                               | None.           | Pass   |
| Lines 190-202       | Three-item structure and ending                                 | The numbered inspect/minimize/test list is deliberate symmetry required by the conclusion contract. Repeating both rollout ranges closes the opening with the supplied result rather than recapping every heading. The final sentence names a concrete future observation instead of a generic kicker. | None.           | Pass   |
| Whole revised draft | Portability, formatting, robotic rhythm, and vocabulary audit   | No new generic scene setting, motivational headings, emoji, bold-sprinkling, weasel attribution, marketing vocabulary, excessive rhetorical questions, or generic recap ending was introduced. The new first-person decision and operational results are article-specific and source-traceable.        | None.           | Pass   |

## Blockers

None after the metadata correction.

## Needs attention

None after the metadata correction and mechanical claim-register formatting.

## Final package status

The editorial package has no remaining blocker or needs-attention finding from
this independent review. Human approval checkboxes remain unchanged.

## Passes

- The argument progresses cleanly from observed behavior, through transfer and
  artifact inspection, to implementation, runtime validation, the supplied scope
  decision, and two qualified rollout observations.
- The draft consistently distinguishes the supplied incident-specific SSH job from
  registry-based pipelines and other possible bottlenecks.
- The two before/after ranges remain approximate operational observations. The
  draft explicitly rejects a controlled cross-tenant comparison and does not imply
  identical conditions.
- The old-image sizes, new-image range, approximate ratio, local authenticated
  validation, supplied decision, and deployed observations remain within the claim
  register.
- The personal history in the opening is traceable to Esteban's verbatim notes and
  does not blame the unknown Dockerfile author.
- The opening promise and conclusion shape are article-specific. The final
  three-part list is earned by the incident rather than generic checklist padding.
- No active article, brief, outline, seed, or claim presents the rollout as pending
  or C-14 as untested. The old pending statement remains only inside the preserved
  initial source quotation in `01-raw-notes.md`; C-12's maintenance-branch status
  and the pending image concept are separate boundaries.

## Rejected findings and rationale

- Rejected: flag every “not X / Y” contrast. The distinction between image size and
  runtime correctness is the technical point, and the distinction between local
  validation and target deployment is an essential claim boundary.
- Rejected: remove the personal opening as irrelevant. It supplies the operational
  consequence and explains why an inherited Dockerfile stayed outside the author's
  attention until deployments became part of his work.
- Rejected: treat the retained historical sentence in the initial raw-note quotation
  as stale article prose. `01-raw-notes.md` preserves source chronology; the later
  verbatim correction supersedes it, and every active article artifact uses C-13,
  C-14, and C-18.
- Rejected: treat the two rollout ranges as a controlled comparison. The author
  explicitly supplied different workflow categories, and the draft keeps their
  conditions separate.

## Approval checkpoint

- [x] The tone and structure contract is satisfied, or every deviation was
      explicitly accepted by Esteban.
- [x] The mandatory LLM-pattern audit is complete.
- [x] Material LLM-pattern findings are resolved or explicitly accepted by Esteban.
- [x] All blockers are resolved.
- [x] Esteban approved the reviewed draft on 2026-08-28.

## Spanish translation review

- Source: `apps/blog/src/content/posts/shrinking-nextjs-docker-image.md`.
- Translation: `apps/blog/src/content/posts/es/una-imagen-docker-de-9-48-gb-en-un-despliegue-frontend-de-18-a-30-minutos.md`.
- Esteban requested the Spanish translation and subsequent push directly on
  2026-08-28.
- The translation preserves the six-section progression, four code fences,
  anonymization boundary, and every reported size and deployment-time range.
- The full-image transfer remains scoped to the inspected job. The authenticated
  flow remains a bounded runtime check, and the tenant results remain approximate
  operational observations rather than controlled benchmarks.
- The translation adds no personal event, technical claim, source, result, or
  conclusion absent from the approved English article.
- The Spanish no-AI-slop audit found no generic scene setting, motivational
  heading, counterfeit voice, evidence-free authority, decorative formatting, or
  recap ending introduced by the translation.
- No translation blocker remains.
