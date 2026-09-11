# Revised review package — 2026-09-10

## Astro preparation completed — 2026-09-11

User authorized preparing the actual post with the selected image. Source: apps/blog/src/content/posts/background-jobs-database-pool.md; hero: apps/blog/src/assets/posts/background-jobs-database-pool/borrowed-keys.png. Draft remains true.
Approved body preserved exactly, editorial-only heading/comment omitted. Astro check/build, formatting and draft-exclusion checks passed. Local real-component desktop/narrow crop checks completed; final crop/alt acceptance remains pending. No commit, push or publication. See 09-publish-checklist.md for validation details. Earlier preparation-state descriptions below are historical.

Read [the complete revised draft](06-draft.md).

## What changed

- Corrected private20 path to committee-report recalculation before report creation.
- Replacement is Spring ThreadPoolTaskExecutor, eight threads, bounded memory queue500 and batches4. Persistent jobs use a separate database queue.
- First fix reduced note-level batch/parallel execution/threads ten to two. Existing two macro slots were retained.
- Dedup/debounce/coalescing are existing policies, not emergency additions.
- Hikari configured application default max24 documented without universal recommendation.
- Production tests explicitly exclude new report path.
- Friendlier first-person prose, shorter explanations and one trigger table replace dense audit-like exposition. No invented humor or emotion.

## Artifacts

[Brief](00-brief.md), [sources](01-raw-notes.md), [outline](02-outline.md), [objections](03-objections.md), [claims](04-claims.md), [seeds](05-seeds.md), [draft](06-draft.md), [review](08-review.md), [diagram proposal](10-diagram-opportunities.md).
[Hero](07-image-brief.md) remains pending. [Frontmatter/checklist](09-publish-checklist.md) retains selected title, Technical Articles, en, background-jobs-database-pool, draft true and unset publication date.

## Evidence and validation limits

D is the user's supplied code-review findings, with commit locators ada80b9b1 and a2673b108. No production repository or telemetry inspected here. Spring public API checked for queue configuration. Code sketches remain incomplete and not executed. No before/after speed result or isolated contribution claimed.

## Decision state

User accepted the revised editorial package on 2026-09-10 subject to changing the macro scope to plural; applied. Brief, outline, claims, draft and review approved. Stage image; hero direction, final asset, crop and alt approval pending. Three hero concepts are now available in 07-image-brief.md.
No published content, Git or deployment changes.
