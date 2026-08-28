# Section seeds

Use one to three anchor sentences per planned section. Preserve provenance: package
approval does not turn an AI proposal into an Esteban-authored sentence. Expansion
must preserve the supported claim and remain inside the listed boundaries.

## The deploy I started avoiding

### Seed sentences

| Seed                                                                                                                                   | Provenance                  | Source locator                                |
| -------------------------------------------------------------------------------------------------------------------------------------- | --------------------------- | --------------------------------------------- |
| The Dockerfile was already there when I joined as a junior, and at the time I had no opinion about it.                                 | Derived from supplied input | `01-raw-notes.md`, “Examples and experiences” |
| Frontend deployments could take 18 to 30 minutes, and I eventually started letting changes accumulate so the wait felt more justified. | Derived from supplied input | `01-raw-notes.md`, “Examples and experiences” |
| Sometimes that batching was harmless; sometimes it made changes, including critical fixes, slower to deliver.                          | Derived from supplied input | `01-raw-notes.md`, “Examples and experiences” |

### Expansion boundaries

- Include: junior context, direct Node.js local workflow, later permission to
  deploy, dread, batching behavior, critical-fix consequence.
- Exclude: blame, an invented first deployment scene, precise frequency, or claims
  about team-wide behavior not supplied.
- Relevant claim IDs: C-01, C-02.

### Questions for Esteban

- None blocking.

## The deployment moved the whole image

### Seed sentences

| Seed                                                                                                                                                            | Provenance                  | Source locator                                                 |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------- | -------------------------------------------------------------- |
| The frontend deploy was slow for a simple reason: the inspected job had to transfer a 9.48 GB Docker image before the server could load it.                     | Derived from supplied input | `01-raw-notes.md`, selected tone sample A plus contextual dump |
| In that job, `docker save` streamed the complete image over SSH into `docker load`; it did not pull reusable layers from a registry.                            | AI proposal                 | Claim C-03 in `04-claims.md`                                   |
| That mechanism made image contents part of the deployment path, although it did not prove that image transfer was the only source of the 18-30 minute duration. | AI proposal                 | Claims C-04 and unresolved-evidence boundary in `04-claims.md` |

### Expansion boundaries

- Include: incident-only job shape, backend comparison as clue, other possible
  stages, different registry behavior.
- Exclude: company, school, product, repository, server, or remote names; a claim
  that the transfer alone explains the entire duration.
- Relevant claim IDs: C-03, C-04, C-15.

### Questions for Esteban

- None blocking.

## The runtime image still contained the build workspace

### Seed sentences

| Seed                                                                                                                         | Provenance  | Source locator                                          |
| ---------------------------------------------------------------------------------------------------------------------------- | ----------- | ------------------------------------------------------- |
| The final stage copied all of `node_modules` and all of `.next`, so the runtime image inherited much of the build workspace. | AI proposal | Claims C-05 and C-06 in `04-claims.md`                  |
| The image measured 9.48 GB: `.next` accounted for 6.55 GB and `node_modules` for another 1.78 GB.                            | AI proposal | Claim C-06 in `04-claims.md`                            |
| A Dockerfile can have several stages and still produce an oversized runtime image if its final copies are too broad.         | AI proposal | Inference bounded by C-05 and the illustrative skeleton |

### Expansion boundaries

- Include: explicitly simplified/anonymized skeleton, broad copy mechanism,
  measured directory sizes.
- Exclude: exact proprietary Dockerfile, invented per-file breakdown, claim that
  every file under both directories was unnecessary.
- Relevant claim IDs: C-05, C-06.

### Questions for Esteban

- None blocking.

## Make the runtime boundary explicit

### Seed sentences

| Seed                                                                                                                                                               | Provenance                  | Source locator                                           |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------- | -------------------------------------------------------- |
| Enabling `output: 'standalone'` generated the `.next/standalone` server output copied by the final stage instead of the complete dependency and build directories. | AI proposal                 | Claim C-07 in `04-claims.md`                             |
| The revised runtime stage copied the standalone output, static assets, and public files onto a slim Node base, then ran as the `node` user.                        | AI proposal                 | Claim C-07 in `04-claims.md`                             |
| Rebuilt from the same source, the resulting images measured roughly 350-380 MB, about one twenty-fifth of the old image.                                           | Derived from supplied input | `01-raw-notes.md`, contextual dump; claims C-08 and C-09 |

### Expansion boundaries

- Include: explicit simplified-skeleton label, `next.config` setting, selected copy
  paths, slim runtime, non-root execution, approximate reduction.
- Exclude: exact production filenames/config, claim that slim or non-root caused
  the full size reduction, universal Next.js instructions.
- Relevant claim IDs: C-07, C-08, C-09.

### Questions for Esteban

- None blocking.

## A smaller image still has to run

### Seed sentences

| Seed                                                                                                                                          | Provenance                  | Source locator                                                          |
| --------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------- | ----------------------------------------------------------------------- |
| A small image that cannot complete the application's real path is not a successful optimization.                                              | AI proposal                 | Boundary derived from claim C-10 and `01-raw-notes.md` counterarguments |
| We ran the standalone container against live user, academic, and identity services, then completed a real login and authenticated navigation. | Derived from supplied input | `01-raw-notes.md`, contextual dump                                      |
| That test produced no runtime, permission, or missing-file errors, but it did not measure the target server's deployment time.                | Derived from supplied input | `01-raw-notes.md`, contextual dump and questions                        |

### Expansion boundaries

- Include: local stack, authenticated flow, classes of observed error, distinction
  between runtime correctness and production timing.
- Exclude: exhaustive test coverage, production-equivalence claim, new test steps
  or results.
- Relevant claim IDs: C-10, C-17.

### Questions for Esteban

- None blocking.

## Why the image was the chosen boundary

### Seed sentences

| Seed                                                                                                                                                                                | Provenance                  | Source locator                                           |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------- | -------------------------------------------------------- |
| Changing the tenant deployment workflows was technically possible, but I kept that boundary out of scope and focused on the shared image, the largest bottleneck we had identified. | Derived from supplied input | `01-raw-notes.md`, post-review correction; C-19 and C-20 |
| After rollout, one workflow changed from roughly 18-30 minutes to 5-6 minutes; another changed from roughly 5-10 minutes to between a few seconds and 2 minutes.                    | Derived from supplied input | `01-raw-notes.md`, post-review correction; C-14 and C-18 |

### Expansion boundaries

- Include: tenant-specific workflow boundary, deliberate image scope, approximate
  before/after ranges, and operational-observation caveat.
- Exclude: internal organizational details, controlled-benchmark language, or a
  claim that the image was the only possible optimization.
- Relevant claim IDs: C-13, C-14, C-18, C-19, C-20.

### Questions for Esteban

- None blocking.

## Inspect, minimize, test

### Seed sentences

| Seed                                                                                                                                                                           | Provenance  | Source locator                                                                |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------- | ----------------------------------------------------------------------------- |
| This case supports three checks for an inherited runtime image: inspect what ships, minimize the boundary to runtime requirements, and test the application path that matters. | AI proposal | Conclusion contract in `00-brief.md`, derived from supplied incident evidence |
| The rollout results show why each tenant workflow should be measured on its own terms after changing the shared artifact.                                                      | AI proposal | Claims C-14 and C-18                                                          |

### Expansion boundaries

- Include: bounded reusable method and callback to batching behavior.
- Exclude: universal guarantee, generic motivational ending, controlled-benchmark
  language, or discussion prompt.
- Relevant claim IDs: C-05, C-07, C-10, C-14, C-18.

### Questions for Esteban

- None blocking.
