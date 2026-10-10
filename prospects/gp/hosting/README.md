# GP prospect hosting / deployment map

How to get the website restyle widget onto each practice's site, grouped by who
you ask and how.

## Files
- `deployment-plan.csv` — per-practice: id, name, website, platform, host, channel
- `by-domain.tsv` — raw fingerprint per unique domain (ip, ip_org, nameserver, cname, server headers)
- `by-vendor/` — `deployment-plan.csv` split into one CSV per channel (contact lists)
- `host-detect.sh` — regenerates `by-domain.tsv` + report from `prospects/gp/data`
- `outreach/vendor-integration-email.md` — email for platform vendors (one deal = many sites)
- `outreach/manager-gtm-instructions.md` — manager-facing install (GTM / script / Cloudflare / Wix / Squarespace)

## Channel breakdown (962 sites)
| Sites | Channel |
|------:|---------|
| 289 | Direct `<script>` / Google Tag Manager |
| 214 | NHS Scotland central web team (SHOW) |
| 208 | Vendor: My Surgery Website |
| 197 | Cloudflare-fronted (GTM or Worker) |
|  36 | Vendor: Silicon Practice (gpsurgery.net) |
|   9 | Wix (self-serve) |
|   8 | Squarespace (self-serve) |
|   1 | Vendor: Practices365 |

## Strategy
~5 relationships cover ~48% of the list: My Surgery Website (208), NHS Scotland
SHOW (214), Silicon Practice (36), Practices365 (1) = 459 sites via platform-level
integration. For the rest, the universal ask is one Google Tag Manager container
with publish access.

## Regenerate
```sh
bash prospects/gp/hosting/host-detect.sh prospects/gp/data prospects/gp/hosting/out 12
```
