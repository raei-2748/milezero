# Mile Zero website — build brief (v2)

Owner: Ray Wang. Domain: milezeronetwork.org (GitHub Pages, `CNAME` already set). Repo: raei-2748/milezero.

## 1. What the site is for

Mile Zero is a free, student-led initiative for NSW secondary students. Its flagship is the **Sydney Schools Business Competition (SSBC) 2027**. The site has three jobs, in this order:

1. Get teams to **register** before 2 February 2027.
2. Get schools (teachers and student leaders) to **request the Starter Toolkit**, so schools without a business society can start one.
3. Look credible to principals, teachers, universities and sponsors.

Audiences: Year 9–12 students (often beginners), teachers and principals, student business-society leaders, prospective partners.

The site will be linked from cold emails to schools. Many readers will open it on a **school laptop or phone**, so it must be fast, light and work without JavaScript.

## 2. Hard constraints

- Plain static HTML + one CSS file + one small JS file. No framework, no build step, no npm. GitHub Pages serves the repo root.
- Multi-page with real URLs: each page is `folder/index.html` (e.g. `/competition/`). Header and footer are duplicated in each page (identical markup); keep them byte-identical so they are easy to update.
- Relative asset paths must work both at `milezeronetwork.org/` and at a GitHub Pages project path. Use root-relative links (`/competition/`) — the site is served from a custom domain at root.
- Fonts from Google Fonts only, with `display=swap` and system fallbacks. Total page weight under 400 KB excluding fonts. No external images: all illustration is inline SVG or SVG files in `/assets/img/`.
- Works with JS disabled (JS only enhances: mobile nav toggle, FAQ already uses `<details>`).
- Accessible: semantic landmarks, one `h1` per page, visible keyboard focus, colour contrast AA, `prefers-reduced-motion` respected, alt text / `aria-hidden` on decorative SVG.
- Responsive down to 360 px wide with no horizontal scroll; 16 px side gutters on phones.
- Every page has `<title>`, meta description, Open Graph title/description, and a favicon (SVG).
- Do **not** delete `CNAME`. Keep `CONTENT.md` (update it to match final copy).

## 3. Content rules (non-negotiable)

- **Venue changed:** the Live Final is at **Sydney Grammar School**, 4 March 2027. Remove every mention of UNSW as the venue. Do not name UNSW, Macquarie or any company anywhere on the site.
- No partner logos, prizes, adviser names, student names, member-school lists or participation numbers. Where a section needs them, leave it out (or use an HTML comment `<!-- TODO: ... -->`).
- Case materials stay private. Only the short teaser (8 million unsold tags, A$12m board budget, the Amelia Chen quote marked fictional, stage names and dates) may appear. Never publish exhibit figures, Project Kestrel's offer terms or the Live Final announcement.
- Australian English (organise, programme only where already used, "enrol"). Sentence case headings. No exclamation marks.
- Dates (all 2027): registration closes 2 Feb · Mile 0 Briefing Check 1–2 Feb (not scored, 10 minutes) · Mile 1 Where to Play 3–10 Feb · Mile 2 Making It Pay 11–17 Feb · school nominations 21 Feb · Mile 3 Project Kestrel 22–28 Feb (nominated teams) · Live Final 4 Mar at Sydney Grammar School (top 10 teams).
- Deliverables per stage, eligibility, AI rules, judging criteria and weights: take them from section 7 below exactly.

## 4. Art direction: "Survey marker"

The concept: in 1818 an obelisk was raised in Macquarie Place, Sydney (designed by Francis Greenway), and road distances in the colony were measured from it. It is Sydney's mile zero, the point everything is measured from. The site borrows the visual language of a **colonial survey plan and its markers**: contour lines, a datum point, chain-and-traverse lines, mile-post markers, engraved linework. It should feel like a well-made survey plan crossed with a modern, warm student organisation: precise, calm, a little bit civic, never stuffy.

Avoid the current look's generic traits: cream background + Fraunces/Inter + monospace all-caps eyebrows. Do not use all-caps tracked labels, monospace fonts, `→` appended to links, middle-dot meta strings, identical rounded cards everywhere, gradients or drop shadows.

### Palette (CSS custom properties on `:root`)

