# UX and information architecture

## Primary routes

- `#/` — ecosystem overview.
- `#/instruments` — searchable/filterable catalog.
- `#/instruments/:id` — generic project detail.
- `#/software` — GMB and related software.
- `#/build` — local rule-based project chooser.
- `#/compare` — project comparison.
- `#/flash` — browser firmware tools.
- `#/about` — ecosystem/project context.

## Information hierarchy

1. What is it?
2. What can I build?
3. What do I need?
4. How does it work?
5. Technical details.

GPIO-level detail should never be the first information shown to a newcomer.

## Project page blocks

Overview → supported instruments → capabilities → mechanical principle → electronics → actuators/sensors/power → MIDI → GMB → build resources → firmware/configuration → safety → evidence/status → related/legacy projects.

Empty blocks are hidden instead of filled with invented values.
