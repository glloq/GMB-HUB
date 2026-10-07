# GMB HUB

GMB HUB is the static portal for the General MIDI Boop ecosystem: mechanical MIDI instruments, generic controllers, software, build resources, and eventually direct ESP32 flashing from the browser.

## Core rule

GMB HUB is **100% static** and must run from GitHub Pages. There is no production backend, database, server-side session, serverless function, or mandatory external API.

If the generated `dist/` folder is copied to any static HTTP host, the site must still work.

## Architecture

- Vite + TypeScript
- browser-only routing
- canonical JSON project data
- static assets and firmware manifests
- GitHub Actions only for validation/build/deployment
- future ESP32 flashing through browser APIs (Web Serial/esptool-js), never a backend

## Current stage

This branch contains the project skeleton only. Product data and full UI implementation are intentionally deferred to the next phase.

See `docs/ROADMAP.md` and `docs/ARCHITECTURE.md`.
