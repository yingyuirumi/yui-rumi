# 發布順序索引（sequence.json）

> ⭐ **這份檔案的用途：重發。**
> 帳號若死了重建，照 `seq` 由小到大重發 —— **文圖一樣、順序一樣，日期用重發當天。**
>
> 產生時間：2026-11-05　基準：IG 的發布順序（連載順序以 IG 為準）

---

## 格式

`archive/snapshots/<日期>/sequence.json`

```json
{
  "seq": 137,                         // ⭐ 連載順序，重發照這個排
  "posted_on": "2026-11-05",          // 當時日期（參考用，重發不用）
  "ig": {"id": "...", "url": "...", "type": "IMAGE"},
  "caption": "全文（含 hashtag）",     // ⭐ 直接拿來重發
  "image_file": "images/xxx.png",     // ⭐ 要重發的圖（路徑相對 repo）
  "image_source": "repo_images | ig_cdn_recovered | ig_video_thumbnail",
  "image_sha256": "...",              // 只有 recovered 的才有
  "kind": "video"                     // 有這個代表原貼是影片
}
```

**⭐ 重發時只需要三樣：`seq`（順序）、`image_file`（圖）、`caption`（文）。**
**⭐ 日期一律用重發當天。**

---

## 2026-11-05 索引狀態

| 項目 | 數量 |
|---|---|
| 總篇數 | 137 |
| 有對應圖 | **137（100%）** |
| 圖來自 repo `images/` | 95 |
| 圖從 IG CDN 救回 | 23 |
| 影片縮圖（當封面用） | 19 |

**`archive/recovered/`　42 個檔、26 MB** —— 這 42 個是圖庫裡已經沒有原件、只能從 IG 救回來的。

---

## 怎麼做的（可重跑）

```bash
# ① 抓四平台快照 → archive/snapshots/<日期>/
# ② IG 圖片 ↔ 本地圖庫配對（32×32 指紋 + 比例過濾）
/home/ying/.venvs/hindsight/bin/python3 ~/.hermes/scripts/match_ig_images.py [快照目錄]
# ③ 沒配到的從 IG CDN 直接下載救回
/home/ying/.venvs/hindsight/bin/python3 ~/.hermes/scripts/recover_video_covers.py
```

**⚠️ 不要用「文字比對」去跨平台配對** —— IG 5 個 hashtag、X 2 個且砍句子、Threads 多一句，
實測 137 篇只有 44 篇對得上。**IG 的貼文順序本身就是連載順序，用 IG 當基準就夠了。**

---

## 重發 SOP（帳號重建時）

1. 讀 `sequence.json`，按 `seq` 排序
2. 逐篇：`image_file` + `caption` 丟進 `yui-publish` 四平台發布
3. 每篇發完立刻 `yui-archive-autolog <slug> <platform> ok <ref>` —— **新的一筆，日期是當天**
4. **不要改文案、不要改圖** —— 原貼怎麼寫就怎麼發
