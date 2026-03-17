# Project Tags

This file tracks the approved tag set for project entries.

Tags are stored in the `tags` frontmatter field as a lowercase, hyphen-separated array. Each project should use one origin tag and one or more project-type tags.

---

## Origin Tags

| Tag            | Usage | Description                                                        |
| -------------- | ----- | ------------------------------------------------------------------ |
| `university`   | 11    | Projects created through university coursework or academic teams.  |
| `professional` | 5     | Professional client, job, or production work.                      |
| `personal`     | 4     | Independent projects created outside academic or professional work.|

> Note: `origin` in tags aligns with the `origin` frontmatter field. The `Contracting` origin value maps to the `professional` tag.

## Project-Type Tags

| Tag              | Usage | Description                                                                                                 |
| ---------------- | ----- | ----------------------------------------------------------------------------------------------------------- |
| `application`    | 6     | End-user applications, products, or interfaces.                                                             |
| `systems`        | 6     | Lower-level systems work — protocols, runtimes, serialization, networking, signal processing, infra.        |
| `developer-tool` | 5     | Tools, utilities, libraries, or infrastructure meant to support developers or technical workflows.           |
| `ai`             | 3     | Projects where AI is a central part of the product or technical implementation.                              |
| `game`           | 3     | Play-focused interactive projects, prototypes, or game collections.                                         |
| `platform`       | 3     | Platform-level work focused on shared foundations, composability, or extensible product infrastructure.      |
| `service`        | 1     | Backend or processing work exposed as a focused operational capability.                                     |
| `migration`      | 1     | Incremental modernization or system-transition work where rollout strategy is a core part of the project.   |
| `simulation`     | 1     | Systems that model real-world processes, workflows, or hardware behavior.                                   |

---

## How to Use

- Every project gets **one origin tag** plus **one or more project-type tags**.
- Tags describe a project's identity and purpose, not just its stack.
- Avoid broad implementation-only tags like `web`, `data`, or `library` unless the tag system is revised.
- When adding a new tag, add it to this file first. If an existing tag already covers the concept, prefer the existing one.

## Maintenance

1. **Adding a tag** — Add a row to the appropriate table above with a description. Then apply it to relevant projects.
2. **Removing a tag** — Search all `POST.md` frontmatter for the tag. Remove it from every project, then delete its row here.
3. **Renaming a tag** — Update every `POST.md` that uses it, then update the row here. Tags are not referenced by code beyond raw string matching.
4. **Auditing** — Run a quick grep across `POST.md` files to verify all tags in use appear in this file and vice versa:
   ```bash
   grep -roh "tags: \[.*\]" src/content/projects/*/POST.md | tr ',' '\n' | sed 's/.*\[//;s/\].*//;s/^ *//;s/ *$//' | sort -u
   ```
