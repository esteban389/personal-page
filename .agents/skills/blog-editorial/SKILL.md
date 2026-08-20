---
name: blog-editorial
description: Run Esteban's repository-backed editorial workflow for articles in apps/blog.
---

# Blog editorial workflow

Use this skill when Esteban asks to start, resume, structure, draft, or edit an
article for the blog. The repository is the durable source of truth; the chat is
only the working interface.

When Esteban explicitly asks for a fast, mostly AI-led post with one consolidated
review package, route to the repository-local `blog-quick-post` skill instead.

## Required context

Before changing an article:

1. Read `apps/blog/editorial/README.md` completely.
2. Read `apps/blog/editorial/STYLE.md` completely.
3. Read `apps/blog/editorial/RUBRIC.md` completely.
4. Read the article's `status.yaml` completely when its workspace already exists.
5. Read every article artifact needed for the requested stage completely.
6. Run `pnpm article:check <slug>` and report structural problems before editing.

For hero-image ideation or selection, use the repository-local
`blog-image-concept` skill. Image generation remains a separate explicit action.

Do not rely on memory or an earlier chat when repository artifacts are available.

## Starting an article

For a new article:

1. Derive or ask for a lowercase kebab-case slug when the user's wording does not
   establish one safely.
2. Run `pnpm article:new <slug>`.
3. Read the generated `status.yaml` and `00-brief.md`.
4. Place user-provided raw material in `01-raw-notes.md` without polishing away
   uncertainty, contradictions, or the user's original language.
5. Help complete the brief, but do not draft the article during ingestion.
6. Run `pnpm article:check <slug>` after edits.

Never overwrite an existing workspace or create a second slug for the same
article without telling Esteban.

## Resuming an article

For an existing article:

1. Read `status.yaml` to establish the current stage and approvals.
2. Read earlier approved artifacts that constrain the requested work.
3. Summarize the current thesis, stage, approvals, and unresolved decisions.
4. Continue only the requested stage. Do not silently advance the workflow.

## Stage contracts

### `brief`

- Clarify the reader, outcome, thesis, motivation, scope, and open questions.
- Preserve multiple thesis candidates when Esteban has not selected one.
- Do not produce an outline or draft unless explicitly requested.

### `ingestion`

- Treat `01-raw-notes.md` as source material, not publication-ready prose.
- Extract claims, examples, assumptions, contradictions, and open questions.
- Never invent personal experiences, motivations, or conclusions.

### `outline`

- Use the approved brief and raw notes.
- Make the argument sequence and purpose of each section explicit.
- Record skeptical and less-experienced-reader objections in `03-objections.md`.
- Keep unresolved structural alternatives visible until Esteban chooses.

### `evidence`

- Record important factual claims in `04-claims.md`.
- Distinguish official sources, source code, executable reproductions, personal
  observations, inferences, and opinions.
- Put unsupported additions under questions instead of inserting them as facts.
- Do not mark a claim verified merely because it sounds plausible.

### `seeds`

- Preserve Esteban's one-to-three anchor sentences for each planned section.
- Record expansion boundaries beneath each section.
- Do not replace seed claims with a more generic interpretation.

### `drafting`

- Draft one section at a time around approved seeds and evidence.
- Identify every newly introduced claim.
- Prefer asking what is missing over automatically expanding prose.
- Keep unresolved alternatives outside the publishable draft.
- Treat generic LLM cadence as a drafting defect, not something deferred to the end.
- Preserve asymmetry, qualification, and concrete judgment from the human-authored seeds.
- Do not manufacture personality through fake anecdotes, forced slang, intentional
  errors, or arbitrary contrarian language.

### `editing`

- Perform one named editing routine at a time.
- Return targeted changes or annotations rather than an unsolicited full rewrite.
- Treat sentence-length, passive-voice, and vocabulary rules as diagnostic guidance,
  not blind transformations.
- Preserve technical meaning and the author's judgment.
- Run the mandatory LLM-pattern audit defined in `STYLE.md` before review approval.
- Replace generic passages with article-specific mechanisms, evidence, or decisions;
  do not merely swap words from a blacklist.

### `image`

- Use the `blog-image-concept` skill and `07-image-brief.md`.
- Base concepts on the approved thesis and outline, not the title alone.
- Do not generate, download, or wire an asset without explicit authorization.
- Set `approved.image: true` only after Esteban approves the selected direction,
  final asset, and final alt text.

### `review`

- Phase 1 supports recording review notes but not an independent automated review.
- Do not mark review approved while `Blocker` findings remain unresolved.
- Treat unresolved generic LLM-pattern findings as blockers when they affect the
  opening, thesis, technical judgment, or conclusion.
- Record the mandatory LLM-pattern audit in `08-review.md`. A generic “sounds human”
  judgment is insufficient; cite exact passages and concrete remedies.

### `publish-ready` and `published`

- Phase 1 does not automate publication.
- Do not copy content into `src/content/posts`, set `draft: false`, commit, or push
  as part of this skill unless Esteban explicitly requests that separate action.
- Follow the blog's normal validation requirements for any requested publication.

## Human approval gates

The approval fields in `status.yaml` represent Esteban's decisions. Set one to
`true` only after explicit approval of that artifact:

- `brief`
- `outline`
- `claims`
- `draft`
- `image`
- `review`

AI completion, a passing script, or the absence of objections is not approval.
When an approved artifact changes materially, call out that the approval may need
to be revisited rather than silently preserving it.

## Safety boundaries

- Never fabricate facts, citations, quotations, statistics, code results, or sources.
- Never convert an inference or opinion into a factual statement.
- Never invent autobiographical detail.
- Preserve unrelated working-tree changes.
- Do not publish, commit, push, deploy, or create external discussions without
  explicit authorization in the current request.
- Do not run autonomous or unbounded editorial loops.

## Completion

At the end of a stage:

1. Run `pnpm article:check <slug>`.
2. State which artifacts changed.
3. State what remains unresolved.
4. Identify the next human decision; do not claim the article is approved.
