# Post image brief

Concept exploration was reopened for final article preparation. Esteban selected
Concept A and explicitly authorized generation. His final instruction to consider
the article finished approved the existing generated asset and recorded alt text
for publication.

The post image is required by the editorial workflow because it carries the
article across homepage cards, related-post cards, and social previews. Approve
the concept before generating or selecting the final asset.

## Article signal

- Central thesis: Java concurrency becomes easier to navigate when APIs are
  grouped by the responsibility they serve--describing work, executing it,
  obtaining results, protecting shared state, sharing data, coordinating tasks,
  or dividing computation--instead of treated as one flat catalog.
- Reader takeaway: Name the concurrency problem first, then investigate the API
  that owns that responsibility.
- Concrete system, object, or event the image can depict: A classified set of
  mechanisms, the dashboard's profile/orders/recommendations dependency graph, or
  a physical machine whose distinct mechanisms each perform one job.
- Ideas that must not be implied: That the categories are rigid or mutually
  exclusive; that the APIs form one mandatory pipeline; that
  `CompletableFuture` is always preferable; that concurrency guarantees
  parallelism, speed, or shared-state safety; or that all concurrency is a tangle
  of operating-system threads.

## Concept candidates

### Concept A: The responsibility cabinet

- Core idea: A restrained archival cabinet organizes a small collection of
  concurrency mechanisms by purpose. One plain wooden task token sits in front of
  the cabinet while distinct, unlabeled drawers and trays suggest execution,
  results, protected state, handoff, coordination, and divided work.
- Article claim or tension: The apparent sprawl becomes navigable once the reader
  stops treating every class as another item in a flat pile and starts asking
  which responsibility it serves.
- Concrete subject and focal point: A compact metal-and-wood specimen cabinet seen
  slightly from above, with one central drawer open and the task token resting at
  its lip. Neighboring compartments reveal only clear silhouettes: a spool, an
  output tray, a small lockbox, a queue of identical tiles, a gate, and a divided
  measuring rule.
- Composition and negative space: Keep the cabinet and open drawer inside the
  central half. Use a calm wall above and an uncluttered work surface across the
  lower third. Secondary objects should read as groups, not seven equally loud
  icons.
- Palette, lighting, and medium: Editorial still-life photography or highly
  tactile photoreal illustration; slate blue, oxidized steel, warm ash wood, and
  one muted cyan accent; soft side light with controlled shadows rather than a
  glossy product render.
- Crop and overlay survival: The open drawer and task token remain legible in a
  central square or narrow crop. Side drawers may disappear without losing the
  organizing idea. The quiet work surface supports white title text and a dark
  lower veil.
- Misleading implications to avoid: Do not give every API a sealed, exclusive
  compartment or suggest a canonical seven-step workflow. Do not embed names,
  Java logos, numbers, or a literal class hierarchy.
- Likely failure modes or cliches: A generic office filing cabinet, a busy flat
  lay of tiny props, obvious puzzle pieces, labeled infographic drawers, or a
  whimsical fantasy cabinet whose details overwhelm the classification idea.

### Concept B: The dashboard dependency board

- Core idea: Turn the article's semi-realistic dashboard example into a sparse,
  tactile marshalling board: two independent pieces begin on separate tracks; the
  profile piece also releases a recommendation branch; the completed branches
  converge into one assembled dashboard tile.
- Article claim or tension: Starting tasks, waiting for independent results, and
  composing dependent stages are different concerns. The graph earns its
  complexity only when a later operation truly depends on an earlier result.
- Concrete subject and focal point: A tabletop routing board with solid geometric
  tokens rather than text. One blue profile token and one ochre order token travel
  on separate grooves. The profile groove unlocks a smaller cyan recommendation
  token; all three meet in one central, fitted dashboard frame.
- Composition and negative space: Arrange the branch and convergence as a broad,
  shallow Y centered in the middle half, with the assembled frame as the single
  focal point. Leave the bottom third as matte board with only faint continuation
  grooves, and avoid critical endpoints near either side.
- Palette, lighting, and medium: Hand-built paper, wood, and anodized metal
  photographed overhead; deep navy board, off-white routes, muted ochre orders,
  and cyan profile/recommendation pieces; diffuse studio light with subtle real
  texture.
- Crop and overlay survival: The central convergence and three distinct tokens
  survive side cropping; losing the remote starting ends does not destroy the
  dependency relationship. The lower board remains dark and quiet for overlay
  text.
- Misleading implications to avoid: Do not present this as an exact Java
  architecture diagram, place API labels on the routes, imply that stages run in
  a fixed clockwork order, or portray `CompletableFuture` as the article's single
  recommended solution.
- Likely failure modes or cliches: A generic glowing network, a subway map full of
  unreadable stations, floating code, a CI/CD pipeline, too many arrows, or a
  diagram so exact-looking that readers mistake the metaphor for executable
  control flow.

### Concept C: One machine, distinct responsibilities

- Core idea: A cutaway of a small mechanical printing press makes responsibility
  visible without sorting items into boxes. A template describes the job, a drive
  moves it, a guarded register keeps alignment, a feed gate controls admission,
  and an output tray receives the result; paired rollers hint at divisible work.
- Article claim or tension: Parts that participate in the same operation can own
  fundamentally different jobs. Choosing a motor does not replace the guard,
  gate, register, or result tray--just as choosing an executor does not solve
  coordination or shared-state safety.
- Concrete subject and focal point: A compact tabletop letterpress shown in a
  clean three-quarter cutaway, centered on the point where the blank card meets
  the press. The drive wheel, registration pins, guarded mechanism, feed gate, and
  emerging finished card are visible as separate physical responsibilities.
