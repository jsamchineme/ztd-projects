# Project

Built with ZTD Devs Studio. `node server.mjs` serves `public/` on `$PORT`.
Studio runs it as the "web" service; after changing `server.mjs`, restart it with `sudo studio-ctl svc <project> web restart`.

## Prototype layout
Clickable Pixieset replica, plain ES modules, no build step (front-end edits only need a browser reload).
- `public/css/ds.css` — design system (tokens, components, layouts)
- `public/js/core.js` — icons, hash router (`route()`), `data-act` click actions, modal/toast, localStorage state
- `public/js/data.js` — mock data (images from picsum.photos)
- `public/js/admin.js` — photographer dashboard: Client Gallery, Studio Manager, Website, Store, Mobile App, Photo Editor, Settings
- `public/js/client.js` — launcher (`#/`) and client-facing pages: gallery `#/g/:id`, booking `#/book`, invoice `#/pay/:id`, contract `#/sign/:id`, site `#/site`, app `#/app/:id`
