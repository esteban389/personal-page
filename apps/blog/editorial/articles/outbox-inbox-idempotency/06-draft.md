# Working draft

<!-- This is an editorial artifact, not the Astro post. -->

# What Duplicate Users Taught Me About Outbox and Idempotency

An operation that writes to two services can begin with an ordinary requirement:
create one record, then create the related record in another service. The happy path
is easy to describe. What makes the design harder is everything the network can leave
unanswered between two local transactions.

Transactional outbox, idempotency, and inbox can sound like a lot of architecture
for such a small flow. Each one answers a narrow question. The outbox preserves the
work on the sending side. An idempotency key gives repeated attempts the same
identity. The inbox records what the receiving side already did and what it returned.

I'll trace those responsibilities through a boundary that kept appearing in my
support work. We'll start with why a direct call looked reasonable, follow the
failure that makes its result ambiguous, and add each piece only when the earlier
design needs it.

For this post, I'll call the two services Student and Users. The names are simplified,
but the requirement is one we had at work: creating a student in Student also
required an application-user record in Users.

On paper, the flow was short. Student asked Users to create the user, received a
`userId`, and then saved the student. One request, one response, one relationship
between the records. A direct call seemed proportional to the job.

I first worked on this path when I was a junior. We knew that one service's
transaction did not magically include the other service. The direct call was a
conscious tradeoff for a one-to-one interaction, not an attempt to pretend the
boundary did not exist.

Its appeal was easy to see on the happy path. Student called Users, took the returned
ID, and finished saving the student. The code could read almost like the requirement.

Later, the same boundary kept appearing in support. One student's login reached the
application-user lookup and failed there. When we inspected the data, we found three
enabled user records sharing the same document number. Other cases involved students
who couldn't log in or staff operations that failed because the expected student/user
relationship was missing or inconsistent.

The symptoms varied, but I kept ending up at the same boundary. Student expected one
usable Users record for the student. When that relationship was missing or
ambiguous, an operation that looked like a student problem could fail in Users
instead.

After enough of those tickets, my reaction was not particularly sophisticated: this
is absurd. I knew I could control the requests to Users better, yet I was still
spending time repairing the consequences when that boundary went wrong.

I still do not know which historical operation created those three records. A
repeated request is possible, but other sequences are possible too. I can explain
the failure at the service boundary without pretending that it proves the cause of
that incident.

## The direct call still contains two transactions

At the business level, creating a student and its application user sounds like one
action. The state is still split. Student owns the student record, while Users owns
the user record.

User creation is part of student creation. Student needs the returned `userId` to
connect the records and finish its work. Losing that result leaves the business
operation unfinished from Student's perspective, even if Users has already done its
part.

Each service can make its own changes atomic. What the call cannot do is merge those
local transactions into a single commit or rollback across both services.[^outbox]
Once Users commits, Student cannot undo that transaction as if both changes belonged
to one database.

The direct request also makes Student wait for Users. A failure before Users commits
can stop student creation. A failure after Users commits is more awkward because the
user may exist even though Student did not finish its side.

Suppose Users creates the user and returns a `userId`, but the response never reaches
Student. Student knows that the answer is missing. It does not know whether Users
completed the request. Sending the request again may recover the operation, or it
may repeat the effect unless Users can recognize the attempt.[^retries]

A timeout says that the answer did not arrive. It does not say what Users committed.

## The outbox preserves Student's intent

Later outbox work elsewhere in the system changed how I saw this boundary. The
problem was no longer only that the call could fail. Student's need to create a user
lived inside that one request, and once the request was gone, Student had no durable
record it could return to.

An outbox gives Student that record. Student saves its own change and a create-user
intent in the same local transaction. If the transaction commits, both are stored.
If it rolls back, neither is stored. A separate sender can process the intent
afterward.[^outbox]

That was the part I had been missing on the Student side. The request could end
without taking the required work with it. The outbox row would still say which
operation needed to happen and which student it belonged to.

But keeping the intent available also means a sender may deliver it more than once.
Suppose Users creates the user and returns the result, but Student does not record
that success. The outbox row still looks unfinished, so sending it again is
reasonable from Student's side. Users, meanwhile, may have completed the work
already.[^outbox]

Student now has a way to recover the intent. Users needs a way to recognize that the
next delivery belongs to the same operation.

## Repeated delivery introduces idempotency

This is where idempotency enters the design. Student assigns one `idempotencyKey` to
the create-user operation and reuses it every time the outbox sender delivers that
operation. A fresh key on each attempt would make those attempts look like separate
operations to Users.[^retries]

Student can still retry. The key gives Users a stable identity for understanding
that those attempts belong to the same piece of work.

The terminology can make this sound more abstract than the Student-side code needs
to be. The TypeScript examples in this post are invented, incomplete, and use
Prisma-style calls only to illustrate the two local transactions. They are not
production code.[^prisma]

The Student transaction creates the student and its outbox row together:

```ts
async function createStudent(studentData: StudentData, idempotencyKey: string) {
  return prisma.$transaction(async (tx) => {
    const student = await tx.student.create({ data: studentData });

    await tx.outbox.create({
      data: {
        idempotencyKey,
        studentId: student.id,
        operation: 'create-user',
      },
    });

    return student;
  });
}
```

The outbox row keeps the same `idempotencyKey` whenever the sender tries to deliver
this create-user operation again.

## The inbox keeps the Users result

Once Student can retry, Users needs more than a way to say, “I have seen this
before.” Student still needs the `userId` from the first attempt.

