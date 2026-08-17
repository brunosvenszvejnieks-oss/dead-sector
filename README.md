# DEAD SECTOR — Development Build

This repository contains the direct-source version of DEAD SECTOR. The browser loads the checked-in game files directly; there is no runtime source patching.

## Runtime structure

- `index.html` — menus, HUD, overlays, and script loading order
- `style.css` — complete visual layer, including PC and responsive rules
- `maps.js` — level definitions, obstacles, spawns, and barricade geometry
- `audio.js` — synthesized sound engine
- `mobile.js` — touch detection, orientation gate, and virtual controls
- `pc-ui.js` — PC-only cursor and interface helpers
- `game.js` — core runtime in one closure, divided into labeled system sections

The core runtime remains one closure deliberately. This preserves shared state, initialization order, and gameplay behavior while keeping the systems easy to navigate.

## Run locally

Do not double-click `index.html` for development. Serve the folder over localhost.

### Windows

Double-click `START_SERVER.bat`, then open:

    http://localhost:8080

### Manual

Run:

    python -m http.server 8080

Then open `http://localhost:8080`.

## Validation expectations

Before publishing a change:

1. Check JavaScript syntax for every script.
2. Confirm `index.html` loads source files directly.
3. Verify the GitHub Pages build completed for the intended commit.
4. Open the deployed game and check for startup console errors.

## Refreshing changes

Use `Ctrl+R` after ordinary edits. If a cached asset remains, use `Ctrl+Shift+R`.