| Token | Hex | Use |
|---|---|---|
| `--linen` | `#EEF0EA` | Page background (pale grey-green drafting film, not cream) |
| `--sheet` | `#F8F9F5` | Raised panels, form-like blocks |
| `--ink` | `#1D2F4A` | Body text, rules, linework (survey ink, Prussian blue) |
| `--ink-soft` | `#4B5A70` | Secondary text |
| `--sandstone` | `#C98F4E` | Sydney sandstone: contour lines, highlights, the datum point |
| `--harbour` | `#2F5D50` | Feature section background, links on dark |
| `--stake` | `#B23A2E` | Rare accent only: the "you are here / mile 0" marker and focus ring |
| `--hairline` | `#C9CFC6` | Dividers |

Feature sections (case teaser, closing CTA) use `--harbour` or `--ink` backgrounds with `--linen` text. No dark mode needed, but set `color-scheme: light`.

### Type

- **Display:** Libre Caslon Display (Google Fonts) for `h1`/`h2`. Caslon is the type of colonial Sydney printing, which ties back to 1818. Large, tight leading (1.0–1.05), slight negative tracking on big sizes.
- **Text:** Libre Caslon Text for pull quotes and small-caps labels (use `font-variant-caps: all-small-caps` with Caslon Text for labels such as stage names and dates — never uppercase + letter-spacing).
- **UI and body:** Source Sans 3 (Google Fonts), a highly legible humanist sans. (Atkinson Hyperlegible was tried first, but its slashed zero clashes with a brand called Mile Zero.) Body 18 px desktop / 17 px phone, line-height 1.6, max line length ~70 characters.
- Numerals for mile markers and dates: Libre Caslon Display, lining figures.
- Type scale (perfect fourth): 14 / 18 / 24 / 32 / 42 / 56 / 75 / 100 px; `clamp()` for h1/h2.

### Signature element (spend the boldness here)

**Home hero: a contour map centred on a datum.** A full-width inline SVG of concentric, irregular contour lines in `--sandstone` (thin, 1 px, low opacity), with a small `--stake` datum point/cross and a slender obelisk drawn in ink linework at the centre-right, labelled in small caps "Macquarie Place, 1818". The headline sits left over the map. On load, the contour lines draw in once (stroke-dashoffset animation, ~1.2 s, disabled under reduced motion). This is the only page-load animation on the site.

### Supporting devices

- **Mile posts:** each competition stage is shown as a small survey post / mile-marker shape (narrow obelisk silhouette or a squared post with a pointed top) carrying the stage number (0, 1, 2, 3, F). Used on the competition route and in the home "route" strip.
- **The route as a traverse:** the competition timeline is drawn as a survey traverse — a dashed chain line connecting the mile posts, with dates as chainage labels. Vertical on phones, horizontal on wide screens if it fits cleanly; otherwise vertical everywhere.
- **Survey grid:** a very faint grid (`--hairline`, ~120 px) on the hero and toolkit header only.
- **The ibis:** an engraved-style **line drawing of an Australian white ibis** (standing, long down-curved bill, side profile), drawn as an inline SVG with ink strokes and simple hatching, as in a 19th-century natural-history plate. Used once large on the About page ("Why the ibis?") and small in the footer. Keep it tasteful and recognisable; if it can't be drawn well, use a clean single-weight line silhouette instead of something clumsy.
- **Logo lockup (interim):** a small obelisk mark (SVG, ink) + "Mile Zero" in Libre Caslon Display. Put the mark in `/assets/img/mark.svg` so the real logo can replace it later. Favicon = the obelisk mark.
- Corners: 2 px on panels and buttons (survey sheets are square), fully round only for the datum point. Borders 1 px `--ink` at 20–100% opacity depending on emphasis.
- Buttons: primary = `--ink` fill, `--linen` text; secondary = 1 px ink outline. Text is the action ("Register your team", "Request the toolkit").

Motion: only the hero contour draw-in, plus small responsive feedback (button press, `<details>` open). No scroll-reveal animations.

## 5. Pages

Navigation (header, all pages): Competition · Starter Toolkit · Network · About · Get involved, plus a primary button "Register your team". On phones, a menu button toggles the nav (works without JS by showing the links stacked).

Footer (all pages): small ibis, one line "Mile Zero is a free, student-led initiative for NSW secondary students.", links to Rules, Privacy, Contact email `hello@milezeronetwork.org`, and "© 2026 Mile Zero".

