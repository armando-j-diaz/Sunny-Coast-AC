# Sunny Coast AC

Public site for **sunnycoastac.com**. Cool Now South Florida LLC DBA Sunny Coast AC.

**Conversion goal:** schedule an in-home install visit (lead form on `/book/` / `/reviews/`). Primary CTA: **Get a Free Quote**.

## Stack

Plain HTML + CSS + vanilla JS. No build step. GitHub Pages from `main` (repo root). Clean URLs use folder `index.html` paths (e.g. `/services/`). Old `*.html` URLs redirect to the new paths.

| URL | Job |
|------|-----|
| `/` | Home landing |
| `/book/` | VSL + collage + reviews + lead form + FAQ |
| `/services/` | Install-first services + repair vs replace |
| `/our-work/` | Gallery |
| `/about/` | About |
| `/reviews/` | Reviews carousel + lead form |
| `/contact/` | Phone, email, hours, service area |
| `/guide/` | Optional lead magnet |
| `/legal/` | Privacy / consent |

Fill-in checklist: `project-memory/CONTENT_NEEDED.md`

## VSL video

Drop your pitch file at `assets/vsl.mp4`. Behavior: autoplays muted; click/tap restarts from the beginning **with sound**.

```html
<script>
  window.SUNNYCOAST = { vslSrc: "assets/vsl.mp4", makeWebhook: "https://hook..." };
</script>
```

## Local preview

```bash
cd "/path/to/Sunny-Coast-AC"
python3 -m http.server 8080
# open http://localhost:8080
```

## Placeholders (replace before launch)

| Token | Where |
|-------|--------|
| `{{PHONE}}` | **(786) 822-6861** (set) |
| ~~`{{LICENSE}}`~~ | **CAC1825130** (set) |
| Make webhook | Live on book/home/reviews/guide forms → email `admin@sunnycoastac.com` |
| `{{OFFERS}}` | Offers section (hidden until real offers) |

Optional runtime override (before `main.js`):

```html
<script>
  window.SUNNYCOAST = { phone: "3055550199", makeWebhook: "https://hook.make.com/..." };
</script>
```

## DNS

See [DNS-records.md](./DNS-records.md). Custom domain file: `CNAME` → `sunnycoastac.com`.

## Docs

- Brand + section contract: OneDrive `sunnycoast/SUNNYCOAST_MASTER.md`
- Agent decisions: [BUILD_LOG.md](./BUILD_LOG.md)

## Brand-legal

Never mention JET AC, AHS/American Home Shield, Frontdoor, warranty work, or 911 Cooling on this site.
Footer legal name: Cool Now South Florida LLC DBA Sunny Coast AC.

## Editing styles

Edit `fonts.css`, `tokens.css`, or `styles.css`, then run:

```bash
node scripts/build-css.mjs
```

Commit the regenerated `site.min.css` with the source changes. Pages serves this
combined, minified file directly; no hosting build or framework is needed. The
script uses a pinned esbuild version through npx (Node.js and network access on
first run). The existing fonts are self-hosted under `assets/fonts/`, with their
licenses. Keep the responsive logo and van image variants in the HTML when editing.

## Review flow (live 2026-09-16)

`/reviews/leave/` contains two links: good experience opens the owner's supplied
Google Maps profile; bad experience opens `/reviews/feedback/`, a separate private
feedback form with the satisfaction message. Google still requires the visitor to
choose Write a review on that profile. This is the owner's requested layout.

Styling lives in `reviews/reviews.css`; only the feedback page loads `reviews/reviews.js`.

**Private feedback is connected.** On `sunnycoastac.com` / `www` the form posts JSON to
`https://quotes.sunnycoastac.com/api/feedback` (the Ops worker, `src/feedback.js` in the
proposal-tool repo). The worker saves it first, shows a red URGENT banner on every Ops page
plus the **Feedback** tab at `/apps#feedback`, and posts an `@channel` Slack alert. No Jobber
record, lead, text, or email goes to the customer.

- Local preview (`localhost` / `127.0.0.1`) **never** posts to production. It validates and says
  nothing was sent. To test end to end, run `npx wrangler dev` in `proposal-tool/` with
  `.dev.vars` containing `FEEDBACK_ALLOW_LOCAL=1` and `FEEDBACK_SLACK_MOCK=1`, then open
  `/reviews/feedback/?feedback_api=http://127.0.0.1:8787`.
- Any other host disables the form and shows the phone/email.
- Each message carries a `submission_id`; a retry or double click never makes a duplicate.
  Text stays in the form until the worker confirms it saved.
- Never send complaint submissions into the quote-request (Make) webhook.

The Google policy concern about routing by sentiment was explained to the owner; this
layout is his choice, not a claim of policy compliance.
