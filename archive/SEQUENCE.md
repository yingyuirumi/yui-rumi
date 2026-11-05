# 發布順序索引（sequence.json）

> ⭐ **這份檔案的用途：換帳號時，照順序一篇一篇重發。**
> **文圖一樣、順序一樣，日期用重發當天。**
>
> 產生時間：2026-11-05　基準：IG 的發布順序

---

## 格式

`archive/snapshots/<日期>/sequence.json`

```json
{
  "seq": 137,                        // ⭐ 連載順序，重發照這個排
  "posted_on": "2026-11-05",         // 當時日期（參考用，重發不用）
  "permalink": "https://www.instagram.com/p/...",   // 公開連結
  "type": "IMAGE",                   // IMAGE / VIDEO / CAROUSEL_ALBUM
  "caption": "全文（含 hashtag）",    // ⭐ 直接拿來重發
  "image_file": "images/xxx.png",    // ⭐ 要重發的圖（repo 內相對路徑）
  "image_source": "repo_images | ig_cdn_recovered | ig_video_thumbnail",
  "image_sha256": "...",             // 從平台救回的才有
  "image_bytes": 123456,
  "kind": "video"                    // 有這個 → 原貼是影片
}
```

**⭐ 重發只需要三樣：`seq`（順序）、`image_file`（圖）、`caption`（文）。**
**⭐ 日期一律用重發當天。**

---

## 重發流程

```bash
# 1) 讀 sequence.json，按 seq 排序
python3 -c "
import json
seq = json.load(open('archive/snapshots/2026-11-05/sequence.json', encoding='utf-8'))
for s in sorted(seq, key=lambda x: x['seq']):
    print(s['seq'], s['image_file'])
"

# 2) 逐篇：image_file + caption 丟進 yui-publish 四平台發布
# 3) 每篇發完寫紀錄（新的一筆，日期是當天）
~/.hermes/scripts/yui-archive-autolog <slug> <platform> ok <ref>

# 4) 不要改文案、不要改圖 —— 原貼怎麼寫就怎麼發
```

---

## 2026-11-05 索引狀態

| 項目 | 數量 |
|---|---|
| 總篇數 | **137** |
| 有對應圖 | **137（100%）** |
| 圖來自 repo `images/` | 95 |
| 圖從平台救回 | 42 |

**`archive/recovered/`　42 個檔、26 MB**
這 42 個是圖庫裡已經沒有原件、只能從平台救回來的（其中 19 個是影片縮圖，代表原貼是影片）。

---

## 公開資訊邊界（重要）

**這個 repo 是公開的。archive 只放「外面本來就看得到的東西」：**

| 保留 | 刪除 |
|---|---|
| 貼文連結（permalink） | Meta CDN 的 `media_url`（含簽章參數） |
| 貼文全文 | 帳號的 `did:plc:...` 永久識別碼 |
| 發布時間 | 帳號內部數字 ID |
| 圖片檔名 / sha256 / 大小 | 本機路徑 |

**理由：** permalink、正文、時間本來就公開；CDN URL 和 DID 不是。

---

## 怎麼做的（可重跑）

```bash
# ① 抓四平台快照
# ② 去識別化（只留公開欄位）
python3 ~/.hermes/scripts/sanitize_archive.py [快照目錄]
# ③ IG 圖片 ↔ 本地圖庫配對
/home/ying/.venvs/hindsight/bin/python3 ~/.hermes/scripts/match_ig_images.py [快照目錄]
# ④ 沒配到的從平台 CDN 直接下載救回
/home/ying/.venvs/hindsight/bin/python3 ~/.hermes/scripts/recover_video_covers.py
```

**⚠️ 不要用「文字比對」去跨平台配對。**
IG 5 個 hashtag、X 2 個且砍句子、Threads 多一句 —— 實測 137 篇只有 44 篇對得上。
**IG 的貼文順序本身就是連載順序，用 IG 當基準就夠了。**
