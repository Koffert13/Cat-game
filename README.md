# Paws & Parquet

Two cats. One apartment. Ten small adventures.

A browser puzzle platformer built with Phaser 3. Switch between **Nässla**, a nimble grey kitten, and **Maliketh**, a round tabby with a weakness for bagels. Both cats must cooperate to finish each room. Every sprite and room is pixel art drawn in JavaScript; there are no external image assets.

## Play locally

Use Node.js 24, or another supported version satisfying `>=22.12.0`.

```sh
npm ci
npm run dev
```

Open the local address printed by Vite. To run the production build locally:

```sh
npm run build
npm run preview
```

The build is written to `dist/`. Relative asset URLs allow it to run under the GitHub Pages `/Cat-game/` project path as well as at a domain root. No application server, API keys, or account is required.

## Controls

| Action | Keyboard | Touch |
| --- | --- | --- |
| Move | Left/right arrows or A/D | Left/right buttons |
| Jump or climb | Space, W, or up arrow | Jump button |
| Boop, push, groom, or meow | E | ACT button |
| Switch cats | Q or Tab | Switch button |
| Restart the current room | R | Restart button below the game |

Hold jump beside a striped scratching post to climb with Nässla. Hold ACT/E while moving to push with Maliketh. The touch buttons support moving and jumping simultaneously. Opening the room selector or help pauses the game.

## How the apartment works

- **Nässla** jumps higher, climbs scratching posts, and boops little objects off shelves to activate the bell circuit.
- **Maliketh** pushes a crate into its marked socket and holds the brass pressure plate. Eating a bagel gives him a temporary strength and speed boost, allowing him to push iron crates. Acting beside Nässla grooms her, temporarily increasing her jump and speed.
- Once the bell circuit and crate are ready, leave Maliketh on the plate and switch to Nässla. Cross the opened gate, then hold ACT/E for three seconds to meow for a human to wedge the door open. Bring Maliketh through to finish.
- Patrolling robot vacuums send a bumped cat back to the welcome rug while preserving completed puzzle actions. There is no lives limit; the room can also be restarted at any time.
- Ten rooms introduce higher shelves, climbing, grooming, bagel-powered pushing, multiple objects, and vacuum patrols before combining those skills in the final rooms.

The room selector unlocks the next room after a clear and allows completed rooms to be replayed. Progress, the selected room, and sound preference are saved in this browser's `localStorage`. Different browsers and origins have separate saves. If storage is unavailable, play still works and the page reports that progress lasts for the current visit.

## Verification

```sh
npm test
```

The level-completion suite starts each level from its initial state and feeds movement, jump, action, and switch inputs into the **same deterministic simulation used by the Phaser game**. The solver follows authored landing waypoints, but cannot teleport, set puzzle flags, or mark a room complete. Each successful input recording is replayed from a second fresh state. Assertions check booped objects, actual crate movement, pressure-plate use, the three-second meow, both cats reaching the exit, and required grooming or bagel consumption. This verifies an executable solution to every included level; it is not an exhaustive search of every possible player action.

Run the browser smoke test while a development or preview server is running:

```sh
npx playwright install chromium
npm run dev
# In a second terminal:
npm run test:browser
```

The default test URL is `http://127.0.0.1:5173`. For a preview server on port 4173, use `BASE_URL=http://127.0.0.1:4173 npm run test:browser`. The test uses `CHROMIUM_PATH` when supplied, otherwise an available `/usr/bin/chromium`, with Playwright's installed Chromium as the fallback. On Linux machines missing browser libraries, run `npx playwright install --with-deps chromium` with the appropriate system permissions.

Browser checks cover a real Phaser canvas, keyboard movement/jumping/switching, modal pause, restart, level locks, storage restoration and corruption recovery, and simultaneous touch controls in Android-emulated Chromium. Landscape checks keep the entire room and touch controls inside a small phone viewport. A separate real-keyboard playthrough completes room one, verifies its saved unlock, advances to room two, and reloads the save. Emulation is useful coverage but does not replace testing on a physical Android device. Screenshots are written to `/tmp/cat-game-desktop.png` and `/tmp/cat-game-mobile.png`.

## GitHub Pages

[The deployment workflow](.github/workflows/pages.yml) runs on pushes to `main` and can be started manually. Its build job installs locked dependencies, runs the level tests, builds `dist/`, and runs desktop and touch smoke tests against that production build. Only a successful build is passed to the separate Pages deployment job. Action revisions are pinned to verified release commits.

**The deployment workflow is prepared, but the live site still requires Pages to be enabled.** GitHub reports `has_pages: false`. Network access to the GitHub API works, but the connected integration returns `403 Resource not accessible by integration` for the Pages API. Repository access and Git pushes work; the integration does not have the Pages access needed to finish publishing. A successful Git push does not establish that Pages is enabled.

If Pages is not enabled yet, a repository administrator or maintainer can finish setup:

1. Open [Settings → Pages](https://github.com/Koffert13/Cat-game/settings/pages).
2. Under **Build and deployment → Source**, select **GitHub Actions**.
3. Open [Actions → Test and deploy to GitHub Pages](https://github.com/Koffert13/Cat-game/actions/workflows/pages.yml), select **Run workflow**, and run it on `main`.
4. Wait for both jobs to pass, then use the URL reported by the deployment job or the **Visit site** link in Pages settings.

The expected default address is `https://koffert13.github.io/Cat-game/`; treat it as the target address until a successful deployment and a live browser check confirm it. Future pushes to `main` rebuild and redeploy automatically once Pages is enabled.

## Project map

| File | Responsibility |
| --- | --- |
| `src/simulation.js` | Fixed-step movement, collisions, cat abilities, puzzle state, and victory rules |
| `src/levels.js` | Room layouts, puzzle objects, patrols, and solver landing waypoints |
| `src/main.js` | Phaser scene, input, interface, sound, and progression |
| `src/art.js` | Procedural pixel sprites and apartment backgrounds |
| `src/progress.js` | Defensive browser-save loading and writing |
| `tests/solver.js` | Input-only level solution recording |
| `tests/levels.test.js` | Per-level completion and independent replay assertions |
| `tests/browser-smoke.js` | Desktop and touch browser interaction checks |
| `tests/browser-completion.js` | Real keyboard completion, saved unlock, next room, and reload |
