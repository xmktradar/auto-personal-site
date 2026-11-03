#!/usr/bin/env node
/** Copy static site + inject AI stub content into _site/ */
import { readFileSync, writeFileSync, mkdirSync, cpSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const out = join(root, "_site");
mkdirSync(out, { recursive: true });
cpSync(join(root, "public"), out, { recursive: true });
const ai = JSON.parse(readFileSync(join(root, "content", "ai-generated.json"), "utf8"));
let html = readFileSync(join(root, "public", "index.html"), "utf8");
const cards = (ai.items || [])
  .map(
    (it) =>
      `<article class="card"><h2>${escapeHtml(it.title)}</h2><p>${escapeHtml(it.body)}</p><p class="meta">${escapeHtml(it.source || "")}</p></article>`
  )
  .join("\n");
html = html
  .replace("<!-- AI_CONTENT -->", cards || "<p>未有內容</p>")
  .replace("<!-- LAST_REFRESH -->", escapeHtml(ai.last_refreshed_hkt || "尚未 refresh"));
writeFileSync(join(out, "index.html"), html);
writeFileSync(join(out, "ai-generated.json"), JSON.stringify(ai, null, 2) + "\n");
console.log("built _site/");

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
