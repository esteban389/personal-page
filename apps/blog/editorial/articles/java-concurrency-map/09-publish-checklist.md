# Publication checklist

> Current boundary: Esteban approved the reviewed English article and authorized
> creation of the finished Astro draft. A generated image candidate now exists but
> still needs final asset and alt-text approval before wiring. Esteban reopened the
> draft introduction for revision. Changing `draft` to `false`, Git operations, and
> deployment remain unauthorized.

Phase 1 does not automate these checks. Do not treat this template as proof that a
check passed.

## Editorial

- [ ] Brief, outline, claims, draft, and review were explicitly approved. Draft and
      review approval were reopened after the introduction changed.
- [ ] The final draft preserves the central thesis and human-authored judgment.
- [x] The mandatory LLM-pattern audit is recorded and resolved.
- [ ] No unresolved blocker remains.
- [x] Every important factual claim has an appropriate basis.
- [ ] Links, quotations, statistics, and code results were verified.

## Astro content

- [x] Title, description, publication date, category, and draft state are correct.
- [x] The slug is final.
- [ ] The hero image exists when configured.
- [ ] The hero-image direction, final asset, crop behavior, and alt text were approved.
- [x] Article images have meaningful alt text. No body images are present.
- [ ] Official source citations use footnote references with the collected list at
      the end; rendered anchors, backlinks, numbering, and mobile layout were inspected.
- [x] `##` and `###` headings provide the intended ToC structure.
- [x] Editorial comments and internal claim IDs were removed.
- [x] Code fences specify appropriate languages.

## Verification

- [x] Formatting passed for the current Astro draft and editorial workspace.
- [x] `pnpm check` passed with `draft: true`.
- [x] `pnpm build` passed with `draft: true`.
- [ ] The generated route was inspected.
- [ ] Pagefind indexed the article.

## Publication authorization

- [ ] Esteban explicitly authorized changing `draft` to `false`.
- [ ] Esteban explicitly authorized any requested commit or push.
