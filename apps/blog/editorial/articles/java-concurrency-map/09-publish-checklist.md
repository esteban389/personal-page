# Publication checklist

> Current boundary: Esteban approved the final review, claims, draft, generated
> image, and recorded alt text. He explicitly authorized changing `draft` to
> `false`, committing the article, and pushing it. Completion is reported only
> after validation and remote verification.

Phase 1 does not automate these checks. Do not treat this template as proof that a
check passed.

## Editorial

- [x] Brief, outline, claims, draft, image, and review were explicitly approved.
- [x] The final draft preserves the central thesis and human-authored judgment.
- [x] The mandatory LLM-pattern audit is recorded and resolved.
- [x] No unresolved blocker remains.
- [x] Every important factual claim has an appropriate basis.
- [x] Links, quotations, statistics, and code results were verified for the current
      draft.

## Astro content

- [x] Title, description, publication date, category, and `draft: false` are correct.
- [x] The slug is final.
- [x] The configured hero image exists.
- [x] The approved hero-image direction, final asset, and crop behavior were
      inspected in the rendered layouts.
- [x] The hero image has approved descriptive alt-text intent. The current card
      components use the post title as alt text; no body image is present.
- [x] Official source citations use footnote references with the collected list at
      the end; rendered anchors, backlinks, numbering, and mobile layout were inspected.
- [x] `##` and `###` headings provide the intended ToC structure.
- [x] Editorial comments and internal claim IDs were removed.
- [x] Code fences specify appropriate languages.

## Verification

- [x] Formatting passed for the current Astro draft and editorial workspace.
- [x] The standalone Java 25.0.4 harness compiled and passed with assertions enabled.
- [x] `pnpm --filter @esteban/blog check`, `lint`, and `lint:css` passed with
      `draft: false`.
- [x] `pnpm --filter @esteban/blog build` passed with `draft: false`.
- [x] The generated route was inspected on desktop and mobile.
- [x] Pagefind indexed the article and returned it for `concurrency`.

## Publication authorization

- [x] Esteban explicitly authorized changing `draft` to `false`.
- [x] Esteban explicitly authorized the requested commit and push.

## English syndication

- [x] The canonical blog URL is live and self-referencing.
- [x] DEV and Medium metadata are configured in the English post frontmatter.
- [x] Syndication tests and the combined DEV/Medium dry run passed.
- [x] DEV published the article at
      <https://dev.to/esteban389/how-javas-concurrency-apis-fit-together-bii>.
- [x] The live DEV HTML points its canonical link to the English blog post and
      uses the approved hero image.
- [x] The supported Medium import command and manual handoff were produced.
- [ ] Medium import, visual review, and publication remain manual actions for
      Esteban.

## Spanish edition

- [x] The Spanish translation commission, draft, and independent review are
      recorded under `translations/es/`.
- [x] The reviewed translation is prepared in the Astro content collection with
      `draft: false`.
- [x] Production validation, reciprocal language links, Spanish Pagefind search,
      mobile footnotes, locale metadata, and hero metadata passed.
- [x] Esteban explicitly authorized a scoped commit and push for the syndication
      metadata and Spanish publication package.
- The public Spanish route must be verified after the push before completion is
  reported.
