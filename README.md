# Personal site and home design system

A personal CV homepage and Markdown blog, plus independent home-server demo and component-reference surfaces. All use the same Braun-inspired design system. The personal site uses the approved White studio cassette, Editorial-led date ink and a joined Sun tray CV/Blog selector; the admin demo and component showcase remain separate.

## Start

Use Node 24 (the project was built with 24.13.0) and npm.

```sh
npm ci
npm run dev
```

Open the URL printed by Vite, normally `http://127.0.0.1:5173`. The server binds to loopback, not your network.

```sh
npm run build        # strict TS + bundle + prerendered static HTML, RSS, sitemap
npm run preview      # serve the production build locally
npm run typecheck
npm run lint
npm test             # component, keyboard, form, filtering, route tests
npm run test:watch
npm run format:check
npm run test:static  # verify generated pages, old article URL and draft exclusion
npm run test:publication # build with temporary draft/future sentinels; assert no leaks
```

Real-browser checks cover desktop/mobile routes, local interactions, keyboard entry, PDF delivery, overflow, and axe WCAG A/AA findings:

```sh
npx playwright install chromium  # only if a browser is not already installed
npm run dev -- --port 5173 --strictPort
# In another terminal:
npm run test:browser
```

`PREVIEW_URL` overrides the test address; `QA_OUTPUT` overrides the screenshot/report directory (default `.impeccable/qa`, ignored by Git). `SKIP_SCREENSHOTS=1` runs checks without image capture. `BROWSER_ENGINE=webkit` runs the same checks with WebKit; install the browser with `npx playwright install webkit` if missing. For full production checks, build and start `npm run preview`, then run `PREVIEW_URL=http://127.0.0.1:4173 EXPECT_PRERENDER=1 npm run test:browser`. Use the URL printed by your own preview process; a busy port may belong to another project. You can select an explicit port with `npm run preview -- --port 4197 --strictPort`.

## Routes and demo boundaries

| Route            | Purpose                                                                                     |
| ---------------- | ------------------------------------------------------------------------------------------- |
| `/`              | Full source-backed CV, professional introduction and original PDF download                  |
| `/cv`            | Backward-compatible full CV alias, canonicalized to `/`                                     |
| `/blog`          | Published Markdown writing, newest first                                                    |
| `/blog/:slug/`   | Full Markdown article with its own static HTML and metadata                                 |
| `/login`         | **Demo admin login**, without credential inputs or real authentication                      |
| `/admin`         | Illustrative service list, search, state tabs, detail inspection, local switch, reset, exit |
| `/design-system` | Interactive buttons, switches, tabs, form feedback, material examples, palette credits      |

CV and Blog are the two personal views; there is no separate Home view. Admin and the component showcase are opened directly by their addresses and do not cross-link. The personal layout owns the cassette composition; admin/reference layouts retain `PageFrame`. All reuse the unchanged shared design-system package and tokens.

Fresh `/admin` deep links show demo entry. This is **not an authorization boundary**. Entry is a React boolean, not authentication. Every app name—including leggmini, giornale, presentami, and workbench—is illustrative. “Running” and “paused” are in-memory UI states, not live service information. No admin operation makes a network request, deploys software, or changes a server. Counts are derived from the current demo state, not telemetry.

Service state resets when you leave the admin route or reload. Showcase state resets when you leave that route. Nothing is stored in localStorage, cookies, or a database. Exit clears the demo-entry flag; Reset restores the initial services and clears filters.

The production build writes real `index.html` files for every known route, plus `404.html`, so GitHub Pages does not need an SPA rewrite. Articles are readable before JavaScript; React hydrates the same markup for navigation and demo interactions. A rendered-path marker prevents hydration mismatches when a host serves the custom 404 page at an unknown address.

## Write in Markdown, publish from Git

The authoring model deliberately retains the referenced blog's `_posts/` and `_drafts/` folders. There is no CMS account, browser editor, database, or runtime Markdown server.

```sh
npm run post:new -- "Your post title"
```

This creates `_drafts/your-post-title.md`, without overwriting an existing draft. Write the body in Markdown and replace the placeholder description. When ready, move the file to `_posts/YYYY-MM-DD-your-post-title.md`; the date is your publication date in UTC. Frontmatter looks like this (example values, not a published article):

```md
---
layout: post
title: 'Your post title'
date: 2026-10-04
description: 'A short, useful summary of the post.'
tags: [software]
---

Write the introduction here.

## A section heading

Markdown supports paragraphs, **bold**, links, lists and fenced code.
```

The filename date and frontmatter date must agree; omitting the frontmatter date uses the filename. A `slug` field can override the filename slug using lowercase letters, numbers and hyphens. Supported metadata is `layout`, `title`, `date`, `description`, `tags`, optional `slug` and optional `draft`. Typos, malformed dates, duplicate slugs, missing descriptions and empty bodies stop the build with an explicit error. Unknown fields are rejected rather than silently ignored.

Drafts in `_drafts/`, posts with `draft: true`, and future-dated posts are excluded from the rendered site, feeds and browser bundles. They are not private if committed to a public repository. Do not store secrets in drafts. A future date publishes on the first successful build that UTC day or later.

