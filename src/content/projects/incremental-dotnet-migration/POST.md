---
title: Incremental .NET Migration
slug: incremental-dotnet-migration
desc: A professional migration project that used YARP and fallback routing to move a legacy .NET application toward a newer long-term-support stack without requiring one disruptive cutover.
origin: Professional
status: Complete
pinned: true
archived: false
tags: [professional, migration, systems]
tech: [C#, .NET, YARP, ASP.NET]
cardTheme: blue
cardForeground: ./assets/card-icon.svg
cardIconSize: 76
projectSize: Medium
skillLevel: High
capabilities:
  [
    Incremental Migration,
    Reverse Proxy Design,
    Fallback Routing,
    Legacy Modernization,
    Backend Architecture,
    Rollout Strategy,
  ]
startDate: 2023-03-12
endDate: 2023-07-05
duration: 116 Days
contributors: 1
contribution: "Primary contributor"
---

## Overview

One of the more interesting problems I worked on at `Sunwapta Solutions` was helping create an incremental migration path for a legacy .NET application. The platform was running on an older framework version that no longer had the long-term support profile the team wanted, but the system was too large and too entangled for a single "stop everything and rewrite it" migration.

We knew we needed to move forward, but we couldn't afford to break the existing application while doing it. The platform already carried a lot of business behavior, and a large one-shot migration would have created too much risk, too much downtime potential, and too much uncertainty around rollback.

The direction I proposed was an incremental migration strategy based around `YARP`. Instead of forcing an all-at-once replacement, the idea was to let old and new application paths coexist so that newer slices of the system could be introduced gradually while the legacy system remained available as a fallback.

## Why Migration Was Hard

The difficulty wasn't simply "upgrade package versions." The application had already accumulated meaningful complexity. It mixed older .NET conventions, server-rendered behavior, and newer interactive pieces in a way that made a total migration expensive to coordinate. There were too many dependencies and too many unknowns to assume one clean cutover would go smoothly.

The business constraint made it more serious. This wasn't a side project where a few days of instability would be acceptable. The application was already doing real work, which meant migration had to be designed as an operational strategy, not just a coding exercise.

I didn't treat the problem as purely a framework upgrade. The harder question was how to migrate safely. We needed a path where new endpoints or vertical slices could be introduced one at a time, exercised in real conditions, and disabled or bypassed quickly if something went wrong.

## Reverse Proxy Strategy

The core idea was to put a reverse-proxy layer in front of the old and new application paths so requests could be routed selectively. If a migrated slice existed and could service the request correctly, traffic could go there. If it did not, the request could continue through the old path. In effect, the migration could become a controlled divergence rather than a hard replacement.

`YARP` was a good fit for this because it gave us a practical way to introduce that routing behavior inside the .NET ecosystem rather than bolting on an external migration story that would have been harder for the team to own later. The approach let us think in terms of vertical slices and fallback behavior instead of only in terms of environment-level cutovers.

I don't remember the exact old-to-new version mapping precisely enough to pin it to one pair of framework numbers, but the destination was a newer long-term-support era of .NET, around the `.NET 6/7` generation rather than the deprecated version the legacy application was still running on.

## How The Cutover Path Worked

The most useful part of the design was that it wasn't just a router. It was a migration control mechanism. A request could be diverted into the newer path when the migrated feature was ready, but if that path was incomplete or failing, the system could fall back to the older route instead of simply breaking.

The fallback behavior mattered a lot. It gave us a safer way to turn new paths on incrementally and to recover if a migrated endpoint wasn't behaving properly. It also made it possible to think about rollout in smaller pieces. Instead of asking, "is the whole application migrated yet?", we could ask, "is this specific area ready to serve traffic?" A much more workable question on a live legacy system.

One of the early migrated paths was tied to newer module-related work rather than to some isolated toy endpoint, which made the approach more meaningful. The goal was not to prove that YARP could proxy a hello-world request. The goal was to prove that the product could support real incremental movement into the newer stack without abandoning the existing application during the transition.

The diagrams and explanation around this work mattered for the same reason. The implementation itself was only part of the job. The other part was making the migration model clear enough that leadership and the rest of the team could understand how the route selection, fallback behavior, and rollout control would actually work in practice.

## Why It Mattered

The thing I keep coming back to is that it solved the right problem. A lot of migration stories sound strong only because they say "we moved from old thing to new thing." That's not enough by itself. The real challenge was creating a migration strategy that the team could actually use under the constraints it had.

This approach made space for incremental adoption, selective routing, and safer rollback behavior. It also let the legacy application continue doing its job while newer slices were being introduced. I still find that kind of decision compelling — it respects both the technical and organizational reality of the system, not just the ideal version of it.

It also taught me a lot about modernization work more broadly. Framework migration is rarely just about syntax changes. It's often about designing a path that lets a business keep moving while the underlying platform is being reshaped. A different problem, and in my opinion the more interesting one.

## Signing Off

This is probably the strongest single story from that internship because it combined architecture, rollout thinking, and practical risk management in one problem. I was not just updating code. I was trying to create a believable path from an older system to a safer long-term foundation without pretending we could pause the world for a rewrite.

I still like this one because it felt genuinely elegant in a practical way. Not elegant because it was flashy, but elegant because it gave the team options, fallback behavior, and a migration strategy that matched the reality of the system we actually had.
