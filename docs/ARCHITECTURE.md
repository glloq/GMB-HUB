# Architecture

## Direction

GMB HUB is data-first and static-only.

```text
source repositories ──audit──> canonical JSON records
                                  │
registries + schema ──────────────┤
                                  ▼
                           Vite static build
                                  ▼
                           GitHub Pages
                                  ▼
                              browser
```

## Layers

1. `data/` — canonical facts and registries.
2. `schema/` — machine-enforced contract.
3. `src/models/` — TypeScript representation.
4. `src/services/` — catalog loading/search/filter logic.
5. `src/pages/` — route-level composition.
6. `src/styles/` — tokens and presentation.
7. `public/` — static media and future firmware artifacts.

## Routing

The skeleton uses hash routing so direct navigation and refreshes work on a GitHub Pages project site without rewrite rules.

## No project-specific UI branches

Adding a project must not require conditions such as `if (project.id === 'servo-flute')`. Differences belong in data/capabilities and generic renderers.

## Evidence model

Software tests, CI compilation, bench tests and physical validation are separate facts. UI must never collapse them into one misleading stability badge.
