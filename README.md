# chrisstayte.com

A static Next.js site for showcasing things Chris Stayte has shipped. The site is configured for GitHub Pages and the custom domain `chrisstayte.com`.

## Updating The Catalog

Each shipped item lives in `content/ships` as a markdown file with frontmatter. Copy `content/ships/_template.md`, rename it, update the fields, and write the row note below the frontmatter.

Catalog entries are validated at build time. Bad `type`, `status`, duplicate `id`, duplicate `code`, or missing fields will fail `npm run build` with the filename.

## Local Development

```bash
npm run dev
```

Open the local URL printed by Next.js.

## Production Build

```bash
npm run lint
npm run build
```

`next.config.mjs` uses `output: "export"`, so `npm run build` writes the static site to `out/`.

## GitHub Pages

The deploy workflow at `.github/workflows/deploy.yml` builds the static export and publishes `out/` with GitHub Pages.

Repository settings should use:

- Pages source: GitHub Actions
- Custom domain: `chrisstayte.com`

The `public/CNAME` and `public/.nojekyll` files are copied into `out/` during the build so GitHub Pages keeps the custom domain and serves Next.js assets correctly.
