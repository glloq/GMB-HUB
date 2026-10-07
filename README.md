# GMB HUB

**Explore the GMB ecosystem:** https://glloq.github.io/GMB-HUB/

GMB HUB is the static portal for the **General MIDI Boop ecosystem**: mechanical MIDI instruments, GMB-compatible controllers, software, project resources, MIDI capabilities, hardware requirements, project repositories, and eventually direct ESP32 flashing from the browser.

General MIDI Boop is the central orchestration system. GMB HUB presents the instruments and tools designed to work around it, so the whole ecosystem can be explored from one place.

## Live site

**[Open GMB HUB](https://glloq.github.io/GMB-HUB/)**

## Core rule

GMB HUB is **100% static** and runs from GitHub Pages. There is no production backend, database, server-side session, serverless function, or mandatory external API.

If the generated `dist/` folder is copied to any static HTTP host, the site must still work.

## What the HUB contains

- General MIDI Boop as the central orchestration system
- GMB-compatible mechanical MIDI instruments
- ESP32, Arduino and Raspberry Pi controller families
- supported MIDI transports and message capabilities
- hardware, mechanics, actuators, sensors and power requirements
- project maturity and hardware-validation status
- links to the original GitHub repositories
- preparation for direct ESP32 flashing with Web Serial/esptool-js

## Architecture

- Vite + TypeScript
- browser-only routing
- canonical JSON project data
- static assets and firmware manifests
- GitHub Actions only for validation/build/deployment
- future ESP32 flashing through browser APIs (Web Serial/esptool-js), never a backend

## Current stage

The catalog, GMB presentation, instrument pages, MIDI-capability audit and search/filtering are already implemented. The current work focuses on improving the compact visual presentation, completing verified project data and media, and preparing validated firmware manifests for browser-side flashing.

See `docs/ROADMAP.md` and `docs/ARCHITECTURE.md`.
