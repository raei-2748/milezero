# Mile Zero website

The website for milezeronetwork.org. It is plain static HTML, one stylesheet and two small scripts, with no build step. GitHub Pages serves the repository root and `CNAME` points it at the custom domain. Do not delete `CNAME`.

## Pages

| URL | File |
|---|---|
| `/` | `index.html` |
| `/competition/` | `competition/index.html` |
| `/toolkit/` | `toolkit/index.html` |
| `/network/` | `network/index.html` |
| `/about/` | `about/index.html` |
| `/get-involved/` | `get-involved/index.html` |
| `/rules/` | `rules/index.html` |
| `/privacy/` | `privacy/index.html` |
| (not found) | `404.html` |

Shared files live in `assets/`: `assets/css/site.css` (all styles), `assets/js/site.js` (mobile menu only), `assets/js/links.js` (form links), and `assets/img/` (logo mark and ibis). `favicon.svg` is at the root.

`CONTENT.md` holds the approved copy. Keep it in step with the pages.

## Editing a page

Open the page's `index.html` and edit the text between the tags. Keep these conventions:

- Each page has exactly one `<h1>`.
- Use sentence case for headings, Australian English, and no exclamation marks.
- Links between pages are root-relative, for example `/competition/`.
- Labels such as stage names and dates use `<span class="sc">`, which sets small capitals in Caslon. Do not type text in uppercase.

The header (`<header class="site-header">`) and footer (`<footer class="site-footer">`) are copied into every page and must stay identical. If you change one, paste the same change into all nine files. A search-and-replace across the repository is the easiest way.

## Connecting a form

Every form button on the site has a `data-link` attribute, such as `data-link="register"`. Its `href` is an email fallback, so the button still works before a form exists or when JavaScript is off.

To connect a form, paste its URL into the matching line at the top of `assets/js/links.js`:

```js
var MILEZERO_LINKS = {
  register: "https://forms.gle/...",   // Team registration
  toolkit: "",                         // Starter Toolkit request
  network: "",                         // Join the network
  ambassador: "",                      // Ambassador expression of interest
  startguide: "",                      // Start guide (shared Google Doc)
  teacherpager: ""                     // Teacher one-pager (shared Google Doc)
};
```

While a value is empty, its buttons keep the fallback: an email to hello@milezeronetwork.org with a sensible subject line, or, for the two open documents, a link to the request section on `/toolkit/`.

## Swapping the logo

The interim logo is a small obelisk drawn in `assets/img/mark.svg`. To replace it, overwrite that file with the new SVG. The header shows it at 16 × 30 px and the footer at 11 × 20 px. If the new mark has different proportions, update the `width` and `height` attributes on the `<img src="/assets/img/mark.svg">` tags in the header and footer of every page. Also replace `favicon.svg`.

## Things still to add

These sections are marked with `<!-- TODO -->` comments in the HTML. Only fill them once permission is confirmed:

- Executive team names and schools, and named advisers (About).
- Member societies (Network).
- Prizes (Competition FAQ). Currently says they will be announced before registration closes.
- The adult committee's review of the privacy page.

## Checking changes locally

Run `python3 -m http.server` from the repository root and open http://localhost:8000.
