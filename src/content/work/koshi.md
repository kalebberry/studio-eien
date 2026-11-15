---
title: "Kōshi"
japaneseTitle: "格子"
subtitle: "Design Systems & Fluid Composition"
tagline: "Structure creates space for creativity."
client: "Studio Eien Research"
year: "2026"
roles:
  - "Frontend Architecture"
  - "Design Systems"
  - "Typography & Layout"
deliverables:
  - "Modern CSS Grid Engine"
  - "Fluid Type Calculator Integration"
  - "Container Query Components"
heroImage: "https://ik.imagekit.io/sorudev/Studio%20Eien/Backgrounds/mountain_INo60XpUz.png?updatedAt=1794727824146"
heroImageAlt: "Atmospheric ink wash mountain illustration representing the quiet structure of Kōshi"
order: 1
accentColor: "oklch(0.55 0.22 25)"
nextProject:
  slug: "kangae"
  title: "Kangae"
  tagline: "Think with AI, not through AI."
  thumbnail: "https://ik.imagekit.io/sorudev/Studio%20Eien/Backgrounds/download_XmsTAxTHE.png?updatedAt=1794726867267"
---

### The Origin

On the modern web, interfaces have largely succumbed to homogenization. Grid systems are frequently imported as massive utility bundles or rigid twelve-column frameworks that enforce uniform rhythm regardless of content nature. This mechanical rigidity is often countered by heavy JavaScript resize observers, causing layout shifts and sluggish rendering.

Kōshi (格子, the Japanese term for architectural lattice work) was conceived to answer a fundamental creative question: **Can a layout system possess the mathematical precision of traditional Japanese joinery while offering dynamic, boundary-free editorial freedom natively in CSS?**

### The Concept & Philosophy

In traditional Japanese architecture—from shoji screens to Kyoto machiya façades—lattices are never purely ornamental. They define thresholds, temper sunlight into delicate patterns, and establish spatial harmony through *ma* (間)—the deliberate orchestration of empty space.

Applied to digital frontend engineering, Kōshi translates this structural discipline into a dual-engine architecture:
1. **A two-dimensional CSS Grid engine (`.kos-grid`)** for macro-structural alignment, subgrid alignment, and dense content packing.
2. **A boundary-free Flexbox engine (`.kos-flex-grid`)** for organic, proportional growth where items claim fractional shares of space without requiring a predetermined column count.

### Architectural Decisions

Rather than relying on Sass compilation loops or runtime layout recalculations, Kōshi is authored in pure, modern CSS leveraging Cascade Layers (`@layer compositions`), custom properties, and Container Queries (`container-type: inline-size`).

By decoupling responsive decisions from the viewport width and anchoring them to local container boundaries, layout components become genuinely self-aware. An editorial card behaves with broadsheet elegance when given ample space in a primary column, but gracefully refolds into a condensed index view when placed inside a sidebar—without a single media query breakpoint override.
