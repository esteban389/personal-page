# Publication checklist

Phase 1 does not automate these checks. Do not treat this template as proof that a
check passed.

## Astro draft frontmatter

```yaml
title: 'What Duplicate Users Taught Me About Outbox and Idempotency'
description: 'A production support incident led me to separate durable work from duplicate-safe processing with an outbox, an inbox, and idempotency.'
pubDate: pending
heroImage: pending
category: 'Technical Articles'
lang: en
draft: true
```

- Source file: `apps/blog/src/content/posts/outbox-inbox-idempotency.md`
- Slug: `outbox-inbox-idempotency`
- No translation or `translationKey` is proposed in this package.
- The Astro post exists with `draft: true`; this does not authorize publication.

## Review-package status

- The full-draft tone restyle is complete under the updated `blog-quick-post`
  contract. The argument order, claims, code, and architecture remain fixed; the
  prose now follows the recorded candid first-person, calibrated, medium-density,
  varied-rhythm profile.
- The agreed three-paragraph architectural introduction was restored and adapted to
  that tone in both the editorial draft and Astro post after it was mistakenly
  dropped during the first integration.
- External technical claims were narrowed to eight reader-facing architecture
  claims, checked against primary or canonical sources, and recorded in
  `04-claims.md`; references use footnotes.
- Independent review found one repeated setup before the code examples. The bounded
  revision removed it, and targeted verification now records zero blockers and zero
  needs-attention findings.
- The orchestrator's direct `no-ai-slop` evaluation also passes: the personal voice
  is sourced, the meaningful technical contrasts remain, and no generic opening,
  canned cadence, unsupported personality, or recap ending remains.
- The hero direction is a concept only. No asset has been generated, sourced, or
  approved.
- The reviewed article was copied into a new English Astro post with `draft: true`.
  No existing post, final image, published route, or search index was changed.

## Editorial

- [ ] Brief, outline, claims, draft, and review were explicitly approved.
- [x] The final draft preserves the central thesis and human-authored judgment.
- [x] The mandatory LLM-pattern audit is recorded and resolved.
- [x] No unresolved blocker remains.
- [x] Every important factual claim has an appropriate basis.
- [x] Links and illustrative-code syntax were verified; the article presents no
      quotations, statistics, or executed code result.

## Astro content

- [x] Title, description, publication date, category, and draft state are correct.
- [x] The slug is final.
- [ ] The hero image exists when configured.
- [ ] The hero-image direction, final asset, crop behavior, and alt text were approved.
- [ ] Article images have meaningful alt text.
- [x] `##` headings provide the intended ToC structure.
- [x] Editorial comments and internal claim IDs were removed.
- [x] Code fences specify appropriate languages.

## Verification

- [x] Editorial formatting and `pnpm article:check outbox-inbox-idempotency` passed.
- [x] `pnpm --filter @esteban/blog check` passed.
- [x] `pnpm --filter @esteban/blog build` passed.
- [x] The production build omitted the article route because `draft: true`.
- [x] Pagefind omitted the article because `draft: true`.

## Publication authorization

- [ ] Esteban explicitly authorized changing `draft` to `false`.
- [ ] Esteban explicitly authorized any requested commit or push.
