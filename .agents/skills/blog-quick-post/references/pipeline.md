# Bounded quick-post pipeline

## Commission

Capture the smallest complete commission in `00-brief.md` and preserve raw input in
`01-raw-notes.md`:

- thesis or question and intended direction;
- target reader and desired outcome;
- structural style and writing tone;
- required examples, exclusions, sources, and approximate length;
- language and locale;
- image direction and whether concept development or generation is authorized;
- whether external research or code execution is authorized.

Ask only for information whose absence would materially change the article. Mark
reasonable low-risk defaults in the brief so Esteban can see them in the review
package.

## Adaptive team

Use subagents only after the commission is stable. Assign exclusive output files;
agents may read shared inputs but must not edit another agent's files.

For an ordinary post, use:

| Role         | Owns                                                              | Purpose                                                                             |
| ------------ | ----------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| Writer       | `02-outline.md`, `03-objections.md`, `05-seeds.md`, `06-draft.md` | Turn the commission and verified material into one coherent draft.                  |
| Reviewer     | `08-review.md`                                                    | Independently apply `STYLE.md` and `RUBRIC.md`; record exact evidence and blockers. |
| Image editor | `07-image-brief.md`                                               | Develop the article-specific hero direction under `IMAGE_GUIDE.md`.                 |

Add specialists only when needed:

- A research/claims agent owns `04-claims.md` when important external claims need
  verification. The writer must treat unresolved entries as unresolved.
- A code-verification agent may test executable examples or claimed results when
  they materially support the post. It returns evidence to the claims owner or
  orchestrator and never edits `04-claims.md` concurrently.

The orchestrator alone owns `status.yaml`, `00-brief.md`, `01-raw-notes.md`, and
`09-publish-checklist.md`, integrates outputs, resolves file conflicts, and prepares
the review package. If available concurrency is lower, preserve these role and file
boundaries while running the work sequentially.

## Bounded revision

After the first draft:

1. The reviewer reads the draft with fresh context and records findings.
2. The orchestrator sends concrete blocker and needs-attention findings to the writer.
3. The writer may perform one automatic revision pass.
4. The reviewer verifies only the affected findings and records the result.

Stop after that pass. Do not start an agent-to-agent loop. Put unresolved blockers,
missing evidence, and questions in the user-facing package.

## Review package

Present one compact package containing:

- proposed title, description, category, locale, slug, and draft status;
- the complete draft or a direct path plus a readable summary;
- outline and structural rationale;
- verified, inferred, opinion, and unresolved claims;
- exact LLM-pattern and rubric findings with their disposition;
- hero concept, generation/source status, crop constraints, and proposed alt intent;
- checks performed and remaining publication work;
- a precise approval request naming all artifacts covered.

If Esteban requests corrections, update the affected artifacts and return one revised
package. If further material corrections follow, continue interactively rather than
claiming the three-step fast lane is complete.

## Publication boundary

A bundled editorial approval can satisfy the six `status.yaml` approval fields. It
does not itself authorize copying into `src/content/posts`, setting `draft: false`,
committing, pushing, deploying, generating an image, or acquiring an external asset.
Each requested mutation must be supported by the user's current wording.
