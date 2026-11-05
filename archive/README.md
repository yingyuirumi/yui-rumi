# 發布紀錄 Archive

> 目的：**帳號死掉也能全部還原。**
> 就算四個平台都掛了，只要有這個目錄 + `images/` + `videos/`，就能重建每一篇。

---

## 結構

```
archive/
├── snapshots/<YYYY-MM-DD>/     # 每次全量抓取的時間點快照
│   ├── yui_ig_archive.json
│   ├── yui_threads_archive.json
│   ├── yui_bsky_archive.json
│   ├── yui_x_archive.json
│   └── cross_platform_index.json
└── posts/<slug>.json           # 逐篇紀錄（發布當下就寫）
```

---

## 每篇的格式（`archive/posts/<slug>.json`）

```json
{
  "slug": "sakuya-arrives",
  "date": "2026-11-05",
  "kind": "image",
  "image": {
    "path": "images/yui_sakuya_arrives_20261105.png",
    "sha256": "32281c90...",
    "commit": "5db500b",
    "bytes": 2685186
  },
  "text": {
    "ig": "全文（含 5 hashtag）",
    "threads": "全文（0 hashtag）",
    "bsky": "全文（2 hashtag）",
    "x": "全文（2 hashtag）"
  },
  "published": {
    "ig":      {"id": "...", "url": "https://www.instagram.com/p/.../", "status": "ok"},
    "threads": {"id": "...", "url": "https://www.threads.com/...", "status": "ok"},
    "bsky":    {"rkey": "...", "status": "ok"},
    "x":       {"status": "failed", "error": "403 Forbidden"}
  }
}
```

**鐵則：**

- **失敗的也要記**（`status: "failed"` + 錯誤訊息），否則之後會重複發。
- **每次發布前先讀這份**，確認這個 slug 沒發過、哪些平台還沒發。
- `image.sha256` 必填，這樣才知道圖有沒有被換過。
- 卡片式社群圖放 `images/`、影片放 `videos/`，**都跟 archive 在同一個 repo**。

---

## 快照怎麼更新

```bash
# IG（token 在 ~/.hermes/secrets/insta/yui.token）
# Threads（token 在 ~/.hermes/threads_token）
# Bluesky（~/.hermes/bsky_app_password）
# X（xurl）
```

四個平台全量抓 → 存 `snapshots/<今天>/` → commit。

**為什麼要快照：** 平台不會永遠留著歷史。IG token 60 天會過期、帳號可能被鎖。
快照是「當時確定存在」的證據。

---

## 2026-11-05 首次快照

| 平台 | 篇數 | 時間範圍 |
|---|---|---|
| IG | 137 | 2026-06-23 ～ 11-05 |
| Threads | 148 | 2026-06-23 ～ 11-05 |
| Bluesky | 182 | 2026-06-22 ～ 11-05 |
| X | 144 | 2026-06-27 ～ 11-05 |

跨平台索引：137 篇中 **44 篇四平台全對上**、73 篇至少三平台、35 篇只有 IG。

⚠️ 對不上的原因是**每平台文字被改過**（IG 5 hashtag、X 2 個且會砍句子、Threads 有時多一句）。
正解是「發布當下就寫 archive」，不是事後用文字比對。
