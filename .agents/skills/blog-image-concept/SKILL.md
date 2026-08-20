---
name: blog-image-concept
description: Develop and refine hero-image concepts for Esteban's blog posts from an editorial workspace or existing post, without generating or publishing an image unless explicitly requested.
---

# Blog image concept

Use this skill when Esteban asks for ideas, art direction, a generation prompt,
or selection help for a blog post's hero image. The goal is a specific visual
argument derived from the article, not generic decoration.

## Required context

1. Read `apps/blog/editorial/IMAGE_GUIDE.md` completely.
2. For an editorial workspace, read its `status.yaml`, `00-brief.md`,
   `02-outline.md`, and `07-image-brief.md` completely. Read `06-draft.md` when
   the concept depends on details not established by the outline.
3. For an already published or draft Astro post, read the complete post and its
   frontmatter instead.
4. Run `pnpm article:check <slug>` before editing an editorial workspace.

Do not infer the thesis from the title alone when article context exists.

## Concept development

For initial ideation, produce three genuinely different directions. They must
differ in visual logic, not merely color, camera angle, or rendering style. When
refining an approved direction, keep working from that direction unless Esteban
asks to reopen exploration.

For each direction, state:

- the core visual idea;
- the article claim or tension it represents;
- the concrete subject and focal point;
- composition, negative space, palette, lighting, and medium;
- why it survives the blog's varied crops and bottom text overlay;
- what the image must avoid implying;
- likely failure modes or visual clichés.

Prefer concrete systems, objects, boundaries, sequences, or failure states from
the article. Use abstraction only when the subject cannot be represented honestly
and the metaphor has one clear interpretation.

## Selection and image brief

Do not choose on Esteban's behalf. Compare the concepts and ask for a selection or
specific combination. After explicit selection, update `07-image-brief.md` with:

- the selected direction and requested changes;
- one production-ready generation or sourcing prompt;
- negative constraints;
- a crop-safe focal region;
- provisional alt-text intent;
- any attribution or licensing requirement.

Set `approved.image: true` only after Esteban approves both the selected direction
and the final asset. Concept completion or image generation is not approval.

## Generation boundary

Concept work does not authorize image generation, downloading, file creation,
frontmatter edits, publication, commits, or pushes.

If Esteban explicitly requests generation, use the available image-generation
capability with the approved brief. Inspect the result against the guide, show it
to Esteban, and leave `approved.image: false` until they approve the final asset.

If an external image is selected, record its source and license. Do not assume an
image found on the web is reusable.

## Visual anti-cliché rules

Reject default AI imagery unless the article specifically requires it:

- glowing brains, robots, circuit-board heads, or hands touching holograms;
- floating code, random terminal text, fake interfaces, or illegible typography;
- neon cyberpunk lighting used only to signal “technology”;
- generic clouds, networks, puzzle pieces, gears, or connected nodes;
- tiny people facing a giant screen or portal;
- meaningless glossy 3D shapes and overfilled isometric scenes;
- embedded titles, labels, logos, watermarks, or generated text.

Do not solve clichés by adding arbitrary weirdness. The image should be restrained,
recognizable, and tied to the article's actual mechanism.

## Completion

For editorial workspaces, run `pnpm article:check <slug>` after edits. Report the
selected status, unresolved visual decisions, and whether final image approval is
still required.
