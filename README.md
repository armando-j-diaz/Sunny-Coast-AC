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
| `{{PHONE}}` | **(786) 667-1180** (set) |
| ~~`{{LICENSE}}`~~ | **CAC1825130** (set) |
| `{{MAKE_WEBHOOK_URL}}` | Guide form (`guide.html`) |
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
