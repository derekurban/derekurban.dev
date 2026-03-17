# Project Capabilities

This file tracks the approved set of capability values used in the `capabilities` frontmatter field across project entries.

Capabilities describe **what a project demonstrates** — concrete technical skills, design patterns, or engineering disciplines. They use Title Case with hyphens for compound words (e.g., `Full-Stack Development`, `AI-Assisted Content Generation`).

---

## Reused Capabilities

These appear across multiple projects. Prefer reusing these over inventing near-duplicates.

| Capability             | Usage | Projects                                                                                        |
| ---------------------- | ----- | ----------------------------------------------------------------------------------------------- |
| Full-Stack Development | 6     | fantasy-factory-ai, form-platform, productivity-social-hub, rent-analytics, spark-bid, study-spark-ai |
| Test Coverage          | 5     | custom-json-text-parser, pixelogic-gpt, reflection-object-inspector, self-checkout-simulation, socket-serialization-lab |
| State Management       | 4     | fantasy-factory-ai, pixel-party-arcade, productivity-social-hub, word-blast-game                |
| Authentication         | 3     | fantasy-factory-ai, productivity-social-hub, spark-bid                                          |
| Game Development       | 3     | driveway-snow-clearing, pixel-party-arcade, word-blast-game                                     |
| Interface Design       | 3     | newcomer-transit-kiosk, self-checkout-simulation, word-blast-game                                |
| Streaming Interfaces   | 3     | fantasy-factory-ai, pixelogic-gpt, word-blast-game                                              |
| API Integration        | 2     | newcomer-transit-kiosk, word-blast-game                                                          |
| Algorithms             | 2     | reflection-object-inspector, wav-signal-processing                                               |
| CRUD Development       | 2     | productivity-social-hub, spark-bid                                                               |
| Data Modeling          | 2     | fantasy-factory-ai, productivity-social-hub                                                      |
| Frontend Development   | 2     | newcomer-transit-kiosk, no-code-form-authoring-tool                                              |
| Internal Tooling       | 2     | form-platform-modular-architecture, no-code-form-authoring-tool                                  |
| JSON Processing        | 2     | pixelogic-gpt, word-blast-game                                                                   |
| Library Design         | 2     | custom-json-text-parser, pixelogic-gpt                                                           |
| Parsing                | 2     | custom-json-text-parser, gs1-nutrition-label-service                                              |
| Reflection             | 2     | reflection-object-inspector, socket-serialization-lab                                             |
| Software Architecture  | 2     | form-platform-modular-architecture, productivity-social-hub                                       |
| Input Handling         | 2     | driveway-snow-clearing, pixel-party-arcade                                                        |

## All Capabilities by Category

### Architecture & Systems Design

| Capability            | Usage |
| --------------------- | ----- |
| Full-Stack Development| 6     |
| Software Architecture | 2     |
| Internal Tooling      | 2     |
| Backend Architecture  | 1     |
| Cloud Architecture    | 1     |
| Integration Design    | 1     |
| Legacy System Analysis| 1     |
| Legacy Modernization  | 1     |
| Incremental Migration | 1     |
| Dependency Mapping    | 1     |
| Reverse Proxy Design  | 1     |
| Fallback Routing      | 1     |
| Rollout Strategy      | 1     |
| Event-Driven Systems  | 1     |
| Client-Server Systems | 1     |
| State Machines        | 1     |

### Data & Processing

| Capability         | Usage |
| ------------------ | ----- |
| Data Modeling      | 2     |
| Parsing            | 2     |
| JSON Processing    | 2     |
| Data Mapping       | 1     |
| Data Normalization | 1     |
| Data Engineering   | 1     |
| Data Visualization | 1     |
| Data Structures    | 1     |
| ETL Pipeline Design| 1     |
| Serialization      | 1     |
| Object Graph Handling | 1  |
| Binary Parsing     | 1     |
| Text Processing    | 1     |
| Document Processing| 1     |
| Signal Processing  | 1     |
| File I/O           | 1     |
| Recursive Descent  | 1     |

### AI & Machine Learning

