# Syndication and Spanish translation — September 12, 2026

English blog publication was verified live after commit `05bf234` on September 11.
The user subsequently requested DEV publication, Medium instructions, and a Spanish
translation to be pushed. This authorizes the current publication work.

## DEV

Published English article: https://dev.to/esteban389/our-background-jobs-exhausted-the-database-pool-then-the-api-stopped-working-1d7k

Article ID: 4639683. Public API verified publication, the original blog canonical
URL, and the inline diagram embed. The English image URL is now absolute for
syndication; its asset is unchanged. Tags: java, springboot, database, concurrency.

## Medium handoff

1. Open https://medium.com/p/import while signed in.
2. Import https://blog.estebanmurcia.dev/posts/background-jobs-database-pool/.
3. Review the table, both Java snippets, links, hero image and diagram. Check the
   imported SVG in particular; do not assume it was retained.
4. Add topics: Java, Spring Boot, Databases, Software Architecture.
5. Confirm the canonical link points to the original blog article, then publish.

Medium publication remains manual and was not performed by the agent.

## Spanish translation review

Source: the published English article. Spanish slug:
`los-trabajos-en-segundo-plano-agotaron-el-pool-de-conexiones`.
The translation retains the original publication date, shared translation key,
hero image, source links, numbers and Java logic. Only code comments are translated.
The D2 diagram preserves the English topology with localized labels and alt text.

Terminology: «curso» means a group of students in the Colombian school context;
«nota», «período» and «asignatura» preserve the author's domain vocabulary.

Factual audit: preserved sequential persistent course jobs, the existing shared
macro limit, the separate report executor (8 threads, queue 500, batches 4), the
first reduction from 10 to 2, and the application-specific Hikari maximum of 24.
The translation explicitly preserves the untested report path and lack of a
controlled before/after benchmark.

Pattern audit: «Los profesores estaban ingresando notas...» retains the concrete
opening. «No validaron el recálculo de reportes de comité...» is a necessary scope
qualification, not a decorative contrast. The final paragraph ends on the specific
planned workload comparison; no generic lesson, invented anecdote or slogan added.

Validation: root `pnpm check` and `pnpm build` passed; Pagefind indexed 10 articles
across both languages. Publication verification follows the push.
