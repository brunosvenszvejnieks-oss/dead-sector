# DEAD SECTOR — Development Build

This repository contains the direct-source version of DEAD SECTOR. The browser loads the checked-in game files directly; there is no runtime source patching.

## Runtime structure

- `index.html` — menus, HUD, overlays, and script loading order
- `style.css` — complete visual layer, including PC and responsive rules
- `maps.js` — immutable level definitions and fresh map-instance creation
- `audio.js` — synthesized sound engine
- `mobile.js` — touch detection, orientation gate, and virtual controls
- `pc-ui.js` — PC-only cursor and interface helpers
- `game.js` — stateful game loop, combat, UI synchronization, and rendering
- `src/config.js` — weapon and enemy tuning values
- `src/math.js` — shared geometry and interpolation helpers
- `src/navigation.js` — pathfinding and line-of-sight checks
- `src/projectiles.js` — projectile paths, travel, and ricochet geometry
- `tests/` — gameplay contracts and focused unit tests

The stateful runtime deliberately remains together. Pure and independently testable systems are separate modules, while initialization order and shared game state stay explicit in `game.js`.

## Run locally

Do not double-click `index.html` for development. Serve the folder over localhost.

Install the development dependency and run the included server:

    pnpm install
    pnpm run dev

Then open `http://localhost:8080`.

## Validation expectations

Before publishing a change:

1. Check JavaScript syntax for every script.
2. Confirm `index.html` loads source files directly.
3. Verify the GitHub Pages build completed for the intended commit.
4. Open the deployed game and check for startup console errors.

After installing the pinned development dependency with `pnpm install`, the routine commands are:

    pnpm run check
    pnpm run format:check

`pnpm run check` validates every JavaScript file and runs the automated regression suite.

## Refreshing changes

Use `Ctrl+R` after ordinary edits. If a cached asset remains, use `Ctrl+Shift+R`.
