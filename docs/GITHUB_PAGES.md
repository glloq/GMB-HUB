# GitHub Pages deployment

GMB HUB is designed for a project-site URL such as:

`https://glloq.github.io/GMB-HUB/`

The Vite build sets `/GMB-HUB/` as its base path in GitHub Actions. Browser navigation uses hashes, avoiding server rewrite requirements.

`deploy-pages.yml` builds and publishes `dist/` on pushes to `main`.

The repository Pages source must be configured to use **GitHub Actions** once before first publication if it is not already enabled.

No runtime secret is required.
