#!/usr/bin/env node
// Fill assets/template.html from a slots JSON file and print the widget HTML.
//
//   node .claude/skills/sql-sandbox/scripts/fill.mjs slots.json > sandbox.html
//
// slots.json shape:
//   {
//     "sr_summary":     "one sentence for screen readers",
//     "schema_summary": "tables and rows as fixed-width text (shown above the query box)",
//     "ddl_and_seed":   "CREATE TABLE ...; INSERT ...;   (SQLite dialect)",
//     "presets":        [ { "label": "Filter in ON", "sql": "SELECT ..." }, ... ]   (2 or more)
//   }
// Exits non-zero, printing nothing, if a slot is missing or a marker is left unfilled.
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const slotsPath = process.argv[2];
if (!slotsPath) {
  console.error("usage: node fill.mjs slots.json");
  process.exit(2);
}
const slots = JSON.parse(readFileSync(slotsPath, "utf8"));

const required = ["sr_summary", "schema_summary", "ddl_and_seed", "presets"];
const missing = required.filter((k) => !(k in slots));
if (missing.length) {
  console.error("missing slots:", missing.join(", "));
  process.exit(1);
}
const ok =
  Array.isArray(slots.presets) &&
  slots.presets.length >= 2 &&
  slots.presets.every((p) => typeof p.label === "string" && typeof p.sql === "string");
if (!ok) {
  console.error("presets must be an array of at least two {label, sql}");
  process.exit(1);
}

const text = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;");
const js = (v) => JSON.stringify(v).replace(/<\//g, "<\\/");

const here = dirname(fileURLToPath(import.meta.url));
let html = readFileSync(join(here, "..", "assets", "template.html"), "utf8");
const fill = (marker, value) => {
  html = html.replace(marker, () => value);
};
fill("{{SR_SUMMARY}}", text(slots.sr_summary));
fill("{{SCHEMA_SUMMARY}}", text(slots.schema_summary));
fill("{{DDL_AND_SEED}}", js(slots.ddl_and_seed));
fill("{{PRESETS}}", js(slots.presets));

const left = html.match(/\{\{[A-Z_]+\}\}/g);
if (left) {
  console.error("unfilled slots:", left.join(", "));
  process.exit(1);
}
process.stdout.write(html);
