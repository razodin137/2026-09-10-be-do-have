# Be · Do · Have

A small Electron daily-companion board built on one verse:
*"Be fruitful, and multiply … and have dominion." — Genesis 1:28*

Three columns for one day at a time:

- **BE** — who you are today (one word, from a chip palette: fruitful,
  present, steady, kind, courageous, grateful, faithful, wise, generous)
- **DO** — what flows from it (a plain list)
- **HAVE** — what you count at the end of the day

## How it works

- Navigate days with the arrows (click the date to return to today)
- Each day's data is stored separately in `localStorage` (`bedo:v1:YYYY-MM-DD`)
- Electron shell with contextIsolation on, nodeIntegration off, strict CSP
  (`default-src 'self'`) — renderer is plain HTML/CSS/JS, no framework

## Run

    npm install
    npm start

Also live at: https://razodin137.github.io/2026-09-10-be-do-have/
(the renderer runs fine in a plain browser too)