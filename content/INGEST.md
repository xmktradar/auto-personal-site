# Ingest contract · `content/ai-generated.json`

**SuperGrok（或任何 AI）只負責產出內容。**  
把符合下面 schema 的 JSON 寫入本檔（commit 到 `main`，或等 Actions 嘅 Refresh 寫入）。  
**GitHub Actions** 負責：validate → build → GitHub Pages deploy。

## Schema（必填）

```json
{
  "note": "可選說明字串",
  "last_refreshed_hkt": "2026-11-03 21:38",
  "items": [
    {
      "id": "unique-id",
      "title": "標題",
      "body": "正文",
      "source": "supergrok | pipeline-stub | …"
    }
  ]
}
```

| 欄位 | 必填 | 說明 |
|------|------|------|
| `last_refreshed_hkt` | ✅ | Asia/Hong_Kong，建議 `YYYY-MM-DD HH:mm` |
| `items` | ✅ | 陣列（可空，站會顯示「未有內容」） |
| `items[].id` | ✅ | 穩定 id |
| `items[].title` | ✅ | 標題 |
| `items[].body` | ✅ | 正文 |
| `items[].source` | 可選 | 來源標籤 |
| `note` | 可選 | 人類備註 |

正式 machine-readable 定義：`ai-generated.schema.json`。本地／CI：`npm run validate`。

## 兩條入料路徑

1. **Actions Refresh（預設）**  
   每日 cron／手動跑 `Refresh content` → stub（或將來用 repo secret `XAI_API_KEY`）寫 JSON → commit → **Deploy site** 用 `workflow_run` 自動跟上。

2. **SuperGrok／人手／@GitHub 直接 commit**  
   只改 `content/ai-generated.json`（遵守 schema）push 去 `main` → **Deploy site** 由 `push` 觸發。

唔使人手改 `public/` HTML；build 會注入內容。
