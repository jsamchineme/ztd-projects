# Studio design preview

A throwaway page for picking Studio's new look. It isn't part of Studio itself: nothing in `server.mjs` or `public/` at the repo root uses it.

Run it as a service in this project: command `node design-preview/server.mjs`, any free port. Studio sets `PORT`.

Each option is a set of CSS variables in `public/index.html` (`[data-style="…"][data-mode="…"]`). To apply one, map its tokens onto the `:root` variables in the repo's `public/app.css`. Delete this folder once a style is chosen.

Keys: 1–6 switch style, D toggles light/dark, S switches between the chat and projects screens. The address bar keeps the choice (`#style=calm&mode=dark`), so links can be shared.
