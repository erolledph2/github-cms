# GitHub CMS

This is a small Next.js demo for deploying to Cloudflare Pages.

## Cloudflare Pages setup

To enable live login you must add these environment variables in your Cloudflare Pages project:
- `ADMIN_PASSWORD` — the admin password (e.g., `admin123`)
- `GITHUB_REPO` — your GitHub repository name
- `GITHUB_USERNAME` — your GitHub username
- `REPO_TOKEN` — (secret) GitHub personal access token if you plan to push

Make sure build settings in Cloudflare Pages are:
- Build command: `npm run build`
- Build output directory: `out`

The project uses Cloudflare Pages Functions for authentication endpoints located under `functions/api/auth`:


