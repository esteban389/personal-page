# Revised objections

| Question                                     | Resolution                                                                                                   |
| -------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| Which path had the private20 pool?           | Committee-report recalculation before report creation; not the manual persistent COURSE endpoint. Source D1. |
| Was final executor queue unbounded?          | No. Spring executor has in-memory queue capacity500; persistent jobs have a separate database queue. D2.     |
| What changed first?                          | Note batch/parallel jobs/threads ten to two in ada80b9b1. Existing macro cap retained. D3.                   |
| What changed later?                          | Report executor/batches and Hikari configurable max24 in a2673b108. D3,D5.                                   |
| Did fixes add dedup/coalescing?              | No; describe retained existing behavior. D4.                                                                 |
| Do production tests verify report path?      | No; explicitly limit them to persistent sequential course work. D6.                                          |
| Did each change's contribution get measured? | No; outcome after combined changes, no isolated effect.                                                      |
| Are 24 connections generally recommended?    | No; application default used for mitigation.                                                                 |
| Are sketches runnable or complete?           | No; illustrative, omit transactions/errors/lifecycle.                                                        |
| Did lowering parallelism slow calculations?  | No comparable benchmark; leave unanswered.                                                                   |
| How is the tone friendlier?                  | Concrete verbs, personal sourced reflection, one trigger table, fewer audit-style disclaimers.               |

No additional questions needed for this bounded rewrite. Production race analysis and executor rejection policy are outside the illustrated code's completeness claim.
