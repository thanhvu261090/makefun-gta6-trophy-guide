# Leonida Trophy Guide — GTA VI, all 55 trophies

[![GTA 6 trophy guide](https://make.fun/badge/gta6-trophy-guide-01.svg)](https://make.fun/c/gta6-trophy-guide-01)
[![Rank](https://make.fun/badge/gta6-trophy-guide-01/thanhvu261090/makefun-gta6-trophy-guide/rank.svg)](https://make.fun/c/gta6-trophy-guide-01)
[![Reward](https://make.fun/badge/gta6-trophy-guide-01/thanhvu261090/makefun-gta6-trophy-guide/reward.svg)](https://make.fun/c/gta6-trophy-guide-01)

An offline guide and tracker for every one of Grand Theft Auto VI's 55 PlayStation 5 trophies — official names, descriptions and grades as PlayStation publishes them, a guide in our own words for each one with its sources named, a roadmap to the platinum, and a checklist that saves your progress in the browser.

## What it covers

- **All 55 trophies** — 1 platinum, 2 gold, 6 silver, 46 bronze; 28 hidden until earned. All single-player; there are no online trophies.
- **A guide for each trophy** — what to do, where and how, and when it can be missed — written in our own words, with the source of each fact linked beside it (GTA Base, Output Lag, KeenGamer). Where a trophy's exact steps were still unconfirmed at launch, the guide says so instead of guessing.
- **Roadmap to the platinum** — the order to earn them in, by story chapter, then the 100% checklist, then the stranger strands and clean-up. About 200 hours, one playthrough.
- **The one missable trophy flagged** — Positive Mental Attitude (Lucia's balcony meditation in Chapter 1). Everything else stays available after the story.
- **Tracker** — tick trophies off, progress saved in localStorage, export to a file and import it back. Filters by kind (story, missable, collectibles, activities, online), by grade, by earned/not earned, and full-text search.
- **Spoiler setting** — hides the names and descriptions of story trophies until you earn them.

## Run it

Serve `app/` with any static server and open `index.html`, or run `node serve.ts` and open http://localhost:8080. It works with the network off — every file it loads is under `app/`.

## Files

- `app/index.html`, `app/app.js`, `app/style.css` — the guide itself.
- `app/data/trophies.json` — the 55 trophies: official name, description, grade, hidden flag, kind, missable flag, count where PlayStation tracks one, guide and sources.
- `app/data/roadmap.json` — the eight roadmap stages.
- `main.ts` — the entry program (Node 22, stdlib only): copies `app/` and `screenshots/` to the output directory and writes `dossier.json` with the vendored make.fun library.
- `screenshots/` — real renders of the guide in a desktop browser.

## Sources

Trophy names, descriptions and grades as published on PlayStation, listed by Exophase and PSNProfiles (reported by Push Square, 18 November 2026). Guide facts from [GTA Base](https://www.gtabase.com/articles/gta-6/gta-6-achievements-trophies-list-ps5-xbox-series), [Output Lag](https://outputlag.com/guides/gta-6-trophy-list/) and [KeenGamer](https://www.keengamer.com/articles/guides/gta-6-trophy-guide-platinum-roadmap-all-55-trophies/), cited per trophy in `app/data/trophies.json`.

An unofficial fan guide. Not affiliated with Rockstar Games, Sony or PlayStation. No Rockstar logo, artwork or game imagery is used.

## License

MIT — see [LICENSE](LICENSE).
