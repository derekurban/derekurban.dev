# projects.derekurban.dev

Derek Urban's project gallery — a curated, visually-driven showcase of work across university, personal, and professional projects.

## Tech Stack

- **SvelteKit** (Svelte 5 with `$state` runes) + Vite
- **TypeScript**
- **Tailwind CSS v4** (`@tailwindcss/vite` plugin, `@theme` block)
- **Fontsource** — self-hosted Zilla Slab + Inter fonts
- **`@sveltejs/adapter-static`** — fully static output

## Development

```sh
npm install
npm run dev
```

## Building

```sh
npm run build
```

Static output is written to `build/`. Preview with `npm run preview`.

## Project Structure

```
src/
├── app.css                        # @theme tokens + base styles
├── app.html                       # HTML shell
├── lib/
│   ├── types/project.ts           # Project interface
│   ├── data/
│   │   ├── projects.ts            # Project records
│   │   └── filters.ts             # Filter chip definitions
│   ├── actions/reveal.ts          # IntersectionObserver scroll-reveal
│   └── components/
│       ├── Nav.svelte             # Fixed glassmorphic nav
│       ├── Hero.svelte            # Animated hero section
│       ├── FilterBar.svelte       # Tag filter chips
│       ├── BentoGrid.svelte       # 4-col CSS grid container
│       ├── ProjectCard.svelte     # Card with size variants
│       ├── ProjectModal.svelte    # Detail overlay modal
│       ├── DotBackground.svelte   # Fixed dot-grid pattern
│       └── Footer.svelte          # Copyright + links
└── routes/
    ├── +layout.svelte             # Font imports, Nav, Footer, DotBackground
    ├── +layout.ts                 # Prerender config
    └── +page.svelte               # Gallery page (state owner)
```
