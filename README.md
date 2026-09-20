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
3. Click "Download JSON + JS" to export updated `projects.json` **and** `projects.js` together
4. Upload both files (`data/projects.json` + `data/projects.js`) — they must stay in sync
5. Commit to git — GitHub Pages redeploys automatically

### Project data schema

Each project in `data/projects.js` / `data/projects.json` supports:

```js
{
  id: 'gems-jewels',
  name: 'Gems & Jewels',
  status: 'prototype' | 'development' | 'released',
  coverGradient: 'linear-gradient(160deg, #2a1c12, #4a3018)',
  coverImage: 'images/Gem&Jewels.png',   // optional cover image
  coverEmoji: ['💎', '✨'],               // emoji shown on covers
  description: 'Short description',
  longDescription: 'Full description',
  players: '1-4',
  playtime: '15-30 Mins',
  age: '4+',
  featured: false,        // featured on home page (limit 1)
  showOnTable: false,     // shown in "On the Table" section (limit 3)
  buttons: [              // action buttons on the project detail page
    { label: 'Try it', url: 'prototypes/gems-jewels.html', featured: true },
    { label: 'View Rulebook', url: 'Document/Rulebook_JG.pdf', featured: false }
  ],
  gallery: [              // optional slideshow images
    { url: 'images/gallery/setup.png', caption: 'Board setup' },
    { url: 'images/gallery/prototype.jpg', caption: 'Early prototype' }
  ]
}
```

- The detail page renders `buttons` in order — first = primary style, rest = outline.
- The project **card** (grid pages) shows only the button flagged `featured: true` (falls back to the first button).
- The **slideshow** on the detail page always starts with `coverImage` (if set), then `gallery` images. Empty `gallery` falls back to just the cover. Clicking a slide enlarges it in a lightbox (✕ / click outside / Esc to close).
- **`longDescription` supports Markdown** (rendered by the built-in `renderMarkdown` in `js/script.js`): `#`–`######` headings, `**bold**`, `*italic*`, `~~strike~~`, `-`/`1.` lists (nested), ``` `code` ```, fenced code blocks, `[links](url)`, `![images](url)`, `>` blockquotes, `---` horizontal rules. The CMS has a live "Preview" toggle for it.
- The short `description` field stays plain text (used on cards and hero).
