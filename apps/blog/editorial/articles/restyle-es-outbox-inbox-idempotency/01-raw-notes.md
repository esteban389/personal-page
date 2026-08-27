# Spanish translation raw notes

## User request

> Procede a generar la traduccion y publicarla

## Repository-backed interpretation

- Translate the currently published English post at
  `apps/blog/src/content/posts/outbox-inbox-idempotency.md` into natural Latin
  American Spanish.
- Publish a Spanish Astro entry with a natural localized slug, `lang: 'es'`,
  `draft: false`, and the same stable `translationKey` as the English entry.
- Add that `translationKey` to the English frontmatter because it is not currently
  present; do not change the English body.
- Preserve the original publication date, all first-person material, every
  uncertainty boundary, code block, diagram state transition, footnote, and URL.
- Reuse the exact hero asset Esteban approved immediately before commissioning
  the translation. Do not regenerate or edit it.
- Do not add Spanish DEV or Medium syndication metadata without a separate request.

## Existing explicit image approval

Esteban approved the final asset and this alt-text description in the immediately
preceding publication exchange:

> Two separate silver trays labeled OUTBOX and INBOX sit across an open gap; the
> outbox retains a stack of envelopes while two matching envelopes approach the
> inbox, which returns a blue result card.

The translation reuses that same asset and crop behavior; no visual claim changes.

## Source material

- Canonical source post:
  `apps/blog/src/content/posts/outbox-inbox-idempotency.md`
- Hero asset:
  `apps/blog/src/assets/posts/outbox-inbox-idempotency/outbox-inbox-handoff.png`
- Existing footnotes: AWS Prescriptive Guidance, Microservices.io, IETF RFC 9110,
  AWS Builders' Library, and Prisma documentation, exactly as linked in the source.
