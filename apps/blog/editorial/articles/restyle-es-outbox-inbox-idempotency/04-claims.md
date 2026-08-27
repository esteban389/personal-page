# Claim register

The translation may preserve but not broaden the claims in the published English
source. Source locations below refer to
`apps/blog/src/content/posts/outbox-inbox-idempotency.md`.

| ID   | Claim                                                                                                                                         | Kind                      | Basis                                      | Source or reproduction                                               | Status              |
| ---- | --------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------- | ------------------------------------------ | -------------------------------------------------------------------- | ------------------- |
| C-01 | Support cases included missing or inconsistent student/user relationships, including three enabled Users records sharing one document number. | Observed event            | Personal observation                       | Opening, paragraphs 7-10                                             | Supported as stated |
| C-02 | The exact historical operation that created those three records is unknown; repeated requests are only one possible explanation.              | Alternative explanation   | Personal observation                       | Opening, paragraph 11                                                | Supported as stated |
| C-03 | A local transaction in one service cannot atomically commit or roll back another service's local transaction.                                 | Technical fact            | Official documentation                     | “The direct call still contains two transactions”; footnote `outbox` | Supported as stated |
| C-04 | A timeout means the response did not arrive, not that the remote service failed to commit.                                                    | Technical fact            | Official documentation and traced scenario | Direct-call section; footnote `retries`                              | Supported as stated |
| C-05 | Saving Student state and its outbox row in one local transaction preserves the pending intent after the request ends.                         | Proposed design or action | Official documentation                     | “The outbox preserves Student's intent”; footnote `outbox`           | Supported as stated |
| C-06 | Reusing one idempotency key lets Users identify retries as attempts at the same operation.                                                    | Proposed design or action | Official documentation                     | “Repeated delivery introduces idempotency”; footnote `retries`       | Supported as stated |
| C-07 | Storing the idempotency key and original result in an inbox lets Users return the prior `userId` without repeating user creation.             | Proposed design or action | Official documentation                     | “The inbox keeps the Users result”; footnote `inbox`                 | Supported as stated |
| C-08 | A unique inbox key is required to arbitrate concurrent requests that both miss the initial lookup.                                            | Technical fact            | Prisma transaction and uniqueness behavior | Users snippet explanation; footnote `prisma`                         | Supported as stated |
| C-09 | The scoped guarantee is one business effect for one idempotency key, not literal exactly-once delivery.                                       | Technical fact            | Official documentation                     | Conclusion section; footnote `idempotency`                           | Supported as stated |
| C-10 | Idempotency identity and business uniqueness answer different questions.                                                                      | Technical interpretation  | Source-backed synthesis                    | “Idempotency does not replace business rules”                        | Supported as stated |

## Claim-kind vocabulary

- Observed event
- Observed association
- Causal hypothesis
- Alternative explanation
- Proposed design or action
- Deployed design or action
- Measured outcome
- Unmeasured outcome
- Prospective success or failure signal
- Technical fact
- Interpretation or opinion

## Basis vocabulary

- Official documentation
- Source code
- Executable reproduction
- Published research
- Personal observation
- Inference
- Opinion

## Status vocabulary

- Supported as stated
- Unresolved
- Contradicted
- Not yet tested

Status records what the current basis supports; it never changes the claim kind. A
causal hypothesis supported as a hypothesis has not become a demonstrated causal
relationship. “Supported as stated” applies only when the source or reproduction
supports both the wording and the declared kind.

## Unresolved evidence questions

None introduced by the translation. The unknown historical cause remains explicitly
unknown under C-02.

## Approval checkpoint

- [x] The translation preserves the claims and bases of the already published source.
