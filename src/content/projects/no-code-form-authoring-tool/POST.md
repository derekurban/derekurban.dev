---
title: No-Code Form Authoring Tool
slug: no-code-form-authoring-tool
desc: A near-production internal feature that introduced drag-and-drop, rule-aware form authoring for a legacy business process platform by shifting reusable form definitions into a richer JSON-based model.
origin: Professional
status: Complete
pinned: true
archived: false
tags: [professional, application, platform]
tech: [Vue.js, C#, .NET, JSON]
cardTheme: amber
cardForeground: ./assets/card-icon.svg
cardIconSize: 80
projectSize: Large
skillLevel: High
capabilities:
  [
    No-Code Tooling,
    UX Design,
    Form Modeling,
    Rule Systems,
    Frontend Engineering,
    Internal Platform Design,
  ]
startDate: 2023-07-06
endDate: 2023-12-09
duration: 157 Days
contributors: 1
contribution: "Primary contributor"
---

## Overview

Another project I worked on at `Sunwapta Solutions` was a no-code authoring tool for the same internal form platform. The motivation was straightforward: too much developer time was still being spent setting up and adjusting business forms for clients, and the platform needed a better way to move some of that power into the hands of administrators.

This wasn't just a visual drag-and-drop exercise. The form platform already had dynamic behavior, rules, permissions, and role-sensitive views, so a no-code builder had to do more than produce a static layout. It had to create reusable form definitions that still behaved correctly once rendered in the existing engine, while also fitting into a legacy environment that was never originally designed around a modern no-code editor.

By the time I left, the feature was working end to end but had not yet gone through final QA. The most honest way to frame it is as a near-production internal feature rather than as a fully shipped product under my ownership.

## Problem It Was Built To Solve

The platform already supported complex forms, but that flexibility still depended heavily on developers. It creates a bottleneck quickly when every new template, rule change, or workflow adjustment carries engineering cost, even when the underlying requirement is really administrative rather than deeply technical.

The no-code tool was meant to change that. Instead of relying on developers to hand-configure more of these form definitions, the goal was to let business administrators build and adjust them directly. The interface needed to expose meaningful flexibility without forcing non-developers to understand the full internal complexity of the platform.

The difficulty was that the old model was not designed with that kind of editing experience in mind. There was older rendering behavior in the system that was closer to producing HTML or XML-shaped output. A no-code builder needed a richer intermediate structure, so the authoring experience and the runtime form engine could both operate against the same definition model in a more maintainable way.

## Authoring Model

A meaningful part of the work was shifting the platform toward a JSON-based structure that carried both form definition and extra metadata about presentation and rule behavior. The metadata mattered because the builder wasn't simply placing fields on a page. It was also defining how those fields should behave, what other parts of the form they depended on, and how the final rendered experience should respond to those rules.

It's what made the feature more than a layout editor. The authoring model had to coexist with:

- authentication and authorization rules
- role-specific views for administrators versus form takers
- existing runtime form behavior
- reusable template definitions that could be edited later

The builder therefore sat at an awkward but important boundary. It had to be intuitive enough for internal or business-side configuration, while still producing a structure disciplined enough for the underlying platform to execute correctly.

## Builder Experience

On the frontend side, I focused heavily on making the experience workable. The user-facing builder in `Vue.js` supported a drag-and-drop style interaction for adding and arranging form elements, changing rule behavior, and linking rules to other fields in a way that was easier to reason about than direct low-level configuration.

Rule systems get confusing quickly, and a no-code builder becomes unusable if it only exposes power without exposing relationships clearly. A lot of the challenge here was finding a way to make field rules, dependencies, and behavior mapping feel intuitive instead of brittle or opaque.

The builder also had to coexist with different runtime views depending on who was using the form. Administrative users and form participants did not need the same interface or the same editing surface, so the work touched more than just the template editor itself. It also influenced how the broader platform thought about authoring versus execution.

## What Was Working When I Left

By the time I left the company, the feature was in a working state. The main authoring path was functional, the richer JSON model was in place, and the builder could support the core interaction pattern of creating and editing structured form templates with rule-aware behavior. I do not want to overstate that into "fully launched under my watch," because that would not be accurate. It still needed QA and whatever final rollout decisions happened after I left.

It's fair to call it a serious implementation rather than a loose prototype. The work had moved well beyond sketches or abstract planning. It was a real attempt to make a complicated internal platform more self-serve and more maintainable by lifting the authoring model into something that administrators could actually use.

This project is also one of the better examples of how frontend and architecture concerns meet. The drag-and-drop experience is the visible part, but the harder part was defining the structure underneath it so the authoring surface and the runtime engine were still aligned.

## Signing Off

I like this project because it forced me to think about what "no-code" really means in practice. It is easy to make something draggable. It is much harder to make it useful, structured, and safe inside a real system that already has rules, roles, and business behavior attached to it.

That is what made this work interesting to me. It was not just UI polish. It was an attempt to make a complicated platform easier for other people to operate without flattening away the logic that made the platform valuable in the first place.
