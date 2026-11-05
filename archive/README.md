# 發布紀錄 Archive

> 目的：**帳號沒了也能全部重發。**
> 只要這個目錄 + `images/` + `videos/`，就能一篇一篇重建。

---

## 邊界鐵則：這個 repo 是公開的

**只放「外面本來就看得到的東西」。**

| ✅ 可以 | ❌ 不行 |
|---|---|
| 貼文連結（permalink） | Meta CDN 的 media URL（含簽章參數） |
| 貼文全文 | 帳號的平台永久識別碼 |
| 發布時間 | 帳號內部數字 ID |
| 圖片檔名 / sha256 / 大小 | 本機路徑（`/home/...`、`~/.hermes/...`） |
| | token、密碼、app password |

**draft、prompt、工作檔一律留在家裡 `~/.hermes/`，不進 repo。**

---

## 結構

```
archive/
├── SEQUENCE.md                 # 重發說明 + 格式
├── snapshots/<YYYY-MM-DD>/     # 全量快照（去識別化）
│   ├── sequence.json           # ⭐ 重發就靠這份
│   ├── yui_ig_archive.json
│   ├── yui_threads_archive.json
│   ├── yui_bsky_archive.json
│   ├── yui_x_archive.json
│   └── ig_image_match.json
├── recovered/                  # 圖庫已無原件、從平台救回的圖
└── posts/<date>-<slug>.json    # 逐篇紀錄（發布當下寫）
```

---

## 逐篇紀錄（`archive/posts/`）

**每次發布，每個平台寫一筆。**

```json
{
  "slug": "sakuya-arrives",
  "date": "2026-11-05",
  "kind": "image",
  "image": {
    "path": "images/yui_sakuya_arrives_20261105.png",
    "sha256": "32281c90...",
    "bytes": 2685186,
    "bsky_variant": {"path": "images/..._bsky.webp", "sha256": "...", "bytes": 1587194}
  },
  "text": {"ig": "全文", "threads": "全文", "bsky": "全文", "x": "全文"},
  "published": {
    "ig":      {"status": "ok", "url": "...", "id": "..."},
    "threads": {"status": "ok", "url": "...", "id": "..."},
    "bsky":    {"status": "ok", "rkey": "..."},
    "x":       {"status": "failed", "error": "403 Forbidden"}
  }
}
```

**鐵則：**
- **失敗也要記**（`status: failed` + 錯誤訊息），否則之後會重複發
- **`image.sha256` 必填**，才知道圖有沒有被換過
- **發布前先 `check` 一次**，確認這個 slug 沒發過、哪些平台還沒發

---

## 工具

```bash
~/.hermes/scripts/yui-archive-autolog <slug> <platform> <ok|failed> <ref> [error]
~/.hermes/scripts/archive-post list            # 每篇印 0000，四平台狀態
~/.hermes/scripts/archive-post check <slug>    # 看發過哪些、哪個失敗
~/.hermes/scripts/sanitize_archive.py [目錄]   # 去識別化
```

---

## 2026-11-05 首次快照

| 平台 | 篇數 |
|---|---|
| IG | 137（重發基準） |
| Threads | 148 |
| Bluesky | 182 |
| X | 144 |

**⭐ 為什麼用 IG 當重發基準：** 它一篇一定帶圖，圖文對應最可靠。
Bluesky 篇數最多是因為它最不容易被限流，不代表連載多發了幾篇，用它當基準反而多出來的配不到。

**跨平台文字比對不可靠**（IG 5 hashtag、X 2 個且砍句子、Threads 多一句），
實測 137 篇只有 44 篇對得上。**正解是發布當下就寫 archive，不是事後比對。**
