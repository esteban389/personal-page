# Structural outline

## Approved thesis

Proposed, pending Esteban's package approval: when a deployment transfers a complete
Docker image, everything copied into the runtime stage becomes part of deployment
performance. In this incident, reducing a Next.js runtime image from 9.48 GB to
roughly 350-380 MB addressed the transfer mechanism, while an authenticated local
flow tested whether the smaller artifact still worked. After rollout, one tenant
workflow changed from approximately 18-30 minutes to 5-6 minutes, while another
changed from approximately 5-10 minutes to between a few seconds and 2 minutes.

## Opening promise

- Concrete kernel: frontend deployments took 18-30 minutes, and Esteban sometimes
  accumulated changes because a small deployment no longer felt worth the wait.
- Reader payoff: trace that behavior back to the actual artifact, compare the old
  and new runtime boundaries, and learn what must be tested after shrinking an
  image.
- Why any delayed context is necessary: a short account of inheriting the
  Dockerfile explains why it went unquestioned without blaming its unknown author.

## Structural archetype and progression

- Dominant archetype: incident-driven technical case study.
- Secondary transition, if any: narrow problem-and-solution walkthrough for the
  Dockerfile comparison and validation sequence.
- Progression in one sentence: the reader moves from a costly deployment habit,
  through the full-image transfer mechanism and the oversized runtime contents, to
  a smaller tested artifact and two observed rollout results because each section
  exposes the next boundary that needed inspection.

## Example article structure

1. **The deploy I started avoiding** — establish the 18-30 minute observation,
   inherited configuration, and behavioral cost.
2. **The deployment moved the whole image** — scope the `docker save | ssh ...
docker load` mechanism to this incident and connect bytes to transfer work.
3. **The runtime image still contained the build workspace** — show the simplified
   inherited Dockerfile skeleton and the measured contents.
4. **Make the runtime boundary explicit** — introduce Next.js standalone output and
   show the simplified replacement skeleton.
5. **A smaller image still has to run** — describe authenticated end-to-end local
   validation and the failure modes it covered.
6. **Why the image was the chosen boundary** — explain why tenant-specific workflow
   changes stayed out of scope, then report both approximate rollout improvements.
7. **Inspect, minimize, test** — close with a reusable three-part decision rule.

## Argument sequence

### 1. The deploy I started avoiding

- Purpose: establish the operational and human cost before discussing Docker.
- Central claim: the observed 18-30 minute frontend deployments changed how
  Esteban grouped changes.
- Concrete mechanism, example, observation, or evidence: inherited Dockerfile;
  junior-developer context; direct Node.js local workflow; later deployment
  ownership; dread and intentional batching.
- Consequence for the reader: deployment performance is not only CI inconvenience;
  it can influence delivery decisions and slow critical fixes.
- Boundary, failure case, or counterexample when needed: do not criticize the
  Dockerfile's unknown author or imply the configuration was obviously wrong when
  created.
- Transition earned by this section: the duration becomes a concrete symptom worth
  tracing through the deployment job.

### 2. The deployment moved the whole image

- Purpose: identify the incident-specific performance mechanism.
- Central claim: this job transferred and loaded the full image over SSH, so image
  size directly affected how much data the deployment had to move and load.
- Concrete mechanism, example, observation, or evidence: `docker save <image> |
ssh <server> docker load`; backend images completed much sooner under the same
  broad pipeline.
- Consequence for the reader: inspect artifact size before treating CI orchestration
  as the primary problem.
- Boundary, failure case, or counterexample when needed: compilation, network,
  remote disk, container replacement, and health checks can also dominate; current
  registry-based pipelines have a different transfer model.
- Transition earned by this section: although redesigning the deployment workflows
  was technically possible, their tenant-specific organizational boundary and the
  image's size made the shared artifact the selected object of inspection.

### 3. The runtime image still contained the build workspace

- Purpose: explain why the frontend artifact reached 9.48 GB.
- Central claim: the inherited final stage copied complete `node_modules` and
  `.next` directories instead of selecting runtime requirements.
- Concrete mechanism, example, observation, or evidence: simplified old Dockerfile
  skeleton; measured `.next` at 6.55 GB and `node_modules` at 1.78 GB.
- Consequence for the reader: a multi-stage Dockerfile does not guarantee a small
  runtime stage; the copy boundary decides what ships.
- Boundary, failure case, or counterexample when needed: the skeleton is
  illustrative and anonymized, not the production file.
