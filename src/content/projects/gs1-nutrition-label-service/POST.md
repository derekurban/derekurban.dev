---
title: GS1 Nutrition Label Service
slug: gs1-nutrition-label-service
desc: A professional data-processing and rendering project that normalized messy GS1 product data into standards-compliant nutrition labels and delivered both inspectable structured data and pre-rendered HTML for a major grocery website.
origin: Professional
status: Complete
pinned: true
archived: false
tags: [professional, service, systems]
tech: [JavaScript, TypeScript, Node.js, Express, GS1]
cardTheme: rose
cardForeground: ./assets/card-icon.svg
cardIconSize: 86
projectSize: Large
skillLevel: High
capabilities:
  [
    Data Normalization,
    Standards Compliance,
    Parsing,
    Web Service Design,
    Edge Case Handling,
    Performance-Oriented Delivery,
  ]
startDate: 2022-08-29
endDate: 2022-11-27
duration: 91 Days
contributors: 2
contribution: "50%"
---

## Overview

This project was a collaborative effort at `Sunwapta Solutions` focused on turning `GS1` product data into usable, standards-compliant nutrition labels for a large grocery client. The core requirement sounded simple on the surface: show nutrition labels on product pages. In practice, the work involved parsing inconsistent upstream product data, normalizing it into a more dependable structure, handling a long tail of real packaging edge cases, and delivering the result in a way that was fast enough to be practical on a high-traffic retail website.

I worked on this with a colleague in a genuinely collaborative split. I would describe it as roughly fifty-fifty rather than trying to carve the work into artificially separate ownership. The project ended up combining data normalization, rendering rules, standards interpretation, and service design into one system.

What makes it portfolio-worthy to me is that it was grounded in a very practical constraint: the consuming website did not want a heavy client-side rendering burden. We needed a solution that could digest complex data centrally and return something the website could use immediately.

## The Data Problem

The upstream source was `GS1`, which provided a standard, but not a perfectly clean one. In practice there were aliases, awkward variants, missing fields, and layout-affecting edge cases that meant the data could not just be passed through directly into a nutrition-label component. Parsing it was its own problem before rendering even started.

The challenge becomes more serious once compliance and presentation rules enter the picture. We weren't rendering a generic nutrition summary. We needed to respect Canadian nutrition-label conventions, which meant the output had to care about things like serving and portion presentation, the order of nutrient information, ingredient-list formatting, and how notices like "may contain" statements should appear.

Even then, the simple cases were only part of the job. Some products needed labels reflecting added ingredients not included in the packaging, like milk or eggs. Some required dual-column formats. Some product groupings represented multiple internal products, each needing its own nutrition treatment. It pushed the system well beyond "take fields and print them in a box."

## Normalizing GS1 Into A Renderable Model

The initial idea was closer to a client-side rendering engine: parse the GS1 data and let the destination website run custom JavaScript to build the nutrition label. We ended up moving away from that because it created too much complexity on the consuming side and was not the best fit for the performance and integration constraints we were working under.

The better approach was to create a more digestible intermediate structure on our side. We built a reflection-style normalized data layer that reorganized the incoming GS1 information into something easier to inspect, validate, and render consistently. That normalization step is what made the rest of the project workable. Instead of every consuming path reinterpreting the GS1 shape, the service could reason over a standardized model that already reflected the rules we cared about.

This also improved quality control. Once the data was normalized into a consistent internal shape, it was much easier to detect when something looked suspicious, when a layout case hadn't been accounted for, or when a product needed a human review instead of blind rendering.

## Delivery Strategy

The final delivery shape was intentionally lightweight. We built a small `JavaScript`/`TypeScript` service, using a simple `Express` server, that exposed two different outputs depending on the use case.

One endpoint returned structured data for inspection and validation. The other returned pre-rendered HTML and CSS so the consuming site could place the nutrition label directly on the page with minimal extra work. The same normalization and rendering engine could support both operational inspection and production display without forcing the website to rebuild the label itself.

The service was tied to the product identification numbers used by the client's site, so the final integration path was straightforward from the website's point of view: provide the product identifier, receive back the rendered nutrition label block, and embed it directly on the product page.

We weren't just building a parser. We were building a service that acknowledged where the final output would live and optimized for that reality.

## Edge Cases And Validation

One of the more useful aspects of the work was building the inspection loop around the parser. We ran the system across the broader product corpus and added notices or checks so problematic products would get flagged for review. A much healthier development cycle than just hoping the parser had already seen every shape of data it would ever encounter.

The long tail was where most of the real work lived. A nutrition label for a straightforward product isn't especially difficult. A label for a product with extra preparation requirements, multiple packaged components, or awkward ingredient structure is where the parser and renderer prove whether they're robust.

The performance constraint also kept the architecture honest. Because the destination was a major grocer website, the final rendering path had to stay lightweight, which helped drive the decision to return already-rendered HTML/CSS rather than making the client rebuild the entire label from raw GS1-derived data in the browser every time.

## Signing Off

I still like this project because it is a good example of real-world data work being messier and more interesting than it sounds at first. "Render a nutrition label" seems small until you actually start dealing with standards, inconsistent source data, layout exceptions, and the reality of where the output has to run.

It also felt satisfying because the final result was concrete. This was not just an internal experiment. It produced something that could actually be used on a live retail website, and I can still appreciate that mix of parsing, standards work, and delivery pragmatism.
