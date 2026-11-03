#!/usr/bin/env node
/**
 * Content refresh — SuperGrok / xAI optional later; stub by default.
 * Writes content/ai-generated.json matching the ingest contract (see content/INGEST.md).
 * No spend / no live API call until wiring is explicit.
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const path = join(root, "content", "ai-generated.json");

const apiKey = process.env.XAI_API_KEY || process.env.GROK_API_KEY || "";
if (apiKey) {
  console.log(
    "refresh: API key secret is present, but live xAI call is not wired yet — writing stub payload."
  );
} else {
  console.log("refresh: no XAI_API_KEY/GROK_API_KEY — stub mode.");
}

const data = existsSync(path)
  ? JSON.parse(readFileSync(path, "utf8"))
  : { note: "", last_refreshed_hkt: "", items: [] };

const now = new Date();
const hkt = new Intl.DateTimeFormat("en-CA", {
  timeZone: "Asia/Hong_Kong",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
})
  .formatToParts(now)
  .reduce((a, p) => ((a[p.type] = p.value), a), {});

data.last_refreshed_hkt = `${hkt.year}-${hkt.month}-${hkt.day} ${hkt.hour}:${hkt.minute}`;
data.note =
  "AI 內容槽。SuperGrok／外部 AI 只負責產出 JSON；GitHub Actions 負責 ingest／build／Pages。現階段 stub，唔打外部 API。";

if (!Array.isArray(data.items) || data.items.length === 0) {
  data.items = [
    {
      id: "stub-1",
      title: "佔位標題",
      body: "呢度之後會放自動生成嘅短文／摘要。",
      source: "pipeline-stub",
    },
  ];
}

data.items[0] = {
  ...data.items[0],
  id: data.items[0].id || "stub-1",
  title: data.items[0].title || "佔位標題",
  body: `自動 refresh 已跑（stub）。上次：${data.last_refreshed_hkt} HKT。之後由 SuperGrok／Actions 寫入真內容。`,
  source: data.items[0].source || "pipeline-stub",
};

writeFileSync(path, JSON.stringify(data, null, 2) + "\n");
console.log("refreshed", data.last_refreshed_hkt);
