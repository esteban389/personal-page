# Raw notes

Preserve the original language, uncertainty, contradictions, examples, and partial
ideas in this file. Do not turn these notes into polished article prose.

## Contextual dump

Initial supplied summary (LLM-produced, treated as supplied evidence rather than
Esteban-verbatim prose):

> While investigating why the `front` deploy job for [anonymized school]
> was taking dramatically longer than the `academic-api` and `user-api` jobs on the
> same Jenkins pipeline, we found that all three services use the same deploy
> mechanism: `docker save <image> | ssh root@server docker load` — a full binary
> transfer of the image, no registry involved. That means deploy time scales
> directly with image size.

> Comparing the Dockerfiles showed why: the two backend services ship a JRE base
> image plus a single fat JAR — tiny by nature. The frontend, however, was built on
> the full `node` image and its
> final stage copied the entire `node_modules` (including dev dependencies, no
> pruning) plus the entire `.next` build output — which for Next.js includes the
> persistent webpack build cache, not just the runtime files.

> We built both versions side by side to confirm the actual numbers: the existing
> image measured 9.48 GB, almost all of it (`.next`: 6.55 GB, `node_modules`: 1.78
> GB) being build artifacts that are never needed at runtime.

> The fix: enable Next.js's `output: 'standalone'` mode and rewrite the Dockerfile's
> runtime stage to copy only the traced standalone server, static assets, and public
> files, on a slim Node base image running as a non-root user. Rebuilt from the same
> source, the image came down to ~350–380 MB — a ~25x reduction (96% smaller).

> We didn't stop at "it builds smaller" — we validated it actually works: built the
> real image, spun up a local stack with live user and academic service containers
> plus the identity service, ran the new standalone container against it, and
> confirmed a real login and authenticated navigation worked end-to-end with no
> runtime errors, permission issues, or missing files.

> The change has since been pushed to `main` on both relevant remotes, and confirmed
> to build cleanly and produce the same size reduction on both. It's still pending
> on the `maintenance` branch (identical file content there, so the same fix applies
> unchanged) and pending a release/deploy cycle to reach the target server.

The organization, tenant, product, service, repository, and remote identifiers in
the supplied summary were redacted here because this editorial workspace may be
versioned.

Public-draft instruction: anonymize the school, company/product names, repository
names, and remotes.

## Examples and experiences

Esteban's follow-up, preserved verbatim:

> i must say i did not make the first dockerfile, it was already there when i joined
> as a junior, and as a junior, i did not have opinions about it, in fact, when doing
> local builds and such i would use nodejs directly, the only times i would use the
> dockerfile indirectly was lately after getting more experience and being allowed
> to do deploys myself, the deployments where absurdly slow tho, it could literally
> last between 18 to 30 minutes, no joking, it got to the point where i literally
> dreaded deploying front, i intentionally let changes accumulate so that it "felt"
> more justified all that wait, sometimes that was okay, sometimes it wasn't, you
> can imagine the problems that a slow build brought, not only was it annoying for
> us devs, it also made critical fixes slower, etc...

Esteban's post-review correction, preserved verbatim:

> even though it was technically possible to search other improvements by changing
> the deployment workflow, for obvious reasons i chose not to do it and instead
> focus on the docker image which, in the first place, was the biggest bottle neck
> anyway

> we deploy per tenants and some tenants, due to internal organizational decisions,
> have a different deployment workflow, the first one, corresponds to the 18 - 30
> minutes i mentioned, in those cases it was reduced to around 5 to 6 minutes, while
> the second deployment workflow, was already better with a 5 to 10 minutes, it was
> reduced to literally seconds to 2 minutes, a huge improvement in both

Selected tone sample A:

> The frontend deploy was slow for a simple reason: Jenkins had to transfer a 9.48
> GB Docker image before it could load it.

## Tentative claims

- An observed 18-30 minute end-to-end deploy range influenced how Esteban grouped
  frontend changes.
- The incident-specific job transferred the complete image over SSH rather than
  pulling it from a registry.
- Image contents explained the material difference between the frontend job and
  the two backend jobs.
- A standalone Next.js runtime image reduced the artifact from 9.48 GB to roughly
  350-380 MB.
- Local authenticated end-to-end validation supports runtime correctness but does
  not prove the production deploy-time improvement.
- The deployed result is now available for two tenant workflow categories: the
  first changed from approximately 18-30 minutes to 5-6 minutes; the second changed
  from approximately 5-10 minutes to between a few seconds and 2 minutes.
- Changing tenant deployment workflows was technically possible, but Esteban chose
  the shared image boundary because tenant workflows reflected internal
  organizational decisions and the image was the largest identified bottleneck.

## Counterarguments

- A slow deploy can have other bottlenecks: compilation, network throughput,
  compression, remote disk speed, image loading, container replacement, or health
  checks.
- A slim image is not automatically a correct image; aggressive copying can omit
  runtime files or create permissions problems.
- The original Dockerfile may have been a reasonable starting point or written
  under different constraints. The article should analyze the artifact, not assign
  blame to its unknown author.
- Registry-based pipelines may behave differently because layer caching and remote
  pulls change the transfer model.

## Questions and uncertainties

- The exact pre-change measurements are supplied from the incident investigation;
  raw command output is not stored in this editorial workspace.
- The repository commit messages report approximately 350 MB for one branch and
  approximately 370 MB for the other; use the supplied 350-380 MB range or “roughly
  370 MB,” not a false single exact value.
- The new deployment ranges are supplied operational observations, not controlled
  benchmarks. Preserve approximate wording and do not imply identical tenant
  infrastructure or conditions.
- “A few seconds to 2 minutes” is the bounded editorial interpretation of
  Esteban's phrase “literally seconds to 2 minutes.”
- The current versioned `ci-v2`/`ci-v3` deployment definitions use a registry. The
  no-registry mechanism must be attributed only to the inspected incident job.

## Links, code, and source material

- Local source inspected outside this repository: private frontend repository.
- Two optimization commits were inspected, one on each relevant remote `main` ref.
- Both commits modify only `Dockerfile` and `next.config.js` for this optimization.
- A local branch comparison shows the same Dockerfile/Next config optimization
  still absent from `maintenance`.
- The article's Dockerfile code will be a simplified, anonymized skeleton derived
  from the structural difference, not a copy of the production Dockerfile.
