# Post image brief

The post image is required by the editorial workflow because it carries the
article across homepage cards, related-post cards, and social previews. Approve
the concept before generating or selecting the final asset.

## Article signal

- Central thesis: Persisting an intent on the sending side and recognizing the
  same operation on the receiving side solve different halves of a retryable
  cross-service request. An outbox makes the work durable; receiver-side
  idempotency, represented by an inbox, makes repetition safe.
- Reader takeaway: Repeated delivery is expected. The useful guarantee is one
  business effect and a repeatable result, not a promise that the request crosses
  the boundary exactly once.
- Concrete system, object, or event the image can depict: A support investigation
  into missing and duplicate student/user relationships; a retained dispatch
  record; repeated copies of one request; and a receiver that recognizes them as
  the same operation.
- Ideas that must not be implied: A distributed ACID transaction, literal
  exactly-once delivery, Kafka or another broker, a full saga, a repaired system
  with no remaining failure modes, or an outbox/inbox flow already deployed for
  student/user creation.

## Concept candidates

### Concept A — The support case becomes a controlled handoff

- Core idea: A tactile school-records still life. A small cluster of crumpled,
  blank support slips and three duplicate identity sleeves sits behind a cleaner
  handoff in the foreground: one work card retained in a metal outgoing tray,
  while two matching copies reach a receiving ledger that has only one completed
  entry and one reusable receipt token.
- Why it represents this article: The duplicate sleeves anchor the image in the
  real support investigation. The retained card communicates durable intent, and
  the single ledger entry plus repeated copies communicates duplicate-safe
  reception. The image shows the problem motivating a proposed improvement rather
  than pretending the production boundary is already solved.
- Subject and focal point: The focal point is the paired retained card and brass
  receipt token at the center. The duplicate identity sleeves are recognizable
  context in the upper-middle background, not a second dominant subject. All forms
  remain blank and use only an abstract embossed shape to indicate that copies
  belong to the same operation.
- Composition and negative space: High-resolution 16:9 tabletop view with every
  meaningful object in the central 50 percent. Side crops may remove the outer
  support slips without losing the retained-card/ledger relationship. The lower
  third is a quiet matte desk surface with a gentle dark falloff for title overlays.
- Palette and lighting: Restrained charcoal, paper gray, muted school-record blue,
  and one warm brass accent. Soft directional window light, with enough separation
  for the objects to survive a dark card veil.
- Visual style: Editorial documentary still life, physically plausible and a
  little worn rather than pristine product photography.
- Avoid: Legible writing, usernames, document numbers, faces, school or product
  logos, computer screens, a literal system diagram, dramatic cyberpunk lighting,
  or making the duplicate sleeves look like stolen identities.

### Concept B — Two independent bases and one remembered operation

- Core idea: A sparse architectural tabletop model with two separate stone bases
  divided by a visible gap. The left base has a shallow archival drawer retaining
  one faceted blue operation token. Two matching impressions of that token travel
  across the gap. The right base has a single keyed brass socket and a return
  channel that yields the same small result tile for both impressions. Three
  discarded duplicate identity tiles sit in an evidence tray behind the receiver.
- Why it represents this article: The separate bases make the local transaction
  boundary explicit without masquerading as a real architecture diagram. The
  retained token is durable intent; repeated impressions show at-least-once
  attempts; the keyed socket and single result tile show receiver-side recognition
  and response reuse. The evidence tray ties the abstraction back to the support
  case that prompted the design.
- Subject and focal point: The dominant subject is the keyed receiving socket with
  the two matching impressions converging on it. The retained source token remains
  visible just to its left. The evidence tray is small and secondary.
- Composition and negative space: Symmetrical landscape composition with the gap,
  token, and socket inside the central half. A narrow crop still preserves both
  independent bases and the repeated-attempt relationship. The bases occupy the
  middle band; the lower third is unmarked dark slate with low detail.
- Palette and lighting: Cool graphite and desaturated blue with a restrained cyan
  edge on the operation token and warm brass only at the receiver. Soft museum-model
  lighting, no glowing circuitry.
- Visual style: Hand-built architectural maquette photographed as a real physical
  object; sparse, tactile, and diagrammatic without labels or arrows.
- Avoid: Joining the bases with a continuous transaction bar, depicting a message
  broker, showing the duplicates disappearing, using arrows or embedded labels,
  server-rack imagery, network globes, floating holograms, or a perfectly sealed
  machine that suggests complete system resilience.

### Concept C — The retryable mechanical repair

