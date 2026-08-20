---
name: blog-quick-post
description: Produce or restyle a blog post through a fast, mostly AI-led editorial lane with one consolidated human review package; use blog-editorial for the slower stage-by-stage workflow.
---

# Blog quick post

Use this skill when Esteban explicitly prefers speed and reduced human involvement.
It shares the normal editorial standards and workspace, but compresses intermediate
decisions into one final review package. It does not replace `blog-editorial`.

## Required context

Before work, read these files completely:

- `apps/blog/editorial/README.md`
- `apps/blog/editorial/STYLE.md`
- `apps/blog/editorial/RUBRIC.md`
- `apps/blog/editorial/IMAGE_GUIDE.md`
- [references/pipeline.md](references/pipeline.md)

For style selection or any style change, also read
[references/styles-and-restyling.md](references/styles-and-restyling.md).

Use `pnpm article:new <slug>` for a new workspace and
`pnpm article:check <slug>` before and after workspace edits. Never overwrite an
existing workspace.

## Fast-lane contract

The interaction has three user-facing moments:

1. **Commission:** obtain the thesis or question, direction, audience, structural
   style, writing tone, constraints, language, and supplied experience or sources.
2. **Review package:** run the bounded pipeline and present the draft, claim status,
   review findings, image proposal, frontmatter proposal, and unresolved questions.
3. **Decision:** apply requested corrections once, or record Esteban's explicit
   bundled approval of the named artifacts.

If both styles are specified, start without samples. If either is undecided, show
short contextual comparisons using the same content kernel. `skip samples` always
means proceed with a reasonable documented choice.

Run at most one automatic revision pass after independent review. Further material
changes require the review package to return to Esteban.

## Authorship and approvals

- Preserve the supplied thesis, direction, facts, and boundaries.
- Never invent Esteban's experiences, opinions, results, sources, or quotations.
- A story-led post requires a supplied real story or an explicitly fictional scenario.
- Complete and record the mandatory LLM-pattern audit from `STYLE.md`.
- One explicit package approval may set `brief`, `outline`, `claims`, `draft`,
  `image`, and `review` approvals together only when the package enumerates each
  artifact and no blocker remains.
- Silence, “looks fine” directed at only one artifact, or a passing checker is not
  bundled approval.

Approval of the package may authorize preparation of the Astro post only when the
user says so explicitly. Publication, changing `draft` to `false`, committing,
pushing, and deployment are separate permissions. Do not infer one from another.

## Restyle mode

Use restyle mode for an editorial draft or an existing Astro post. Always work
through an editorial workspace, show a preview or diff, and obtain approval before
touching published content. Preserve claims, code, links, frontmatter, original
publication date, attribution, translation metadata, and every locale not requested.

Apply the approval invalidation rules in the style reference. Rerun factual review
when wording changes the scope or certainty of a claim, and rerun the LLM-pattern
audit after every restyle.

## Completion

Report changed artifacts, validations, unresolved claims, final approval state, and
the exact separate action still needed for publication or Git operations.
