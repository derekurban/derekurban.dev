---
title: Form Platform Modular Architecture
slug: form-platform-modular-architecture
desc: A professional full-stack project centered on stabilizing and extending a legacy dynamic form platform by mapping dependencies, proposing a more composable architecture, and building new integration-oriented modules.
origin: Professional
status: Complete
pinned: true
archived: false
tags: [professional, platform, systems]
tech: [C#, .NET, Entity Framework, ASP.NET MVC, Vue.js]
cardTheme: cocoa
cardForeground: ./assets/card-icon.svg
cardIconSize: 76
projectSize: Large
skillLevel: High
capabilities:
  [
    Legacy System Analysis,
    Software Architecture,
    Dependency Mapping,
    Full-Stack Development,
    Integration Design,
    Internal Tooling,
  ]
startDate: 2022-11-27
endDate: 2023-03-11
duration: 105 Days
contributors: 1
contribution: "Primary contributor"
---

## Overview

This work came out of an internship at `Sunwapta Solutions`, where I initially joined as a junior developer getting up to speed on an internal form-driven business platform. The system itself was already substantial. It supported dynamic form templates, role-aware access, rule-driven behavior, and more complex flows than a simple submit-and-store form application. Forms could contain subsections, subflows, permissions, and behavior that depended on other parts of the system, so even relatively small changes had a way of spreading into multiple layers of the product.

My first contribution was not a greenfield feature. It was debugging. I spent my early time there tracing defects through lower-level engines in the form platform, fixing specific issues, and manually validating the results in an environment that relied more on QA than on automated test coverage. That work became more important than I expected because it exposed how tightly coupled some of the deeper platform behavior had become. A bug fix in one part of the system quickly turned into a broader conversation about dependency mapping, change risk, and whether the current structure was still a good fit for where the product needed to go.

It's why the project is worth documenting. The strongest part of the work wasn't that I fixed a set of bugs. It was that I moved from bug fixing into architectural analysis, proposed a more composable direction for the platform, and then started building against that direction in a real, mixed-stack production environment.

## Platform Context

The platform was built to let businesses manage processes through configurable forms rather than through one hard-coded workflow. That meant the system had to do more than render fields. It also had to understand business rules, dynamic visibility, user groups, permissions, and transitions within a form flow. In practice, that made the platform feel more like a workflow engine wrapped in a form product than like a simple CRUD application.

The technical environment reflected the age and growth of the product. It was a mixed .NET stack using `C#`, older ASP.NET MVC patterns, .NET page-based rendering, and embedded `Vue.js` SPA behavior. Workable, but not a clean, single-paradigm application. Server-rendered views and client-side behavior were living together in ways that made the codebase useful but harder to reason about, especially once new modules and integrations started entering the picture.

That complexity mattered because the company wanted to extend the product. Two of the directions being explored during my time there were a `HubSpot` integration and a compliance-oriented module. Both asked more of the platform than the original three-layer organization was handling comfortably. At a high level, the code followed a simple presentation, business, and data layering model. The problem was that the hierarchy didn't cleanly isolate new module behavior from existing form-engine behavior. Once integrations and new rule domains were introduced, the cost of coupling became much more visible.

## Reframing the Architecture

After getting enough context from debugging and code exploration, I proposed that we rethink how extensions were being added to the platform. The goal was not to rewrite the entire system. That would have been too disruptive, and we had already seen how sensitive some of the dependencies were. The better direction was to identify the boundaries that mattered, make the platform more composable, and create space for new modules without letting them leak into unrelated engine behavior.

I spent time mapping how the platform was organized, where the risky dependencies lived, and how new functionality could be introduced with cleaner contracts. That work was not just code-level refactoring. It also involved UI mockups, architectural proposals, and a presentation that tried to make the technical direction understandable to the people leading the work. I wanted the proposal to answer both the engineering question and the product question: how do we make this easier to extend, and how do we make that extension visible and manageable in the actual administration experience?

The approved direction pushed toward better separation of concerns. If a compliance module evolved, it should not casually break layout behavior. If an integration changed, it should have a clearer contract with the rest of the system. If the platform was going to keep growing, module behavior needed to be easier to reason about than it was in the tighter legacy coupling. That was the architectural shift I helped drive during that period.

## Module Work

Once that direction was approved, I started implementing against it. The most concrete module work I remember from that period was the compliance functionality and lower-level work related to a `HubSpot` integration. The compliance side is easier to describe precisely because I remember the user-facing behavior more clearly. It extended the form platform with richer rule handling around compliance lifecycle events, such as expiry-related notifications, license requirements, and checks around whether required documentation had been uploaded and remained valid.

It wasn't a generic settings page. It had to hook into the form platform's existing behavior model while also representing a more specialized domain of notifications, rule evaluation, and compliance-related state. Getting that to fit cleanly without dragging unrelated layout or engine logic into the same boundary was exactly the kind of architectural pressure that motivated the broader redesign in the first place.

The `HubSpot` work is one place where I want to stay measured. I worked on the lower-level side of that integration effort, but I don't remember enough of the final feature surface to describe it in detail responsibly. What I can say is that it was part of the same broader push: the platform needed a cleaner way to support integrations and specialized module behavior, and my work was tied directly to helping make that possible.

My understanding is that the modular direction and at least some of the work built during that period did make it into later live use, but I wasn't there for the final rollout. I'm comfortable saying I helped design and implement the modular approach and built real pieces of it. I wouldn't present myself as the sole owner of the final shipped state after my departure.

## Working Inside The Legacy Stack

One of the reasons this experience mattered to me is that it forced me to learn several things at once. I wasn't only learning the codebase — I was also learning how to operate inside a workplace development cycle. Reporting work back to a lead and CEO, presenting technical proposals clearly, and being disciplined about when to push an idea versus when to respect the risk profile of a mature internal platform.

Technically, it was also a crash course in a hybrid web stack. I learned `.NET`, `C#`, `Entity Framework`, ASP.NET MVC conventions, page-based server rendering, and how `Vue.js` had been embedded into that environment to create more interactive SPA-style behavior where it was needed. The platform wasn't elegant in the abstract, but it was real. A useful place to learn how product constraints, legacy decisions, and technical debt actually shape day-to-day engineering work.

It wasn't an exercise in ideal architecture, and that's what stuck with me. It was an exercise in reading a system as it existed, finding where it was under strain, and helping move it toward something more maintainable without pretending a clean-sheet rewrite was available.

## Signing Off

This project mattered because it was one of the first times I really understood what it means to work on software that already has history behind it. I did not walk into something clean and greenfield. I walked into something useful, complicated, and a little fragile, and I had to earn enough context to make changes without causing damage.

That is still the part I like most about it. The work forced me to think beyond "can I code this feature?" and into "how does this fit into the shape of the system, and what happens later if we keep building in this direction?" For me, that was a pretty important shift.
