# Sunny Coast AC — Build Log

Agents append decisions and progress here. Master contract: `onedrive/sunnycoast/SUNNYCOAST_MASTER.md`.

---

## L0 — Design plan (2026-07-18)

### Subject / job
South Florida homeowners with a broken or dying AC. Single job: get them to **text or call** Sunny Coast AC.

### Palette (from master §3 — tokens.css)
| Token | Hex | Role |
|---|---|---|
| `--foam` | `#F7F9FB` | Page background |
| `--navy` | `#0D3B66` | Body text + footer |
| `--sun-orange` | `#F7941D` | Primary CTA only |
| `--sunset` | `#F26522` | CTA hover / urgency |
| `--surf-blue` | `#29ABE2` | Links, wave foam accents |
| `--deep-blue` | `#1B75BC` | Wave structure |
| `--teal` | `#2BB6A3` | Guarantee / check accents |
| `--sun-gold` | `#FFC93C` | Small accents only |
| `--white` | `#FFFFFF` | Reversed text / cards |

No purple. Flat orange pills. Gradients only inside brand art.

### Type pairing
| Role | Face | Why |
|---|---|---|
| Display | **Baloo 2** ExtraBold (800) | Chunky, warm, rounded — echoes the logo wordmark energy without faking the script |
| Body | **Figtree** 400/500 | Clean humanist sans; readable on phone at 17–18px |
| Script accent | **Caveat** | Tiny eyebrows only (≤3 sitewide) — echoes "South Florida" lockup |

Banned: Inter, Roboto, Arial/system, serifs, Lobster/Pacifico.

### Layout concept
Acquisition.com discipline: single centered column, max **1170px**, huge ALL-CAPS headlines, generous foam whitespace. Mobile-first at 390px. Sticky header (logo + Text/Call) + sticky mobile bottom bar. No mega-menu, no card grids of features.

ASCII wire (mobile):
```
[ logo          TEXT | CALL ]
[ eyebrow script            ]
[ H1 QUESTION               ]
[ Sunny art                 ]
[ sub + risk line           ]
[ TEXT US  /  CALL          ]
~~~~ wave ~~~~
[ trust strip               ]
~~~~ wave ~~~~
[ 3 promises                ]
... sections ...
~~~~ wave + Sunny peek ~~~~
[ Stay-Cool Guarantee       ]
[ FAQs                      ]
[ Final CTA (sunset tint)   ]
[ Footer legalese           ]
[ sticky TEXT | CALL bar  ]
```

### Signature element
**The Wave** — SVG section dividers derived from the logo’s surf line. Sunny appears at exactly two moments: full art in the hero, half-peek over the wave into the guarantee section. Everything else stays quiet.

### Aesthetic risk
Leading with a cartoon surfing-sun mascot as the hero (not a stock tech photo or abstract gradient). Most AC sites hide behind stock photography; Sunny Coast owns the character. Risk of looking “kids brand” is mitigated by acquisition.com typographic restraint, navy-on-foam seriousness in body/footer, and orange used only for action.

### Self-critique vs “any AC company”
Would a generic AC brief produce Baloo + wave dividers + Sunny peek + foam/orange/navy from mascot art? Unlikely — those are brand-derived. Revised away from: purple accents, three emoji feature cards, Inter, cream-serif-terracotta, dark-mode glow.

### Hosting
GitHub Pages at repo root (`armando-j-diaz/Sunny-Coast-AC`). Domain: sunnycoastac.com. See `DNS-records.md`.

---

## L1–L5 progress

- 2026-07-18: Repo created. Assets copied + WebP compressed (logo ~130KB, van ~219KB). Site files authored at repo root for Pages. Placeholders `{{PHONE}}`, `{{LICENSE}}`, `{{MAKE_WEBHOOK_URL}}` left intentional. Offers + reviews + before/after built but `hidden` / `data-flag="off"`.
- 2026-07-18: Pushed to https://github.com/armando-j-diaz/Sunny-Coast-AC. Pages = main/root, CNAME = sunnycoastac.com (HTTPS pending DNS). Type: Poppins (Acquisition-style; was Baloo/Figtree/Caveat). Tagline “Stay cool. We got you.” removed from UI.

### Pass 2 — VSL funnel (2026-07-18)

Armando direction after reviewing live site + acquisition.com screenshots:
- Business = **AC installers** (not repair shop). Funnel = **schedule appointment** → call back (not “text for price”).
- Shorter homepage: no hero mascot art (logo stays in header only).
- New `book.html` VSL page: muted autoplay video → click restarts with sound; rapport (review layout + install photo slots); lead form (phone, first, last, optional email, SMS checkbox); Hormozi-style dark FAQ bars; final CTA scrolls back to form.
- Drop `assets/vsl.mp4` (pitch video) when ready, or set `window.SUNNYCOAST.vslSrc`.
- Sample review cards are labeled as layout-only — replace with real Google reviews; do not invent testimonials.
- 2026-07-18: Crew rapport added (40+ years / hundreds of installs). Internal notes in Cursor `project-memory/COMPANY.md` (not in public repo).

### §2.2 checklist (v1)

| Item | Status |
|------|--------|
| Phone sticky + tap-to-call | **(786) 667-1180** |
| Book/Schedule CTA after sections | Text Us CTAs throughout |
| Risk reversal up top | Hero risk line |
| Named satisfaction guarantee | Stay-Cool Guarantee section |
| Reviews with real names | Component built, flagged off |
| Google/BBB badges | Omitted until real (never fake) |
| License in footer | **CAC1825130** |
| Service area | Footer + FAQ |
| Financing mention | Services section |
| Offers section | Built, flagged off + DRAFT cards |
| Brand character | Sunny hero + guarantee peek |
| Real van photos | van.webp in trust section |
| Before/after gallery | Built, flagged off |
| Maintenance membership | Deferred (roadmap) |
