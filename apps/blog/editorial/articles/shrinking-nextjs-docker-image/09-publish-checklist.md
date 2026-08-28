# Publication checklist

Phase 1 does not automate these checks. Do not treat this template as proof that a
check passed.

## Editorial

- [x] Brief, outline, claims, draft, and review were explicitly approved.
- [x] The final draft preserves the central thesis, seed provenance, and any
      supported Esteban judgment.
- [x] The mandatory LLM-pattern audit is recorded and resolved.
- [x] No unresolved blocker remains.
- [x] Every important factual claim has an appropriate basis.
- [x] Links, quotations, statistics, and code results were verified.

## Astro content

### Proposed frontmatter

- Title: `A 9.48 GB Docker Image Inside an 18–30 Minute Frontend Deploy`
- Description: `How a 9.48 GB Next.js image became part of an 18–30 minute deployment path, why the shared image was optimized without redesigning tenant workflows, and what changed after rollout.`
- Slug: `shrinking-nextjs-docker-image`
- Category: `Technical Articles`
- Locale: `en`
- Publication date: `2026-08-28T00:00:00-05:00`
- Draft state: `false`

- [x] Title, description, publication date, category, and draft state are correct.
- [x] The slug is final.
- [x] The hero image asset exists and is configured in the Astro post.
- [x] The hero-image direction, final asset, crop behavior, and alt text were approved.
- [x] Article images have meaningful alt text.
- [x] `##` and `###` headings provide the intended ToC structure.
- [x] Editorial comments and internal claim IDs were removed.
- [x] Code fences specify appropriate languages.

## Verification

- [x] Formatting passed.
- [x] `pnpm check` passed.
- [x] `pnpm build` passed.
- [x] The generated route was inspected.
- [x] Pagefind indexed the article.

## Spanish translation

- Spanish slug:
  `una-imagen-docker-de-9-48-gb-en-un-despliegue-frontend-de-18-a-30-minutos`
- [x] Both locales use the stable `translationKey`
      `shrinking-nextjs-docker-image`.
- [x] Spanish title, description, publication date, category, language, image,
      image alt text, and `draft: false` are configured.
- [x] Numeric claims, code structure, incident scope, validation limits, and tenant
      benchmark caveats match the approved English article.
- [x] Reciprocal language links and `hreflang` metadata were inspected.
- [x] The Spanish route, RSS feed, and Pagefind result were inspected.

## Publication authorization

- [x] Esteban explicitly authorized changing `draft` to `false`.
- [ ] Esteban explicitly authorized any requested commit or push.

## Current boundary

- The Astro post is prepared with `draft: false` and the editorial stage is
  `publish-ready`.
- The final asset, responsive crops, article route, RSS/sitemap inclusion, and
  Pagefind result were verified locally.
- Commit, push, and deployment are not authorized.
- The supplied deployment ranges are approximate operational observations across
  different tenant workflows, not controlled benchmarks.