| Capability                     | Usage |
| ------------------------------ | ----- |
| AI-Assisted Content Generation | 1     |
| AI Orchestration               | 1     |
| OpenAI Integration             | 1     |
| Retrieval-Augmented Generation | 1     |
| Vector Search                  | 1     |
| Knowledge Retrieval            | 1     |
| Structured Output Handling     | 1     |

### Frontend & UX

| Capability            | Usage |
| --------------------- | ----- |
| State Management      | 4     |
| Streaming Interfaces  | 3     |
| Interface Design      | 3     |
| Frontend Development  | 2     |
| Input Handling        | 2     |
| UX Design             | 1     |
| Kiosk UX              | 1     |
| No-Code Tooling       | 1     |
| Form Modeling         | 1     |
| Rule Systems          | 1     |
| State-Based Navigation| 1     |
| UI Flow               | 1     |
| Localization          | 1     |

### API & Services

| Capability        | Usage |
| ----------------- | ----- |
| API Integration   | 2     |
| CRUD Development  | 2     |
| API Client Design | 1     |
| Web Service Design| 1     |
| Realtime Data     | 1     |
| Marketplace Design| 1     |
| File Uploads      | 1     |
| Authentication    | 3     |

### Testing & Quality

| Capability                  | Usage |
| --------------------------- | ----- |
| Test Coverage               | 5     |
| Contract Testing            | 1     |
| Regression Checking         | 1     |
| Deterministic Output Design | 1     |
| Validation                  | 1     |
| Edge Case Handling          | 1     |

### Game Development

| Capability            | Usage |
| --------------------- | ----- |
| Game Development      | 3     |
| Tile Maps             | 1     |
| 2D Rendering          | 1     |
| Animation Loops       | 1     |
| Recursive State Updates| 1    |
| Local Multiplayer     | 1     |
| Threaded Runtime      | 1     |
| Simulation            | 1     |
| Payment Flow Modeling | 1     |

### Infrastructure & Operations

| Capability                    | Usage |
| ----------------------------- | ----- |
| Observability                 | 1     |
| Backup & Recovery             | 1     |
| Standards Compliance          | 1     |
| Performance-Oriented Delivery | 1     |
| Access Control                | 1     |

### Low-Level & Algorithms

| Capability           | Usage |
| -------------------- | ----- |
| Algorithms           | 2     |
| Reflection           | 2     |
| Library Design       | 2     |
| Recursive Traversal  | 1     |
| FFT                  | 1     |
| Reverse Engineering  | 1     |
| Typed Error Handling | 1     |

---

## How to Use

- Each project should list 5-7 capabilities that best describe what it demonstrates.
- Before creating a new capability, check the **Reused Capabilities** table for an existing match.
- Use Title Case with hyphens for compound words.
- Avoid near-duplicates — if the concept already exists under a different name, use the existing one.

### Common merge traps to avoid

| If you're tempted to write...    | Use this instead       |
| -------------------------------- | ---------------------- |
| Input Design                     | `Input Handling`       |
| Streaming, Stream Processing     | `Streaming Interfaces` |
| JSON Assembly, JSON Parsing      | `JSON Processing`      |
| Game Design                      | `Game Development`     |
| CRUD APIs, CRUD Workflows        | `CRUD Development`     |
| Frontend Engineering/Prototyping | `Frontend Development` |
| Utility Design                   | `Library Design`       |
| Test Engineering                 | `Test Coverage`        |
| DOM State Management             | `State Management`     |
| State Coordination               | `State Management`     |
| Database Design                  | `Data Modeling`        |
| Runtime Introspection            | `Reflection`           |
| Deserialization                  | `Serialization`        |
| Internal Platform Design         | `Internal Tooling`     |

## Maintenance

1. **Adding a capability** — Add it to the appropriate category table. Apply it to the relevant project(s).
2. **Removing a capability** — Search all `POST.md` files, remove from each, then delete the row.
3. **Renaming / deduplicating** — Update every `POST.md` that uses the old name, merge rows here, and add the old name to the "merge traps" table.
4. **Auditing** — Extract all capabilities currently in use:
   ```bash
   grep -A 20 "capabilities:" src/content/projects/*/POST.md | grep -E "^\s+\w" | sed 's/^ *//;s/,$//' | sort -u
   ```