- Core idea: A close editorial photograph of a repaired mechanical relay on a
  workbench. On the left, a spring cassette holds the original punched operation
  card until completion. In the center, two identical brass carriers show that the
  handoff can repeat. On the right, a one-way indexing wheel accepts the first
  carrier and redirects the second to the same shallow receipt cup. A few worn,
  blank incident slips are pinned loosely behind the mechanism.
- Why it represents this article: The visible repair evokes revisiting code first
  written as a junior after repeated support work. The retained card and indexing
  wheel make the two responsibilities distinct, while the two carriers refuse the
  misleading visual shorthand of a request that travels only once.
- Subject and focal point: The central indexing wheel and two identical carriers
  form one compact silhouette. The spring cassette stays close enough that a tall
  crop preserves the full durable-intent-to-deduplication relationship.
- Composition and negative space: Three-quarter view, with the complete mechanism
  contained in the center square. Wide crops reveal more of the repair bench; side
  and portrait crops keep the cassette, carriers, and indexing wheel. The lower
  third is an uncluttered dark bench apron suitable for overlaid white text.
- Palette and lighting: Oiled steel, aged brass, faded blue card stock, and neutral
  wood-black tones. Focused workshop daylight rather than cinematic sparks or neon.
- Visual style: Macro documentary photography of a plausible handmade teaching
  model, with visible screws and repairs that signal iteration rather than magic.
- Avoid: A Rube Goldberg spectacle, gears without a communicative purpose,
  steampunk decoration, legible ticket text, hands or identifiable people, sparks,
  broken glass, a retry loop that appears infinite, or machinery that implies the
  operation itself is globally atomic.

## Selected direction

- Selected concept: **Concept B — Two independent bases and one remembered
  operation (provisional recommendation; not approved).** It conveys the technical
  boundary most cleanly at card size, while the evidence tray keeps the support
  story present without turning the hero into a generic architecture illustration.
- Required changes: Confirm that the evidence tray is legible but subordinate in a
  first visual study. If it reads as unexplained clutter, replace the three tiles
  with one shallow case folder holding three matching punched tabs. Keep the right
  side visibly capable of receiving repeated attempts; do not visualize the second
  attempt as erased or destroyed.
- Generation or sourcing prompt: High-resolution 16:9 editorial photograph of a
  hand-built architectural tabletop maquette representing a retryable handoff,
  viewed slightly from above. Two separate charcoal stone bases sit with a narrow,
  unmistakable gap between them. The left base contains a small open archival
  drawer holding one faceted desaturated-blue operation token. Two identical,
  physical impressions of that token cross the gap toward a single keyed brass
  socket on the right base. A shallow return channel beside the socket presents one
  consistent blue-gray result tile, suggesting that repeated attempts retrieve the
  same outcome. Behind the right base, a small evidence tray holds three matching
  blank identity tiles, a restrained reference to a duplicate-record support case.
  All essential objects stay inside the central half. Leave the lower third as
  quiet, dark slate with very little detail. Soft museum-model lighting, controlled
  shadows, restrained graphite, gray, blue, and brass palette, tactile materials,
  no visual effects, no typography. The scene is an honest physical metaphor, not
  a literal software architecture diagram.
- Negative prompt or exclusions: No words, letters, numbers, titles, labels,
  arrows, code, screens, dashboards, database cylinders, server racks, clouds,
  Kafka imagery, brokers, logos, faces, hands, robots, brains, padlocks, shields,
  glowing networks, floating holograms, neon cyberpunk lighting, magical portals,
  seamless bridge between the bases, one continuous enclosing transaction, erased
  duplicate tokens, tangled cables, busy lower third, edge-cropped focal objects,
  promotional stock-art polish, or claims of exactly-once delivery.
- Crop-safe focal area: Keep the complete retained-token → visible gap → repeated
  impressions → keyed receiver relationship within the central 50 percent of the
  1600 × 900 or larger source. The evidence tray may be lost in the narrowest crop,
  but neither base, the gap, nor the two impressions may be lost. Reserve the bottom
  30–35 percent as low-contrast slate for the homepage title/date overlay.
- Provisional alt-text intent: Describe the actual final image as two separate
  physical bases, one retaining an operation token while repeated matching copies
  reach a receiver that recognizes them as one operation. Mention the duplicate
  identity tiles only if they remain clearly visible and meaningful in the final
  asset. Do not claim that the model is the production architecture or repeat the
  article title.

## Final asset

- Source file: Not generated or selected.
- Final alt text: Pending the approved, inspected asset.
- Attribution or license, when applicable: Pending source selection.
- Homepage/card crop checked: No.
- Social preview checked: No.

## Approval checkpoint

- [ ] Esteban approved the selected concept.
- [ ] Esteban approved the final image and alt text.
