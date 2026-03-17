# Project Technology

This file tracks the approved set of technology values used in the `tech` frontmatter field across project entries.

Technology names use their official casing (e.g., `TypeScript`, `Vue.js`, `SvelteKit`). Values are free-form strings — there is no enum enforcement in code — so this file is the canonical reference.

---

## Languages

| Technology | Usage | Notes                        |
| ---------- | ----- | ---------------------------- |
| TypeScript | 8     |                              |
| Java       | 5     |                              |
| C#         | 3     |                              |
| JavaScript | 2     | Use when no TS in the stack  |
| Python     | 2     |                              |
| C++        | 1     |                              |
| HTML       | 2     | Standalone or vanilla stacks |
| CSS        | 2     | Standalone or vanilla stacks |

## Frontend Frameworks

| Technology | Usage | Notes                |
| ---------- | ----- | -------------------- |
| React      | 4     |                      |
| Vue.js     | 2     |                      |
| SvelteKit  | 2     |                      |
| Next.js    | 1     | React meta-framework |

## Backend / Runtime

| Technology  | Usage | Notes                                |
| ----------- | ----- | ------------------------------------ |
| Node.js     | 3     |                                      |
| Express     | 3     |                                      |
| .NET        | 3     | Umbrella for the .NET runtime/SDK    |
| ASP.NET MVC | 1     | Legacy MVC pattern on .NET Framework |
| ASP.NET     | 1     | Modern ASP.NET Core                  |

## Java UI

| Technology | Usage | Notes                     |
| ---------- | ----- | ------------------------- |
| Swing      | 2     |                           |
| JavaFX     | 1     |                           |
| AWT        | 1     | Usually alongside Swing   |

## Databases / Data Layer

| Technology       | Usage | Notes                      |
| ---------------- | ----- | -------------------------- |
| Supabase         | 3     | Auth + Postgres + realtime |
| MySQL            | 1     |                            |
| BigQuery         | 1     |                            |
| Entity Framework | 1     | .NET ORM                   |
| pgvector         | 1     | Postgres vector extension  |

## AI / ML

| Technology | Usage | Notes                   |
| ---------- | ----- | ----------------------- |
| OpenAI     | 4     | SDK or direct API usage |

## Testing

| Technology | Usage | Notes |
| ---------- | ----- | ----- |
| Jest       | 1     | JS/TS |
| Vitest     | 1     | JS/TS |
| JUnit      | 1     | Java  |

## Validation / Schema

| Technology  | Usage | Notes                             |
| ----------- | ----- | --------------------------------- |
| Zod         | 1     | Runtime schema validation         |
| JSON Schema | 1     | Schema spec for structured output |

## Cloud / Infrastructure

| Technology    | Usage | Notes              |
| ------------- | ----- | ------------------ |
| Google Cloud  | 1     |                    |
| Firebase      | 1     | Auth / hosting     |
| Grafana       | 1     | Observability      |
| OpenTelemetry | 1     | Instrumentation    |
| YARP          | 1     | .NET reverse proxy |

## Specialized / Domain

| Technology       | Usage | Notes                          |
| ---------------- | ----- | ------------------------------ |
| Google Maps API  | 1     |                                |
| react-i18next    | 1     | i18n library                   |
| Material UI      | 1     |                                |
| QR Code          | 1     | QR generation library          |
| GS1              | 1     | Product data standard          |
| Canvas Rendering | 1     | HTML5 Canvas / JavaFX Canvas   |
| MIDI Audio       | 1     | Java MIDI playback             |
| MigLayout        | 1     | Swing layout manager           |
| Sockets          | 1     | Raw TCP                        |
| XML              | 1     |                                |
| JDOM             | 1     | Java XML library               |
| WAV/PCM          | 1     | Audio format                   |
| WordsAPI         | 1     | Dictionary/word validation API |

---

## How to Use

- List technologies in the `tech` frontmatter array using the **exact casing** shown in this file.
- Order roughly by importance to the project: language first, then framework, then supporting tools.
- Only list technologies that played a meaningful role. Avoid listing transitive dependencies, standard-library features, or overly generic terms (e.g., don't list `JSON` or `CLI` as technologies).
- Don't list `HTML`/`CSS` when a frontend framework like React or Vue.js is already listed — it's implied.

## Maintenance

1. **Adding a technology** — Add a row to the appropriate category table. Use official casing.
2. **Removing a technology** — Search all `POST.md` files, remove from each, then delete the row.
3. **Renaming / deduplicating** — Update every `POST.md` that uses the old name, then update or merge rows here.
4. **Auditing** — Extract all tech values currently in use:
   ```bash
   grep -roh "tech:.*" src/content/projects/*/POST.md | sed 's/tech: *\[//;s/\]//;s/,/\n/g' | sed 's/^ *//;s/ *$//' | sort -u
   ```
