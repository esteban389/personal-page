---
title: 'Testing a Local-First Publishing Workflow'
description: 'A short verification note for publishing from this Astro blog to DEV Community and Medium.'
pubDate: '2026-08-19T12:00:00Z'
category: 'Notes'
lang: 'en'
syndication:
  dev:
    tags:
      - astro
      - devto
      - blogging
      - automation
  medium:
    topics:
      - Astro
      - Technical Writing
      - Blogging
      - Automation
---

This short note verifies a local-first publishing workflow for my technical writing.

The Markdown file in this Astro blog remains the source of truth. After the canonical page is live, the same article can be sent to DEV Community with that canonical URL. Medium remains an official import-and-review step because it does not provide new integration tokens for automated publishing.

## What this test covers

- The post builds as part of the Astro content collection.
- The canonical blog URL is available before syndication begins.
- The DEV Community copy points search engines back to the original post.
- The same canonical URL can be imported into Medium for a final manual review.

If you are reading this on another platform, the canonical version lives on [my blog](https://blog.estebanmurcia.dev/posts/testing-local-first-publishing/).
