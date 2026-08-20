# Editorial rubric

Use `Pass`, `Needs attention`, or `Blocker`. Do not assign numerical scores. Every
finding must identify its location, evidence, and a concrete next action.

## Thesis and reader outcome

**Pass** when a reader can identify the central claim and what they should
understand or do differently after reading.

**Needs attention** when the article covers a topic competently but lacks a clear
argument or outcome.

**Blocker** when different sections depend on incompatible theses.

## Original contribution

**Pass** when the article includes at least one meaningful personal observation,
original example, implementation lesson, or useful synthesis.

**Needs attention** when the article accurately repeats material readers could get
from the cited documentation without adding judgment or context.

## Technical grounding

**Pass** when important claims have an identifiable basis and limitations are clear.

**Needs attention** when a claim is plausible but broader than its evidence.

**Blocker** when a factual claim lacks a basis, a source does not support it, or an
unverified code sample is presented as working.

## Structure

**Pass** when each section advances the thesis and prerequisites appear before use.

**Needs attention** when sections repeat a point, arrive in the wrong order, or have
no clear role in the argument.

**Blocker** when the conclusion does not follow from the article's reasoning.

## Concrete grounding

**Pass** when abstract claims are supported by behavior, an example, evidence, or a
clearly identified opinion.

**Needs attention** when important paragraphs rely on labels such as “scalable,”
“clean,” or “robust” without explaining the observable property.

## Voice

**Pass** when the prose is direct and carries Esteban's technical judgment.

**Needs attention** when the draft uses generic motivational framing, unnecessary
transitions, repeated summaries, or documentation-like prose without perspective.

**Blocker** when the text attributes invented experience or opinions to Esteban.

## Authorship and generic LLM patterns

**Pass** when the draft's structure, examples, qualifications, and conclusions are
specific to this article and traceable to approved seeds or deliberate human decisions.

**Needs attention** when exact passages rely on generic openings, empty significance
claims, repetitive contrast formulas, excessive symmetry, canned transitions,
abstract adjectives, or a summary conclusion that adds no judgment.

**Blocker** when the opening, thesis, central technical judgment, or conclusion
could be transplanted into an unrelated technology article; when prose presents
model-invented personality as Esteban's voice; or when the mandatory LLM-pattern
audit has not been completed.

Do not use AI-detector scores as evidence. Cite the passage and explain the writing
or reasoning defect directly.

## Factual and source integrity

**Pass** when links, quotations, code results, and factual assertions have been
verified proportionally to their importance.

**Needs attention** when a low-impact claim is explicitly marked unverified.

**Blocker** when a source, quotation, statistic, or result is fabricated or cannot
be traced.

## Publication readiness

**Pass** when frontmatter, links, images, code fences, heading structure, formatting,
Astro checks, the production build, generated route, and search inclusion have been verified.

**Blocker** when required frontmatter is invalid, important images lack useful alt
text, evidence blockers remain, or the blog does not pass its required checks.

An approved hero-image direction and final asset are also required for new articles
created through this editorial workflow, even though Astro keeps `heroImage`
optional for compatibility with older posts.

Phase 1 records these criteria but does not automate publication-readiness checks.
