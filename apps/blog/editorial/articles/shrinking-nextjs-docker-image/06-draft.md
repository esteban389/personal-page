# Working draft

<!-- This is an editorial artifact, not the Astro post. -->

## A 9.48 GB Docker Image Inside an 18–30 Minute Frontend Deploy

Frontend deployments could take anywhere from 18 to 30 minutes. Eventually, I
started letting changes accumulate so the wait felt more justified.

Sometimes that was fine. Sometimes it meant a change sat longer than it should
have. The same delay was harder to accept when the change was a critical fix. I
started to dread deploying the frontend, and the wait began influencing when I
chose to ship changes.

I did not write the Dockerfile behind those deployments. It was already in the
repository when I joined as a junior, and I did not have an opinion about it then.
For local development and builds, I usually ran Node.js directly. The Dockerfile
stayed mostly outside my field of view until I had more experience and was allowed
to perform deployments myself.

Once the cost became part of my own workflow, I investigated why the frontend job
took so much longer than two backend jobs in the same pipeline. Inspecting the
deployment path made the shipped artifact the next object to measure.

## The deployment moved the whole image

The inspected deployment job did not pull the frontend image from a registry. It
used a command shaped like this:

```sh
docker save <image> | ssh <server> docker load
```

In this incident, the job streamed the complete image to the server and loaded it
there. A larger image meant more bytes for that path to transfer and load.

This was also why the two backend services were useful clues. They used the same
broad deployment mechanism but shipped a JRE base plus one application JAR. Their
jobs completed much sooner. The frontend image used Node.js and Next.js; different
runtime stacks need not produce equal image sizes. The comparison only gave us a
specific place to investigate.

This does not prove that image transfer consumed every minute of the observed
18-30 minute duration. Compilation, network throughput, remote disk performance,
image loading, container replacement, and health checks can all contribute. It
does establish that this job moved the entire artifact, making its contents part
of deployment performance.

Other pipelines may behave differently. A registry can reuse layers and changes
the transfer model. The diagnosis here belongs to the inspected full-image
transfer job, not to every slow Docker deploy.

## The runtime image still contained the build workspace

The frontend Dockerfile already used multiple stages, but the final stage copied
far more than the application needed at runtime. Structurally, it looked like the
following example.

```dockerfile
# Simplified, anonymized skeleton — not the production Dockerfile
FROM node:<full-version> AS build
WORKDIR /app

COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:<full-version> AS runtime
WORKDIR /app

COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public
COPY --from=build /app/package.json ./package.json

CMD ["npm", "start"]
```

Multi-stage syntax did not make the runtime image small by itself. The final
`COPY` instructions still selected the complete dependency directory and the
complete Next.js build directory. That included development dependencies and build
output that the running server did not need.

We built and inspected the existing image rather than guessing from the
Dockerfile. It measured 9.48 GB. The `.next` directory accounted for 6.55 GB, and
`node_modules` accounted for another 1.78 GB. In this build, `.next` included the
persistent webpack cache along with runtime output.

Those numbers showed that the build workspace had become the runtime contract.

## Make the runtime boundary explicit

Next.js standalone mode generated the `.next/standalone` output used by the final
stage. We enabled it in the Next.js configuration:

```js
// Simplified configuration excerpt — not the production file
module.exports = {
  output: 'standalone',
};
```

That output gave the runtime stage a narrower set of files to copy. The replacement
structure looked like this:

```dockerfile
# Simplified, anonymized skeleton — not the production Dockerfile
FROM node:<version> AS build
WORKDIR /app

COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:<slim-version> AS runtime
WORKDIR /app
ENV NODE_ENV=production

COPY --from=build /app/.next/standalone ./
COPY --from=build /app/.next/static ./.next/static
COPY --from=build /app/public ./public

USER node
CMD ["node", "server.js"]
```

