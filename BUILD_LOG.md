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
- 2026-07-18: Mobile PageSpeed pass — perf **92**, a11y/best/seo **100**. Responsive WebPs, async fonts, AA button contrast (`#c2410c`), opacity-only reveals (CLS 0), favicon, robots/sitemap.

### Technical SEO gaps (2026-08-05)

No content rewrites. Added only discoverability markup:
- Open Graph + Twitter cards on all real pages (image: `assets/van-1200.webp`)
- JSON-LD `@graph`: `HVACBusiness` sitewide; homepage also `WebSite`. Service-area business (no street address — not published yet). License CAC1825130, phone, email, Mon–Fri 09:00–17:00, Miami-Dade + Broward.
- Root `llms.txt` (page map). Low expected citation lift; cheap hedge.

### §2.2 checklist (v1)

| Item | Status |
|------|--------|
| Phone sticky + tap-to-call | **(786) 822-6861** |
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

## 2026-09-07 — Mobile Lighthouse fixes (prepared locally)

Preserved the existing navy/foam layout, Poppins hero, Baloo headings, Figtree body,
wave divider and business copy. Darkened orange actions and blue links/eyebrows,
and removed faded brand text, to keep white/button and small-text contrast at AA.
This is a performance/accessibility pass; the existing Sunny Coast visual identity
already supplies the design direction required by the master brief.

- Self-host the existing Latin font subsets with their OFL licenses; preload the
  body and hero fonts, removing the Google Fonts stylesheet/connection chain.
- Serve one committed, minified stylesheet. Editable sources remain fonts.css,
  tokens.css and styles.css; rebuild using `node scripts/build-css.mjs`.
- Add responsive compressed logo and van derivatives, preserving original files.
- Render first-screen text immediately. Below-fold fades initialize only when the
  observer is available, and all content remains visible if JavaScript fails.
- Analytics and lead submission behavior are unchanged.

Original supplied PageSpeed report: 89 performance / 96 accessibility / 100 best
practices / 100 SEO, FCP 2.6s, LCP 3.3s, CLS 0. Local equivalent baseline: 97/96/100/100,
FCP 1.5s, LCP 2.5s. Optimized local Lighthouse 13.4.0: 100/100/100/100,
FCP 1.1s, LCP 1.4s, TBT 10ms, CLS 0. Local and Google-hosted scores are not directly
interchangeable. Live retest is required after publication.

20 HTML routes checked at mobile width; desktop/mobile screenshots reviewed;
menu, Escape, no-JS content and form validation checked without sending leads.
The booking page's missing vsl.mp4 is pre-existing and has its existing poster fallback.
Hosting-controlled cache lifetime and Google Analytics unused-JS diagnostics remain;
do not disable analytics or change DNS just to remove unscored suggestions.

Armando approved publication on 2026-09-07 after restoring the original orange
and adjusting the booking anchor. This release includes those approved fixes.
Detailed reports are outside this public repo, in OneDrive
sunnycoast/2026-09-07/website-lighthouse/.

### Owner correction — original orange and booking anchor

Restored the original action orange #e8910f and hover #d97706 with the original
white text at Armando's request. This supersedes the darker action color above;
the prior 100 accessibility result does not describe the restored color palette.
Added sticky-header clearance plus 1rem to the #book anchor using scroll-margin-top.

## 2026-09-16 — Review experience, LOCAL PREVIEW ONLY

Armando requested Liberty Air's good/bad experience idea, a 100% satisfaction message,
and Sunny Coast styling, with a Leave a review button replacing the reviews placeholder.

- `/reviews/`: new navy promise panel, brand-orange Leave a review button, supplied
  Google listing link; original quote form preserved. Mobile action points to review flow.
- `/reviews/leave/`: good/bad choices, contextual response, private feedback form,
  and an equally available Google link before and after either choice. Bad opens private
  feedback; good keeps it optional. No sentiment hides or blocks Google.
- Homepage: small "Already had a visit? Leave a review" line under FAQ for owner review.
- Page-specific `reviews/reviews.css` / `reviews/reviews.js`; existing global bundle untouched.
- Google link verified as Sunny Coast AC, matching website and phone:
  https://maps.app.goo.gl/6EwhpDbNQBNjCVNv5. It opens the profile; user selects Write a review.
- Promise explains listening and working to make things right; no refund, response-time,
  or lifetime-warranty terms added.

**Not deployed. Private feedback delivery is NOT connected.** The form explicitly says
preview; localhost submission validates and shows a not-sent/not-saved message. Submit
is disabled outside localhost. No feedback storage, outbound send, Worker/Make change,
or customer outreach. Before launch, connect a dedicated feedback receiver and verify
internal delivery; do not reuse the sales booking webhook for complaints.

Checked in browser at desktop and 390px phone width: landing, both choices, retained
Google access, required-field validation and successful local-only form test. No mobile
horizontal overflow. JavaScript syntax, local asset/link targets, unique HTML IDs and
unchanged existing quote form checked. Existing repository mode changes preserved.

References: https://www.jumpem.review/libertyair/ (good → Google, bad → private form),
https://support.google.com/contributionpolicy/answer/7400114 (no selective solicitation).


### Owner revisions — 2026-09-16, supersedes the initial review preview above

Reviews landing: removed eyebrow and reassurance sentence; moved the explanatory
copy into the lede; enlarged and centered the card heading, action and Google link.
Experience page: removed eyebrow, shared Google CTA, explanatory Google text,
response panels and expandable form. Good is a direct link to the supplied Google
Maps profile; bad links to new `/reviews/feedback/`. The new page says "We want you
100% satisfied. Tell us what went wrong, and we'll work to make it right."

The private form remains explicitly disconnected and local-only. Verified navigation,
mobile rendering, form test and return link. No deployment or outbound submission.
Earlier policy advice remains a recorded concern, not the behavior of this revised
owner-directed local prototype. Google link opens profile, not the review composer.

## 2026-09-16 — Review flow published; private feedback connected (supersedes "local only" notes above)

Armando approved going live. The `/reviews/` landing, `/reviews/leave/` choices,
`/reviews/feedback/` form and the homepage review link ship together.

- `reviews/reviews.js` now posts to `https://quotes.sunnycoastac.com/api/feedback`
  (Ops worker version `045042c0`, deployed first). Preview notice removed; button reads
  "Send feedback". Success shows only after the worker confirms the save:
  "Thank you for letting us know. Our team will review your message and follow up."
- Safe modes: localhost never contacts production (opt-in `?feedback_api=` for a local
  worker only); other hosts disable the form. Failures keep the typed text.
- Worker side: saved in a Durable Object, red URGENT banner on every Ops page, Feedback tab,
  `@channel` Slack alert with retries. No Jobber, lead, SMS or email to the customer.
- Tested: desktop + 390px phone against a local worker (success, local no-send, network
  failure keeps text). Live: one synthetic submission posted twice → one record, Slack
  "sent", then marked handled.