If Users stores only the key, it can avoid creating another user but cannot finish
the original conversation. The inbox needs to keep both the `idempotencyKey` and the
result that belongs to it. A repeated request can then receive the same answer
instead of triggering the same change again.[^inbox]

Here, the inbox is an ordinary table. When the key is new, Users creates the user and
the inbox row in one local transaction. When the key already exists, Users returns
the result it stored earlier.

Keeping both writes in the same transaction is what makes the record trustworthy.
If user creation fails, there should be no inbox entry claiming it succeeded. If the
inbox write fails, the user creation rolls back with it.

The Users-side code can stay fairly small:

```ts
async function createUser(userData: UserData, idempotencyKey: string) {
  return prisma.$transaction(async (tx) => {
    // Ensure it is processed once.
    const previous = await tx.inbox.findUnique({
      where: { idempotencyKey },
    });

    if (previous) return previous.result;

    const user = await tx.user.create({ data: userData });
    const result = { userId: user.id };

    await tx.inbox.create({
      data: { idempotencyKey, result },
    });

    return result;
  });
}
```

The example assumes `idempotencyKey` is unique. Two concurrent calls might both check
the inbox before either one inserts the row, but only one can claim that key. The
other transaction rolls back and can retry. On its next attempt, `findUnique`
returns the result already stored for the operation.[^prisma]

Put the two local transactions side by side and the change becomes easier to see:

```text
Current synchronous flow
Student -> Users: create user
Users -> Users state: save user
Users --> Student: userId
Student -> Student state: save student

Outbox and inbox flow
Student -> Student state: save student + outbox (local transaction)
Outbox sender -> Users: create user [idempotencyKey]
Users -> Users state: save user + inbox result (local transaction)
Users --> Outbox sender: userId
Outbox sender -> Student state: associate userId
Outbox sender -> Users: repeat create user [same idempotencyKey]
Users --> Outbox sender: stored userId
```

## Idempotency does not replace business rules

The same `idempotencyKey` tells Users that this is another attempt at the same
operation. A different key identifies a different operation, even when some fields
in the two requests happen to match.[^retries]

That is all the inbox should decide. It should not compare different requests and
silently merge them because their payloads look similar. Whether two separate
operations are both allowed belongs to domain validation and uniqueness rules, not
to the inbox.

## Repeated delivery, one business effect

The outbox may send the same operation more than once. For one `idempotencyKey`,
Users can recognize the repeat, skip the second user creation, and return the
`userId` it saved the first time.

The delivery still happened more than once. The create-user effect did not. That is
the scoped guarantee here, rather than literal exactly-once delivery.[^idempotency]

What I wanted from this design was not a magical transaction across two services. I
wanted each service to know what it owned once the easy request path stopped being
easy. Student keeps the work it still needs done. Users keeps the result of the
operation it already processed.

I first built the direct path as a junior. Later outbox work gave me a better way to
reason about it, so I came back to the same boundary with different questions. That
is a separate article I want to write: how revisiting earlier work has become part
of how I learn.

[^outbox]: AWS Prescriptive Guidance, [“Transactional outbox pattern”](https://docs.aws.amazon.com/prescriptive-guidance/latest/cloud-design-patterns/transactional-outbox.html); Chris Richardson, Microservices.io, [“Pattern: Transactional outbox”](https://microservices.io/patterns/data/transactional-outbox.html).

[^retries]: IETF, [_RFC 9110: HTTP Semantics_, section 9.2.2](https://www.rfc-editor.org/rfc/rfc9110.html#section-9.2.2); Malcolm Featonby, AWS Builders' Library, [“Making retries safe with idempotent APIs”](https://aws.amazon.com/builders-library/making-retries-safe-with-idempotent-APIs/).

[^inbox]: Chris Richardson, Microservices.io, [“Pattern: Idempotent Consumer”](https://microservices.io/patterns/communication-style/idempotent-consumer.html); Malcolm Featonby, AWS Builders' Library, [“Making retries safe with idempotent APIs”](https://aws.amazon.com/builders-library/making-retries-safe-with-idempotent-APIs/).

[^idempotency]: IETF, [_RFC 9110: HTTP Semantics_, section 9.2.2](https://www.rfc-editor.org/rfc/rfc9110.html#section-9.2.2); AWS Prescriptive Guidance, [“Transactional outbox pattern”](https://docs.aws.amazon.com/prescriptive-guidance/latest/cloud-design-patterns/transactional-outbox.html).

[^prisma]: Prisma Documentation, [“Transactions and batch queries”](https://www.prisma.io/docs/orm/prisma-client/queries/transactions), [“Prisma Client API”](https://www.prisma.io/docs/orm/reference/prisma-client-reference), and [“Error Reference”](https://www.prisma.io/docs/orm/reference/error-reference).

## Questions for Esteban

- None blocking.

## Newly introduced claims

- Both Prisma-style snippets, their model names, `StudentData`, `UserData`, and the
  `{ userId }` result are invented for explanation and intentionally incomplete.
- The invented Inbox model declares `idempotencyKey` unique. A losing concurrent
  insert rolls back its local transaction, and the call can retry.
- The first-person statements about later outbox work changing how I saw this
  boundary and returning to work first built as a junior derive from the supplied
  experience; they do not claim a deployed result.
- The comments that the terminology sounds more abstract than the example code are
  editorial judgments requested in the commission, not measurements of
  implementation complexity.
