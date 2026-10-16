# Studio design preview

A throwaway service for trying Studio's new look ("Paper · ZTD blue") on every page before it goes into Studio.
Studio itself doesn't use anything in this folder.

Run it as a service in this project: command `node design-preview/server.mjs`, any free port (Studio sets `PORT`).

- `/` is the **redesign mock-up** (`mockup/`): every Studio screen redrawn in the Paper · ZTD blue style, as a
  clickable mock-up. It includes a new projects home page, one sidebar with each project's chats, ⌘K search, new
  service cards, a side-by-side Changes view, a file tree, settings pages with a section menu, and new sign-in
  screens. The **Screens** button (bottom right) lists every screen and dialog and switches light/dark.
  Nothing in it is wired to real data; it's for agreeing the design before any of it is built.

- `/p/p1/chat/c1`, `/login` and the other app addresses: the earlier recolour. Studio's **real** front end, read live from `../public`, with `ztd/app.css`,
  `ztd/icon.svg` and `ztd/fonts/` in place of Studio's own. A fake API (`mock.mjs`, data in `mock-data.mjs`)
  answers every call, so each page, tab, dialog and toast is the real one. Sending a chat message plays a
  short scripted Claude run. Nothing touches the real Studio, its database or its projects.
- The **Preview** button (bottom right) jumps to every screen, including the sign-in ones, opens dialogs
  and toasts, switches System / Light / Dark, and resets the fake data.
- `/options` is the earlier page comparing six styles.

To apply the look to Studio: copy `ztd/app.css` to `public/app.css`, `ztd/icon.svg` to `public/icon.svg`, and
`ztd/fonts/` to `public/fonts/`. The fonts are served by Studio itself, because its security policy blocks
Google Fonts. Then delete this folder.

The fonts are DM Sans, Fraunces and JetBrains Mono, all under the SIL Open Font License.
