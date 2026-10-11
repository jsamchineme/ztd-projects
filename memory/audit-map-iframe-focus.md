---
name: audit-map-iframe-focus
description: How to clear the browser-audit "no visible focus" major on embedded Google Maps iframes
metadata:
  type: feedback
---

The Build-stage browser audit (audit.mjs) flags a cross-origin Google Maps embed iframe as a **major keyboard issue** ("1 control shows no visible focus when tabbed to"). A CSS `:focus`/`:focus-visible` outline on the iframe does NOT clear it reliably — the audit reads `document.activeElement` and can't see focus styling land on the cross-origin frame.

**Why:** the map embed is supplementary; the address text already conveys the location.

**How to apply:** take the iframe out of the tab order and provide an accessible text alternative instead:
- `tabindex="-1" aria-hidden="true"` on the `<iframe>`
- add a visible `<a ... target="_blank" rel="noopener">📍 Open in Google Maps — <address></a>` link beside/below it (min-height 44px for tap target)

Also: audit counts tap targets by rect height — custom link classes (e.g. `.emergency a.call`) need their own `min-height:44px`; a `.btn` base rule won't cover non-`.btn` links. Related: [[nhs-hours-source]].
