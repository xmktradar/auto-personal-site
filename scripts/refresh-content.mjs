#!/usr/bin/env node
/**
 * Content refresh stub — no external AI calls.
 * Writes a timestamp into content/ai-generated.json so the schedule proves the pipeline runs.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const path = join(root, "content", "ai-generated.json");
const data = JSON.parse(readFileSync(path, "utf8"));
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
  "AI 內容佔位。之後把生成結果寫入這裡；現階段唔呼叫任何外部 AI API。";
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
data.items[0].body = `自動 refresh 已跑（stub）。上次：${data.last_refreshed_hkt} HKT。之後喺呢度接入 AI 生成。`;
writeFileSync(path, JSON.stringify(data, null, 2) + "\n");
console.log("refreshed", data.last_refreshed_hkt);
