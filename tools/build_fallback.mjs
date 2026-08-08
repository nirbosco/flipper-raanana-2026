#!/usr/bin/env node
/*
 * מחולל data/fallback.json — מריץ את אותו פרסר של הדפדפן (js/parser.js) על ה-xlsx.
 * שימוש:
 *   node tools/build_fallback.mjs             # מושך את הגיליון החי
 *   node tools/build_fallback.mjs file.xlsx   # קובץ מקומי
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { inflateRawSync } from 'node:zlib';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { buildModel, exportUrl } from '../js/parser.js';
import { CYCLES } from '../js/config.js';

function unzip(buf) {
  // מאתר את ה-End of Central Directory וקורא משם את רשימת הקבצים.
  let eocd = -1;
  for (let i = buf.length - 22; i >= 0; i--) {
    if (buf.readUInt32LE(i) === 0x06054b50) { eocd = i; break; }
  }
  if (eocd < 0) throw new Error('not a zip');
  const count = buf.readUInt16LE(eocd + 10);
  let off = buf.readUInt32LE(eocd + 16);
  const files = {};
  for (let i = 0; i < count; i++) {
    if (buf.readUInt32LE(off) !== 0x02014b50) throw new Error('bad central dir');
    const method = buf.readUInt16LE(off + 10);
    const csize = buf.readUInt32LE(off + 20);
    const nameLen = buf.readUInt16LE(off + 28);
    const extraLen = buf.readUInt16LE(off + 30);
    const commentLen = buf.readUInt16LE(off + 32);
    const localOff = buf.readUInt32LE(off + 42);
    const name = buf.toString('utf8', off + 46, off + 46 + nameLen);
    const lNameLen = buf.readUInt16LE(localOff + 26);
    const lExtraLen = buf.readUInt16LE(localOff + 28);
    const dataStart = localOff + 30 + lNameLen + lExtraLen;
    const raw = buf.subarray(dataStart, dataStart + csize);
    if (name.endsWith('.xml') || name.endsWith('.rels')) {
      files[name] = (method === 8 ? inflateRawSync(raw) : raw).toString('utf8');
    }
    off += 46 + nameLen + extraLen + commentLen;
  }
  return files;
}

// בונה fallback לכל מחזור: data/fallback-<id>.json
const only = process.argv[2] ? Number(process.argv[2]) : null;
const dir = join(dirname(fileURLToPath(import.meta.url)), '..', 'data');

for (const cycle of CYCLES) {
  if (only && cycle.id !== only) continue;
  const buf = Buffer.from(await (await fetch(exportUrl(cycle.sheetId))).arrayBuffer());
  const model = buildModel(unzip(buf));
  model.generatedAt = new Date().toISOString();
  model.cycleId = cycle.id;
  const dest = join(dir, `fallback-${cycle.id}.json`);
  writeFileSync(dest, JSON.stringify(model, null, 1), 'utf8');
  const acts = model.days.reduce((n, d) => n + d.activities.length, 0);
  console.log(`${cycle.label}: ${model.days.length} ימים, ${acts} פעילויות -> ${dest}`);
}
