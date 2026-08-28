# Structural objections

## Skeptical, well-informed reader

| Objection or question                                                         | Affected section                                      | Proposed response                                                                                                                                                          | Decision                       |
| ----------------------------------------------------------------------------- | ----------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------ |
| “Image size alone does not prove what consumed 18-30 minutes.”                | The deployment moved the whole image                  | State only that the full-image job made size part of the cost. Preserve compilation, network, disk, load, replacement, and health checks as possible contributors.         | Addressed in outline and draft |
| “Why compare this with backend services? Their runtime stacks are different.” | The deployment moved the whole image                  | Use the comparison only as the investigation trigger. Do not argue that Node images should match JRE-plus-JAR images.                                                      | Addressed in draft             |
| “A registry and layer cache could change the result.”                         | The deployment moved the whole image                  | Scope the diagnosis to the inspected `docker save \| ssh ... docker load` job and note that registry-based pipelines have a different transfer model.                      | Addressed in draft             |
| “Standalone output can omit files that dynamic resolution expects.”           | A smaller image still has to run                      | Treat the build and image-size result as insufficient. Describe the real login and authenticated navigation used to expose missing runtime files and environment problems. | Addressed in draft             |
| “Why not optimize the deployment workflows instead?”                          | Why I kept the deployment workflow out of scope       | State that it was technically possible, but tenant workflows reflected internal organizational decisions and the shared image was the largest identified bottleneck.       | Addressed in draft             |
| “The two before/after ranges are not directly comparable.”                    | Why I kept the deployment workflow out of scope       | Present both as approximate operational observations from different tenant workflows, not as a controlled benchmark.                                                       | Addressed in draft             |
| “This reads as blame directed at whoever wrote the old Dockerfile.”           | The runtime image still contained the build workspace | Explain that Esteban inherited it as a junior and analyze the artifact boundary, not the unknown author's intent.                                                          | Addressed in draft             |
| “About 96% smaller and 25x smaller are not the same wording.”                 | Make the runtime boundary explicit                    | Use “approximately 25 times smaller by ratio” only carefully; prefer “about one twenty-fifth of the old size, or roughly 96% smaller.”                                     | Addressed with precise wording |

## Less-experienced reader

| Point of confusion                                       | Missing prerequisite                                                                                      | Proposed response                                                                                                                             | Decision                            |
| -------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------- |
| Why does a multi-stage build still produce a huge image? | Only files selected for the final stage matter; stages do not prune copied directories automatically.     | Point to the broad `COPY` statements in the simplified inherited skeleton.                                                                    | Addressed in draft                  |
| What is inside `.next` besides runtime files?            | Next.js build output can include persistent build cache and intermediates.                                | Explain only the incident measurement: the full directory included material not needed by the runtime, with `.next` measuring 6.55 GB.        | Addressed without general overclaim |
| What does `output: 'standalone'` change?                 | The build generates the `.next/standalone` server output copied by the final stage.                       | Explain the observed output boundary immediately before the new skeleton.                                                                     | Addressed in draft                  |
| Why copy `.next/static` and `public` separately?         | The `.next/standalone` output does not make those asset-copy steps disappear in this container structure. | Make the explicit copies visible in the simplified skeleton.                                                                                  | Addressed in draft                  |
| Why run as a non-root user?                              | Selecting a different runtime user can expose permission failures.                                        | Retain `USER node` in the skeleton and include permission failures in validation scope; do not add ownership behavior absent from the source. | Addressed in draft                  |
| Does local login prove production correctness?           | Local E2E validation and production deployment measurement cover different boundaries.                    | State what the login proved and what it did not.                                                                                              | Addressed in draft                  |

## Rejected objections

- A comprehensive comparison of Docker registries, layer caching, compression, and
  SSH transfer tuning would turn this incident into a general deployment tutorial.
  The draft names that boundary but does not solve every transfer model.
- A precise attribution of every byte inside `.next` is unnecessary without the raw
  directory listing. The supported finding is the measured directory size and the
  known broad copy boundary.
- A controlled cross-tenant benchmark is not available. The supplied before/after
  ranges are useful operational observations, but the article must not normalize
  away differences between tenant workflows or conditions.