### 5.1 Home `/`
1. Hero (signature contour map). H1: "Every business mind starts at mile zero." Lede: "Mile Zero runs the Sydney Schools Business Competition: a free, staged business case for teams from any NSW secondary school. No finance background needed." Buttons: Register your team · How the competition works. A compact "datum card" beside or below the headline listing: Registrations close 2 Feb 2027 · Mile 1 opens 3 Feb · Live Final 4 Mar, Sydney Grammar School · Entry free. (Render as a small definition list, not a middle-dot string.)
2. Why enter (three short points, no numbers): Real decisions, not trivia / Built for beginners / Judged on your thinking (copy from CONTENT.md, Home three-up).
3. Case teaser on `--harbour`: "Eight million unsold tags. Losing value every month." + teaser paragraph + Amelia Chen quote (fictional) + link to the competition page.
4. Route strip: the five mile posts with stage names and dates, linking to `/competition/`.
5. Starter Toolkit band: "No business society at your school? Start one with ours." Two sentences + button "Get the Starter Toolkit" → `/toolkit/`.
6. Closing CTA on `--ink`: "Three to four students. One school. Five weeks." + "Register before 2 February." + button.

### 5.2 Competition `/competition/`
H1 "Sydney Schools Business Competition 2027". Intro paragraph. The route as a traverse (section 7 data). Who can enter. How you're judged (criteria table + note that weights shift by stage, with the per-stage weights in a compact table). Fair play summary + link to `/rules/`. FAQ using `<details>` (copy from CONTENT.md FAQ; "What are the prizes?" → "We'll announce prizes before registration closes." — do not invent prizes). CTA.

