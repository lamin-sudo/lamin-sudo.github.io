# Lamin — Portfolio

A single-viewport, dark, snow-and-glass portfolio. Vanilla HTML/CSS/JS — no framework, no build step.
Live: <https://hadji.is-a.dev/>

## Run locally

Any static server works:

```bash
npx http-server -p 8123
# then open http://127.0.0.1:8123
```

## Edit your content

Everything personal lives in **one file**: [`js/config.js`](js/config.js).

- `SITE` — nickname, tagline, headline, blurb, footer, canonical URL, meta description
- `ROWS` — the six profile rows on the main card (keep exactly 6, see comment in file)
- `SOCIALS` — the link buttons + contact panel entries
- `PROJECTS` — project cards (name, Arabic name, description, tags, live/repo URLs)
- `SKILL_GROUPS`, `JOURNEY` — skills panel and about-panel timeline
- `STRINGS` — every piece of UI text
- `ENTER_SCREEN` — set `false` to skip the "click to enter" gate

Change text or data there and nothing else needs touching.

## Add music (3 steps, no code)

1. Drop the file in `assets/music/` → `assets/music/09.mp3`
2. Drop its cover in `assets/music/covers/` → `assets/music/covers/09.jpg` (optional)
3. Add one line to `TRACKS` in `js/config.js`:
   `{ title: "track name", artist: "artist", src: "assets/music/09.mp3", cover: "assets/music/covers/09.jpg" },`

Playback is always shuffled, so order does not matter. Use `cover: ""` to fall back to the
equalizer-bars animation. MP3, ~2–4 MB per track, is the sweet spot.

## Optional extras (off by default)

- **Contact form** — paste a Formspree/Web3Forms endpoint into `FORM_ENDPOINT` in `js/config.js`.
  Leave it `""` and the contact panel shows social links only.
- **CV button** — set `CV_URL` to a PDF URL to reveal the download buttons; `""` hides them.
  The about panel always offers Print / Save as PDF via the print stylesheet.

## Hidden terminal

Press <kbd>`</kbd> (backtick) or <kbd>Ctrl</kbd>+<kbd>K</kbd>) anywhere, or click `>_` in the dock.
Type `help` inside for the command list.

## Structure

```
index.html          page shell (card, player window, scattered photos, enter gate)
404.html            GitHub Pages not-found page, same visual language
css/style.css       the original design — do not edit lightly
css/panels.css      additive layer: dock, panels, terminal, toast, print styles
js/config.js        ALL personal content (see above)
js/panels.js        projects / skills / about / contact overlay panels
js/terminal.js      hidden console drawer
js/player.js        music player + Media Session + iOS volume fallback
js/snow.js          snowfall, click bursts, accumulation on the card
js/background.js    particle network canvas
js/gallery.js       scattered photo cycling
js/ui.js, js/enter.js, js/profile.js
assets/             photos, music, covers, backgrounds, icons (~18 MB, never cached by the SW)
sw.js               service worker: shell-only cache, assets stay network-fresh
manifest.json       PWA manifest
```

## Deploy

Push to `main`; GitHub Pages serves the repo root. `robots.txt`, `sitemap.xml`,
`manifest.json` and the JSON-LD `Person` block in `index.html` are already wired to
`https://hadji.is-a.dev/`.
