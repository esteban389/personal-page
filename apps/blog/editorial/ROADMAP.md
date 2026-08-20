# Personal AI Editorial Stack roadmap

This roadmap introduces a repository-backed editorial workflow without turning
the blog into an autonomous publishing system. The repository holds durable
article state and approved artifacts; a chat remains the working interface;
Esteban remains responsible for claims, structure, voice, and publication.

## Principles

- One primary chat per article, with repository files as the source of truth.
- Human approval gates separate structural, factual, drafting, and publishing decisions.
- AI suggestions remain distinguishable from approved text.
- Deterministic scripts automate file creation and validation, not authorship.
- Finished content lives in `src/content/posts`; editorial artifacts do not ship with the site.
- Publication, commits, and pushes always require explicit authorization.

## Phase 1: Functional editorial foundation

Deliver the smallest complete workflow that can start and resume a real article.

### Scope

- Add repository-local `blog-editorial` and `blog-image-concept` skills with stage
  and safety rules.
- Add versioned writing guidance in `STYLE.md` and `RUBRIC.md`.
- Add templates for the brief, notes, outline, objections, claims, seeds, draft,
  image brief, review, and publication checklist.
- Require a passage-level LLM-pattern audit before review approval.
- Add `pnpm article:new <slug>` to create a complete article workspace safely.
- Add `pnpm article:check <slug>` to validate its structure and report its state.
- Document how to use the workflow from a primary article chat.
- Cover both commands with end-to-end tests through their CLI interfaces.

### Acceptance criteria

- A valid kebab-case slug creates one workspace with every expected artifact.
- Creation refuses invalid slugs and never overwrites an existing workspace.
- Validation reports the current stage and human approval state.
- Validation fails clearly when state or required artifacts are missing or inconsistent.
- New workspaces require explicit image approval before `publish-ready`.
- Generic LLM-pattern findings are recorded and resolved without detector scores,
  fake anecdotes, or cosmetic “humanization.”
- The skill can resume an article by reading repository state instead of relying on chat memory.
- Existing blog validation and builds continue to pass.

### Deliberately deferred

- Independent adversarial review automation
- Claim and source semantics beyond a human-maintained register
- Moving drafts into Astro content
- Link, final-image-file, code-snippet, Pagefind, and generated-route verification
- Autonomous loops, scoring, publication, commits, or pushes

## Fast lane: bounded AI-led authoring

The repository also provides an optional `blog-quick-post` lane for articles where
speed matters more than stage-by-stage participation. It reuses the Phase 1
artifacts, style guide, rubric, image guide, and six approval fields.

The fast lane accepts one commission, runs an adaptive writer/reviewer/image pipeline
with research or code specialists only when required, and presents one consolidated
review package. It permits at most one automatic revision pass and never runs an
unbounded agent loop. A single explicit decision may approve the six named editorial
artifacts, but publication and external actions remain separate permissions.

It also supports contextual samples for structural and writing styles and controlled
restyling of drafts or existing posts. Published content is imported into a workspace
and previewed before any source edit; locale, metadata, claims, code, links, dates,
attribution, and translations are preserved according to the restyle contract.

## Phase 2: Evidence and independent review

Strengthen factual integrity and give completed drafts a fresh-context review.

### Scope

- Add a read-only `blog-review` skill.
- Define claim states and evidence bases precisely.
- Validate unresolved or malformed claim-register entries.
- Add focused review routines for skeptical readers, lost readers, concrete
  grounding, terminology consistency, and unsupported claims.
- Produce structured `Blocker`, `Needs attention`, and `Pass` findings with exact locations.
- Add explicit state transitions for brief, outline, claims, draft, image, and
  review approval.

### Exit criteria

- A fresh chat can review an article using only its brief, evidence, draft, style,
  and rubric artifacts.
- Review findings never rewrite the draft automatically.
- An article cannot become review-approved while blocker findings remain open.

## Phase 3: Safe Astro publication bridge

Convert an approved editorial draft into a valid unpublished Astro post and verify
the production representation.

### Scope

- Add `article:prepare-publish <slug>` with a preview or dry-run mode.
- Generate or validate Astro frontmatter without silently changing prose.
- Copy approved content to `src/content/posts/<slug>.md` with `draft: true`.
- Validate hero-image paths, image alt text, headings used by the ToC, external
  links, code-fence languages, and editorial-comment removal.
- Run formatting, `pnpm check`, and `pnpm build`.
- Verify the generated route and Pagefind inclusion.
- Require explicit human approval before changing `draft` to `false`.

### Exit criteria

- Publication preparation is repeatable and refuses unresolved blockers.
- It cannot publish, commit, or push on its own.
- The production post passes the same checks as every other blog change.

## Phase 4: Workflow calibration

Refine the system from evidence gathered while publishing real articles.

### Scope

- Review at least three completed article workspaces.
- Update `STYLE.md` from observed writing rather than aspirational metrics.
- Remove stages or artifacts that create ceremony without improving the result.
- Add only the routines repeatedly requested in actual editing sessions.
- Add locale and translation metadata if multilingual publishing is being implemented.
- Define archival rules for abandoned, superseded, and published workspaces.

### Exit criteria

- The workflow reflects demonstrated writing habits.
- Each retained stage has a clear decision or verification purpose.
- Resuming an older article remains understandable without its original chat.

## Phase 5: Selective automation

Automate recurring mechanical work only after usage data demonstrates the need.

### Possible scope

- Broken-link and image checks across publish-ready articles
- Executable code-example verification where a suitable harness exists
- Non-blocking editorial reports in CI
- Article status summaries and stale-workspace reporting
- Optional bounded routines for repetitive editing passes

### Guardrails

- No automated thesis, final-voice, evidence-interpretation, or publication decisions.
- No unbounded agent loops or opaque numerical quality scores.
- CI must not fail because an intentionally incomplete editorial workspace exists.
- Every automated finding must identify its evidence and a concrete action.
