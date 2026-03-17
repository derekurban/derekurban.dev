---
title: Pixelogic GPT
slug: pixelogic-gpt
desc: A compact TypeScript library that wraps OpenAI chat completions, supports schema-shaped responses, and pairs streamed output with a reusable JSON assembly utility.
origin: Personal
status: Complete
pinned: false
archived: true
tags: [personal, developer-tool, ai]
tech: [TypeScript, OpenAI, JSON Schema, Vitest]
cardTheme: teal
cardForeground: ./assets/card-icon.svg
cardIconSize: 80
projectSize: Small
skillLevel: Medium
capabilities:
  [
    OpenAI Integration,
    Streaming Interfaces,
    Structured Output Handling,
    JSON Assembly,
    Library Design,
    Test Coverage,
  ]
startDate: 2023-10-05
endDate: 2023-10-16
duration: 12 Days
contributors: 1
contribution: "100%"
sourceUrl: "https://github.com/derekurban/pixelogic-gpt"
---

## Overview

Pixelogic GPT is a small TypeScript package built to reduce the repeated setup work around OpenAI chat integrations. Instead of leaving each project to recreate the same client wiring, schema-shaped response setup, streamed output handling, and partial JSON reconstruction, the package separates those concerns into two exports: `PixelogicGpt` and `JsonAssembler`.

`PixelogicGpt` handles making chat completion calls and exposes a consistent interface for static and streamed responses. `JsonAssembler` is a lower-level parsing utility that rebuilds objects directly from JSON text or streamed fragments. Together they cover a problem that shows up constantly in AI-enabled applications: it's easy to ask a model for structured data, but it's much harder to consume that structure cleanly once the response starts arriving incrementally.

The project is intentionally narrow — a reusable package for a specific class of integration work: send chat requests, optionally ask for a predictable shape, and make the response easier to consume in real applications.

## Why It Exists

The practical goal was to make later AI features easier to wire into software without rewriting the same integration code over and over. One part of that is request ergonomics — a caller needs to initialize the OpenAI client, pass chat completion arguments through, optionally define a response shape, and capture token usage in a way that's easy to inspect. The other part is response handling. Plain text can be streamed directly into a UI, but structured output becomes much more awkward once it's split across many small fragments.

`PixelogicGpt` wraps the completion call and exposes a small, direct API. `JsonAssembler` focuses on reconstruction, accepting full text, iterators, or stream readers and rebuilding JavaScript values from those inputs. The two responsibilities stay separate, keeping the library small while still flexible enough to reuse across different applications.

## Public API Surface

`PixelogicGpt` is built around the OpenAI Node client, and its surface is intentionally small. `chatCompletion()` accepts standard chat completion arguments and optionally takes a schema map describing the expected response shape. When a schema is provided, the wrapper converts that map into a single function definition named `response`, sends it with the completion request, and parses the returned `function_call.arguments` text through `JsonAssembler`. In the static case, the caller gets a normal JavaScript object instead of a raw JSON string.

The library also carries token counts alongside the response shape when available from the OpenAI client — a small detail, but it makes the package more practical for experiments where prompt and completion usage matter.

![Streaming structured output](./assets/diagrams/streaming-structured-output.png)

## Streaming and JSON Assembly

The streaming path uses the same overall approach, but keeps the streamed form visible to the caller. `streamChatCompletion()` returns an async generator rather than assembling the full result internally. For plain text completions it yields content fragments. For schema-shaped responses it yields chunks of the function-call argument string. Different applications want different behavior at that stage — some want to render the stream immediately, some want to buffer it, some want to progressively rebuild structured state.

Streamed structured output is usually awkward at the application layer. A UI can render plain text token by token easily, but it can't do much with a half-finished object unless something is rebuilding that object while the stream is still in flight. `JsonAssembler` provides that missing layer. It also exposes `onStart`, `onUpdate`, and `onEnd` callbacks, so downstream code can react to partially assembled JSON instead of waiting for the stream to finish.

The test suite covers both sides. `PixelogicGpt` is exercised across static and streaming paths, including schema-shaped responses, while `JsonAssembler` is tested against nested JSON through text input, iterators, and stream readers.

![Optimistic JSON construction](./assets/diagrams/optimistic-json-construction.png)

## Design Boundaries

One important boundary: the schema map is a request-shaping convenience, not a full runtime validation system. The package helps the caller ask for structured output, but it doesn't try to become a broader JSON Schema enforcement layer.

Because the wrapper and parser are decoupled, a caller can use the OpenAI wrapper alone, the parser alone, or the two together. It's a reusable library, not a handful of utilities copied out of a single application.

## Signing Off

Honestly, this was one of those smaller packages that ended up being more useful than its size suggests. A lot of AI work gets annoying not because the hard part is unsolved, but because the same bits of plumbing keep showing up every time. This was my way of taking that plumbing seriously and pulling it into one reusable place. I used this within some of my professional showcases, although it quickly got outmatched by other larger teams making better abstractions and frameworks for AI orchestration & management.

But that is why I like it, its honest about what it is. It is not trying to be some giant framework. Its just a focused library that makes OpenAI integrations cleaner and streamed structured output easier to deal with, and sometimes thats all you need.
