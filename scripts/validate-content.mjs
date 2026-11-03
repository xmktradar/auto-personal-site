#!/usr/bin/env node
/** Lightweight contract check for content/ai-generated.json (no deps). */
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const path = join(root, "content", "ai-generated.json");

function fail(msg) {
  console.error("validate-content:", msg);
  process.exit(1);
}

let data;
try {
  data = JSON.parse(readFileSync(path, "utf8"));
} catch (e) {
  fail(`cannot parse ${path}: ${e.message}`);
}

if (!data || typeof data !== "object" || Array.isArray(data)) {
  fail("root must be an object");
}
if (typeof data.last_refreshed_hkt !== "string" || !data.last_refreshed_hkt.trim()) {
  fail("last_refreshed_hkt must be a non-empty string (HKT, e.g. 2026-11-03 21:38)");
}
if (!Array.isArray(data.items)) {
  fail("items must be an array");
}
for (let i = 0; i < data.items.length; i++) {
  const it = data.items[i];
  if (!it || typeof it !== "object") fail(`items[${i}] must be an object`);
  for (const key of ["id", "title", "body"]) {
    if (typeof it[key] !== "string" || !it[key].trim()) {
      fail(`items[${i}].${key} must be a non-empty string`);
    }
  }
  if (it.source != null && typeof it.source !== "string") {
    fail(`items[${i}].source must be a string when present`);
  }
}
if (data.note != null && typeof data.note !== "string") {
  fail("note must be a string when present");
}

console.log(`validate-content: ok (${data.items.length} items, refreshed ${data.last_refreshed_hkt})`);