The copy boundary changed. The runtime stage receives the `.next/standalone`
output, static assets, and public files instead of the full `node_modules` and
`.next` directories. It also uses a slim Node base and runs as a non-root user.

Built from the same source, the resulting images landed in the approximate
350-380 MB range. That is about one twenty-fifth of the original size, or roughly
96% smaller.

Size alone was not enough to call the change complete. A narrow copy can omit a
file resolved at runtime. Changing the runtime user can expose a permission
mistake. The smaller artifact had to run the application, not merely finish
`docker build`.

## A smaller image still has to run

We started the standalone container locally against live user and academic
services plus the identity service. Then we completed a real login and navigated
through an authenticated part of the application.

That path exercised more than a public health endpoint. It required the frontend
server to start, reach its dependencies, complete authentication, serve its
assets, and handle an authenticated route. During that validation we saw no
runtime errors, missing-file failures, or permission problems.

This test supports a specific conclusion: the reduced image contained what that
authenticated application path needed. It does not prove that every route is
covered, and it does not measure how long the image will take to reach the target
server.

These checks answer different questions. Artifact size answers “How much are we
shipping?” A real application flow answers “Did we keep enough for this runtime
behavior?” Neither result substitutes for the other.

## Why I kept the deployment workflow out of scope

Changing the deployment workflow was technically possible. I chose not to start
there. We deploy per tenant, and some tenants use a different workflow because of
internal organizational decisions. Redesigning those paths would have widened the
scope beyond the problem I was trying to solve.

The image was shared across those paths, and it was the largest bottleneck we had
identified. Improving that artifact let us address the common transfer cost
without first changing the tenant-specific workflows.

After rollout, the workflow that had taken roughly 18-30 minutes came down to
approximately 5-6 minutes. A second workflow was already faster at roughly 5-10
minutes; with the smaller image, its deployments ranged from a few seconds to
approximately 2 minutes.

These are operational observations, not controlled benchmarks. The tenant
workflows and their conditions differ, so the two ranges should not be compared as
if only one variable changed. Both improved enough to confirm that the image had
been a material cost in each deployment path.

## Inspect, minimize, test

I inherited a Dockerfile that I barely interacted with, then later inherited the
operational cost of what it shipped. Batching changes made the wait feel more
reasonable, but it did not make delivery faster. Looking inside the artifact gave
us a concrete source of transfer work to address.

This case supports three checks for an inherited runtime image:

1. Inspect the actual runtime image and measure its largest contents.
2. Minimize the final-stage copy boundary to what the application needs at runtime.
3. Test a real application path that can expose missing files, permissions, and
   dependency assumptions.

For this case, the first two steps reduced the image to about one twenty-fifth of
its previous size. The third showed that a real authenticated flow still worked.
The rollout then reduced one deployment path from roughly 18-30 minutes to 5-6
minutes and another from roughly 5-10 minutes to between a few seconds and 2
minutes. Future measurements can show whether another pipeline stage becomes the
next dominant cost.

## Questions for Esteban

- None blocking.

## Newly introduced claims

- **Proposed inference:** Multi-stage syntax alone does not make a runtime image
  small; the files copied into the final stage determine what it contains. Basis:
  old Dockerfile structure and claims C-05/C-06. This stays bounded to artifact
  contents, not compressed transfer size.
- **Proposed validation interpretation:** The authenticated flow exercised server
  startup, service connectivity, authentication, asset serving, and an
  authenticated route. Basis: C-10. This is an interpretation of the supplied test
  path, not a claim of exhaustive coverage.
- **Supplied scope decision:** Tenant deployment workflows differed because of
  internal organizational decisions, so changing them remained outside this
  optimization. Basis: C-19 and Esteban's post-review correction.
- **Supplied operational results:** The two workflows improved from approximately
  18-30 to 5-6 minutes and from approximately 5-10 minutes to a few seconds-2
  minutes. Basis: C-14, C-18, and Esteban's post-review correction. These are not
  controlled benchmarks.