### 5.3 Starter Toolkit `/toolkit/`
H1 "The Mile Zero Starter Toolkit". Lede: "Everything a student needs to start a business society, run a first meeting and get a team ready for SSBC. Free, and built by students who've done it."
- **Who it's for:** students starting a society; existing society leaders; teachers supervising a team.
- **What's inside, now** (available from November 2026): Start guide · Teacher one-pager · Principal one-pager · FAQ for schools · First meeting pack (run sheet, slides, icebreaker, team-forming sheet) · Poster template · Email and newsletter blurbs.
- **Coming in January 2027:** three practice sessions (reading a case; will it pay for itself?; a three-year plan on one page) · two practice cases · the SSBC rubric with an annotated sample answer · memo template.
- **How to get it:** button "Request the toolkit" (Google Form). Small note: "You'll get a link to a shared folder of editable Google Docs and Slides. Make a copy and make it yours."
- **Open to everyone:** links to the start guide and teacher one-pager (placeholders, see section 6).
- Visual: each toolkit item as a row in a "survey schedule" table (item, what it's for, format), not cards.

### 5.4 Network `/network/`
H1 "The Mile Zero Network". What it is: student business societies across Sydney sharing resources, running events together and helping schools without a society start one; every member society stays independent. What members get (resources, shared events, the toolkit first, a say in next year's competition). How to join (button "Join the network"). Ambassadors: "We're recruiting Year 9 and 10 ambassadors to help with outreach, events and next year's competition." button "Become an ambassador". No school list (comment TODO: add member societies once each has agreed).

### 5.5 About `/about/`
Mission, vision (from CONTENT.md). "Why Mile Zero?" with the obelisk story (1818, Macquarie Place, Francis Greenway, road distances measured from it). "Why the ibis?" with the large engraved ibis. Five values (these ARE a list but not a sequence, so no 01/02 numbering — use the value name in Caslon as the marker). "Who we are": one paragraph (students from schools across Sydney, a school representative network, adult advisers responsible for governance and safeguarding); TODO comment for team names.

### 5.6 Get involved `/get-involved/`
Four blocks: Students (register; become an ambassador) · Teachers (request the toolkit and teacher pack; note the only requirement is a staff member who knows a team is taking part) · Business societies (join the network) · Partners ("Universities, firms and nonprofits can help as case reviewers, judges, mentors or venue hosts. Partners never influence judging or selection." → `mailto:partners@milezeronetwork.org`). Contact: hello@milezeronetwork.org.

### 5.7 Rules `/rules/`
The full "Welcome and Rules" content from section 7 (who can enter, how it works, who goes through, rules for every submission, use of AI, fair play, how work is judged, results and appeals, privacy and consent, accessibility, contact). Long-form reading layout, sticky in-page contents list on wide screens.

### 5.8 Privacy `/privacy/`
Plain-language: what we collect through forms (name, school, year group, email, team details), why, who sees it (organisers and judges only), recorded pitches kept securely and deleted after the competition, consent before using names/photos/recordings/school information in promotion, how to ask for data to be removed (hello@milezeronetwork.org). Add a TODO comment to have the adult committee review it.

### 5.9 404 `/404.html`
"You've wandered off the map." + links home and to the competition. Small contour motif.

## 6. Links and forms

All Google Form links live in ONE place: `/assets/js/links.js` sets `href` on elements with `data-link="register|toolkit|network|ambassador"`. Every such element must also have a working no-JS fallback `href` of `mailto:hello@milezeronetwork.org?subject=...` with a sensible subject. In `links.js`, the form URLs are constants at the top with value `""`; when empty, the mailto fallback stays. Document this in `README.md` ("To connect a form, paste its URL here").

Same for the toolkit "open to everyone" document links: `data-link="startguide|teacherpager"`, fallback to `/toolkit/#request`.

## 7. Source content (use exactly)

**Who can enter:** students enrolled at a NSW secondary school; teams of three to four students from the same school; each school may enter up to three teams; a student can be in only one team; each team needs a teacher or staff member at the school who knows the team is taking part. Free; no paid databases or software needed.

**Stages and deliverables**
- Mile 0, Briefing Check (1–2 Feb): short auto-marked check of 5–6 questions on the Opening Case; 10 minutes once opened; not scored; one set of answers per team.
- Mile 1, Where to Play (3–10 Feb): decision worksheet, memo of 150–250 words, one evidence calculation.
- Mile 2, Making It Pay (11–17 Feb): decision worksheet (three-year plan, investment plan and a 30% slower scenario), memo of 150–250 words, recorded pitch of 2–3 minutes in which every team member speaks.
- School nominations (21 Feb): each school nominates one team, based on its Mile 1 and Mile 2 results.
- Mile 3, Project Kestrel (22–28 Feb, nominated teams): response memo of up to 400 words, a table of what changes in the plan, a one-page term sheet.
- Live Final (4 Mar, Sydney Grammar School): top 10 teams overall, ranked on Mile 1, Mile 2 and Project Kestrel. Presentation up to 7 minutes, 5 minutes of judges' questions, then a 5-minute live response to new information. Any team member may be asked about any decision.

**Judging criteria** (same five at every stage; weights shift): Problem framing and strategic insight · Evidence and quality of analysis · Feasibility and financial reasoning · Recommendation and trade-offs · Communication.
Weights — Mile 1: 25 / 35 / 10 / 20 / 10. Mile 2: 25 / 25 / 20 / 20 / 10. Project Kestrel: 20 / 20 / 20 / 30 / 10. Live Final: 20 each. Mile 0 is not scored.

**Rules for every submission:** submit before the closing time (late work not marked); base analysis on the case figures, with at most one or two named outside sources across the competition; every number must come from the case, a named source or a stated assumption; stay within word and time limits; contact organisers before the deadline if a verified technical failure stops you submitting.

**Use of AI:** AI may help with research and editing; analysis and decisions must be the team's own; every submission includes a short note listing AI tools used and for what; teams must be able to explain every number and choice; handing the main analysis to an AI tool or another person without declaring it breaks the rules.

**Fair play:** work only with your own team; teachers, parents, tutors and professionals may help with general skills but must not write or shape the analysis; don't share case materials publicly before the Live Final on 4 March; treat others with respect; breaches may lead to a penalty or disqualification.

**How work is judged:** submissions are coded so markers don't see school names; shared rubric; teams near the finalist cut-off are marked by two judges; judges declare conflicts of interest; sponsors and partners have no influence on results.

**Results and appeals:** appeals limited to procedural errors or breaches of the published rules, in writing within three days of results.

**Privacy and consent:** consent before using student names, photos, recordings or school information in promotion; recorded pitches kept securely, seen only by organisers and judges, deleted after the competition.

**Accessibility:** no paid databases or software; reasonable adjustments (extra time, different format) on request before a stage opens.

Mission, vision, values, obelisk and ibis copy, home copy and FAQ: use `CONTENT.md` (fix UNSW → Sydney Grammar School).

## 8. Deliverables and definition of done

Files: `index.html`, `competition/index.html`, `toolkit/index.html`, `network/index.html`, `about/index.html`, `get-involved/index.html`, `rules/index.html`, `privacy/index.html`, `404.html`, `assets/css/site.css`, `assets/js/site.js`, `assets/js/links.js`, `assets/img/mark.svg`, `assets/img/ibis.svg` (if not inline), `favicon.svg`, `README.md` (how to edit pages, connect forms, swap the logo), updated `CONTENT.md`. Keep `CNAME`.

Done means:
- Every page renders correctly at 1440, 1024, 768 and 390 px with no horizontal scroll (check with a headless browser screenshot).
- No broken internal links (check with a script).
- `grep -ri unsw` returns nothing in site files.
- HTML is valid (no unclosed tags); one h1 per page; focus states visible.
- No console errors.