- Composition and negative space: Keep the pressure point and emerging card in
  the central half, with the drive and feed mechanisms tucked close rather than
  spread edge to edge. Let a dark, empty workbench fill the lower third and a plain
  workshop wall occupy the upper corners.
- Palette, lighting, and medium: Restrained technical gouache or screen-print
  illustration with slight paper grain; charcoal, cream, desaturated steel blue,
  and one cyan ink impression; directional workshop light, no neon glow.
- Crop and overlay survival: The press silhouette, pressure point, and emerging
  card remain recognizable in wide, square, and narrow crops. Peripheral handles
  may be lost safely, while the low-detail bench protects the title overlay.
- Misleading implications to avoid: Do not suggest that Java concurrency is one
  linear assembly line, that every program needs every mechanism, or that parallel
  work always accelerates output. The printed card must not contain generated
  text, code, a Java logo, or the article title.
- Likely failure modes or cliches: A steampunk contraption, an overcomplicated
  patent diagram, tiny gears used as a generic technology symbol, a literal
  software factory, or a decorative vintage press with no readable separation of
  responsibilities.

## Selected direction

- Selected concept: Concept A, the responsibility cabinet.
- Required changes: No changes were requested before the first generation. The
  first candidate matched the materials and focal idea but placed two loose trays
  across the title-overlay area. One targeted edit moved those trays into the
  cabinet footprint and cleared the lower 30% while preserving the cabinet,
  objects, lighting, palette, and central token.
- Generation or sourcing prompt:

  ```text
  Use case: photorealistic-natural
  Asset type: landscape hero image for a technical blog, reused in wide social previews and aggressively cropped homepage cards
  Primary request: Create a restrained editorial still life of a compact archival specimen cabinet that makes a large set of mechanisms feel navigable when organized by responsibility. A single plain wooden task token rests at the lip of one open central drawer. Nearby open drawers and shallow trays contain a few distinct, unlabeled physical silhouettes: a spool, an output tray, a small lockbox, a short queue of identical tiles, a simple gate, and a divided measuring rule. The objects suggest different jobs without forming a literal software diagram or mandatory sequence.
  Scene/backdrop: A calm workshop wall above an uncluttered dark work surface; no office environment and no people.
  Subject: A compact metal-and-warm-ash-wood specimen cabinet, seen from a slightly elevated three-quarter angle; the open central drawer and wooden token are the dominant focal point.
  Style/medium: Tactile photoreal editorial still-life photography with real material grain, slight wear, controlled imperfections, and no glossy CGI finish.
  Composition/framing: 16:9 landscape. Keep the cabinet, open drawer, and task token inside the central half so they survive square, narrow, and tall crops. Let peripheral drawers disappear safely. Keep the lower third dark, quiet, and low-detail for a white title and dark overlay. Leave calm wall space in the upper corners.
  Lighting/mood: Soft directional window light from the side, controlled shadows, thoughtful and practical rather than dramatic.
  Color palette: Slate blue, oxidized steel, warm ash wood, charcoal, and one muted cyan accent.
  Constraints: No embedded text, labels, letters, numbers, code, arrows, diagrams, Java logos, product logos, people, hands, or watermark. Do not show exactly seven sealed compartments; use varied open drawers and trays so categories do not appear mutually exclusive. One dominant focal point, restrained detail, crop-safe center, quiet lower third.
  Avoid: Generic office filing cabinet, busy flat lay, puzzle pieces, decorative gears, connected-node networks, circuit boards, floating code, clouds, neon cyberpunk lighting, holograms, sci-fi glow, glossy 3D shapes, fantasy cabinet, steampunk styling, and infographic-like icons.
  ```

- Negative prompt or exclusions: No text, labels, code, logos, watermark, people,
  puzzle pieces, gears, networks, circuit boards, neon, sci-fi glow, glossy 3D,
  exactly seven sealed drawers, or a step-by-step pipeline.
- Crop-safe focal area: Keep the central open drawer, wooden token, and the cabinet's
  core silhouette inside the middle 50% of the 16:9 frame. Peripheral drawers may
  be lost. Reserve the lower third as low-detail work surface.
- Provisional alt-text intent: Describe the actual cabinet, central open drawer,
  task token, and the visibly different objects organized around it. Do not name
  Java or repeat the article title unless the generated image itself requires that
  context.

## Final asset

- Source file: Generated candidate at
  `apps/blog/src/assets/posts/java-concurrency-map/responsibility-cabinet-v1.png`
  (`1672 × 941` PNG). It is wired into the final post frontmatter.
- Final alt text: Approved: "An open metal-and-wood specimen
  cabinet with a spool, lockbox, and measuring tools arranged around a central
  drawer holding a wooden token."
- Attribution or license, when applicable: Generated with the built-in OpenAI image
  tool from the recorded prompt; no external source or attribution requirement.
- Homepage/card crop checked: Composition preflight passed: the cabinet, open
  central drawer, and token occupy the middle half, while the lower 30% is quiet.
  The rendered desktop homepage feature card keeps the full cabinet legible and
  preserves the central open drawer and token. The mobile homepage uses the
  text-only feature treatment, so it does not introduce a second crop.
- Social preview checked: Source dimensions and 16:9 composition pass preflight.
  The production HTML emits the source image in Open Graph, Twitter, and Article
  JSON-LD metadata with the expected 1672-by-941 dimensions.

## Approval checkpoint

- [x] Esteban approved the selected concept.
- [x] Esteban approved the final image and alt text as part of the final publication
      instruction.
