---
name: blog-diagram-opportunities
description: Review an article, outline, or technical explanation for places where a diagram would materially improve understanding, and produce evidence-bounded diagram briefs. Use for visual-planning requests; not when the user has already specified a diagram to render.
---

# Blog Diagram Opportunities

## When to use

Use this skill when Esteban asks whether a post needs diagrams, where a visual
would help, or which concepts should become diagrams. It is an analysis and
briefing skill: do not create image files unless he also requests generation.

If the requested diagram and its content are already established, use
`blog-d2-diagram` directly.

## Required context

1. Read the nearest `AGENTS.md` files and `apps/blog/README.md`.
2. Read the complete article or the editorial brief, outline, claim register, and
   relevant draft. Preserve the distinction between observed, sourced, inferred,
   and proposed material.
3. Read [references/decision-rubric.md](references/decision-rubric.md).

## Review method

1. Identify the article's main reader promise and conceptual bottlenecks.
2. Find passages where the reader must mentally preserve relationships, order,
   state changes, boundaries, branches, or before/after structure across several
   sentences.
3. Compare a diagram with the honest alternatives: prose, table, chart,
   screenshot, or code. Recommend no visual when it would only restate the text.
4. Select the smallest set of visuals that resolves the important bottlenecks.
   Do not optimize for visual count or evenly distribute illustrations.
5. For every accepted candidate, produce a diagram brief using the schema in the
   reference. Every element must trace to the article, a cited source, verified
   code, or an explicitly labeled proposal.
6. If both identification and generation were requested, present the selected
   briefs before using `blog-d2-diagram`. Stop for user input only when competing
   interpretations would materially change the diagram.

## Output

Return:

- a concise overall verdict: diagram, another visual form, or no visual;
- accepted opportunities in priority order, each with an exact insertion point;
- rejected tempting visuals and why they would not help;
- evidence gaps or choices that must be resolved before authoring;
- the locale plan when the post has or will have a translation.

Do not silently edit approved editorial artifacts. If the user asks to record the
recommendation in an editorial workspace, follow the `blog-editorial` approval
and invalidation rules.

## Boundaries

- A hero image and an explanatory article diagram have different jobs. Route
  hero-image direction to `blog-image-concept`.
- Never invent architecture, causality, timing, scale, or personal experience.
- A visual recommendation does not authorize generation, publication, commits,
  pushes, syndication, or deployment.

## Completion

State what material was reviewed, what was selected or rejected, and the next
content decision. When nothing merits a diagram, say so plainly.
