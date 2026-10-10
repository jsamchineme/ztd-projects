# Mapboard

A canvas for thinking through problems: sticky notes, shapes, text, connectors, freehand pen and frames, with multiple boards.

## Run it

Everything lives in one file, `index.html`. You can open it in three ways.

**Open the file directly.** Double-click `index.html`. This works in most browsers, but some (Safari in particular) restrict storage for local files, so a local server is more reliable.

**Use the start script.** It needs Python 3 or Node.js.

- macOS / Linux: `./start.sh`, then open http://localhost:8080
- Windows: double-click `start.bat`, then open http://localhost:8080

To use a different port, pass it as an argument, for example `./start.sh 3000`.

**Use any static host.** Copy `index.html` to nginx, Apache, Caddy, GitHub Pages, Netlify or similar. No build step is needed.

## Generate a board with Claude

Run `make start` (it needs Node.js), then open http://localhost:4380. In the boards menu, choose **New board → Generate with Claude**, describe the board you want, and press **Generate** (or ⌘/Ctrl + Enter). A board usually takes 20 to 60 seconds.

The local server sends your prompt to the [Claude Code](https://claude.com/claude-code) CLI on your computer, so the request runs on whatever account `claude` is logged in with. Install Claude Code and run `claude` once to log in first. To use a different model, run `CLAUDE_MODEL=opus make start`. Generating isn't available when you open `index.html` directly or use `start.sh` / `start.bat`.

### Edit a board with Claude

When Mapboard runs through `make start`, an **Ask Claude** bar sits at the bottom of every board. Type a request and press Enter. For example:

- "Add a section on pricing for private practices"
- "Add a note to Risks about GDC registration numbers"
- "Retitle Phase 1 to Restyle and colour its notes sky"
- "Remove the This weekend section"

Claude can add sections (placed below the existing board), add notes to a section, reword, recolour, delete and connect items. Select items first to point Claude at them ("reword these"). Each request is a single change on the board, so ⌘/Ctrl + Z undoes all of it at once.

## Where your boards are saved

Boards are saved in your browser's local storage. That has three consequences:

- **They're tied to one browser and one address.** `http://localhost:8080` and `http://127.0.0.1:8080` count as different places, as do different ports. Always open Mapboard the same way.
- **Clearing site data deletes them.** So does a private or incognito window when you close it.
- **They aren't shared** between browsers, devices or people.

To keep a backup, or to move a board somewhere else, open the boards menu (top left) and choose **Export this board**. You'll get a `.json` file, which **Import a board** brings back in.

## Fonts and offline use

The app loads the Hanken Grotesk font from Google Fonts. With no internet connection it falls back to your system font and everything still works.

## Shortcuts

| Key | Action |
| --- | --- |
| Double-click | Add a note, or edit text |
| V H N T R O D C P F | Select, pan, note, text, rectangle, ellipse, diamond, connector, pen, frame |
| Scroll / ⌘ or Ctrl + scroll | Pan / zoom |
| Space + drag | Pan with any tool |
| Shift + 1 | Fit the board to the screen |
| ⌘ or Ctrl + Z / Shift + Z | Undo / redo |
| ⌘ or Ctrl + D | Duplicate |
| Delete | Remove the selection |

Select an item and drag one of its blue dots to connect it to another item, or click a dot to add a connected item beside it.
