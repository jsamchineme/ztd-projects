---
name: audit-iframe-focus-fix
description: How to clear the audit's "no visible focus" major on embedded Google Maps iframes
metadata:
  type: feedback
---

The browser audit (audit.mjs, WCAG keyboard check) flags a cross-origin Google Maps `<iframe>` as "control shows no visible focus when tabbed to". You CANNOT fix this by styling `iframe:focus`/`:focus-visible` — tabbing moves focus *into* the iframe's own cross-origin document, so the parent page's focus styles never apply, and any outline you set gets clipped by the map wrapper's `overflow:hidden` anyway.

**Why:** It's a genuine cross-origin limitation, not a CSS bug.

**How to apply:** Make the supplementary embed non-focusable (`tabindex="-1" aria-hidden="true"` on the iframe) and add a real, focusable "Open in Google Maps" `<a>` link next to it (visible focus outline works normally on the link). This clears the major and is a legitimate accessibility pattern since the address is also available as text. Applied on card #47.

Related: contrast majors on this pipeline usually come from white text on `--teal` buttons and dark-teal text on pale-teal backgrounds — darken the teal used for text/buttons to hit 4.5:1. See [[borders-orthodontics-card]].
