# Personal websites

This repository contains the websites I build and host for myself. Each website
is an independently deployable application under `apps/`, with its own framework
configuration, dependencies, environment variables, assets, and deployment
settings.

## Current direction

The active website is `apps/blog`: a static Astro blog for technical articles and
notes, based on the [Tone](https://astro.build/themes/details/tone/) starter. It
provides Markdown and MDX content collections, Pagefind search, RSS, a sitemap,
and other publishing-oriented defaults.

`apps/interests` is a legacy experiment. It remains in the repository while its
future is decided, but it is excluded from the active root development,
validation, and build commands.

## Repository structure

```text
apps/
  blog/       # Active technical articles and notes website
  interests/  # Legacy experiment; currently inactive
packages/     # Reserved for code genuinely shared by multiple websites
scripts/      # Repository maintenance utilities
```

The blog also owns a repository-backed editorial workspace under
`apps/blog/editorial`. It stores article briefs, evidence, drafts, and human
approval state outside the Astro content collection. Repository-local AI workflow
instructions—including deliberate editorial, quick-post, and post-image concept
workflows—live under `.agents/skills`.

## Requirements

- Node.js 22.12.0 or newer
- pnpm 10.12.1, as declared by the root `packageManager`

Install workspace dependencies from the repository root:

```sh
corepack enable
pnpm install
```

## Root commands

```sh
pnpm dev    # Run active websites in development mode
pnpm check  # Run available type, code, and style checks
pnpm build  # Build active websites
```

Blog editorial work uses two additional root commands:

```sh
pnpm article:new <slug>    # Create a non-destructive article workspace
pnpm article:check <slug>  # Validate its structure and report its state
pnpm test:editorial        # Test the editorial CLI behavior
```

These commands process `apps/blog` and intentionally exclude `apps/interests`.

Repository-local skills provide both a stage-by-stage editorial workflow and an
optional `blog-quick-post` fast lane. The fast lane keeps the same review, image, and
anti-LLM standards while reducing interaction to a commission and consolidated review
package.

## Application contract

Every active website should:

- live under `apps/<name>` and use the package name `@esteban/<name>`;
- expose `dev`, `build`, and `check` package scripts;
- expose `lint` and `lint:css` when those checks apply;
- own its dependencies, environment-variable documentation, and deployment
  configuration;
- remain independently deployable from the other websites.

The workspace keeps a single root `pnpm-lock.yaml`; applications do not own
independent lockfiles.

## Validation

Pull requests and pushes to `master` install the frozen workspace dependencies,
run `pnpm check`, and run `pnpm build`. The check includes active-application
validation and the editorial CLI behavior tests. An application's own scripts
remain the source of truth; the root only orchestrates them.

## Tooling policy

Turbo, Husky, shared lint/format/TypeScript packages, and shared UI packages are
deliberately deferred. They should be introduced only when multiple active
websites create a concrete need that pnpm workspace commands cannot address
simply.
