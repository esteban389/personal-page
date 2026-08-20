# Repository scripts

## Editorial workflow

`editorial/new-article.mjs` creates a blog article workspace from the versioned
templates under `apps/blog/editorial/templates`. It validates lowercase kebab-case
slugs, refuses to overwrite existing work, and rolls back partial creation.

`editorial/check-article.mjs` verifies the required artifact set and the structural
fields in `status.yaml`. It does not evaluate prose, evidence quality, or publication
readiness.

Run the public commands from the repository root:

```sh
pnpm article:new <slug>
pnpm article:check <slug>
pnpm test:editorial
```
