# Personal websites

This repository contains the websites I build and host for myself. Each website
is an independently deployable application under `apps/`, with its own framework
configuration, dependencies, environment variables, assets, and deployment
settings.

## Current direction

The next active website will be `apps/blog`: a static blog for technical articles
and notes. It will use the latest Astro release available when it is scaffolded
and the [Tone](https://astro.build/themes/details/tone/) starter. Tone currently
provides Markdown and MDX content collections, Pagefind search, RSS, a sitemap,
and other publishing-oriented defaults.

`apps/interests` is a legacy experiment. It remains in the repository while its
future is decided, but it is excluded from the active root development,
validation, and build commands.

## Repository structure

```text
apps/
  blog/       # Next website; not scaffolded yet
  interests/  # Legacy experiment; currently inactive
packages/     # Reserved for code genuinely shared by multiple websites
scripts/      # Repository maintenance utilities
```

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

Until `apps/blog` is created, these commands intentionally have no active app to
run and complete without processing `apps/interests`.

## Application contract

Every active website should:

- live under `apps/<name>` and use the package name `@esteban/<name>`;
- expose `dev`, `build`, and `check` package scripts;
- expose `lint` and `lint:css` when those checks apply;
- own its dependencies, environment-variable documentation, and deployment
  configuration;
- remain independently deployable from the other websites.

The planned blog scaffold command is:

```sh
pnpm create astro@latest apps/blog --template hanityx/astro-tone
```

After scaffolding, keep the root `pnpm-lock.yaml`, remove any app-local lockfile,
and ensure the package follows the application contract above.

## Validation

Pull requests and pushes to `master` install the frozen workspace dependencies,
run `pnpm check`, and run `pnpm build`. An application's own scripts remain the
source of truth; the root only orchestrates them.

## Tooling policy

Turbo, Husky, shared lint/format/TypeScript packages, and shared UI packages are
deliberately deferred. They should be introduced only when multiple active
websites create a concrete need that pnpm workspace commands cannot address
simply.
