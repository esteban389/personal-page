# Esteban's Blog

Static blog for technical articles and working notes. It uses Astro and the
[Tone](https://astro.build/themes/details/tone/) starter.

Install dependencies from the repository root:

```sh
pnpm install
```

## Commands

| Command         | Action                                         |
| --------------- | ---------------------------------------------- |
| `pnpm dev`      | Start the local development server             |
| `pnpm build`    | Build the site and generate the Pagefind index |
| `pnpm preview`  | Preview the production build                   |
| `pnpm check`    | Run Astro type checks                          |
| `pnpm lint`     | Run ESLint                                     |
| `pnpm lint:css` | Run Stylelint                                  |
| `pnpm format`   | Format source files with Prettier              |

## Content

Posts live in `src/content/posts` as Markdown or MDX and use either
`Technical Articles` or `Notes` as their primary category. Required frontmatter:

```yaml
---
title: 'Post title'
description: 'One concise summary.'
pubDate: '2026-08-12'
category: 'Technical Articles'
---
```

Set `draft: true` to keep unfinished content out of generated pages, RSS, and
search. Additional publishing options are defined in `src/content.config.ts`.
When `heroImage` is present, `heroImageAlt` may provide image-specific alt text;
existing posts fall back to the post title when it is omitted.

## Configuration

Most site-level settings live in `astro-theme-config.ts`.

The canonical production URL is `https://blog.estebanmurcia.dev`. Deployment
environments may override it with `ASTRO_SITE_URL` when needed.
`ASTRO_SITE_BASE` can be used when deploying below a path instead of a domain
root.

The default Open Graph image is intentionally disabled until blog-specific
social artwork replaces the Tone preview image in `public/og.png`.

## Deployment

Tone produces a static site.

| Setting          | Value        |
| ---------------- | ------------ |
| Build command    | `pnpm build` |
| Output directory | `dist`       |

The site supports domain-root deployments and path-based static deployments.
