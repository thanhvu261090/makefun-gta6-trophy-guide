// Leonida Trophy Guide — the program that hands the entry in (Node 22, stdlib only).
//
// The guide itself is the plain static site in app/: app/index.html opens in a
// desktop browser, works with the network off, and reads its 55 trophies from
// app/data/trophies.json and its roadmap from app/data/roadmap.json. This file
// only gathers the entry for the grader: it copies app/ and screenshots/ from
// beside this file into the output directory and writes output/dossier.json,
// the summary the judge reads, using the vendored make.fun library. The
// library file under vendor/ is the kit's copy and must stay unchanged — the
// scorer rebuilds the dossier with its own copy and compares the two byte for
// byte, so any edit there would fail the entry.
//
// Run it outside the grader with MAKEFUN_OUTPUT_DIR pointing at a folder:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
// It is deterministic: two runs write the same bytes.

import { cpSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

// The repository root is the folder this file sits in; the output folder is
// /output inside the grader, or MAKEFUN_OUTPUT_DIR when set (local runs).
const repoRoot = fileURLToPath(new URL('.', import.meta.url));
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

mkdirSync(outputDir, { recursive: true });
cpSync(join(repoRoot, 'app'), join(outputDir, 'app'), { recursive: true });
mkdirSync(join(outputDir, 'screenshots'), { recursive: true });
if (existsSync(join(repoRoot, 'screenshots'))) {
  cpSync(join(repoRoot, 'screenshots'), join(outputDir, 'screenshots'), { recursive: true });
}

// The caps mirror the scorer's own limits (at most 4 screenshots, each at
// most 256 KiB; app/ at most 993 files and 48 MiB), so an entry this program
// accepts is one the scorer will not refuse on size.
writeFileSync(
  join(outputDir, 'dossier.json'),
  buildDossier(outputDir, {
    text_max_bytes: 163840,
    screenshots: { max: 4, max_bytes: 262144 },
    app_max_files: 993,
    app_max_bytes: 50331648,
  }),
);
