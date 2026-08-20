# Writing profile

This profile is a starting contract, not a permanent imitation formula. Update it
from patterns observed in Esteban's real articles after the workflow has been used
several times.

## Voice

- Direct, concise, pragmatic, and technically curious.
- Explain why a technical detail matters before expanding it.
- Prefer concrete behavior over abstract architecture language.
- Make tradeoffs explicit instead of presenting one design as universally correct.
- State uncertainty and knowledge boundaries plainly.
- Distinguish facts, inferences, hypotheses, opinions, and personal observations.

## Structure

- Begin with the problem, observation, or concrete situation rather than a generic introduction.
- Give each paragraph one primary claim.
- Use headings that state their section's subject directly.
- Avoid rhetorical questions as headings.
- Introduce prerequisites before the concepts that depend on them.
- Do not repeat the conclusion in several forms.
- Prefer prose for an argument; use lists when the items are genuinely parallel or sequential.

## Sentences

- Prefer short and medium-length sentences with deliberate variation.
- Flag sentences above 28 words for review.
- Rewrite a long sentence only when it is overloaded or difficult to parse.
- Very short sentences are useful for emphasis, not as a mechanical quota.
- Passive voice is acceptable when the actor is unknown, irrelevant, or intentionally omitted.

## Examples and technical detail

- Prefer one concrete, traced example over several generic examples.
- Connect code and diagrams to the claim they demonstrate.
- Do not present a snippet as executable unless it was verified or clearly labeled incomplete.
- Define specialized terminology at the level required by the target reader.
- Preserve important caveats even when they make the prose less absolute.

## Vocabulary warnings

Flag these expressions for review rather than deleting them blindly:

- leverage
- delve
- seamless
- robust
- holistic
- game-changer
- tapestry
- testament
- unlock
- journey
- dive into

The problem is usually unsupported abstraction, not the individual word. Replace a
warning only when a more concrete statement communicates the idea better.

## Mandatory LLM-pattern audit

Every draft must receive this audit before review can be approved. The goal is not
to evade a detector or add artificial quirks. The goal is to remove statistically
generic prose that obscures Esteban's actual reasoning.

Flag exact passages that exhibit any of these patterns:

- a generic scene-setting opening such as “In today's rapidly evolving landscape”;
- an introduction that announces the article instead of beginning with the problem;
- empty significance claims such as “This is crucial,” “This is powerful,” or
  “This changes everything” without showing the consequence;
- repeated contrast formulas such as “It is not X; it is Y” used as cadence rather
  than necessary reasoning;
- repetitive three-item lists, symmetrical paragraph shapes, or identical transitions;
- excessive rhetorical questions, em dashes, parenthetical asides, or one-line emphasis;
- headings that sound motivational, cinematic, or click-driven instead of descriptive;
- paragraphs that restate the previous paragraph before adding one small point;
- conclusions that summarize every heading or end with a generic call to action;
- abstract nouns and adjectives standing in for observable mechanisms;
- polished certainty that removes caveats, unresolved choices, or scope boundaries;
- phrases that could be moved unchanged into an unrelated technology article.

For every finding, either:

1. replace it with a concrete mechanism, example, constraint, or decision already
   supported by the article;
2. preserve it and explain why its rhythm or wording is intentional; or
3. ask Esteban for the missing judgment or experience.

Never “humanize” prose by inventing anecdotes, adding typos, forcing slang, using
random fragments, or making the tone needlessly combative. Natural voice comes
from specific thought, not cosmetic imperfection.

## Non-negotiable constraints

- Never invent personal experiences, motivations, results, or opinions.
- Never add an unsupported technical claim to make a section feel complete.
- Never fabricate sources, links, quotations, measurements, or statistics.
- Never convert an inference into a fact.
- Put missing information under `Questions for Esteban`.
- Preserve the central meaning of human-authored seed sentences.
- Do not approve review until the mandatory LLM-pattern audit is recorded and its
  material findings are resolved or explicitly accepted by Esteban.
