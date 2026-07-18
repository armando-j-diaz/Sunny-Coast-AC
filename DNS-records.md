# DNS records — sunnycoastac.com → GitHub Pages

Mirror of the jet-mes playbook. Point these at your registrar (wherever sunnycoastac.com is parked).

## Apex (sunnycoastac.com) — A records

| Type | Host | Value | TTL |
|------|------|-------|-----|
| A | `@` | `185.199.108.153` | 3600 (or Auto) |
| A | `@` | `185.199.109.153` | 3600 |
| A | `@` | `185.199.110.153` | 3600 |
| A | `@` | `185.199.111.153` | 3600 |

## www — CNAME

| Type | Host | Value | TTL |
|------|------|-------|-----|
| CNAME | `www` | `armando-j-diaz.github.io` | 3600 |

## After DNS propagates

1. Repo → **Settings → Pages**
2. Source: **Deploy from a branch** → `main` / `/ (root)`
3. Custom domain: `sunnycoastac.com`
4. Wait for DNS check to pass
5. Tick **Enforce HTTPS** (Let's Encrypt provisions automatically)

## Repo

- GitHub: https://github.com/armando-j-diaz/Sunny-Coast-AC
- Preview (until custom domain is live): https://armando-j-diaz.github.io/Sunny-Coast-AC/ (or via user Pages domain if configured)
- When DNS is ready: add a `CNAME` file containing `sunnycoastac.com` at repo root, then Settings → Pages → Custom domain = `sunnycoastac.com` → **Enforce HTTPS**

## Notes

- Do not add conflicting A/AAAA/CNAME on `@` or `www` while switching.
- Propagation often 5–60 minutes; can take up to 48h.
- Until HTTPS enforces, browsers may warn — that’s normal mid-cutover.