- Transition earned by this section: once the copy boundary is the problem, the
  fix is to make the runtime dependency boundary explicit.

### 4. Make the runtime boundary explicit

- Purpose: show the structural fix without exposing proprietary configuration.
- Central claim: Next.js standalone output generated the `.next/standalone` server
  output copied by the final stage, allowing it to omit the full build workspace.
- Concrete mechanism, example, observation, or evidence: `output: 'standalone'`;
  simplified new Dockerfile skeleton; standalone server, static assets, public
  files, slim Node base, and non-root user.
- Consequence for the reader: the resulting builds measured roughly 350-380 MB,
  approximately 25 times smaller and about 96% below the old image.
- Boundary, failure case, or counterexample when needed: copying fewer files can
  break runtime behavior or permissions; size is not correctness.
- Transition earned by this section: the size result creates a new validation
  question.

### 5. A smaller image still has to run

- Purpose: establish the validation standard used for the changed artifact.
- Central claim: a successful image build was insufficient evidence that the
  standalone runtime was deployable.
- Concrete mechanism, example, observation, or evidence: local stack with live user,
  academic, and identity services; real login and authenticated navigation; no
  observed missing-file, permission, or runtime errors.
- Consequence for the reader: validate the application path most likely to expose
  omitted runtime files or environment assumptions.
- Boundary, failure case, or counterexample when needed: local end-to-end success
  does not measure production transfer or deployment duration.
- Transition earned by this section: with runtime correctness established, the
  article can report the rollout results without confusing them with the local
  validation.

### 6. Why the image was the chosen boundary

- Purpose: explain the deliberate scope decision and report the two deployment
  outcomes.
- Central claim: changing the workflows was technically possible, but the shared
  image was the largest identified bottleneck and the tenant-specific workflows
  reflected internal organizational decisions.
- Concrete mechanism, example, observation, or evidence: after the image rollout,
  one workflow changed from approximately 18-30 minutes to 5-6 minutes; the other
  changed from approximately 5-10 minutes to between a few seconds and 2 minutes.
- Consequence for the reader: optimizing a shared artifact can improve more than
  one deployment path without first redesigning their organizational boundaries.
- Boundary, failure case, or counterexample when needed: the ranges are operational
  observations across different workflows, not controlled comparative benchmarks
  or proof that no other bottleneck exists.
- Transition earned by this section: the measured results support a bounded method,
  not a universal diagnosis.

### 7. Inspect, minimize, test

- Purpose: resolve the opening tension with an actionable method.
- Central claim: runtime-image work should follow three checks: inspect contents,
  minimize the runtime boundary, and test the real application path.
- Concrete mechanism, example, observation, or evidence: 9.48 GB contents,
  standalone selection, and authenticated local validation from this incident.
- Consequence for the reader: inherited Dockerfiles can be evaluated through
  artifact evidence rather than authorship or convention.
- Boundary, failure case, or counterexample when needed: workflow-specific results
  should remain approximate and another pipeline stage may become the next dominant
  cost.
- Transition earned by this section: none; it closes the case with measured but
  qualified operational results.

## Conclusion closure

- Opening tension resolved or reframed: batching changes was a response to an
  expensive artifact path, not a sustainable deployment strategy.
- Qualified conclusion: reducing the image to about one twenty-fifth of its old
  size improved both tenant deployment workflows materially, with different
  before/after ranges and without proving that the image was their only cost.
- Decision rule, practice task, next action, or unresolved question: inspect what
  ships, minimize it to runtime requirements, exercise a real application path,
  and then measure each deployment workflow on its own terms.

## Concepts and prerequisites

- Docker multi-stage builds separate build and runtime stages only when the final
  stage copies a deliberate subset of artifacts.
- Next.js standalone mode generates the `.next/standalone` output used by this
  runtime stage; static and public assets still need explicit copies in this
  structure.
- Full-image SSH transfer and registry/layer-aware deployment are different models.
- Image-size validation and application-behavior validation answer different
  questions.

## Title decision

- Proposed title: “A 9.48 GB Docker Image Inside an 18–30 Minute Frontend Deploy”

## Alternatives still under consideration

- No title alternative remains open after the independent review.
- No rollout-result alternative remains open after Esteban's correction.

## Questions for Esteban

- No blocking questions for the first review package.

## Approval checkpoint

- [x] Esteban approved this outline on 2026-08-28.
