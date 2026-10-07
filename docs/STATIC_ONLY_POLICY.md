# Static-only policy

GMB HUB is a GitHub Pages application. Runtime backend infrastructure is out of scope by design.

## Runtime allowed

- HTML/CSS/JavaScript served statically
- local JSON/assets
- browser APIs such as localStorage, IndexedDB and Web Serial
- optional public third-party links that are not required for core operation

## Runtime forbidden

- application servers
- server-side databases
- serverless functions
- private API gateways
- mandatory GitHub API calls
- server-side authentication/session state

GitHub Actions may validate, build, generate or copy artifacts before deployment. CI is not a runtime backend.

Architectural test: copying `dist/` to another static HTTP host must preserve core functionality.
