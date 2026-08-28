# Post image brief

The post image is required by the editorial workflow because it carries the
article across homepage cards, related-post cards, and social previews. Approve
the concept before generating or selecting the final asset.

## Article signal

- Central thesis: a runtime image should contain runtime requirements; an inherited
  frontend image carried gigabytes of build output into every deployment transfer.
- Reader takeaway: inspect image contents, narrow the runtime boundary, and validate
  the smaller artifact through the real application path, then measure each tenant
  deployment workflow separately.
- Concrete system, object, or event the image can depict: an oversized payload
  carrying a compact runtime core plus unnecessary build material; or one compact
  shared artifact entering two visibly different deployment paths.
- Ideas that must not be implied: the smaller image omits required runtime behavior;
  a registry or cloud migration was the fix; both tenant workflows are identical;
  image size was the only possible bottleneck; any real company or school identity.

## Concept candidates

These directions differ in visual logic: physical bottleneck, cutaway artifact,
and shared payload across distinct workflows. None is selected or approved yet.

### Concept A

- Core idea: an oversized industrial freight crate jammed at the entrance to a
  narrow loading gate, with a compact runtime parcel already fitting through the
  same opening.
- Why it represents this article: it makes the transfer bottleneck physical—the
  deployment path stays fixed while the payload boundary changes.
- Subject and focal point: the gate and the contrast between the oversized crate
  and compact parcel, centered tightly enough that either side can be cropped.
- Composition and negative space: landscape loading bay; gate and parcels inside
  the central half; upper and side areas restrained; lower third mostly concrete
  floor and shadow for the title overlay.
- Palette and lighting: neutral steel, charcoal, and warm concrete with one muted
  cyan accent on the compact parcel; soft directional warehouse light.
- Visual style: tactile editorial still life or restrained architectural
  illustration, with believable mass and no labels.
- Crop resilience: the central gate remains legible in wide, square, and tall
  crops; the size contrast survives even if crate edges are cropped.
- Avoid: shipping-company branding, speed lines, cloud imagery, embedded numbers,
  or suggesting that changing the network gate was the solution.
- Likely failure modes: looking like a generic logistics article; making the small
  parcel appear to bypass rather than pass through the same deployment boundary.

### Concept B

- Core idea: a cutaway container whose outer shell is packed with bulky scaffolding,
  spare crates, and temporary construction material around one compact, complete
  machine at its center.
- Why it represents this article: the outer container represents the old runtime
  image; the compact machine represents the actual runtime, while the surrounding
  construction material represents build workspace copied into production.
- Subject and focal point: one open cutaway box centered on the compact inner
  machine, not a side-by-side before/after diagram.
- Composition and negative space: orthographic three-quarter view inside the
  central half; quiet upper background and low-detail lower foreground for crop and
  title safety.
- Palette and lighting: matte off-white container, graphite construction pieces,
  deep blue runtime core, cool studio lighting with controlled shadows.
- Visual style: museum-model photography or precise editorial 3D illustration;
  tactile, sparse, and text-free.
- Crop resilience: the nested relationship remains understandable from a central
  crop; no meaning depends on edge annotations or tiny parts.
- Avoid: literal code, file trees, glowing sci-fi cores, exploded-view labels, or
  implying that every surrounding file was individually proven unnecessary.
- Likely failure modes: drifting into generic “bloat” imagery; making the runtime
  core look magical or suggesting that the optimization merely compressed the
  same contents.

### Concept C

- Core idea: one compact sealed payload at a central fork entering two different
  industrial routes—one a direct transfer chute, the other a layered conveyor—while
  a faint oversized footprint behind it shows the previous payload's scale.
- Why it represents this article: it centers the final result: the same smaller
  runtime artifact improved two tenant deployment workflows without redesigning
  either route.
- Subject and focal point: the compact payload and fork, with both distinct routes
  visible but subordinate.
- Composition and negative space: high oblique view; payload and fork in the
  central half; routes curve upward rather than into the lower title area; lower
  third remains a dark, low-detail floor plane.
- Palette and lighting: dark slate environment, subdued cyan payload, one route in
  warm gray and one in cool gray; restrained pools of industrial light.
- Visual style: architectural model or editorial logistics diagram rendered as a
  physical scene, not a software architecture diagram.
