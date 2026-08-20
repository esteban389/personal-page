# Editorial workspace

This directory contains the durable working state for Esteban's AI-assisted blog
workflow. It is authoring infrastructure: Astro does not load or publish anything
from this directory.

Finished posts continue to live in `src/content/posts`.

## Mental model

- Use one primary chat per article when practical.
- Treat repository artifacts as the source of truth when resuming elsewhere.
- Use AI for information architecture, skeptical review, bounded expansion, and
  targeted editing.
- Treat generic LLM prose as a quality defect throughout drafting, not an optional
  final cleanup.
- Develop and approve a specific hero-image direction for each new article.
- Keep thesis, evidence interpretation, narrative decisions, final voice, and
  publication under human control.

See `ROADMAP.md` for the phased implementation plan, `STYLE.md` for writing
guidance, `RUBRIC.md` for review criteria, and `IMAGE_GUIDE.md` for the blog's
visual constraints.

## Start an article

From the repository root:

```sh
pnpm article:new transaction-isolation
```

This creates:

```text
apps/blog/editorial/articles/transaction-isolation/
├── status.yaml
├── 00-brief.md
├── 01-raw-notes.md
├── 02-outline.md
├── 03-objections.md
├── 04-claims.md
├── 05-seeds.md
├── 06-draft.md
├── 07-image-brief.md
├── 08-review.md
└── 09-publish-checklist.md
```

Slugs must use lowercase kebab-case. The command refuses to overwrite an existing
workspace and removes a newly created directory if template copying fails.

## Check an article

```sh
pnpm article:check transaction-isolation
```

The command checks the required artifacts, slug consistency, editorial stage, and
human approval gates. It validates structure, not writing quality or factual truth.

## Work with Codex

Start a primary article chat with:

> Use `$blog-editorial` to start `transaction-isolation` from these raw notes. Do
> not draft yet.

Resume it later with:

> Use `$blog-editorial` to resume `transaction-isolation` from its repository state.

Request a bounded pass with:

> Use `$blog-editorial` to run a concrete-grounding pass on the current draft. Show
> targeted suggestions; do not rewrite the entire article.

Develop hero-image directions with:

> Use `$blog-image-concept` for `transaction-isolation`. Give me three genuinely
> different directions based on the approved thesis. Do not generate an image yet.

Use the optional fast lane when one consolidated review is preferable to the normal
stage-by-stage approvals:

> Use `$blog-quick-post` for `transaction-isolation`. My thesis is that retries can
> amplify dependency failures. Target experienced backend developers, use a technical
> essay structure and a conversational tone, and show me one review package.

When either style is undecided, the skill compares structural options with the same
content kernel and writing tones with the same verified sentence. Add `skip samples`
to accept a documented default and proceed immediately. The skill also supports
restyling an editorial draft or published post through a workspace and preview; it
does not edit published content without explicit approval.

The local skills live at `.agents/skills/blog-editorial/SKILL.md` and
`.agents/skills/blog-image-concept/SKILL.md`. The faster AI-led alternative lives at
`.agents/skills/blog-quick-post/SKILL.md`.

## State and approval

`status.yaml` records the current workflow stage and six human approvals. Valid
stages are:

```text
brief → ingestion → outline → evidence → seeds → drafting → editing
      → image → review → publish-ready → published
```

The sequence describes the normal path, but Phase 1 does not enforce automatic
transitions. Change the stage only when it reflects the actual workspace.

Approval fields may become `true` only after Esteban explicitly approves the
corresponding artifact. A passing check never implies editorial approval.

The `image` approval covers the selected direction, final asset, and final alt
text. Astro still permits posts without `heroImage` for compatibility with older
content, but new editorial work cannot become `publish-ready` without this gate.

The mandatory LLM-pattern audit lives in `STYLE.md` and must be recorded in
`08-review.md`. It relies on passage-level editorial findings, never detector scores.

## Git policy

Editorial artifacts are intended to be versioned so another chat can reconstruct
the article without hidden context. Keep editorial-history commits distinct from
published-content, theme, and infrastructure commits when possible.

Publication, commits, and pushes remain explicit actions. Creating or checking an
article does none of them.

The quick-post skill may bundle the six editorial approvals into one explicit review
package decision. That bundle does not combine or imply publication, image generation,
committing, pushing, or deployment permission.
