# 自動更新個人站 · 骨架

一個「主人幾乎唔使動手」嘅靜態個人網站起步骨架：全部自動化放喺 **同一個 GitHub repo**，用 **GitHub Actions** 負責內容 refresh（佔位）、建置、部署。

## 做得到咩

- 靜態站（純 HTML／CSS + 細 Node build），每次 `main` push 自動建置並部署到 **GitHub Pages**
- 每日定時（同可手動）跑 **AI 內容 pipeline 佔位**：只更新 `content/ai-generated.json` 時間戳同 stub 文案，**未呼叫任何外部 AI API**
- Refresh commit 之後會再觸發 Deploy，站會自己換內容

## 主人仍然要人手做

1. **發帖去 X（Twitter）**
2. **發 YouTube Shorts**

除此之外，內容 refresh／建置／上線都交畀 Actions。

## 檔案重點

| 路徑 | 用途 |
|------|------|
| `public/` | 靜態模板（HTML／CSS） |
| `content/ai-generated.json` | AI 內容槽；之後生成結果寫呢度 |
| `scripts/refresh-content.mjs` | Refresh stub（唔打外部 AI） |
| `scripts/build.mjs` | 把 stub 內容注入 HTML → `_site/` |
| `.github/workflows/deploy.yml` | Push／手動：建置 + Pages 部署 |
| `.github/workflows/refresh-content.yml` | 每日／手動：refresh → commit → 觸發部署 |

## 一次過設定

1. Fork 或者用呢個 repo（已喺 GitHub）
2. **Settings → Pages → Source** 揀 **GitHub Actions**
3. 確認 Actions 已開（Allow all actions）
4. 第一次：Actions 撳 **Deploy site** → Run workflow；或者 push 任何改動
5. （可選）Actions 撳 **Refresh content** 試定時 pipeline
6. 之後要接入真 AI：只改 `scripts/refresh-content.mjs`，把結果寫入 `content/ai-generated.json`，仍然唔使人手改頁面

## 唔包喺呢個骨架

- 唔會代你發 X／YouTube Shorts
- 而家唔呼叫 OpenAI／Grok／其他 AI API（只有結構）
- 同 Crowd Tape／Postiz／Render 其他 repo **無關**，獨立 repo

## 本地試

```bash
npm run refresh
npm run build
# 打開 _site/index.html
```
