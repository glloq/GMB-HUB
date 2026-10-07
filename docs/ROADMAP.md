# GMB HUB roadmap

## Phase 0 — Skeleton (current)

- static-only architecture;
- Vite/TypeScript foundation;
- GitHub Pages-compatible hash routing;
- canonical schema/registries;
- empty project dataset;
- CI/deploy workflows;
- documentation structure;
- future flasher data contract.

Exit: architecture exists without prematurely implementing product content.

## Phase 1 — Repository audit and canonical dataset

Audit source repositories and create evidence-backed records for the core GMB projects. Resolve active/legacy/successor relationships and contradictions between old README lists and current code.

Exit: high-confidence data for the main ecosystem.

## Phase 2 — Catalog UI

Implement home, cards, search, filters, status badges and generic project renderer from canonical data.

Exit: useful public catalog without project-specific UI branches.

## Phase 3 — GMB ecosystem pages

Implement General MIDI Boop positioning, PlayMode generic-controller page, related project navigation and legacy replacement guidance.

## Phase 4 — Decision tools

Implement compare and browser-only build assistant.

## Phase 5 — Content quality

Add optimized/provenanced images, mechanical diagrams, BOM/documentation links, missing-data indicators and EN/FR UI foundations.

## Phase 6 — Firmware publication contract

Define reproducible firmware release/manifests per supported project/board and checksums. Do not enable flashing until target metadata is verified.

## Phase 7 — ESP32 Web Flasher

Implement Web Serial/esptool-js flow: select project/board → connect → detect chip → verify target → flash → verify → reset → post-flash guide.

## Phase 8 — Automation

Optionally build/copy firmware and refresh non-critical public metadata in GitHub Actions. Runtime remains fully static.

## Phase 9 — QA/accessibility/performance

Cross-device UX, accessibility, bundle/image budgets, offline-friendly behavior and GitHub Pages deployment qualification.

## Phase 10 — Ongoing ecosystem maintenance

Adding an instrument should normally require only a new validated project JSON plus its media/resources.
