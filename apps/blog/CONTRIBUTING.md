# Contributing

This blog is maintained inside the `personal-page` workspace.

Before submitting a change, run these commands from the repository root:

```sh
pnpm check
pnpm build
```

Blog-specific formatting can be applied with:

```sh
pnpm --filter @esteban/blog format
```

Keep content changes separate from theme or infrastructure changes when
possible so each change remains easy to review.
