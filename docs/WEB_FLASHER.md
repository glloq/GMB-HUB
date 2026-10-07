# ESP32 Web Flasher architecture

The future flasher must remain browser-only.

```text
GitHub Pages firmware files
          │
          ▼
      GMB HUB UI
          │
     Web Serial
          │
     esptool-js
          │
          ▼
        ESP32
```

## Data first

Each flashable project will declare explicit targets containing:

- board ID;
- ESP chip family;
- build environment;
- version/source revision;
- exact files;
- exact flash offsets produced by that build;
- SHA-256 checksums.

Never assume common offsets are universal.

## Safety/UX requirements for implementation phase

1. Detect browser capability rather than hard-code browser names.
2. Require explicit device selection by the user.
3. Verify detected chip against the selected target.
4. Present project/board/version before erase/write.
5. Verify writes when supported.
6. Show post-flash setup instructions from project data.
7. Never require a GMB HUB backend or local daemon.
