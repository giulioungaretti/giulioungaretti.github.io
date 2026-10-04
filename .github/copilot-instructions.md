## Blog Writing Context

This is a React/TypeScript personal site with a Markdown blog, prerendered for GitHub Pages. The reusable UI package is maintained separately in giulioungaretti/home-design-system.

### Voice and Audience
- Audience: software engineers, tech leads, builders
- Tone: direct, opinionated, conversational — like talking to a peer
- Avoid: filler, buzzwords, corporate-speak, unnecessary introductions
- Lead with the problem or insight, not background

### Post Structure
- Posts live in `_posts/` as `YYYY-MM-DD-title.md`
- Drafts live in `_drafts/` (no date prefix needed)
- Use validated YAML frontmatter: layout, title, date, tags, description.
- Preserve the filename/frontmatter date agreement. Drafts and future posts are excluded from public builds.
- Run `npm run build` and `npm run test:static` before publishing. Commits pushed to `master` deploy through `.github/workflows/publish.yml`.
- The site uses the approved Braun-inspired wide fascia; keep personal facts source-backed.

### Frontmatter Template
```yaml
---
layout: post
title: "Post Title"
date: YYYY-MM-DD
tags: [tag1, tag2]
description: "One-line summary for SEO and previews"
---
```

### Writing Guidelines
- Start with the problem or the "why" — no preamble
- Include real code examples when relevant
- Keep paragraphs short (3-4 sentences max)
- Use headings to break up sections
- End with a takeaway or next step, not a generic conclusion
