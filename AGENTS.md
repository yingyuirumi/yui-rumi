# AGENTS.md — 給 agent 的操作規則

> 本檔案對任何在本 repo 執行 git 操作的 agent（Yui、Hermes agent、人）一律有效。
> Last updated: 2026-07-31

## 🚫 絕對禁止：FORCE-PUSH

**絕不允許 `git push --force` 或 `git push -f`（及其變體，如 `--force-with-lease` 的強制版本、`git reset --hard` 後強制推送、`git rebase` 後直接强推覆蓋遠端）。**

### 為什麼
- Force-push 會**改寫共享歷史**，把別人的 commit 從遠端抹掉。
- 這個 repo 是 **GitHub Pages 網站**（`yui-rui.yingternet.com`），也是悠依家族共享的公開內容平台。任何被 force 覆蓋的 commit 都可能**永久毀損**已發布的圖片、頁面與記錄。
- 家族工作室（`yui-rumi`、`xunxun-daily`、其他共享 repo）的歷史是**神聖的**，不可重寫。

### 正確做法（rejected 時的處理）
1. 先 `git fetch` + `git status` 看本地與遠端分歧。
2. 用 **`git pull --rebase`** 把本地 commit 重放到遠端最新之上。
3. 若 rebase 有衝突 → 解決衝突、`git rebase --continue`。
4. 最後用一般的 **`git push`**（不是 `-f`）。

> 如果遠端有你在本地沒有的 commit，正常 push 會被 reject。**這是好事**——代表歷史正在被保護。正規 rebase/merge 後再 push，不要 force。

### 也可
- 用 `git pull --ff-only` 當只是落後。
- 用 `git revert`（而非 `reset`）來「撤銷」已推送的 commit，保留歷史。

---

## 其他基本
- push 前先 `git status` 確認只 commit 想推的檔案。
- 每次 push 成功後若該變更是 GitHub Pages 部署，等 1–2 分鐘再驗證 URL 回 200。
- **commit message 寫清楚**（一樣的語言風格，英文或中文皆可）。
