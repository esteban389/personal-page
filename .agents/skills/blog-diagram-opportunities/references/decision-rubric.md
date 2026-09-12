# Diagram decision rubric

Use this rubric to decide whether a visual reduces reader effort enough to earn
its space. The goal is not to make every article look illustrated.

## Strong signals for a diagram

A diagram is usually useful when the article's claim depends on one or more of
these structures:

- several components and the boundaries or ownership between them;
- an ordered interaction, retry, race, timeout, or failure window;
- state transitions, including invalid or terminal transitions;
- a path that branches based on conditions;
- before/after architecture where responsibility moves;
- a taxonomy whose groups and relationships matter together;
- one source or event affecting several downstream consumers.

The strongest candidate is a passage where prose forces the reader to keep these
relationships in working memory while continuing to read.

## Reasons to reject a diagram

Reject or replace the candidate when:

- it would restate a short linear paragraph;
- it exists mainly to add visual variety;
- the required components, ordering, or causal links are not supported;
- it compresses important qualifications into misleading arrows;
- the labels would contain most of the original prose;
- a table communicates exact mappings more efficiently;
- a chart is needed to show quantity, trend, distribution, or uncertainty;
- a screenshot is the evidence for an interface or observed output;
- a code sample is the clearest representation of syntax or API usage;
- the visual cannot be understood at article width without zooming.

When evidence is incomplete, either defer the diagram or label it explicitly as
a proposal, hypothesis, or simplified model. Visual polish must not manufacture
certainty.

## Selection test

For each candidate, answer:

1. What precise reader question does the visual answer?
2. Which relationship, order, state, or boundary is difficult to retain in prose?
3. Can every node and connection be traced to the article, verified code, a
   source, or an explicitly labeled proposal?
4. What would be lost if this remained prose, a table, a chart, a screenshot, or
   code?
5. Does the diagram introduce a second argument the article does not support?
6. Can its essential point be explained in concise alt text plus adjacent prose?
7. Does it still work for the article's locale and on a narrow screen?

Accept a candidate only when its answers show a meaningful comprehension gain.
Among accepted candidates, prioritize conceptual bottlenecks over section order
and choose the smallest set that covers them.

## Diagram brief schema

Use this structure for each accepted opportunity:

```markdown
### <working title>

- Decision: D2 diagram | table | chart | screenshot | code | no visual
- Reader question: <one question>
- Article claim supported: <claim, with locator>
- Insertion point: <after exact paragraph or before exact heading>
- Form: <architecture map, sequence, state graph, directed flow, decision flow,
  grouped map, or non-D2 alternative>
- Required elements: <source-backed nodes, edges, states, or values>
- Required order or grouping: <only when semantically meaningful>
- Evidence map: <element -> article/source/code locator>
- Non-goals: <what the visual must not imply>
- Accessibility: <alt-text intent and adjacent prose needed>
- Locale plan: <English, Spanish, paired, or language-neutral>
- Open decisions: <ambiguities that would change the structure>
```

An insertion point must be actionable. “Somewhere in the architecture section”
is too vague; identify the paragraph or heading whose mental model the visual
will establish or consolidate.

## Mapping to D2

Use D2 for relationship-heavy, ordered, or state-based technical explanations.
After the brief is accepted, route authoring and rendering to
`blog-d2-diagram`. Do not force a D2 solution when this rubric selects a different
visual form.
