---
title: 'Notes on Effective Debugging'
description: 'A compact loop for turning vague symptoms into small, falsifiable explanations.'
pubDate: '2026-08-07'
category: 'Notes'
---

Debugging improves when each step reduces uncertainty.

## Reproduce the smallest symptom

Write down the exact input, environment, observed result, and expected result.
“The endpoint is broken” is not reproducible; “this payload returns `404` for one
tenant and `200` for another” is.

## Inspect before changing

Read the code path, current configuration, deployed revision, and relevant state
before proposing a fix. A local checkout can explain how the system is designed,
but it does not prove what is currently running.

## Form competing hypotheses

Avoid falling in love with the first plausible cause. List at least two when the
evidence allows it, then choose a check whose results distinguish them.

```text
H1: The route is missing from the deployed revision.
H2: The route exists but authorization hides it.

Check: Compare an authenticated OPTIONS/GET response and the deployed commit.
```

## Change one variable

If a test modifies several inputs at once, a successful result still does not
identify which change mattered. Keep experiments small and reversible.

## Preserve the evidence

Record the useful command, trace identifier, failing example, and final causal
chain. The goal is not only to solve today's incident but to make the next one
faster to understand.
