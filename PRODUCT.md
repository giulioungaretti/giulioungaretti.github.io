# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Product Purpose

A personal homepage, CV and Markdown blog using one reusable home design system, with an explicitly imaginary home-server administration demo. This record derives from the user's settled build brief and subsequent blog request; no extra product claims are inferred.

## Users

Visitors reading Giulio Jensen Ungaretti's professional history and developers exploring the reusable components. Demo visitors can explore local-only service controls.

## Capabilities and Constraints

Personal routes: homepage `/`, full CV `/cv`, writing index `/blog`, and Markdown articles `/blog/:slug/`. Separate demo admin entry/control routes and a standalone component showcase remain. React, TypeScript, Vite, Tailwind CSS, shadcn/ui with accessible Radix primitives, typed variants, and lucide icons. No real authentication, telemetry, server administration, or API integration. Demo entry must not collect credentials.

The homepage, CV and blog now form one personal site with shared navigation. The admin demo and design-system showcase remain independent surfaces; they must not link to the personal site or one another. Admin entry and exit remain within the admin flow. All surfaces reuse the same component library and semantic tokens.

Posts are written in Markdown with YAML frontmatter in `_posts/`; `_drafts/` stays unpublished. Published pages are prerendered static HTML for GitHub Pages. Future-dated posts stay out of browser/publication output until a build on their UTC publication day. The user authorized publication to the existing blog repository and a separate public component-library repository. Push/manual/daily GitHub Actions builds publish the personal site; the library repository owns reusable components and its standalone showcase.

The user-approved wide-fascia identity plate replaces the decorative vent lines with introduction text, keeps `gu.`, and supplies genuine Home/CV/Blog rotary navigation. It remains visible on mobile. The introduction describes experience as “more than a decade”; the original downloadable PDF remains unchanged.

## Brand Commitments

Real Braun appliances and Dieter Rams: neutral whites, crisp borders, minimal rounding, physical circular controls, embossed/debossed text controls, restrained material depth. The requested Never-Setting-Sun palette must not be represented as verified unless its exact values are retrieved.

## Evidence on Hand

The supplied CV PDF is the authority for personal facts. Preserve employers, dates, education, and community information; do not invent contact links or other credentials. Illustrative application names and data must be labeled as such.

The user's palette screenshot verifies Never-Setting-Sun by Halifax: #FFF5F5, #FFC62B, #FE6900, #C82000, #261914. Credit Halifax and the original palette URL; the screenshot identifies CC-BY licensing.

Blog source: `giulioungaretti/giulioungaretti.github.io`, inspected at commit `83a3f6c7c66f70b2d7248f43485f297ad188c32b`. Its one published post, Hello World (25 April 2026), is imported unchanged; the example draft is retained with Jekyll-specific instructions updated. The verified existing custom domain is `giulioungaretti.me`. Preserve the original `/2026/04/hello-world/` URL and existing 07:00 UTC daily rebuild schedule.

## Accessibility & Inclusion

Responsive mobile layouts, semantic structure, keyboard navigation, visible focus, reduced-motion support, and meaningful interaction states.
