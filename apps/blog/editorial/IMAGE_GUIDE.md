# Blog post image guide

Every new article developed through the editorial workflow requires an approved
hero-image direction before it becomes `publish-ready`. Astro still keeps
`heroImage` optional so older posts and intentional placeholders remain valid.

## Where the image appears

One `heroImage` is reused across several contexts:

- the large homepage feature;
- homepage and related-post cards with wide, narrow, and tall crops;
- Open Graph and Twitter/X previews;
- structured article metadata.

The image is not automatically rendered as a banner inside the article body.

Cards use `object-fit: cover`, and some place the article title and date over the
lower part of the image. A composition that works only as a landscape rectangle
will lose important details in smaller or portrait-like cards.

## Composition requirements

- Start from a high-resolution landscape asset, preferably at least `1600 × 900`.
- Keep the primary subject and essential relationship inside the central half.
- Make the composition understandable after aggressive cropping on either side.
- Keep the lower third visually quiet enough for white title text and a dark veil.
- Avoid critical text, diagrams, labels, faces, or small objects near an edge.
- Use one dominant focal point rather than a scene full of equally important details.
- Do not embed the article title or other typography in the image.

The final asset must be inspected in both a wide social crop and the actual
homepage/card layouts. Dimensions alone do not prove crop safety.

## Editorial direction

The blog's presentation is restrained and typography-led. Images should support
that character:

- editorial rather than promotional;
- technically specific rather than generically futuristic;
- clear silhouettes and controlled detail;
- natural, architectural, documentary, diagrammatic, or tactile visual language;
- deliberate blue/cyan accents are welcome but not required;
- enough tonal range for both the original image and the dark card overlay.

An illustration, photograph, physical metaphor, or sparse technical diagram can
all work. Choose the medium that communicates the article's mechanism most honestly.

## Concept quality

A useful concept can answer all of these:

1. Which article claim or tension does the image express?
2. What concrete subject carries that meaning?
3. What might a reader incorrectly infer from it?
4. Why will it remain legible in the blog's different crops?
5. Could the same image plausibly illustrate dozens of unrelated technology posts?

If the answer to the fifth question is yes, the concept is too generic.

## Technical and factual integrity

- Do not depict a technical relationship that the article rejects.
- Do not show product logos, proprietary interfaces, or real people without a clear reason and rights.
- Treat visual metaphors as metaphors; do not let them masquerade as architecture diagrams.
- Generated code, terminal output, UI labels, and diagrams are unreliable. Add exact technical text later through controlled design if it is genuinely necessary.
- Record attribution and license information for external assets.

## Alt text

Write final alt text from the actual image, not from the generation prompt. Describe
the content or relationship that matters in context without repeating the post title.
If the image is purely decorative and adjacent text conveys everything, publication
work may choose an empty alt attribute; that decision belongs to the implemented
component and accessibility review, not the concept alone.

## Storage convention

Prefer article-owned assets under:

```text
apps/blog/src/assets/posts/<slug>/
```

Use a descriptive filename such as `transaction-boundary.webp`, not `hero-final-2.png`.
The publication pass is responsible for wiring the final relative `heroImage` path.
