# Claim register

Important assertions should have an explicit basis. Phase 1 keeps this register
human-maintained; semantic validation is planned for Phase 2.

| ID   | Claim                                                                                                                                                                                         | Kind                      | Basis                     | Source or reproduction                                                              | Status              |
| ---- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------- | ------------------------- | ----------------------------------------------------------------------------------- | ------------------- |
| C-01 | Esteban observed frontend deployments taking approximately 18-30 minutes.                                                                                                                     | Observed event            | Personal observation      | `01-raw-notes.md`, “Examples and experiences”                                       | Supported as stated |
| C-02 | The long deployment affected Esteban's behavior: he dreaded frontend deploys and sometimes accumulated changes to make the wait feel justified.                                               | Observed event            | Personal observation      | `01-raw-notes.md`, “Examples and experiences”                                       | Supported as stated |
| C-03 | The incident-specific deployment job transferred the complete Docker image with `docker save \| ssh ... docker load`.                                                                         | Observed event            | Personal observation      | Supplied investigation summary in `01-raw-notes.md`                                 | Supported as stated |
| C-04 | Under that transfer mechanism, a larger image increases the bytes that must be transferred and loaded.                                                                                        | Technical fact            | Source code and inference | Supplied command shape; bounded to full-image transfer without registry-layer reuse | Supported as stated |
| C-05 | The inherited frontend runtime stage copied the full `node_modules` and full `.next` output.                                                                                                  | Technical fact            | Source code               | Old `Dockerfile` in the private frontend repository                                 | Supported as stated |
| C-06 | The old image measured 9.48 GB, including 6.55 GB under `.next` and 1.78 GB under `node_modules`.                                                                                             | Measured outcome          | Executable reproduction   | Supplied investigation summary; raw command output not preserved here               | Supported as stated |
| C-07 | The fix enabled Next.js standalone output and copied only the standalone server, static assets, and public files into a slim, non-root runtime stage.                                         | Deployed design or action | Source code               | Two inspected optimization commits in the private frontend repository               | Supported as stated |
| C-08 | Builds from the two branches produced images in the approximate 350-380 MB range.                                                                                                             | Measured outcome          | Executable reproduction   | Supplied investigation summary and both commit messages (~350 MB and ~370 MB)       | Supported as stated |
| C-09 | The size change from 9.48 GB to 350-380 MB is approximately a 25x reduction and about 96% smaller.                                                                                            | Measured outcome          | Inference                 | Calculation from C-06 and C-08; use approximate language                            | Supported as stated |
| C-10 | The optimized standalone container passed a local end-to-end login and authenticated navigation against live user, academic, and identity services without missing-file or permission errors. | Measured outcome          | Executable reproduction   | Supplied investigation summary and both commit messages                             | Supported as stated |
| C-11 | The optimization commits are present on both relevant remote `main` refs in the local clone.                                                                                                  | Deployed design or action | Source code               | Local branch-containment checks in the private frontend repository                  | Supported as stated |
| C-12 | The same optimization is not yet present on `maintenance`.                                                                                                                                    | Unmeasured outcome        | Source code               | Local branch comparison of `Dockerfile` and `next.config.js`                        | Supported as stated |
| C-13 | The optimized image has now been deployed through both tenant workflow categories described by Esteban.                                                                                       | Deployed design or action | Personal observation      | `01-raw-notes.md`, post-review correction                                           | Supported as stated |
| C-14 | For the first tenant workflow, the observed deployment range changed from approximately 18-30 minutes to approximately 5-6 minutes.                                                           | Measured outcome          | Personal observation      | `01-raw-notes.md`, post-review correction                                           | Supported as stated |
| C-15 | Current versioned `ci-v2`/`ci-v3` deploy definitions use registry pulls, so they do not independently verify the incident's no-registry job.                                                  | Technical fact            | Source code               | Local `ci-v2/Jenkinsfile.deploy-select` and `ci-v3/Jenkinsfile.deploy-select`       | Supported as stated |
| C-16 | Multi-stage syntax does not itself minimize a runtime image; the final-stage copy boundary determines which build artifacts it contains.                                                      | Technical fact            | Inference                 | Old Dockerfile structure plus C-05 and C-06                                         | Supported as stated |
| C-17 | The authenticated validation exercised server startup, service connectivity, authentication, asset serving, and an authenticated route, but not every application path.                       | Interpretation or opinion | Inference                 | Supplied validation path in C-10                                                    | Supported as stated |
| C-18 | For the second tenant workflow, the observed deployment range changed from approximately 5-10 minutes to between a few seconds and approximately 2 minutes.                                   | Measured outcome          | Personal observation      | `01-raw-notes.md`, post-review correction                                           | Supported as stated |
| C-19 | Tenant deployment workflows differed because of internal organizational decisions, so Esteban chose not to change that boundary during this optimization.                                     | Deployed design or action | Personal observation      | `01-raw-notes.md`, post-review correction                                           | Supported as stated |
| C-20 | Esteban focused on the shared frontend image because it was the largest identified bottleneck in the investigated deployment paths.                                                           | Interpretation or opinion | Personal observation      | `01-raw-notes.md`, post-review correction                                           | Supported as stated |

## Claim-kind vocabulary

- Observed event
- Observed association
- Causal hypothesis
- Alternative explanation
- Proposed design or action
- Deployed design or action
- Measured outcome
- Unmeasured outcome
- Prospective success or failure signal
- Technical fact
- Interpretation or opinion

## Basis vocabulary

- Official documentation
- Source code
- Executable reproduction
- Published research
- Personal observation
- Inference
- Opinion

## Status vocabulary

- Supported as stated
- Unresolved
- Contradicted
- Not yet tested

Status records what the current basis supports; it never changes the claim kind. A
causal hypothesis supported as a hypothesis has not become a demonstrated causal
relationship. “Supported as stated” applies only when the source or reproduction
supports both the wording and the declared kind.

## Unresolved evidence questions

- Preserve the distinction between observed total deployment duration and the
  unrecorded duration of individual pipeline stages.
- Treat C-14 and C-18 as approximate operational observations rather than
  controlled benchmarks; tenant conditions and workflow details differ.
- Do not infer that changing the image was the only possible optimization. C-19
  records the deliberate scope decision.

## Approval checkpoint

- [x] Esteban approved the claims and their stated basis on 2026-08-28.
