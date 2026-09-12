---
name: blog-d2-diagram
description: Create or revise source-controlled D2 diagrams and committed SVG assets for Esteban's technical blog. Use for explanatory architecture, flow, state, sequence, or relationship diagrams; not for decorative hero art, charts, screenshots, or tables.
---

# Blog D2 Diagram

## When to use

Use this skill when Esteban asks to generate, revise, render, or embed a
deterministic explanatory diagram in `apps/blog`. If the need for a diagram or
its location is still unclear, use `blog-diagram-opportunities` first.

Do not use D2 merely to decorate a post. Prefer a table for exact field-by-field
comparison, a chart for quantitative trends, a screenshot for UI evidence, and a
code block for syntax.

## Required context

1. Read the nearest `AGENTS.md` files and `apps/blog/README.md`.
2. Read the complete post, or the approved editorial brief, outline, claims, and
   relevant draft section. Do not infer the diagram from the title alone.
3. If a diagram brief exists, treat its question, evidence, and non-goals as the
   contract. Resolve structural ambiguity before drawing.
4. Read [references/d2-authoring.md](references/d2-authoring.md) before authoring
   or revising D2.

## Workflow

1. State the single reader question the diagram will answer.
2. Select the smallest fitting diagram form and list the source-backed nodes,
   connections, order, and boundaries before writing D2.
3. Keep editable sources under
   `apps/blog/diagrams/<translation-key-or-slug>/` and rendered SVGs under
   `apps/blog/public/images/posts/<translation-key-or-slug>/` so published
   diagrams have stable canonical URLs.
4. Use locale suffixes for localized diagrams, such as `request-flow.en.d2` and
   `request-flow.es.d2`. Keep stable, language-neutral D2 keys while translating
   visible labels.
5. Render with the pinned helper. It checks formatting, validates, fixes the renderer
   version and visual options, and writes or compares the SVG.
6. Inspect the SVG at article width and on a narrow viewport. Check label
   wrapping, crossings, ordering, contrast, and whether the diagram still answers
   its stated question.
7. Embed it with useful alt text and an adjacent caption. Give a complex diagram
   an adjacent prose explanation; do not turn alt text into a hidden essay.
8. Run the blog content checks required by `AGENTS.md` after wiring the asset into
   a post.

## Commands

Run from the repository root:

```bash
node .agents/skills/blog-d2-diagram/scripts/render.mjs write \
  apps/blog/diagrams/<article>/<diagram>.<lang>.d2 \
  apps/blog/public/images/posts/<article>/<diagram>.<lang>.svg

node .agents/skills/blog-d2-diagram/scripts/render.mjs check \
  apps/blog/diagrams/<article>/<diagram>.<lang>.d2 \
  apps/blog/public/images/posts/<article>/<diagram>.<lang>.svg
```

Use `--layout=dagre` only when its reviewed output is clearer than the default
ELK render. Do not bypass a renderer-version mismatch: upgrading D2 is a separate
review that must regenerate and visually inspect all stored SVGs.

## Boundaries

- Never invent components, interactions, ordering, measurements, or failure
  paths to make a diagram look complete. Mark a proposal as proposed.
- Do not fetch remote icons or images during rendering. Local, reviewed assets
  are required for reproducible output.
- Do not use color as the only carrier of meaning; use labels, shape, line style,
  or a localized legend as well.
- SVG generation does not authorize publication, commits, pushes, syndication,
  or deployment.

## Completion

Report the source and SVG paths, renderer mode and version, article insertion
point, accessibility text, checks run, and any unresolved content or layout
decision.
