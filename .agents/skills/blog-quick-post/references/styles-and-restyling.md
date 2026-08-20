# Style sampling and restyling

Treat structural style and writing tone as independent choices. Style names are
shorthand; the chosen contextual sample is the practical contract.

## Contextual samples

When structural style is undecided, select one content kernel from the commission:
the same thesis, concrete example, and intended conclusion. Show each plausible
option as a micro-outline of three to five beats. Do not change claims between
options.

Useful structural options include:

- technical essay: claim, counterpoint, mechanism, qualified conclusion;
- tutorial: observable problem, reproduction, implementation, verification;
- story-led explanation: supplied event or clearly fictional scenario,
  investigation, discovery, lesson;
- opinion: position, strongest objection, response, bounded recommendation;
- notes: observation, implications, constraints, references.

When writing tone is undecided, choose one verified sentence from the commission or
claims register. Rewrite that same meaning once per plausible tone, keeping technical
certainty, terminology, and detail constant. Useful tones include relaxed and
playful, conversational, serious, and technical. Avoid caricature, forced slang,
marketing language, or false confidence.

Keep both comparisons short. If the user specifies both choices, do not interrupt
with samples. If the user says `skip samples`, record the chosen defaults and proceed.

### Canonical comparison example

Use the same content kernel for every structural option. For example:

> Retries can reduce transient failures, but they can amplify load when a dependency
> is already unhealthy.

| Structure       | Tiny preview                                                                                            |
| --------------- | ------------------------------------------------------------------------------------------------------- |
| Technical essay | Claim about retries -> strongest counterpoint -> load-amplification mechanism -> bounded recommendation |
| Tutorial        | Observe the failure -> reproduce retry pressure -> add backoff and limits -> verify behavior            |
| Story-led       | Supplied incident or fictional scenario -> investigation -> retry storm discovery -> lesson             |
| Opinion         | Position on automatic retries -> strongest objection -> response -> scope of the recommendation         |
| Notes           | Observation -> operational implications -> constraints -> references                                    |

For writing tone, preserve that exact claim and technical certainty:

| Tone                | Tiny sample                                                                                                                   |
| ------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| Relaxed and playful | Retries help with a temporary hiccup. They can also keep knocking on the door of a service that is already struggling.        |
| Conversational      | A retry may get you past a temporary failure. It may also make an unhealthy dependency even busier.                           |
| Serious             | Retries mitigate transient failures, but they can increase load on a degraded dependency.                                     |
| Technical           | Retry policies reduce exposure to transient faults while potentially amplifying load during sustained dependency degradation. |

These examples document the comparison method, not mandatory wording. At runtime,
prefer a verified line and content kernel from the actual article.

## Restyling a workspace

For a local tone change, change only the named passage or section and invalidate
`approved.draft` and `approved.review`.

For a whole-draft tone change, invalidate `approved.draft` and `approved.review`
and review the entire result.

For a structural change, update the outline and affected artifacts, invalidate
`approved.outline`, `approved.draft`, and `approved.review`, and reconsider
`approved.claims` when the new structure broadens or reframes a claim.

Invalidate `approved.image` when the new emphasis makes the selected visual
misleading or generic. Do not invalidate it merely because wording changed.

## Restyling an Astro post

1. Read the complete source post, content schema, and relevant locale/translation
   counterpart.
2. Use the workspace slug `restyle-<lang>-<source-slug>`, where `lang` is the
   post's explicit locale and `source-slug` is its current filename slug. Record
   the exact source path and `translationKey`, when present, in `00-brief.md`.
   Resume that workspace only when its recorded source path matches; otherwise
   stop rather than reusing ambiguous editorial history. Copy the source into the
   draft artifact while retaining the source-path note.
3. Preserve frontmatter, facts, code, links, original publication date, attribution,
   and `translationKey`. Work only on the requested locale.
4. Apply the requested structural or tone transformation within its stated scope.
5. Rerun the claims check when meaning or certainty might have shifted, then run the
   mandatory LLM-pattern audit and rubric review.
6. Show a preview or source diff before editing the post under `src/content/posts`.
7. Modify that source only after explicit approval; publishing and Git operations
   remain separately authorized.

Never update a translation automatically to make it match the restyled locale.
Instead, report that its tone or structure may now differ.
