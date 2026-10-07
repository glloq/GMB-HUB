# GMB HUB roadmap

## Progress summary

- Phase 0 — Skeleton: **DONE**
- Phase 1 — Repository audit and canonical dataset: **SUBSTANTIALLY COMPLETE**
- Phase 2 — Catalog UI: **DONE for V1 foundation**
- Phase 3 — GMB ecosystem pages: **IN PROGRESS**
- Phase 4 — Decision tools: **DONE for V1 foundation**
- Phase 5 — Content quality: **IN PROGRESS**
- Phase 6 — Firmware publication contract: **DESIGNED, not populated**
- Phase 7 — ESP32 Web Flasher: **NOT ENABLED**
- Phase 8 — Automation: **PARTIAL**
- Phase 9 — QA/accessibility/performance: **IN PROGRESS**
- Phase 10 — Ongoing ecosystem maintenance: **READY structurally**

## Phase 0 — Skeleton — DONE

Implemented:

- static-only architecture;
- Vite/TypeScript foundation;
- GitHub Pages-compatible hash routing;
- canonical schema/registries;
- CI/deploy workflows;
- documentation structure;
- future flasher data contract.

## Phase 1 — Repository audit and canonical dataset — SUBSTANTIALLY COMPLETE

Implemented:

- evidence-backed records for the principal GMB projects;
- public legacy/reference inventory;
- active/legacy/archive separation;
- successor/predecessor relations;
- private repository publication guard;
- explicit distinction between software tests and physical validation.

Remaining:

- continue filling missing BOM, cost, build-time and fabrication metadata where source evidence exists;
- revisit records when source repositories gain new hardware validation or GMB support.

## Phase 2 — Catalog UI — V1 FOUNDATION DONE

Implemented:

- data-driven home;
- generic project cards;
- local search;
- filters for generation, family, board, GMB and maturity;
- generic technical project renderer;
- legacy/archive visibility;
- optional project media support.

Remaining:

- improve visual polish and image coverage;
- add richer accessibility/browser tests.

## Phase 3 — GMB ecosystem pages — IN PROGRESS

Implemented:

- General MIDI Boop represented as the central software/orchestrator record;
- PlayMode represented as a generic controller rather than an instrument;
- generic related/replaces/replaced-by navigation;
- legacy replacement notices;
- About page explaining ecosystem roles and evidence policy.

Remaining:

- deepen dedicated General MIDI Boop presentation;
- deepen PlayMode use-case presentation without introducing project-specific rendering branches where generic data is sufficient.

## Phase 4 — Decision tools — V1 FOUNDATION DONE

Implemented:

- browser-only multi-project comparison;
- browser-only build assistant;
- deterministic required constraints plus preference ranking;
- no remote API or AI dependency.

Remaining:

- improve scoring/explanations as more build metadata becomes available;
- optionally persist selections in URL/localStorage.

## Phase 5 — Content quality — IN PROGRESS

Implemented:

- media fields and rendering;
- detailed mechanics/electronics/MIDI/power/resources sections;
- missing-data indicators;
- warnings and project lineage.

Remaining:

- add optimized/provenanced images for modern projects;
- extract more BOM/schematic/STL/CAD links;
- add EN/FR UI foundations;
- normalize difficulty/cost/build-time fields only when evidence exists.

## Phase 6 — Firmware publication contract — DESIGNED

Defined:

- project/board-specific flash targets;
- explicit chip/build environment/version;
- exact binary paths and flash offsets;
- SHA-256 fields;
- static firmware tree.

Do not enable flashing until target metadata is verified from real builds.

## Phase 7 — ESP32 Web Flasher — NOT ENABLED

Preparatory UI is implemented:

- Web Serial feature detection;
- ESP32 firmware candidate inventory;
- distinction between source firmware and published flash manifests;
- publication-gate checklist.

Still required before flashing:

1. build exact supported board targets;
2. collect binaries;
3. capture real offsets;
4. publish checksums/manifests;
5. verify chip matching;
6. integrate and qualify esptool-js.

## Phase 8 — Automation — PARTIAL

Current GitHub Actions handle validation/build/deployment.

Future optional automation:

- build/copy firmware artifacts from source projects;
- generate static flash manifests;
- refresh non-critical public metadata.

Runtime must remain fully static.

## Phase 9 — QA/accessibility/performance — IN PROGRESS

Current foundation includes:

- semantic HTML in main flows;
- keyboard-focus styling;
- responsive layouts;
- lazy image loading;
- local-only search/filter/compare/build logic;
- CI validation, lint, typecheck and production build.

Remaining:

- browser qualification;
- keyboard/a11y regression tests;
- mobile polish;
- bundle/image budgets;
- GitHub Pages production qualification after merge.

## Phase 10 — Ongoing ecosystem maintenance

Target workflow is now structurally possible:

1. add/update a validated project JSON;
2. add media/resources;
3. run validation;
4. commit;
5. deploy.

A normal new instrument should not require frontend project-specific code.
