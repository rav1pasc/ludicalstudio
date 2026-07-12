# Ludical Studio — Website

A static, no-build-step website for Ludical Studio, ready for GitHub Pages.

## Structure

```
index.html           Home — featured project + intro
projects.html        Projects — filterable grid (All / Released / In Development / Prototypes)
project.html         Project detail page (accessed via ?id=<project-id>)
cms.html             Content Manager for managing projects
about.html           About — designer bio + social links
css/style.css        Shared styles (brand colors, layout, components)
js/script.js         Shared behavior (mobile nav toggle + data utilities)
data/projects.js     Project data (JS global variable)
data/projects.json   Project data (JSON file for CMS export)
images/              Logo assets
prototypes/          Playable HTML prototypes
```

## Publish with GitHub Pages

1. Create a new GitHub repo (or use an existing one), e.g. `ludicalstudio`.
2. Push all these files to the repo root (or to a `/docs` folder — your choice).
3. In the repo, go to **Settings → Pages**.
4. Under **Source**, choose the branch (usually `main`) and folder (`/root` or `/docs`).
5. Save. Your site will publish at `https://<your-username>.github.io/<repo-name>/`.

## Things to customize before launch

- **Social links**: Facebook and YouTube URLs are placeholders
  (`facebook.com/ludical.studio`, `youtube.com/@ludicalstudio`) — swap in your real handles across all HTML files.
- **Portfolio link**: the "Visit My Portfolio" button on `about.html` currently points to `#` — update the `href` to your personal site.
- **Fonts**: headings use a rounded system-font fallback stack. If you want the exact "Baloo 2" look from the logo, add a self-hosted woff2 file and `@font-face` rule in `css/style.css`.

## Content Management

Use `cms.html` to manage projects:
1. Open `cms.html` in your browser
2. Add/edit projects using the form
3. Click "Download JSON" to export updated `projects.json`
4. Copy the content to `data/projects.js` (wrap in `var PROJECTS_DATA = { ... };`)
5. Commit to git — GitHub Pages redeploys automatically
