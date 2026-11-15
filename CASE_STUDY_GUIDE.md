# Studio Eien — Case study authoring guide

Each project lives in `src/content/work/<slug>.mdx`. The filename determines its URL (`/work/<slug>`). **Do not edit `src/pages/work/[slug].astro` when adding a project.**

## Create a project
1. Copy an existing MDX file (or the starter below) to a new filename such as `new-project.mdx`.
2. Change the frontmatter: title, japaneseTitle, subtitle, tagline, client, year, roles, deliverables, heroImage, heroImageAlt and order. Optional: accentColor, liveUrl and nextProject.
3. Write your story under the imports using normal Markdown and reusable Astro editorial components.
4. Run `npm run dev` and visit `/work/new-project`. Run `npm run build` before publishing.

The shared route automatically renders breadcrumbs, hero, metadata, the MDX story and next-project navigation. If `nextProject` is omitted, navigation follows `order` and wraps around.

## Starter
```mdx
---
title: "New Project"
japaneseTitle: "作品"
subtitle: "Creative Development"
tagline: "A short description."
client: "Personal Practice"
year: "2026"
roles: ["Design", "Frontend Development"]
deliverables: ["Website"]
heroImage: "/images/new-project/hero.webp"
heroImageAlt: "Describe the image"
order: 4
---

import EditorialSection from '../../components/astro/work/EditorialSection.astro';
import VisualFeature from '../../components/astro/work/VisualFeature.astro';

<EditorialSection eyebrow="THE IDEA // 01" title="Why I made it" lead="A short introduction.">
  The story of the project goes here.
</EditorialSection>

<VisualFeature image="/images/new-project/detail.webp" alt="Describe the detail" caption="Design exploration" figNumber="FIG. 01" />
```

## Editorial components
- `EditorialSection`: eyebrow, japaneseTitle, title, lead, layout (`single` or `asymmetric`), signature; body goes between opening and closing tags.
- `VisualFeature`: image, alt, caption, figNumber, fullBleed, aspectRatio.
- `AsymmetricGallery`: title, japaneseTitle, eyebrow, ratio, items (image, alt, caption, figNumber, span).
- `TechHighlights`: title, japaneseTitle, eyebrow, summary, items (number, title, subtitle, description, tags), signature.
- `ProjectReflection`: title, japaneseTitle, eyebrow, japaneseWatermark, quote, signature; body is slotted content.

Use imports from `../../components/astro/work/`. See the existing three MDX case studies for real examples. Components may be omitted or reordered. Use blank lines between Markdown blocks and JSX-style components. Avoid indenting top-level component tags as code blocks.

## How it works
`content.config.ts` validates frontmatter and loads MDX files. `getStaticPaths()` creates one route per content entry. `render(entry)` turns the MDX body into the `Content` component. The route renders shared chrome around `<Content />`.

## Editorial checks
Use descriptive image alt text; don't claim unverified technical features or accessibility conformance. Confirm layouts at 320px, tablet and desktop. Keep case study content specific to the actual project.
