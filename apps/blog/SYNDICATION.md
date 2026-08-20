# Post syndication

The Astro post is the source of truth. Publish it on the blog first, then use the
same canonical URL for DEV Community and Medium.

## Configure a post

Add only the destinations you intend to use:

```yaml
syndication:
  dev:
    tags:
      - java
      - spring
    # Optional. Use only to adopt a DEV article that predates this workflow.
    articleId: 1234567
    # Optional.
    series: Spring Security
  medium:
    topics:
      - Java
      - Spring Boot
```

DEV accepts at most four tags. This tool requires lower-case alphanumeric tags
because that is the portable DEV tag format. Medium accepts at most five topics.

Only public Markdown posts can be syndicated. The command intentionally stops
when the source post is an MDX file, is marked `draft: true`, contains a relative
inline image, or does not have a working production canonical page. Convert local
inline images to stable absolute URLs before syndicating them.

## Configure DEV Community

Create an API key at <https://dev.to/settings/extensions>. Store it in the ignored
`apps/blog/.env.local` file; never commit it:

```dotenv
DEVTO_API_KEY=replace-with-your-key
```

The API key is read only when a DEV action is requested. It is never printed.

## Preview and publish

Run commands from the repository root. Previewing is local and does not require a
live page or credentials:

```sh
pnpm --filter @esteban/blog syndicate -- testing-local-first-publishing --dev publish --medium --dry-run
```

After the post has been pushed and its canonical page is live, publish or update
the DEV copy and print the Medium handoff:

```sh
pnpm --filter @esteban/blog syndicate -- testing-local-first-publishing --dev publish --medium
```

Use `--dev draft` to create or update an unpublished DEV draft. The tool looks up
articles by canonical URL before writing, so rerunning the command updates the
same DEV article instead of creating a duplicate. An existing published article
cannot be changed back to a draft by this tool.

Spanish posts use the same command with `--lang es`:

```sh
pnpm --filter @esteban/blog syndicate -- nombre-del-post --lang es --dev publish --medium
```

Override the production origin only for a deliberate alternate deployment:

```sh
pnpm --filter @esteban/blog syndicate -- post-slug --site https://example.com --medium
```

## Import into Medium

Medium does not issue new API integration tokens, so the supported workflow is a
manual import:

1. Run the command with `--medium` and copy the canonical URL it prints.
2. Open <https://medium.com/p/import> while signed in.
3. Paste the URL and choose **Import**.
4. Review headings, code blocks, links, and images.
5. Set a featured image if the import did not select the intended one.
6. Add the printed topics, preview the story, and publish it.
7. In the story settings, confirm that the canonical link points to the blog URL.

The command never signs in to Medium or publishes there. This keeps the workflow
within Medium's supported import path and leaves the final visual review to the
author.
