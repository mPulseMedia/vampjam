# nudge

A phone you tap. Not tilt — tap: one short, sharp push in one of six directions,
read as a single discrete event, like a keystroke. Six directions, and behind
them three rooms you move through with those six.

    ▦  Calendar   September on graph paper. Left/right/up/down step one day;
                  toward/away zoom, ten notches out to a postage stamp and six
                  in to one line of text filling the phone.
    ≡  Article    Five screens of one magazine column. Up and down only, and
                  sideways says so out loud rather than doing nothing.
    ◈  Space      Twenty-two solids on a floor grid, walked. Up is the way out.

One button in the control band cycles them. Each keeps its own place.

## The files

    nudge.html        the markup, and nothing else
    nudge.css         every rule the experiment owns
    nudge_host.js     >>> every line that knows which site this lives in <<<
    nudge.js          the engine: detector, rooms, instruments, recorder
    nudge_notes.md    the build history, 177 to here
    nudge_test/       the regression battery, and how to run it

`nudge_host.js` loads first and declares one object, `NUDGE_HOST`. Nothing else
in the folder mentions the host by name. That is the seam.

## Moving it to a project of its own

1. Copy this folder wherever it is going. It has no build step and no
   dependencies; it is four files and a browser.
2. Edit `nudge_host.js`, and only that:
   - `back` — where the corner link goes, or `null` to hide it.
   - `release` — the version stamp in the corner. Keep it if the new project
     has a ship loop that writes one; drop it if not.
   - `store` — the localStorage prefix. Changing it RESETS the saved reverse
     switches and the last room, so change it deliberately.
   - `sync` — where recorded gestures are read from and parked. Set it to
     `null` and the Send button says there is nowhere to send; takes are still
     recorded and still held in the browser.
   - `watch` — the reload-on-change loop. Turn it off for anything public.
3. Point `nudge_test/nudge_open.mjs` (or `NUDGE_URL`) at the new address and
   run the battery.
4. In the old repo, delete `lab.html` — it is a redirect stub and the only
   thing left behind.

## What did NOT come across, and why

- **The prompt log.** The host keeps two identical files, one of them named for
  the lab, but neither is lab-only — they are twins, not a split. Separating a
  log that has never been separate is a decision, not a copy, so it is left for
  the move to make.
- **`lab_gestures.json`.** The recorded takes live in the host's repo and are
  fetched from it by URL. `NUDGE_HOST.sync` is the whole of that coupling.
- **The commit robot.** The host's launchd agent watches the host's folder and
  commits from `commit_msg.txt`. A new project needs its own, or none.

## Running it

Any static server over the folder ABOVE this one:

    python3 -m http.server 8901        # then /nudge/nudge.html

`file://` works too, except the reload-on-change loop, which turns itself off
there.
