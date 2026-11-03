# 自動更新個人站 · SuperGrok → GitHub Actions

主人確認（2026-11-03）：**留「SuperGrok 出料 → GitHub Actions 包晒其他步驟」**；人手只 **debug Actions**，外加 **發 X** 同 **YouTube Shorts**。

呢個 repo **只做個人站骨架**，同 Crowd Tape 主站／Postiz／Render **無關**，唔會改佢哋。

## 分工（記住呢句）

| 角色 | 做咩 |
|------|------|
| **SuperGrok／任何 AI** | 只產出內容 → 寫入 `content/ai-generated.json`（見 ingest contract） |
| **GitHub Actions** | ingest／validate／build／GitHub Pages deploy（定時 refresh + 每次 main 變更） |
| **主人（Tim）** | ① debug 失敗嘅 Actions ② 人手發 **X** ③ 人手發 **YouTube Shorts** |

English: AI produces JSON only; Actions owns refresh, build, Pages; humans only debug failures + post X/Shorts.

## Pipeline

```
SuperGrok / stub refresh
        │  writes content/ai-generated.json
        ▼
 Refresh content (Actions) ──commit──► main
        │
        │  workflow_run (success)  ← 唔靠 GITHUB_TOKEN push 再觸發
        ▼
 Deploy site (validate → build → Pages)
```

**點解用 `workflow_run`：** Actions 預設 `GITHUB_TOKEN` push **唔會**再觸發其他 workflow。所以 Refresh 成功後由 Deploy 聽 `workflow_run`，唔使另外整 PAT。人手／外部 bot 用正常 token push `main` 仍然會直接觸發 Deploy。

（可選進階：若要 refresh 嘅 `git push` 都用 `push` 事件觸發 Deploy，可加 repo secret `GH_TOKEN`／PAT with `workflow` scope——而家**唔需要**。）

## 檔案重點

| 路徑 | 用途 |
|------|------|
| `content/ai-generated.json` | AI 內容槽（ingest 目標） |
| `content/INGEST.md` | 粵語／英文 ingest contract |
| `content/ai-generated.schema.json` | JSON Schema |
| `scripts/refresh-content.mjs` | Refresh stub（有 `XAI_API_KEY`／`GROK_API_KEY` 亦暫未打 API） |
| `scripts/validate-content.mjs` | 合約檢查 |
| `scripts/build.mjs` | 注入 HTML → `_site/` |
| `.github/workflows/refresh-content.yml` | 每日／手動 refresh → commit |
| `.github/workflows/deploy.yml` | push／手動／`workflow_run` → Pages |

## 一次過設定

1. **Settings → Pages → Source** = **GitHub Actions**（已開就唔使改）
2. Actions 允許跑 workflow
3. 試：**Actions → Refresh content → Run workflow**；成功後應自動出現 **Deploy site**（triggered by workflow_run）
4. 或者：**Deploy site → Run workflow** 手動驗證綠燈
5. 站址（而家）：https://thecrowdtape.com/auto-personal-site/ （視 Pages／自訂域設定）

### 可選 secrets（而家唔強制）

| Secret | 用途 |
|--------|------|
| `XAI_API_KEY` 或 `GROK_API_KEY` | 將來 Refresh 打真 API；未 wiring 前即使有 key 都只寫 stub |
| `GH_TOKEN`（可選） | 只有你想改用 PAT push 觸發 workflow 先要 |

## 主人仍然要人手做

1. **Debug** 紅燈 Actions（唔使日常改 HTML）
2. **發帖去 X（Twitter）**
3. **發 YouTube Shorts**

## 本地試

```bash
npm run refresh
npm run validate
npm run build
# 打開 _site/index.html
```

## 唔包

- 唔代發 X／YouTube Shorts  
- 而家唔呼叫 xAI／其他 AI API（只有 stub + contract）  
- 唔動 Crowd Tape 主站、Postiz、Render  
