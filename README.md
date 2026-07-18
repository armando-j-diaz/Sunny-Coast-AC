# Sunny Coast AC

Public site for **sunnycoastac.com** — Cool Now South Florida LLC d/b/a Sunny Coast AC.

**Conversion goal:** get the visitor to text or call. Nothing else competes.

## Stack

Plain HTML + CSS + vanilla JS. No build step. GitHub Pages from `main` (repo root).

## Local preview

```bash
cd "/path/to/Sunny-Coast-AC"
python3 -m http.server 8080
# open http://localhost:8080
```

## Placeholders (replace before launch)

| Token | Where |
|-------|--------|
| `{{PHONE}}` | All pages + optional `window.SUNNYCOAST.phone` in console/config |
| `{{LICENSE}}` | Footer / legal |
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
Footer legal name: Cool Now South Florida LLC d/b/a Sunny Coast AC.