- Crop resilience: square/tall crops retain the payload and the beginning of both
  routes; wide crops reveal more of their different mechanics without changing the
  core meaning.
- Avoid: network-node clichés, arrows, labels, tenant counts, fake timing text,
  product logos, or implying the two workflows are technically identical.
- Likely failure modes: becoming an abstract DevOps diagram; making the two routes
  look like a choice or failover rather than existing tenant-specific paths.

## Selected direction

- Selected concept: Concept A — Freight bottleneck, selected by Esteban on
  2026-08-28.
- Required changes: Preserve the same physical gate for both payloads. Make it
  unambiguous that the compact parcel passes through the existing boundary while
  the oversized crate is obstructed by its own bulk. Keep the scene restrained and
  editorial rather than dramatic or promotional.
- Generation or sourcing prompt: Create a high-resolution 16:9 editorial image of
  an industrial loading bay viewed from a slightly elevated three-quarter angle. A
  narrow steel freight gate sits at the exact visual center. One oversized,
  unbranded shipping crate is visibly unable to fit cleanly through the gate, while
  a compact sealed parcel of the same material and construction fits through that
  same opening. Show believable physical scale, weight, and clearance; the
  relationship should read immediately without arrows, labels, numbers, or text.
  Use restrained architectural composition, matte steel and charcoal surfaces,
  warm concrete, and one muted cyan accent on the compact parcel. Light the scene
  with soft directional warehouse light and controlled shadows. Keep the gate and
  both payloads inside the central half of the frame. Leave the lower third as a
  quiet, darker concrete floor with minimal detail for a white title overlay. The
  result should feel like tactile editorial still-life photography or a precise
  architectural illustration, not an advertisement or software diagram. Target at
  least 1600 × 900.
- Negative prompt or exclusions: No words, numbers, Docker or company logos,
  school identifiers, shipping-company branding, terminal output, code, fake UI,
  arrows, speed lines, clouds, networks, glowing circuitry, neon cyberpunk light,
  robots, people, decorative gears, or scattered parcels. Do not depict a new or
  wider gate, a bypass route, compression effects, broken cargo, or missing
  contents. Do not imply that changing the deployment path was the solution.
- Crop-safe focal area: Gate centered within the middle 40% of the canvas; compact
  parcel and the most informative portion of the oversized crate within the middle
  55%. Wide crops may show the full loading bay, while square and tall crops must
  retain the gate, the compact parcel, and enough of the large crate to preserve
  the size contrast. Keep all critical relationships above the lower third.
- Provisional alt-text intent: Describe an oversized freight crate obstructed at a
  narrow loading gate while a compact parcel fits through the same opening. Final
  wording must be written from the generated or sourced asset.

## Final asset

- Candidate source file:
  `/Users/esteban389/.codex/generated_images/01a0496d-a299-7522-a451-e00ba6f05312/exec-c7480a12-06dc-47b2-91e3-2b8f56a4eab0.png`
- Candidate dimensions: 1672 × 941 PNG.
- Final project source file:
  `apps/blog/src/assets/posts/shrinking-nextjs-docker-image/freight-gate-runtime-boundary.webp`
- Final dimensions and format: 1672 × 941 WebP, converted at quality 90 with the
  blog's existing Sharp dependency.
- Final alt text: A large wooden freight crate is blocked in front of a
  narrow steel gate while a smaller blue crate sits beyond the same opening.
- Attribution or license, when applicable: Generated with the built-in OpenAI image
  generation tool; no external source asset used.
- Homepage/card crop checked: Passed representative centered `object-fit: cover`
  crops derived from the current card CSS: desktop tall (780 × 580), square (480 ×
  480), and narrow mobile tall (360 × 576). Every crop retains the oversized crate,
  unchanged gate, and blue parcel; the lower title region stays dark and quiet.
  Browser verification also passed on 2026-08-28 in the actual article cover at
  1440 × 1000 and 390 × 844 viewports and in the 1440 × 1100 homepage feature.
- Social preview checked: Passed a centered 1200 × 630 Open Graph crop. The complete
  relationship remains legible with substantial quiet lower space.

## Approval checkpoint

- [x] Esteban approved Concept A on 2026-08-28.
- [x] Esteban approved the final image, crop behavior, and alt text on 2026-08-28.
