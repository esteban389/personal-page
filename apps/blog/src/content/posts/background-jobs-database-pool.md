---
title: 'Our Background Jobs Exhausted the Database Pool. Then the API Stopped Working.'
description: 'How shared database connections turned grade recalculations into an API outage, and what bounded execution fixed.'
pubDate: '2026-09-11T12:00:00-05:00'
category: 'Technical Articles'
lang: 'en'
translationKey: 'background-jobs-database-pool'
heroImage: '../../assets/posts/background-jobs-database-pool/borrowed-keys.png'
heroImageAlt: 'Brass keys rest on stacked blue folders beneath an empty key rack, beside a separate cream folder.'
draft: false
syndication:
  dev:
    tags: [java, springboot, database, concurrency]
  medium:
    topics: [Java, Spring Boot, Databases, Software Architecture]
---

Teachers were entering grades, but the averages were taking too long to update. Some clicked the button to calculate them again. Then other parts of the app started failing.

This happened over a weekend, while teachers needed to upload grades. I started looking at the logs. Requests were timing out while waiting for database connections.

The calculations ran in the background, inside the same Java application that served those requests. They also used the same connection pool.

## Why we kept the jobs in the app

The application was a student information system built with Java, Spring Boot and MySQL. Entering a grade triggered work to update a student's averages for the term. Other calculations covered a whole section, meaning a group of students.

Each school had its own deployment. Keeping the infrastructure small mattered: a separate worker would be another service to deploy and maintain for each school. Running the jobs inside the web application was a practical choice.

It also meant that teachers browsing the app and calculations updating averages needed connections from the same Hikari pool. Once there were no connections available and the pool had reached its limit, requests had to wait. Wait too long, and they failed. That's the behavior described in [Hikari's configuration documentation](https://github.com/brettwooldridge/HikariCP#configuration-knobs-baby), and it matched the errors in the logs.

Restarting the server brought the app back. Once the jobs resumed, the problems returned. Along with the metrics, that gave me a reason to focus on recalculation work.

## My first fix only helped partway

I initially focused on how many jobs were running at once.

The first change reduced concurrency for the jobs triggered by grade changes. Their batch size, parallel-job limit and executor thread count went from ten to two. It helped, but more grading activity brought the failures back.

There were several ways to ask the application to recalculate averages. They didn't all run the same code:

| Trigger                                          | How it ran                                                                                               |
| ------------------------------------------------ | -------------------------------------------------------------------------------------------------------- |
| A teacher changed grades                         | A persistent note-level job, with concurrency reduced by the first fix.                                  |
| Someone pressed the section recalculation button | A persistent course job that processed students one at a time.                                           |
| Someone generated a committee report             | A separate path that recalculated the course before building the report, using a private 20-thread pool. |

The manual section job already shared a limit of two simultaneous macro jobs with other broad recalculation types. I didn't introduce that limit during this fix.

Its student loop was already sequential. In simplified Java, it looked like this:

```java
// Illustration: the persistent section job.
for (Student student : section.students()) {
    recalculateSubjects(student, period);
    recalculateOverallAverage(student, period);
}
```

The committee-report calculation had its own concurrency to address. Calling everything “the course job” hid that difference.

I hadn't written the original job, but I could have made similar mistakes. I wasn't very familiar with this kind of concurrency control before having to work through it.

## Giving the report calculation a shared limit

The later change replaced the report path's private pool with a shared Spring `ThreadPoolTaskExecutor`. It had eight threads and an in-memory queue capacity of 500 tasks.

Students were submitted in batches of four. The caller waited for one batch to finish before submitting the next:

```java
// Illustration: recalculation before a committee report.
// sharedReportExecutor is injected; the caller runs outside it.
for (List<Student> batch : batchesOf(students, 4)) {
    List<Future<?>> pending = new ArrayList<>();
    for (Student student : batch) {
        pending.add(sharedReportExecutor.submit(
            () -> recalculate(student, period)));
    }
    for (Future<?> task : pending) {
        task.get();
    }
}
```

Both snippets leave out transactions, error handling and lifecycle code. They're sketches of how the work was organized.

The report executor now had limits on both its worker threads and its waiting tasks. Spring exposes those as separate [executor settings](https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/scheduling/concurrent/ThreadPoolTaskExecutor.html). Its in-memory queue was separate from the database queue used by persistent recalculation jobs.

Those persistent jobs already had useful behavior that stayed in place. Asking for the same active section calculation returned the existing job. Repeated grade changes were combined into note-level jobs. If a grade changed while its job was running, that job was marked for another pass afterward. These weren't new features from the emergency fixes.

![Recalculation work and web requests both borrow connections from one shared Hikari pool to reach MySQL.](https://blog.estebanmurcia.dev/images/posts/background-jobs-database-pool/execution-paths.en.svg)

_Different execution paths, the same pool. Limiting background work helps leave connections available for teachers using the app._

I also checked MySQL's connection usage and configured limit, then changed the Hikari configuration. The later fix made the pool configurable with a default maximum of 24 connections. That was part of our mitigation, not a suggested pool size for every application.

## Checking whether teachers could use the app again

After the August 7 deployment settled, I compared roughly 15 minutes of activity across two school deployments. Connection waits and Hikari timeouts disappeared. Grade-reading endpoints stayed responsive during more traffic and hundreds of ordinary recalculations. No new grade-save `500` errors or recalculation failures appeared in that window.

Then came a controlled test: course recalculations alongside large report reads. One school completed three course jobs covering 135 students, plus 20 large reads, without connection waits, timeouts or `5xx` responses.

The other school's first course job took considerably longer. That test was stopped before completion, although the job kept making progress without failures or pool saturation.

These tests exercised the sequential persistent course jobs. They didn't validate the newly batched committee-report calculation. The observations supported recovery after the changes, but didn't isolate how much each change contributed.

The stale averages examined during the audit had also caught up. I hadn't run identical jobs before and after the fix, so I couldn't say whether an individual calculation had become faster or slower.

## The part I'm still working on

I considered moving the work to a dedicated worker, and making a larger change to fetch data in groups before calculating. With teachers waiting to enter grades, I chose the smaller changes that restored availability.

That still leaves plenty to improve. The calculation reads and writes data inside nested student-and-subject loops. Limiting how many calculations run together doesn't remove those queries.

A worker could help isolate the application, but I'd still need to coordinate API and worker versions and control their combined database use.

Weeks later, I'm looking at the recalculation again, this time with more room for metrics and tests. I want a repeatable workload to compare grouped reads and batch writes, checking that the grades stay correct as well as measuring how much work the database does.
