# Article brief

## Working title

A 9.48 GB Docker Image Inside an 18–30 Minute Frontend Deploy

## Target reader

Frontend and platform engineers who build or deploy Next.js applications and may
inherit container configuration they did not design.

## Assumed knowledge

Basic familiarity with Docker multi-stage builds, Node.js applications, and CI/CD.
No prior knowledge of Next.js standalone output is assumed.

## Reader outcome

After reading this article, the reader should:

Be able to inspect what a frontend runtime image actually contains, recognize when
a build stage has leaked into the runtime stage, and validate a smaller image as a
working deployment artifact rather than stopping at its reported size.

## Central thesis

When deployment moves a complete Docker image, runtime-image contents become part
of deployment performance. In this incident, separating build artifacts from
runtime files reduced a Next.js image from 9.48 GB to roughly 350-380 MB, but the
important engineering step was validating the smaller container through a real
authenticated flow before treating the optimization as complete. After rollout,
one tenant workflow fell from approximately 18-30 minutes to 5-6 minutes; another
fell from approximately 5-10 minutes to between a few seconds and 2 minutes.

## Primary article job

Explain a technical decision through a real incident and give readers a reusable
inspection and validation method.

## Available material

- Personal experience or observation, including what Esteban directly witnessed:
  inherited the Dockerfile after joining as a junior; initially had no opinion
  about it and used Node.js directly for local work; later began deploying and
  observed 18-30 minute frontend deployments; dreaded them and sometimes batched
  changes to make the wait feel justified; recognized that this could delay
  critical fixes.
- Traced example or code: anonymized, illustrative Dockerfile skeletons comparing
  the inherited runtime stage with the standalone runtime stage. Two commits in
  the private frontend repository are evidence, but proprietary filenames and
  product details will not be copied into the article.
- Measurements or sources: supplied investigation summary: old image 9.48 GB;
  `.next` 6.55 GB; `node_modules` 1.78 GB; optimized images approximately 350-380
  MB; observed deployment duration 18-30 minutes. Repository verification: both
  commits change `Dockerfile` and `next.config.js`, enable `output: 'standalone'`,
  copy only standalone/static/public runtime content, use a slim Node base, and run
  as `node`.
- Decision and deployed results: changing the tenant-specific deployment workflows
  was technically possible but outside the chosen boundary because they reflected
  internal organizational decisions. The shared image was the largest identified
  bottleneck. After rollout, the two observed workflow ranges changed from 18-30
  minutes to 5-6 minutes and from 5-10 minutes to a few seconds-2 minutes.
- Explicitly hypothetical material: none. Dockerfile snippets will be explicitly
  labeled as simplified skeletons rather than the production files.
- Known causal boundary or alternative explanation: the supplied incident evidence
  says the target deployment transferred the full image with `docker save | ssh
docker load`; currently versioned deployment files use a registry, so the
  article must scope the transfer mechanism to the inspected deployment job. The
  post-change ranges are approximate operational observations across different
  tenant workflows, not controlled benchmarks.

## Structural archetype

- Dominant structure: incident-driven technical case study.
- Secondary transition, if any: narrow problem-and-solution walkthrough for the
  Dockerfile comparison and validation method.
- Why the available material supports it: Esteban supplied the personal timeline,
  observed operational consequence, investigation result, implementation, measured
  artifact sizes, validation, and current rollout boundary.

## Tone dimensions

Record `value — source` for each dimension. Use `commission`, `verbatim note`,
`derived from supplied material`, or `default`. First-person distance, non-neutral
emotion, humor other than `none`, vulnerability, and central judgment require
supplied provenance.

- Formality — source: conversational — commission, selected option A
- Stance — source: reflective and exploratory, becoming instructional during the
  Dockerfile comparison — derived from supplied material
- Personal distance — source: first-person — supplied personal experience
- Certainty — source: calibrated — commission and evidence boundaries
- Emotional register — source: candid frustration without dramatization —
  Esteban's supplied statements that the deploys were absurdly slow and that he
  dreaded deploying the frontend
- Humor — source: none; preserve “no joking” only if it reads naturally — default
- Technical density — source: medium-high — selected conversational-technical
  profile and target reader
- Authorial judgment — source: central where supported by the supplied experience;
  otherwise evidence-led — derived from supplied material
- Rhythm — source: deliberately varied, with compact technical sections —
  selected tone profile

## Opening kernel

A frontend deployment could take 18-30 minutes. The author began batching changes
partly because each deployment felt too expensive to justify for a small change.

## Conclusion contract

Return to the behavioral cost of the slow deployment, state the bounded lesson that
runtime artifacts should contain runtime requirements, and leave readers with a
three-part decision rule: inspect contents, minimize the runtime boundary, and test
the actual application path. Close with both observed deployment improvements while
preserving the fact that tenant workflows and conditions differ.

## Deployed observation

- Baselines: 9.48 GB image; approximately 18-30 minutes for one tenant workflow;
  approximately 5-10 minutes for another.
- Observed results: approximately 5-6 minutes for the first workflow; between a few
  seconds and approximately 2 minutes for the second.
- Boundary: operational observations, not a controlled cross-tenant benchmark.
- Follow-up signal: track whether another pipeline stage becomes dominant as image
  transfer becomes cheaper.

## Why I care about this (optional; source required)

Use `Not supplied` when Esteban has not stated a motivation. Do not infer one.

The deploy duration affected day-to-day engineering behavior: Esteban dreaded
frontend deployments and sometimes accumulated changes to make the wait feel
justified. Slow delivery could also delay critical fixes.

## In scope

- The inherited Dockerfile structure and why it produced an oversized runtime image.
- The incident-specific full-image transfer mechanism.
- The measured contents and before/after image sizes.
- Simplified old/new Dockerfile skeletons.
- Standalone output, non-root runtime, and end-to-end validation.
- The author's change in perspective from junior developer to deployment owner.
- The deliberate decision to optimize the shared image rather than redesign
  tenant-specific deployment workflows.
- The two approximate before/after deployment ranges after rollout.

## Out of scope

- Naming the school, company, products, repositories, remotes, or internal infrastructure.
- Publishing proprietary Dockerfiles or environment details.
- A general Docker or Next.js tutorial.
- Presenting the approximate operational ranges as controlled benchmarks.
- Redesigning or evaluating the internal reasons for tenant deployment workflows.
- Criticizing the unknown author of the inherited Dockerfile.
- Treating one incident as proof that every slow deployment is caused by image size.

## Open questions

- No blocking drafting questions.
- No deployment-result question remains; preserve the supplied ranges as
  approximate observations.

## Commission and execution constraints

- Target platform: Esteban's Astro blog; durable technical case study.
- Approximate length: 1,200-1,600 words, including two Dockerfile skeletons.
- Language and locale: English (`en`).
- Required or excluded material: anonymize all organizations and repositories;
  include example structure and Dockerfile skeleton comparison; preserve the
  author's junior-developer context and 18-30 minute observation.
- External research authorization: not requested; use supplied evidence and local
  repository inspection only.
- Code-execution authorization: local read-only repository inspection authorized;
  do not rebuild Docker images or rerun the integration stack for this article.
- Image direction: three initial concepts requested at the image stage.
- Image-concept development authorized: yes, by “Proceed to the next stage” on
  2026-08-28.
- Asset generation authorized: no.
- External asset acquisition authorized: no.

## Approval checkpoint

- [x] Esteban approved this brief on 2026-08-28.
