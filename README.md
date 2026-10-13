# Mile Zero website

The brand site for Mile Zero and the Sydney Schools Business Competition (SSBC), served at
[milezeronetwork.org](https://milezeronetwork.org) by GitHub Pages, with Cloudflare Workers preview builds on every PR.

It's a static site with no dependencies. Pages are generated from `src/` by a small Node script, and the generated
HTML is committed, so both hosts just serve files.

## Common changes

| To change… | Edit | Then |
|---|---|---|
| A Google Form or portal link | `assets/js/links.js` | Commit. No build needed. |
| Brand name, email, Instagram, final venue or dates | `site.config.json` | `npm run build`, commit |
| Stage descriptions, judging weights | `site.config.json` (`stages`, `criteria`, `weights`) | `npm run build`, commit |
| Show a partner logo | `site.config.json` → `partners`: set `logoApproved: true` (and `logo` to an image path) | `npm run build`, commit |
| Name a team member | Once they've agreed, add `{ "name": "…", "role": "Head of …", "school": "…", "consent": true }` to `team` in `site.config.json` | `npm run build`, commit |
| Page copy | `src/pages/*.html` | `npm run build`, commit |
| Header, footer, page shell | `src/partials/*.html` | `npm run build`, commit |
| Styles | `assets/css/site.css` | Commit |

Never edit the generated `index.html`, `*/index.html` or `404.html` directly: the next build overwrites them, and the
**Site check** workflow fails any PR where they don't match `src/`.

### Links that aren't ready yet

Any button with `data-link="register"` (or `toolkit`, `network`, `ambassador`, `portal`) uses the URL in
`assets/js/links.js`. While a link is empty, the button emails `hello@` instead, so nothing points at a dead page.

### Public-information rules

- **Partners:** only partners with written approval get `logoApproved: true`. Until then, the "Supported by" bar stays hidden.
- **Students:** only add a team member to `site.config.json` once they've agreed. GitHub Pages publishes every file in this repo, including the config, so never commit names, schools or photos without consent.
- **Partners:** list a partner in the config only once the relationship is confirmed, for the same reason.
- **Case materials:** don't publish case content before the Live Final (4 March 2027). The site only has a vague teaser.

## The ibis

The home page opens with the red zero tipping over to become the ibis. It plays once per browser session and never
with reduced motion turned on; add `?intro` to the address to replay it. The same ibis is the logo (an SVG symbol in
`src/partials/layout.html`), walks the competition route as you scroll, forms the flock of ten finalists, and lives in
the bin on the 404 page. Tap the home-page ibis five times.

## Local preview

```sh
npm run build
npx wrangler dev        # or: python3 -m http.server
```

## Layout

```
site.config.json      brand, dates, stages, weights, partners, team
src/pages/            one file per page (about.html → /about/)
src/partials/         layout, header, footer
assets/css/site.css   styles: Swiss Style (International Typographic Style)
assets/js/links.js    Google Form and portal links
assets/img/           ibis mark, favicon
scripts/build.mjs     the build
```