Markdown supports GitHub-flavored tables, task lists, strikethrough, fenced code and images. Code/tables get keyboard-accessible horizontal scrolling; images use their Markdown alt text. Place public images in `public/images/` and reference them as `![Meaningful alt text](/images/file.jpg)`. Raw HTML is displayed as text—not executed—and MDX/embedded JavaScript is intentionally unsupported.

Preview Markdown edits live with `npm run dev`. To check the exact static publication, including generated RSS and sitemap:

```sh
npm run build
npm run test:static
npm run preview
```

RSS and sitemap are build outputs, not development-server endpoints. Once this code is in the publishing repository, **commit and push to its default branch** to publish. No commit or push is performed by a local build.

### GitHub Pages activation

The personal site is published from [`giulioungaretti/giulioungaretti.github.io`](https://github.com/giulioungaretti/giulioungaretti.github.io), default branch `master`, to **https://giulioungaretti.me/**. GitHub Pages uses **GitHub Actions** as its source. The previous Jekyll application and scheduled deployment were replaced; the original post, dated article URL, issue templates and custom domain are retained.

Commit and push Markdown changes to `master` to publish. Keep only `.github/workflows/publish.yml`; restoring the old Jekyll deployment would create competing publishers.

The workflow validates and builds on pushes/PRs, and deploys only the named publishing repository's default branch. Forks, other repositories and PR builds do not deploy. It also rebuilds daily at **07:00 UTC**, preserving the original schedule, and supports manual runs. GitHub schedules are best-effort, not a precise-time publishing guarantee. Failed builds leave the previous successful deployment in place.

The existing `giulioungaretti.me` domain is preserved in `public/CNAME` and `src/site.ts`; no DNS changes are made. Adjust both if deliberately changing the domain. Builds generate canonical/Open Graph metadata, `/feed.xml`, and `/sitemap.xml`. Demo/reference pages have `noindex` metadata and stay out of the sitemap; they are still public UI demonstrations, not protected routes.

### Imported content

Source revision: `83a3f6c7c66f70b2d7248f43485f297ad188c32b`. The one published article, `_posts/2026-04-25-hello-world.md`, is unchanged (SHA-256 checked against the original). The example draft is retained with its Jekyll-specific instructions updated for this build. No extra posts or personal claims were invented.

The original `/2026/04/hello-world/` URL remains a fully rendered article page; its canonical URL is now `/blog/hello-world/`. RSS IDs retain the original dated permalink shape. Keep legacy paths when migrating more articles so inbound links do not break.

## Stack and organization

Reusable components are published separately in [giulioungaretti/home-design-system](https://github.com/giulioungaretti/home-design-system), with its live reference at [giulioungaretti.me/home-design-system/](https://giulioungaretti.me/home-design-system/). This site installs a pinned Git commit of `@giulioungaretti/home-design-system`, imports its compiled stylesheet, and keeps small compatibility reexports under the existing component paths. No component implementations or runtime palette literals are maintained twice. The library is published on GitHub, not the npm registry.

React 19.3, Vite 8, Tailwind CSS 4, TypeScript 6.0, React Router, react-markdown/remark-gfm, shadcn/ui source components backed by individual Radix packages, class-variance-authority, lucide-react, clsx, and tailwind-merge. The lockfile pins resolved versions. TypeScript 6.0.3 is the newest stable release currently supported by typescript-eslint; TypeScript 7 is not forced past its peer range.

```text
src/
  styles/tokens.css       # sole runtime palette/semantic/material token source
  styles/appliance.css   # layout and material treatments
  styles/reading.css     # archive and Markdown reading styles; same tokens/ramp
  index.css              # Tailwind v4 semantic-token mapping
  lib/utils.ts           # cn(): clsx + tailwind-merge
  components/ui/         # shadcn-derived Radix primitives, locally styled
  components/system.tsx  # Panel, Status, IconButton, PageHeading
  layouts/               # personal/admin/showcase shells; shared PageFrame
  lib/blog-content.ts    # build-only YAML/Zod publication validation
  lib/blog.ts            # typed published manifest and article/date helpers
  site.ts                # verified domain and route metadata
  data/cv.ts             # content transcribed from the provided PDF
  data/services.ts       # typed illustrative data and pure filtering
  pages/                 # Cv, Blog, BlogArticle, Login, Admin, Showcase
  prerender.tsx          # static React rendering entry
  App.tsx                # route groups, focus and document-title updates
  test/                  # Vitest + Testing Library
```

`_posts/` and `_drafts/` live at the root. `scripts/content.ts` exposes only validated/published posts to Vite as `virtual:posts`; draft/future Markdown never enters that browser module. `scripts/prerender.mjs` creates static pages and feeds from the same manifest. Frontmatter validation is build-only, not duplicated in client components.

The separate design-system package owns reusable primitives and semantic tokens. This site owns composition and personal-route styling; it has no backend abstraction, global state library or unnecessary theme provider. Local state belongs to its route. Strict TypeScript includes unchecked-index and exact-optional-property checks; third-party declarations are checked too.

## Component usage

Import primitives from `@/components/ui/*` and composed components from `@/components/system`. The `@/` alias resolves to `src/`.

The approved personal composition is **Cassette sleeve + Sun tray + Editorial-led + White studio**. Identity and the CV/Blog selector stay in a shallow enamel sleeve; the introduction and records sit in the reading sheet below. `PersonalPageSwitch` is app-specific composition over the package's unchanged `Button`: two native radio keys, a yellow trough, white selected cap, visible focus, and native arrow-key operation. Route changes preserve control focus and explicitly return the viewport to the page top. Content focus uses `preventScroll` so WebKit cannot scroll past the cassette after the reset. No Home choice, dial, duplicate top navigation, role caption or decorative status dot remains. Articles use the same sleeve and keep their own title as the page's `h1`. The original PDF and article links remain, with CV/Blog links available without JavaScript. Development-only mockups are not exported or deployed. The library's rotary component remains available independently; this site does not modify it.

```tsx
import { RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { IconButton, Panel, Status } from '@/components/system'

<Button variant="secondary" onClick={enterDemo}>Enter demo admin</Button>

<Button asChild variant="outline">
  <a href="/giulio-jensen-ungaretti-cv.pdf" download>Download CV</a>
</Button>

<IconButton label="Reset demo" onClick={reset}>
  <RotateCcw aria-hidden="true" />
</IconButton>

<Panel aria-labelledby="apps-heading">
  <h2 id="apps-heading">Applications</h2>
  <Status tone="on">Running in demo</Status>
</Panel>

<label htmlFor="service-toggle">Run in demo</label>
<Switch id="service-toggle" checked={enabled} onCheckedChange={setEnabled} />
```

| Component    | API and guidance                                                                                                                                                                                          |
| ------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Button`     | `variant`: `default`, `outline`, `secondary`, `ghost`, `destructive`, `link`; `size`: `default`, `sm`, `lg`, `icon`, `icon-lg`. CVA-derived types. Use native `disabled` on buttons, not `asChild` links. |
| `IconButton` | Requires `label` and icon children; fixes size to a true circle. Supports `aria-pressed` and normal button props. Contains a Radix tooltip.                                                               |
| `Panel`      | Semantic `section`; `surface`: `raised` or `recessed`. Give meaningful regions a heading via `aria-labelledby` or an `aria-label`.                                                                        |
| `Status`     | `tone`: `on`, `off`, `alert`. Always provide readable text; the dot never carries meaning alone.                                                                                                          |
| `Switch`     | Radix controlled/uncontrolled API. Use a visible label connected by `id`/`htmlFor`. Disabled state supported.                                                                                             |
| `Tabs`       | Radix root/list/trigger/content; unique values, labeled list, automatic arrow-key selection. List supports `default` or `line`.                                                                           |
| `Separator`  | Decorative by default; set `decorative={false}` only for meaningful separators.                                                                                                                           |

The root wraps all routes in `TooltipProvider`. Wrap separately mounted systems or stories in that provider too. Use `cn()` for conditional and conflicting utility classes; do not build a second class-merging helper. Use `<Button asChild>` to style links without nesting interactive elements.

### Extending the system

Change semantic colors in `src/styles/tokens.css`, not in components. Tailwind’s `bg-card`, `text-foreground`, and `border-border` resolve directly to these tokens. Raw source palette swatches are used only to show provenance; production components use semantic roles.

Use existing variants before adding new ones. Add behavior tests with any new interactive primitive. Keep circular icon controls separate from shallow rectangular text buttons. Use shadows for physical depth, not decorative glows. Preserve visible focus and the reduced-motion override.

The installed shadcn CLI and `components.json` remain available for adding future primitives with `npx shadcn add <component>`. New components require the same local token/material adaptation as the existing ones; the upstream preset is not the visual authority. Check generated paths and normalize imports to `@/lib/utils` if the current generator emits an external `cn` import.

## Content and color provenance

CV content was extracted locally from the supplied two-page PDF, without cloud upload. `src/data/cv.ts` retains the original employers, role dates, descriptions, degrees, thesis topics, and PyData community information. No contact addresses, social links, or extra credentials were invented. `public/giulio-jensen-ungaretti-cv.pdf` is an unchanged copy of the original. To update the CV, replace both the source data and the public PDF together.

**Never-Setting-Sun by Halifax**, credited under the **CC-BY** license identified in the user-supplied screenshot:
[original palette](https://www.colourlovers.com/palette/3060721/Never-Setting-Sun).

| Source name      | Verified hex |
| ---------------- | ------------ |
| p3_c007          | `#FFF5F5`    |
| Texas Sun        | `#FFC62B`    |
| Sunscreen        | `#FE6900`    |
| against          | `#C82000`    |
| bitter chocolate | `#261914`    |

The site/API returned HTTP 403; exact values were subsequently verified from the user’s screenshot listing the hex strings, not sampled from image pixels. These colors are **not provisional**. The neutral enamel backgrounds, border, muted text, and recessed surfaces are separately derived tokens—not claimed as original palette colors.

Braun and Dieter Rams are design references, not affiliations or endorsements. No Braun logos, product photography, or copyrighted appliance artwork are bundled.
