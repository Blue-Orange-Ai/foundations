#!/usr/bin/env node
// Downloads a public glTF sample asset into public/model.glb so the dev harness
// (npm start) has something to render. Binaries are intentionally NOT committed
// to the repo (see .gitignore) — run this once after cloning.
//
// Override the model:  MODEL=DamagedHelmet npm run fetch-demo-model
//
// The default (ToyCar) matches TOYCAR_MANIFEST, so component highlighting,
// per-component visibility and click-selection all work. DamagedHelmet is a
// good single-part orientation-only demo.

import { createWriteStream } from 'node:fs';
import { mkdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Readable } from 'node:stream';
import { pipeline } from 'node:stream/promises';

const MODEL = process.env.MODEL || 'ToyCar';
const BASE = 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models';
const url = `${BASE}/${MODEL}/glTF-Binary/${MODEL}.glb`;

const __dirname = dirname(fileURLToPath(import.meta.url));
const out = resolve(__dirname, '..', 'public', 'model.glb');

console.log(`Fetching ${MODEL} → public/model.glb`);
console.log(`  ${url}`);

const res = await fetch(url);
if (!res.ok || !res.body) {
	console.error(`Download failed: HTTP ${res.status}`);
	process.exit(1);
}

await mkdir(dirname(out), { recursive: true });
await pipeline(Readable.fromWeb(res.body), createWriteStream(out));

console.log('Done. Run `npm start` to view it.');
if (MODEL !== 'ToyCar') {
	console.log(
		'\nNote: only ToyCar matches the demo manifest. For another model, update the\n' +
			'manifest in src/development/workspace to match its node names (see README).',
	);
}
