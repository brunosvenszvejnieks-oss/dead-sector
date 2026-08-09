# DEAD SECTOR — Development Build

This is the source-project version of DEAD SECTOR.

## Files
- `index.html` — game markup / menus / HUD
- `style.css` — all visual styling and responsive layout
- `maps.js` — five sector definitions and obstacle geometry
- `audio.js` — sound engine
- `mobile.js` — touch detection, orientation gate, virtual sticks, browser touch guards
- `game.js` — core game loop, combat, zombies, pickups, progression, UI logic

## Run it on your PC
Do **not** double-click `index.html` for development. Serve the folder over localhost instead.

### Easiest option
Double-click `START_SERVER.bat` on Windows, then open:

    http://localhost:8080

Python 3 must be installed. Stop the server by closing the command window.

### Manual option
Open a terminal in this folder and run:

    python -m http.server 8080

Then open `http://localhost:8080`.

## Refreshing changes
When a source file is replaced/edited, save it and refresh the browser (`Ctrl+R`). For JavaScript/CSS caching issues use `Ctrl+Shift+R`.

## Mobile testing
For reliable phone testing, host this folder on HTTPS (GitHub Pages, Netlify, Vercel, itch.io, etc.) and open that URL in Safari/Chrome. ChatGPT's inline HTML preview is not a reliable game runtime.
